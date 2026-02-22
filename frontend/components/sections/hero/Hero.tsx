"use client";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type HeroProps = {
  contentWidthClass?: string;
  className?: string;
  sectionId?: string;
};

export default function Hero({
  contentWidthClass = "w-full",
  className,
  sectionId = "home",
}: HeroProps) {
  const router = useRouter();

  const handleCatalogClick = () => {
    if (typeof window === "undefined") return;

    const openCatalogEvent = new CustomEvent("open-catalog-modal", {
      cancelable: true,
    });
    const shouldFallbackToProducts = window.dispatchEvent(openCatalogEvent);
    if (shouldFallbackToProducts) {
      router.push("/seeds?tab=products");
    }
  };

  return (
    <section
      id={sectionId}
      className={cn(
        "mt-[150px] w-full px-4 max-[640px]:mt-[92px] max-[400px]:mt-[84px] sm:px-6 md:px-8 lg:px-12 xl:px-[130px]",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full flex-col items-center gap-5 text-center",
          contentWidthClass,
        )}
      >
        <h1 className="animated-gradient-text w-full text-[clamp(3rem,7.9vw,8.2rem)] leading-[0.97] font-extrabold tracking-[-0.02em] max-[740px]:text-[clamp(3.8rem,13.5vw,5.6rem)] max-[710px]:text-[clamp(3.35rem,14.5vw,4.6rem)]">
          Where Nature Meets Precision.
        </h1>
        <p className="display-md_thin max-w-3xl text-pr_w/75 max-[640px]:text-[clamp(1.14rem,5.2vw,1.45rem)] max-[640px]:leading-[1.36]">
          Professional-grade cannabis genetics for licensed businesses.
          <br className="hidden sm:block" />
          Certified. Compliant. Consistent.
        </p>
        <Button
          variant="category"
          onClick={handleCatalogClick}
          className="px-7 py-3 text-base font-semibold max-[640px]:px-6 max-[640px]:py-2.5 max-[640px]:text-base"
        >
          Explore Now!
        </Button>
      </div>
    </section>
  );
}
