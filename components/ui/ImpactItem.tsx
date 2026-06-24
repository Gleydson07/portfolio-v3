interface ImpactItemProps {
  text: string;
  index: number;
}

export function ImpactItem({ text, index }: ImpactItemProps) {
  return (
    <li className="flex gap-3 text-text-secondary">
      <span className="font-mono shrink-0 text-xs text-accent">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="text-sm leading-relaxed md:text-base">{text}</span>
    </li>
  );
}
