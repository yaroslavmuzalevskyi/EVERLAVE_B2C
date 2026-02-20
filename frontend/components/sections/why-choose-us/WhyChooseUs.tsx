import Image from "next/image";
import protectionCardIcon from "@/public/icons/about_protection_card_icon.svg";
import growCardIcon from "@/public/icons/about_grow_card_icon.svg";
import dnaCardIcon from "@/public/icons/about_dna_card_icon.svg";
import chainCardIcon from "@/public/icons/about_chain_card_icon.svg";
import protectionIcon from "@/public/icons/protection.svg";
import growIcon from "@/public/icons/grow.svg";
import dnaIcon from "@/public/icons/dna.svg";
import chainIcon from "@/public/icons/chain.svg";

const reasons = [
  {
    title: "Free and fast delivery / return",
    description:
      "We source plants only from trusted growers, carefully monitoring root health and cultivation conditions to ensure strong and healthy growth.",
    badgeIcon: protectionCardIcon,
    backgroundIcon: protectionIcon,
  },
  {
    title: "High yield genetics",
    description:
      "We source plants only from trusted growers, carefully monitoring root health and cultivation conditions to ensure strong and healthy growth.",
    badgeIcon: growCardIcon,
    backgroundIcon: growIcon,
  },
  {
    title: "Custom breeding",
    description:
      "We source plants only from trusted growers, carefully monitoring root health and cultivation conditions to ensure strong and healthy growth.",
    badgeIcon: dnaCardIcon,
    backgroundIcon: dnaIcon,
  },
  {
    title: "4.8 average customer review",
    description:
      "We source plants only from trusted growers, carefully monitoring root health and cultivation conditions to ensure strong and healthy growth.",
    badgeIcon: chainCardIcon,
    backgroundIcon: chainIcon,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
      <div className="max-w-3xl">
        <h2 className="text-4xl font-semibold text-pr_w sm:text-5xl">
          Why choose us?
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-pr_w/70">
          Evervale is a new generation of cannabis genetics provider built on
          transparency and precision.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {reasons.map((reason) => (
          <article
            key={reason.title}
            className="relative min-h-[260px] overflow-hidden rounded-tr-[32px] rounded-bl-[32px] border border-pr_w/20 bg-pr_w p-8 text-pr_dg transition-transform duration-200 ease-out hover:-translate-y-1 sm:p-9"
          >
            <Image
              src={reason.backgroundIcon}
              alt=""
              aria-hidden
              className="pointer-events-none absolute -right-12 -top-8 h-[240px] w-[240px] opacity-10"
            />

            <div className="relative z-10 flex h-full flex-col">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pr_dg">
                <Image
                  src={reason.badgeIcon}
                  alt=""
                  aria-hidden
                  width={22}
                  height={22}
                  className="h-[22px] w-[22px]"
                />
              </div>

              <div className="mt-auto pt-20">
                <h3 className="text-3xl font-semibold leading-tight text-pr_dg">
                  {reason.title}
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-pr_dg/70">
                  {reason.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
