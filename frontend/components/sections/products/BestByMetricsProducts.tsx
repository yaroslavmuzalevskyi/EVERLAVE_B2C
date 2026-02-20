import Button from "@/components/ui/Button";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import {
  fetchAllProducts,
  formatPrice,
  getPrimaryImageUrl,
  type ProductListItem,
} from "@/services/products";

type ProductCardItem = {
  metricKey: string;
  badgeLabel: string;
  productId?: string;
  slug?: string;
  title: string;
  description: string;
  price: string;
  imageUrl?: string;
};

type MetricRankMode = "max" | "min";

type MetricDefinition = {
  key: string;
  badgeLabel: string;
  rankMode: MetricRankMode;
  getScore: (item: ProductListItem) => number | undefined;
};

function extractNumbers(value?: string) {
  if (!value) return [];
  const matches = value.match(/-?\d+(\.\d+)?/g);
  if (!matches || matches.length === 0) return [];
  return matches
    .map((entry) => Number(entry))
    .filter((entry) => Number.isFinite(entry));
}

function parseRange(value?: string) {
  const numbers = extractNumbers(value);
  if (numbers.length === 0) return undefined;
  if (numbers.length === 1) return { min: numbers[0], max: numbers[0] };
  return { min: Math.min(...numbers), max: Math.max(...numbers) };
}

function collectFilterValues(item: ProductListItem, includes: string[]) {
  const results: string[] = [];
  Object.entries(item.filters ?? {}).forEach(([key, value]) => {
    const normalized = key.toLowerCase();
    if (includes.some((candidate) => normalized.includes(candidate))) {
      results.push(value);
    }
  });
  return results;
}

function getMetricScore(
  values: Array<{ value?: string; mode: MetricRankMode }>,
  mode: MetricRankMode,
) {
  const scores = values
    .map(({ value, mode: valueMode }) => {
      const range = parseRange(value);
      if (!range) return undefined;
      return valueMode === "min" ? range.min : range.max;
    })
    .filter((entry): entry is number => entry !== undefined);

  if (scores.length === 0) return undefined;
  return mode === "min" ? Math.min(...scores) : Math.max(...scores);
}

const METRICS: MetricDefinition[] = [
  {
    key: "thc",
    badgeLabel: "Highest THC",
    rankMode: "max",
    getScore: (item) => {
      const values = [
        { value: item.content?.facts?.thcLevel, mode: "max" as const },
        ...collectFilterValues(item, ["thc"]).map((value) => ({
          value,
          mode: "max" as const,
        })),
      ];
      return getMetricScore(values, "max");
    },
  },
  {
    key: "yield",
    badgeLabel: "Best Yield",
    rankMode: "max",
    getScore: (item) => {
      const values = [
        { value: item.content?.facts?.yield, mode: "max" as const },
        ...collectFilterValues(item, ["yield"]).map((value) => ({
          value,
          mode: "max" as const,
        })),
      ];
      return getMetricScore(values, "max");
    },
  },
  {
    key: "harvest",
    badgeLabel: "Fastest Harvest",
    rankMode: "min",
    getScore: (item) => {
      const values = [
        { value: item.content?.facts?.floweringCycle, mode: "min" as const },
        ...collectFilterValues(item, ["seed to harvest", "harvest"]).map(
          (value) => ({
            value,
            mode: "min" as const,
          }),
        ),
      ];
      return getMetricScore(values, "min");
    },
  },
  {
    key: "flowering",
    badgeLabel: "Best Flowering Cycle",
    rankMode: "max",
    getScore: (item) => {
      const values = [
        { value: item.content?.facts?.floweringCycle, mode: "max" as const },
        ...collectFilterValues(item, ["flowering", "cycle"]).map((value) => ({
          value,
          mode: "max" as const,
        })),
      ];
      return getMetricScore(values, "max");
    },
  },
];

function compareByMetric(
  a: ProductListItem,
  b: ProductListItem,
  scoreA: number,
  scoreB: number,
  rankMode: MetricRankMode,
) {
  if (scoreA !== scoreB) {
    return rankMode === "min" ? scoreA - scoreB : scoreB - scoreA;
  }
  const soldDiff = (b.soldCount ?? 0) - (a.soldCount ?? 0);
  if (soldDiff !== 0) return soldDiff;
  const aDate = a.createdAt ? Date.parse(a.createdAt) : 0;
  const bDate = b.createdAt ? Date.parse(b.createdAt) : 0;
  return bDate - aDate;
}

export default async function BestByMetricsProducts() {
  let products: ProductCardItem[] = [];

  try {
    const items = await fetchAllProducts(undefined, {
      next: { revalidate: 60 },
    });

    const candidates = items.filter(
      (item): item is ProductListItem & { slug: string } => Boolean(item.slug),
    );
    const usedSlugs = new Set<string>();

    products = METRICS.map((metric) => {
      const ranked = candidates
        .map((item) => ({
          item,
          score: metric.getScore(item),
        }))
        .filter(
          (
            entry,
          ): entry is {
            item: ProductListItem & { slug: string };
            score: number;
          } => entry.score !== undefined,
        )
        .sort((a, b) =>
          compareByMetric(a.item, b.item, a.score, b.score, metric.rankMode),
        );

      const pick =
        ranked.find((entry) => !usedSlugs.has(entry.item.slug)) ?? ranked[0];
      if (!pick) return null;
      usedSlugs.add(pick.item.slug);

      return {
        metricKey: metric.key,
        badgeLabel: metric.badgeLabel,
        productId: pick.item.slug,
        slug: pick.item.slug,
        title: pick.item.name,
        description: pick.item.content?.description ?? "Premium product",
        price: formatPrice(pick.item.priceCents, pick.item.currency),
        imageUrl: getPrimaryImageUrl(pick.item.images),
      };
    }).filter((entry): entry is ProductCardItem => Boolean(entry));
  } catch {
    products = [];
  }

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-pr_w">
            Top Picks by Performance
          </h2>
          <p className="mt-2 text-sm text-pr_w/70 sm:text-base">
            One standout cultivar for each key performance metric
          </p>
        </div>
        <Link href="/products">
          <Button variant="category">Explore Now!</Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.length === 0 ? (
          <p className="text-sm text-pr_w/70">No products found.</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={`${product.metricKey}-${product.slug}`}
              title={product.title}
              description={product.description}
              price={product.price}
              isNew
              imageUrl={product.imageUrl}
              productId={product.productId}
              href={product.slug ? `/products/${product.slug}` : undefined}
              badgeLabel={product.badgeLabel}
              badgeClassName="bg-pr_y text-pr_dg"
            />
          ))
        )}
      </div>
    </section>
  );
}
