"use client";

import { useMemo } from "react";

type BlogTagListProps = {
  tags: string[];
  selectedTag: string;
  onTagClick: (tag: string) => void;
  onClear: () => void;
};

export function BlogTagList({ tags, selectedTag, onTagClick, onClear }: BlogTagListProps) {
  const sortedTags = useMemo(
    () => [...tags].sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" })),
    [tags]
  );

  if (sortedTags.length === 0) return null;

  return (
    <div>
      <p className="hud-label mb-4">Tags</p>

      <nav aria-label="Filtrar por tag">
        <ul className="flex max-h-64 flex-col gap-0.5 overflow-y-auto pr-1 lg:max-h-[calc(100vh-18rem)]">
          <li>
            <button
              type="button"
              onClick={onClear}
              aria-pressed={selectedTag === ""}
              className={`font-mono w-full rounded-lg px-3 py-2 text-left text-xs tracking-wide transition-colors ${
                selectedTag === ""
                  ? "border-l-2 border-accent bg-accent/10 pl-[10px] text-accent"
                  : "border-l-2 border-transparent text-text-secondary hover:bg-white/5 hover:text-text-primary"
              }`}
            >
              Todas
            </button>
          </li>

          {sortedTags.map((tag) => {
            const isActive = selectedTag === tag;

            return (
              <li key={tag}>
                <button
                  type="button"
                  onClick={() => onTagClick(tag)}
                  aria-pressed={isActive}
                  className={`font-mono w-full rounded-lg px-3 py-2 text-left text-xs tracking-wide transition-colors ${
                    isActive
                      ? "border-l-2 border-accent bg-accent/10 pl-[10px] text-accent"
                      : "border-l-2 border-transparent text-text-secondary hover:bg-white/5 hover:text-text-primary"
                  }`}
                >
                  {tag}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
