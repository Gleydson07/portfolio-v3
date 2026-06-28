type PostTagsProps = {
  tags?: string[];
  maxVisible?: number;
  className?: string;
};

export function PostTags({ tags, maxVisible = 2, className = "mt-5" }: PostTagsProps) {
  if (!tags || tags.length === 0) return null;

  const visibleTags = tags.slice(0, maxVisible);
  const hiddenCount = tags.length - visibleTags.length;

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {visibleTags.map((tag) => (
        <li
          key={tag}
          className="font-mono rounded-full border border-glass-border px-2.5 py-1 text-[10px] tracking-widest text-text-secondary uppercase"
        >
          {tag}
        </li>
      ))}
      {hiddenCount > 0 && (
        <li className="font-mono rounded-full border border-glass-border/60 px-2.5 py-1 text-[10px] tracking-widest text-text-secondary/70 uppercase">
          +{hiddenCount}
        </li>
      )}
    </ul>
  );
}
