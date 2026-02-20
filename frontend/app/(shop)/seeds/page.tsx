"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FilterDropdown from "@/components/seeds/FilterDropdown";
import ProductCard from "@/components/ui/ProductCard";
import {
  fetchCategories,
  fetchCategoryFilters,
  type CategoryFilter,
  type CategoryItem,
} from "@/services/categories";
import {
  fetchAllProducts,
  formatPrice,
  getPrimaryImageUrl,
} from "@/services/products";

const filterOptions = {
  sorting: [
    { label: "Featured", value: "featured" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "THC: High to Low", value: "thc-desc" },
    { label: "THC: Low to High", value: "thc-asc" },
    { label: "Yield: High to Low", value: "yield-desc" },
    { label: "Yield: Low to High", value: "yield-asc" },
    { label: "Harvest: Fast to Slow", value: "harvest-asc" },
    { label: "Harvest: Slow to Fast", value: "harvest-desc" },
  ],
  price: [],
};

type SeedCardItem = {
  productId: string;
  slug: string;
  title: string;
  description: string;
  price: string;
  imageUrl?: string;
  category?: string;
  priceValue?: number;
  text?: string;
  createdAt?: string;
  soldCount?: number;
  filters?: Record<string, string>;
  facts?: {
    yield?: string;
    seedType?: string;
    thcLevel?: string;
    floweringCycle?: string;
    flavorAroma?: string;
    [key: string]: string | undefined;
  };
  geneticBalance?: Record<string, number | undefined>;
};

function getPriceValue(price: string) {
  const numeric = Number(price.replace("€", "").trim());
  return Number.isNaN(numeric) ? 0 : numeric;
}

function getTextValue(item: SeedCardItem) {
  if (item.text) return item.text;
  return `${item.title} ${item.description}`.toLowerCase();
}

function toTitleCase(value: string) {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function slugifyFilterKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractNumbers(value?: string | number) {
  if (typeof value === "number") return [value];
  if (!value) return [];
  const matches = value.match(/(\d+(\.\d+)?)/g);
  if (!matches) return [];
  return matches.map((match) => Number(match)).filter((num) => Number.isFinite(num));
}

function toRange(value?: string | number) {
  const numbers = extractNumbers(value);
  if (numbers.length === 0) return undefined;
  if (numbers.length === 1) return { min: numbers[0], max: numbers[0] };
  return { min: Math.min(...numbers), max: Math.max(...numbers) };
}

function getFilterRange(item: SeedCardItem, slug: string) {
  const facts = item.facts;
  const balance = item.geneticBalance ?? {};

  if (slug === "thc") return toRange(facts?.thcLevel);
  if (slug === "yield") return toRange(facts?.yield);
  if (slug === "cycle") return toRange(facts?.floweringCycle);
  if (slug === "height") return toRange(facts?.height ?? facts?.plantHeight);
  if (slug === "indica")
    return toRange(
      balance.indica ?? balance["ba"] ?? balance["indica"] ?? balance["Indica"],
    );
  if (slug === "sativa")
    return toRange(
      balance.sativa ?? balance["abo"] ?? balance["sativa"] ?? balance["Sativa"],
    );

  const fallback =
    facts?.[slug] ??
    (typeof balance[slug] === "number" ? balance[slug] : undefined);
  return toRange(fallback);
}

const selectorOptionsBySlug: Record<
  string,
  Array<{ label: string; min?: number; max?: number }>
> = {
  thc: [
    { label: "0–10%", min: 0, max: 10 },
    { label: "10–20%", min: 10, max: 20 },
    { label: "20–30%", min: 20, max: 30 },
    { label: "30%+", min: 30 },
  ],
  yield: [
    { label: "0–400 g/m²", min: 0, max: 400 },
    { label: "400–500 g/m²", min: 400, max: 500 },
    { label: "500–650 g/m²", min: 500, max: 650 },
    { label: "650+ g/m²", min: 650 },
  ],
  height: [
    { label: "0–60 cm", min: 0, max: 60 },
    { label: "60–120 cm", min: 60, max: 120 },
    { label: "120–180 cm", min: 120, max: 180 },
    { label: "180+ cm", min: 180 },
  ],
  cycle: [
    { label: "0–8 weeks", min: 0, max: 8 },
    { label: "8–10 weeks", min: 8, max: 10 },
    { label: "10–12 weeks", min: 10, max: 12 },
    { label: "12+ weeks", min: 12 },
  ],
  indica: [
    { label: "0–40%", min: 0, max: 40 },
    { label: "40–60%", min: 40, max: 60 },
    { label: "60–100%", min: 60, max: 100 },
  ],
  sativa: [
    { label: "0–40%", min: 0, max: 40 },
    { label: "40–60%", min: 40, max: 60 },
    { label: "60–100%", min: 60, max: 100 },
  ],
};

export default function SeedsPage() {
  const router = useRouter();
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [sorting, setSorting] = useState("featured");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [categorySelection, setCategorySelection] = useState("");
  const [categoryFilters, setCategoryFilters] = useState<CategoryFilter[]>([]);
  const [filtersLoading, setFiltersLoading] = useState(false);
  const [filtersError, setFiltersError] = useState("");
  const [filterValues, setFilterValues] = useState<
    Record<string, { min?: string; max?: string }>
  >({});
  const [filterSelections, setFilterSelections] = useState<Record<string, string>>(
    {},
  );
  const [multiSelections, setMultiSelections] = useState<Record<string, string[]>>(
    {},
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<SeedCardItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryParam, setCategoryParam] = useState("");
  const filterKey = useMemo(() => JSON.stringify(filterValues), [filterValues]);
  const pageTitle = categoryParam ? toTitleCase(categoryParam) : "All Products";
  const breadcrumbLabel = categoryParam ? pageTitle : "All Categories";
  const backendSort = sorting || "featured";

  useEffect(() => {
    const syncCategoryFromUrl = () => {
      const value =
        new URLSearchParams(window.location.search).get("category")?.toLowerCase() ??
        "";
      setCategoryParam(value);
    };

    syncCategoryFromUrl();
    window.addEventListener("popstate", syncCategoryFromUrl);
    return () => window.removeEventListener("popstate", syncCategoryFromUrl);
  }, []);

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
    const timer = window.setTimeout(() => {
      setSearchQuery(search.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let mounted = true;
    fetchCategories()
      .then((data) => {
        if (!mounted) return;
        setCategories(data);
      })
      .catch(() => {
        if (!mounted) return;
        setCategories([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setCategorySelection(categoryParam);
  }, [categoryParam]);


  useEffect(() => {
    let mounted = true;
    if (!categoryParam) {
      setCategoryFilters([]);
      setFilterValues({});
      setFilterSelections({});
      setMultiSelections({});
      setFiltersError("");
      setFiltersLoading(false);
      return;
    }

    setFiltersLoading(true);
    setFiltersError("");
    fetchCategoryFilters(categoryParam)
      .then((filters) => {
        if (!mounted) return;
        setCategoryFilters(filters);
        setFiltersError("");
      })
      .catch(() => {
        if (!mounted) return;
        setCategoryFilters([]);
        setFiltersError("No filters available for this category.");
      })
      .finally(() => {
        if (!mounted) return;
        setFiltersLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [categoryParam]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    sorting,
    minPrice,
    maxPrice,
    searchQuery,
    categoryParam,
    filterKey,
    filterSelections,
    multiSelections,
  ]);

  const filterOptionsBySlug = useMemo(() => {
    const optionsMap: Record<string, Set<string>> = {};
    categoryFilters.forEach((filter) => {
      optionsMap[filter.slug] = new Set<string>();
    });

    items.forEach((item) => {
      const filters = item.filters ?? {};
      Object.entries(filters).forEach(([key, rawValue]) => {
        const slug = slugifyFilterKey(key);
        if (!(slug in optionsMap)) return;
        const value = rawValue?.toString().trim();
        if (!value || value.toLowerCase() === "n/a") return;
        if (value.includes(",")) {
          value
            .split(",")
            .map((entry) => entry.trim())
            .filter(Boolean)
            .forEach((entry) => optionsMap[slug].add(entry));
        } else {
          optionsMap[slug].add(value);
        }
      });
    });

    return Object.fromEntries(
      Object.entries(optionsMap).map(([slug, set]) => [
        slug,
        Array.from(set),
      ]),
    );
  }, [items, categoryFilters]);

  const priceRange = useMemo(() => {
    return {
      min: minPrice ? Number(minPrice) : undefined,
      max: maxPrice ? Number(maxPrice) : undefined,
    };
  }, [minPrice, maxPrice]);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const filtersQuery: Record<string, string | number | undefined> = {};

        if (categoryFilters.length > 0) {
          categoryFilters.forEach((filter) => {
            const slug = filter.slug;
            if (filter.type === "range" || filter.type === "number") {
              const value = filterValues[slug];
              if (value?.min) filtersQuery[`${slug}Min`] = value.min;
              if (value?.max) filtersQuery[`${slug}Max`] = value.max;
              return;
            }

            if (filter.type === "multi") {
              const selectedValues = multiSelections[slug];
              if (selectedValues && selectedValues.length > 0) {
                filtersQuery[slug] = selectedValues.join(",");
              }
              return;
            }

            const selectedValue = filterSelections[slug];
            if (selectedValue) {
              if (filter.type === "boolean") {
                const normalized = selectedValue.toLowerCase();
                filtersQuery[slug] =
                  normalized === "yes" || normalized === "true" ? "true" : "false";
              } else {
                filtersQuery[slug] = selectedValue;
              }
            }
          });
        }

        const items = await fetchAllProducts({
          q: searchQuery || undefined,
          category: categoryParam || undefined,
          minPrice:
            priceRange.min !== undefined
              ? Math.round(priceRange.min * 100)
              : undefined,
          maxPrice:
            priceRange.max !== undefined
              ? Math.round(priceRange.max * 100)
              : undefined,
          sort: backendSort,
          filters: filtersQuery,
        });

        if (!isMounted) return;

        const mapped = items
          .filter((item): item is typeof item & { slug: string } =>
            Boolean(item.slug),
          )
          .map((item) => ({
            productId: item.slug,
            slug: item.slug,
            title: item.name,
            description: item.content?.description ?? "Premium product",
            price: formatPrice(item.priceCents, item.currency),
            imageUrl: getPrimaryImageUrl(item.images),
            category: item.category?.slug ?? item.category?.name,
            priceValue: item.priceCents / 100,
            text: `${item.name} ${item.content?.description ?? ""}`.toLowerCase(),
            createdAt: item.createdAt,
            soldCount: item.soldCount ?? 0,
            facts: item.content?.facts,
            geneticBalance: item.content?.geneticBalance,
            filters: item.filters,
          }));

        setItems(mapped);
        setTotal(mapped.length);
      } catch {
        if (!isMounted) return;
        setItems([]);
        setTotal(0);
        setError("Failed to load products.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [
    priceRange,
    backendSort,
    categoryParam,
    searchQuery,
    categoryFilters,
    filterValues,
    filterSelections,
    multiSelections,
  ]);

  const filteredItems = items;

  const showSkeletons = loading && items.length === 0;

  const orderedItems = useMemo(() => {
    if (filteredItems.length === 0) return [];
    const getSortMetric = (item: SeedCardItem, metric: "thc" | "yield" | "cycle") =>
      getFilterRange(item, metric)?.max;

    const compareNumbers = (
      aValue: number | undefined,
      bValue: number | undefined,
      direction: "asc" | "desc",
    ) => {
      const a = typeof aValue === "number" && Number.isFinite(aValue) ? aValue : null;
      const b = typeof bValue === "number" && Number.isFinite(bValue) ? bValue : null;

      if (a === null && b === null) return 0;
      if (a === null) return 1;
      if (b === null) return -1;
      return direction === "asc" ? a - b : b - a;
    };

    const sorted = [...filteredItems];

    if (sorting === "price-asc") {
      return sorted.sort((a, b) =>
        compareNumbers(a.priceValue, b.priceValue, "asc"),
      );
    }

    if (sorting === "price-desc") {
      return sorted.sort((a, b) =>
        compareNumbers(a.priceValue, b.priceValue, "desc"),
      );
    }

    if (sorting === "thc-asc") {
      return sorted.sort((a, b) =>
        compareNumbers(getSortMetric(a, "thc"), getSortMetric(b, "thc"), "asc"),
      );
    }

    if (sorting === "thc-desc") {
      return sorted.sort((a, b) =>
        compareNumbers(getSortMetric(a, "thc"), getSortMetric(b, "thc"), "desc"),
      );
    }

    if (sorting === "yield-asc") {
      return sorted.sort((a, b) =>
        compareNumbers(getSortMetric(a, "yield"), getSortMetric(b, "yield"), "asc"),
      );
    }

    if (sorting === "yield-desc") {
      return sorted.sort((a, b) =>
        compareNumbers(getSortMetric(a, "yield"), getSortMetric(b, "yield"), "desc"),
      );
    }

    if (sorting === "harvest-asc") {
      return sorted.sort((a, b) =>
        compareNumbers(getSortMetric(a, "cycle"), getSortMetric(b, "cycle"), "asc"),
      );
    }

    if (sorting === "harvest-desc") {
      return sorted.sort((a, b) =>
        compareNumbers(getSortMetric(a, "cycle"), getSortMetric(b, "cycle"), "desc"),
      );
    }

    return sorted.sort((a, b) => {
      const aDate = a.createdAt ? Date.parse(a.createdAt) : 0;
      const bDate = b.createdAt ? Date.parse(b.createdAt) : 0;
      if (bDate !== aDate) return bDate - aDate;
      return (b.soldCount ?? 0) - (a.soldCount ?? 0);
    });
  }, [filteredItems, sorting]);

  const totalPages = 1;

  return (
    <div className="bg-pr_dg text-pr_w">
      <section className="w-full px-4 pt-[120px] pb-24 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
        <p className="text-xs text-pr_w/60">
          <Link href="/" className="hover:text-pr_w">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/products" className="hover:text-pr_w">
            {breadcrumbLabel}
          </Link>
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{pageTitle}</h1>

        <div
          className="relative z-20 mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:z-30"
          data-filter-root
          data-no-reveal="true"
        >
          <FilterDropdown
            id="category"
            label="Category"
            options={[
              { label: "All Categories", value: "" },
              ...categories.map((category) => ({
                label: category.name,
                value: category.slug,
              })),
            ]}
            selected={categorySelection}
            open={openFilter === "category"}
            onToggle={(id) => setOpenFilter(openFilter === id ? null : id)}
            onSelect={(id, value) => {
              setCategorySelection(value);
              const params = new URLSearchParams(window.location.search);
              if (value) {
                params.set("category", value);
              } else {
                params.delete("category");
              }
              setCategoryParam(value.toLowerCase());
              router.push(`/products${params.toString() ? `?${params}` : ""}`);
              setOpenFilter(null);
            }}
            placeholder="Category"
          />
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
            selected=""
            open={openFilter === "price"}
            onToggle={(id) => setOpenFilter(openFilter === id ? null : id)}
            onSelect={() => null}
            placeholder="Price"
            variant="price"
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={(value) => {
              setMinPrice(value);
            }}
            onMaxPriceChange={(value) => {
              setMaxPrice(value);
            }}
          />
          {!categoryParam ? (
            <span className="flex items-center text-xs text-pr_w/60 sm:px-1">
              Select a category to see more filters
            </span>
          ) : filtersLoading ? (
            <span className="flex items-center text-xs text-pr_w/60 sm:px-1">
              Loading filters...
            </span>
          ) : categoryFilters.length === 0 ? (
            <span className="flex items-center text-xs text-pr_w/60 sm:px-1">
              {filtersError || "No filters for this category."}
            </span>
          ) : null}
          {categoryFilters.map((filter) => (
            (() => {
              const selectorOptions = selectorOptionsBySlug[filter.slug];
              const derivedOptions = filterOptionsBySlug[filter.slug] ?? [];

              const apiOptions =
                filter.options?.map((option) => option.value) ?? [];

              if (filter.type === "multi") {
                const options =
                  apiOptions.length > 0
                    ? apiOptions
                    : derivedOptions.length > 0
                      ? derivedOptions
                      : selectorOptions?.map((option) => option.label) ?? [];
                return (
                  <FilterDropdown
                    key={filter.slug}
                    id={filter.slug}
                    label={filter.name}
                    options={options.map((option) => ({
                      label: option,
                      value: option,
                    }))}
                    selected=""
                    selectedValues={multiSelections[filter.slug] ?? []}
                    open={openFilter === filter.slug}
                    onToggle={(id) => setOpenFilter(openFilter === id ? null : id)}
                    onSelect={() => null}
                    onToggleValue={(id, value) => {
                      setMultiSelections((prev) => {
                        const current = prev[filter.slug] ?? [];
                        const exists = current.includes(value);
                        const next = exists
                          ? current.filter((entry) => entry !== value)
                          : [...current, value];
                        return { ...prev, [filter.slug]: next };
                      });
                      setOpenFilter(null);
                    }}
                    placeholder={filter.name}
                    multi
                  />
                );
              }

              if (filter.type === "boolean") {
                const options =
                  apiOptions.length > 0
                    ? apiOptions
                    : derivedOptions.length > 0
                      ? derivedOptions
                      : ["Yes", "No"];
                return (
                  <FilterDropdown
                    key={filter.slug}
                    id={filter.slug}
                    label={filter.name}
                    options={options.map((option) => ({
                      label: option,
                      value: option,
                    }))}
                    selected={filterSelections[filter.slug] ?? ""}
                    open={openFilter === filter.slug}
                    onToggle={(id) => setOpenFilter(openFilter === id ? null : id)}
                    onSelect={(id, value) => {
                      setFilterSelections((prev) => ({ ...prev, [filter.slug]: value }));
                      setOpenFilter(null);
                    }}
                    placeholder={filter.name}
                  />
                );
              }

              if (filter.type === "select") {
                const options =
                  apiOptions.length > 0
                    ? apiOptions
                    : derivedOptions.length > 0
                      ? derivedOptions
                      : selectorOptions?.map((option) => option.label) ?? [];
                return (
                  <FilterDropdown
                    key={filter.slug}
                    id={filter.slug}
                    label={filter.name}
                    options={options.map((option) => ({
                      label: option,
                      value: option,
                    }))}
                    selected={filterSelections[filter.slug] ?? ""}
                    open={openFilter === filter.slug}
                    onToggle={(id) => setOpenFilter(openFilter === id ? null : id)}
                    onSelect={(id, value) => {
                      setFilterSelections((prev) => ({
                        ...prev,
                        [filter.slug]: value,
                      }));
                      setOpenFilter(null);
                    }}
                    placeholder={filter.name}
                  />
                );
              }

              if (filter.type === "number") {
                return (
                  <FilterDropdown
                    key={filter.slug}
                    id={filter.slug}
                    label={filter.name}
                    options={[]}
                    selected=""
                    open={openFilter === filter.slug}
                    onToggle={(id) => setOpenFilter(openFilter === id ? null : id)}
                    onSelect={() => null}
                    placeholder={filter.name}
                    variant="number"
                    minPrice={filterValues[filter.slug]?.min ?? ""}
                    onMinPriceChange={(value) =>
                      setFilterValues((prev) => ({
                        ...prev,
                        [filter.slug]: {
                          ...prev[filter.slug],
                          min: value,
                        },
                      }))
                    }
                    inputSuffix={filter.name.includes("%") ? "%" : ""}
                  />
                );
              }

              if (selectorOptions && selectorOptions.length > 0) {
                return (
                  <FilterDropdown
                    key={filter.slug}
                    id={filter.slug}
                    label={filter.name}
                    options={selectorOptions.map((option) => ({
                      label: option.label,
                      value: option.label,
                    }))}
                    selected={filterSelections[filter.slug] ?? ""}
                    open={openFilter === filter.slug}
                    onToggle={(id) => setOpenFilter(openFilter === id ? null : id)}
                    onSelect={(id, value) => {
                      setFilterSelections((prev) => ({
                        ...prev,
                        [filter.slug]: value,
                      }));
                      if (!value) {
                        setFilterValues((prev) => ({
                          ...prev,
                          [filter.slug]: {},
                        }));
                        setOpenFilter(null);
                        return;
                      }
                      const match = selectorOptions.find(
                        (option) => option.label === value,
                      );
                      setFilterValues((prev) => ({
                        ...prev,
                        [filter.slug]: {
                          min: match?.min?.toString(),
                          max: match?.max?.toString(),
                        },
                      }));
                      setOpenFilter(null);
                    }}
                    placeholder={filter.name}
                  />
                );
              }

              return (
                <FilterDropdown
                  key={filter.slug}
                  id={filter.slug}
                  label={filter.name}
                  options={[]}
                  selected=""
                  open={openFilter === filter.slug}
                  onToggle={(id) => setOpenFilter(openFilter === id ? null : id)}
                  onSelect={() => null}
                  placeholder={filter.name}
                  variant="range"
                  minPrice={filterValues[filter.slug]?.min ?? ""}
                  maxPrice={filterValues[filter.slug]?.max ?? ""}
                  onMinPriceChange={(value) =>
                    setFilterValues((prev) => ({
                      ...prev,
                      [filter.slug]: {
                        ...prev[filter.slug],
                        min: value,
                      },
                    }))
                  }
                  onMaxPriceChange={(value) =>
                    setFilterValues((prev) => ({
                      ...prev,
                      [filter.slug]: {
                        ...prev[filter.slug],
                        max: value,
                      },
                    }))
                  }
                  inputSuffix={filter.name.includes("%") ? "%" : ""}
                />
              );
            })()
          ))}
          <div className="relative flex w-full min-w-0 flex-1 items-center rounded-full bg-pr_w px-4 py-2 text-xs text-pr_dg sm:min-w-[220px] sm:max-w-[260px]">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              className="w-full bg-transparent text-xs font-semibold text-pr_dg outline-none placeholder:text-pr_dg/50"
            />
          </div>
        </div>

        {error ? (
          <p className="mt-4 text-xs text-pr_y/90">{error}</p>
        ) : null}

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {showSkeletons
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={`product-skeleton-${index}`}
                  className="h-[520px] rounded-2xl bg-white/5"
                />
              ))
            : orderedItems.map((seed) => (
                <ProductCard
                  key={seed.slug}
                  title={seed.title}
                  description={seed.description}
                  price={seed.price}
                  isNew={false}
                  productId={seed.productId}
                  href={`/products/${seed.slug}`}
                  imageUrl={seed.imageUrl}
                />
              ))}
        </div>

        {!loading && orderedItems.length === 0 ? (
          <p className="mt-6 text-sm text-pr_w/70">No products found.</p>
        ) : null}

        {totalPages > 1 ? (
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
        ) : null}
      </section>
    </div>
  );
}
