import type { Metadata } from "next";
import { BlogPostList } from "@/components/blog/BlogPostList";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/content";
import { getAllPostTags, getPostsPage } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artigos sobre engenharia de software, arquitetura e desenvolvimento.",
  alternates: { canonical: `${siteConfig.url}/blog` },
};

export default async function BlogPage() {
  const [{ posts, total, hasMore }, availableTags] = await Promise.all([
    getPostsPage({ page: 0, title: "", tag: "" }),
    getAllPostTags(),
  ]);

  return (
    <div className="min-h-screen px-4 py-28 md:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeading
          hudLabel="// BLOG"
          title="Blog"
          subtitle="Reflexões sobre engenharia de software, arquitetura e produto."
          large
          tight
        />

        {total === 0 ? (
          <div className="glass-panel rounded-2xl p-10 text-center">
            <p className="font-mono text-sm tracking-widest text-text-secondary uppercase">
              Nenhum post publicado ainda.
            </p>
          </div>
        ) : (
          <BlogPostList
            initialPosts={posts}
            initialHasMore={hasMore}
            initialTotal={total}
            availableTags={availableTags}
          />
        )}
      </div>
    </div>
  );
}
