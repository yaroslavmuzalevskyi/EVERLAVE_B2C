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
  productId?: string;
  slug?: string;
  title: string;
  description: string;
  price: string;
  imageUrl?: string;
};

function parseMaxNumber(value?: string) {
  if (!value) return undefined;
  const matches = value.match(/-?\d+(\.\d+)?/g);
  if (!matches || matches.length === 0) return undefined;
  const numbers = matches
    .map((entry) => Number(entry))
    .filter((entry) => Number.isFinite(entry));
  if (numbers.length === 0) return undefined;
  return Math.max(...numbers);
}

function getYieldScore(item: ProductListItem) {
  const values: string[] = [];

  const contentYield = item.content?.facts?.yield;
  if (contentYield) values.push(contentYield);

  Object.entries(item.filters ?? {}).forEach(([key, value]) => {
    const normalized = key.toLowerCase();
    if (normalized.includes("yield")) {
      values.push(value);
    }
  });

  const scores = values
    .map((value) => parseMaxNumber(value))
    .filter((score): score is number => score !== undefined);

  if (scores.length === 0) return undefined;
  return Math.max(...scores);
}

export default async function BestYieldProducts() {
  let products: ProductCardItem[] = [];

  try {
    const items = await fetchAllProducts(undefined, {
      next: { revalidate: 60 },
    });

    const itemsWithSlug = items.filter(
      (item): item is typeof item & { slug: string } => Boolean(item.slug),
    );

    let ranked = itemsWithSlug
      .map((item) => ({
        item,
        score: getYieldScore(item),
      }))
      .filter((entry): entry is { item: ProductListItem & { slug: string }; score: number } =>
        entry.score !== undefined,
      )
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (b.item.soldCount ?? 0) - (a.item.soldCount ?? 0);
      })
      .slice(0, 4)
      .map(({ item }) => item);

    if (ranked.length === 0) {
      ranked = itemsWithSlug
        .slice()
        .sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0))
        .slice(0, 4);
    }

    products = ranked.map((item) => ({
      productId: item.slug,
      slug: item.slug,
      title: item.name,
      description: item.content?.description ?? "Premium product",
      price: formatPrice(item.priceCents, item.currency),
      imageUrl: getPrimaryImageUrl(item.images),
    }));
  } catch {
    products = [];
  }

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-pr_w">Best Yield</h2>
          <p className="mt-2 text-sm text-pr_w/70 sm:text-base">
            Browse product categories for cultivation and distribution
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
          products.map((product, index) => (
            <ProductCard
              key={`${product.title}-${index}`}
              title={product.title}
              description={product.description}
              price={product.price}
              isNew
              imageUrl={product.imageUrl}
              productId={product.productId}
              href={product.slug ? `/products/${product.slug}` : undefined}
              badgeLabel="Best Yield"
              badgeClassName="bg-pr_y text-pr_dg"
            />
          ))
        )}
      </div>
    </section>
  );
}
