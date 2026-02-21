"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCardPurchase from "@/components/cart/ProductCardPurchase";
import { cn } from "@/lib/utils";
import { type ProductHoverInfoRow } from "@/lib/productHoverInfo";
import type { ProductPurchaseOption } from "@/services/products";

type NewProductCardProps = {
  title: string;
  description: string;
  price: string;
  hoverInfo?: ProductHoverInfoRow[];
  isNew?: boolean;
  badgeLabel?: string;
  badgeClassName?: string;
  href?: string;
  showButton?: boolean;
  imageUrl?: string;
  productId?: string;
  purchaseOptions?: ProductPurchaseOption[];
};

export default function ProductCard({
  title,
  description,
  price,
  hoverInfo,
  isNew = true,
  badgeLabel = "New!",
  badgeClassName = "bg-pr_y text-pr_dg",
  href,
  showButton = true,
  imageUrl,
  productId,
  purchaseOptions,
}: NewProductCardProps) {
  const resolvedHref =
    href ?? (productId ? `/products/${productId}` : undefined);

  const hasHoverInfo = Boolean(hoverInfo?.length);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: none), (pointer: coarse)");
    const syncTouchMode = () => setIsTouchDevice(mediaQuery.matches);
    syncTouchMode();

    mediaQuery.addEventListener("change", syncTouchMode);
    return () => mediaQuery.removeEventListener("change", syncTouchMode);
  }, []);

  const content = (
    <>
      <div className="relative">
        {isNew && (
          <span
            className={cn(
              "absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-xs font-semibold shadow-sm",
              badgeClassName,
            )}
          >
            {badgeLabel}
          </span>
        )}

        <div className="relative overflow-hidden rounded-2xl">
          {imageUrl ? (
            <div
              className={cn(
                "h-[400px] w-full transform-gpu transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
                hasHoverInfo && "scale-100",
                hasHoverInfo && !isTouchDevice && "group-hover:scale-105",
                hasHoverInfo && isPreviewOpen && "scale-105",
              )}
            >
              <img
                src={imageUrl}
                alt={title}
                className={cn(
                  "h-full w-full rounded-2xl object-cover transition-[filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[filter]",
                  hasHoverInfo && "blur-0",
                  hasHoverInfo && !isTouchDevice && "group-hover:blur-[2px]",
                  hasHoverInfo && isPreviewOpen && "blur-[2px]",
                )}
              />
            </div>
          ) : (
            <div className="h-[400px] rounded-2xl bg-pr_w/60" />
          )}

          {hasHoverInfo ? (
            <div className="pointer-events-none absolute inset-0">
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl bg-pr_dg/20 opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  !isTouchDevice && "group-hover:opacity-100",
                  isPreviewOpen && "opacity-100",
                )}
              />

              {/* Animate wrapper only */}
              <div
                className={cn(
                  "absolute inset-x-3 bottom-3 origin-bottom transform-gpu",
                  "opacity-0 translate-y-3 scale-[0.985]",
                  "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  !isTouchDevice &&
                    "group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100",
                  isPreviewOpen && "opacity-100 translate-y-0 scale-100",
                  "will-change-transform",
                )}
              >
                {/* Keep expensive backdrop blur on a non-animated child */}
                <div className="rounded-xl border border-white/20 bg-pr_dg/65 p-3 backdrop-blur-sm">
                  <div className="flex flex-col gap-1">
                    {hoverInfo!.map((item, index) => (
                      <div
                        key={`${item.label}-${index}`}
                        className="flex items-center justify-between text-xs text-pr_w/95"
                      >
                        <span className="font-semibold">{item.label}</span>
                        <span className="text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="text-base font-semibold text-pr_w">{title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-pr_w/70">{description}</p>
        <p className="mt-2 text-lg font-semibold text-pr_w">{price}</p>
      </div>
    </>
  );

  return (
    <div className="group flex h-full flex-col">
      {resolvedHref ? (
        <Link
          href={resolvedHref}
          className="flex flex-1 flex-col"
          onClick={(event) => {
            if (!hasHoverInfo || !isTouchDevice) return;
            if (!isPreviewOpen) {
              event.preventDefault();
              setIsPreviewOpen(true);
            }
          }}
        >
          {content}
        </Link>
      ) : (
        content
      )}

      {showButton && (
        <ProductCardPurchase
          productId={productId}
          fallbackPrice={price}
          options={purchaseOptions}
        />
      )}
    </div>
  );
}
