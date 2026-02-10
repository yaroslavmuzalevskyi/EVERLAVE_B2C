import Link from "next/link";
import EffectPill from "@/components/seeds/EffectPill";
import RatingBar from "@/components/seeds/RatingBar";
import ReviewCard from "@/components/seeds/ReviewCard";
import { seedItems } from "@/lib/seeds";

type SeedDetailProps = {
  params: { slug: string } | Promise<{ slug: string }>;
};

const reviews = [
  {
    name: "Alex M.",
    rating: 5,
    text:
      "Second time ordering from this store. Consistent quality, clear product information, and fast order processing.",
  },
  {
    name: "Chris T.",
    rating: 4,
    text:
      "Product is okay and arrived on time. Nothing negative, but nothing outstanding either.",
  },
  {
    name: "Daniel S.",
    rating: 5,
    text:
      "Reliable shop with good communication. Packaging was discreet and secure. Overall a smooth experience.",
  },
];

export default async function SeedDetailPage({ params }: SeedDetailProps) {
  const resolvedParams = await params;
  const seed = seedItems.find((item) => item.slug === resolvedParams.slug);

  if (!seed) {
    return (
      <div className="bg-pr_dg text-pr_w">
        <section className="w-full px-4 pt-[120px] pb-20 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
          <p className="text-sm text-pr_w/70">
            Seed not found.{" "}
            <Link href="/seeds" className="text-pr_y">
              Back to Seeds
            </Link>
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-pr_dg text-pr_w">
      <section className="w-full px-4 pt-[120px] pb-24 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
        <p className="text-xs text-pr_w/60">
          Home / Cannabis Seeds / {seed.title}
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="h-[320px] w-full rounded-2xl bg-pr_w sm:h-[420px]" />
            <div className="mt-4 flex gap-4">
              <div className="h-16 w-16 rounded-xl bg-pr_w" />
              <div className="h-16 w-16 rounded-xl bg-pr_w" />
              <div className="h-16 w-16 rounded-xl bg-pr_w" />
            </div>
          </div>

          <div className="rounded-2xl bg-pr_w p-6 text-pr_dg">
            <div className="flex items-center justify-between text-xs text-pr_dg/60">
              <span>Cannabis Seeds</span>
              <span>
                {seed.sold} Sold • {seed.rating}★
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-semibold">{seed.title}</h1>
            <p className="mt-2 text-xs text-pr_dg/70">{seed.description}</p>

            <div className="mt-4">
              <p className="text-xs font-semibold">Number of seeds:</p>
              <div className="mt-2 flex gap-2">
                <button className="rounded-full border border-pr_dg/30 px-4 py-2 text-xs">
                  1x €27.50
                </button>
                <button className="rounded-full border border-pr_dg/30 px-4 py-2 text-xs">
                  3x €82.50
                </button>
                <button className="rounded-full border border-pr_dg/30 px-4 py-2 text-xs">
                  5x €137.50
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-2 text-xs">
              <div className="flex justify-between">
                <span className="font-semibold">Flavor & Aroma:</span>
                <span className="text-pr_dg/70">Sweet · Fruity · Light Earthy</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">THC Level</span>
                <span className="text-pr_dg/70">{seed.thc}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Seed Type</span>
                <span className="text-pr_dg/70">{seed.seedType}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Flowering Cycle</span>
                <span className="text-pr_dg/70">{seed.flowering}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Yield</span>
                <span className="text-pr_dg/70">{seed.yield}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {seed.effects.map((effect) => (
                <EffectPill key={effect} label={effect} />
              ))}
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-full bg-pr_dg px-4 py-2 text-sm font-semibold text-pr_w"
            >
              Add to Cart <span className="ml-1">+</span>
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.7fr]">
          <div className="rounded-2xl bg-pr_w p-6 text-pr_dg">
            <h2 className="text-sm font-semibold">Description</h2>
            {seed.sections.map((section) => (
              <div key={section.heading} className="mt-4">
                <h3 className="text-sm font-semibold">{section.heading}</h3>
                {section.body.map((paragraph, index) => (
                  <p
                    key={`${section.heading}-${index}`}
                    className="mt-2 text-xs text-pr_dg/70"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-pr_w p-6 text-pr_dg">
            <h2 className="text-sm font-semibold">Genetic Balance</h2>
            <div className="mt-4 space-y-3 text-xs">
              <div>
                <div className="flex justify-between">
                  <span>Indica</span>
                  <span>60%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-pr_dg/10">
                  <div className="h-2 w-[60%] rounded-full bg-pr_lg" />
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>Sativa</span>
                  <span>40%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-pr_dg/10">
                  <div className="h-2 w-[40%] rounded-full bg-pr_lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-6">
            <div className="rounded-2xl bg-pr_w p-6 text-pr_dg">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Average Rate</span>
                <span>{seed.rating} ★</span>
              </div>
              <div className="mt-4 space-y-3">
                <RatingBar label="5 - Excellent" value={12} total={12} />
                <RatingBar label="4 - Very Good" value={7} total={12} />
                <RatingBar label="3 - Good" value={5} total={12} />
                <RatingBar label="2 - Fair" value={0} total={12} />
                <RatingBar label="1 - Poor" value={0} total={12} />
              </div>
            </div>

            <div className="rounded-2xl bg-pr_w p-6 text-pr_dg">
              <p className="text-sm font-semibold">Review this product</p>
              <p className="mt-1 text-xs text-pr_dg/70">
                Share your thoughts with other customers
              </p>
              <button
                type="button"
                className="mt-4 w-full rounded-full bg-sr_dg px-4 py-2 text-xs font-semibold text-pr_w"
              >
                Write a customer review
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-pr_w p-6 text-pr_dg">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Review with images</p>
                <button
                  type="button"
                  className="rounded-full bg-sr_dg px-3 py-1 text-xs font-semibold text-pr_w"
                >
                  See All Photos
                </button>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="h-20 rounded-lg bg-sr_dg/90" />
                <div className="h-20 rounded-lg bg-sr_dg/90" />
                <div className="h-20 rounded-lg bg-sr_dg/90" />
              </div>
            </div>

            {reviews.map((review) => (
              <ReviewCard key={review.name} {...review} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
