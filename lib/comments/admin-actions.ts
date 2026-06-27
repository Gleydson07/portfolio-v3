"use server";

import { approveComment, rejectComment } from "@/lib/comments/moderate";
import { rejectCommentSchema } from "@/lib/comments/validation";
import { auth } from "@/lib/auth";

export async function approveCommentAction(commentId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Não autorizado." };
  }

  return approveComment(commentId, session.user.id);
}

export async function rejectCommentAction(commentId: string, reason: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Não autorizado." };
  }

  const parsed = rejectCommentSchema.safeParse({ commentId, reason });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Motivo inválido." };
  }

  return rejectComment(parsed.data.commentId, parsed.data.reason, session.user.id);
}
