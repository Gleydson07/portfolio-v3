import { signOut } from "@/lib/auth";

export function AdminSignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="admin-btn-ghost font-mono text-xs tracking-widest uppercase"
      >
        Sair
      </button>
    </form>
  );
}
