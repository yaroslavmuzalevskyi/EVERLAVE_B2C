"use client";

import { useEffect, useMemo, useState } from "react";
import FilterDropdown from "@/components/seeds/FilterDropdown";
import FilterToggle from "@/components/seeds/FilterToggle";
import ProductCard from "@/components/ui/ProductCard";
import { seedItems } from "@/lib/seeds";

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

function getPriceValue(price: string) {
  const numeric = Number(price.replace("€", "").trim());
  return Number.isNaN(numeric) ? 0 : numeric;
}

function getYieldValue(yieldText: string) {
  const match = yieldText.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export default function SeedsPage() {
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
  const pageSize = 8;

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

  const filteredSeeds = useMemo(() => {
    let items = [...seedItems];

    if (outdoorOnly) {
      items = items.filter((item) => item.category.toLowerCase() === "outdoor");
    }

    if (priceFilter) {
      items = items.filter((item) => {
        const value = getPriceValue(item.price);
        if (priceFilter === "0-25") return value <= 25;
        if (priceFilter === "25-50") return value > 25 && value <= 50;
        if (priceFilter === "50+") return value > 50;
        return true;
      });
    }

    if (minPrice || maxPrice) {
      const min = minPrice ? Number(minPrice) : 0;
      const max = maxPrice ? Number(maxPrice) : Infinity;
      items = items.filter((item) => {
        const value = getPriceValue(item.price);
        return value >= min && value <= max;
      });
    }

    if (seedTypeFilter) {
      items = items.filter((item) => {
        const seedType = item.seedType.toLowerCase();
        if (seedTypeFilter === "feminized")
          return seedType.includes("feminized");
        if (seedTypeFilter === "autoflower")
          return seedType.includes("autoflower");
        if (seedTypeFilter === "na") return seedType === "n/a";
        return true;
      });
    }

    if (floweringFilter) {
      items = items.filter((item) => {
        const flowering = item.flowering.toLowerCase();
        if (flowering === "n/a") return false;
        if (floweringFilter === "up-8") return flowering.includes("8");
        if (floweringFilter === "8-10")
          return (
            flowering.includes("8") ||
            flowering.includes("9") ||
            flowering.includes("10")
          );
        if (floweringFilter === "10+") return flowering.includes("10");
        return true;
      });
    }

    if (thcFilter) {
      items = items.filter((item) => {
        const thc = item.thc.toLowerCase();
        if (thcFilter === "low")
          return thc.includes("low") || thc.includes("0%");
        if (thcFilter === "medium") return thc.includes("medium");
        if (thcFilter === "high") return thc.includes("high");
        return true;
      });
    }

    if (yieldFilter) {
      items = items.filter((item) => {
        const value = getYieldValue(item.yield);
        if (!value) return false;
        if (yieldFilter === "400-500") return value >= 400 && value < 500;
        if (yieldFilter === "500-650") return value >= 500 && value <= 650;
        if (yieldFilter === "650+") return value > 650;
        return true;
      });
    }

    if (sorting === "price-asc") {
      items.sort((a, b) => getPriceValue(a.price) - getPriceValue(b.price));
    } else if (sorting === "price-desc") {
      items.sort((a, b) => getPriceValue(b.price) - getPriceValue(a.price));
    }

    return items;
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
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredSeeds.length / pageSize));
  const pageSeeds = filteredSeeds.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  return (
    <div className="bg-pr_dg text-pr_w">
      <section className="w-full px-4 pt-[120px] pb-24 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
        <p className="text-xs text-pr_w/60">Home / Cannabis Seeds</p>
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

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pageSeeds.map((seed) => (
            <ProductCard
              key={seed.slug}
              title={seed.title}
              description={seed.description}
              price={seed.price}
              isNew={false}
              href={`/seeds/${seed.slug}`}
            />
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() =>
              setCurrentPage((prev) => Math.max(1, prev - 1))
            }
            disabled={currentPage === 1}
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
            disabled={currentPage === totalPages}
            className="flex h-12 w-20 items-center justify-center rounded-full bg-pr_w text-pr_dg transition disabled:opacity-50"
          >
            →
          </button>
        </div>
      </section>
    </div>
  );
}
