"use client";

import { cn } from "@/lib/utils";

type PrimaryButtonProps = {
  children: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
};

export default function PrimaryButton({
  children,
  disabled,
  loading,
  onClick,
  type = "button",
  className,
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "w-full rounded-full bg-pr_dg px-4 py-3 text-sm font-semibold text-pr_w transition hover:bg-sr_dg disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
