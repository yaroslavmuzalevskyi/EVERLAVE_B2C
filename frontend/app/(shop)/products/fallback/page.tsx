"use client";

import { useEffect, useState } from "react";
import SeedDetailContent from "../../seeds/[slug]/SeedDetailContent";

/**
 * Client-side fallback for product slugs created after the last build.
 *
 * With `output: "export"` there is no server/ISR, so a product added in the
 * admin after a deploy has no statically generated HTML and Netlify would
 * serve a 404. The netlify.toml rewrite `/products/* -> /products/fallback.html`
 * (applied only when no static file exists) lands here; we read the slug from
 * the URL and let SeedDetailContent fetch the product at runtime. Build-time
 * known slugs still serve their own static HTML and never hit this page.
 */
export default function ProductFallbackPage() {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const path = window.location.pathname.replace(/\/+$/, "");
    const segments = path.split("/").filter(Boolean);
    const idx = segments.lastIndexOf("products");
    const candidate =
      idx >= 0 && idx < segments.length - 1 ? segments[idx + 1] : null;
    if (candidate && candidate !== "fallback") setSlug(candidate);
  }, []);

  if (!slug) {
    return (
      <div className="bg-pr_dg text-pr_w">
        <section className="w-full px-4 pt-[120px] pb-20 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
          <p className="text-sm text-pr_w/70">Loading…</p>
        </section>
      </div>
    );
  }

  return <SeedDetailContent slug={slug} />;
}
