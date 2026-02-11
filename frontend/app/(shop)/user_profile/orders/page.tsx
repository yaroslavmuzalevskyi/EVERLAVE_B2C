"use client";

import { useEffect, useMemo, useState } from "react";
import OrderCard from "@/components/orders/OrderCard";
import RequireAuth from "@/components/auth/RequireAuth";
import UserHeader from "@/components/userProfile/UserHeader";
import { fetchOrders, Order } from "@/services/orders";
import { formatPrice } from "@/services/products";

const fallbackOrders = [
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

type DisplayOrder = (typeof fallbackOrders)[number];

type FilterKey = "delivered" | "arrived" | "canceled" | "all";

const statusLabelMap: Record<string, string> = {
  PENDING: "Processing",
  PAID: "Processing",
  SHIPPED: "Delivery",
  DELIVERED: "Delivery",
  COMPLETED: "Completed",
  CANCELLED: "Canceled",
  REFUNDED: "Refunded",
};

const toDateLabel = (label: string, value?: string | null) => {
  if (!value) return label;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return label;
  return `${label} ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
};

const buildDisplayOrder = (order: Order): DisplayOrder => {
  const totalQty = order.items.reduce((sum, item) => sum + item.qty, 0);
  const firstItem = order.items[0];
  const product =
    order.items.length > 1
      ? `${firstItem?.productName ?? "Order"} + ${order.items.length - 1} more`
      : firstItem?.productName ?? "Order";
  const statusLabel = statusLabelMap[order.status] ?? order.status;
  const statusDate =
    order.status === "SHIPPED"
      ? toDateLabel("Shipped", order.shippedAt)
      : order.status === "DELIVERED"
        ? toDateLabel("Delivered", order.deliveredAt)
        : order.status === "COMPLETED"
          ? toDateLabel("Completed", order.completedAt)
          : statusLabel;

  return {
    orderId: order.id,
    product,
    price: firstItem
      ? formatPrice(firstItem.unitPriceCents, order.currency)
      : formatPrice(order.totalAmountCents, order.currency),
    quantity: `${totalQty} pieces`,
    total: formatPrice(order.totalAmountCents, order.currency),
    statusDate,
    statusLabel,
  };
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<DisplayOrder[]>(fallbackOrders);
  const [rawOrders, setRawOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchOrders({ page: 1, limit: 16 });
        if (!isMounted) return;
        setRawOrders(response.items);
        setOrders(response.items.map(buildDisplayOrder));
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load orders");
        setOrders(fallbackOrders);
        setRawOrders([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const statusCounts = useMemo(() => {
    if (!rawOrders.length) {
      return { delivered: 0, arrived: 0, canceled: 0 };
    }
    return rawOrders.reduce(
      (acc, order) => {
        if (["DELIVERED", "COMPLETED"].includes(order.status)) {
          acc.delivered += 1;
        }
        if (["SHIPPED"].includes(order.status)) {
          acc.arrived += 1;
        }
        if (["CANCELLED", "REFUNDED"].includes(order.status)) {
          acc.canceled += 1;
        }
        return acc;
      },
      { delivered: 0, arrived: 0, canceled: 0 },
    );
  }, [rawOrders]);

  const filteredOrders = useMemo(() => {
    if (!rawOrders.length) return orders;

    const apply = (order: Order) => {
      if (filter === "delivered")
        return ["DELIVERED", "COMPLETED"].includes(order.status);
      if (filter === "arrived") return ["SHIPPED"].includes(order.status);
      if (filter === "canceled")
        return ["CANCELLED", "REFUNDED"].includes(order.status);
      return true;
    };

    return rawOrders.filter(apply).map(buildDisplayOrder);
  }, [filter, rawOrders, orders]);

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
                  onClick={() => setFilter("delivered")}
                  className={`flex items-center justify-between rounded-full px-5 py-3 text-sm transition ${
                    filter === "delivered"
                      ? "bg-pr_dg text-pr_w"
                      : "border border-pr_dg/30 text-pr_dg"
                  }`}
                >
                  Delivered <span>{statusCounts.delivered}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("arrived")}
                  className={`flex items-center justify-between rounded-full px-5 py-3 text-sm transition ${
                    filter === "arrived"
                      ? "bg-pr_dg text-pr_w"
                      : "border border-pr_dg/30 text-pr_dg"
                  }`}
                >
                  Arrived <span>{statusCounts.arrived}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("canceled")}
                  className={`flex items-center justify-between rounded-full px-5 py-3 text-sm transition ${
                    filter === "canceled"
                      ? "bg-pr_dg text-pr_w"
                      : "border border-pr_dg/30 text-pr_dg"
                  }`}
                >
                  Canceled <span>{statusCounts.canceled}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={`flex items-center justify-between rounded-full px-5 py-3 text-sm transition ${
                    filter === "all"
                      ? "bg-pr_dg text-pr_w"
                      : "border border-pr_dg/30 text-pr_dg"
                  }`}
                >
                  All <span>{rawOrders.length || orders.length}</span>
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {loading ? (
                  <div className="rounded-2xl bg-pr_w p-6 text-sm text-pr_dg/70">
                    Loading orders...
                  </div>
                ) : error ? (
                  <div className="rounded-2xl bg-pr_w p-6 text-sm text-pr_dr">
                    {error}
                  </div>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <OrderCard key={order.orderId} {...order} />
                  ))
                ) : (
                  <div className="rounded-2xl bg-pr_w p-6 text-sm text-pr_dg/70">
                    No orders found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
