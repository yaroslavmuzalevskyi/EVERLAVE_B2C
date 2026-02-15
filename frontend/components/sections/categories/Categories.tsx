"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import CategoryCard from "@/components/ui/CategoryCard";
import { fetchCategories, type CategoryItem } from "@/services/categories";
import { fetchAllProducts } from "@/services/products";

const fallbackCategories: CategoryItem[] = [];

export default function Categories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchCategories(), fetchAllProducts()])
      .then(([categoryData, productData]) => {
        if (!mounted || categoryData.length === 0) return;
        const categorySet = new Set(
          productData
            .map((product) => product.category?.slug ?? product.category?.name)
            .filter(Boolean)
            .map((value) => value?.toLowerCase()),
        );
        const filtered = categoryData.filter((category) =>
          categorySet.has(category.slug?.toLowerCase() ?? ""),
        );
        setCategories(filtered.length > 0 ? filtered : categoryData);
        setHasError(false);
      })
      .catch(() => {
        if (!mounted) return;
        setHasError(true);
        setCategories(fallbackCategories);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-pr_w">Categories</h2>
          <p className=" text-sm text-pr_w/70 sm:text-base">
            Browse product categories for cultivation and distribution
          </p>
        </div>
        <Link href="/products">
          <Button variant="category">All Categories</Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`category-skeleton-${index}`}
                className={`min-h-[180px] rounded-2xl border border-white/10 bg-white/5`}
              />
            ))
          : categories.map((category, index) => (
              <CategoryCard
                key={category.slug ?? category.name}
                title={category.name}
                description={
                  category.description ?? "Browse products in this category"
                }
                index={index}
                href={
                  category.slug ? `/products?category=${category.slug}` : "/products"
                }
              />
            ))}
      </div>
      {hasError ? (
        <p className="mt-3 text-xs text-pr_w/70">
          Could not load categories from API. Showing offline data.
        </p>
      ) : null}
    </section>
  );
}
