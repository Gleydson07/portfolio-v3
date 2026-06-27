import { z } from "zod";

export const COMMENT_NAME_MAX = 40;
export const COMMENT_BODY_MAX = 2000;

export const submitCommentSchema = z.object({
  postSlug: z.string().min(1).max(200),
  postTitle: z.string().min(1).max(300),
  authorName: z
    .string()
    .optional()
    .transform((value) => {
      const trimmed = value?.trim().slice(0, COMMENT_NAME_MAX);
      return trimmed ? trimmed : null;
    }),
  body: z
    .string()
    .transform((value) => value.slice(0, COMMENT_BODY_MAX))
    .pipe(z.string().min(3, "Comentário muito curto.")),
  website: z.string().optional(),
});

export const rejectCommentSchema = z.object({
  commentId: z.string().uuid(),
  reason: z
    .string()
    .min(3, "Motivo muito curto.")
    .max(500, "Motivo muito longo.")
    .transform((value) => value.trim()),
});
