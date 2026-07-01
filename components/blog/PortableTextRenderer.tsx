import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { CodeBlock } from "@/components/blog/CodeBlock";
import { urlForImage } from "@/lib/sanity/image";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-display mt-12 mb-4 text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display mt-8 mb-3 text-2xl font-bold tracking-tight text-text-primary">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="mb-5 text-base leading-relaxed text-text-secondary md:text-lg">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-accent pl-5 text-lg text-text-primary italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-sm text-accent">
        {children}
      </code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;

      const imageUrl = urlForImage(value).width(1200).fit("max").url();

      return (
        <figure className="my-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
            <Image
              src={imageUrl}
              alt={value.alt ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-3 text-center font-mono text-xs tracking-widest text-text-secondary uppercase">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    code: ({ value }) => <CodeBlock code={value.code} language={value.language} />,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 list-disc space-y-2 pl-6 text-text-secondary">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 list-decimal space-y-2 pl-6 text-text-secondary">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
};

type PortableTextRendererProps = {
  value: PortableTextBlock[];
};

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  return <PortableText value={value} components={components} />;
}
