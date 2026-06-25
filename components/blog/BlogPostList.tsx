"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PostCard } from "@/components/blog/PostCard";
import { POSTS_PAGE_SIZE } from "@/lib/blog/constants";
import type { PostsPageResult } from "@/lib/sanity/fetch";
import type { PostListItem } from "@/lib/sanity/types";

type BlogPostListProps = {
  initialPosts: PostListItem[];
  initialHasMore: boolean;
  initialTotal: number;
};

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-accent"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

async function fetchPostsPage(page: number, search: string): Promise<PostsPageResult> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(POSTS_PAGE_SIZE),
    q: search,
  });

  const response = await fetch(`/api/blog/posts?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar os posts.");
  }

  return response.json();
}

export function BlogPostList({ initialPosts, initialHasMore, initialTotal }: BlogPostListProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [posts, setPosts] = useState(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadingRef = useRef(false);
  const pageRef = useRef(0);
  const hasMoreRef = useRef(initialHasMore);
  const searchRef = useRef("");
  const skipInitialSearchRef = useRef(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  const loadPage = useCallback(async (nextPage: number, search: string, replace: boolean) => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchPostsPage(nextPage, search);

      setPosts((current) => (replace ? result.posts : [...current, ...result.posts]));
      setHasMore(result.hasMore);
      setTotal(result.total);

      pageRef.current = result.page;
      hasMoreRef.current = result.hasMore;
      searchRef.current = search;
    } catch {
      setError("Não foi possível carregar os posts.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (skipInitialSearchRef.current && debouncedQuery === "") {
      skipInitialSearchRef.current = false;
      return;
    }

    loadPage(0, debouncedQuery, true);
  }, [debouncedQuery, loadPage]);

  const loadMore = useCallback(() => {
    if (!hasMoreRef.current || loadingRef.current) return;
    loadPage(pageRef.current + 1, searchRef.current, false);
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

  const showEmptyState = !loading && posts.length === 0;
  const isSearching = debouncedQuery.length > 0;

  return (
    <div>
      <div className="mb-8 flex justify-end">
        <div className="glass-panel flex w-full max-w-6xl items-center gap-3 rounded-full border border-glass-border px-4 py-3 transition-colors focus-within:border-accent/40 sm:w-auto sm:min-w-[40rem]">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por título ou tag"
            className="font-mono min-w-0 flex-1 bg-transparent text-sm tracking-wide text-text-primary outline-none placeholder:text-text-secondary"
            aria-label="Buscar posts por título ou tag"
          />
        </div>
      </div>

      {error && (
        <p className="font-mono mb-6 text-xs tracking-widest text-red-400 uppercase">{error}</p>
      )}

      {showEmptyState ? (
        <p className="font-mono text-xs tracking-widest text-text-secondary uppercase">
          {isSearching ? "Nenhum post encontrado." : "Nenhum post publicado ainda."}
        </p>
      ) : (
        <>
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
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
    </div>
  );
}
