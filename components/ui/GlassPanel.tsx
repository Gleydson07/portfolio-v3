import { ReactNode } from "react";
import { HudCorner } from "@/components/ui/HudCorner";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  showCorners?: boolean;
}

export function GlassPanel({
  children,
  className = "",
  showCorners = true,
}: GlassPanelProps) {
  return (
    <div className={`glass-panel relative rounded-lg p-6 md:p-8 ${className}`}>
      {showCorners && (
        <>
          <HudCorner position="top-left" />
          <HudCorner position="top-right" />
          <HudCorner position="bottom-left" />
          <HudCorner position="bottom-right" />
        </>
      )}
      {children}
    </div>
  );
}
