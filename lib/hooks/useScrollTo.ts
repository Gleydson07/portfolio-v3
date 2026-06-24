"use client";

import { useLenis } from "lenis/react";
import { useCallback } from "react";

const NAV_OFFSET = -88;

export function useScrollTo() {
  const lenis = useLenis();

  return useCallback(
    (id: string, duration = 1) => {
      if (lenis) {
        lenis.scrollTo(`#${id}`, {
          offset: NAV_OFFSET * -1,
          duration,
          easing: (t) => 1 - Math.pow(1 - t, 3),
        });
        return;
      }

      const element = document.getElementById(id);
      if (!element) return;

      const top = element.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    },
    [lenis]
  );
}
