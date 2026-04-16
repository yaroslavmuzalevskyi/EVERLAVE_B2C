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
  url?: string;
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

export async function checkout(address: OrderAddress, deliveryOptionId?: string) {
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
    ...(deliveryOptionId ? { shippingRateId: deliveryOptionId } : {}),
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

export async function fetchDeliveryOptions(countryCode: string): Promise<DeliveryOption[]> {
  const response = await apiFetch(`/cart/delivery-options?country=${encodeURIComponent(countryCode)}`);
  if (!response.ok) return [];
  const data = await response.json().catch(() => ({}));
  return data.options ?? [];
}

export async function resumeCheckout(orderId: string) {
  const response = await apiFetch("/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to resume checkout");
  }

  return (await response.json()) as CheckoutResponse;
}
