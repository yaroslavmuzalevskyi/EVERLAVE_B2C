import Hero from "@/components/sections/hero/Hero";
import Categories from "@/components/sections/categories/Categories";
import NewProducts from "@/components/sections/new-products/NewProducts";
import PopularProducts from "@/components/sections/new-products/PopularProducts";

export default function HomePage() {
  return (
    <div className="bg-pr_dg text-white">
      <Hero />
      <Categories />
      <NewProducts />
      <PopularProducts />
    </div>
  );
}
