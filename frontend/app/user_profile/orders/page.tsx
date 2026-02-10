import OrderCard from "@/components/orders/OrderCard";
import { ShoppingCart, LogOut, User } from "lucide-react";

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
    <div className="min-h-screen bg-pr_dg text-pr_dg">
      <div className="w-full px-4 pb-0 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
        <div className="pt-[120px]">
          <div className="rounded-2xl bg-pr_w px-6 py-5">
            <p className="text-sm text-pr_dg/70">Good morning!</p>
            <div className="mt-1 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-xl font-semibold">Stephan Macroski</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-pr_dg/40 px-5 py-2 text-sm text-pr_dg"
                >
                  Profile <User className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full bg-pr_dg px-5 py-2 text-sm text-pr_w"
                >
                  Orders <ShoppingCart className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-pr_dg/40 px-5 py-2 text-sm text-pr_dg"
                >
                  Log out <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

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
  );
}
