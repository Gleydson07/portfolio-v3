"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { expertiseContent } from "@/lib/content";

export function ExpertiseSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div>
      <SectionHeading
        hudLabel={expertiseContent.hudLabel}
        title={expertiseContent.title}
        subtitle={expertiseContent.subtitle}
        large
        align="center"
      />

      <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-2 md:gap-10">
        {expertiseContent.categories.map((category, index) => (
          <motion.article
            key={category.label}
            className={`relative border-l pl-5 md:pl-6 ${
              "highlight" in category && category.highlight
                ? "border-accent-secondary/40 sm:col-span-2"
                : "border-accent/25"
            }`}
            initial={shouldReduceMotion ? false : { opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className={`absolute top-1.5 -left-[3px] h-1.5 w-1.5 rounded-full ${
                "highlight" in category && category.highlight
                  ? "border border-accent-secondary/60 bg-transparent"
                  : "bg-accent"
              }`}
              aria-hidden="true"
            />

            <h3
              className={`font-display text-base font-semibold md:text-lg ${
                "highlight" in category && category.highlight
                  ? "text-accent-secondary"
                  : "text-accent"
              }`}
            >
              {category.label}
            </h3>

            {"context" in category && category.context && (
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {category.context}
              </p>
            )}

            <ul className="mt-3 flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <li key={skill}>
                  <span className="inline-block rounded-full border border-glass-border bg-white/5 px-3 py-1 font-mono text-[11px] text-text-secondary">
                    {skill}
                  </span>
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
