import { signIn } from "@/lib/auth";

type AdminLoginProps = {
  redirectTo?: string;
};

export function AdminLogin({ redirectTo = "/blog/admin" }: AdminLoginProps) {
  return (
    <div className="min-h-screen px-4 py-28 md:px-8">
      <div className="mx-auto max-w-lg text-center">
        <p className="hud-label mb-4">{"// ADMIN"}</p>
        <h1 className="font-display text-3xl font-bold text-text-primary">Área administrativa</h1>
        <p className="mt-4 text-text-secondary">
          Faça login com GitHub para moderar comentários e gerir posts.
        </p>
        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signIn("github", { redirectTo });
          }}
        >
          <button
            type="submit"
            className="admin-btn font-mono rounded-full px-6 py-3 text-xs tracking-widest uppercase"
          >
            Entrar com GitHub
          </button>
        </form>
      </div>
    </div>
  );
}
