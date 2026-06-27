"use client";

import { useState } from "react";
import { CommentBody } from "@/components/blog/CommentBody";
import type { PublicComment } from "@/lib/comments/types";

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(date));
}

function displayName(name: string | null) {
  const trimmed = name?.trim();
  return trimmed ? trimmed : "Anônimo";
}

type CommentListItemProps = {
  comment: PublicComment;
};

function ChevronIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-4 w-4 text-text-secondary transition-transform duration-200 ${
        collapsed ? "-rotate-90" : ""
      }`}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function CommentListItem({ comment }: CommentListItemProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <li className="glass-panel rounded-2xl p-6">
      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        aria-expanded={!collapsed}
        className="flex w-full items-baseline justify-between gap-4 text-left transition-colors hover:text-accent"
      >
        <span className="font-display text-lg font-semibold text-text-primary">{displayName(comment.author_name)}</span>
        <span className="flex shrink-0 items-center gap-3">
          <time
            dateTime={comment.created_at}
            className="font-mono text-xs tracking-widest text-accent uppercase"
          >
            {formatDateTime(comment.created_at)}
          </time>
          <ChevronIcon collapsed={collapsed} />
          <span className="sr-only">{collapsed ? "Expandir comentário" : "Recolher comentário"}</span>
        </span>
      </button>

      {!collapsed && <CommentBody body={comment.body} className="mt-3" />}
    </li>
  );
}
