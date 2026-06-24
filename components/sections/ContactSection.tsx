"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contactContent } from "@/lib/content";

function getLinkHint(href: string, label: string) {
  if (href.startsWith("mailto:")) return href.replace("mailto:", "");
  try {
    const url = new URL(href);
    return url.hostname.replace("www.", "") + url.pathname.replace(/\/$/, "");
  } catch {
    return label;
  }
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function ContactLink({
  label,
  href,
  index,
}: {
  label: string;
  href: string;
  external: boolean;
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const hint = getLinkHint(href, label);
  const isEmail = href.startsWith("mailto:");
  const email = isEmail ? href.replace("mailto:", "") : "";
  const [copied, setCopied] = useState(false);

  const cardMotion = {
    initial: shouldReduceMotion ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    whileHover: shouldReduceMotion ? undefined : { y: -4 },
  };

  const handleCopy = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (isEmail) {
    return (
      <motion.div
        {...cardMotion}
        className="group glass-panel relative flex min-h-[120px] flex-col justify-between rounded-lg p-5 transition-colors hover:border-accent/40 hover:bg-accent/5 md:p-6"
      >
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "E-mail copiado" : "Copiar e-mail"}
          className="absolute top-4 right-4 rounded-md border border-glass-border p-2 text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
        >
          <CopyIcon />
        </button>

        <a href={href} className="flex min-h-full flex-col justify-between pr-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-accent uppercase md:text-xs">
              {label}
            </p>
            <p className="mt-2 text-sm font-medium text-text-primary md:text-base">{hint}</p>
          </div>

          <span className="mt-4 font-mono text-xs text-text-secondary transition-colors group-hover:text-accent">
            {copied ? "copiado!" : "enviar e-mail →"}
          </span>
        </a>
      </motion.div>
    );
  }

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...cardMotion}
      className="group glass-panel flex min-h-[120px] flex-col justify-between rounded-lg p-5 transition-colors hover:border-accent/40 hover:bg-accent/5 md:p-6"
    >
      <div>
        <p className="font-mono text-[10px] tracking-[0.25em] text-accent uppercase md:text-xs">
          {label}
        </p>
        <p className="mt-2 text-sm font-medium text-text-primary md:text-base">{hint}</p>
      </div>

      <span className="mt-4 font-mono text-xs text-text-secondary transition-colors group-hover:text-accent">
        abrir link →
      </span>
    </motion.a>
  );
}

export function ContactSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div>
      <SectionHeading
        hudLabel={contactContent.hudLabel}
        title={contactContent.title}
        large
        align="center"
        titleClassName="uppercase"
      />

      <motion.p
        className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-text-secondary md:text-lg"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {contactContent.description}
      </motion.p>

      <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
        {contactContent.links.map((link, index) => (
          <ContactLink
            key={link.label}
            label={link.label}
            href={link.href}
            external={link.external}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
