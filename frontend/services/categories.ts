export type CategoryFilter = {
  name: string;
  slug: string;
  type: "select" | "multi" | "boolean" | "number" | "range" | string;
  options?: Array<{ value: string }>;
};

export type CategoryItem = {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  filters?: CategoryFilter[];
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://vale-express-backend.onrender.com";

function getBaseUrl() {
  return API_BASE_URL;
}

export async function fetchCategories(): Promise<CategoryItem[]> {
  const response = await fetch(`${getBaseUrl()}/categories`);
  if (!response.ok) {
    throw new Error("Failed to load categories");
  }
  const data = (await response.json()) as CategoryItem[];
  return Array.isArray(data) ? data : [];
}

export async function fetchCategoryFilters(
  slug: string,
): Promise<CategoryFilter[]> {
  if (!slug) return [];
  const response = await fetch(`${getBaseUrl()}/categories/${slug}/filters`);
  if (!response.ok) {
    throw new Error("Failed to load category filters");
  }
  const data = (await response.json()) as CategoryFilter[];
  return Array.isArray(data) ? data : [];
}
