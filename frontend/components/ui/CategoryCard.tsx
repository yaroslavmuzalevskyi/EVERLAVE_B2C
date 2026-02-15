import Link from "next/link";
import { cn } from "@/lib/utils";

type CategoryCardProps = {
  title: string;
  description: string;
  active?: boolean;
  index?: number;
  href?: string;
};

export default function CategoryCard({
  title,
  description,
  active = false,
  index = 0,
  href,
}: CategoryCardProps) {
  const cornerClass =
    index % 2 === 0 ? "rounded-tr-2xl rounded-bl-2xl" : "rounded-tl-2xl rounded-br-2xl";

  const card = (
    <div
      className={cn(
        "flex min-h-[180px] h-full flex-col justify-end border border-white/10 px-6 pb-5 pt-4 transition",
        cornerClass,
        active ? "bg-sr_dg text-pr_w" : "bg-pr_w text-pr_dg",
      )}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className={cn("mt-1 text-sm", active ? "text-pr_w/70" : "text-sr_g")}>
        {description}
      </p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {card}
      </Link>
    );
  }

  return card;
}
