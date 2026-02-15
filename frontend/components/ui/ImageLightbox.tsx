"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

type ImageLightboxProps = {
  images: string[];
  isOpen: boolean;
  initialIndex?: number;
  onClose: () => void;
  title?: string;
};

export default function ImageLightbox({
  images,
  isOpen,
  initialIndex = 0,
  onClose,
  title,
}: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) setIndex(initialIndex);
  }, [isOpen, initialIndex]);

  if (!isOpen || images.length === 0) return null;

  const current = images[index] ?? images[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-6xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title ?? "Photos"}</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-pr_dg px-4 py-2 text-xs font-semibold text-pr_w"
        >
          Close
        </button>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-2xl bg-sr_dg/90 p-4">
          <img
            src={current}
            alt=""
            className="h-[360px] w-full rounded-2xl object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 content-start">
          {images.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type="button"
              onClick={() => setIndex(idx)}
              className={cn(
                "rounded-xl border p-1 transition",
                idx === index
                  ? "border-pr_dg"
                  : "border-transparent hover:border-pr_dg/40",
              )}
            >
              <img
                src={img}
                alt=""
                className="h-28 w-full rounded-lg object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
