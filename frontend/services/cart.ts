import { apiFetch } from "@/lib/apiClient";

export type CartProduct = {
  slug: string;
  name: string;
  priceCents: number;
  currency: string;
  stockQty: number;
  images?: Array<{ id?: string; url: string }>;
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

type ApiError = Error & { status?: number };

function buildApiError(
  fallbackMessage: string,
  status: number,
  payload?: { message?: string; error?: string },
) {
  const error = new Error(
    payload?.message || payload?.error || fallbackMessage,
  ) as ApiError;
  error.status = status;
  return error;
}

function ensureProductSlug(productSlug: string) {
  return productSlug.trim();
}

export async function fetchCart() {
  const response = await apiFetch("/cart");
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw buildApiError("Failed to load cart", response.status, error);
  }
  return (await response.json()) as CartResponse;
}

export async function addCartItem(productSlug: string, qty = 1) {
  const normalizedProductSlug = ensureProductSlug(productSlug);
  if (!normalizedProductSlug) {
    throw buildApiError("Product is unavailable", 400);
  }

  const normalizedQty = Math.max(1, Math.trunc(qty || 1));
  const response = await apiFetch("/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productSlug: normalizedProductSlug,
      qty: normalizedQty,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw buildApiError("Failed to add item", response.status, error);
  }

  return response.json() as Promise<{ success: boolean }>;
}

export async function updateCartItem(productSlug: string, qty: number) {
  const normalizedProductSlug = ensureProductSlug(productSlug);
  if (!normalizedProductSlug) {
    throw buildApiError("Product slug is required", 400);
  }
  const response = await apiFetch(
    `/cart/items/${encodeURIComponent(normalizedProductSlug)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qty }),
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw buildApiError("Failed to update item", response.status, error);
  }
  return response.json() as Promise<{ success: boolean }>;
}

export async function removeCartItem(productSlug: string) {
  const normalizedProductSlug = ensureProductSlug(productSlug);
  if (!normalizedProductSlug) {
    throw buildApiError("Product slug is required", 400);
  }
  const response = await apiFetch(
    `/cart/items/${encodeURIComponent(normalizedProductSlug)}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw buildApiError("Failed to remove item", response.status, error);
  }
  return response.json() as Promise<{ success: boolean }>;
}

export async function clearCart() {
  const response = await apiFetch("/cart", {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw buildApiError("Failed to clear cart", response.status, error);
  }
  return response.json() as Promise<{ success: boolean }>;
}
