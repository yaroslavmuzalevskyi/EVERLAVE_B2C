import Link from "next/link";
import EffectPill from "@/components/seeds/EffectPill";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { seedItems } from "@/lib/seeds";
import ReviewsSection from "@/components/seeds/ReviewsSection";
import { fetchProductById, formatPrice } from "@/services/products";

const FALLBACK_FLAVOR = "Sweet · Fruity · Light Earthy";

function getPriceCentsFromSeed(price?: string) {
  if (!price) return 0;
  const numeric = Number(price.replace("€", "").trim());
  return Number.isNaN(numeric) ? 0 : Math.round(numeric * 100);
}

type SeedDetailProps = {
  params: { slug: string } | Promise<{ slug: string }>;
};

export default async function SeedDetailPage({ params }: SeedDetailProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const seed = seedItems.find(
    (item) => item.slug === slug || item.productId === slug,
  );

  let product = null;
  try {
    product = await fetchProductById(slug, { cache: "no-store" });
  } catch {
    product = null;
  }

  if (!seed && !product) {
    return (
      <div className="bg-pr_dg text-pr_w">
        <section className="w-full px-4 pt-[120px] pb-20 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
          <p className="text-sm text-pr_w/70">
            Seed not found.{" "}
            <Link href="/seeds" className="text-pr_y">
              Back to Seeds
            </Link>
          </p>
        </section>
      </div>
    );
  }

  const productId = product?.id ?? seed?.productId ?? slug;
  const title = product?.name ?? seed?.title ?? "Premium Seed";
  const description =
    product?.content?.description ??
    seed?.description ??
    "Premium product description.";
  const categoryLabel = product?.category?.name ?? "Cannabis Seeds";
  const rating = product?.ratingAvg ?? seed?.rating ?? 0;
  const sold = product?.soldCount ?? seed?.sold ?? 0;

  const sortedImages = product?.images
    ? [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)
    : [];
  const mainImage = sortedImages[0]?.url;
  const thumbImages = sortedImages.slice(1, 4);

  const priceCents =
    product?.priceCents ?? getPriceCentsFromSeed(seed?.price);
  const currency = product?.currency ?? "EUR";

  const priceDisplay = priceCents
    ? formatPrice(priceCents, currency)
    : seed?.price ?? "€0";

  const price3x = priceCents
    ? formatPrice(priceCents * 3, currency)
    : "€82.50";
  const price5x = priceCents
    ? formatPrice(priceCents * 5, currency)
    : "€137.50";

  const effects =
    seed?.effects ?? product?.content?.keyFacts ?? ["Premium Quality"];

  const sections = seed?.sections ??
    product?.content?.sections?.map((section) => ({
      heading: section.title,
      body: [section.text],
    })) ?? [
      {
        heading: "Description",
        body: [description],
      },
    ];

  const infoRows: Array<{ label: string; value: string }> = [];

  if (seed?.thc) {
    infoRows.push({ label: "THC Level", value: seed.thc });
  }
  if (seed?.seedType) {
    infoRows.push({ label: "Seed Type", value: seed.seedType });
  }
  if (seed?.flowering && seed.flowering !== "N/A") {
    infoRows.push({ label: "Flowering Cycle", value: seed.flowering });
  }
  if (seed?.yield && seed.yield !== "N/A") {
    infoRows.push({ label: "Yield", value: seed.yield });
  }
  if (!seed && product?.content?.keyFacts?.length) {
    infoRows.push({
      label: "Key Facts",
      value: product.content.keyFacts.join(" · "),
    });
  }

  return (
    <div className="bg-pr_dg text-pr_w">
      <section className="w-full px-4 pt-[120px] pb-24 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
        <p className="text-xs text-pr_w/60">
          Home / Cannabis Seeds / {title}
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            {mainImage ? (
              <img
                src={mainImage}
                alt={title}
                className="h-[320px] w-full rounded-2xl object-cover sm:h-[420px]"
              />
            ) : (
              <div className="h-[320px] w-full rounded-2xl bg-pr_w sm:h-[420px]" />
            )}
            <div className="mt-4 flex gap-4">
              {thumbImages.length > 0
                ? thumbImages.map((image) => (
                    <img
                      key={image.id}
                      src={image.url}
                      alt=""
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  ))
                : [0, 1, 2].map((index) => (
                    <div key={index} className="h-16 w-16 rounded-xl bg-pr_w" />
                  ))}
            </div>
          </div>

          <div className="rounded-2xl bg-pr_w p-6 text-pr_dg">
            <div className="flex items-center justify-between text-xs text-pr_dg/60">
              <span>{categoryLabel}</span>
              <span>
                {sold} Sold • {rating.toFixed(1)}★
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
            <p className="mt-2 text-xs text-pr_dg/70">{description}</p>

            <div className="mt-4">
              <p className="text-xs font-semibold">Number of seeds:</p>
              <div className="mt-2 flex gap-2">
                <button className="rounded-full border border-pr_dg/30 px-4 py-2 text-xs">
                  1x {priceDisplay}
                </button>
                <button className="rounded-full border border-pr_dg/30 px-4 py-2 text-xs">
                  3x {price3x}
                </button>
                <button className="rounded-full border border-pr_dg/30 px-4 py-2 text-xs">
                  5x {price5x}
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-2 text-xs">
              <div className="flex justify-between">
                <span className="font-semibold">Flavor & Aroma:</span>
                <span className="text-pr_dg/70">{FALLBACK_FLAVOR}</span>
              </div>
              {infoRows.map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span className="font-semibold">{row.label}</span>
                  <span className="text-pr_dg/70">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {effects.map((effect) => (
                <EffectPill key={effect} label={effect} />
              ))}
            </div>

            <AddToCartButton
              productId={productId}
              variant="primary"
              className="mt-5 w-full"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.7fr]">
          <div className="rounded-2xl bg-pr_w p-6 text-pr_dg">
            <h2 className="text-sm font-semibold">Description</h2>
            {sections.map((section) => (
              <div key={section.heading} className="mt-4">
                <h3 className="text-sm font-semibold">{section.heading}</h3>
                {section.body.map((paragraph, index) => (
                  <p
                    key={`${section.heading}-${index}`}
                    className="mt-2 text-xs text-pr_dg/70"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-pr_w p-6 text-pr_dg">
            <h2 className="text-sm font-semibold">Genetic Balance</h2>
            <div className="mt-4 space-y-3 text-xs">
              <div>
                <div className="flex justify-between">
                  <span>Indica</span>
                  <span>60%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-pr_dg/10">
                  <div className="h-2 w-[60%] rounded-full bg-pr_lg" />
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>Sativa</span>
                  <span>40%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-pr_dg/10">
                  <div className="h-2 w-[40%] rounded-full bg-pr_lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <ReviewsSection productId={productId} />
      </section>
    </div>
  );
}
