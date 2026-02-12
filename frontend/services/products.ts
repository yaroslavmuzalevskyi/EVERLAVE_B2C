export type ProductImage = {
  id?: string;
  url: string;
  sortOrder: number;
};

export type ProductCategory = {
  id?: string;
  name?: string;
  slug?: string;
};

export type ProductListItem = {
  id: string;
  name: string;
  content?: {
    description?: string;
  };
  priceCents: number;
  currency: string;
  stockQty?: number;
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
    facts?: {
      yield?: string;
      seedType?: string;
      thcLevel?: string;
      flavorAroma?: string;
      floweringCycle?: string;
    };
    effects?: string[];
    variants?: Array<{ label: string; priceCents: number }>;
    geneticBalance?: {
      indica?: number;
      sativa?: number;
      [key: string]: number | undefined;
    };
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

type RawImage =
  | string
  | {
      id?: string;
      url?: string;
      src?: string;
      path?: string;
      sortOrder?: number;
      order?: number;
    };

type RawProduct = {
  id?: string;
  _id?: string;
  uuid?: string;
  name?: string;
  title?: string;
  content?: {
    description?: string;
    keyFacts?: string[];
    sections?: Array<{ title?: string; text?: string }>;
    facts?: {
      yield?: string;
      seedType?: string;
      thcLevel?: string;
      flavorAroma?: string;
      floweringCycle?: string;
      [key: string]: string | undefined;
    };
    effects?: string[];
    variants?: Array<{ label?: string; priceCents?: number }>;
    geneticBalance?: Record<string, number | undefined>;
  };
  description?: string;
  shortDescription?: string;
  summary?: string;
  priceCents?: number;
  price?: number | string;
  currency?: string;
  stockQty?: number;
  stock?: number;
  images?: RawImage[];
  image?: string;
  category?:
    | ProductCategory
    | string
    | { name?: string; slug?: string; id?: string };
  soldCount?: number;
  sold?: number;
  ratingAvg?: number;
  rating?: number;
  reviewCount?: number;
  reviews?: number;
  createdAt?: string;
  updatedAt?: string;
};

function normalizeCurrency(raw: RawProduct) {
  return raw.currency || "EUR";
}

function normalizePriceCents(raw: RawProduct) {
  if (typeof raw.priceCents === "number") return raw.priceCents;

  if (typeof raw.price === "number") {
    if (raw.price > 1000) return Math.round(raw.price);
    return Math.round(raw.price * 100);
  }

  if (typeof raw.price === "string") {
    const numeric = Number(raw.price.replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(numeric)) return 0;
    if (numeric > 1000) return Math.round(numeric);
    return Math.round(numeric * 100);
  }

  return 0;
}

function normalizeImages(images?: RawImage[], fallback?: string) {
  const rawImages = images ?? (fallback ? [fallback] : []);
  return rawImages
    .map((image, index) => {
      if (typeof image === "string") {
        return {
          id: `${index}`,
          url: image,
          sortOrder: index,
        } as ProductImage;
      }
      const url = image.url || image.src || image.path;
      if (!url) return null;
      return {
        id: image.id ?? `${index}`,
        url,
        sortOrder:
          typeof image.sortOrder === "number"
            ? image.sortOrder
            : typeof image.order === "number"
              ? image.order
              : index,
      } as ProductImage;
    })
    .filter(Boolean) as ProductImage[];
}

function normalizeCategory(raw: RawProduct): ProductCategory | undefined {
  if (!raw.category) return undefined;
  if (typeof raw.category === "string") {
    return { name: raw.category, slug: raw.category };
  }
  return {
    id: raw.category.id,
    name: raw.category.name,
    slug: raw.category.slug,
  };
}

function normalizeContent(raw: RawProduct) {
  const description =
    raw.content?.description ||
    raw.description ||
    raw.shortDescription ||
    raw.summary;
  const keyFacts = raw.content?.keyFacts;
  const sections = raw.content?.sections
    ?.filter((section) => section.title || section.text)
    .map((section) => ({
      title: section.title ?? "Details",
      text: section.text ?? "",
    }));
  const facts = raw.content?.facts;
  const effects = raw.content?.effects;
  const variants = raw.content?.variants?.filter((variant) => variant.label);
  const geneticBalance = raw.content?.geneticBalance;

  if (
    !description &&
    !keyFacts &&
    !sections &&
    !facts &&
    !effects &&
    !variants &&
    !geneticBalance
  )
    return undefined;

  return {
    description,
    keyFacts,
    sections,
    facts,
    effects,
    variants: variants?.map((variant) => ({
      label: variant.label ?? "",
      priceCents: variant.priceCents ?? 0,
    })),
    geneticBalance,
  };
}

function normalizeProduct(raw: RawProduct): ProductDetails {
  const id = raw.id || raw._id || raw.uuid || "";
  const name = raw.name || raw.title || "Product";

  return {
    id,
    name,
    content: normalizeContent(raw),
    priceCents: normalizePriceCents(raw),
    currency: normalizeCurrency(raw),
    stockQty: raw.stockQty ?? raw.stock,
    images: normalizeImages(raw.images, raw.image),
    category: normalizeCategory(raw),
    soldCount: raw.soldCount ?? raw.sold,
    ratingAvg: raw.ratingAvg ?? raw.rating,
    reviewCount: raw.reviewCount ?? raw.reviews,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function normalizeListResponse(data: unknown): ProductListResponse {
  if (Array.isArray(data)) {
    return {
      page: 1,
      limit: data.length,
      total: data.length,
      items: data.map((item) => normalizeProduct(item as RawProduct)),
    };
  }

  const payload = data as
    | {
        page?: number;
        limit?: number;
        total?: number;
        items?: RawProduct[];
        data?: RawProduct[] | { items?: RawProduct[]; total?: number; page?: number; limit?: number };
        meta?: { total?: number; page?: number; limit?: number };
      }
    | undefined;

  if (payload?.items) {
    return {
      page: payload.page ?? 1,
      limit: payload.limit ?? payload.items.length,
      total: payload.total ?? payload.items.length,
      items: payload.items.map((item) => normalizeProduct(item)),
    };
  }

  if (Array.isArray(payload?.data)) {
    return {
      page: payload?.page ?? 1,
      limit: payload?.limit ?? payload.data.length,
      total: payload?.total ?? payload.data.length,
      items: payload.data.map((item) => normalizeProduct(item)),
    };
  }

  if (payload?.data && Array.isArray(payload.data.items)) {
    return {
      page: payload.data.page ?? payload.page ?? 1,
      limit: payload.data.limit ?? payload.limit ?? payload.data.items.length,
      total: payload.data.total ?? payload.total ?? payload.data.items.length,
      items: payload.data.items.map((item) => normalizeProduct(item)),
    };
  }

  return {
    page: 1,
    limit: 0,
    total: 0,
    items: [],
  };
}

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

  const data = (await response.json()) as unknown;
  return normalizeListResponse(data);
}

export async function fetchProductById(id: string, init?: FetchInit) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    ...init,
  });

  if (!response.ok) {
    throw new Error("Failed to load product");
  }

  const data = (await response.json()) as RawProduct | { data?: RawProduct };
  const rawProduct =
    (data as { data?: RawProduct }).data ?? (data as RawProduct);
  return normalizeProduct(rawProduct);
}

export function getPrimaryImageUrl(images?: ProductImage[]) {
  if (!images || images.length === 0) return "";
  return images.slice().sort((a, b) => a.sortOrder - b.sortOrder)[0]?.url ?? "";
}
