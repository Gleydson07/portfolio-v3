"use client";

import { useEffect, useRef } from "react";
import { captureSectionViewed } from "@/lib/analytics/track";

type SectionViewTrackerProps = {
  sectionId: string;
  sectionLabel: string;
};

export function SectionViewTracker({ sectionId, sectionLabel }: SectionViewTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;

    const element = document.getElementById(sectionId);
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        try {
          const visible = entries.some(
            (entry) => entry.isIntersecting && entry.intersectionRatio >= 0.25,
          );
          if (!visible || trackedRef.current) return;

          trackedRef.current = true;
          captureSectionViewed({ sectionId, sectionLabel });
          observer.disconnect();
        } catch {
          observer.disconnect();
        }
      },
      { threshold: [0.25, 0.5], rootMargin: "-10% 0px -10% 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [sectionId, sectionLabel]);

  return null;
}
