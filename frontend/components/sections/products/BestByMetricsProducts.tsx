import Button from "@/components/ui/Button";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import {
  fetchAllProducts,
  fetchBestProductsByMetrics,
  formatPrice,
  getProductPurchaseOptions,
  getPrimaryImageUrl,
  type ProductBestMetricBucket,
  type ProductListItem,
  type ProductPurchaseOption,
} from "@/services/products";
import {
  buildProductHoverInfo,
  type ProductHoverInfoRow,
} from "@/lib/productHoverInfo";

type ProductCardItem = {
  metricKey: string;
  badgeLabel: string;
  productId: string;
  slug?: string;
  title: string;
  description: string;
  price: string;
  imageUrl?: string;
  hoverInfo: ProductHoverInfoRow[];
  purchaseOptions: ProductPurchaseOption[];
};

type MetricRankMode = "max" | "min";

type MetricDefinition = {
  key: string;
  badgeLabel: string;
  rankMode: MetricRankMode;
  requestDirection: "asc" | "desc";
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
    key: "cycle",
    badgeLabel: "Fastest Harvest",
    rankMode: "min",
    requestDirection: "asc",
    getScore: (item) => {
      const values = [
        { value: item.content?.facts?.floweringCycle, mode: "min" as const },
        ...collectFilterValues(item, [
          "seed to harvest",
          "harvest",
          "flowering",
          "cycle",
        ]).map((value) => ({
          value,
          mode: "min" as const,
        })),
      ];
      return getMetricScore(values, "min");
    },
  },
  {
    key: "thc",
    badgeLabel: "Highest THC",
    rankMode: "max",
    requestDirection: "desc",
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
    badgeLabel: "Highest Yield",
    rankMode: "max",
    requestDirection: "desc",
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

function toProductCardItem(
  item: ProductListItem,
  metric: Pick<MetricDefinition, "key" | "badgeLabel">,
): ProductCardItem {
  return {
    metricKey: metric.key,
    badgeLabel: metric.badgeLabel,
    productId: item.slug || item.id,
    slug: item.slug,
    title: item.name,
    description: item.content?.description ?? "Premium product",
    price: formatPrice(item.priceCents, item.currency),
    imageUrl: getPrimaryImageUrl(item.images),
    hoverInfo: buildProductHoverInfo(item),
    purchaseOptions: getProductPurchaseOptions(item),
  };
}

function pickProductFromBestMetricBucket(
  bucket: ProductBestMetricBucket | undefined,
  rankMode: MetricRankMode,
): ProductListItem | undefined {
  if (!bucket || bucket.items.length === 0) return undefined;

  const numericItems = bucket.items.filter(
    (
      entry,
    ): entry is typeof entry & {
      metricValue: number;
    } =>
      typeof entry.metricValue === "number" &&
      Number.isFinite(entry.metricValue),
  );

  if (numericItems.length === 0) {
    return bucket.items[0]?.product;
  }

  const sorted = numericItems.sort((a, b) =>
    rankMode === "min"
      ? a.metricValue - b.metricValue
      : b.metricValue - a.metricValue,
  );

  return sorted[0]?.product ?? bucket.items[0]?.product;
}

function buildFallbackProductCards(
  items: ProductListItem[],
): ProductCardItem[] {
  const candidates = items.filter(
    (item): item is ProductListItem & { slug: string } => Boolean(item.slug),
  );

  return METRICS.reduce<ProductCardItem[]>((acc, metric) => {
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

    const pick = ranked[0];
    if (!pick) return acc;

    acc.push(toProductCardItem(pick.item, metric));
    return acc;
  }, []);
}

export default async function BestByMetricsProducts() {
  let products: ProductCardItem[] = [];

  try {
    const by = METRICS.map(
      (metric) => `${metric.key}:${metric.requestDirection}`,
    ).join(",");

    const bestByMetric = await fetchBestProductsByMetrics(
      {
        by,
        top: 1,
      },
      {
        next: { revalidate: 60 },
      },
    );

    products = METRICS.reduce<ProductCardItem[]>((acc, metric) => {
      const pickedProduct = pickProductFromBestMetricBucket(
        bestByMetric[metric.key],
        metric.rankMode,
      );
      if (!pickedProduct) return acc;

      acc.push(toProductCardItem(pickedProduct, metric));
      return acc;
    }, []);
  } catch {
    products = [];
  }

  if (products.length === 0) {
    try {
      const items = await fetchAllProducts(undefined, {
        next: { revalidate: 60 },
      });

      products = buildFallbackProductCards(items);
    } catch {
      products = [];
    }
  }

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-pr_w">
            Top Picks by Performance
          </h2>
          <p className="mt-2 text-sm text-pr_w/70 sm:text-base">
            Handpicked for peak THC, maximum yield, or fastest finish — our top
            performers at a glance.
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
              key={`${product.metricKey}-${product.productId}`}
              title={product.title}
              description={product.description}
              price={product.price}
              isNew
              imageUrl={product.imageUrl}
              hoverInfo={product.hoverInfo}
              productId={product.productId}
              purchaseOptions={product.purchaseOptions}
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
