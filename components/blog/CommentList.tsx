import { CommentListItem } from "@/components/blog/CommentListItem";
import type { PublicComment } from "@/lib/comments/types";

type CommentListProps = {
  comments: PublicComment[];
};

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="font-mono text-xs tracking-widest text-text-secondary uppercase">
        Nenhum comentário ainda. Seja o primeiro.
      </p>
    );
  }

  return (
    <ul className="space-y-6">
      {comments.map((comment) => (
        <CommentListItem key={comment.id} comment={comment} />
      ))}
    </ul>
  );
}
