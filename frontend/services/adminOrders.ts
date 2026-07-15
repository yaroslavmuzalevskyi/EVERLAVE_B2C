import { apiFetch } from "@/lib/apiClient";

// ---- Enums ------------------------------------------------------------

export const ADMIN_ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
] as const;

export type AdminOrderStatus = (typeof ADMIN_ORDER_STATUSES)[number];

export const ADMIN_PAYMENT_STATUSES = [
  "PENDING",
  "UNDER_REVIEW",
  "CONFIRMED",
  "CANCELLED",
  "REFUNDED",
] as const;

export type AdminPaymentStatus = (typeof ADMIN_PAYMENT_STATUSES)[number];

export const ADMIN_PAYMENT_METHODS = ["BANK_TRANSFER", "BITCOIN"] as const;

export type AdminPaymentMethod = (typeof ADMIN_PAYMENT_METHODS)[number];

// ---- Shared types -----------------------------------------------------

export type AdminOrderCustomer = {
  email: string;
  name: string;
  referenceGroup?: string;
};

export type AdminOrderTotals = {
  subtotalAmountCents: number;
  shippingAmountCents: number;
  totalAmountCents: number;
  currency: string;
};

export type AdminOrderAddress = {
  fullName: string;
  line1: string;
  line2?: string | null;
  city: string;
  postalCode: string;
  country: string;
  phone?: string | null;
};

export type AdminOrderItem = {
  productId: string;
  productPackId?: string | null;
  productName: string;
  unitPriceCents: number;
  qty: number;
  lineTotalCents: number;
  slug?: string | null;
};

export type AdminPaymentProof = {
  originalName: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  reviewNote: string | null;
  reviewedAt: string | null;
  createdAt: string | null;
};

export type AdminBankTransferAccount = {
  accountHolder?: string;
  iban?: string;
  bic?: string;
  bankName?: string;
};

export type AdminCryptoExchangeRate = {
  base?: string | null;
  quote?: string | null;
  /** Decimal string, e.g. "61500.00" — display verbatim. */
  rate?: string | null;
  source?: string | null;
};

/**
 * Bitcoin invoice attached to `payment.crypto` for BITCOIN orders.
 * `amountBtc` is an exact decimal string — never round-trip through a
 * JS number. `provider`/`addressIndex` only appear in the detail response.
 */
export type AdminCryptoPayment = {
  provider?: string | null;
  network: string;
  asset?: string | null;
  address: string;
  addressIndex?: number | null;
  amountBtc: string;
  amountSats?: number | null;
  exchangeRate?: AdminCryptoExchangeRate | null;
  expiresAt?: string | null;
  txHash?: string | null;
  markedPaidAt?: string | null;
};

export type AdminOrderPayment = {
  method: AdminPaymentMethod | string;
  status: AdminPaymentStatus | string;
  reference: string | null;
  amountCents: number;
  currency: string;
  confirmedAt: string | null;
  proofCount: number;
  proof: AdminPaymentProof | null;
  /** Payment-level review note (used when there is no proof, e.g. Bitcoin). */
  reviewNote?: string | null;
  bankTransfer?: AdminBankTransferAccount | null;
  crypto?: AdminCryptoPayment | null;
};

export type AdminOrderTracking = {
  trackingNumber: string | null;
  carrier: string | null;
  trackingUrl: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  completedAt: string | null;
};

export type AdminOrderListItem = {
  orderNumber: number;
  status: AdminOrderStatus | string;
  customer: AdminOrderCustomer;
  totals: AdminOrderTotals;
  /**
   * Nullable: the backend may return no payment object for some orders
   * (e.g. Bitcoin orders on an older serializer) — never dereference
   * without a guard.
   */
  payment: AdminOrderPayment | null;
  tracking: AdminOrderTracking;
  createdAt: string;
};

export type AdminOrderDetail = AdminOrderListItem & {
  address: AdminOrderAddress;
  items: AdminOrderItem[];
};

export type AdminOrdersResponse = {
  page: number;
  limit: number;
  total: number;
  items: AdminOrderListItem[];
};

// ---- Error handling ---------------------------------------------------

export class AdminOrdersApiError extends Error {
  code?: string;
  details?: unknown;

  constructor(message: string, code?: string, details?: unknown) {
    super(message);
    this.name = "AdminOrdersApiError";
    this.code = code;
    this.details = details;
  }
}

async function toApiError(response: Response, fallback: string) {
  const data = await response.json().catch(() => null);
  return new AdminOrdersApiError(
    (data && typeof data === "object" && "message" in data
      ? String((data as { message?: unknown }).message ?? "")
      : "") || fallback,
    data && typeof data === "object" && "code" in data
      ? (data as { code?: string }).code
      : undefined,
    data && typeof data === "object" && "details" in data
      ? (data as { details?: unknown }).details
      : undefined,
  );
}

// ---- Queries ----------------------------------------------------------

export type AdminOrdersQuery = {
  page: number;
  limit?: number;
  orderStatus?: AdminOrderStatus[] | string;
  paymentStatus?: AdminPaymentStatus[] | string;
  paymentMethod?: AdminPaymentMethod | string;
  /** Order number, customer email/name, or payment reference. */
  search?: string;
  /** ISO date, e.g. `2026-07-01T00:00:00.000Z`. */
  dateFrom?: string;
  /** ISO date, e.g. `2026-07-11T23:59:59.999Z`. */
  dateTo?: string;
};

function serializeEnumList<T extends string>(v?: T[] | string) {
  if (!v) return undefined;
  if (Array.isArray(v)) return v.length > 0 ? v.join(",") : undefined;
  return v.trim() || undefined;
}

export async function fetchAdminOrders(
  query: AdminOrdersQuery,
): Promise<AdminOrdersResponse> {
  const search = new URLSearchParams();
  search.set("page", String(query.page));
  if (query.limit !== undefined) search.set("limit", String(query.limit));

  const os = serializeEnumList(query.orderStatus);
  if (os) search.set("orderStatus", os);

  const ps = serializeEnumList(query.paymentStatus);
  if (ps) search.set("paymentStatus", ps);

  if (query.paymentMethod) search.set("paymentMethod", query.paymentMethod);
  if (query.search && query.search.trim())
    search.set("search", query.search.trim());
  if (query.dateFrom) search.set("dateFrom", query.dateFrom);
  if (query.dateTo) search.set("dateTo", query.dateTo);

  const response = await apiFetch(`/admin/orders?${search.toString()}`);
  if (!response.ok) {
    throw await toApiError(response, "Failed to load admin orders");
  }
  return (await response.json()) as AdminOrdersResponse;
}

export async function fetchAdminOrder(
  orderNumber: number,
): Promise<AdminOrderDetail> {
  const response = await apiFetch(`/admin/orders/${orderNumber}`);
  if (!response.ok) {
    throw await toApiError(response, "Failed to load order");
  }
  return (await response.json()) as AdminOrderDetail;
}

// ---- Mutations --------------------------------------------------------

async function patchAdminOrder<T>(path: string, body: unknown): Promise<T> {
  const response = await apiFetch(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw await toApiError(response, "Request failed");
  }
  return (await response.json()) as T;
}

export function updateAdminOrderStatus(
  orderNumber: number,
  status: AdminOrderStatus,
) {
  return patchAdminOrder<AdminOrderDetail>(
    `/admin/orders/${orderNumber}/status`,
    { status },
  );
}

export function updateAdminOrderPayment(
  orderNumber: number,
  status: AdminPaymentStatus,
) {
  return patchAdminOrder<AdminOrderDetail>(
    `/admin/orders/${orderNumber}/payment`,
    { status },
  );
}

export type AdminTrackingUpdate = {
  trackingNumber?: string | null;
  carrier?: string | null;
  trackingUrl?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  completedAt?: string | null;
};

export function updateAdminOrderTracking(
  orderNumber: number,
  data: AdminTrackingUpdate,
) {
  return patchAdminOrder<AdminOrderDetail>(
    `/admin/orders/${orderNumber}/tracking`,
    data,
  );
}

export function updateAdminPaymentProofNote(
  orderNumber: number,
  reviewNote: string | null,
) {
  return patchAdminOrder<{ proof: AdminPaymentProof }>(
    `/admin/orders/${orderNumber}/payment-proof`,
    { reviewNote },
  );
}

/**
 * Streams the current payment proof file. Returns a same-origin object URL
 * the caller can drop into an <img> or <iframe>. Remember to
 * URL.revokeObjectURL(url) when the preview is unmounted.
 */
export async function fetchAdminPaymentProofBlobUrl(
  orderNumber: number,
): Promise<{ url: string; mimeType: string; filename: string | null }> {
  const response = await apiFetch(
    `/admin/orders/${orderNumber}/payment-proof/file`,
  );
  if (!response.ok) {
    throw await toApiError(response, "Failed to load payment proof file");
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const disposition = response.headers.get("Content-Disposition") ?? "";
  const filename = parseDispositionFilename(disposition);

  return {
    url,
    mimeType: blob.type || "application/octet-stream",
    filename,
  };
}

function parseDispositionFilename(header: string): string | null {
  // Supports `filename*=UTF-8''<encoded>` and `filename="…"`.
  const starMatch = header.match(/filename\*=(?:UTF-8'')?([^;]+)/i);
  if (starMatch) {
    try {
      return decodeURIComponent(starMatch[1].replace(/^"|"$/g, "").trim());
    } catch {
      /* fall through */
    }
  }
  const plainMatch = header.match(/filename="?([^";]+)"?/i);
  return plainMatch ? plainMatch[1] : null;
}
