import Link from "next/link";
import { cn } from "@/lib/utils";

type FooterLink = {
  label: string;
  href: string;
};

type FooterColumnProps = {
  title: string;
  links: FooterLink[];
  className?: string;
};

export default function FooterColumn({
  title,
  links,
  className,
}: FooterColumnProps) {
  return (
    <div className={cn("flex flex-col gap-3 text-sm", className)}>
      <p className="text-pr_w/90 font-semibold">{title}</p>
      <ul className="flex flex-col gap-2 text-pr_w/70">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <Link
              href={link.href}
              className="inline-flex w-full justify-center text-center lg:w-auto lg:justify-start lg:text-left hover:text-pr_w transition"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
