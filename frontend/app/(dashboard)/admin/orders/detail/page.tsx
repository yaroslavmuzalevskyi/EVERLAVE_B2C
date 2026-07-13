"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ADMIN_ORDER_STATUSES,
  ADMIN_PAYMENT_STATUSES,
  AdminOrderDetail,
  AdminOrderStatus,
  AdminPaymentStatus,
  AdminTrackingUpdate,
  fetchAdminOrder,
  fetchAdminPaymentProofBlobUrl,
  updateAdminOrderPayment,
  updateAdminOrderStatus,
  updateAdminOrderTracking,
  updateAdminPaymentProofNote,
} from "@/services/adminOrders";
import { formatPrice } from "@/services/products";

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

function formatDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatBytes(n: number | null | undefined) {
  if (!n) return "";
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  if (n >= 1024) return `${Math.round(n / 1024)} KB`;
  return `${n} B`;
}

function toDatetimeLocal(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(value: string) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export default function AdminOrderDetailPage() {
  const searchParams = useSearchParams();
  const orderNumberParam = searchParams.get("orderNumber");
  const orderNumber = orderNumberParam ? Number(orderNumberParam) : NaN;

  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [success, setSuccess] = useState("");

  // Tracking form
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [shippedAt, setShippedAt] = useState("");
  const [deliveredAt, setDeliveredAt] = useState("");
  const [completedAt, setCompletedAt] = useState("");

  // Proof review
  const [reviewNote, setReviewNote] = useState("");
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [proofMime, setProofMime] = useState<string | null>(null);
  const [proofError, setProofError] = useState("");

  const hydrate = useCallback((data: AdminOrderDetail) => {
    setOrder(data);
    setTrackingNumber(data.tracking.trackingNumber ?? "");
    setCarrier(data.tracking.carrier ?? "");
    setTrackingUrl(data.tracking.trackingUrl ?? "");
    setShippedAt(toDatetimeLocal(data.tracking.shippedAt));
    setDeliveredAt(toDatetimeLocal(data.tracking.deliveredAt));
    setCompletedAt(toDatetimeLocal(data.tracking.completedAt));
    setReviewNote(data.payment.proof?.reviewNote ?? "");
  }, []);

  const load = useCallback(async () => {
    if (!Number.isFinite(orderNumber)) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminOrder(orderNumber);
      hydrate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [orderNumber, hydrate]);

  useEffect(() => {
    load();
  }, [load]);

  // Revoke any object URL we've created for the proof preview.
  useEffect(() => {
    return () => {
      if (proofUrl) URL.revokeObjectURL(proofUrl);
    };
  }, [proofUrl]);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    window.setTimeout(() => setSuccess(""), 4000);
  };

  const handleUpdateStatus = async (status: AdminOrderStatus) => {
    if (!order) return;
    setBusy("status");
    setError("");
    try {
      const fresh = await updateAdminOrderStatus(order.orderNumber, status);
      hydrate(fresh);
      showSuccess(`Order status set to ${ORDER_STATUS_LABEL[status]}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setBusy(null);
    }
  };

  const handleUpdatePayment = async (status: AdminPaymentStatus) => {
    if (!order) return;
    setBusy("payment");
    setError("");
    try {
      const fresh = await updateAdminOrderPayment(order.orderNumber, status);
      hydrate(fresh);
      showSuccess(`Payment set to ${PAYMENT_STATUS_LABEL[status]}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update payment");
    } finally {
      setBusy(null);
    }
  };

  const handleSaveTracking = async () => {
    if (!order) return;
    setBusy("tracking");
    setError("");
    try {
      const payload: AdminTrackingUpdate = {
        trackingNumber: trackingNumber.trim() || null,
        carrier: carrier.trim() || null,
        trackingUrl: trackingUrl.trim() || null,
        shippedAt: fromDatetimeLocal(shippedAt),
        deliveredAt: fromDatetimeLocal(deliveredAt),
        completedAt: fromDatetimeLocal(completedAt),
      };
      const fresh = await updateAdminOrderTracking(order.orderNumber, payload);
      hydrate(fresh);
      showSuccess("Tracking updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update tracking");
    } finally {
      setBusy(null);
    }
  };

  const handleSaveNote = async () => {
    if (!order) return;
    setBusy("note");
    setError("");
    try {
      const note = reviewNote.trim();
      await updateAdminPaymentProofNote(order.orderNumber, note || null);
      await load();
      showSuccess("Review note saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save note");
    } finally {
      setBusy(null);
    }
  };

  const handleLoadProof = async () => {
    if (!order) return;
    setProofError("");
    try {
      const { url, mimeType } = await fetchAdminPaymentProofBlobUrl(
        order.orderNumber,
      );
      if (proofUrl) URL.revokeObjectURL(proofUrl);
      setProofUrl(url);
      setProofMime(mimeType);
    } catch (err) {
      setProofError(
        err instanceof Error ? err.message : "Failed to load proof file",
      );
    }
  };

  if (!orderNumberParam || Number.isNaN(orderNumber)) {
    return (
      <p className="text-sm text-pr_w/60">
        Missing order number.{" "}
        <Link href="/admin/orders" className="underline">
          Back to orders
        </Link>
      </p>
    );
  }

  if (loading) return <p className="text-sm text-pr_w/60">Loading...</p>;

  if (!order) {
    return (
      <p className="text-sm text-pr_w/60">
        {error || "Order not found."}{" "}
        <Link href="/admin/orders" className="underline">
          Back
        </Link>
      </p>
    );
  }

  const proof = order.payment.proof;
  const inputCls =
    "w-full rounded-lg border border-pr_w/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-pr_w";
  const smallInputCls =
    "w-full rounded-md border border-pr_w/15 bg-transparent px-2 py-1.5 text-xs outline-none focus:border-pr_w/50";

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="text-xs text-pr_w/60 hover:text-pr_w"
          >
            ← Back to orders
          </Link>
          <h1 className="mt-1 text-2xl font-semibold">
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-pr_w/50">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full bg-pr_w/10 px-3 py-1">
            {ORDER_STATUS_LABEL[order.status as AdminOrderStatus] ??
              order.status}
          </span>
          <span className="rounded-full border border-pr_w/20 px-3 py-1">
            Payment:{" "}
            {PAYMENT_STATUS_LABEL[order.payment.status as AdminPaymentStatus] ??
              order.payment.status}
          </span>
        </div>
      </div>

      {error ? <p className="text-sm text-pr_dr">{error}</p> : null}
      {success ? <p className="text-sm text-green-400">{success}</p> : null}

      {/* Customer + address */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-pr_w/10 bg-pr_w/[0.03] p-5">
          <h2 className="text-sm font-semibold text-pr_w/80">Customer</h2>
          <p className="mt-2 text-sm font-medium">{order.customer.name}</p>
          <p className="text-sm text-pr_w/70">{order.customer.email}</p>
          {order.customer.referenceGroup ? (
            <p className="mt-1 text-xs text-pr_w/50">
              Reference group: {order.customer.referenceGroup}
            </p>
          ) : null}
        </section>
        <section className="rounded-2xl border border-pr_w/10 bg-pr_w/[0.03] p-5">
          <h2 className="text-sm font-semibold text-pr_w/80">Shipping address</h2>
          <p className="mt-2 text-sm">{order.address.fullName}</p>
          <p className="text-sm text-pr_w/70">
            {order.address.line1}
            {order.address.line2 ? `, ${order.address.line2}` : ""}
          </p>
          <p className="text-sm text-pr_w/70">
            {order.address.postalCode} {order.address.city},{" "}
            {order.address.country}
          </p>
          {order.address.phone ? (
            <p className="mt-1 text-xs text-pr_w/50">{order.address.phone}</p>
          ) : null}
        </section>
      </div>

      {/* Items */}
      <section className="rounded-2xl border border-pr_w/10 bg-pr_w/[0.03] p-5">
        <h2 className="text-sm font-semibold text-pr_w/80">Items</h2>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b border-pr_w/10 text-left text-pr_w/60">
              <th className="pb-2 pr-4">Product</th>
              <th className="pb-2 pr-4">Qty</th>
              <th className="pb-2 pr-4">Unit price</th>
              <th className="pb-2">Line total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId + item.productName} className="border-b border-pr_w/5">
                <td className="py-2 pr-4">
                  <p>{item.productName}</p>
                  {item.slug ? (
                    <p className="text-xs text-pr_w/40">{item.slug}</p>
                  ) : null}
                </td>
                <td className="py-2 pr-4">{item.qty}</td>
                <td className="py-2 pr-4">
                  {formatPrice(item.unitPriceCents, order.totals.currency)}
                </td>
                <td className="py-2">
                  {formatPrice(item.lineTotalCents, order.totals.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 space-y-1 text-sm text-pr_w/80">
          <p className="flex justify-between">
            <span className="text-pr_w/60">Subtotal</span>
            <span>
              {formatPrice(
                order.totals.subtotalAmountCents,
                order.totals.currency,
              )}
            </span>
          </p>
          <p className="flex justify-between">
            <span className="text-pr_w/60">Shipping</span>
            <span>
              {formatPrice(
                order.totals.shippingAmountCents,
                order.totals.currency,
              )}
            </span>
          </p>
          <p className="flex justify-between font-semibold">
            <span>Total</span>
            <span>
              {formatPrice(order.totals.totalAmountCents, order.totals.currency)}
            </span>
          </p>
        </div>
      </section>

      {/* Order status controls */}
      <section className="rounded-2xl border border-pr_w/10 bg-pr_w/[0.03] p-5">
        <h2 className="text-sm font-semibold text-pr_w/80">Order status</h2>
        <p className="mt-1 text-xs text-pr_w/50">
          Setting to PAID also confirms the current payment.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ADMIN_ORDER_STATUSES.map((s) => {
            const active = order.status === s;
            return (
              <button
                key={s}
                type="button"
                disabled={busy === "status" || active}
                onClick={() => handleUpdateStatus(s)}
                className={`rounded-full px-3 py-1.5 text-xs transition ${
                  active
                    ? "bg-pr_lg text-pr_dg font-semibold"
                    : "border border-pr_w/20 text-pr_w/80 hover:text-pr_w disabled:opacity-40"
                }`}
              >
                {ORDER_STATUS_LABEL[s]}
              </button>
            );
          })}
        </div>
      </section>

      {/* Payment controls */}
      <section className="rounded-2xl border border-pr_w/10 bg-pr_w/[0.03] p-5">
        <h2 className="text-sm font-semibold text-pr_w/80">Payment</h2>
        <div className="mt-2 grid gap-4 md:grid-cols-2">
          <div className="text-sm text-pr_w/80">
            <p>
              <span className="text-pr_w/60">Method:</span> {order.payment.method}
            </p>
            <p>
              <span className="text-pr_w/60">Reference:</span>{" "}
              <span className="font-mono">{order.payment.reference ?? "—"}</span>
            </p>
            <p>
              <span className="text-pr_w/60">Amount:</span>{" "}
              {formatPrice(order.payment.amountCents, order.payment.currency)}
            </p>
            <p>
              <span className="text-pr_w/60">Confirmed at:</span>{" "}
              {formatDate(order.payment.confirmedAt)}
            </p>
            <p>
              <span className="text-pr_w/60">Proofs on record:</span>{" "}
              {order.payment.proofCount}
            </p>
          </div>
          {order.payment.bankTransfer ? (
            <div className="rounded-lg border border-pr_w/10 p-3 text-xs text-pr_w/70">
              <p className="mb-1 text-pr_w/60">Bank transfer target</p>
              <p>{order.payment.bankTransfer.accountHolder}</p>
              <p className="font-mono">{order.payment.bankTransfer.iban}</p>
              <p>
                {order.payment.bankTransfer.bic} ·{" "}
                {order.payment.bankTransfer.bankName}
              </p>
            </div>
          ) : null}
        </div>

        <p className="mt-4 text-xs text-pr_w/60">
          Confirming an UNDER_REVIEW payment also marks a PENDING order as PAID.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ADMIN_PAYMENT_STATUSES.map((s) => {
            const active = order.payment.status === s;
            return (
              <button
                key={s}
                type="button"
                disabled={busy === "payment" || active}
                onClick={() => handleUpdatePayment(s)}
                className={`rounded-full px-3 py-1.5 text-xs transition ${
                  active
                    ? "bg-pr_lg text-pr_dg font-semibold"
                    : "border border-pr_w/20 text-pr_w/80 hover:text-pr_w disabled:opacity-40"
                }`}
              >
                {PAYMENT_STATUS_LABEL[s]}
              </button>
            );
          })}
        </div>
      </section>

      {/* Payment proof */}
      <section className="rounded-2xl border border-pr_w/10 bg-pr_w/[0.03] p-5">
        <h2 className="text-sm font-semibold text-pr_w/80">Payment proof</h2>
        {proof ? (
          <div className="mt-2 grid gap-4 md:grid-cols-2">
            <div className="space-y-1 text-sm text-pr_w/80">
              <p>
                <span className="text-pr_w/60">File:</span>{" "}
                {proof.originalName ?? "—"}
              </p>
              <p>
                <span className="text-pr_w/60">Type:</span>{" "}
                {proof.mimeType ?? "—"}
              </p>
              <p>
                <span className="text-pr_w/60">Size:</span>{" "}
                {formatBytes(proof.sizeBytes)}
              </p>
              <p>
                <span className="text-pr_w/60">Uploaded:</span>{" "}
                {formatDate(proof.createdAt)}
              </p>
              <p>
                <span className="text-pr_w/60">Reviewed:</span>{" "}
                {formatDate(proof.reviewedAt)}
              </p>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleLoadProof}
                  className="rounded-full border border-pr_w/20 px-3 py-1.5 text-xs hover:text-pr_w"
                >
                  {proofUrl ? "Reload preview" : "Load preview"}
                </button>
                {proofError ? (
                  <p className="mt-2 text-xs text-pr_dr">{proofError}</p>
                ) : null}
              </div>
            </div>
            <div>
              {proofUrl ? (
                proofMime?.startsWith("image/") ? (
                  <img
                    src={proofUrl}
                    alt="Payment proof"
                    className="max-h-96 w-full rounded-lg border border-pr_w/10 object-contain"
                  />
                ) : (
                  <iframe
                    src={proofUrl}
                    className="h-96 w-full rounded-lg border border-pr_w/10"
                    title="Payment proof"
                  />
                )
              ) : (
                <p className="text-xs text-pr_w/40">
                  Preview loads on demand (the API doesn&apos;t expose a public
                  URL).
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-2 text-xs text-pr_w/40">
            No proof uploaded yet.
          </p>
        )}

        <div className="mt-4">
          <label className="text-xs text-pr_w/60">Review note</label>
          <textarea
            value={reviewNote}
            onChange={(e) => setReviewNote(e.target.value)}
            rows={3}
            placeholder="Reason for rejection, or matching notes"
            className={`mt-1 ${inputCls}`}
          />
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              disabled={busy === "note" || !proof}
              onClick={handleSaveNote}
              className="rounded-full bg-pr_lg px-4 py-2 text-xs font-semibold text-pr_dg disabled:opacity-50"
            >
              {busy === "note" ? "Saving..." : "Save note"}
            </button>
            <p className="text-xs text-pr_w/50">
              Clear the field and save to remove the note.
            </p>
          </div>
        </div>
      </section>

      {/* Tracking */}
      <section className="rounded-2xl border border-pr_w/10 bg-pr_w/[0.03] p-5">
        <h2 className="text-sm font-semibold text-pr_w/80">Tracking</h2>
        <p className="mt-1 text-xs text-pr_w/50">
          Setting a &quot;Shipped at&quot; date while the order is PENDING/PAID
          moves it to SHIPPED.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs text-pr_w/60">Tracking number</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className={`mt-1 ${smallInputCls}`}
            />
          </div>
          <div>
            <label className="text-xs text-pr_w/60">Carrier</label>
            <input
              type="text"
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className={`mt-1 ${smallInputCls}`}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-pr_w/60">Tracking URL</label>
            <input
              type="url"
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
              className={`mt-1 ${smallInputCls}`}
            />
          </div>
          <div>
            <label className="text-xs text-pr_w/60">Shipped at</label>
            <input
              type="datetime-local"
              value={shippedAt}
              onChange={(e) => setShippedAt(e.target.value)}
              className={`mt-1 ${smallInputCls}`}
            />
          </div>
          <div>
            <label className="text-xs text-pr_w/60">Delivered at</label>
            <input
              type="datetime-local"
              value={deliveredAt}
              onChange={(e) => setDeliveredAt(e.target.value)}
              className={`mt-1 ${smallInputCls}`}
            />
          </div>
          <div>
            <label className="text-xs text-pr_w/60">Completed at</label>
            <input
              type="datetime-local"
              value={completedAt}
              onChange={(e) => setCompletedAt(e.target.value)}
              className={`mt-1 ${smallInputCls}`}
            />
          </div>
        </div>
        <button
          type="button"
          disabled={busy === "tracking"}
          onClick={handleSaveTracking}
          className="mt-4 rounded-full bg-pr_lg px-5 py-2 text-xs font-semibold text-pr_dg disabled:opacity-50"
        >
          {busy === "tracking" ? "Saving..." : "Save tracking"}
        </button>
      </section>
    </div>
  );
}
