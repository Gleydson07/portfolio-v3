"use client";

import dynamic from "next/dynamic";

const AnalyticsRoot = dynamic(
  () => import("@/components/analytics/AnalyticsRoot").then((module) => module.AnalyticsRoot),
  { ssr: false },
);

export function AnalyticsShell() {
  return <AnalyticsRoot />;
}
