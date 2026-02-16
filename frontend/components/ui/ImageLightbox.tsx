"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

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
  const [mounted, setMounted] = useState(false);
  const hasMultiple = images.length > 1;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) setIndex(initialIndex);
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (!hasMultiple) return;

      if (event.key === "ArrowLeft") {
        setIndex((prev) => (prev - 1 + images.length) % images.length);
      }

      if (event.key === "ArrowRight") {
        setIndex((prev) => (prev + 1) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasMultiple, images.length, isOpen, onClose]);

  if (!mounted || !isOpen || images.length === 0) return null;

  const current = images[index] ?? images[0];
  const goPrev = () => {
    if (!hasMultiple) return;
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  const goNext = () => {
    if (!hasMultiple) return;
    setIndex((prev) => (prev + 1) % images.length);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[999] bg-black/90"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Image viewer"}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        className="absolute right-4 top-4 z-20 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/25"
      >
        Close
      </button>

      {hasMultiple ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            goPrev();
          }}
          className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/15 px-3 py-2 text-2xl leading-none text-white backdrop-blur transition hover:bg-white/25 sm:left-6"
          aria-label="Previous image"
        >
          ‹
        </button>
      ) : null}

      {hasMultiple ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            goNext();
          }}
          className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/15 px-3 py-2 text-2xl leading-none text-white backdrop-blur transition hover:bg-white/25 sm:right-6"
          aria-label="Next image"
        >
          ›
        </button>
      ) : null}

      <div className="flex h-full w-full items-center justify-center p-4 sm:p-8">
        <div
          className="flex max-h-full max-w-full items-center justify-center"
          onClick={(event) => event.stopPropagation()}
        >
          <img
            src={current}
            alt={title ?? "Product image"}
            className="h-auto w-auto max-h-[90vh] max-w-[94vw] object-contain"
          />
        </div>
      </div>

      {hasMultiple ? (
        <div
          className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-xs text-white backdrop-blur"
          onClick={(event) => event.stopPropagation()}
        >
          {index + 1} / {images.length}
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
