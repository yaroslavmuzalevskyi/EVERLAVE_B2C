"use client";

import { useMemo, useState } from "react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { cn } from "@/lib/utils";

type SeedVariantPurchaseProps = {
  productSlug: string;
  variants: Array<{ label: string; price: string }>;
};

function parseQtyFromLabel(label: string) {
  const match = label.trim().match(/^(\d+)\s*x$/i) ?? label.trim().match(/^(\d+)x$/i);
  if (!match) return 1;
  const qty = Number(match[1]);
  if (!Number.isFinite(qty) || qty < 1) return 1;
  return Math.trunc(qty);
}

export default function SeedVariantPurchase({
  productSlug,
  variants,
}: SeedVariantPurchaseProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const options = useMemo(
    () =>
      variants.map((variant) => ({
        ...variant,
        qty: parseQtyFromLabel(variant.label),
      })),
    [variants],
  );

  const selectedQty = options[selectedIndex]?.qty ?? 1;

  return (
    <>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((variant, index) => (
          <button
            key={`${variant.label}-${index}`}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs transition",
              selectedIndex === index
                ? "border-pr_dg bg-pr_dg text-pr_w"
                : "border-pr_dg/30 text-pr_dg",
            )}
          >
            {variant.label} {variant.price}
          </button>
        ))}
      </div>

      <AddToCartButton
        productId={productSlug}
        qty={selectedQty}
        variant="primary"
        className="mt-5 w-full"
      />
    </>
  );
}
