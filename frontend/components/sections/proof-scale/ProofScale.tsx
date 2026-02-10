"use client";

import { AtSign, Lightbulb, List, ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type ProofCard = {
  title: string;
  description: string;
  icon: ReactNode;
};

const cards: ProofCard[] = [
  {
    title: "12+",
    description: "B2B Contracts Organized",
    icon: <List className="h-8 w-8 text-sr_dg" />,
  },
  {
    title: "400+ KG",
    description: "Seeds Sold Peer Month",
    icon: <ShoppingCart className="h-8 w-8 text-sr_dg" />,
  },
  {
    title: "202X",
    description: "Founded This Year",
    icon: <Lightbulb className="h-8 w-8 text-sr_dg" />,
  },
  {
    title: "EU Network",
    description: "European Presence",
    icon: <AtSign className="h-8 w-8 text-sr_dg" />,
  },
];

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const element = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function ProofCardItem({
  title,
  description,
  icon,
  index,
}: ProofCard & { index: number }) {
  const { ref, isVisible } = useInView<HTMLDivElement>(0.25);
  const isOpposite = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={`flex h-full min-h-[380px] flex-col items-center justify-between bg-pr_w p-8 text-center text-sr_dg ${
        isOpposite
          ? "rounded-br-3xl rounded-tl-3xl"
          : "rounded-bl-3xl rounded-tr-3xl"
      }`}
    >
      <div className="flex h-16 w-16 items-center justify-center">{icon}</div>

      <div
        className={`transition-all duration-700 ease-out will-change-transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <p className="text-3xl font-semibold">{title}</p>
        <p className="mt-2 text-sm font-semibold sm:text-base">{description}</p>
      </div>
    </div>
  );
}

export default function ProofScale() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
      <h2 className="text-3xl font-semibold text-pr_w">Proof & Scale</h2>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <ProofCardItem key={card.title} index={index} {...card} />
        ))}
      </div>
    </section>
  );
}
