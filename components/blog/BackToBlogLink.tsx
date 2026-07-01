"use client";

import Link from "next/link";
import { captureButtonClick } from "@/lib/analytics/track";

export function BackToBlogLink() {
  return (
    <Link
      href="/blog"
      onClick={() =>
        captureButtonClick({
          buttonId: "back_to_blog",
          buttonLabel: "Voltar ao blog",
          location: "blog_post",
          href: "/blog",
        })
      }
      className="font-mono mb-10 inline-flex items-center gap-2 text-xs tracking-widest text-text-secondary uppercase transition-colors hover:text-accent"
    >
      ← Voltar ao blog
    </Link>
  );
}
