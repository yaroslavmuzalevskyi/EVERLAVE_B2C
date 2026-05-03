import { apiFetch } from "@/lib/apiClient";

export type ReviewImage = {
  url: string | null;
  s3Key?: string | null;
  resolvedUrl?: string;
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
  data: { rating: number; text?: string; imageFiles?: File[] },
) {
  const normalizedProductRef = normalizeProductRef(productId);
  if (!normalizedProductRef) {
    throw new Error("Product reference is required");
  }
  const resolvedProductId = encodeURIComponent(normalizedProductRef);
  const hasFiles = data.imageFiles && data.imageFiles.length > 0;

  if (hasFiles) {
    // Try FormData (supports image files)
    const formData = new FormData();
    formData.append("rating", String(data.rating));
    if (data.text) formData.append("text", data.text);
    // Try both "images" (plural) and "image" (singular) field names
    data.imageFiles!.forEach((file) => formData.append("images", file));

    const response = await apiFetch(`/products/${resolvedProductId}/reviews`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      return response.json();
    }

    // If FormData failed, try with "image" field name (singular)
    if (response.status === 400) {
      const formData2 = new FormData();
      formData2.append("rating", String(data.rating));
      if (data.text) formData2.append("text", data.text);
      data.imageFiles!.forEach((file) => formData2.append("image", file));

      const response2 = await apiFetch(`/products/${resolvedProductId}/reviews`, {
        method: "POST",
        body: formData2,
      });

      if (response2.ok) {
        return response2.json();
      }
    }

    // Final fallback: JSON without images
    const jsonBody: Record<string, unknown> = { rating: data.rating };
    if (data.text) jsonBody.text = data.text;

    const jsonResponse = await apiFetch(`/products/${resolvedProductId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonBody),
    });

    if (!jsonResponse.ok) {
      const error = (await jsonResponse.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };
      throw new Error(
        error?.message || error?.error || `Failed to submit review (${jsonResponse.status})`,
      );
    }

    return jsonResponse.json();
  }

  // No files — use JSON
  const jsonBody: Record<string, unknown> = { rating: data.rating };
  if (data.text) jsonBody.text = data.text;

  const response = await apiFetch(`/products/${resolvedProductId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jsonBody),
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
