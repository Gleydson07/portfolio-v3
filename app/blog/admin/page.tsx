import type { Metadata } from "next";
import Link from "next/link";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";
import { auth } from "@/lib/auth";
import { listCommentsByStatus } from "@/lib/comments/moderate";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isSanityConfigured } from "@/sanity/env";

export const metadata: Metadata = {
  title: "Admin do blog",
  robots: { index: false, follow: false },
};

export default async function BlogAdminPage() {
  const session = await auth();

  if (!session?.user) {
    return <AdminLogin />;
  }

  const pendingCount = isSupabaseConfigured
    ? (await listCommentsByStatus("pending")).length
    : 0;

  return (
    <div className="min-h-screen px-4 py-28 md:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="hud-label mb-4">{"// ADMIN"}</p>
            <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
              Área administrativa
            </h1>
            <p className="mt-3 text-text-secondary">
              Escolha o que deseja gerir no blog.
            </p>
          </div>
          <AdminSignOutButton />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/blog/admin/comentarios"
            className="admin-card glass-panel group rounded-2xl p-6 md:p-8"
          >
            <p className="admin-kicker">Comentários</p>
            <h2 className="admin-card-title font-display mt-3 text-2xl font-bold text-text-primary">
              Moderar comentários
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Revise pendências, aprove ou rejeite mensagens enviadas nos posts.
            </p>
            {pendingCount > 0 && (
              <p className="font-mono mt-5 text-xs tracking-widest text-amber-300 uppercase">
                {pendingCount} pendente{pendingCount === 1 ? "" : "s"}
              </p>
            )}
          </Link>

          {isSanityConfigured ? (
            <Link
              href="/blog/admin/studio"
              className="admin-card glass-panel group rounded-2xl p-6 md:p-8"
            >
              <p className="admin-kicker">Posts</p>
              <h2 className="admin-card-title font-display mt-3 text-2xl font-bold text-text-primary">
                Gerir posts
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Abra o Studio para criar, editar e publicar artigos.
              </p>
            </Link>
          ) : (
            <div className="glass-panel rounded-2xl p-6 opacity-60 md:p-8">
              <p className="admin-kicker">Posts</p>
              <h2 className="font-display mt-3 text-2xl font-bold text-text-primary">Gerir posts</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Sanity não configurado neste ambiente.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
