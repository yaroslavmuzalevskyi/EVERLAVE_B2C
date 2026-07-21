"use client";
import { useEffect, useMemo, useState } from "react";
import Logo from "@/components/ui/Logo";
import { SectionSlider } from "@/components/navigation/SectionSlider";
import { SectionTab } from "@/types/navigation";
import { Menu, X, ShoppingCart, User, Shield } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePathname } from "next/navigation";
import { BLOG_ENABLED } from "@/lib/featureFlags";
import { fetchCart, CART_CHANGED_EVENT } from "@/services/cart";

const BUSINESS_URL = "https://b2b.evervale.org/";

const tabs: SectionTab[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "seeds", label: "Seeds", href: "/products" },
  ...(BLOG_ENABLED
    ? [{ id: "blog", label: "Blog", href: "/blog" } as SectionTab]
    : []),
  {
    id: "business",
    label: "For Business",
    href: BUSINESS_URL,
    external: true,
  },
];

/**
 * Overlays for the cart icon: a transient "+" that pulses in on add, and a
 * persistent red count badge showing how many products are in the cart. Only
 * one shows at a time — the "+" during the ~1s pulse, the count otherwise.
 */
const CartBadges = ({
  pulse,
  count,
  className,
}: {
  pulse: boolean;
  count: number;
  className?: string;
}) => {
  const showCount = count > 0 && !pulse;
  return (
    <>
      <span
        className={cn(
          "pointer-events-none absolute inline-flex h-4 w-4 items-center justify-center rounded-full bg-pr_dg text-[10px] font-bold text-pr_w transition-all duration-300",
          className,
          pulse
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-1 scale-75 opacity-0",
        )}
        aria-hidden
      >
        +
      </span>
      <span
        className={cn(
          "pointer-events-none absolute inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white shadow-sm transition-all duration-300",
          className,
          showCount ? "scale-100 opacity-100" : "scale-75 opacity-0",
        )}
        aria-hidden
      >
        {count > 99 ? "99+" : count}
      </span>
    </>
  );
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuMounted, setMobileMenuMounted] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (mobileMenuOpen) setMobileMenuMounted(true);
  }, [mobileMenuOpen]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleCartAdded = () => {
      setCartPulse(true);
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setCartPulse(false), 1000);
    };

    window.addEventListener("cart-item-added", handleCartAdded);
    return () => {
      window.removeEventListener("cart-item-added", handleCartAdded);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Keep the cart count badge in sync. Refreshes on mount, on any cart
  // mutation (CART_CHANGED_EVENT), on route changes, and when auth state
  // flips (login merges the guest cart into the account cart).
  useEffect(() => {
    let cancelled = false;
    const refreshCount = async () => {
      try {
        const cart = await fetchCart();
        if (!cancelled) setCartCount(cart.items.length);
      } catch {
        // Ignore transient failures — keep the last known count.
      }
    };

    refreshCount();
    window.addEventListener(CART_CHANGED_EVENT, refreshCount);
    return () => {
      cancelled = true;
      window.removeEventListener(CART_CHANGED_EVENT, refreshCount);
    };
  }, [pathname, isAuthenticated]);

  const activeId = useMemo(() => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/products")) return "seeds";
    if (pathname.startsWith("/seeds")) return "seeds";
    if (pathname.startsWith("/blog")) return "blog";
    return "home";
  }, [pathname]);

  const profileHref = useMemo(() => {
    if (isAuthenticated) {
      return "/user_profile/profile";
    }

    return "/signin?next=/user_profile/profile";
  }, [isAuthenticated]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-pr_dg/90 backdrop-blur">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
          {/* Desktop (1024px+) */}
          <div className="hidden lg:flex h-[80px] lg:h-[96px] items-center justify-between gap-10">
            <Logo />
            <SectionSlider tabs={tabs} activeId={activeId} />
            <div className="flex items-center gap-3">
              {isAdmin ? (
                <Link
                  href="/admin/products"
                  className="flex h-10 w-16 items-center justify-center rounded-full bg-pr_lg text-pr_dg shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-pr_lg/90 active:translate-y-0"
                  aria-label="Admin panel"
                >
                  <Shield className="h-4 w-4" />
                </Link>
              ) : null}
              <Link
                href="/cart"
                className={cn(
                  "relative flex h-10 w-16 items-center justify-center rounded-full bg-pr_w text-pr_dg shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-pr_w/90 active:translate-y-0",
                  cartPulse && "scale-110",
                )}
                aria-label="Open cart"
              >
                <CartBadges
                  pulse={cartPulse}
                  count={cartCount}
                  className="right-1.5 top-1"
                />
                <ShoppingCart className="h-4 w-4" />
              </Link>
              <Link
                href={profileHref}
                className="flex h-10 w-16 items-center justify-center rounded-full bg-pr_w text-pr_dg shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-pr_w/90 active:translate-y-0"
                aria-label="Open account"
              >
                <User className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Burger navigation (<= 1024px) */}
          <div className="flex h-[70px] max-[537px]:h-[62px] sm:h-[80px] md:h-[96px] items-center justify-between lg:hidden">
            <div className="max-[537px]:[&_img]:h-7 max-[537px]:[&_img]:w-auto">
              <Logo />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative rounded-lg p-2 transition-colors hover:bg-white/10 max-[537px]:p-1.5"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <span className="relative block h-6 w-6 max-[537px]:h-5 max-[537px]:w-5">
                  <Menu
                    size={24}
                    className={cn(
                      "absolute inset-0 text-white transition-all duration-200 ease-out",
                      mobileMenuOpen
                        ? "opacity-0 rotate-90 scale-75"
                        : "opacity-100 rotate-0 scale-100",
                    )}
                  />
                  <X
                    size={24}
                    className={cn(
                      "absolute inset-0 text-white transition-all duration-200 ease-out",
                      mobileMenuOpen
                        ? "opacity-100 rotate-0 scale-100"
                        : "opacity-0 -rotate-90 scale-75",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuMounted && (
        <div
          className={cn(
            "fixed inset-x-0 top-[70px] z-40 border-b border-white/10 bg-pr_dg/95 backdrop-blur max-[537px]:top-[62px] lg:hidden sm:top-[80px] md:top-[96px]",
            mobileMenuOpen ? "mobile-menu-enter" : "mobile-menu-exit",
          )}
          onAnimationEnd={() => {
            if (!mobileMenuOpen) setMobileMenuMounted(false);
          }}
        >
          <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6">
            <div className="py-4">
              <div className="flex items-stretch gap-2 max-[537px]:flex-col">
                <div className="min-w-0 flex-1">
                  <SectionSlider
                    tabs={tabs}
                    activeId={activeId}
                    onNavigate={() => setMobileMenuOpen(false)}
                  />
                </div>
                <div className="flex items-stretch gap-2 max-[537px]:w-full">
                  {isAdmin ? (
                    <Link
                      href="/admin/products"
                      className="flex h-full w-[100px] items-center justify-center rounded-full bg-pr_lg text-pr_dg shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-pr_lg/90 active:translate-y-0 max-[537px]:h-10 max-[537px]:flex-1 max-[537px]:w-auto"
                      aria-label="Admin panel"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Shield className="h-4 w-4" />
                    </Link>
                  ) : null}
                  <Link
                    href="/cart"
                    className={cn(
                      "relative flex h-full w-[100px] items-center justify-center rounded-full bg-pr_w text-pr_dg shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-pr_w/90 active:translate-y-0 max-[537px]:h-10 max-[537px]:flex-1 max-[537px]:w-auto",
                      cartPulse && "scale-105",
                    )}
                    aria-label="Open cart"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <CartBadges
                      pulse={cartPulse}
                      count={cartCount}
                      className="right-2 top-1"
                    />
                    <ShoppingCart className="h-4 w-4" />
                  </Link>
                  <Link
                    href={profileHref}
                    className="flex h-full w-[100px] items-center justify-center rounded-full bg-pr_w text-pr_dg shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-pr_w/90 active:translate-y-0 max-[537px]:h-10 max-[537px]:flex-1 max-[537px]:w-auto"
                    aria-label="Open account"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
