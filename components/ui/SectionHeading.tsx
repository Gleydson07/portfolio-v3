"use client";

import { TextReveal } from "@/components/ui/TextReveal";

interface SectionHeadingProps {
  hudLabel: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  large?: boolean;
  compact?: boolean;
  tight?: boolean;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function SectionHeading({
  hudLabel,
  title,
  subtitle,
  align = "left",
  large = false,
  compact = false,
  tight = false,
  titleClassName = "",
  subtitleClassName = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const spacingClass = compact ? "mb-0" : tight ? "mb-8" : "mb-12 md:mb-16";

  return (
    <div className={`${spacingClass} ${alignClass} max-w-4xl`}>
      <p className="hud-label mb-4">{hudLabel}</p>
      <TextReveal
        as="h2"
        text={title}
        className={`font-display font-bold tracking-tight text-text-primary ${
          large ? "text-4xl md:text-6xl lg:text-7xl" : "text-3xl md:text-5xl lg:text-6xl"
        } ${titleClassName}`}
      />
      {subtitle && (
        <TextReveal
          as="p"
          text={subtitle}
          delay={0.2}
          className={`mt-5 text-base leading-relaxed md:text-xl ${
            subtitleClassName || "text-text-secondary"
          }`}
        />
      )}
    </div>
  );
}
