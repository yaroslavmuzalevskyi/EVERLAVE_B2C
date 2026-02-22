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
import { seedItems } from "@/lib/seeds";

const FALLBACK_FLAVOR = "Sweet · Fruity · Light Earthy";

function splitIntoParagraphs(text?: string) {
  if (!text) return [];
  return text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function formatInlineText(text: string) {
  const pieces = text.split(/(\*\*[^*]+\*\*)/g);
  return pieces.map((piece, index) => {
    const isBold = piece.startsWith("**") && piece.endsWith("**") && piece.length > 4;
    if (!isBold) return <span key={`${piece}-${index}`}>{piece}</span>;
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
  if (fromFilters?.trim()) return fromFilters.trim();

  const fromSections = product.content?.sections?.find((section) =>
    (section.title ?? "").toLowerCase().includes("genetic"),
  )?.text;
  if (fromSections?.trim()) return fromSections.trim();

  const fromDescription = description.match(/genetics?\s*:\s*([^\n.]+)/i)?.[1];
  if (fromDescription?.trim()) return fromDescription.trim();

  return undefined;
}

const FIXED_VARIANT_QTYS = [1, 5, 10, 15, 20];
const PRODUCT_DETAIL_REVALIDATE_SECONDS = 60;

type SeedDetailProps = {
  params: { slug: string } | Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const products = await fetchAllProducts(undefined, {
      next: { revalidate: PRODUCT_DETAIL_REVALIDATE_SECONDS },
    });

    const slugs = products
      .map((product) => product.slug)
      .filter((slug): slug is string => Boolean(slug));

    if (slugs.length > 0) {
      return slugs.map((slug) => ({ slug }));
    }
  } catch {}

  return seedItems.map((item) => ({ slug: item.slug }));
}

export default async function SeedDetailPage({ params }: SeedDetailProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  let product: ProductDetails | null = null;
  try {
    product = await fetchProductById(slug, {
      next: { revalidate: PRODUCT_DETAIL_REVALIDATE_SECONDS },
    });
  } catch {}

  // Fallback to product list lookup when detail endpoint is flaky/unavailable.
  if (!product) {
    try {
      const items = await fetchAllProducts(undefined, {
        next: { revalidate: PRODUCT_DETAIL_REVALIDATE_SECONDS },
      });
      const fallback = items.find((item) => item.slug === slug);
      if (fallback) {
        product = {
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

  // Some pages can render from list-fallback data (shorter payload) when the
  // detail endpoint flakes. Re-fetch uncached when the per-product genetic
  // balance description is missing so we can replace the placeholder text.
  if (!product.content?.geneticBalanceDescription?.trim()) {
    try {
      const geneticBalanceDescription = await fetchProductGeneticBalanceDescription(
        slug,
        { cache: "no-store" },
      );
      if (geneticBalanceDescription) {
        product = {
          ...product,
          content: {
            ...(product.content ?? {}),
            geneticBalanceDescription,
          },
        };
      }
    } catch {}
  }

  const productSlug = product.slug || slug;
  const title = product.name;
  const subtitle = product.content?.subtitle?.trim() || "Premium product subtitle.";
  const description =
    product.content?.description?.trim() || "Premium product description.";
  const categoryLabel = product.category?.name ?? "Cannabis Seeds";
  const rating = product.ratingAvg ?? 0;
  const sold = product.soldCount ?? 0;

  const sortedImages = product?.images
    ? [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)
    : [];
  const priceCents = product.priceCents ?? 0;
  const currency = product.currency ?? "EUR";

  const variants =
    product.content?.variants?.filter(
      (
        variant,
      ): variant is { label: string; priceCents?: number } =>
        typeof variant.label === "string" && variant.label.trim().length > 0,
    ) ?? [];
  const baseVariant = variants
    .map((variant) => {
      const qtyMatch = variant.label.trim().match(/(\d+)/);
      const qty = qtyMatch ? Number(qtyMatch[1]) : 1;
      const priceCents = variant.priceCents ?? 0;
      if (!Number.isFinite(qty) || qty < 1 || priceCents <= 0) return null;
      return { qty, priceCents };
    })
    .filter((entry): entry is { qty: number; priceCents: number } => Boolean(entry))
    .sort((a, b) => a.qty - b.qty)[0];

  const baseUnitPriceCents =
    baseVariant && baseVariant.qty > 0
      ? Math.round(baseVariant.priceCents / baseVariant.qty)
      : Math.max(0, Math.round(priceCents));

  const variantPrices = FIXED_VARIANT_QTYS.map((qty) => ({
    label: `${qty}x`,
    price: formatPrice(baseUnitPriceCents * qty, currency),
  }));

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
  if (facts?.seedType) {
    infoRows.push({ label: "Seed Type", value: facts.seedType });
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
    product.content?.geneticBalanceDescription?.trim() ||
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
                  productId={productSlug}
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
                          <span className="text-pr_dg/70">{row.value}</span>
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
                ).map((paragraph, index) => (
                  <p
                    key={`${section.heading}-${index}`}
                    className="mt-2 text-xs text-pr_dg/70"
                  >
                    {formatInlineText(paragraph)}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-pr_w p-6 text-pr_dg flex h-full flex-col">
            <h2 className="text-sm font-semibold">Genetic Balance</h2>
            <p className="mt-2 text-xs text-pr_dg/70 whitespace-pre-line">
              {geneticDescription}
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

        <ReviewsSection productId={productSlug} />
      </section>
    </div>
  );
}
