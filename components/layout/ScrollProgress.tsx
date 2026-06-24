"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

export function ScrollProgress() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      className="fixed top-0 right-0 left-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-accent via-accent-secondary to-accent"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

export function ScrollProgressGlow() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05, 1], [0, 1, 1]);

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 right-0 left-0 z-[59] h-24 bg-gradient-to-b from-accent/10 to-transparent"
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}
