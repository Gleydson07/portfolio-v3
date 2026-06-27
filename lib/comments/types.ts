export type CommentStatus = "pending" | "approved" | "rejected";

export type Comment = {
  id: string;
  post_id: string | null;
  post_slug: string;
  post_title: string | null;
  author_name: string | null;
  body: string;
  status: CommentStatus;
  created_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  moderated_by: string | null;
  ip_hash: string | null;
  notification_sent_at: string | null;
  notification_error: string | null;
};

export type PublicComment = Pick<Comment, "id" | "author_name" | "body" | "created_at">;
