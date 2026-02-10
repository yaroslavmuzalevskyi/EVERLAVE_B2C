import Button from "@/components/ui/Button";
import Link from "next/link";
import NewProductCard from "@/components/ui/ProductCard";

const products = [
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

export default function PopularProducts() {
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
          <NewProductCard
            key={`${product.title}-${index}`}
            {...product}
            badgeLabel="Popular"
            badgeClassName="bg-pr_dg text-pr_w"
          />
        ))}
      </div>
    </section>
  );
}
