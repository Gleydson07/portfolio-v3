"use client";

import { BlogTagList } from "@/components/blog/BlogTagList";

type BlogFiltersSidebarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  selectedTag: string;
  tags: string[];
  onTagClick: (tag: string) => void;
  onClearTags: () => void;
};

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
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

export function BlogFiltersSidebar({
  query,
  onQueryChange,
  selectedTag,
  tags,
  onTagClick,
  onClearTags,
}: BlogFiltersSidebarProps) {
  return (
    <aside className="lg:w-52 lg:shrink-0 lg:sticky lg:top-28 lg:self-start">
      <div className="space-y-8">
        <div>
          <p className="hud-label mb-4">Buscar</p>
          <div className="glass-panel flex items-center gap-2.5 rounded-xl border border-glass-border px-3 py-2.5 transition-colors focus-within:border-accent/40">
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Título"
              className="font-mono min-w-0 flex-1 bg-transparent text-xs tracking-wide text-text-primary outline-none placeholder:text-text-secondary"
              aria-label="Buscar posts por título"
            />
          </div>
        </div>

        <BlogTagList
          tags={tags}
          selectedTag={selectedTag}
          onTagClick={onTagClick}
          onClear={onClearTags}
        />
      </div>
    </aside>
  );
}
