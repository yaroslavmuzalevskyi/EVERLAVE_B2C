"use client";
import { useEffect, useMemo, useState } from "react";
import Logo from "@/components/ui/Logo";
import { SectionSlider } from "@/components/navigation/SectionSlider";
import { SectionTab } from "@/types/navigation";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePathname } from "next/navigation";
import { seedItems } from "@/lib/seeds";

const BUSINESS_URL = "https://everlave-b2b.netlify.app/";

const seedDropdownItems = seedItems.slice(0, 5).map((seed) => ({
  label: seed.title,
}));

const tabs: SectionTab[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "seeds", label: "Seeds", dropdownItems: seedDropdownItems },
  {
    id: "products",
    label: "Cannabinoid products",
    href: "/products?category=cannabis-seeds",
  },
  {
    id: "business",
    label: "For Business",
    href: BUSINESS_URL,
    external: true,
  },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuMounted, setMobileMenuMounted] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (mobileMenuOpen) setMobileMenuMounted(true);
  }, [mobileMenuOpen]);

  const activeId = useMemo(() => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/products")) return "products";
    if (pathname.startsWith("/seeds")) return "seeds";
    return "home";
  }, [pathname]);

  const { cartHref, profileHref } = useMemo(() => {
    if (isAuthenticated) {
      return {
        cartHref: "/cart",
        profileHref: "/user_profile/profile",
      };
    }

    return {
      cartHref: "/signin?next=/cart",
      profileHref: "/signin?next=/user_profile/profile",
    };
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
              <Link
                href={cartHref}
                className="flex h-10 w-16 items-center justify-center rounded-full bg-pr_w text-pr_dg shadow-sm transition hover:bg-pr_w/90"
                aria-label="Open cart"
              >
                <ShoppingCart className="h-4 w-4" />
              </Link>
              <Link
                href={profileHref}
                className="flex h-10 w-16 items-center justify-center rounded-full bg-pr_w text-pr_dg shadow-sm transition hover:bg-pr_w/90"
                aria-label="Open account"
              >
                <User className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Burger navigation (<= 1024px) */}
          <div className="flex h-[70px] sm:h-[80px] md:h-[96px] items-center justify-between lg:hidden">
            <Logo />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <span className="relative block h-6 w-6">
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
            "fixed inset-x-0 top-[70px] z-40 border-b border-white/10 bg-pr_dg/95 backdrop-blur lg:hidden sm:top-[80px] md:top-[96px]",
            mobileMenuOpen ? "mobile-menu-enter" : "mobile-menu-exit",
          )}
          onAnimationEnd={() => {
            if (!mobileMenuOpen) setMobileMenuMounted(false);
          }}
        >
          <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6">
            <div className="py-4 border-b border-white/10">
              <div className="flex justify-center">
                <SectionSlider
                  tabs={tabs}
                  activeId={activeId}
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 py-4">
              <Link
                href={cartHref}
                className="flex h-10 w-14 items-center justify-center rounded-full bg-pr_w text-pr_dg shadow-sm transition hover:bg-pr_w/90"
                aria-label="Open cart"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart className="h-4 w-4" />
              </Link>
              <Link
                href={profileHref}
                className="flex h-10 w-14 items-center justify-center rounded-full bg-pr_w text-pr_dg shadow-sm transition hover:bg-pr_w/90"
                aria-label="Open account"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
