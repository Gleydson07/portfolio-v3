import { toPlainText } from "@portabletext/toolkit";
import type { PortableTextBlock } from "@portabletext/types";
import { referencesSpeechText } from "@/lib/blog/references";
import type { PostReference } from "@/lib/sanity/types";

type PortableTextNode = PortableTextBlock | Record<string, unknown>;

function isCodeBlock(block: PortableTextNode): boolean {
  return block._type === "code";
}

function imageCaption(block: PortableTextNode): string | null {
  if (block._type !== "image") return null;
  const caption = (block as Record<string, unknown>).caption;
  return typeof caption === "string" && caption.trim() ? caption.trim() : null;
}

function blocksForSpeech(body: PortableTextBlock[]): PortableTextBlock[] {
  const result: PortableTextBlock[] = [];

  for (const block of body) {
    if (isCodeBlock(block)) continue;

    const caption = imageCaption(block);
    if (caption) {
      result.push({
        _type: "block",
        _key: `caption-${block._key ?? caption}`,
        style: "normal",
        markDefs: [],
        children: [{ _type: "span", _key: `span-${block._key ?? caption}`, text: caption, marks: [] }],
      } as PortableTextBlock);
      continue;
    }

    result.push(block);
  }

  return result;
}

export function buildArticleSpeechText(
  title: string,
  excerpt: string | undefined,
  body: PortableTextBlock[],
  references?: PostReference[],
): string {
  const parts = [title.trim()];

  if (excerpt?.trim()) {
    parts.push(excerpt.trim());
  }

  const bodyText = toPlainText(blocksForSpeech(body)).trim();
  if (bodyText) {
    parts.push(bodyText);
  }

  const referencesText = references ? referencesSpeechText(references) : "";
  if (referencesText) {
    parts.push(referencesText);
  }

  return parts.join(". ");
}
