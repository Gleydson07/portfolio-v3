import { POSTS_PAGE_SIZE } from "@/lib/blog/constants";
import { getSanityClient } from "./client";
import { postBySlugQuery, postsPaginatedQuery, postsSitemapQuery, postSlugsQuery } from "./queries";
import { buildPostSearchParams } from "./search";
import type { Post, PostListItem } from "./types";

export type PostsPageResult = {
  posts: PostListItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

export async function getPostsPage({
  page = 0,
  limit = POSTS_PAGE_SIZE,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PostsPageResult> {
  const sanity = getSanityClient();
  if (!sanity) {
    return { posts: [], total: 0, page, limit, hasMore: false };
  }

  const { search: normalizedSearch, titlePattern, tagPattern } = buildPostSearchParams(search);
  const start = page * limit;
  const end = start + limit;

  const result = await sanity.fetch<{ posts: PostListItem[]; total: number }>(
    postsPaginatedQuery,
    { search: normalizedSearch, titlePattern, tagPattern, start, end },
    { next: { tags: ["posts"] } }
  );

  const posts = result.posts ?? [];
  const total = result.total ?? 0;

  return {
    posts,
    total,
    page,
    limit,
    hasMore: start + posts.length < total,
  };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const sanity = getSanityClient();
  if (!sanity) return null;

  return sanity.fetch<Post | null>(
    postBySlugQuery,
    { slug },
    { next: { tags: [`post:${slug}`] } }
  );
}

export async function getPostSlugs(): Promise<string[]> {
  const sanity = getSanityClient();
  if (!sanity) return [];

  const rows = await sanity.fetch<{ slug: string }[]>(postSlugsQuery);
  return rows.map((row) => row.slug).filter(Boolean);
}

export async function getPostsForSitemap(): Promise<{ slug: string; publishedAt: string }[]> {
  const sanity = getSanityClient();
  if (!sanity) return [];

  return sanity.fetch(postsSitemapQuery);
}
