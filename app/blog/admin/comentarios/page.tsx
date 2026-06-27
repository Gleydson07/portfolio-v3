import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminSubpageHeader } from "@/components/admin/AdminSubpageHeader";
import { CommentModerationPanel } from "@/components/admin/CommentModerationPanel";
import { auth } from "@/lib/auth";
import { listCommentsByStatus } from "@/lib/comments/moderate";
import type { Comment } from "@/lib/comments/types";
import { getPostPathsByIds } from "@/lib/sanity/fetch";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Curadoria de comentários",
  robots: { index: false, follow: false },
};

export default async function AdminCommentsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/blog/admin");
  }

  const [pending, approved, rejected] = isSupabaseConfigured
    ? await Promise.all([
        listCommentsByStatus("pending"),
        listCommentsByStatus("approved"),
        listCommentsByStatus("rejected"),
      ])
    : [[], [], []];

  const allComments = [...pending, ...approved, ...rejected] as Comment[];
  const postIds = allComments.map((comment) => comment.post_id).filter(Boolean) as string[];
  const postPaths = await getPostPathsByIds(postIds);

  return (
    <div className="min-h-screen px-4 py-28 md:px-8">
      <div className="mx-auto max-w-5xl">
        <AdminSubpageHeader
          title="Curadoria de comentários"
          description="Aprove, rejeite ou revise comentários enviados nos posts."
        />

        {!isSupabaseConfigured ? (
          <p className="font-mono text-xs tracking-widest text-text-secondary uppercase">
            Supabase não configurado.
          </p>
        ) : (
          <CommentModerationPanel
            pending={pending}
            approved={approved}
            rejected={rejected}
            postPaths={postPaths}
          />
        )}
      </div>
    </div>
  );
}
