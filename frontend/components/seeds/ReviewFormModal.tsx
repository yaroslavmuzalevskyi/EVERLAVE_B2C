"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

type ReviewFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  rating: number;
  onRatingChange: (value: number) => void;
  text: string;
  onTextChange: (value: string) => void;
  images: string[];
  onImagesChange: (images: string[]) => void;
  onSubmit: () => void;
  loading?: boolean;
  error?: string;
};

export default function ReviewFormModal({
  isOpen,
  onClose,
  rating,
  onRatingChange,
  text,
  onTextChange,
  images,
  onImagesChange,
  onSubmit,
  loading,
  error,
}: ReviewFormModalProps) {
  const [urlInput, setUrlInput] = useState("");

  const handleAddImage = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    onImagesChange([...images, trimmed].slice(0, 5));
    setUrlInput("");
  };

  const handleRemove = (index: number) => {
    onImagesChange(images.filter((_, idx) => idx !== index));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold">Write a review</h3>
          <p className="mt-1 text-sm text-pr_dg/70">Give your rate</p>
          <div className="mt-2 flex gap-2">
            {Array.from({ length: 5 }, (_, index) => index + 1).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onRatingChange(value)}
                className={cn(
                  "text-lg transition",
                  rating >= value ? "text-pr_dg" : "text-pr_dg/30",
                )}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <textarea
            value={text}
            onChange={(event) => onTextChange(event.target.value)}
            placeholder="What should other customers know?"
            className="min-h-[140px] w-full rounded-2xl border border-pr_dg/30 bg-pr_w px-4 py-3 text-sm text-pr_dg outline-none"
          />
        </div>

        <div>
          <p className="text-sm font-semibold">Share a photo</p>
          <div className="mt-3 rounded-2xl border border-dashed border-pr_dg/40 p-4 text-sm text-pr_dg/60">
            Click here to upload your image (paste URL below)
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <input
              value={urlInput}
              onChange={(event) => setUrlInput(event.target.value)}
              placeholder="Image URL"
              className="flex-1 rounded-full border border-pr_dg/30 px-4 py-2 text-sm text-pr_dg outline-none"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="rounded-full bg-pr_dg px-4 py-2 text-sm font-semibold text-pr_w"
            >
              Add
            </button>
          </div>

          {images.length > 0 ? (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {images.map((image, index) => (
                <div key={`${image}-${index}`} className="relative">
                  <img
                    src={image}
                    alt=""
                    className="h-20 w-full rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute -right-2 -top-2 rounded-full bg-pr_dg px-2 py-1 text-xs text-pr_w"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {error ? <p className="text-xs text-pr_dr">{error}</p> : null}

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-pr_dg/30 px-5 py-2 text-sm font-semibold text-pr_dg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="rounded-full bg-pr_dg px-5 py-2 text-sm font-semibold text-pr_w disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
