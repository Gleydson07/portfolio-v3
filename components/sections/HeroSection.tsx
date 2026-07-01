"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TextReveal } from "@/components/ui/TextReveal";
import { heroContent, contactContent } from "@/lib/content";
import { usePerfMode } from "@/lib/hooks/usePerfMode";

function HeroCopy({ animated }: { animated: boolean }) {
  return (
    <>
      <motion.p
        className="hud-label mb-8"
        initial={animated ? { opacity: 0, letterSpacing: "0.5em" } : false}
        animate={{ opacity: 1, letterSpacing: "0.15em" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {heroContent.hudLabel}
      </motion.p>

      <p className="mb-4 text-sm text-text-secondary md:text-lg">{heroContent.greeting}</p>

      <TextReveal
        as="h1"
        text={heroContent.name}
        mode="words"
        className="font-display mx-auto max-w-5xl text-5xl font-bold leading-none tracking-tight text-text-primary md:text-7xl lg:text-8xl"
      />

      <div className="mt-2 md:mt-3">
        <TextReveal
          as="p"
          text={heroContent.title}
          delay={0.2}
          className="font-display text-2xl leading-tight text-accent md:text-4xl lg:text-5xl"
        />
      </div>

      <TextReveal
        as="p"
        text={heroContent.subtitle}
        delay={0.35}
        className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-secondary md:mt-5 md:text-xl"
      />

      <motion.div
        className="mt-12 flex justify-center"
        initial={animated ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <MagneticButton href={contactContent.links[0].href} external>
          {heroContent.ctaSecondary}
        </MagneticButton>
      </motion.div>
    </>
  );
}

function HeroSectionParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);
  const y = useTransform(scrollYProgress, [0, 0.6], [0, -80]);

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden scroll-mt-24"
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <motion.div
        className="relative z-10 w-full px-4 py-24 text-center"
        style={{ opacity, scale, y }}
      >
        <HeroCopy animated />
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        style={{ opacity }}
      >
        <span className="font-mono text-[10px] tracking-[0.4em] text-text-secondary">SCROLL</span>
        <motion.div
          className="h-8 w-px bg-gradient-to-b from-accent to-transparent"
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}

function HeroSectionStatic() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden scroll-mt-24">
      <div className="relative z-10 w-full px-4 py-24 text-center">
        <HeroCopy animated={false} />
      </div>
    </div>
  );
}

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const { effectsEnabled } = usePerfMode();

  if (!effectsEnabled || shouldReduceMotion) {
    return <HeroSectionStatic />;
  }

  return <HeroSectionParallax />;
}
