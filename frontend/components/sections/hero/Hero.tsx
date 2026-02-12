import Image from "next/image";
import Card from "@/components/ui/Card";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="w-full px-4 pt-12 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]"
    >
      <Card
        width="100%"
        height="450px"
        className="relative flex flex-col justify-end overflow-hidden px-6 py-10 shadow-[0_20px_60px_rgba(3,44,30,0.18)] sm:px-8 lg:px-10"
      >
        <Image
          src="/icons/grow.svg"
          alt=""
          width={640}
          height={640}
          className="pointer-events-none absolute left-2/3 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 opacity-70 sm:h-[420px] sm:w-[420px] lg:h-[520px] lg:w-[520px]"
          priority
        />
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-balance text-3xl font-extrabold leading-tight text-pr_dg sm:text-4xl lg:text-5xl xl:text-6xl">
            Black Friday Starts Now!
          </h1>
          <p className=" text-pretty text-sm text-sr_g sm:text-base lg:text-lg">
            Stable and repeatable performance with tested yields, resilience,
            and predictable results.
          </p>
          <Link
            href="/seeds?tab=products"
            className="mt-3 inline-flex items-center justify-center rounded-full bg-pr_dg px-6 py-3 text-sm font-semibold text-pr_w transition hover:bg-sr_dg"
          >
            Explore Now!
          </Link>
        </div>
      </Card>
    </section>
  );
}
