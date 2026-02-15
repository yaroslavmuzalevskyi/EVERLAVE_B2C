"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

export default function Modal({ isOpen, onClose, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <div
        className={cn(
          "relative w-full max-w-5xl rounded-[32px] bg-pr_w p-6 text-pr_dg shadow-2xl",
          className,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
