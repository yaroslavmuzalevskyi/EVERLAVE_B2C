"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "evervale_age_gate_v1";

export default function AgeGateModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const status = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(status !== "allowed");
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "allowed");
    }
    setIsOpen(false);
  };

  const handleDecline = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.location.replace("https://www.google.com/search?q=kitties&udm=2");
      return;
    }
    setIsOpen(false);
  };

  if (isOpen === null || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-2xl px-4">
      <div className="w-full max-w-4xl rounded-[36px] bg-sr_dg px-8 py-12 text-center text-pr_w shadow-2xl sm:px-12 sm:py-14">
        <h2 className="text-3xl font-semibold sm:text-4xl">Welcome!</h2>
        <p className="mt-4 text-md text-pr_w/80 sm:text-xl">
          You must be at least 21 years old to enter this website.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
          <button
            type="button"
            onClick={handleDecline}
            className={cn(
              "w-full max-w-[220px] rounded-full bg-pr_w px-6 py-3 text-sm font-semibold text-sr_dg transition hover:opacity-90 sm:w-auto",
            )}
          >
            No, I am under 21
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="w-full max-w-[220px] rounded-full px-6 py-3 text-sm font-semibold text-pr_w transition hover:bg-pr_w/10 sm:w-auto"
          >
            Yes, I am 21+
          </button>
        </div>
      </div>
    </div>
  );
}
