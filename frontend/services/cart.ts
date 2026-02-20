import { apiFetch } from "@/lib/apiClient";
import { getAccessToken } from "@/lib/authTokens";
import { fetchProductById } from "@/services/products";

export type CartProduct = {
  id?: string;
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

type AnyRecord = Record<string, unknown>;

const GUEST_CART_STORAGE_KEY = "evervale_guest_cart_v1";
let guestCartSyncPromise: Promise<void> | null = null;

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

function hasAccessToken() {
  return Boolean(getAccessToken());
}

function ensureProductSlug(productSlug: string) {
  return productSlug.trim();
}

function normalizeQty(qty: number, fallback = 1) {
  const parsed = Number.isFinite(qty) ? Math.trunc(qty) : fallback;
  return Math.max(1, Math.min(100, parsed || fallback));
}

function asRecord(value: unknown): AnyRecord | null {
  if (!value || typeof value !== "object") return null;
  return value as AnyRecord;
}

function asNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function asString(value: unknown, fallback = "") {
  if (typeof value === "string") return value;
  return fallback;
}

function normalizeImage(image: unknown) {
  if (typeof image === "string") {
    const url = image.trim();
    return url ? { url } : null;
  }

  const raw = asRecord(image);
  if (!raw) return null;
  const url = asString(raw.url || raw.src || raw.path).trim();
  if (!url) return null;
  const id = asString(raw.id).trim() || undefined;
  return { ...(id ? { id } : {}), url };
}

function normalizeCart(raw: unknown): CartResponse {
  const cart = asRecord(raw);
  const id = asString(cart?.id, "cart");
  const rawItems = Array.isArray(cart?.items) ? cart.items : [];

  const items = rawItems
    .map((entry) => {
      const item = asRecord(entry);
      if (!item) return null;

      const product = asRecord(item.product) || {};
      const productSlug = asString(
        product.slug || product.productSlug || item.productSlug || item.slug,
      ).trim();
      const productId = asString(product.id || item.productId).trim() || undefined;
      const resolvedSlug = productSlug || productId || "";
      if (!resolvedSlug) return null;

      const qty = normalizeQty(asNumber(item.qty || item.quantity, 1));
      const priceCents = Math.max(
        0,
        Math.trunc(
          asNumber(product.priceCents, asNumber(item.unitPriceCents || item.priceCents, 0)),
        ),
      );
      const lineTotal = Math.max(
        0,
        Math.trunc(
          asNumber(item.lineTotal || item.lineTotalCents, qty * priceCents),
        ),
      );
      const images = Array.isArray(product.images)
        ? product.images
            .map((image) => normalizeImage(image))
            .filter((image): image is { id?: string; url: string } => Boolean(image))
        : [];

      return {
        product: {
          ...(productId ? { id: productId } : {}),
          slug: resolvedSlug,
          name: asString(product.name || item.productName, "Product"),
          priceCents,
          currency: asString(product.currency || item.currency, "EUR"),
          stockQty: Math.max(0, Math.trunc(asNumber(product.stockQty, 0))),
          images,
        },
        qty,
        lineTotal,
      } as CartItem;
    })
    .filter((line): line is CartItem => Boolean(line));

  const subtotalCents = Math.max(
    0,
    Math.trunc(
      asNumber(
        cart?.subtotalCents || cart?.subtotal,
        items.reduce((sum, item) => sum + item.lineTotal, 0),
      ),
    ),
  );

  return {
    id: id || "cart",
    items,
    subtotalCents,
  };
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
        return { slug, qty: normalizeQty(qty) };
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

function clearGuestCart() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(GUEST_CART_STORAGE_KEY);
}

function addGuestCartItem(productSlug: string, qty: number) {
  const lines = readGuestCart();
  const index = lines.findIndex((line) => line.slug === productSlug);
  if (index >= 0) {
    lines[index] = {
      ...lines[index],
      qty: normalizeQty(lines[index].qty + qty),
    };
  } else {
    lines.push({ slug: productSlug, qty: normalizeQty(qty) });
  }
  writeGuestCart(lines);
}

function updateGuestCartItem(productSlug: string, qty: number) {
  const nextQty = normalizeQty(qty);
  const lines = readGuestCart().map((line) =>
    line.slug === productSlug ? { ...line, qty: nextQty } : line,
  );
  writeGuestCart(lines);
}

function removeGuestCartItem(productSlug: string) {
  const lines = readGuestCart().filter((line) => line.slug !== productSlug);
  writeGuestCart(lines);
}

async function buildGuestCartFromStorage(): Promise<CartResponse> {
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
    if (!product) continue;

    const slug = ensureProductSlug(product.slug || line.slug);
    if (!slug) continue;

    validLines.push({ slug, qty: line.qty });
    const unitPrice = Math.max(0, Math.trunc(product.priceCents ?? 0));
    const lineTotal = unitPrice * line.qty;
    items.push({
      product: {
        id: product.id,
        slug,
        name: product.name || "Product",
        priceCents: unitPrice,
        currency: product.currency || "EUR",
        stockQty: Math.max(0, Math.trunc(product.stockQty ?? 0)),
        images:
          product.images?.map((image) => ({
            ...(image.id ? { id: image.id } : {}),
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

  return {
    id: "guest",
    items,
    subtotalCents: items.reduce((sum, item) => sum + item.lineTotal, 0),
  };
}

async function postCartItem(productSlug: string, qty: number) {
  const response = await apiFetch("/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productSlug,
      qty: normalizeQty(qty),
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw buildApiError("Failed to add item", response.status, error);
  }
}

export async function syncLegacyGuestCartToApi() {
  if (typeof window === "undefined" || !hasAccessToken()) return;

  const lines = readGuestCart();
  if (lines.length === 0) return;

  if (!guestCartSyncPromise) {
    guestCartSyncPromise = (async () => {
      const failed: GuestCartLine[] = [];
      for (const line of lines) {
        try {
          await postCartItem(line.slug, line.qty);
        } catch {
          failed.push(line);
        }
      }

      if (failed.length === 0) {
        clearGuestCart();
        return;
      }

      writeGuestCart(failed);
    })().finally(() => {
      guestCartSyncPromise = null;
    });
  }

  await guestCartSyncPromise;
}

export async function fetchCart() {
  if (hasAccessToken()) {
    await syncLegacyGuestCartToApi();
  }

  const response = await apiFetch("/cart");
  if (!response.ok) {
    if (!hasAccessToken()) {
      return buildGuestCartFromStorage();
    }
    const error = await response.json().catch(() => ({}));
    throw buildApiError("Failed to load cart", response.status, error);
  }

  const normalized = normalizeCart(await response.json().catch(() => ({})));
  if (!hasAccessToken() && normalized.items.length === 0) {
    const guestCart = await buildGuestCartFromStorage();
    if (guestCart.items.length > 0) return guestCart;
  }
  return normalized;
}

export async function addCartItem(productSlug: string, qty = 1) {
  const normalizedProductSlug = ensureProductSlug(productSlug);
  if (!normalizedProductSlug) {
    throw buildApiError("Product is unavailable", 400);
  }

  const normalizedQty = normalizeQty(qty);
  const isGuest = !hasAccessToken();
  if (isGuest) {
    addGuestCartItem(normalizedProductSlug, normalizedQty);
  } else {
    await syncLegacyGuestCartToApi();
  }

  try {
    await postCartItem(normalizedProductSlug, normalizedQty);
    return { success: true };
  } catch (error) {
    if (isGuest) {
      return { success: true };
    }
    throw error;
  }
}

export async function updateCartItem(productSlug: string, qty: number) {
  const normalizedProductSlug = ensureProductSlug(productSlug);
  if (!normalizedProductSlug) {
    throw buildApiError("Product slug is required", 400);
  }

  const normalizedQty = normalizeQty(qty);
  const isGuest = !hasAccessToken();
  if (isGuest) {
    updateGuestCartItem(normalizedProductSlug, normalizedQty);
  }

  const response = await apiFetch(
    `/cart/items/${encodeURIComponent(normalizedProductSlug)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qty: normalizedQty }),
    },
  );

  if (!response.ok) {
    if (isGuest) {
      return { success: true };
    }
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

  const isGuest = !hasAccessToken();
  if (isGuest) {
    removeGuestCartItem(normalizedProductSlug);
  }

  const response = await apiFetch(
    `/cart/items/${encodeURIComponent(normalizedProductSlug)}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    if (isGuest) {
      return { success: true };
    }
    const error = await response.json().catch(() => ({}));
    throw buildApiError("Failed to remove item", response.status, error);
  }
  return response.json() as Promise<{ success: boolean }>;
}

export async function clearCart() {
  const isGuest = !hasAccessToken();
  if (isGuest) {
    clearGuestCart();
  }

  const response = await apiFetch("/cart", {
    method: "DELETE",
  });
  if (!response.ok) {
    if (isGuest) {
      return { success: true };
    }
    const error = await response.json().catch(() => ({}));
    throw buildApiError("Failed to clear cart", response.status, error);
  }
  return response.json() as Promise<{ success: boolean }>;
}
