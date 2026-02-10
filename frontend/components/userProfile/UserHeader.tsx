"use client";

import Link from "next/link";
import { LogOut, ShoppingCart, User } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";

type UserHeaderProps = {
  activeTab: "profile" | "orders";
  userName: string;
};

export default function UserHeader({ activeTab, userName }: UserHeaderProps) {
  const { logout } = useAuth();

  return (
    <div className="rounded-2xl bg-pr_w px-6 py-5">
      <p className="text-sm text-pr_dg/70">Good morning!</p>
      <div className="mt-1 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-xl font-semibold">{userName}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/user_profile/profile"
            className={cn(
              "flex items-center gap-2 rounded-full border px-5 py-2 text-sm",
              activeTab === "profile"
                ? "border-pr_dg bg-pr_dg text-pr_w"
                : "border-pr_dg/40 text-pr_dg",
            )}
          >
            Profile <User className="h-4 w-4" />
          </Link>
          <Link
            href="/user_profile/orders"
            className={cn(
              "flex items-center gap-2 rounded-full border px-5 py-2 text-sm",
              activeTab === "orders"
                ? "border-pr_dg bg-pr_dg text-pr_w"
                : "border-pr_dg/40 text-pr_dg",
            )}
          >
            Orders <ShoppingCart className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 rounded-full border border-pr_dg/40 px-5 py-2 text-sm text-pr_dg"
          >
            Log out <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
