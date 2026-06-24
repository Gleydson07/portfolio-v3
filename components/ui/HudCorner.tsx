interface HudCornerProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

const positionClasses: Record<HudCornerProps["position"], string> = {
  "top-left": "top-0 left-0 border-t-2 border-l-2",
  "top-right": "top-0 right-0 border-t-2 border-r-2",
  "bottom-left": "bottom-0 left-0 border-b-2 border-l-2",
  "bottom-right": "bottom-0 right-0 border-b-2 border-r-2",
};

export function HudCorner({ position }: HudCornerProps) {
  return (
    <span
      className={`pointer-events-none absolute h-4 w-4 border-accent ${positionClasses[position]}`}
      aria-hidden="true"
    />
  );
}
