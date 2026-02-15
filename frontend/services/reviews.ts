import { apiFetch } from "@/lib/apiClient";

export type ReviewImage = {
  url: string;
};

export type ReviewUser = {
  name: string;
};

export type ReviewItem = {
  id?: string;
  rating: number;
  text?: string;
  createdAt: string;
  isMine?: boolean;
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
  ratingAvg: number;
  reviewCount: number;
};

function normalizeProductRef(productRef: string) {
  return productRef.trim();
}

export async function fetchReviews(
  productId: string,
  page: number,
  limit: number,
) {
  const normalizedProductRef = normalizeProductRef(productId);
  if (!normalizedProductRef) {
    throw new Error("Product reference is required");
  }
  const resolvedProductId = encodeURIComponent(normalizedProductRef);
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  const response = await apiFetch(
    `/products/${resolvedProductId}/reviews?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error("Failed to load reviews");
  }

  return (await response.json()) as ReviewsResponse;
}

export async function fetchReviewSummary(productId: string) {
  const normalizedProductRef = normalizeProductRef(productId);
  if (!normalizedProductRef) {
    throw new Error("Product reference is required");
  }
  const resolvedProductId = encodeURIComponent(normalizedProductRef);
  const response = await apiFetch(
    `/products/${resolvedProductId}/reviews/summary`,
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
  const normalizedProductRef = normalizeProductRef(productId);
  if (!normalizedProductRef) {
    throw new Error("Product reference is required");
  }
  const resolvedProductId = encodeURIComponent(normalizedProductRef);
  const response = await apiFetch(`/products/${resolvedProductId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as {
      message?: string;
      error?: string;
    };
    throw new Error(
      error?.message || error?.error || `Failed to submit review (${response.status})`,
    );
  }

  return response.json();
}

export async function deleteReview(reviewId: string) {
  const response = await apiFetch(`/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as {
      message?: string;
      error?: string;
    };
    throw new Error(
      error?.message || error?.error || `Failed to delete review (${response.status})`,
    );
  }

  return response.json() as Promise<{ success: boolean }>;
}
