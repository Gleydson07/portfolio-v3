import Image from "next/image";
import { getTitleInitials } from "@/lib/blog/format";
import { urlForListImage } from "@/lib/sanity/post-images";
import type { SanityImage } from "@/lib/sanity/types";

type PostCoverProps = {
  title: string;
  image?: SanityImage;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
};

export function PostCover({
  title,
  image,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className = "relative aspect-[16/9] overflow-hidden",
  imageClassName = "object-cover transition-transform duration-500 group-hover:scale-105",
}: PostCoverProps) {
  const imageUrl = image ? urlForListImage(image) : null;

  if (imageUrl) {
    return (
      <div className={className}>
        <Image
          src={imageUrl}
          alt={image?.alt ?? title}
          fill
          priority={priority}
          className={imageClassName}
          sizes={sizes}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-primary/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div
      className={`${className} flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-accent/15 via-accent-secondary/10 to-transparent`}
    >
      <span className="font-display text-3xl font-bold tracking-tight text-accent/25 md:text-4xl">
        {getTitleInitials(title)}
      </span>
    </div>
  );
}
