import {
  POST_HERO_WIDTH,
  POST_LIST_WIDTH,
  POST_OG_HEIGHT,
  POST_OG_WIDTH,
  postImageHeight,
} from "@/lib/blog/constants";
import { urlForImage } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/types";

export function urlForListImage(source: SanityImage) {
  return urlForImage(source)
    .width(POST_LIST_WIDTH)
    .height(postImageHeight(POST_LIST_WIDTH))
    .fit("crop")
    .url();
}

export function urlForHeroImage(source: SanityImage) {
  return urlForImage(source)
    .width(POST_HERO_WIDTH)
    .height(postImageHeight(POST_HERO_WIDTH))
    .fit("crop")
    .url();
}

export function urlForOgImage(source: SanityImage) {
  return urlForImage(source).width(POST_OG_WIDTH).height(POST_OG_HEIGHT).fit("crop").url();
}

export function imageAlt(image: SanityImage | undefined, fallback: string) {
  return image?.alt ?? fallback;
}
