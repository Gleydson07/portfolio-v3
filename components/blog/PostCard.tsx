import Link from "next/link";
import { PostCover } from "@/components/blog/PostCover";
import { PostTags } from "@/components/blog/PostTags";
import { formatPostDateShort } from "@/lib/blog/format";
import type { PostListItem } from "@/lib/sanity/types";

type PostCardProps = {
  post: PostListItem;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="glass-panel group min-h-44 overflow-hidden rounded-2xl transition-colors hover:border-accent/30 md:min-h-52">
      <Link href={`/blog/${post.slug}`} className="flex min-h-44 md:min-h-52">
        <PostCover
          title={post.title}
          image={post.listImage}
          sizes="(max-width: 1024px) 45vw, 28vw"
          className="relative aspect-[16/9] w-[45%] shrink-0 self-stretch overflow-hidden md:aspect-auto md:h-auto"
        />

        <div className="flex min-w-0 flex-1 flex-col justify-center p-5 md:p-7">
          <time
            dateTime={post.publishedAt}
            className="font-mono text-[10px] tracking-widest text-text-secondary uppercase md:text-xs"
          >
            {formatPostDateShort(post.publishedAt)}
          </time>

          <h2 className="font-display mt-2.5 text-xl font-bold tracking-tight text-text-primary transition-colors group-hover:text-accent md:text-2xl">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-text-secondary md:text-base">
              {post.excerpt}
            </p>
          )}

          <PostTags tags={post.tags} maxVisible={2} className="mt-4" />

          <span className="font-mono mt-auto inline-flex items-center gap-2 self-end pt-4 text-[10px] tracking-widest text-accent uppercase opacity-70 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 md:opacity-0">
            Ler artigo
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
