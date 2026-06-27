import type { Metadata } from "next";
import { CommentModerationPanel } from "@/components/admin/CommentModerationPanel";
import { auth, signIn, signOut } from "@/lib/auth";
import { listCommentsByStatus } from "@/lib/comments/moderate";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Curadoria de comentários",
  robots: { index: false, follow: false },
};

export default async function AdminCommentsPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="min-h-screen px-4 py-28 md:px-8">
        <div className="mx-auto max-w-lg text-center">
          <p className="hud-label mb-4">{"// ADMIN"}</p>
          <h1 className="font-display text-3xl font-bold text-text-primary">Curadoria</h1>
          <p className="mt-4 text-text-secondary">
            Faça login com GitHub para moderar comentários.
          </p>
          <form
            className="mt-8"
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/admin/comentarios" });
            }}
          >
            <button
              type="submit"
              className="font-mono rounded-full border border-accent/40 px-6 py-3 text-xs tracking-widest text-accent uppercase hover:bg-accent/10"
            >
              Entrar com GitHub
            </button>
          </form>
        </div>
      </div>
    );
  }

  const [pending, approved, rejected] = isSupabaseConfigured
    ? await Promise.all([
        listCommentsByStatus("pending"),
        listCommentsByStatus("approved"),
        listCommentsByStatus("rejected"),
      ])
    : [[], [], []];

  return (
    <div className="min-h-screen px-4 py-28 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="hud-label mb-4">{"// ADMIN"}</p>
            <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
              Curadoria de comentários
            </h1>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="font-mono text-xs tracking-widest text-text-secondary uppercase hover:text-accent"
            >
              Sair
            </button>
          </form>
        </div>

        {!isSupabaseConfigured ? (
          <p className="font-mono text-xs tracking-widest text-text-secondary uppercase">
            Supabase não configurado.
          </p>
        ) : (
          <CommentModerationPanel pending={pending} approved={approved} rejected={rejected} />
        )}
      </div>
    </div>
  );
}
