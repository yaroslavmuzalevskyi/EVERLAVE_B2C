"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EffectPill from "@/components/seeds/EffectPill";
import ReviewsSection from "@/components/seeds/ReviewsSection";
import ReviewSummaryInline from "@/components/seeds/ReviewSummaryInline";
import SeedVariantPurchase from "@/components/seeds/SeedVariantPurchase";
import {
  fetchAllProducts,
  fetchProductGeneticBalanceDescription,
  fetchProductById,
  formatPrice,
  type ProductDetails,
} from "@/services/products";
import ProductGallery from "@/components/seeds/ProductGallery";

const FALLBACK_FLAVOR = "Sweet · Fruity · Light Earthy";

function normalizeEscapedText(text?: string) {
  if (!text) return "";
  return text
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\s*\/n\s*/g, "\n")
    .replace(/\\t/g, " ")
    .replace(/\\_/g, "_")
    .replace(/\\\*/g, "*")
    .replace(/\r\n/g, "\n")
    .replace(/_/g, " ")
    .replace(/\s*Genetics\s*:\s*/gi, "\nGenetics: ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function stripMarkdownArtifacts(text: string) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(^|[\s(])_([^_]+)_/g, "$1$2")
    .replace(/\*\*/g, "")
    .replace(/_/g, "")
    .trim();
}

function splitIntoParagraphs(text?: string) {
  const normalized = normalizeEscapedText(text);
  if (!normalized) return [];
  return normalized
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function renderMarkdownBlock(paragraph: string, key: string) {
  const headingMatch = paragraph.match(/^(#{1,6})\s+(.*)$/);
  if (headingMatch) {
    const level = headingMatch[1].length;
    const content = headingMatch[2];
    const className =
      level === 1
        ? "mt-4 text-xl font-bold"
        : level === 2
          ? "mt-4 text-lg font-semibold"
          : level === 3
            ? "mt-3 text-base font-semibold"
            : "mt-3 text-sm font-semibold";
    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    return (
      <Tag key={key} className={className}>
        {formatInlineText(content)}
      </Tag>
    );
  }
  return (
    <p key={key} className="mt-2 whitespace-pre-line text-xs text-pr_dg/70">
      {formatInlineText(paragraph)}
    </p>
  );
}

function formatInlineText(text: string) {
  const normalized = normalizeEscapedText(text);
  const pieces = normalized.split(/(\*\*[^*]+\*\*)/g);
  return pieces.map((piece, index) => {
    const isBold = piece.startsWith("**") && piece.endsWith("**") && piece.length > 4;
    if (!isBold) {
      return (
        <span key={`${piece}-${index}`}>
          {stripMarkdownArtifacts(piece)}
        </span>
      );
    }
    return <strong key={`${piece}-${index}`}>{piece.slice(2, -2)}</strong>;
  });
}

function findFilterValue(
  filters: Record<string, string> | undefined,
  includes: string[],
) {
  if (!filters) return undefined;
  const match = Object.entries(filters).find(([key]) => {
    const normalized = key.toLowerCase();
    return includes.some((candidate) => normalized.includes(candidate));
  });
  return match?.[1];
}

function ensureUnit(value: string, unit: string) {
  const normalized = value.trim();
  if (!normalized) return normalized;
  if (normalized.toLowerCase().includes(unit.toLowerCase())) return normalized;
  return `${normalized}${unit}`;
}

function extractGeneticsText(product: ProductDetails, description: string) {
  const fromFilters = findFilterValue(product.filters, [
    "genetic",
    "genetics",
    "lineage",
    "parent",
    "parents",
    "cross",
  ]);
  if (fromFilters?.trim()) return stripMarkdownArtifacts(normalizeEscapedText(fromFilters));

  const fromSections = product.content?.sections?.find((section) =>
    (section.title ?? "").toLowerCase().includes("genetic"),
  )?.text;
  if (fromSections?.trim()) {
    return stripMarkdownArtifacts(normalizeEscapedText(fromSections));
  }

  const fromDescription = normalizeEscapedText(description).match(
    /genetics?\s*:\s*([^\\\n.]+)/i,
  )?.[1];
  if (fromDescription?.trim()) {
    return stripMarkdownArtifacts(normalizeEscapedText(fromDescription));
  }

  return undefined;
}

export default function SeedDetailContent({ slug }: { slug: string }) {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const load = async () => {
      let resolved: ProductDetails | null = null;
      try {
        resolved = await fetchProductById(slug);
      } catch {}

      if (!resolved) {
        try {
          const items = await fetchAllProducts();
          const fallback = items.find((item) => item.slug === slug);
          if (fallback) {
            resolved = {
              ...fallback,
              content: fallback.content
                ? {
                    ...fallback.content,
                    variants: fallback.content.variants?.map((variant) => ({
                      label: variant.label ?? "1x",
                      priceCents: variant.priceCents ?? fallback.priceCents,
                    })),
                  }
                : undefined,
            };
          }
        } catch {}
      }

      if (resolved && !resolved.content?.geneticBalanceDescription?.trim()) {
        try {
          const geneticBalanceDescription =
            await fetchProductGeneticBalanceDescription(slug);
          if (geneticBalanceDescription) {
            resolved = {
              ...resolved,
              content: {
                ...(resolved.content ?? {}),
                geneticBalanceDescription,
              },
            };
          }
        } catch {}
      }

      if (active) {
        setProduct(resolved);
        setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-pr_dg text-pr_w">
        <section className="w-full px-4 pt-[120px] pb-20 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
          <p className="text-sm text-pr_w/70">Loading product…</p>
        </section>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-pr_dg text-pr_w">
        <section className="w-full px-4 pt-[120px] pb-20 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
          <p className="text-sm text-pr_w/70">
            Product not found.{" "}
            <Link href="/products" className="text-pr_y">
              Back to Products
            </Link>
          </p>
        </section>
      </div>
    );
  }

  const productSlug = product.slug || slug;
  const productIdForReviews = product.id || productSlug;
  const title = product.name;
  const subtitle =
    normalizeEscapedText(product.content?.subtitle) || "Premium product subtitle.";
  const description =
    normalizeEscapedText(product.content?.description) || "Premium product description.";
  const categoryLabel = product.category?.name ?? "Cannabis Seeds";
  const rating = product.ratingAvg ?? 0;
  const sold = product.soldCount ?? 0;

  const sortedImages = product?.images
    ? [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)
    : [];
  const currency = product.currency ?? "EUR";
  const baseOption = {
    label: "1 seed",
    price: formatPrice(product.priceCents ?? 0, currency),
    qty: 1,
  };
  const packOptions =
    product.packs && product.packs.length > 0
      ? product.packs
          .slice()
          .sort((a, b) => a.totalUnits - b.totalUnits)
          .map((pack) => ({
            label:
              pack.bonusQty > 0
                ? `${pack.paidQty} seeds (+${pack.bonusQty} bonus)`
                : `${pack.paidQty} seeds`,
            price: formatPrice(pack.priceCents, pack.currency || currency),
            qty: 1,
            packId: pack.id,
          }))
      : [];
  const variantPrices = [baseOption, ...packOptions];

  const effects =
    product.content?.effects ??
    product.content?.keyFacts ?? ["Premium Quality"];

  const mappedSections =
    product.content?.sections?.map((section) => ({
      heading: section.title,
      body: splitIntoParagraphs(section.text),
    })) ?? [];
  const sections =
    mappedSections.length > 0
      ? mappedSections
      : [
          {
            heading: "Description",
            body: splitIntoParagraphs(description),
          },
        ];

  const infoRows: Array<{ label: string; value: string }> = [];

  const facts = product.content?.facts;
  const filterHeight =
    facts?.height ?? findFilterValue(product.filters, ["height"]);
  if (facts?.flavorAroma) {
    infoRows.push({ label: "Flavor & Aroma", value: facts.flavorAroma });
  }
  if (facts?.thcLevel) {
    infoRows.push({
      label: "THC Level",
      value: ensureUnit(facts.thcLevel, "%"),
    });
  }
  if (facts?.floweringCycle) {
    infoRows.push({
      label: "Seed to Harvest",
      value: ensureUnit(facts.floweringCycle, " weeks"),
    });
  }
  if (filterHeight) {
    infoRows.push({ label: "Height", value: ensureUnit(filterHeight, " cm") });
  }
  if (facts?.yield) {
    infoRows.push({ label: "Yield", value: ensureUnit(facts.yield, " g/m²") });
  }

  const geneticsText = extractGeneticsText(product, description);
  if (geneticsText) {
    infoRows.push({ label: "Genetics", value: geneticsText });
  }
  infoRows.push({ label: "Seed Type", value: "Feminized Autoflower" });

  if (!facts && product.content?.keyFacts?.length) {
    infoRows.push({
      label: "Key Facts",
      value: product.content.keyFacts.join(" · "),
    });
  }

  if (!infoRows.find((row) => row.label === "Flavor & Aroma")) {
    infoRows.unshift({ label: "Flavor & Aroma", value: FALLBACK_FLAVOR });
  }

  const geneticBalance = product.content?.geneticBalance;
  const geneticDescription =
    normalizeEscapedText(product.content?.geneticBalanceDescription) ||
    "This profile shows the cultivar's genetic ratio and expected growth character.";
  const indicaValue =
    geneticBalance?.indica ??
    geneticBalance?.abo ??
    geneticBalance?.["indica"] ??
    60;
  const sativaValue =
    geneticBalance?.sativa ??
    geneticBalance?.ba ??
    geneticBalance?.["sativa"] ??
    40;

  return (
    <div className="bg-pr_dg text-pr_w">
      <section className="w-full px-4 pt-[120px] pb-24 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
        <p className="text-xs text-pr_w/60">
          <Link href="/" className="hover:text-pr_w">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/products" className="hover:text-pr_w">
            Cannabis
          </Link>{" "}
          / {title}
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <ProductGallery title={title} images={sortedImages} />
          </div>

          <div className="rounded-2xl bg-pr_w p-6 text-pr_dg flex h-full flex-col">
            <div className="flex items-center justify-between text-xs text-pr_dg/60">
              <span>{categoryLabel}</span>
              <span>
                {sold} Sold •{" "}
                <ReviewSummaryInline
                  productId={productIdForReviews}
                  fallbackRating={rating}
                />
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
            <p className="mt-2 text-xs text-pr_dg/70">{subtitle}</p>

            <div className="mt-4 flex flex-1 flex-col">
              <p className="text-xs font-semibold">Number of seeds:</p>
              <SeedVariantPurchase
                productSlug={productSlug}
                variants={variantPrices}
                details={
                  infoRows.length > 0 ? (
                    <div className="grid gap-2 text-xs">
                      {infoRows.map((row) => (
                        <div key={row.label} className="flex justify-between">
                          <span className="font-semibold">{row.label}</span>
                          <span className="text-pr_dg/70">
                            {stripMarkdownArtifacts(normalizeEscapedText(row.value))}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : undefined
                }
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {effects.map((effect) => (
                <EffectPill key={effect} label={effect} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.7fr]">
          <div className="rounded-2xl bg-pr_w p-6 text-pr_dg">
            <h2 className="text-sm font-semibold">Description</h2>
            {sections.map((section) => (
              <div key={section.heading} className="mt-4">
                {section.heading &&
                section.heading.trim().toLowerCase() !== "description" ? (
                  <h3 className="text-sm font-semibold">{section.heading}</h3>
                ) : null}
                {(section.body.length > 0
                  ? section.body
                  : splitIntoParagraphs(description)
                ).map((paragraph, index) =>
                  renderMarkdownBlock(paragraph, `${section.heading}-${index}`),
                )}
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-pr_w p-6 text-pr_dg flex h-full flex-col">
            <h2 className="text-sm font-semibold">Genetic Balance</h2>
            <p className="mt-2 text-xs text-pr_dg/70 whitespace-pre-line">
              {stripMarkdownArtifacts(geneticDescription)}
            </p>
            <div className="mt-auto pt-4 space-y-3 text-xs">
              <div>
                <div className="flex justify-between">
                  <span>Indica</span>
                  <span>{indicaValue}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-pr_dg/10">
                  <div
                    className="h-2 rounded-full bg-pr_lg"
                    style={{ width: `${indicaValue}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>Sativa</span>
                  <span>{sativaValue}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-pr_dg/10">
                  <div
                    className="h-2 rounded-full bg-pr_lg"
                    style={{ width: `${sativaValue}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <ReviewsSection productId={productIdForReviews} />
      </section>
    </div>
  );
}
