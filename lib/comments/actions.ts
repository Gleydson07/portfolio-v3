"use server";

import { getIpHash } from "@/lib/comments/ip";
import { notifyModeration } from "@/lib/email/notify-moderation";
import { isRateLimited } from "@/lib/comments/rate-limit";
import { sanitizeCommentBody } from "@/lib/comments/sanitize";
import { submitCommentSchema } from "@/lib/comments/validation";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Comment } from "@/lib/comments/types";

export type SubmitCommentState = {
  ok: boolean;
  message: string;
};

export async function submitComment(
  _prevState: SubmitCommentState,
  formData: FormData
): Promise<SubmitCommentState> {
  if (!isSupabaseConfigured) {
    return { ok: false, message: "Comentários indisponíveis no momento." };
  }

  const parsed = submitCommentSchema.safeParse({
    postSlug: formData.get("postSlug"),
    postTitle: formData.get("postTitle"),
    authorName: formData.get("authorName") || undefined,
    body: formData.get("body"),
    website: formData.get("website") || "",
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Dados inválidos.";
    return { ok: false, message: firstError };
  }

  if (parsed.data.website?.trim()) {
    return { ok: true, message: "Recebido! Seu comentário será exibido após curadoria." };
  }

  const ipHash = await getIpHash();
  if (await isRateLimited(ipHash)) {
    return { ok: false, message: "Limite de comentários atingido. Tente novamente mais tarde." };
  }

  const body = sanitizeCommentBody(parsed.data.body);
  if (body.length < 3) {
    return { ok: false, message: "Comentário muito curto." };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false, message: "Comentários indisponíveis no momento." };
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_slug: parsed.data.postSlug,
      post_title: parsed.data.postTitle,
      author_name: parsed.data.authorName,
      body,
      status: "pending",
      ip_hash: ipHash,
    })
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, message: "Não foi possível enviar o comentário." };
  }

  const comment = data as Comment;
  const notification = await notifyModeration(comment);

  await supabase
    .from("comments")
    .update({
      notification_sent_at: notification.sent ? new Date().toISOString() : null,
      notification_error: notification.sent ? null : notification.error ?? "Erro desconhecido",
    })
    .eq("id", comment.id);

  return {
    ok: true,
    message: "Recebido! Seu comentário será exibido após curadoria.",
  };
}
