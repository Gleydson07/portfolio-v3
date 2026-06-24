"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface TextRevealProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  mode?: "words" | "chars";
}

export function TextReveal({
  text,
  className = "",
  as: Tag = "p",
  delay = 0,
  mode = "words",
}: TextRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const items = mode === "words" ? text.split(" ") : text.split("");

  if (shouldReduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: mode === "words" ? 0.04 : 0.02, delayChildren: delay },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <Tag className={className}>
      <motion.span
        className="inline"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {items.map((item, index) => (
          <motion.span
            key={`${item}-${index}`}
            variants={child}
            className="inline-block"
          >
            {item}
            {mode === "words" && index < items.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

interface GradientTextProps {
  children: ReactNode;
  className?: string;
}

export function GradientText({ children, className = "" }: GradientTextProps) {
  return (
    <span
      className={`bg-gradient-to-r from-accent via-white to-accent-secondary bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
}
