"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { getShouldReduceEffects } from "@/lib/perf-mode";

export function usePerfMode() {
  const prefersReducedMotion = useReducedMotion();
  const [effectsEnabled, setEffectsEnabled] = useState(false);

  useEffect(() => {
    const sync = () => {
      if (prefersReducedMotion) {
        setEffectsEnabled(false);
        return;
      }

      setEffectsEnabled(!getShouldReduceEffects());
    };

    sync();
    window.addEventListener("resize", sync);

    return () => {
      window.removeEventListener("resize", sync);
    };
  }, [prefersReducedMotion]);

  return {
    effectsEnabled,
    shouldReduceEffects: !effectsEnabled,
  };
}
