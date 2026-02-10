"use client";

import type { ReactNode } from "react";

type AuthCardProps = {
  children: ReactNode;
};

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-[32px] bg-pr_w px-8 py-10 text-pr_dg shadow-[0_24px_60px_rgba(3,44,30,0.25)] sm:px-10">
      {children}
    </div>
  );
}
