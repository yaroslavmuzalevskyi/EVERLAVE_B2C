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

export type OrderPayment = {
  method: string;
  status: string;
  reference: string | null;
  bankAccount?: BankAccount | null;
  proof?: PaymentProof | null;
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
    bankAccount: BankAccount;
    proof?: PaymentProof | null;
  };
};

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

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  UNDER_REVIEW: "UNDER_REVIEW",
  CANCELLED: "CANCELLED",
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
  return new OrdersApiError(
    data?.message || fallback,
    data?.code,
    data?.details,
  );
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
) {
  const payload = {
    paymentMethod: PAYMENT_METHOD_BANK_TRANSFER,
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
