"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ADMIN_ORDER_STATUSES,
  ADMIN_PAYMENT_METHODS,
  ADMIN_PAYMENT_STATUSES,
  AdminOrderListItem,
  AdminOrderStatus,
  AdminPaymentMethod,
  AdminPaymentStatus,
  fetchAdminOrders,
} from "@/services/adminOrders";
import { formatPrice } from "@/services/products";
import CopyValue from "@/components/orders/CopyValue";
import { shortenAddress, shortenTxHash } from "@/lib/bitcoinPayment";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

const ORDER_STATUS_LABEL: Record<AdminOrderStatus, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

const PAYMENT_STATUS_LABEL: Record<AdminPaymentStatus, string> = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under review",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

function parseEnumList<T extends string>(
  raw: string | null,
  allowed: readonly T[],
): T[] {
  if (!raw) return [];
  const set = new Set<string>(allowed);
  return raw
    .split(",")
    .map((v) => v.trim().toUpperCase())
    .filter((v): v is T => set.has(v));
}

function parsePage(raw: string | null) {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : 1;
}

function orderStatusBadgeClass(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-amber-500/20 text-amber-300";
    case "PAID":
      return "bg-emerald-500/20 text-emerald-300";
    case "SHIPPED":
      return "bg-blue-500/20 text-blue-300";
    case "DELIVERED":
    case "COMPLETED":
      return "bg-green-500/20 text-green-300";
    case "CANCELLED":
      return "bg-pr_w/10 text-pr_w/60";
    case "REFUNDED":
      return "bg-purple-500/20 text-purple-300";
    default:
      return "bg-pr_w/10 text-pr_w/70";
  }
}

function paymentStatusBadgeClass(status: string) {
  switch (status) {
    case "PENDING":
      return "border border-amber-400/40 text-amber-300";
    case "UNDER_REVIEW":
      return "border border-blue-400/40 text-blue-300";
    case "CONFIRMED":
      return "border border-emerald-400/40 text-emerald-300";
    case "CANCELLED":
      return "border border-pr_w/15 text-pr_w/50";
    case "REFUNDED":
      return "border border-purple-400/40 text-purple-300";
    default:
      return "border border-pr_w/15 text-pr_w/70";
  }
}

/** Visually distinguish payment methods at a glance. */
function paymentMethodBadge(method: string) {
  if (method === "BITCOIN") {
    return {
      label: "₿ Bitcoin",
      className: "bg-orange-500/20 text-orange-300",
    };
  }
  return {
    label: "Bank",
    className: "bg-pr_w/10 text-pr_w/70",
  };
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get("search") ?? "";
  const urlOrderStatuses = useMemo(
    () =>
      parseEnumList<AdminOrderStatus>(
        searchParams.get("orderStatus"),
        ADMIN_ORDER_STATUSES,
      ),
    [searchParams],
  );
  const urlPaymentStatuses = useMemo(
    () =>
      parseEnumList<AdminPaymentStatus>(
        searchParams.get("paymentStatus"),
        ADMIN_PAYMENT_STATUSES,
      ),
    [searchParams],
  );
  const urlPaymentMethod =
    (searchParams.get("paymentMethod") as AdminPaymentMethod | null) || "";
  const urlDateFrom = searchParams.get("dateFrom") ?? "";
  const urlDateTo = searchParams.get("dateTo") ?? "";
  const urlPage = parsePage(searchParams.get("page"));

  const [searchInput, setSearchInput] = useState(urlSearch);
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  const [orders, setOrders] = useState<AdminOrderListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const setQuery = useCallback(
    (patch: {
      page?: number;
      search?: string;
      orderStatus?: AdminOrderStatus[];
      paymentStatus?: AdminPaymentStatus[];
      paymentMethod?: string;
      dateFrom?: string;
      dateTo?: string;
    }) => {
      const next = new URLSearchParams(searchParams.toString());
      const setOrDelete = (key: string, value?: string) => {
        if (value) next.set(key, value);
        else next.delete(key);
      };

      if (patch.search !== undefined) setOrDelete("search", patch.search);
      if (patch.orderStatus !== undefined)
        setOrDelete("orderStatus", patch.orderStatus.join(","));
      if (patch.paymentStatus !== undefined)
        setOrDelete("paymentStatus", patch.paymentStatus.join(","));
      if (patch.paymentMethod !== undefined)
        setOrDelete("paymentMethod", patch.paymentMethod);
      if (patch.dateFrom !== undefined) setOrDelete("dateFrom", patch.dateFrom);
      if (patch.dateTo !== undefined) setOrDelete("dateTo", patch.dateTo);
      if (patch.page !== undefined)
        setOrDelete("page", patch.page > 1 ? String(patch.page) : "");

      router.replace(`?${next.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchAdminOrders({
        page: urlPage,
        limit: PAGE_SIZE,
        search: urlSearch,
        orderStatus: urlOrderStatuses,
        paymentStatus: urlPaymentStatuses,
        paymentMethod: urlPaymentMethod || undefined,
        dateFrom: urlDateFrom || undefined,
        dateTo: urlDateTo || undefined,
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
  }, [
    urlPage,
    urlSearch,
    urlOrderStatuses,
    urlPaymentStatuses,
    urlPaymentMethod,
    urlDateFrom,
    urlDateTo,
  ]);

  useEffect(() => {
    load();
  }, [load]);

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

  const toggle = <T extends string>(current: T[], value: T): T[] =>
    current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const hasFilters =
    urlSearch !== "" ||
    urlOrderStatuses.length > 0 ||
    urlPaymentStatuses.length > 0 ||
    urlPaymentMethod !== "" ||
    urlDateFrom !== "" ||
    urlDateTo !== "";

  const clearFilters = () => {
    setSearchInput("");
    router.replace("?", { scroll: false });
  };

  const chipClass = (active: boolean) =>
    `rounded-full px-3 py-1 text-xs transition ${
      active
        ? "bg-pr_lg text-pr_dg font-semibold"
        : "border border-pr_w/20 text-pr_w/70 hover:text-pr_w"
    }`;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Orders ({total})</h1>
      </div>

      {/* Filter bar */}
      <div className="mt-6 space-y-4 rounded-2xl border border-pr_w/10 bg-pr_w/5 p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[220px]">
            <label className="text-xs text-pr_w/60">Search</label>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Order #, customer email/name, or reference"
              className="mt-1 w-full rounded-full border border-pr_w/20 bg-transparent px-4 py-2 text-sm outline-none focus:border-pr_w"
            />
          </div>
          <div>
            <label className="text-xs text-pr_w/60">From</label>
            <input
              type="date"
              value={urlDateFrom.slice(0, 10)}
              onChange={(e) => {
                const v = e.target.value;
                setQuery({
                  dateFrom: v ? new Date(v).toISOString() : "",
                  page: 1,
                });
              }}
              className="mt-1 rounded-full border border-pr_w/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-pr_w"
            />
          </div>
          <div>
            <label className="text-xs text-pr_w/60">To</label>
            <input
              type="date"
              value={urlDateTo.slice(0, 10)}
              onChange={(e) => {
                const v = e.target.value;
                setQuery({
                  dateTo: v
                    ? new Date(`${v}T23:59:59.999Z`).toISOString()
                    : "",
                  page: 1,
                });
              }}
              className="mt-1 rounded-full border border-pr_w/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-pr_w"
            />
          </div>
          <div>
            <label className="text-xs text-pr_w/60">Payment method</label>
            <select
              value={urlPaymentMethod}
              onChange={(e) => setQuery({ paymentMethod: e.target.value, page: 1 })}
              className="mt-1 rounded-full border border-pr_w/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-pr_w"
            >
              <option value="" className="bg-pr_dg">
                Any
              </option>
              {ADMIN_PAYMENT_METHODS.map((m) => (
                <option key={m} value={m} className="bg-pr_dg">
                  {m.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-full border border-pr_w/20 px-3 py-2 text-xs text-pr_w/70 hover:text-pr_w"
            >
              Clear filters
            </button>
          ) : null}
        </div>

        <div>
          <p className="text-xs text-pr_w/60">Order status</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ADMIN_ORDER_STATUSES.map((s) => {
              const active = urlOrderStatuses.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    setQuery({
                      orderStatus: toggle(urlOrderStatuses, s),
                      page: 1,
                    })
                  }
                  className={chipClass(active)}
                >
                  {ORDER_STATUS_LABEL[s]}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs text-pr_w/60">Payment status</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ADMIN_PAYMENT_STATUSES.map((s) => {
              const active = urlPaymentStatuses.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    setQuery({
                      paymentStatus: toggle(urlPaymentStatuses, s),
                      page: 1,
                    })
                  }
                  className={chipClass(active)}
                >
                  {PAYMENT_STATUS_LABEL[s]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Errors */}
      {error ? <p className="mt-4 text-sm text-pr_dr">{error}</p> : null}

      {/* Table */}
      {loading ? (
        <p className="mt-6 text-sm text-pr_w/60">Loading...</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pr_w/10 text-left text-pr_w/60">
                <th className="pb-3 pr-4">Order #</th>
                <th className="pb-3 pr-4">Created</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Total</th>
                <th className="pb-3 pr-4">Order</th>
                <th className="pb-3 pr-4">Payment</th>
                <th className="pb-3">Proof</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-pr_w/60">
                    {hasFilters
                      ? "No orders match these filters. "
                      : "No orders yet."}
                    {hasFilters ? (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="underline"
                      >
                        Clear filters
                      </button>
                    ) : null}
                  </td>
                </tr>
              ) : null}
              {orders.map((order) => {
                const detailHref = `/admin/orders/detail?orderNumber=${order.orderNumber}`;
                return (
                <tr
                  key={order.orderNumber}
                  onClick={(event) => {
                    // Ignore clicks on interactive children (links, buttons) and
                    // text selections so the row navigation stays unobtrusive.
                    if (
                      (event.target as HTMLElement).closest("a,button") ||
                      window.getSelection()?.toString()
                    ) {
                      return;
                    }
                    router.push(detailHref);
                  }}
                  className="cursor-pointer border-b border-pr_w/5 align-top transition-colors hover:bg-pr_w/5"
                >
                  <td className="py-3 pr-4">
                    <Link
                      href={detailHref}
                      className="font-medium hover:underline"
                    >
                      #{order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-pr_w/70">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3 pr-4">
                    <p className="font-medium">{order.customer?.name}</p>
                    <p className="text-xs text-pr_w/60">
                      {order.customer?.email}
                    </p>
                  </td>
                  <td className="py-3 pr-4">
                    {formatPrice(
                      order.totals.totalAmountCents,
                      order.totals.currency,
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${orderStatusBadgeClass(order.status)}`}
                    >
                      {ORDER_STATUS_LABEL[order.status as AdminOrderStatus] ??
                        order.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {order.payment ? (
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {(() => {
                            const badge = paymentMethodBadge(
                              order.payment.method,
                            );
                            return (
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${badge.className}`}
                              >
                                {badge.label}
                              </span>
                            );
                          })()}
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${paymentStatusBadgeClass(order.payment.status)}`}
                          >
                            {PAYMENT_STATUS_LABEL[
                              order.payment.status as AdminPaymentStatus
                            ] ?? order.payment.status}
                          </span>
                        </div>
                        {order.payment.crypto ? (
                          <div className="space-y-0.5 text-xs text-pr_w/70">
                            <p className="font-mono">
                              {order.payment.crypto.amountBtc}{" "}
                              {order.payment.crypto.asset ?? "BTC"}
                            </p>
                            <CopyValue
                              value={order.payment.crypto.address}
                              display={shortenAddress(
                                order.payment.crypto.address,
                              )}
                              label="Copy Bitcoin address"
                              className="text-xs"
                            />
                            {order.payment.crypto.txHash ? (
                              <div>
                                <span className="text-pr_w/40">tx </span>
                                <CopyValue
                                  value={order.payment.crypto.txHash}
                                  display={shortenTxHash(
                                    order.payment.crypto.txHash,
                                  )}
                                  label="Copy transaction ID"
                                  className="text-xs"
                                />
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-xs text-pr_w/40">—</span>
                    )}
                  </td>
                  <td className="py-3">
                    {(order.payment?.proofCount ?? 0) > 0 ? (
                      <span className="text-xs text-pr_w/70">
                        {order.payment!.proofCount} file
                        {order.payment!.proofCount > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-xs text-pr_w/40">—</span>
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>

          {totalPages > 1 ? (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={urlPage <= 1}
                onClick={() => setQuery({ page: Math.max(1, urlPage - 1) })}
                className="rounded-full border border-pr_w/20 px-3 py-1 text-xs disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-xs text-pr_w/60">
                {urlPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={urlPage >= totalPages}
                onClick={() =>
                  setQuery({ page: Math.min(totalPages, urlPage + 1) })
                }
                className="rounded-full border border-pr_w/20 px-3 py-1 text-xs disabled:opacity-40"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
