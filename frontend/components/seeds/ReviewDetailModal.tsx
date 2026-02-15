"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

export type ReviewDetail = {
  name: string;
  rating: number;
  text: string;
  images?: string[];
  createdAt?: string;
};

type ReviewDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  review?: ReviewDetail | null;
};

export default function ReviewDetailModal({
  isOpen,
  onClose,
  review,
}: ReviewDetailModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = review?.images ?? [];

  useEffect(() => {
    if (isOpen) setActiveIndex(0);
  }, [isOpen, review?.images]);

  if (!review) return null;

  const mainImage = images[activeIndex];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-pr_dg px-4 py-2 text-xs font-semibold text-pr_w"
        >
          Close
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl bg-sr_dg/90 p-4">
          {mainImage ? (
            <img
              src={mainImage}
              alt=""
              className="h-[320px] w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="h-[320px] w-full rounded-2xl bg-sr_dg" />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm font-semibold">
              <span className="h-8 w-8 rounded-full bg-sr_dg" />
              {review.name}
            </div>
            <div className="text-sm text-pr_dg/70">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </div>
          </div>

          {review.createdAt ? (
            <p className="text-xs text-pr_dg/60">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          ) : null}

          <p className="text-sm text-pr_dg/80">{review.text}</p>

          {images.length > 1 ? (
            <div className="grid grid-cols-3 gap-3">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "rounded-xl border p-1",
                    index === activeIndex
                      ? "border-pr_dg"
                      : "border-transparent hover:border-pr_dg/40",
                  )}
                >
                  <img
                    src={image}
                    alt=""
                    className="h-20 w-full rounded-lg object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
