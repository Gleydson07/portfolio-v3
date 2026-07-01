"use client";

import { useId, useState, type ReactNode } from "react";
import type { PostReference, PostReferenceKind } from "@/lib/sanity/types";
import { REFERENCE_KIND_LABELS } from "@/lib/blog/references";
import { captureButtonClick } from "@/lib/analytics/track";

type PostReferencesProps = {
  references: PostReference[];
};

function ReferenceKindIcon({ kind }: { kind?: PostReferenceKind }) {
  const label = kind ? REFERENCE_KIND_LABELS[kind] : REFERENCE_KIND_LABELS.other;
  const iconClassName = "h-4 w-4 shrink-0 text-accent";

  const icons: Record<PostReferenceKind, ReactNode> = {
    article: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={iconClassName} aria-hidden="true">
        <path d="M6 4h9l3 3v13H6V4z" strokeLinejoin="round" />
        <path d="M15 4v4h4M8 12h8M8 16h8" strokeLinecap="round" />
      </svg>
    ),
    book: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={iconClassName} aria-hidden="true">
        <path d="M5 4h8a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3V4z" strokeLinejoin="round" />
        <path d="M19 7h-6a3 3 0 0 0-3 3v13h9V7z" strokeLinejoin="round" />
      </svg>
    ),
    study: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={iconClassName} aria-hidden="true">
        <path d="M12 3l8 4v6c0 4-3.5 7-8 8-4.5-1-8-4-8-8V7l8-4z" strokeLinejoin="round" />
        <path d="M9 12h6M12 9v6" strokeLinecap="round" />
      </svg>
    ),
    video: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={iconClassName} aria-hidden="true">
        <rect x="3" y="6" width="14" height="12" rx="2" />
        <path d="M17 10l4-2v8l-4-2" strokeLinejoin="round" />
      </svg>
    ),
    documentation: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={iconClassName} aria-hidden="true">
        <path d="M8 6h8M8 10h8M8 14h5" strokeLinecap="round" />
        <path d="M6 4h9l3 3v13H6V4z" strokeLinejoin="round" />
      </svg>
    ),
    publication: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={iconClassName} aria-hidden="true">
        <path d="M4 6h16M4 10h16M4 14h10" strokeLinecap="round" />
        <path d="M4 4h16v16H4V4z" strokeLinejoin="round" />
      </svg>
    ),
    course: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={iconClassName} aria-hidden="true">
        <path d="M12 3L2 8l10 5 10-5-10-5z" strokeLinejoin="round" />
        <path d="M6 11v4c0 2.5 2.7 4 6 4s6-1.5 6-4v-4" strokeLinejoin="round" />
      </svg>
    ),
    tool: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={iconClassName} aria-hidden="true">
        <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-3.3-3.3 2.1-2.1z" strokeLinejoin="round" />
      </svg>
    ),
    other: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={iconClassName} aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
      </svg>
    ),
  };

  return (
    <span title={label} className="inline-flex">
      {icons[kind ?? "other"]}
      <span className="sr-only">{label}</span>
    </span>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={`h-4 w-4 text-text-secondary transition-transform ${expanded ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ReferenceItem({ reference }: { reference: PostReference }) {
  const titleClassName =
    "text-sm text-text-primary underline decoration-accent/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent";

  return (
    <li className="border-t border-glass-border/60 py-3 first:border-t-0 first:pt-0">
      <div className="flex gap-3">
        <ReferenceKindIcon kind={reference.kind} />

        <div className="min-w-0 flex-1 space-y-1">
          {reference.url ? (
            <a href={reference.url} target="_blank" rel="noopener noreferrer" className={titleClassName}>
              {reference.title}
            </a>
          ) : (
            <p className="text-sm text-text-primary">{reference.title}</p>
          )}

          {reference.note && (
            <p className="text-xs leading-relaxed text-text-secondary">{reference.note}</p>
          )}

          {reference.url && (
            <p className="truncate font-mono text-[10px] tracking-wide text-text-secondary/80">{reference.url}</p>
          )}
        </div>
      </div>
    </li>
  );
}

export function PostReferences({ references }: PostReferencesProps) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const headingId = useId();

  if (!references.length) return null;

  return (
    <section className="mt-12 border-t border-glass-border pt-8" aria-labelledby={headingId}>
      <button
        type="button"
        id={headingId}
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => {
          setExpanded((current) => {
            const next = !current;
            captureButtonClick({
              buttonId: "post_references_toggle",
              buttonLabel: next ? "Expandir referências" : "Recolher referências",
              location: "blog_post",
            });
            return next;
          });
        }}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="font-mono text-xs tracking-widest text-text-secondary uppercase">
          Referências, fontes e estudos
          <span className="ml-2 text-accent">({references.length})</span>
        </span>
        <ChevronIcon expanded={expanded} />
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        hidden={!expanded}
        className={expanded ? "mt-4" : undefined}
      >
        {expanded && (
          <ol className="list-none">
            {references.map((reference) => (
              <ReferenceItem key={reference._key} reference={reference} />
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
