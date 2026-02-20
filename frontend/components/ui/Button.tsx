import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "header" | "contact" | "primary" | "category";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const baseStyles =
  "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transform-gpu transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

const variants: Record<ButtonVariant, string> = {
  header: "bg-white text-pr_dg hover:bg-white/90",
  contact: "bg-pr_dg text-white hover:bg-pr_dg/90",
  primary: "bg-pr_dg text-white hover:bg-pr_dg/90",
  category: "bg-pr_y text-pr_dg hover:bg-pr_y/90",
};

export default function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  );
}
