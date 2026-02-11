import { apiFetch } from "@/lib/apiClient";

export type OrderAddress = {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
};

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  unitPriceCents: number;
  qty: number;
};

export type Order = {
  id: string;
  status: string;
  totalAmountCents: number;
  currency: string;
  trackingNumber?: string | null;
  carrier?: string | null;
  trackingUrl?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  completedAt?: string | null;
  items: OrderItem[];
  address: OrderAddress;
};

export type OrdersResponse = {
  page: number;
  limit: number;
  total: number;
  items: Order[];
};

export type CheckoutResponse = {
  id: string;
  status: string;
  totalAmountCents: number;
  currency: string;
};

export async function fetchOrders(params: {
  page: number;
  limit: number;
  status?: string;
}) {
  const search = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  if (params.status) {
    search.set("status", params.status);
  }

  const response = await apiFetch(`/orders?${search.toString()}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to load orders");
  }
  return (await response.json()) as OrdersResponse;
}

export async function checkout(address: OrderAddress) {
  const payload = {
    address: {
      fullName: address.fullName,
      line1: address.line1,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      ...(address.line2 ? { line2: address.line2 } : {}),
      ...(address.phone ? { phone: address.phone } : {}),
    },
  };

  const response = await apiFetch("/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || "Checkout failed");
  }

  return (await response.json()) as CheckoutResponse;
}
