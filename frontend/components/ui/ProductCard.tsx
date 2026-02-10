import Link from "next/link";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type NewProductCardProps = {
  title: string;
  description: string;
  price: string;
  isNew?: boolean;
  badgeLabel?: string;
  badgeClassName?: string;
  href?: string;
  showButton?: boolean;
};

export default function ProductCard({
  title,
  description,
  price,
  isNew = true,
  badgeLabel = "New!",
  badgeClassName = "bg-pr_y text-pr_dg",
  href,
  showButton = true,
}: NewProductCardProps) {
  const content = (
    <>
      <div className="relative rounded-2xl bg-sr_w p-4">
        {isNew && (
          <span
            className={cn(
              "absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold",
              badgeClassName,
            )}
          >
            {badgeLabel}
          </span>
        )}
        <div className="h-[400px] rounded-xl bg-pr_w/60" />
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="text-base font-semibold text-pr_w">{title}</h3>
        <p className="mt-1 text-sm text-pr_w/70 line-clamp-2">{description}</p>
        <p className="mt-2 text-lg font-semibold text-pr_w">{price}</p>
      </div>
    </>
  );

  return (
    <div className="flex h-full flex-col">
      {href ? (
        <Link href={href} className="flex flex-1 flex-col">
          {content}
        </Link>
      ) : (
        content
      )}
      {showButton && (
        <Button variant="category" className="mt-3 w-full">
          Add to Cart +
        </Button>
      )}
    </div>
  );
}
