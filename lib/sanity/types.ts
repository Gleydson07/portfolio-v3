import type { PortableTextBlock } from "@portabletext/types";

export type SanityImage = {
  asset?: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
};

export type PostReferenceKind =
  | "article"
  | "book"
  | "study"
  | "video"
  | "documentation"
  | "publication"
  | "course"
  | "tool"
  | "other";

export type PostReference = {
  _key: string;
  title: string;
  url?: string;
  kind?: PostReferenceKind;
  note?: string;
};

export type PostListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  listImage?: SanityImage;
  tags?: string[];
};

export type Post = PostListItem & {
  heroImage?: SanityImage;
  ogImage?: SanityImage;
  body: PortableTextBlock[];
  references?: PostReference[];
};
