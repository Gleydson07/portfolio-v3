"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { BlogFiltersSidebar } from "@/components/blog/BlogFiltersSidebar";
import { PostCard } from "@/components/blog/PostCard";
import { POSTS_PAGE_SIZE } from "@/lib/blog/constants";
import { usePerfMode } from "@/lib/hooks/usePerfMode";
import type { PostsPageResult } from "@/lib/sanity/fetch";
import type { PostListItem } from "@/lib/sanity/types";

type BlogPostListProps = {
  initialPosts: PostListItem[];
  initialHasMore: boolean;
  initialTotal: number;
  availableTags: string[];
};

type PostFilters = {
  title: string;
  tag: string;
};

async function fetchPostsPage(page: number, filters: PostFilters): Promise<PostsPageResult> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(POSTS_PAGE_SIZE),
  });

  if (filters.title) params.set("q", filters.title);
  if (filters.tag) params.set("tag", filters.tag);

  const response = await fetch(`/api/blog/posts?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar os posts.");
  }

  return response.json();
}

export function BlogPostList({
  initialPosts,
  initialHasMore,
  initialTotal,
  availableTags,
}: BlogPostListProps) {
  const shouldReduceMotion = useReducedMotion();
  const { effectsEnabled } = usePerfMode();
  const animatePosts = effectsEnabled && !shouldReduceMotion;

  const [titleQuery, setTitleQuery] = useState("");
  const [debouncedTitle, setDebouncedTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [posts, setPosts] = useState(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadingRef = useRef(false);
  const pageRef = useRef(0);
  const hasMoreRef = useRef(initialHasMore);
  const filtersRef = useRef<PostFilters>({ title: "", tag: "" });
  const skipInitialLoadRef = useRef(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedTitle(titleQuery), 300);
    return () => window.clearTimeout(timer);
  }, [titleQuery]);

  const loadPage = useCallback(async (nextPage: number, filters: PostFilters, replace: boolean) => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchPostsPage(nextPage, filters);

      setPosts((current) => (replace ? result.posts : [...current, ...result.posts]));
      setHasMore(result.hasMore);
      setTotal(result.total);

      pageRef.current = result.page;
      hasMoreRef.current = result.hasMore;
      filtersRef.current = filters;
    } catch {
      setError("Não foi possível carregar os posts.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const filters = { title: debouncedTitle, tag: selectedTag };

    if (skipInitialLoadRef.current && filters.title === "" && filters.tag === "") {
      skipInitialLoadRef.current = false;
      return;
    }

    loadPage(0, filters, true);
  }, [debouncedTitle, selectedTag, loadPage]);

  const loadMore = useCallback(() => {
    if (!hasMoreRef.current || loadingRef.current) return;
    loadPage(pageRef.current + 1, filtersRef.current, false);
  }, [loadPage]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "240px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore, posts.length]);

  const hasActiveFilters = debouncedTitle.length > 0 || selectedTag.length > 0;

  const showEmptyState = !loading && posts.length === 0;

  const handleTagClick = (tag: string) => {
    setSelectedTag((current) => (current === tag ? "" : tag));
  };

  const handleClearTag = () => {
    setSelectedTag("");
  };

  const motionProps = animatePosts
    ? {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
      }
    : {};

  const postsContent = (
    <>
      {error && (
        <p className="font-mono mb-6 text-xs tracking-widest text-red-400 uppercase">{error}</p>
      )}

      {showEmptyState ? (
        hasActiveFilters ? (
          <div className="glass-panel flex min-h-40 w-full items-center justify-center rounded-2xl">
            <p className="font-mono text-center text-xs tracking-widest text-text-secondary uppercase">
              Nenhum post encontrado.
            </p>
          </div>
        ) : (
          <p className="font-mono text-xs tracking-widest text-text-secondary uppercase">
            Nenhum post publicado ainda.
          </p>
        )
      ) : (
        <>
          <div className="flex flex-col gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                {...motionProps}
                transition={{
                  ...(motionProps.transition ?? {}),
                  delay: animatePosts ? index * 0.06 : 0,
                }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>

          {hasMore && <div ref={sentinelRef} className="h-px" aria-hidden="true" />}

          {loading && (
            <p className="font-mono mt-8 text-center text-xs tracking-widest text-text-secondary uppercase">
              Carregando...
            </p>
          )}

          {!loading && hasMore && (
            <p className="font-mono mt-8 text-center text-xs tracking-widest text-text-secondary/70 uppercase">
              {posts.length} de {total}
            </p>
          )}
        </>
      )}
    </>
  );

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
      <BlogFiltersSidebar
        query={titleQuery}
        onQueryChange={setTitleQuery}
        selectedTag={selectedTag}
        tags={availableTags}
        onTagClick={handleTagClick}
        onClearTags={handleClearTag}
      />
      <div className="min-w-0 flex-1">{postsContent}</div>
    </div>
  );
}
