"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  /** When false, clicking the backdrop does not close the modal. Default true. */
  closeOnBackdrop?: boolean;
  /** When true, render a close (×) icon in the top-right corner. Default false. */
  showCloseButton?: boolean;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  className,
  closeOnBackdrop = true,
  showCloseButton = false,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120]"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative h-full overflow-y-auto overscroll-contain p-4 sm:p-6">
        <div className="grid min-h-full place-items-center py-4 sm:py-6">
          <div
            className={cn(
              "relative mx-auto w-full max-w-5xl rounded-[32px] bg-pr_w p-6 text-pr_dg shadow-2xl",
              className,
            )}
            onClick={(event) => event.stopPropagation()}
          >
            {showCloseButton ? (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-pr_dg/20 bg-pr_w text-pr_dg/60 transition hover:bg-pr_dg/5 hover:text-pr_dg"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 5l10 10M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            ) : null}
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
