"use client";

import { motion, useReducedMotion } from "framer-motion";

const orbs = [
  {
    id: 1,
    size: "min(80vw, 600px)",
    color: "rgba(0, 212, 255, 0.15)",
    top: "-10%",
    left: "-5%",
    duration: 18,
    delay: 0,
  },
  {
    id: 2,
    size: "min(60vw, 450px)",
    color: "rgba(139, 92, 246, 0.12)",
    top: "30%",
    left: "60%",
    duration: 22,
    delay: 2,
  },
  {
    id: 3,
    size: "min(50vw, 380px)",
    color: "rgba(0, 212, 255, 0.08)",
    top: "65%",
    left: "10%",
    duration: 20,
    delay: 4,
  },
];

export function AmbientOrbs() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full blur-[100px]"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            background: orb.color,
          }}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  x: [0, 40, -20, 0],
                  y: [0, -30, 20, 0],
                  scale: [1, 1.1, 0.95, 1],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: orb.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: orb.delay,
                }
          }
        />
      ))}
    </div>
  );
}
