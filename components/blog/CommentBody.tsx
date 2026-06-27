type CommentBodyProps = {
  body: string;
  className?: string;
};

export function CommentBody({ body, className = "" }: CommentBodyProps) {
  return (
    <p
      className={`whitespace-pre-wrap text-sm leading-relaxed text-text-secondary md:text-base ${className}`.trim()}
    >
      {body}
    </p>
  );
}
