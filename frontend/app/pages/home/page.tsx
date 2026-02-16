import Hero from "@/components/sections/hero/Hero";
import NewProducts from "@/components/sections/products/NewProducts";
import PopularProducts from "@/components/sections/products/PopularProducts";
import BestYieldProducts from "@/components/sections/products/BestYieldProducts";
import BestThcProducts from "@/components/sections/products/BestThcProducts";
import WhyChooseUs from "@/components/sections/why-choose-us/WhyChooseUs";
import ProofScale from "@/components/sections/proof-scale/ProofScale";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-[140px] bg-pr_dg pt-[92px] pb-10 text-white sm:pt-[110px] sm:pb-14 lg:gap-[200px] lg:pt-[128px] lg:pb-24">
      <Hero />
      <NewProducts />
      <PopularProducts />
      <BestYieldProducts />
      <BestThcProducts />
      <WhyChooseUs />
      <ProofScale />
    </div>
  );
}
