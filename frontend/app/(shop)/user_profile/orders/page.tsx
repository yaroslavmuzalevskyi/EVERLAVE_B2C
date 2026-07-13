"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OrderCard from "@/components/orders/OrderCard";
import OpenPaymentModal from "@/components/orders/OpenPaymentModal";
import RequireAuth from "@/components/auth/RequireAuth";
import UserHeader from "@/components/userProfile/UserHeader";
import {
  Order,
  OpenPayment,
  ORDER_STATUSES,
  OrderStatus,
  cancelOrder,
  fetchCurrentPayment,
  fetchOrders,
  openPaymentFromOrder,
} from "@/services/orders";
import { getStoredProfileName } from "@/lib/userProfile";

const PAGE_SIZE = 16;
const SEARCH_DEBOUNCE_MS = 300;

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

function parseStatusesParam(raw: string | null): OrderStatus[] {
  if (!raw) return [];
  const set = new Set(ORDER_STATUSES as readonly string[]);
  return raw
    .split(",")
    .map((v) => v.trim().toUpperCase())
    .filter((v): v is OrderStatus => set.has(v));
}

function parsePageParam(raw: string | null): number {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : 1;
}

// useSearchParams() must sit under a Suspense boundary for static prerender.
export default function OrdersPage() {
  return (
    <Suspense fallback={null}>
      <OrdersPageContent />
    </Suspense>
  );
}

function OrdersPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userName] = useState(
    () => getStoredProfileName() || "Stephan Macroski",
  );

  const urlSearch = searchParams.get("search") ?? "";
  const urlStatuses = useMemo(
    () => parseStatusesParam(searchParams.get("status")),
    [searchParams],
  );
  const urlPage = parsePageParam(searchParams.get("page"));

  // Local `searchInput` mirrors the URL param but responds instantly to typing;
  // the debounced value is what actually gets pushed to the URL / API.
  const [searchInput, setSearchInput] = useState(urlSearch);
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [total, setTotal] = useState(0);

  const [resumingOrderNumber, setResumingOrderNumber] = useState<number | null>(
    null,
  );
  const [cancellingOrderNumber, setCancellingOrderNumber] = useState<
    number | null
  >(null);
  const [activePayment, setActivePayment] = useState<OpenPayment | null>(null);

  const setQuery = useCallback(
    (patch: {
      page?: number;
      search?: string;
      statuses?: OrderStatus[];
    }) => {
      const next = new URLSearchParams(searchParams.toString());

      if (patch.search !== undefined) {
        if (patch.search) next.set("search", patch.search);
        else next.delete("search");
      }
      if (patch.statuses !== undefined) {
        if (patch.statuses.length > 0) next.set("status", patch.statuses.join(","));
        else next.delete("status");
      }
      if (patch.page !== undefined) {
        if (patch.page > 1) next.set("page", String(patch.page));
        else next.delete("page");
      }

      const qs = next.toString();
      router.replace(qs ? `?${qs}` : "?", { scroll: false });
    },
    [router, searchParams],
  );

  const loadOrders = useCallback(
    async (page: number, statuses: OrderStatus[], search: string) => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchOrders({
          page,
          limit: PAGE_SIZE,
          status: statuses,
          search,
        });
        setOrders(response.items);
        setTotal(response.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
        setOrders([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadOrders(urlPage, urlStatuses, urlSearch);
  }, [urlPage, urlStatuses, urlSearch, loadOrders]);

  // Debounce search input -> URL. Skips push when the value already matches.
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (searchInput === urlSearch) return;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setQuery({ search: searchInput, page: 1 });
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [searchInput, urlSearch, setQuery]);

  const toggleStatus = (status: OrderStatus) => {
    const next = urlStatuses.includes(status)
      ? urlStatuses.filter((s) => s !== status)
      : [...urlStatuses, status];
    setQuery({ statuses: next, page: 1 });
  };

  const clearFilters = () => {
    setSearchInput("");
    setQuery({ search: "", statuses: [], page: 1 });
  };

  const handleResumePayment = async (orderNumber: number) => {
    setNotice("");
    setError("");
    setResumingOrderNumber(orderNumber);
    try {
      const current = await fetchCurrentPayment();
      if (!current) {
        setNotice(
          "This payment has already been submitted and is under review.",
        );
        await loadOrders(urlPage, urlStatuses, urlSearch);
        return;
      }
      if (current.orderNumber !== orderNumber) {
        // Stale state — clicked order isn't the one with the open payment.
        setError(
          `The open payment is for order #${current.orderNumber}, not #${orderNumber}. Please refresh and try again.`,
        );
        await loadOrders(urlPage, urlStatuses, urlSearch);
        return;
      }
      setActivePayment(current);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load payment details",
      );
    } finally {
      setResumingOrderNumber(null);
    }
  };

  // Read-only payment details (e.g. Bitcoin order under review):
  // current-payment no longer returns it, so build the view from the
  // order data already in the list (crypto is included by the API).
  const handleViewPayment = (order: Order) => {
    const view = openPaymentFromOrder(order);
    if (view) setActivePayment(view);
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
      await loadOrders(urlPage, urlStatuses, urlSearch);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel the order",
      );
    } finally {
      setCancellingOrderNumber(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasActiveFilters =
    urlSearch.trim() !== "" || urlStatuses.length > 0;

  return (
    <RequireAuth>
      <div className="min-h-screen bg-pr_dg text-pr_dg">
        <div className="w-full px-4 pb-0 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
          <div className="pt-[120px]">
            <UserHeader activeTab="orders" userName={userName} />

            <div className="mt-4 grid gap-6 lg:grid-cols-[260px_1fr]">
              {/* Filter sidebar */}
              <div className="flex h-fit flex-col gap-4 rounded-2xl bg-pr_w p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-pr_dg/60">
                    Search
                  </p>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Order number..."
                    className="mt-2 w-full rounded-full border border-pr_dg/20 bg-transparent px-4 py-2 text-sm outline-none focus:border-pr_dg"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-pr_dg/60">
                    Status
                  </p>
                  <div className="mt-2 flex flex-col gap-2">
                    {ORDER_STATUSES.map((status) => {
                      const checked = urlStatuses.includes(status);
                      return (
                        <label
                          key={status}
                          className={`flex cursor-pointer items-center justify-between rounded-full px-4 py-2 text-sm transition ${
                            checked
                              ? "bg-pr_dg text-pr_w"
                              : "border border-pr_dg/20 text-pr_dg"
                          }`}
                        >
                          <span>{STATUS_LABEL[status]}</span>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={checked}
                            onChange={() => toggleStatus(status)}
                          />
                          {checked ? <span>✓</span> : null}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="rounded-full border border-pr_dg/30 px-4 py-2 text-xs text-pr_dg"
                  >
                    Clear filters
                  </button>
                ) : null}
              </div>

              {/* Orders list */}
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
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <OrderCard
                      key={order.orderNumber}
                      order={order}
                      onResumePayment={handleResumePayment}
                      onCancel={handleCancelOrder}
                      onViewPayment={handleViewPayment}
                      resuming={resumingOrderNumber === order.orderNumber}
                      cancelling={cancellingOrderNumber === order.orderNumber}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-start gap-3 rounded-2xl bg-pr_w p-6 text-sm text-pr_dg/70">
                    <p>
                      {hasActiveFilters
                        ? "No orders match your filters."
                        : "You don't have any orders yet."}
                    </p>
                    {hasActiveFilters ? (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="rounded-full border border-pr_dg/30 px-4 py-2 text-xs text-pr_dg"
                      >
                        Clear filters
                      </button>
                    ) : null}
                  </div>
                )}

                {totalPages > 1 ? (
                  <div className="flex items-center justify-center gap-4 pb-6">
                    <button
                      type="button"
                      onClick={() =>
                        setQuery({ page: Math.max(1, urlPage - 1) })
                      }
                      disabled={urlPage <= 1 || loading}
                      className="rounded-full border border-pr_w/40 px-4 py-2 text-xs text-pr_w disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span className="text-xs text-pr_w/80">
                      Page {urlPage} of {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuery({ page: Math.min(totalPages, urlPage + 1) })
                      }
                      disabled={urlPage >= totalPages || loading}
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

        <OpenPaymentModal
          payment={activePayment}
          isOpen={activePayment !== null}
          onClose={() => setActivePayment(null)}
          onUpdated={() => {
            loadOrders(urlPage, urlStatuses, urlSearch);
          }}
        />
      </div>
    </RequireAuth>
  );
}
