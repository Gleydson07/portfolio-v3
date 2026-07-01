import type { PostReference } from "@/lib/sanity/types";
import { REFERENCE_KIND_LABELS } from "@/lib/blog/references";

type PostReferencesProps = {
  references: PostReference[];
};

function ReferenceItem({ reference }: { reference: PostReference }) {
  const kindLabel = reference.kind ? REFERENCE_KIND_LABELS[reference.kind] : null;

  return (
    <li className="border-t border-glass-border py-4 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {reference.url ? (
          <a
            href={reference.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-text-primary underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            {reference.title}
          </a>
        ) : (
          <span className="font-medium text-text-primary">{reference.title}</span>
        )}

        {kindLabel && (
          <span className="font-mono text-[10px] tracking-widest text-text-secondary uppercase">
            {kindLabel}
          </span>
        )}
      </div>

      {reference.note && (
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{reference.note}</p>
      )}
    </li>
  );
}

export function PostReferences({ references }: PostReferencesProps) {
  if (!references.length) return null;

  return (
    <section className="mt-16 border-t border-glass-border pt-12" aria-labelledby="post-references-heading">
      <p className="hud-label mb-6">{"// REFERÊNCIAS"}</p>

      <div className="glass-panel rounded-2xl p-6 md:p-8">
        <h2
          id="post-references-heading"
          className="font-display mb-6 text-2xl font-bold tracking-tight text-text-primary md:text-3xl"
        >
          Referências, fontes e estudos
        </h2>

        <ol className="list-none">
          {references.map((reference) => (
            <ReferenceItem key={reference._key} reference={reference} />
          ))}
        </ol>
      </div>
    </section>
  );
}
