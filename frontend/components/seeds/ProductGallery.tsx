"use client";

import { useMemo, useState } from "react";
import ImageLightbox from "@/components/ui/ImageLightbox";

type ProductGalleryProps = {
  title: string;
  images?: Array<{ url: string }>;
};

export default function ProductGallery({ title, images = [] }: ProductGalleryProps) {
  const urls = useMemo(
    () => images.map((image) => image.url).filter(Boolean),
    [images],
  );
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = (idx: number) => {
    setIndex(idx);
    setIsOpen(true);
  };

  return (
    <>
      {urls.length > 0 ? (
        <button
          type="button"
          onClick={() => openAt(0)}
          className="block w-full overflow-hidden rounded-2xl bg-sr_dg/70"
        >
          <img
            src={urls[0]}
            alt={title}
            className="block h-[320px] w-full object-contain sm:h-[420px]"
          />
        </button>
      ) : (
        <div className="h-[320px] w-full rounded-2xl bg-pr_w sm:h-[420px]" />
      )}
      <div className="mt-4 flex gap-4">
        {urls.length > 1 ? (
          urls.slice(1, 4).map((url, idx) => (
            <button
              key={`${url}-${idx}`}
              type="button"
              onClick={() => openAt(idx + 1)}
              className="h-16 w-16 overflow-hidden rounded-xl bg-sr_dg/70"
            >
              <img src={url} alt="" className="h-full w-full object-contain" />
            </button>
          ))
        ) : (
          [0, 1, 2].map((placeholder) => (
            <div key={placeholder} className="h-16 w-16 rounded-xl bg-pr_w" />
          ))
        )}
      </div>

      <ImageLightbox
        images={urls}
        isOpen={isOpen}
        initialIndex={index}
        onClose={() => setIsOpen(false)}
        title={title}
      />
    </>
  );
}
