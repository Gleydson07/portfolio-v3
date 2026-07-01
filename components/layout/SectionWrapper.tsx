"use client";

import { ReactNode } from "react";
import { SectionViewTracker } from "@/components/analytics/SectionViewTracker";

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
  analyticsLabel?: string;
}

export function SectionWrapper({
  id,
  children,
  className = "",
  analyticsLabel,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative min-h-screen scroll-mt-24 px-4 py-20 md:px-8 md:py-28 ${className}`}
    >
      {analyticsLabel && <SectionViewTracker sectionId={id} sectionLabel={analyticsLabel} />}
      <div className="relative z-10 mx-auto w-full max-w-6xl py-4">{children}</div>
    </section>
  );
}
