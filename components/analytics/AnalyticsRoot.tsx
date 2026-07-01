"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { warmPostHogClient } from "@/lib/analytics/posthog-client";
import { capturePageView } from "@/lib/analytics/track";

function AnalyticsPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    warmPostHogClient();
  }, []);

  useEffect(() => {
    capturePageView(pathname, searchParams.toString());
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsRoot() {
  return (
    <Suspense fallback={null}>
      <AnalyticsPageViewTracker />
    </Suspense>
  );
}
