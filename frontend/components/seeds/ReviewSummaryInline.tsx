"use client";

import { useEffect, useState } from "react";
import { fetchReviewSummary } from "@/services/reviews";

type ReviewSummaryInlineProps = {
  productId: string;
  fallbackRating?: number;
};

export default function ReviewSummaryInline({
  productId,
  fallbackRating = 0,
}: ReviewSummaryInlineProps) {
  const [rating, setRating] = useState(fallbackRating);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const summary = await fetchReviewSummary(productId);
        if (!isMounted) return;
        const value = Number(summary?.ratingAvg ?? fallbackRating);
        setRating(Number.isFinite(value) ? value : fallbackRating);
      } catch {
        if (!isMounted) return;
        setRating(fallbackRating);
      }
    };

    if (productId) load();

    return () => {
      isMounted = false;
    };
  }, [productId, fallbackRating]);

  return <>{Number(rating ?? 0).toFixed(1)}★</>;
}
