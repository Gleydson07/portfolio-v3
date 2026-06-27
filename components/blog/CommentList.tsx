import type { PublicComment } from "@/lib/comments/types";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(date));
}

function displayName(name: string | null) {
  const trimmed = name?.trim();
  return trimmed ? trimmed : "Anônimo";
}

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
        <li key={comment.id} className="glass-panel rounded-2xl p-6">
          <p className="font-display text-lg font-semibold text-text-primary">
            {displayName(comment.author_name)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary md:text-base">
            {comment.body}
          </p>
          <time
            dateTime={comment.created_at}
            className="font-mono mt-4 block text-xs tracking-widest text-accent uppercase"
          >
            {formatDate(comment.created_at)}
          </time>
        </li>
      ))}
    </ul>
  );
}
