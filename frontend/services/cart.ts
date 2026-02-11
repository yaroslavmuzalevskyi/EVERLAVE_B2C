import { apiFetch } from "@/lib/apiClient";

export type CartProduct = {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  stockQty: number;
  images?: Array<{ id: string; url: string }>;
};

export type CartItem = {
  product: CartProduct;
  qty: number;
  lineTotal: number;
};

export type CartResponse = {
  id: string;
  items: CartItem[];
  subtotalCents: number;
};

export async function fetchCart() {
  const response = await apiFetch("/cart");
  if (!response.ok) {
    throw new Error("Failed to load cart");
  }
  return (await response.json()) as CartResponse;
}

export async function addCartItem(productId: string, qty = 1) {
  const response = await apiFetch("/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, qty }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to add item");
  }
  return response.json() as Promise<{ success: boolean }>;
}

export async function updateCartItem(productId: string, qty: number) {
  const response = await apiFetch(`/cart/items/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qty }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to update item");
  }
  return response.json() as Promise<{ success: boolean }>;
}

export async function removeCartItem(productId: string) {
  const response = await apiFetch(`/cart/items/${productId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to remove item");
  }
  return response.json() as Promise<{ success: boolean }>;
}

export async function clearCart() {
  const response = await apiFetch("/cart", {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to clear cart");
  }
  return response.json() as Promise<{ success: boolean }>;
}
