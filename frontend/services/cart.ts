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

export type CartPack = {
  id: string;
  name: string;
  paidQty: number;
  bonusQty: number;
  totalUnits: number;
  priceCents: number;
  currency: string;
};

export type CartItem = {
  id: string;
  product: CartProduct;
  pack: CartPack | null;
  qty: number;
  unitsReceived: number;
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
  packId?: string;
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

function normalizePack(rawPack: unknown, fallbackCurrency = "EUR") {
  const pack = asRecord(rawPack);
  if (!pack) return null;

  const id = asString(pack.id).trim();
  const name = asString(pack.name).trim();
  const paidQty = Math.max(0, Math.trunc(asNumber(pack.paidQty, 0)));
  const bonusQty = Math.max(0, Math.trunc(asNumber(pack.bonusQty, 0)));
  const totalUnitsRaw = Math.trunc(asNumber(pack.totalUnits, 0));
  const totalUnits = totalUnitsRaw > 0 ? totalUnitsRaw : paidQty + bonusQty;
  const priceCents = Math.max(0, Math.trunc(asNumber(pack.priceCents, 0)));
  const currency = asString(pack.currency, fallbackCurrency) || fallbackCurrency;

  if (!id) return null;

  return {
    id,
    name: name || "Pack",
    paidQty,
    bonusQty,
    totalUnits: Math.max(1, totalUnits),
    priceCents,
    currency,
  } satisfies CartPack;
}

function getGuestLineId(line: Pick<GuestCartLine, "slug" | "packId">) {
  const slug = ensureProductSlug(line.slug);
  const packId = line.packId?.trim() || "base";
  return `${slug}::${packId}`;
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

      const itemId = asString(item.id).trim() || getGuestLineId({ slug: resolvedSlug });
      const qty = normalizeQty(asNumber(item.qty || item.quantity, 1));

      const productCurrency = asString(product.currency || item.currency, "EUR");
      const unitPriceFallback = asNumber(
        item.unitPriceCents || item.priceCents,
        asNumber(product.priceCents, 0),
      );
      const lineTotal = Math.max(
        0,
        Math.trunc(asNumber(item.lineTotal || item.lineTotalCents, qty * unitPriceFallback)),
      );

      const images = Array.isArray(product.images)
        ? product.images
            .map((image) => normalizeImage(image))
            .filter((image): image is { id?: string; url: string } => Boolean(image))
        : [];

      const pack = normalizePack(item.pack, productCurrency);
      const unitsReceived = Math.max(
        0,
        Math.trunc(asNumber(item.unitsReceived, pack ? qty * pack.totalUnits : qty)),
      );

      return {
        id: itemId,
        product: {
          ...(productId ? { id: productId } : {}),
          slug: resolvedSlug,
          name: asString(product.name || item.productName, "Product"),
          priceCents: Math.max(0, Math.trunc(asNumber(product.priceCents, unitPriceFallback))),
          currency: productCurrency,
          stockQty: Math.max(0, Math.trunc(asNumber(product.stockQty, 0))),
          images,
        },
        pack,
        qty,
        unitsReceived,
        lineTotal,
      };
    })
    .filter(Boolean) as CartItem[];

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
        const packIdRaw =
          typeof (line as { packId?: unknown }).packId === "string"
            ? (line as { packId: string }).packId.trim()
            : "";

        const qty = Number.isFinite(qtyRaw) ? Math.trunc(qtyRaw) : 0;
        if (!slug || qty < 1) return null;
        return {
          slug,
          qty: normalizeQty(qty),
          ...(packIdRaw ? { packId: packIdRaw } : {}),
        } satisfies GuestCartLine;
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

function addGuestCartItem(productSlug: string, qty: number, packId?: string) {
  const normalizedPackId = packId?.trim() || undefined;
  const lines = readGuestCart();
  const index = lines.findIndex(
    (line) =>
      line.slug === productSlug &&
      (line.packId?.trim() || undefined) === normalizedPackId,
  );

  if (index >= 0) {
    lines[index] = {
      ...lines[index],
      qty: normalizeQty(lines[index].qty + qty),
    };
  } else {
    lines.push({
      slug: productSlug,
      qty: normalizeQty(qty),
      ...(normalizedPackId ? { packId: normalizedPackId } : {}),
    });
  }
  writeGuestCart(lines);
}

function updateGuestCartItem(itemId: string, qty: number) {
  const nextQty = normalizeQty(qty);
  const lines = readGuestCart().map((line) =>
    getGuestLineId(line) === itemId ? { ...line, qty: nextQty } : line,
  );
  writeGuestCart(lines);
}

function removeGuestCartItem(itemId: string) {
  const lines = readGuestCart().filter((line) => getGuestLineId(line) !== itemId);
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

    const pack = line.packId
      ? product.packs?.find((entry) => entry.id === line.packId) || null
      : null;

    validLines.push({
      slug,
      qty: line.qty,
      ...(line.packId ? { packId: line.packId } : {}),
    });

    const unitPrice = pack
      ? Math.max(0, Math.trunc(pack.priceCents))
      : Math.max(0, Math.trunc(product.priceCents ?? 0));
    const lineTotal = unitPrice * line.qty;
    const unitsReceived = pack
      ? Math.max(1, Math.trunc(pack.totalUnits)) * line.qty
      : line.qty;

    items.push({
      id: getGuestLineId(line),
      product: {
        id: product.id,
        slug,
        name: product.name || "Product",
        priceCents: Math.max(0, Math.trunc(product.priceCents ?? 0)),
        currency: product.currency || "EUR",
        stockQty: Math.max(0, Math.trunc(product.stockQty ?? 0)),
        images:
          product.images?.map((image) => ({
            ...(image.id ? { id: image.id } : {}),
            url: image.url,
          })) ?? [],
      },
      pack: pack
        ? {
            id: pack.id,
            name: pack.name,
            paidQty: pack.paidQty,
            bonusQty: pack.bonusQty,
            totalUnits: pack.totalUnits,
            priceCents: pack.priceCents,
            currency: pack.currency,
          }
        : null,
      qty: line.qty,
      unitsReceived,
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

async function postCartItem(productSlug: string, qty: number, packId?: string) {
  const response = await apiFetch("/cart/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productSlug,
      qty: normalizeQty(qty),
      ...(packId?.trim() ? { packId: packId.trim() } : {}),
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
          await postCartItem(line.slug, line.qty, line.packId);
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

export async function addCartItem(productSlug: string, qty = 1, packId?: string) {
  const normalizedProductSlug = ensureProductSlug(productSlug);
  if (!normalizedProductSlug) {
    throw buildApiError("Product is unavailable", 400);
  }

  const normalizedQty = normalizeQty(qty);
  const normalizedPackId = packId?.trim() || undefined;
  const isGuest = !hasAccessToken();
  if (isGuest) {
    addGuestCartItem(normalizedProductSlug, normalizedQty, normalizedPackId);
  } else {
    await syncLegacyGuestCartToApi();
  }

  try {
    await postCartItem(normalizedProductSlug, normalizedQty, normalizedPackId);
    return { success: true };
  } catch (error) {
    if (isGuest) {
      return { success: true };
    }

    if (!hasAccessToken()) {
      addGuestCartItem(normalizedProductSlug, normalizedQty, normalizedPackId);
      return { success: true };
    }

    throw error;
  }
}

export async function updateCartItem(itemId: string, qty: number) {
  const normalizedItemId = itemId.trim();
  if (!normalizedItemId) {
    throw buildApiError("Cart item id is required", 400);
  }

  const normalizedQty = normalizeQty(qty);
  const isGuest = !hasAccessToken();
  if (isGuest) {
    updateGuestCartItem(normalizedItemId, normalizedQty);
  }

  const response = await apiFetch(
    `/cart/items/${encodeURIComponent(normalizedItemId)}`,
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

export async function removeCartItem(itemId: string) {
  const normalizedItemId = itemId.trim();
  if (!normalizedItemId) {
    throw buildApiError("Cart item id is required", 400);
  }

  const isGuest = !hasAccessToken();
  if (isGuest) {
    removeGuestCartItem(normalizedItemId);
  }

  const response = await apiFetch(
    `/cart/items/${encodeURIComponent(normalizedItemId)}`,
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
