const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://backend.evervale.org";

export type PublicBlogCategory = {
  slug: string;
  name: string;
  description?: string;
};

export type PublicBlogSeo = {
  title?: string;
  description?: string;
  keywords?: string[];
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
};

export type PublicBlogTextBlock = { type: "text"; body: string };
export type PublicBlogImageBlock = {
  type: "image";
  imageId: string;
  image?: { url: string; alt?: string | null };
};
export type PublicBlogTextImageBlock = {
  type: "text_image";
  imagePosition: "left" | "right";
  body: string;
  imageId: string;
  image?: { url: string; alt?: string | null };
};
export type PublicBlogBlock =
  | PublicBlogTextBlock
  | PublicBlogImageBlock
  | PublicBlogTextImageBlock;

export type PublicBlogListItem = {
  title: string;
  slug: string;
  excerpt?: string;
  seoMetadata?: PublicBlogSeo;
  publishedAt?: string | null;
  category?: PublicBlogCategory;
  mainImage?: { url: string; alt?: string | null } | null;
  readTime?: number;
};

export type PublicBlogDetail = PublicBlogListItem & {
  content?: PublicBlogBlock[];
};

export type PublicBlogsResponse = {
  page: number;
  limit: number;
  total: number;
  items: PublicBlogListItem[];
};

export async function fetchPublicBlogCategories(): Promise<PublicBlogCategory[]> {
  const response = await fetch(`${API_BASE_URL}/blog-categories`);
  if (!response.ok) return [];
  const data = (await response.json()) as PublicBlogCategory[];
  return Array.isArray(data) ? data : [];
}

export async function fetchPublicBlogs(params?: {
  page?: number;
  limit?: number;
  category?: string;
}): Promise<PublicBlogsResponse> {
  const search = new URLSearchParams();
  search.set("page", String(params?.page ?? 1));
  search.set("limit", String(params?.limit ?? 20));
  if (params?.category) search.set("category", params.category);
  const response = await fetch(`${API_BASE_URL}/blogs?${search.toString()}`);
  if (!response.ok) {
    return { page: 1, limit: 20, total: 0, items: [] };
  }
  const raw = (await response.json().catch(() => null)) as
    | Partial<PublicBlogsResponse>
    | PublicBlogListItem[]
    | null;
  if (Array.isArray(raw)) {
    return { page: 1, limit: raw.length, total: raw.length, items: raw };
  }
  return {
    page: raw?.page ?? 1,
    limit: raw?.limit ?? 20,
    total: raw?.total ?? 0,
    items: Array.isArray(raw?.items) ? raw!.items! : [],
  };
}

export async function fetchPublicBlog(slug: string): Promise<PublicBlogDetail | null> {
  const response = await fetch(`${API_BASE_URL}/blogs/${slug}`);
  if (!response.ok) return null;
  return (await response.json()) as PublicBlogDetail;
}

export function formatBlogDate(value?: string | null) {
  if (!value) return "";
  try {
    const d = new Date(value);
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

export function formatBlogDateTime(value?: string | null) {
  if (!value) return "";
  try {
    const d = new Date(value);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

export function formatReadTime(readTime?: number) {
  if (!readTime) return "";
  return `${readTime} Min`;
}
