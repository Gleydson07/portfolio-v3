import { POSTS_PAGE_SIZE } from "@/lib/blog/constants";
import { getSanityClient } from "./client";
import {
  postBySlugQuery,
  postTagsQuery,
  postsByIdsQuery,
  postsPaginatedQuery,
  postsSitemapQuery,
  postSlugsQuery,
} from "./queries";
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
  title = "",
  tag = "",
}: {
  page?: number;
  limit?: number;
  title?: string;
  tag?: string;
}): Promise<PostsPageResult> {
  const sanity = getSanityClient();
  if (!sanity) {
    return { posts: [], total: 0, page, limit, hasMore: false };
  }

  const { titlePattern, tag: normalizedTag } = buildPostSearchParams(title, tag);
  const start = page * limit;
  const end = start + limit;

  const result = await sanity.fetch<{ posts: PostListItem[]; total: number }>(
    postsPaginatedQuery,
    { titlePattern, tag: normalizedTag, start, end },
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

export async function getAllPostTags(): Promise<string[]> {
  const sanity = getSanityClient();
  if (!sanity) return [];

  const tags = await sanity.fetch<string[]>(postTagsQuery, {}, { next: { tags: ["posts"] } });
  return (tags ?? []).filter(Boolean);
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

export type PostPath = {
  slug: string;
  title: string;
};

export async function getPostPathsByIds(ids: string[]): Promise<Record<string, PostPath>> {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) return {};

  const sanity = getSanityClient();
  if (!sanity) return {};

  const rows = await sanity.fetch<{ _id: string; slug: string; title: string }[]>(postsByIdsQuery, {
    ids: uniqueIds,
  });

  return Object.fromEntries(
    rows
      .filter((row) => row._id && row.slug)
      .map((row) => [row._id, { slug: row.slug, title: row.title }])
  );
}
