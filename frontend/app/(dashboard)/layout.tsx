"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import RequireAuth from "@/components/auth/RequireAuth";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/components/auth/AuthProvider";

const navItems = [
  { label: "Products", href: "/admin/products" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAdmin, isInitializing } = useAuth();

  if (!isInitializing && !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pr_dg text-pr_w">
        <div className="text-center">
          <p className="text-xl font-semibold">Access Denied</p>
          <p className="mt-2 text-sm text-pr_w/60">You do not have admin privileges.</p>
          <Link href="/" className="mt-4 inline-block text-sm text-pr_lg hover:underline">
            Back to site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-pr_dg text-pr_w">
        <header className="border-b border-pr_w/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/admin/products">
                <Logo />
              </Link>
              <span className="rounded-full border border-pr_w/20 px-3 py-1 text-xs text-pr_w/60">
                Admin
              </span>
              <nav className="flex gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm transition ${
                      pathname?.startsWith(item.href)
                        ? "text-pr_w font-semibold"
                        : "text-pr_w/60 hover:text-pr_w"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <Link href="/" className="text-sm text-pr_w/60 hover:text-pr_w">
              Back to site
            </Link>
          </div>
        </header>
        <main className="px-6 py-8">{children}</main>
      </div>
    </RequireAuth>
  );
}
