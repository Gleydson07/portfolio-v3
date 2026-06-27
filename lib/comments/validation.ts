import { z } from "zod";

export const submitCommentSchema = z.object({
  postSlug: z.string().min(1).max(200),
  postTitle: z.string().min(1).max(300),
  authorName: z
    .string()
    .max(80)
    .optional()
    .transform((value) => {
      const trimmed = value?.trim();
      return trimmed ? trimmed : null;
    }),
  body: z.string().min(3, "Comentário muito curto.").max(2000, "Comentário muito longo."),
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
