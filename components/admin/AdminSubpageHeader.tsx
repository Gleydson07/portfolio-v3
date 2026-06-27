import Link from "next/link";
import { AdminSignOutButton } from "@/components/admin/AdminSignOutButton";

type AdminSubpageHeaderProps = {
  title: string;
  description?: string;
};

export function AdminSubpageHeader({ title, description }: AdminSubpageHeaderProps) {
  return (
    <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
      <div>
        <Link
          href="/blog/admin"
          className="admin-btn-ghost font-mono text-xs tracking-widest uppercase"
        >
          ← Admin
        </Link>
        <p className="hud-label mb-4 mt-6">{"// ADMIN"}</p>
        <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl">{title}</h1>
        {description && <p className="mt-3 text-text-secondary">{description}</p>}
      </div>
      <AdminSignOutButton />
    </div>
  );
}
