export function getShouldReduceEffects(): boolean {
  if (typeof window === "undefined") return true;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return true;
  }

  if (window.matchMedia("(pointer: coarse)").matches) {
    return true;
  }

  if (window.innerWidth < 768) {
    return true;
  }

  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (deviceMemory !== undefined && deviceMemory < 4) {
    return true;
  }

  return false;
}
