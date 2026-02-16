"use client";

import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

export default function Modal({ isOpen, onClose, children, className }: ModalProps) {
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
    <div className="fixed inset-0 z-[120] overflow-y-auto">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <div className="relative flex min-h-full items-start justify-center p-4 sm:items-center">
        <div
          className={cn(
            "relative w-full max-w-5xl max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[32px] bg-pr_w p-6 text-pr_dg shadow-2xl",
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
