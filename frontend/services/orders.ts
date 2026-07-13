import { apiFetch } from "@/lib/apiClient";

export type OrderAddress = {
  fullName: string;
  line1: string;
  line2?: string | null;
  city: string;
  postalCode: string;
  country: string;
  phone?: string | null;
};

export type OrderItem = {
  slug?: string | null;
  productName: string;
  unitPriceCents: number;
  qty: number;
};

export type OrderShipping = {
  amountCents: number;
  displayName: string | null;
  indicativeDeliveryDuration: string | null;
};

export type OrderTracking = {
  trackingNumber: string | null;
  carrier: string | null;
  trackingUrl: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  completedAt: string | null;
};

export type PaymentProof = {
  id?: string;
  status?: string;
  originalName: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
  reviewNote?: string | null;
  createdAt: string | null;
};

export type BankAccount = {
  accountHolder?: string;
  iban?: string;
  bic?: string;
  bankName?: string;
};

export type CryptoExchangeRate = {
  base?: string | null;
  quote?: string | null;
  /** Decimal string, e.g. "61500.00" — never parse into a float for display. */
  rate?: string | null;
  source?: string | null;
};

/**
 * Bitcoin invoice data attached to `payment.crypto` for BITCOIN orders.
 * Present while the payment is PENDING or UNDER_REVIEW.
 *
 * `amountBtc` is an exact decimal string produced by the backend — display
 * it verbatim and never round-trip it through a JS `number`.
 */
export type CryptoPayment = {
  provider?: string | null;
  network: string;
  asset?: string | null;
  address: string;
  addressIndex?: number | null;
  amountBtc: string;
  amountSats?: number | null;
  exchangeRate?: CryptoExchangeRate | null;
  expiresAt?: string | null;
  txHash?: string | null;
  markedPaidAt?: string | null;
  /** BIP-21 style payload for the QR code — use exactly as returned. */
  qrPayload?: string | null;
};

export type OrderPayment = {
  method: string;
  status: string;
  reference: string | null;
  bankAccount?: BankAccount | null;
  proof?: PaymentProof | null;
  crypto?: CryptoPayment | null;
};

export type Order = {
  orderNumber: number;
  status: string;
  totalAmountCents: number;
  currency: string;
  createdAt?: string;
  address: OrderAddress;
  shipping?: OrderShipping | null;
  payment?: OrderPayment | null;
  items: OrderItem[];
  tracking?: OrderTracking | null;
};

export type OrdersResponse = {
  page: number;
  limit: number;
  total: number;
  items: Order[];
};

/**
 * Shape returned by POST /checkout and by
 * GET /orders/current-payment (under the `currentPayment` key).
 *
 * `payment.proof` is only present when a previous proof was uploaded
 * and rejected — its presence together with `payment.status === "PENDING"`
 * means the customer must re-upload.
 */
export type OpenPayment = {
  orderNumber: number;
  orderStatus: string;
  totalAmountCents: number;
  currency: string;
  payment: {
    method: string;
    status: string;
    reference: string;
    /** Present for BANK_TRANSFER payments. */
    bankAccount?: BankAccount | null;
    proof?: PaymentProof | null;
    /** Present for BITCOIN payments. */
    crypto?: CryptoPayment | null;
  };
};

/**
 * Build an OpenPayment view from an order in the list response, e.g. to
 * show Bitcoin payment details for an UNDER_REVIEW order (which
 * GET /orders/current-payment no longer returns).
 */
export function openPaymentFromOrder(order: Order): OpenPayment | null {
  const payment = order.payment;
  if (!payment) return null;
  return {
    orderNumber: order.orderNumber,
    orderStatus: order.status,
    totalAmountCents: order.totalAmountCents,
    currency: order.currency,
    payment: {
      method: payment.method,
      status: payment.status,
      reference: payment.reference ?? "",
      bankAccount: payment.bankAccount ?? null,
      proof: payment.proof ?? null,
      crypto: payment.crypto ?? null,
    },
  };
}

/** Order statuses accepted by the `GET /orders?status=…` filter. */
export const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type ProofUploadResult = {
  orderNumber: number;
  orderStatus: string;
  paymentStatus: string;
  proof: PaymentProof;
};

export const PAYMENT_METHOD_BANK_TRANSFER = "BANK_TRANSFER";
export const PAYMENT_METHOD_BITCOIN = "BITCOIN";

export type PaymentMethod =
  | typeof PAYMENT_METHOD_BANK_TRANSFER
  | typeof PAYMENT_METHOD_BITCOIN;

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  UNDER_REVIEW: "UNDER_REVIEW",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;

export const API_ERROR_CODES = {
  OPEN_PAYMENT_EXISTS: "OPEN_PAYMENT_EXISTS",
  PAYMENT_ALREADY_UNDER_REVIEW: "PAYMENT_ALREADY_UNDER_REVIEW",
} as const;

/**
 * Error envelope: { error: true, message, code, details? }.
 * Callers branch on `code` and fall back to `message`.
 */
export class OrdersApiError extends Error {
  code?: string;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    code?: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "OrdersApiError";
    this.code = code;
    this.details = details;
  }
}

async function toApiError(response: Response, fallback: string) {
  const data = await response.json().catch(() => null);
  const base = data?.message || fallback;
  const details = data?.details;

  // Backend uses Zod-style { formErrors: string[], fieldErrors: {…} }.
  // Fold both into the user-visible message so we don't hide the specific
  // rejection reason when `fieldErrors` is empty but `formErrors` isn't.
  const parts: string[] = [];
  if (details && typeof details === "object") {
    const fe = (details as { fieldErrors?: Record<string, string[]> })
      .fieldErrors;
    if (fe && typeof fe === "object") {
      for (const [field, messages] of Object.entries(fe)) {
        if (Array.isArray(messages)) {
          for (const msg of messages) parts.push(`${field}: ${msg}`);
        }
      }
    }
    const forms = (details as { formErrors?: string[] }).formErrors;
    if (Array.isArray(forms)) {
      for (const msg of forms) parts.push(msg);
    }
  }
  const message = parts.length > 0 ? `${base} (${parts.join("; ")})` : base;

  return new OrdersApiError(message, data?.code, details);
}

// --- Proof file constraints (enforced client-side; backend re-validates) ---

export const PROOF_MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const PROOF_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
];

const PROOF_ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
  ".pdf",
];

export const PROOF_ACCEPT_ATTRIBUTE = PROOF_ALLOWED_MIME_TYPES.join(",");

/** Returns a user-facing error message, or null when the file is valid. */
export function validateProofFile(file: File): string | null {
  if (file.size > PROOF_MAX_SIZE_BYTES) {
    return "This file is larger than 10 MB. Please upload a smaller receipt.";
  }
  // Some platforms report an empty MIME type for HEIC/HEIF —
  // fall back to the file extension in that case.
  const mimeOk = file.type && PROOF_ALLOWED_MIME_TYPES.includes(file.type);
  const extOk = PROOF_ALLOWED_EXTENSIONS.some((ext) =>
    file.name.toLowerCase().endsWith(ext),
  );
  if (!mimeOk && !extOk) {
    return "Unsupported file type. Please upload a JPEG, PNG, WEBP, HEIC/HEIF image or a PDF.";
  }
  return null;
}

// --- API calls ---

export async function fetchOrders(params: {
  page: number;
  limit: number;
  /** Comma-joined status list, or an array — both accepted by the API. */
  status?: string | OrderStatus[];
  /** Free-text search; the API matches order number. */
  search?: string;
}) {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.status) {
    const joined = Array.isArray(params.status)
      ? params.status.join(",")
      : params.status;
    if (joined) query.set("status", joined);
  }
  if (params.search && params.search.trim()) {
    query.set("search", params.search.trim());
  }

  const response = await apiFetch(`/orders?${query.toString()}`);
  if (!response.ok) {
    throw await toApiError(response, "Failed to load orders");
  }
  return (await response.json()) as OrdersResponse;
}

export async function checkout(
  address: OrderAddress,
  deliveryOptionId?: string,
  paymentMethod: PaymentMethod = PAYMENT_METHOD_BANK_TRANSFER,
) {
  const payload = {
    paymentMethod,
    address: {
      fullName: address.fullName,
      line1: address.line1,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      ...(address.line2 ? { line2: address.line2 } : {}),
      ...(address.phone ? { phone: address.phone } : {}),
    },
    ...(deliveryOptionId ? { shippingRateId: deliveryOptionId } : {}),
  };

  const response = await apiFetch("/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await toApiError(response, "Checkout failed");
  }

  return (await response.json()) as OpenPayment;
}

/**
 * Re-fetch the currently open (still PENDING) payment, e.g. after an
 * OPEN_PAYMENT_EXISTS checkout error or when returning to an
 * in-progress checkout. Returns null when nothing is pending
 * (payment absent or already UNDER_REVIEW).
 */
export async function fetchCurrentPayment(): Promise<OpenPayment | null> {
  const response = await apiFetch("/orders/current-payment");
  if (!response.ok) {
    throw await toApiError(response, "Failed to load payment details");
  }
  const data = await response.json().catch(() => ({}));
  return (data?.currentPayment as OpenPayment | null) ?? null;
}

/**
 * Upload the proof-of-payment file. Sent as multipart/form-data with the
 * single field key `proof`; the Content-Type header is left to the browser
 * so the multipart boundary is set correctly.
 */
export async function uploadPaymentProof(orderNumber: number, file: File) {
  const body = new FormData();
  body.append("proof", file);

  const response = await apiFetch(`/orders/${orderNumber}/payment-proof`, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    throw await toApiError(response, "Failed to upload payment proof");
  }

  return (await response.json()) as ProofUploadResult;
}

// --- Bitcoin payment confirmation ---

/** Bitcoin transaction hashes are exactly 64 hex characters. */
export const TX_HASH_REGEX = /^[a-fA-F0-9]{64}$/;

/**
 * Validate an (optional) user-entered txHash.
 * Returns a user-facing error message, or null when acceptable.
 * An empty value is valid — the txHash is optional.
 */
export function validateTxHash(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!TX_HASH_REGEX.test(trimmed)) {
    return "This doesn't look like a Bitcoin transaction ID. It should be 64 hexadecimal characters — or leave the field empty.";
  }
  return null;
}

/**
 * Customer clicked "I paid" on a Bitcoin invoice. Sends the optional
 * txHash only when non-empty (never an empty string). The response is the
 * full open-payment object with `payment.status === "UNDER_REVIEW"` —
 * callers must replace their local payment state with it.
 */
export async function confirmBitcoinPayment(
  orderNumber: number,
  txHash?: string,
): Promise<OpenPayment> {
  const trimmed = txHash?.trim();
  const response = await apiFetch(
    `/orders/${orderNumber}/payment-confirmation`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trimmed ? { txHash: trimmed } : {}),
    },
  );

  if (!response.ok) {
    throw await toApiError(response, "Failed to confirm the payment");
  }

  return (await response.json()) as OpenPayment;
}

/** Cancel an unpaid order. Only valid while paymentStatus is PENDING. */
export async function cancelOrder(orderNumber: number) {
  const response = await apiFetch(`/orders/${orderNumber}/cancel`, {
    method: "POST",
  });

  if (!response.ok) {
    throw await toApiError(response, "Failed to cancel the order");
  }

  return response.json().catch(() => ({}));
}

export type DeliveryCountry = {
  code: string;
  name: string;
};

export type DeliveryOption = {
  id: string;
  type: string;
  priceCents: number;
  freeShippingThresholdCents: number | null;
  supportsFreeDelivery: boolean;
  passesFreeDeliveryThreshold: boolean;
  currency: string;
  indicativeDeliveryDuration: string | null;
  displayName: string;
};

export async function fetchDeliveryCountries(): Promise<DeliveryCountry[]> {
  const response = await apiFetch("/cart/delivery-countries");
  if (!response.ok) return [];
  const data = await response.json().catch(() => ({}));
  return data.countries ?? [];
}

export async function fetchDeliveryOptions(
  countryCode: string,
): Promise<DeliveryOption[]> {
  const response = await apiFetch(
    `/cart/delivery-options?country=${encodeURIComponent(countryCode)}`,
  );
  if (!response.ok) return [];
  const data = await response.json().catch(() => ({}));
  return data.options ?? [];
}
