import type { PortableTextBlock } from "@portabletext/types";

export type SanityImage = {
  asset?: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
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
};
