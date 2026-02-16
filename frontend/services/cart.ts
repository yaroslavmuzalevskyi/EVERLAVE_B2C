import { apiFetch } from "@/lib/apiClient";
import { getAccessToken } from "@/lib/authTokens";
import { fetchProductById } from "@/services/products";

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

type GuestCartLine = {
  slug: string;
  qty: number;
};

const GUEST_CART_STORAGE_KEY = "evervale_guest_cart_v1";

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

function canUseGuestCart() {
  if (typeof window === "undefined") return false;
  if (process.env.NEXT_PUBLIC_DISABLE_AUTH === "true") return false;
  return !getAccessToken();
}

function readGuestCart(): GuestCartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUEST_CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((line) => {
        if (!line || typeof line !== "object") return null;
        const slug =
          typeof (line as { slug?: unknown }).slug === "string"
            ? (line as { slug: string }).slug.trim()
            : "";
        const qtyRaw =
          typeof (line as { qty?: unknown }).qty === "number"
            ? (line as { qty: number }).qty
            : Number((line as { qty?: unknown }).qty);
        const qty = Number.isFinite(qtyRaw) ? Math.trunc(qtyRaw) : 0;
        if (!slug || qty < 1) return null;
        return { slug, qty };
      })
      .filter((line): line is GuestCartLine => Boolean(line));
  } catch {
    return [];
  }
}

function writeGuestCart(lines: GuestCartLine[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(lines));
}

async function fetchGuestCart(): Promise<CartResponse> {
  const lines = readGuestCart();
  if (lines.length === 0) {
    return { id: "guest", items: [], subtotalCents: 0 };
  }

  const products = await Promise.all(
    lines.map((line) => fetchProductById(line.slug).catch(() => null)),
  );

  const validLines: GuestCartLine[] = [];
  const items: CartItem[] = [];
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const product = products[index];
    if (!product || !product.slug) continue;

    validLines.push({ slug: product.slug, qty: line.qty });
    const lineTotal = (product.priceCents ?? 0) * line.qty;
    items.push({
      product: {
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents ?? 0,
        currency: product.currency ?? "EUR",
        stockQty: product.stockQty ?? 0,
        images:
          product.images?.map((image) => ({
            id: image.id,
            url: image.url,
          })) ?? [],
      },
      qty: line.qty,
      lineTotal,
    });
  }

  if (validLines.length !== lines.length) {
    writeGuestCart(validLines);
  }

  const subtotalCents = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return {
    id: "guest",
    items,
    subtotalCents,
  };
}

function addGuestCartItem(productSlug: string, qty: number) {
  const lines = readGuestCart();
  const existingIndex = lines.findIndex((line) => line.slug === productSlug);
  if (existingIndex >= 0) {
    lines[existingIndex] = {
      ...lines[existingIndex],
      qty: Math.min(100, lines[existingIndex].qty + qty),
    };
  } else {
    lines.push({ slug: productSlug, qty });
  }
  writeGuestCart(lines);
}

function updateGuestCartItem(productSlug: string, qty: number) {
  const nextQty = Math.max(1, Math.trunc(qty));
  const lines = readGuestCart().map((line) =>
    line.slug === productSlug ? { ...line, qty: nextQty } : line,
  );
  writeGuestCart(lines);
}

function removeGuestCartItem(productSlug: string) {
  const lines = readGuestCart().filter((line) => line.slug !== productSlug);
  writeGuestCart(lines);
}

function clearGuestCart() {
  writeGuestCart([]);
}

export async function fetchCart() {
  if (canUseGuestCart()) {
    return fetchGuestCart();
  }
  const response = await apiFetch("/cart");
  if (!response.ok) {
    if ((response.status === 401 || response.status === 403) && canUseGuestCart()) {
      return fetchGuestCart();
    }
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
  if (canUseGuestCart()) {
    addGuestCartItem(normalizedProductSlug, normalizedQty);
    return { success: true };
  }

  const response = await apiFetch("/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      // Keep both keys for backend compatibility while migration settles.
      productId: normalizedProductSlug,
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
  if (canUseGuestCart()) {
    updateGuestCartItem(normalizedProductSlug, qty);
    return { success: true };
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
  if (canUseGuestCart()) {
    removeGuestCartItem(normalizedProductSlug);
    return { success: true };
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
  if (canUseGuestCart()) {
    clearGuestCart();
    return { success: true };
  }
  const response = await apiFetch("/cart", {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw buildApiError("Failed to clear cart", response.status, error);
  }
  return response.json() as Promise<{ success: boolean }>;
}
