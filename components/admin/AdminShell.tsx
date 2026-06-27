"use client";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="admin-shell relative min-h-screen">
      <p className="admin-shell-badge" aria-hidden="true">
        Admin
      </p>
      {children}
    </div>
  );
}
