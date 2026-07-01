"use client";

import { useEffect, useRef } from "react";
import { captureSafe } from "@/lib/analytics/posthog-client";

type TrackOnceProps = {
  event: string;
  properties?: Record<string, unknown>;
};

export function TrackOnce({ event, properties }: TrackOnceProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;
    captureSafe(event, properties);
  }, [event, properties]);

  return null;
}
