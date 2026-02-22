"use client";

import { useEffect, useId, useState } from "react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import Button from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";
import { addCartItem } from "@/services/cart";
import {
  fetchProductById,
  getProductPurchaseOptions,
  type ProductPurchaseOption,
} from "@/services/products";

type ProductCardPurchaseProps = {
  productId?: string;
  fallbackPrice: string;
  options?: ProductPurchaseOption[];
};

const REQUIRED_QTY_OPTIONS = [1, 5, 10, 15, 20];

function parseFallbackUnitPriceCents(fallbackPrice: string) {
  const match = fallbackPrice.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return 0;
  const amount = Number(match[1].replace(",", "."));
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return Math.round(amount * 100);
}

function formatFallbackPrice(priceCents: number, fallbackPrice: string) {
  const symbol = fallbackPrice.replace(/[\d\s.,]/g, "").trim() || "€";
  const amount = (priceCents / 100).toFixed(2);
  return symbol === "$" ? `${symbol}${amount}` : `${amount} ${symbol}`;
}

function ensureRequiredOptions(
  source: ProductPurchaseOption[],
  fallbackPrice: string,
) {
  const byQty = new Map(source.map((option) => [option.qty, option]));
  const baseOption = source.find(
    (option) => option.qty > 0 && option.priceCents > 0,
  );
  const baseUnitCents = baseOption
    ? Math.round(baseOption.priceCents / baseOption.qty)
    : parseFallbackUnitPriceCents(fallbackPrice);

  return REQUIRED_QTY_OPTIONS.map((qty) => {
    const existing = byQty.get(qty);
    if (existing) return existing;
    const priceCents = Math.max(0, baseUnitCents * qty);
    return {
      label: `${qty}x`,
      qty,
      priceCents,
      price: formatFallbackPrice(priceCents, fallbackPrice),
    } satisfies ProductPurchaseOption;
  });
}

export default function ProductCardPurchase({
  productId,
  fallbackPrice,
  options,
}: ProductCardPurchaseProps) {
  const dropdownId = useId();
  const { isInitializing } = useAuth();
  const [purchaseOptions, setPurchaseOptions] = useState(() =>
    options?.length ? ensureRequiredOptions(options, fallbackPrice) : [],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [failed, setFailed] = useState(false);

  const selectedOption = purchaseOptions[selectedIndex];
  const selectedQty = selectedOption?.qty ?? 1;
  const buttonLabel = selectedOption
    ? `Add To Cart · ${selectedOption.price}`
    : `Add To Cart · ${fallbackPrice}`;
  const canPickVariants = purchaseOptions.length > 0;

  useEffect(() => {
    const handleExternalOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ id?: string }>).detail;
      if (!detail?.id) return;
      if (detail.id !== dropdownId) {
        setIsPickerOpen(false);
      }
    };

    window.addEventListener("product-card-dropdown-open", handleExternalOpen);
    return () =>
      window.removeEventListener(
        "product-card-dropdown-open",
        handleExternalOpen,
      );
  }, [dropdownId]);

  const openPicker = () => {
    window.dispatchEvent(
      new CustomEvent("product-card-dropdown-open", {
        detail: { id: dropdownId },
      }),
    );
    setIsPickerOpen(true);
  };

  const handlePrimaryClick = async () => {
    if (isInitializing) return;
    if (!productId) return;

    if (canPickVariants) {
      if (isPickerOpen) {
        setIsPickerOpen(false);
      } else {
        openPicker();
      }
      return;
    }

    try {
      setLoadingOptions(true);
      setFailed(false);
      const product = await fetchProductById(productId);
      const fetchedOptions = getProductPurchaseOptions(product);
      if (fetchedOptions.length > 0) {
        setPurchaseOptions(ensureRequiredOptions(fetchedOptions, fallbackPrice));
        setSelectedIndex(0);
        openPicker();
        return;
      }
    } catch {
    } finally {
      setLoadingOptions(false);
    }

    try {
      setLoading(true);
      await addCartItem(productId, 1);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cart-item-added"));
      }
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    } catch {
      setFailed(true);
      setTimeout(() => setFailed(false), 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mt-3 w-full">
      {isPickerOpen ? (
        <button
          type="button"
          aria-label="Close quantity selector"
          className="fixed inset-0 z-10 cursor-default bg-transparent"
          onClick={() => setIsPickerOpen(false)}
        />
      ) : null}

      {isPickerOpen && canPickVariants ? (
        <div className="absolute inset-x-0 bottom-full z-30 mb-2 max-h-56 overflow-auto rounded-2xl border border-pr_w/20 bg-pr_w p-2 shadow-lg">
          <div className="flex flex-col gap-1">
            {purchaseOptions.map((option, index) => (
              <button
                key={`${option.label}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors ${
                  index === selectedIndex
                    ? "bg-pr_dg text-pr_w"
                    : "text-pr_dg hover:bg-pr_dg/10"
                }`}
              >
                {option.label} - {option.price}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="relative z-20 flex w-full">
        {isPickerOpen && canPickVariants ? (
          <AddToCartButton
            productId={productId}
            qty={selectedQty}
            label={buttonLabel}
            variant="category"
            className="w-full hover:translate-y-0 active:translate-y-0"
            onSuccess={() => {
              setTimeout(() => setIsPickerOpen(false), 700);
            }}
          />
        ) : (
          <Button
            variant="category"
            type="button"
            className="w-full hover:translate-y-0 active:translate-y-0"
            disabled={loadingOptions || loading || !productId || isInitializing}
            onClick={handlePrimaryClick}
          >
            {loadingOptions
              ? "Loading options..."
              : loading
                ? "Adding..."
                : isInitializing
                  ? "Checking..."
                  : justAdded
                    ? "Added"
                    : failed
                      ? "Try again"
                      : "Add To Cart +"}
          </Button>
        )}
      </div>
    </div>
  );
}
