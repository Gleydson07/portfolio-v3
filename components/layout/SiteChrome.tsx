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
  const isStudio = pathname.startsWith("/blog/studio");
  const isBlogAdmin = pathname.startsWith("/blog/admin");

  if (isStudio || isBlogAdmin) {
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
