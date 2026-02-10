export type ProductImage = {
  id: string;
  url: string;
  sortOrder: number;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

export type ProductListItem = {
  id: string;
  name: string;
  content?: {
    description?: string;
  };
  priceCents: number;
  currency: string;
  stockQty: number;
  images?: ProductImage[];
  category?: ProductCategory;
  soldCount?: number;
  ratingAvg?: number;
  reviewCount?: number;
};

export type ProductListResponse = {
  page: number;
  limit: number;
  total: number;
  items: ProductListItem[];
};

export type ProductDetails = ProductListItem & {
  content?: {
    description?: string;
    keyFacts?: string[];
    sections?: Array<{ title: string; text: string }>;
  };
  createdAt?: string;
  updatedAt?: string;
};

export type ProductQuery = {
  page: number;
  limit: number;
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "";

export function formatPrice(priceCents: number, currency = "EUR") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

type FetchInit = RequestInit & {
  next?: { revalidate?: number };
};

export async function fetchProducts(
  query: ProductQuery,
  init?: FetchInit,
): Promise<ProductListResponse> {
  const params = new URLSearchParams();
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));
  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  if (query.minPrice !== undefined)
    params.set("minPrice", String(query.minPrice));
  if (query.maxPrice !== undefined)
    params.set("maxPrice", String(query.maxPrice));
  if (query.sort) params.set("sort", query.sort);

  const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`, {
    ...init,
  });

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  return (await response.json()) as ProductListResponse;
}

export async function fetchProductById(id: string, init?: FetchInit) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    ...init,
  });

  if (!response.ok) {
    throw new Error("Failed to load product");
  }

  return (await response.json()) as ProductDetails;
}
