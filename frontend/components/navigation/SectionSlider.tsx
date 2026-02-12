import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SectionTab } from "@/types/navigation";
import { ChevronDown } from "lucide-react";

type Props = {
  tabs: SectionTab[];
  activeId: string;
  onNavigate?: () => void;
};

export function SectionSlider({ tabs, activeId, onNavigate }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-nav-dropdown]")) {
        setOpenId(null);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <nav className="flex flex-wrap items-center gap-2 rounded-full bg-pr_w/95 p-1">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        const hasDropdown = Boolean(tab.dropdownItems?.length);
        const baseClasses = cn(
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition",
          isActive
            ? "bg-pr_dg text-pr_w shadow-sm"
            : "text-sr_g hover:text-pr_dg",
        );

        if (hasDropdown) {
          return (
            <div key={tab.id} className="relative" data-nav-dropdown>
              <button
                type="button"
                onClick={() =>
                  setOpenId((prev) => (prev === tab.id ? null : tab.id))
                }
                className={baseClasses}
              >
                <span>{tab.label}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-current transition",
                    openId === tab.id ? "rotate-180" : "rotate-0",
                  )}
                />
              </button>

              <div
                className={cn(
                  "absolute left-0 z-40 mt-2 min-w-[180px] rounded-2xl bg-pr_w p-2 text-xs text-pr_dg shadow-lg transition",
                  openId === tab.id
                    ? "scale-100 opacity-100"
                    : "pointer-events-none scale-95 opacity-0",
                )}
              >
                {tab.dropdownItems?.map((item) =>
                  item.external ? (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-lg px-3 py-2 text-left text-pr_dg/80 hover:bg-pr_dg/10"
                      onClick={() => {
                        setOpenId(null);
                        onNavigate?.();
                      }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-lg px-3 py-2 text-left text-pr_dg/80 hover:bg-pr_dg/10"
                      onClick={() => {
                        setOpenId(null);
                        onNavigate?.();
                      }}
                    >
                      {item.label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          );
        }

        if (tab.href) {
          if (tab.external) {
            return (
              <a
                key={tab.id}
                href={tab.href}
                target="_blank"
                rel="noreferrer"
                className={baseClasses}
                onClick={() => onNavigate?.()}
              >
                {tab.label}
              </a>
            );
          }

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={baseClasses}
              onClick={() => onNavigate?.()}
            >
              {tab.label}
            </Link>
          );
        }

        return (
          <button key={tab.id} type="button" className={baseClasses}>
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
