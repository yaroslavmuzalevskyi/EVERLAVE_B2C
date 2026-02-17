"use client";

import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative h-full overflow-y-auto overscroll-contain p-4 sm:p-6">
        <div
          className={cn(
            "mx-auto w-full max-w-5xl rounded-[32px] bg-pr_w p-6 text-pr_dg shadow-2xl",
            className,
          )}
          onClick={(event) => event.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
