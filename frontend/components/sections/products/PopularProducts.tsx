import Button from "@/components/ui/Button";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import {
  fetchAllProducts,
  formatPrice,
  getPrimaryImageUrl,
} from "@/services/products";

type ProductCardItem = {
  productId?: string;
  slug?: string;
  title: string;
  description: string;
  price: string;
  imageUrl?: string;
};

export default async function PopularProducts() {
  let products: ProductCardItem[] = [];

  try {
    const items = await fetchAllProducts(undefined, {
      next: { revalidate: 60 },
    });

    products = items
      .filter((item): item is typeof item & { slug: string } =>
        Boolean(item.slug),
      )
      .slice()
      .sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0))
      .slice(0, 4)
      .map((item) => ({
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
          <h2 className="text-3xl font-semibold text-pr_w">Popular Products</h2>
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
              imageUrl={product.imageUrl}
              productId={product.productId}
              href={product.slug ? `/products/${product.slug}` : undefined}
              badgeLabel="Popular"
              badgeClassName="bg-pr_dg text-pr_w"
            />
          ))
        )}
      </div>
    </section>
  );
}
