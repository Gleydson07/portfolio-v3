"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { MouseEvent, ReactNode, useRef } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  external?: boolean;
}

export function MagneticButton({
  children,
  className = "",
  onClick,
  href,
  external,
}: MagneticButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (event: MouseEvent) => {
    if (shouldReduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((event.clientX - centerX) * 0.15);
    y.set((event.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <motion.span
      style={shouldReduceMotion ? undefined : { x: springX, y: springY }}
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full border border-accent/40 bg-accent/10 px-8 py-3 font-mono text-xs tracking-[0.2em] text-accent uppercase backdrop-blur-sm transition-colors hover:border-accent hover:bg-accent/20 hover:shadow-[0_0_40px_rgba(0,212,255,0.25)] ${className}`}
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      {children}
    </motion.span>
  );

  return (
    <div
      ref={ref}
      className="group inline-block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {href ? (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="inline-block"
        >
          {inner}
        </a>
      ) : (
        <button type="button" onClick={onClick} className="inline-block cursor-pointer">
          {inner}
        </button>
      )}
    </div>
  );
}
