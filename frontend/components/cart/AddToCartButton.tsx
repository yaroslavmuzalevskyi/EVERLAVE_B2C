"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleClick = async () => {
    if (!productId) return;
    if (!isAuthenticated) {
      router.push(`/signin?next=${encodeURIComponent(pathname ?? "/")}`);
      return;
    }
    try {
      setLoading(true);
      await addCartItem(productId, qty);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    } catch {
      setJustAdded(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      className={className}
      disabled={loading || !productId}
      onClick={handleClick}
      type="button"
    >
      {loading ? "Adding..." : justAdded ? "Added" : label}
    </Button>
  );
}
