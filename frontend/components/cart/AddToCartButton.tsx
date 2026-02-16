"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { addCartItem } from "@/services/cart";
import { useAuth } from "@/components/auth/AuthProvider";

type AddToCartButtonProps = {
  productId?: string;
  qty?: number;
  label?: string;
  variant?: "header" | "contact" | "primary" | "category";
  className?: string;
};

export default function AddToCartButton({
  productId,
  qty = 1,
  label = "Add to Cart +",
  variant = "category",
  className,
}: AddToCartButtonProps) {
  const { isInitializing } = useAuth();
  const [loading, setLoading] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleClick = async () => {
    if (isInitializing) return;
    if (!productId) return;

    try {
      setLoading(true);
      setFailed(false);
      await addCartItem(productId, qty);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    } catch (error) {
      setJustAdded(false);

      setFailed(true);
      setTimeout(() => setFailed(false), 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      className={className}
      disabled={loading || !productId || isInitializing}
      onClick={handleClick}
      type="button"
    >
      {loading
        ? "Adding..."
        : isInitializing
          ? "Checking..."
          : justAdded
            ? "Added"
            : failed
              ? "Try again"
              : label}
    </Button>
  );
}
