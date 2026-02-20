import Hero from "@/components/sections/hero/Hero";
import NewProducts from "@/components/sections/products/NewProducts";
import PopularProducts from "@/components/sections/products/PopularProducts";
import BestByMetricsProducts from "@/components/sections/products/BestByMetricsProducts";
import WhyChooseUs from "@/components/sections/why-choose-us/WhyChooseUs";
import ProofScale from "@/components/sections/proof-scale/ProofScale";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-[140px] bg-pr_dg pb-10 text-white [&_button]:transform-none [&_button]:transition-none [&_button:hover]:translate-y-0 [&_button:active]:translate-y-0 sm:pb-14 lg:gap-[200px] lg:pb-24">
      <section className="relative isolate overflow-hidden pt-[92px] sm:pt-[110px] lg:pt-[128px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-8 bottom-0 bg-[url('/images/bg_image_frame.svg')] bg-cover bg-top bg-no-repeat opacity-90 [mask-image:linear-gradient(to_bottom,black_0%,black_72%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_72%,transparent_100%)]"
        />
        <Hero className="relative z-10" />
      </section>
      <NewProducts />
      <PopularProducts />
      <BestByMetricsProducts />
      <WhyChooseUs />
      <ProofScale />
    </div>
  );
}
