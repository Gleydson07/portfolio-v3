"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experienceContent } from "@/lib/content";

export function ExperienceSection() {
  const shouldReduceMotion = useReducedMotion();
  const jobCount = experienceContent.jobs.length;

  return (
    <div>
      <SectionHeading
        hudLabel={experienceContent.hudLabel}
        title={experienceContent.title}
        subtitle={experienceContent.subtitle}
        large
        align="center"
      />

      <div className="mx-auto max-w-3xl space-y-8 md:space-y-10">
        {experienceContent.jobs.map((job, jobIndex) => (
          <motion.article
            key={`${job.company}-${job.period}`}
            className="relative border-l border-accent/25 pl-5 md:pl-6"
            initial={shouldReduceMotion ? false : { opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: jobIndex * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="absolute top-1.5 -left-[3px] h-1.5 w-1.5 rounded-full bg-accent"
              aria-hidden="true"
            />

            <p className="font-mono text-[11px] tracking-widest text-text-secondary md:text-xs">
              {job.workMode ? `${job.workMode} · ${job.period}` : job.period}
            </p>

            <h3 className="font-display mt-1 text-lg font-semibold text-accent md:text-xl">
              {job.company}
            </h3>

            <div className="mt-4 space-y-5">
              {job.roles.map((role) => (
                <div key={role.title}>
                  <p className="text-sm font-medium text-text-primary">{role.title}</p>
                  <ul className="mt-2 space-y-1.5">
                    {role.impacts.map((impact) => (
                      <li
                        key={impact.slice(0, 40)}
                        className="flex gap-2 text-sm leading-relaxed text-text-secondary"
                      >
                        <span
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/50"
                          aria-hidden="true"
                        />
                        {impact}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.article>
        ))}

        <p className="pt-2 font-mono text-[10px] tracking-[0.25em] text-accent/70 uppercase md:text-xs">
          &quot;// Formação&quot;
        </p>

        {experienceContent.education.map((entry, index) => (
          <motion.article
            key={`${entry.institution}-${entry.period}`}
            className="relative border-l border-accent-secondary/20 pl-5 md:pl-6"
            initial={shouldReduceMotion ? false : { opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              delay: (jobCount + index) * 0.1,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <span
              className="absolute top-1.5 -left-[3px] h-1.5 w-1.5 rounded-full border border-accent-secondary/60 bg-transparent"
              aria-hidden="true"
            />

            <p className="font-mono text-[11px] tracking-widest text-text-secondary md:text-xs">
              {entry.period}
            </p>

            <h3 className="font-display mt-1 text-lg font-semibold text-accent-secondary md:text-xl">
              {entry.institution}
            </h3>

            <p className="mt-1 text-sm text-text-primary">{entry.degree}</p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
