"use client";

import OrderCard from "@/components/orders/OrderCard";
import RequireAuth from "@/components/auth/RequireAuth";
import UserHeader from "@/components/userProfile/UserHeader";

const orders = [
  {
    orderId: "CNG-87654",
    product: "CBD Isolate 99%",
    price: "€56.32",
    quantity: "2 pieces",
    total: "€112.64",
    statusDate: "Shipped 28 of January",
    statusLabel: "Delivery",
  },
  {
    orderId: "FDP-45987",
    product: "Lemon Haze Cannabis Flo...",
    price: "€18.00",
    quantity: "3 pieces",
    total: "€54.00",
    statusDate: "Shipped 24 of January",
    statusLabel: "Delivery",
  },
];

export default function OrdersPage() {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-pr_dg text-pr_dg">
        <div className="w-full px-4 pb-0 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
          <div className="pt-[120px]">
            <UserHeader activeTab="orders" userName="Stephan Macroski" />

            <div className="mt-4 grid gap-6 lg:grid-cols-[260px_1fr]">
              <div className="flex flex-col gap-3 rounded-2xl bg-pr_w p-4">
                <button
                  type="button"
                  className="flex items-center justify-between rounded-full bg-pr_dg px-5 py-3 text-sm text-pr_w"
                >
                  Delivered <span>2</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-between rounded-full border border-pr_dg/30 px-5 py-3 text-sm text-pr_dg"
                >
                  Arrived <span>0</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-between rounded-full border border-pr_dg/30 px-5 py-3 text-sm text-pr_dg"
                >
                  Canceled <span>0</span>
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {orders.map((order) => (
                  <OrderCard key={order.orderId} {...order} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
