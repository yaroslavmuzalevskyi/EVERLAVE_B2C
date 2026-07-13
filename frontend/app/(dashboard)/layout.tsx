"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/components/auth/AuthProvider";

const navItems = [
  { label: "Products", href: "/admin/products" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Blogs", href: "/admin/blogs" },
  { label: "Blog Categories", href: "/admin/blog-categories" },
];

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-pr_dg text-pr_w">
      <div className="text-center">
        <h1 className="text-4xl font-semibold">404</h1>
        <p className="mt-2 text-sm text-pr_w/60">This page could not be found.</p>
        <Link href="/" className="mt-4 inline-block text-sm text-pr_lg hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAdmin, isAuthenticated, isInitializing } = useAuth();

  // While auth state is loading, render nothing to avoid flash
  if (isInitializing) return null;

  // Non-admin (or unauthenticated) users see a 404 — admin URLs look broken
  if (!isAuthenticated || !isAdmin) {
    return <NotFound />;
  }

  return (
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
  );
}
