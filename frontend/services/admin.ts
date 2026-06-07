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

export type AdminProductSeoMetadata = {
  title: string;
  description: string;
  keywords: string[];
  robots: string;
  ogTitle: string;
  ogDescription: string;
};

export const EMPTY_PRODUCT_SEO: AdminProductSeoMetadata = {
  title: "",
  description: "",
  keywords: [],
  robots: "index,follow",
  ogTitle: "",
  ogDescription: "",
};

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  priceCents: number;
  currency: string;
  stockQty: number;
  isActive: boolean;
  isArchived?: boolean;
  seoMetadata?: AdminProductSeoMetadata;
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
    alt?: string | null;
    s3Key: string | null;
    sortOrder: number;
    resolvedUrl: string;
  };
  images?: Array<{
    id: string;
    url: string | null;
    alt?: string | null;
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
    isArchived?: boolean;
    sortOrder: number;
  }>;
  filterValues?: Array<AdminFilterValue>;
};

export type AdminFilterValue = {
  id: string;
  filter: {
    id: string;
    name: string;
    slug: string;
    type: "select" | "multi" | "boolean" | "number" | "range" | string;
  };
  option?: { id: string; value: string } | null;
  value?: string | number | boolean | null;
  numberMin?: number | null;
  numberMax?: number | null;
  min?: number | null;
  max?: number | null;
  booleanValue?: boolean | null;
  numberValue?: number | null;
};

export type FilterValueInput = {
  filterId?: string;
  filterSlug?: string;
  optionId?: string;
  optionValue?: string;
  booleanValue?: boolean;
  numberValue?: number;
  numberMin?: number;
  numberMax?: number;
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

export async function uploadProductImage(
  productId: string,
  file: File,
  sortOrder = 0,
  alt?: string,
) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("sortOrder", String(sortOrder));
  if (alt != null) formData.append("alt", alt);

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
  data: { sortOrder?: number; alt?: string | null },
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

export async function createProductFilterValue(
  productId: string,
  data: FilterValueInput,
) {
  const response = await apiFetch(
    `/admin/products/${productId}/filter-values`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as ApiValidationErrorPayload;
    throw new Error(buildAdminErrorMessage(err, "Failed to create filter value"));
  }
  return response.json() as Promise<AdminFilterValue>;
}

export async function updateProductFilterValue(
  productId: string,
  filterValueId: string,
  data: Omit<FilterValueInput, "filterId" | "filterSlug">,
) {
  const response = await apiFetch(
    `/admin/products/${productId}/filter-values/${filterValueId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as ApiValidationErrorPayload;
    throw new Error(buildAdminErrorMessage(err, "Failed to update filter value"));
  }
  return response.json() as Promise<AdminFilterValue>;
}

export async function deleteProductFilterValue(
  productId: string,
  filterValueId: string,
) {
  const response = await apiFetch(
    `/admin/products/${productId}/filter-values/${filterValueId}`,
    { method: "DELETE" },
  );
  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as ApiValidationErrorPayload;
    throw new Error(buildAdminErrorMessage(err, "Failed to delete filter value"));
  }
  return response.json();
}
