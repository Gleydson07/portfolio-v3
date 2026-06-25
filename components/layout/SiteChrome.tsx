"use client";

import { usePathname } from "next/navigation";
import { AmbientOrbs } from "@/components/layout/AmbientOrbs";
import { GridBackground } from "@/components/layout/GridBackground";
import { HudNavigation } from "@/components/layout/HudNavigation";
import { ScrollProgress, ScrollProgressGlow } from "@/components/layout/ScrollProgress";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

type SiteChromeProps = {
  children: React.ReactNode;
};

export function SiteChrome({ children }: SiteChromeProps) {
  const pathname = usePathname();
  const isStudio = pathname.startsWith("/studio");

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <SmoothScrollProvider>
      <ScrollProgress />
      <ScrollProgressGlow />
      <GridBackground />
      <AmbientOrbs />
      <HudNavigation />
      <main className="relative z-10">{children}</main>
    </SmoothScrollProvider>
  );
}
