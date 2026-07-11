"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import OrderCard from "@/components/orders/OrderCard";
import PaymentModal from "@/components/orders/PaymentModal";
import RequireAuth from "@/components/auth/RequireAuth";
import UserHeader from "@/components/userProfile/UserHeader";
import {
  Order,
  OpenPayment,
  cancelOrder,
  fetchCurrentPayment,
  fetchOrders,
} from "@/services/orders";
import { getStoredProfileName } from "@/lib/userProfile";

type FilterKey = "delivered" | "arrived" | "canceled" | "all";

const PAGE_SIZE = 16;

export default function OrdersPage() {
  const [userName] = useState(
    () => getStoredProfileName() || "Stephan Macroski",
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [resumingOrderNumber, setResumingOrderNumber] = useState<
    number | null
  >(null);
  const [cancellingOrderNumber, setCancellingOrderNumber] = useState<
    number | null
  >(null);
  const [activePayment, setActivePayment] = useState<OpenPayment | null>(null);

  const loadOrders = useCallback(async (targetPage: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchOrders({ page: targetPage, limit: PAGE_SIZE });
      setOrders(response.items);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders(page);
  }, [page, loadOrders]);

  const handleResumePayment = async (orderNumber: number) => {
    setNotice("");
    setResumingOrderNumber(orderNumber);
    try {
      const current = await fetchCurrentPayment();
      if (current) {
        setActivePayment(current);
      } else {
        // No PENDING payment left — it's already under review or gone.
        setNotice(
          "This payment has already been submitted and is under review.",
        );
        await loadOrders(page);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load payment details",
      );
    } finally {
      setResumingOrderNumber(null);
    }
  };

  const handleCancelOrder = async (orderNumber: number) => {
    if (
      !window.confirm(
        `Cancel order #${orderNumber}? This action cannot be undone.`,
      )
    ) {
      return;
    }
    setNotice("");
    setCancellingOrderNumber(orderNumber);
    try {
      await cancelOrder(orderNumber);
      await loadOrders(page);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel the order",
      );
    } finally {
      setCancellingOrderNumber(null);
    }
  };

  const statusCounts = useMemo(() => {
    return orders.reduce(
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
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const apply = (order: Order) => {
      if (filter === "delivered")
        return ["DELIVERED", "COMPLETED"].includes(order.status);
      if (filter === "arrived") return ["SHIPPED"].includes(order.status);
      if (filter === "canceled")
        return ["CANCELLED", "REFUNDED"].includes(order.status);
      return true;
    };
    return orders.filter(apply);
  }, [filter, orders]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <RequireAuth>
      <div className="min-h-screen bg-pr_dg text-pr_dg">
        <div className="w-full px-4 pb-0 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
          <div className="pt-[120px]">
            <UserHeader activeTab="orders" userName={userName} />

            <div className="mt-4 grid gap-6 lg:grid-cols-[260px_1fr]">
              <div className="flex flex-col gap-3 rounded-2xl bg-pr_w p-4 h-fit">
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
                  All <span>{total || orders.length}</span>
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {notice ? (
                  <div className="rounded-2xl bg-pr_w p-4 text-sm text-pr_dg/80">
                    {notice}
                  </div>
                ) : null}

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
                    <OrderCard
                      key={order.orderNumber}
                      order={order}
                      onResumePayment={handleResumePayment}
                      onCancel={handleCancelOrder}
                      resuming={resumingOrderNumber === order.orderNumber}
                      cancelling={cancellingOrderNumber === order.orderNumber}
                    />
                  ))
                ) : (
                  <div className="rounded-2xl bg-pr_w p-6 text-sm text-pr_dg/70">
                    No orders found.
                  </div>
                )}

                {totalPages > 1 ? (
                  <div className="flex items-center justify-center gap-4 pb-6">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1 || loading}
                      className="rounded-full border border-pr_w/40 px-4 py-2 text-xs text-pr_w disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-xs text-pr_w/80">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page >= totalPages || loading}
                      className="rounded-full border border-pr_w/40 px-4 py-2 text-xs text-pr_w disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <PaymentModal
          payment={activePayment}
          isOpen={activePayment !== null}
          onClose={() => setActivePayment(null)}
          onUpdated={() => {
            loadOrders(page);
          }}
        />
      </div>
    </RequireAuth>
  );
}
