"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

type RequireAuthProps = {
  children: React.ReactNode;
};

export default function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    if (isInitializing) return;
    if (!isAuthenticated) {
      const query = searchParams?.toString();
      const next = query ? `${pathname}?${query}` : pathname;
      router.replace(`/signin?next=${encodeURIComponent(next)}`);
    }
  }, [isAuthenticated, isInitializing, pathname, searchParams, router]);

  if (isInitializing || !isAuthenticated) return null;

  return <>{children}</>;
}
