import Image from "next/image";
import Link from "next/link";
import type { PostListItem } from "@/lib/sanity/types";
import { urlForImage } from "@/lib/sanity/image";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(date));
}

type PostCardProps = {
  post: PostListItem;
};

export function PostCard({ post }: PostCardProps) {
  const imageUrl = post.mainImage
    ? urlForImage(post.mainImage).width(800).height(450).fit("crop").url()
    : null;

  return (
    <article className="glass-panel group overflow-hidden rounded-2xl transition-colors hover:border-accent/30">
      <Link href={`/blog/${post.slug}`} className="block">
        {imageUrl && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.mainImage?.alt ?? post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          <time
            dateTime={post.publishedAt}
            className="font-mono text-xs tracking-widest text-accent uppercase"
          >
            {formatDate(post.publishedAt)}
          </time>

          <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-text-primary transition-colors group-hover:text-accent md:text-3xl">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-text-secondary md:text-base">
              {post.excerpt}
            </p>
          )}

          {post.tags && post.tags.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="font-mono rounded-full border border-glass-border px-2.5 py-1 text-[10px] tracking-widest text-text-secondary uppercase"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </article>
  );
}
