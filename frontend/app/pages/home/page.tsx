import Hero from "@/components/sections/hero/Hero";
import Categories from "@/components/sections/categories/Categories";
import NewProducts from "@/components/sections/products/NewProducts";
import PopularProducts from "@/components/sections/products/PopularProducts";
import WhyChooseUs from "@/components/sections/why-choose-us/WhyChooseUs";
import ProofScale from "@/components/sections/proof-scale/ProofScale";
import Blog from "@/components/sections/blog/Blog";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-[200px] bg-pr_dg text-white">
      <Hero />
      <Categories />
      <NewProducts />
      <PopularProducts />
      <WhyChooseUs />
      <ProofScale />
      {/* <Blog /> */}
    </div>
  );
}
