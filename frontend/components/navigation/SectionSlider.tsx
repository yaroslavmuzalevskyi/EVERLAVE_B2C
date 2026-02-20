import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SectionTab } from "@/types/navigation";
import { ChevronDown } from "lucide-react";

type Props = {
  tabs: SectionTab[];
  activeId: string;
  onNavigate?: () => void;
  rightContent?: ReactNode;
};

export function SectionSlider({
  tabs,
  activeId,
  onNavigate,
  rightContent,
}: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activePill, setActivePill] = useState({
    left: 0,
    width: 0,
    visible: false,
  });

  const updateActivePill = useCallback(() => {
    const navEl = navRef.current;
    if (!navEl) {
      setActivePill((prev) => ({ ...prev, visible: false }));
      return;
    }

    const navRect = navEl.getBoundingClientRect();
    const activeIndex = tabs.findIndex((tab) => tab.id === activeId);
    if (activeIndex < 0 || tabs.length === 0) {
      setActivePill((prev) => ({ ...prev, visible: false }));
      return;
    }

    const navStyles = window.getComputedStyle(navEl);
    const padLeft = Number.parseFloat(navStyles.paddingLeft) || 0;
    const padRight = Number.parseFloat(navStyles.paddingRight) || 0;
    const innerWidth = Math.max(navRect.width - padLeft - padRight, 0);
    const segmentWidth = innerWidth / tabs.length;

    setActivePill({
      left: padLeft + activeIndex * segmentWidth,
      width: segmentWidth,
      visible: true,
    });
  }, [activeId, tabs]);

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

  useEffect(() => {
    const frameId = window.requestAnimationFrame(updateActivePill);
    const onResize = () => window.requestAnimationFrame(updateActivePill);
    window.addEventListener("resize", onResize);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
    };
  }, [updateActivePill, tabs.length]);

  return (
    <nav
      ref={navRef}
      className="relative flex w-full items-center justify-center gap-0 rounded-full bg-pr_w/95 p-1.5 lg:w-[500px] lg:justify-center lg:p-1"
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-y-1 rounded-full bg-pr_dg shadow-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          activePill.visible ? "opacity-100" : "opacity-0",
        )}
        style={{ left: activePill.left, width: activePill.width }}
      />
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        const hasDropdown = Boolean(tab.dropdownItems?.length);
        const baseClasses = cn(
          "relative z-10 flex flex-1 items-center justify-center gap-1 rounded-full px-2 py-2 text-center text-sm transition-colors duration-200 ease-out lg:px-4 lg:py-2",
          isActive ? "text-pr_w" : "text-sr_g hover:text-pr_dg",
        );

        if (hasDropdown) {
          return (
            <div key={tab.id} className="relative flex-1" data-nav-dropdown>
              <button
                ref={(node) => {
                  tabRefs.current[tab.id] = node;
                }}
                type="button"
                onClick={() =>
                  setOpenId((prev) => (prev === tab.id ? null : tab.id))
                }
                className={cn(baseClasses, "w-full")}
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
                  item.external && item.href ? (
                    <a
                      key={item.href ?? item.label}
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
                  ) : item.href ? (
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
                  ) : (
                    <span
                      key={item.label}
                      className="block rounded-lg px-3 py-2 text-left text-pr_dg/60"
                    >
                      {item.label}
                    </span>
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
                ref={(node) => {
                  tabRefs.current[tab.id] = node;
                }}
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
              ref={(node) => {
                tabRefs.current[tab.id] = node;
              }}
              href={tab.href}
              className={baseClasses}
              onClick={() => onNavigate?.()}
            >
              {tab.label}
            </Link>
          );
        }

        return (
          <button
            key={tab.id}
            ref={(node) => {
              tabRefs.current[tab.id] = node;
            }}
            type="button"
            className={baseClasses}
          >
            {tab.label}
          </button>
        );
      })}
      {rightContent ? (
        <div className="relative z-10 ml-auto flex items-center gap-2">
          {rightContent}
        </div>
      ) : null}
    </nav>
  );
}
