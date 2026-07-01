import type { PostReference, PostReferenceKind } from "@/lib/sanity/types";

export const REFERENCE_KIND_LABELS: Record<PostReferenceKind, string> = {
  article: "Artigo",
  book: "Livro",
  study: "Estudo",
  video: "Vídeo",
  documentation: "Documentação",
  other: "Outro",
};

export function referencesSpeechText(references: PostReference[]): string {
  if (!references.length) return "";

  const items = references.map((reference) => {
    const kindLabel = reference.kind ? REFERENCE_KIND_LABELS[reference.kind] : "";
    const parts = [reference.title];
    if (kindLabel) parts.push(kindLabel);
    if (reference.note) parts.push(reference.note);
    if (reference.url) parts.push(reference.url);
    return parts.join(". ");
  });

  return `Referências, fontes e estudos. ${items.join(". ")}`;
}
