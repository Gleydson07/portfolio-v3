import { CommentForm } from "@/components/blog/CommentForm";
import { CommentList } from "@/components/blog/CommentList";
import type { PublicComment } from "@/lib/comments/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type CommentsSectionProps = {
  postSlug: string;
  postTitle: string;
  comments: PublicComment[];
};

export function CommentsSection({ postSlug, postTitle, comments }: CommentsSectionProps) {
  return (
    <section className="mt-16 border-t border-glass-border pt-12">
      <p className="hud-label mb-6">{"// COMENTÁRIOS"}</p>

      <div className="glass-panel mb-10 rounded-2xl p-6 md:p-8">
        <h3 className="font-mono mb-6 text-xs tracking-widest text-text-secondary uppercase">
          Deixe seu comentário
        </h3>
        <CommentForm
          postSlug={postSlug}
          postTitle={postTitle}
          disabled={!isSupabaseConfigured}
        />
      </div>

      <h2 className="font-display mb-8 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
        Comentários ({comments.length})
      </h2>

      <CommentList comments={comments} />
    </section>
  );
}
