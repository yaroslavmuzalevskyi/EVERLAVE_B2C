"use client";

import RequireAuth from "@/components/auth/RequireAuth";

export default function CartPage() {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-pr_dg text-pr_w">
        <section className="w-full px-4 pt-[120px] pb-24 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
          <h1 className="text-2xl font-semibold">Cart</h1>
          <p className="mt-2 text-sm text-pr_w/70">
            Your cart is empty right now.
          </p>
        </section>
      </div>
    </RequireAuth>
  );
}
