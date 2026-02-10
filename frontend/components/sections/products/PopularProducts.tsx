import Button from "@/components/ui/Button";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { fetchProducts, formatPrice } from "@/services/products";

type ProductCardItem = {
  title: string;
  description: string;
  price: string;
  imageUrl?: string;
};

const fallbackProducts: ProductCardItem[] = [
  {
    title: "CBD Isolate 99%",
    description: "Highly purified CBD isolate for professional use.",
    price: "€56.32",
  },
  {
    title: "CBD Isolate 99%",
    description: "Highly purified CBD isolate for professional use.",
    price: "€56.32",
  },
  {
    title: "CBD Isolate 99%",
    description: "Highly purified CBD isolate for professional use.",
    price: "€56.32",
  },
  {
    title: "CBD Isolate 99%",
    description: "Highly purified CBD isolate for professional use.",
    price: "€56.32",
  },
];

export default async function PopularProducts() {
  let products: ProductCardItem[] = fallbackProducts;

  try {
    const response = await fetchProducts(
      {
        page: 1,
        limit: 4,
        sort: "sold:desc",
      },
      {
        next: { revalidate: 60 },
      },
    );

    if (response.items.length > 0) {
      products = response.items.map((item) => ({
        title: item.name,
        description: item.content?.description ?? "Premium product",
        price: formatPrice(item.priceCents, item.currency),
        imageUrl:
          item.images?.slice().sort((a, b) => a.sortOrder - b.sortOrder)[0]
            ?.url ?? "",
      }));
    }
  } catch {
    // keep fallback data
  }

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-pr_w">Popular Products</h2>
          <p className="mt-2 text-sm text-pr_w/70 sm:text-base">
            Browse product categories for cultivation and distribution
          </p>
        </div>
        <Link href="/seeds">
          <Button variant="category">Explore Now!</Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard
            key={`${product.title}-${index}`}
            title={product.title}
            description={product.description}
            price={product.price}
            imageUrl={product.imageUrl}
            badgeLabel="Popular"
            badgeClassName="bg-pr_dg text-pr_w"
          />
        ))}
      </div>
    </section>
  );
}
