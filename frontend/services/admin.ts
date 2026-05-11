import { apiFetch } from "@/lib/apiClient";

type ApiValidationErrorPayload = {
  message?: string;
  error?: string | boolean;
  details?: {
    fieldErrors?: Record<string, string[]>;
  };
};

function buildAdminErrorMessage(
  payload: ApiValidationErrorPayload,
  fallback: string,
) {
  const base =
    typeof payload?.message === "string"
      ? payload.message
      : typeof payload?.error === "string"
        ? payload.error
        : fallback;

  const fieldErrors = payload?.details?.fieldErrors;
  if (!fieldErrors || typeof fieldErrors !== "object") return base;

  const details = Object.entries(fieldErrors)
    .flatMap(([field, messages]) =>
      (messages ?? []).map((message) => `${field}: ${message}`),
    )
    .join("; ");

  return details ? `${base} (${details})` : base;
}

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  currency: string;
  stockQty: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  content?: {
    subtitle?: string;
    description?: string;
    effects?: string[];
    gen_balance_desk?: string;
    geneticBalance?: {
      indica?: number;
      sativa?: number;
    };
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  image?: {
    id: string;
    url: string | null;
    s3Key: string | null;
    sortOrder: number;
    resolvedUrl: string;
  };
  images?: Array<{
    id: string;
    url: string | null;
    s3Key: string | null;
    sortOrder: number;
    resolvedUrl: string;
  }>;
  packs?: Array<{
    id: string;
    name: string;
    paidQty: number;
    bonusQty: number;
    totalUnits?: number;
    priceCents: number;
    currency: string;
    isActive: boolean;
    sortOrder: number;
  }>;
};

export type AdminProductsResponse = {
  page: number;
  limit: number;
  total: number;
  items: AdminProduct[];
};

export async function fetchAdminProducts(params?: {
  page?: number;
  limit?: number;
  q?: string;
  isActive?: boolean;
}) {
  const search = new URLSearchParams();
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.q) search.set("q", params.q);
  if (params?.isActive !== undefined) search.set("isActive", String(params.isActive));

  const response = await apiFetch(`/admin/products?${search.toString()}`);
  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as ApiValidationErrorPayload;
    throw new Error(buildAdminErrorMessage(err, "Failed to load products"));
  }
  return (await response.json()) as AdminProductsResponse;
}

export async function fetchAdminProduct(productId: string) {
  const response = await apiFetch(`/admin/products/${productId}`);
  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as ApiValidationErrorPayload;
    throw new Error(buildAdminErrorMessage(err, "Product not found"));
  }
  return (await response.json()) as AdminProduct;
}

export async function createAdminProduct(data: {
  name: string;
  slug?: string;
  content: { subtitle?: string; description?: string; effects?: string[]; gen_balance_desk?: string };
  priceCents: number;
  currency?: string;
  stockQty?: number;
  isActive?: boolean;
  categoryId?: string;
  categorySlug?: string;
}) {
  const response = await apiFetch("/admin/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as ApiValidationErrorPayload;
    throw new Error(buildAdminErrorMessage(err, "Failed to create product"));
  }
  return (await response.json()) as AdminProduct;
}

export async function updateAdminProduct(productId: string, data: Record<string, unknown>) {
  const response = await apiFetch(`/admin/products/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as ApiValidationErrorPayload;
    throw new Error(buildAdminErrorMessage(err, "Failed to update product"));
  }
  return (await response.json()) as AdminProduct;
}

export async function deleteAdminProduct(productId: string) {
  const response = await apiFetch(`/admin/products/${productId}`, { method: "DELETE" });
  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as ApiValidationErrorPayload;
    throw new Error(buildAdminErrorMessage(err, "Failed to delete product"));
  }
  return (await response.json()) as AdminProduct;
}

export async function uploadProductImage(productId: string, file: File, sortOrder = 0) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("sortOrder", String(sortOrder));

  const response = await apiFetch(`/admin/products/${productId}/images`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as ApiValidationErrorPayload;
    throw new Error(buildAdminErrorMessage(err, "Failed to upload image"));
  }
  return response.json();
}

export async function updateProductImage(
  productId: string,
  imageId: string,
  data: { sortOrder?: number },
) {
  const response = await apiFetch(`/admin/products/${productId}/images/${imageId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as ApiValidationErrorPayload;
    throw new Error(buildAdminErrorMessage(err, "Failed to update image"));
  }
  return response.json();
}

export async function deleteProductImage(productId: string, imageId: string) {
  const response = await apiFetch(`/admin/products/${productId}/images/${imageId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as ApiValidationErrorPayload;
    throw new Error(buildAdminErrorMessage(err, "Failed to delete image"));
  }
}

export async function createProductPacks(
  productId: string,
  packs: Array<{
    name: string;
    paidQty: number;
    bonusQty?: number;
    priceCents: number;
    currency?: string;
    isActive?: boolean;
    sortOrder?: number;
  }>,
) {
  const response = await apiFetch(`/admin/products/${productId}/packs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ packs }),
  });
  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as ApiValidationErrorPayload;
    throw new Error(buildAdminErrorMessage(err, "Failed to create packs"));
  }
  return response.json();
}

export async function updateProductPack(
  productId: string,
  packId: string,
  data: Record<string, unknown>,
) {
  const response = await apiFetch(`/admin/products/${productId}/packs/${packId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as ApiValidationErrorPayload;
    throw new Error(buildAdminErrorMessage(err, "Failed to update pack"));
  }
  return response.json();
}
