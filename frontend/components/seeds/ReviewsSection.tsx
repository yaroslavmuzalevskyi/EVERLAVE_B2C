"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import RatingBar from "@/components/seeds/RatingBar";
import ReviewCard from "@/components/seeds/ReviewCard";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  createReview,
  deleteReview,
  fetchReviews,
  fetchReviewSummary,
  ReviewSummary,
} from "@/services/reviews";

type ReviewsSectionProps = {
  productId: string;
};

const emptySummary: ReviewSummary = {
  ratingAvg: 0,
  reviewCount: 0,
};

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [summary, setSummary] = useState<ReviewSummary>(emptySummary);
  const [reviews, setReviews] = useState<
    Array<{
      id?: string;
      rating: number;
      text?: string;
      createdAt: string;
      isMine?: boolean;
      user: { name: string };
      images?: { url: string }[];
    }>
  >([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formRating, setFormRating] = useState(5);
  const [formText, setFormText] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const pageCount = Math.max(1, Math.ceil(total / 3));

  const ratingBreakdown = useMemo(() => {
    return reviews.reduce(
      (acc, review) => {
        const key = String(review.rating) as keyof typeof acc;
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      },
      { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
    );
  }, [reviews]);

  const reviewImages = useMemo(() => {
    return reviews
      .flatMap((review) => review.images ?? [])
      .map((image) => image.url)
      .slice(0, 6);
  }, [reviews]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [summaryData, reviewsData] = await Promise.all([
          fetchReviewSummary(productId),
          fetchReviews(productId, page, 3),
        ]);
        if (!isMounted) return;
        setSummary(summaryData);
        setReviews(reviewsData.items);
        setTotal(reviewsData.total);
      } catch {
        if (!isMounted) return;
        setSummary(emptySummary);
        setReviews([]);
        setTotal(0);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (productId) {
      load();
    }
    return () => {
      isMounted = false;
    };
  }, [productId, page]);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      router.push(`/signin?next=${encodeURIComponent(pathname ?? "/")}`);
      return;
    }

    if (formRating < 1 || formRating > 5) {
      setFormError("Rating must be between 1 and 5");
      return;
    }

    setFormError("");
    setFormLoading(true);
    try {
      await createReview(productId, {
        rating: formRating,
        text: formText.trim() || undefined,
      });
      setFormText("");
      setFormRating(5);
      setPage(1);
      const [summaryData, reviewsData] = await Promise.all([
        fetchReviewSummary(productId),
        fetchReviews(productId, 1, 3),
      ]);
      setSummary(summaryData);
      setReviews(reviewsData.items);
      setTotal(reviewsData.total);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to submit review",
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (reviewId?: string) => {
    if (!reviewId) return;
    setFormError("");
    setFormLoading(true);
    try {
      await deleteReview(reviewId);
      setPage(1);
      const [summaryData, reviewsData] = await Promise.all([
        fetchReviewSummary(productId),
        fetchReviews(productId, 1, 3),
      ]);
      setSummary(summaryData);
      setReviews(reviewsData.items);
      setTotal(reviewsData.total);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to delete review",
      );
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
      <div className="space-y-6">
        <div className="rounded-2xl bg-pr_w p-6 text-pr_dg">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Average Rate</span>
            <span>{summary.ratingAvg.toFixed(1)} ★</span>
          </div>
          <p className="mt-1 text-xs text-pr_dg/60">
            {summary.reviewCount} reviews
          </p>
          <div className="mt-4 space-y-3">
            <RatingBar
              label="5 - Excellent"
              value={ratingBreakdown["5"]}
              total={reviews.length || 1}
            />
            <RatingBar
              label="4 - Very Good"
              value={ratingBreakdown["4"]}
              total={reviews.length || 1}
            />
            <RatingBar
              label="3 - Good"
              value={ratingBreakdown["3"]}
              total={reviews.length || 1}
            />
            <RatingBar
              label="2 - Fair"
              value={ratingBreakdown["2"]}
              total={reviews.length || 1}
            />
            <RatingBar
              label="1 - Poor"
              value={ratingBreakdown["1"]}
              total={reviews.length || 1}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-pr_w p-6 text-pr_dg">
          <p className="text-sm font-semibold">Review this product</p>
          <p className="mt-1 text-xs text-pr_dg/70">
            Share your thoughts with other customers
          </p>
          <div className="mt-4 flex gap-2">
            {Array.from({ length: 5 }, (_, index) => index + 1).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFormRating(value)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  formRating === value
                    ? "border-pr_dg bg-pr_dg text-pr_w"
                    : "border-pr_dg/30 text-pr_dg"
                }`}
              >
                {value}★
              </button>
            ))}
          </div>
          <textarea
            value={formText}
            onChange={(event) => setFormText(event.target.value)}
            placeholder="Write your review..."
            className="mt-4 min-h-[90px] w-full rounded-2xl border border-pr_dg/20 px-4 py-3 text-xs text-pr_dg outline-none"
          />
          {formError ? (
            <p className="mt-2 text-xs text-pr_dr">{formError}</p>
          ) : null}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={formLoading}
            className="mt-4 w-full rounded-full bg-sr_dg px-4 py-2 text-xs font-semibold text-pr_w disabled:opacity-60"
          >
            {formLoading
              ? "Submitting..."
              : isAuthenticated
                ? "Write a customer review"
                : "Sign in to review"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl bg-pr_w p-6 text-pr_dg">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Review with images</p>
            <button
              type="button"
              className="rounded-full bg-sr_dg px-3 py-1 text-xs font-semibold text-pr_w"
            >
              See All Photos
            </button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {reviewImages.length > 0 ? (
              reviewImages.map((url, index) => (
                <img
                  key={`${url}-${index}`}
                  src={url}
                  alt=""
                  className="h-20 w-full rounded-lg object-cover"
                />
              ))
            ) : (
              <>
                <div className="h-20 rounded-lg bg-sr_dg/90" />
                <div className="h-20 rounded-lg bg-sr_dg/90" />
                <div className="h-20 rounded-lg bg-sr_dg/90" />
              </>
            )}
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-pr_w p-6 text-pr_dg">
            <p className="text-sm text-pr_dg/70">Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review, index) => (
            <ReviewCard
              key={review.id ?? `${review.user?.name ?? "user"}-${review.createdAt}-${index}`}
              name={review.user?.name ?? "Anonymous"}
              rating={review.rating}
              text={review.text ?? "No review text."}
              images={review.images?.map((image) => image.url) ?? []}
              createdAt={review.createdAt}
              isMine={review.isMine}
              onDelete={review.id ? () => handleDelete(review.id) : undefined}
            />
          ))
        ) : (
          <div className="rounded-2xl bg-pr_w p-6 text-pr_dg">
            <p className="text-sm text-pr_dg/70">No reviews yet.</p>
          </div>
        )}

        {pageCount > 1 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="rounded-full border border-pr_dg/20 px-3 py-1 text-xs text-pr_dg disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-xs text-pr_dg/60">
              Page {page} of {pageCount}
            </span>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
              disabled={page === pageCount}
              className="rounded-full border border-pr_dg/20 px-3 py-1 text-xs text-pr_dg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
