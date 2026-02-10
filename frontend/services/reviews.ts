import { apiFetch } from "@/lib/apiClient";

export type ReviewImage = {
  id: string;
  url: string;
};

export type ReviewUser = {
  id: string;
  name: string;
};

export type ReviewItem = {
  id: string;
  rating: number;
  text?: string;
  createdAt: string;
  user: ReviewUser;
  images?: ReviewImage[];
};

export type ReviewsResponse = {
  page: number;
  limit: number;
  total: number;
  items: ReviewItem[];
};

export type ReviewSummary = {
  count: number;
  avg: number;
  breakdown: Record<"1" | "2" | "3" | "4" | "5", number>;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "";

export async function fetchReviews(
  productId: string,
  page: number,
  limit: number,
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const response = await fetch(
    `${API_BASE_URL}/products/${productId}/reviews?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to load reviews");
  }

  return (await response.json()) as ReviewsResponse;
}

export async function fetchReviewSummary(productId: string) {
  const response = await fetch(
    `${API_BASE_URL}/products/${productId}/reviews/summary`,
  );

  if (!response.ok) {
    throw new Error("Failed to load review summary");
  }

  return (await response.json()) as ReviewSummary;
}

export async function createReview(
  productId: string,
  data: { rating: number; text?: string; images?: string[] },
) {
  const response = await apiFetch(`/products/${productId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to submit review");
  }

  return response.json();
}

export async function deleteReview(reviewId: string) {
  const response = await apiFetch(`/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to delete review");
  }

  return response.json() as Promise<{ success: boolean }>;
}
