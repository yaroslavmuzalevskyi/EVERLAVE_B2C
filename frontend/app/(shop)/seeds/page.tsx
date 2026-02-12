"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import FilterDropdown from "@/components/seeds/FilterDropdown";
import FilterToggle from "@/components/seeds/FilterToggle";
import ProductCard from "@/components/ui/ProductCard";
import { seedItems } from "@/lib/seeds";
import { fetchProducts, formatPrice, getPrimaryImageUrl } from "@/services/products";

const filterOptions = {
  sorting: [
    { label: "Featured", value: "featured" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
  ],
  price: [
    { label: "€0 - €25", value: "0-25" },
    { label: "€25 - €50", value: "25-50" },
    { label: "€50+", value: "50+" },
  ],
  seedType: [
    { label: "Feminized", value: "feminized" },
    { label: "Autoflower", value: "autoflower" },
    { label: "N/A", value: "na" },
  ],
  flowering: [
    { label: "Up to 8 weeks", value: "up-8" },
    { label: "8–10 weeks", value: "8-10" },
    { label: "10+ weeks", value: "10+" },
  ],
  thc: [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ],
  yield: [
    { label: "400–500 g/m²", value: "400-500" },
    { label: "500–650 g/m²", value: "500-650" },
    { label: "650+ g/m²", value: "650+" },
  ],
};

type SeedCardItem = {
  productId?: string;
  title: string;
  description: string;
  price: string;
  imageUrl?: string;
  category?: string;
  priceValue?: number;
  text?: string;
};

const sortMap: Record<string, string | undefined> = {
  featured: "createdAt:desc",
  "price-asc": "price:asc",
  "price-desc": "price:desc",
};

function getPriceValue(price: string) {
  const numeric = Number(price.replace("€", "").trim());
  return Number.isNaN(numeric) ? 0 : numeric;
}

function getTextValue(item: SeedCardItem) {
  if (item.text) return item.text;
  return `${item.title} ${item.description}`.toLowerCase();
}

const fallbackItems: SeedCardItem[] = seedItems.map((seed) => ({
  productId: seed.productId ?? seed.slug,
  title: seed.title,
  description: seed.description,
  price: seed.price,
  priceValue: getPriceValue(seed.price),
  category: seed.category,
  text: `${seed.title} ${seed.description} ${seed.seedType} ${seed.thc} ${seed.yield} ${seed.flowering}`.toLowerCase(),
}));

export default function SeedsPage() {
  const searchParams = useSearchParams();
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [sorting, setSorting] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [seedTypeFilter, setSeedTypeFilter] = useState("");
  const [floweringFilter, setFloweringFilter] = useState("");
  const [thcFilter, setThcFilter] = useState("");
  const [yieldFilter, setYieldFilter] = useState("");
  const [outdoorOnly, setOutdoorOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<SeedCardItem[]>(
    fallbackItems.slice(0, 8),
  );
  const [total, setTotal] = useState(fallbackItems.length);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pageSize = 8;

  const categoryParam = searchParams?.get("category")?.toLowerCase() ?? "";

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-filter-root]")) {
        setOpenFilter(null);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    sorting,
    priceFilter,
    minPrice,
    maxPrice,
    seedTypeFilter,
    floweringFilter,
    thcFilter,
    yieldFilter,
    outdoorOnly,
    categoryParam,
  ]);

  const priceRange = useMemo(() => {
    if (priceFilter === "0-25") return { min: 0, max: 25 };
    if (priceFilter === "25-50") return { min: 25, max: 50 };
    if (priceFilter === "50+") return { min: 50, max: undefined };
    return {
      min: minPrice ? Number(minPrice) : undefined,
      max: maxPrice ? Number(maxPrice) : undefined,
    };
  }, [priceFilter, minPrice, maxPrice]);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchProducts({
          page: currentPage,
          limit: pageSize,
          sort: sortMap[sorting],
          minPrice:
            priceRange.min !== undefined
              ? Math.round(priceRange.min * 100)
              : undefined,
          maxPrice:
            priceRange.max !== undefined
              ? Math.round(priceRange.max * 100)
              : undefined,
          category: categoryParam || (outdoorOnly ? "outdoor" : undefined),
        });

        if (!isMounted) return;

        const mapped = response.items.map((item) => ({
          productId: item.id,
          title: item.name,
          description: item.content?.description ?? "Premium product",
          price: formatPrice(item.priceCents, item.currency),
          imageUrl: getPrimaryImageUrl(item.images),
          category: item.category?.slug ?? item.category?.name,
          priceValue: item.priceCents / 100,
          text: `${item.name} ${item.content?.description ?? ""}`.toLowerCase(),
        }));

        setItems(mapped);
        setTotal(response.total);
      } catch {
        if (!isMounted) return;
        const fallbackPage = fallbackItems.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize,
        );
        setItems(fallbackPage);
        setTotal(fallbackItems.length);
        setError("Failed to load products. Showing offline data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [currentPage, pageSize, sorting, priceRange, outdoorOnly, categoryParam]);

  const filteredItems = useMemo(() => {
    let filtered = [...items];

    if (categoryParam) {
      filtered = filtered.filter((item) => {
        const category = item.category?.toLowerCase() ?? "";
        return category.includes(categoryParam);
      });
    } else if (outdoorOnly) {
      filtered = filtered.filter((item) => {
        const category = item.category?.toLowerCase() ?? "";
        return category.includes("outdoor") || getTextValue(item).includes("outdoor");
      });
    }

    if (priceFilter) {
      filtered = filtered.filter((item) => {
        const value = item.priceValue ?? getPriceValue(item.price);
        if (priceFilter === "0-25") return value <= 25;
        if (priceFilter === "25-50") return value > 25 && value <= 50;
        if (priceFilter === "50+") return value > 50;
        return true;
      });
    }

    if (priceRange.min !== undefined || priceRange.max !== undefined) {
      filtered = filtered.filter((item) => {
        const value = item.priceValue ?? getPriceValue(item.price);
        const min = priceRange.min ?? 0;
        const max = priceRange.max ?? Infinity;
        return value >= min && value <= max;
      });
    }

    if (seedTypeFilter) {
      filtered = filtered.filter((item) => {
        const text = getTextValue(item);
        if (seedTypeFilter === "feminized") return text.includes("feminized");
        if (seedTypeFilter === "autoflower")
          return text.includes("autoflower") || text.includes("auto");
        if (seedTypeFilter === "na")
          return !text.includes("feminized") && !text.includes("autoflower");
        return true;
      });
    }

    if (floweringFilter) {
      filtered = filtered.filter((item) => {
        const text = getTextValue(item);
        if (floweringFilter === "up-8") return text.includes("8");
        if (floweringFilter === "8-10")
          return text.includes("8") || text.includes("9") || text.includes("10");
        if (floweringFilter === "10+") return text.includes("10");
        return true;
      });
    }

    if (thcFilter) {
      filtered = filtered.filter((item) => {
        const text = getTextValue(item);
        if (thcFilter === "low") return text.includes("low") || text.includes("0%");
        if (thcFilter === "medium") return text.includes("medium");
        if (thcFilter === "high") return text.includes("high");
        return true;
      });
    }

    if (yieldFilter) {
      filtered = filtered.filter((item) => {
        const text = getTextValue(item);
        if (yieldFilter === "400-500") return text.includes("400") || text.includes("500");
        if (yieldFilter === "500-650") return text.includes("500") || text.includes("650");
        if (yieldFilter === "650+") return text.includes("650");
        return true;
      });
    }

    if (sorting === "price-asc") {
      filtered.sort(
        (a, b) =>
          (a.priceValue ?? getPriceValue(a.price)) -
          (b.priceValue ?? getPriceValue(b.price)),
      );
    } else if (sorting === "price-desc") {
      filtered.sort(
        (a, b) =>
          (b.priceValue ?? getPriceValue(b.price)) -
          (a.priceValue ?? getPriceValue(a.price)),
      );
    }

    return filtered;
  }, [
    items,
    outdoorOnly,
    categoryParam,
    priceFilter,
    priceRange,
    seedTypeFilter,
    floweringFilter,
    thcFilter,
    yieldFilter,
    sorting,
  ]);

  const clientFilterActive = Boolean(
    seedTypeFilter || floweringFilter || thcFilter || yieldFilter,
  );

  const totalPages = clientFilterActive
    ? 1
    : Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="bg-pr_dg text-pr_w">
      <section className="w-full px-4 pt-[120px] pb-24 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
        <p className="text-xs text-pr_w/60">
          <Link href="/" className="hover:text-pr_w">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/seeds" className="hover:text-pr_w">
            Cannabis Seeds
          </Link>
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Cannabis Seeds</h1>

        <div className="mt-4 flex flex-wrap gap-2" data-filter-root>
          <FilterDropdown
            id="sorting"
            label="Sorting"
            options={filterOptions.sorting}
            selected={sorting}
            open={openFilter === "sorting"}
            onToggle={(id) => setOpenFilter(openFilter === id ? null : id)}
            onSelect={(id, value) => {
              setSorting(value);
              setOpenFilter(null);
            }}
            placeholder="Sorting"
          />
          <FilterDropdown
            id="price"
            label="Price"
            options={filterOptions.price}
            selected={priceFilter}
            open={openFilter === "price"}
            onToggle={(id) => setOpenFilter(openFilter === id ? null : id)}
            onSelect={(id, value) => {
              setPriceFilter(value);
              if (value) {
                setMinPrice("");
                setMaxPrice("");
              }
              setOpenFilter(null);
            }}
            placeholder="Price"
            variant="price"
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={(value) => {
              setMinPrice(value);
              setPriceFilter("");
            }}
            onMaxPriceChange={(value) => {
              setMaxPrice(value);
              setPriceFilter("");
            }}
          />
          <FilterDropdown
            id="seedType"
            label="Seed Type"
            options={filterOptions.seedType}
            selected={seedTypeFilter}
            open={openFilter === "seedType"}
            onToggle={(id) => setOpenFilter(openFilter === id ? null : id)}
            onSelect={(id, value) => {
              setSeedTypeFilter(value);
              setOpenFilter(null);
            }}
            placeholder="Seed Type"
          />
          <FilterToggle
            label="Outdoor"
            active={outdoorOnly}
            onToggle={() => setOutdoorOnly((prev) => !prev)}
          />
          <FilterDropdown
            id="flowering"
            label="Flowering Time"
            options={filterOptions.flowering}
            selected={floweringFilter}
            open={openFilter === "flowering"}
            onToggle={(id) => setOpenFilter(openFilter === id ? null : id)}
            onSelect={(id, value) => {
              setFloweringFilter(value);
              setOpenFilter(null);
            }}
            placeholder="Flowering Time"
          />
          <FilterDropdown
            id="thc"
            label="THC"
            options={filterOptions.thc}
            selected={thcFilter}
            open={openFilter === "thc"}
            onToggle={(id) => setOpenFilter(openFilter === id ? null : id)}
            onSelect={(id, value) => {
              setThcFilter(value);
              setOpenFilter(null);
            }}
            placeholder="THC"
          />
          <FilterDropdown
            id="yield"
            label="Yield"
            options={filterOptions.yield}
            selected={yieldFilter}
            open={openFilter === "yield"}
            onToggle={(id) => setOpenFilter(openFilter === id ? null : id)}
            onSelect={(id, value) => {
              setYieldFilter(value);
              setOpenFilter(null);
            }}
            placeholder="Yield"
          />
        </div>

        {error ? (
          <p className="mt-4 text-xs text-pr_y/90">{error}</p>
        ) : null}

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredItems.map((seed) => (
            <ProductCard
              key={seed.productId ?? seed.title}
              title={seed.title}
              description={seed.description}
              price={seed.price}
              isNew={false}
              href={seed.productId ? `/seeds/${seed.productId}` : undefined}
              productId={seed.productId}
              imageUrl={seed.imageUrl}
            />
          ))}
        </div>

        {!loading && filteredItems.length === 0 ? (
          <p className="mt-6 text-sm text-pr_w/70">No products found.</p>
        ) : null}

        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() =>
              setCurrentPage((prev) => Math.max(1, prev - 1))
            }
            disabled={currentPage === 1 || totalPages === 1}
            className="flex h-12 w-20 items-center justify-center rounded-full bg-pr_w text-pr_dg transition disabled:opacity-50"
          >
            ←
          </button>
          <div className="flex items-center rounded-full bg-pr_w px-3 py-2 text-sm text-pr_dg">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`mx-1 flex h-10 w-16 items-center justify-center rounded-full transition ${
                    page === currentPage
                      ? "bg-pr_dg text-pr_w"
                      : "text-pr_dg/70 hover:text-pr_dg"
                  }`}
                >
                  {page}
                </button>
              ),
            )}
          </div>
          <button
            type="button"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages || totalPages === 1}
            className="flex h-12 w-20 items-center justify-center rounded-full bg-pr_w text-pr_dg transition disabled:opacity-50"
          >
            →
          </button>
        </div>
      </section>
    </div>
  );
}
