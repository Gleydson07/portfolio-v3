import { revalidatePath } from "next/cache";
import type { Comment, CommentStatus } from "@/lib/comments/types";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type ModerationResult =
  | { ok: true; comment: Comment; alreadyProcessed?: boolean }
  | { ok: false; error: string };

async function getCommentById(id: string): Promise<Comment | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase.from("comments").select("*").eq("id", id).maybeSingle();

  if (error || !data) return null;
  return data as Comment;
}

export async function approveComment(
  commentId: string,
  moderatedBy: string
): Promise<ModerationResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false, error: "Supabase não configurado." };
  }

  const existing = await getCommentById(commentId);
  if (!existing) {
    return { ok: false, error: "Comentário não encontrado." };
  }

  if (existing.status === "approved") {
    return { ok: true, comment: existing, alreadyProcessed: true };
  }

  if (existing.status !== "pending" && existing.status !== "rejected") {
    return { ok: false, error: "Status do comentário não permite aprovação." };
  }

  const approvedAt = new Date().toISOString();

  const { data, error } = await supabase
    .from("comments")
    .update({
      status: "approved",
      approved_at: approvedAt,
      rejected_at: null,
      rejection_reason: null,
      moderated_by: moderatedBy,
    })
    .eq("id", commentId)
    .in("status", ["pending", "rejected"])
    .select("*")
    .maybeSingle();

  if (error || !data) {
    return { ok: false, error: "Não foi possível aprovar o comentário." };
  }

  revalidatePath(`/blog/${data.post_slug}`);

  return { ok: true, comment: data as Comment };
}

export async function rejectComment(
  commentId: string,
  reason: string,
  moderatedBy: string
): Promise<ModerationResult> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false, error: "Supabase não configurado." };
  }

  const trimmedReason = reason.trim();
  if (trimmedReason.length < 3) {
    return { ok: false, error: "Motivo da rejeição é obrigatório." };
  }

  const existing = await getCommentById(commentId);
  if (!existing) {
    return { ok: false, error: "Comentário não encontrado." };
  }

  if (existing.status === "rejected") {
    return { ok: true, comment: existing, alreadyProcessed: true };
  }

  if (existing.status !== "pending" && existing.status !== "approved") {
    return { ok: false, error: "Status do comentário não permite rejeição." };
  }

  const rejectedAt = new Date().toISOString();
  const wasApproved = existing.status === "approved";

  const { data, error } = await supabase
    .from("comments")
    .update({
      status: "rejected",
      rejected_at: rejectedAt,
      rejection_reason: trimmedReason,
      approved_at: null,
      moderated_by: moderatedBy,
    })
    .eq("id", commentId)
    .in("status", ["pending", "approved"])
    .select("*")
    .maybeSingle();

  if (error || !data) {
    return { ok: false, error: "Não foi possível rejeitar o comentário." };
  }

  if (wasApproved) {
    revalidatePath(`/blog/${existing.post_slug}`);
  }

  return { ok: true, comment: data as Comment };
}

export async function listCommentsByStatus(status: CommentStatus): Promise<Comment[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Comment[];
}

export async function getApprovedComments(postId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("comments")
    .select("id, author_name, body, created_at")
    .eq("post_id", postId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}
