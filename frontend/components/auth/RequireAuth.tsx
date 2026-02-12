"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

type RequireAuthProps = {
  children: React.ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const disableAuth = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    if (disableAuth) return;
    if (isInitializing) return;
    if (!isAuthenticated) {
      const query = searchParams?.toString();
      const next = query ? `${pathname}?${query}` : pathname;
      router.replace(`/signin?next=${encodeURIComponent(next)}`);
    }
  }, [disableAuth, isAuthenticated, isInitializing, pathname, searchParams, router]);

  if (!disableAuth && (isInitializing || !isAuthenticated)) return null;

  return <>{children}</>;
}
