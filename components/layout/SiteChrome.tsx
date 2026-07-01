"use client";

import { usePathname } from "next/navigation";
import { AmbientOrbs } from "@/components/layout/AmbientOrbs";
import { GridBackground } from "@/components/layout/GridBackground";
import { HudNavigation } from "@/components/layout/HudNavigation";
import { ScrollProgress, ScrollProgressGlow } from "@/components/layout/ScrollProgress";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { usePerfMode } from "@/lib/hooks/usePerfMode";

type SiteChromeProps = {
  children: React.ReactNode;
};

export function SiteChrome({ children }: SiteChromeProps) {
  const pathname = usePathname();
  const { effectsEnabled } = usePerfMode();
  const isBlogAdmin = pathname.startsWith("/blog/admin");
  const isHome = pathname === "/";
  const showHeavyEffects = effectsEnabled && isHome;

  if (isBlogAdmin) {
    return <>{children}</>;
  }

  return (
    <SmoothScrollProvider enabled={effectsEnabled}>
      {showHeavyEffects && (
        <>
          <ScrollProgress />
          <ScrollProgressGlow />
          <AmbientOrbs />
        </>
      )}
      <GridBackground animated={showHeavyEffects} />
      <HudNavigation reduceEffects={!effectsEnabled} />
      <main className="relative z-10">{children}</main>
    </SmoothScrollProvider>
  );
}
