import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleSpeechPlayer } from "@/components/blog/ArticleSpeechPlayer";
import { PortableTextRenderer } from "@/components/blog/PortableTextRenderer";
import { PostReferences } from "@/components/blog/PostReferences";
import { CommentsSection } from "@/components/blog/CommentsSection";
import { buildArticleSpeechText } from "@/lib/blog/speech-text";
import { getApprovedComments } from "@/lib/comments/moderate";
import { siteConfig } from "@/lib/content";
import { imageAlt, urlForHeroImage, urlForOgImage } from "@/lib/sanity/post-images";
import { getPostBySlug, getPostSlugs } from "@/lib/sanity/fetch";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(date));
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post não encontrado" };
  }

  const description = post.excerpt ?? `Artigo de ${siteConfig.name}`;
  const ogImage = post.ogImage ? urlForOgImage(post.ogImage) : undefined;
  const ogAlt = imageAlt(post.ogImage, post.title);

  return {
    title: post.title,
    description,
    alternates: { canonical: `${siteConfig.url}/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      publishedTime: post.publishedAt,
      url: `${siteConfig.url}/blog/${slug}`,
      images: ogImage ? [{ url: ogImage, alt: ogAlt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const imageUrl = post.heroImage ? urlForHeroImage(post.heroImage) : null;
  const heroAlt = imageAlt(post.heroImage, post.title);
  const speechText = buildArticleSpeechText(post.title, post.excerpt, post.body, post.references);

  return (
    <article className="min-h-screen px-4 py-28 md:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/blog"
          className="font-mono mb-10 inline-flex items-center gap-2 text-xs tracking-widest text-text-secondary uppercase transition-colors hover:text-accent"
        >
          ← Voltar ao blog
        </Link>

        <header>
          <div className="flex items-center justify-between gap-4">
            <time
              dateTime={post.publishedAt}
              className="font-mono text-xs tracking-widest text-accent uppercase"
            >
              {formatDate(post.publishedAt)}
            </time>

            <ArticleSpeechPlayer text={speechText} />
          </div>

          <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-text-primary md:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-5 text-lg leading-relaxed text-text-secondary md:text-xl">
              {post.excerpt}
            </p>
          )}

          {post.tags && post.tags.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
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
        </header>

        {imageUrl && (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl">
            <Image
              src={imageUrl}
              alt={heroAlt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <div className="mt-12">
          <PortableTextRenderer value={post.body} />
        </div>

        {post.references && post.references.length > 0 && (
          <PostReferences references={post.references} />
        )}

        <CommentsSection
          postId={post._id}
          postSlug={post.slug}
          postTitle={post.title}
          comments={await getApprovedComments(post._id)}
        />
      </div>
    </article>
  );
}
