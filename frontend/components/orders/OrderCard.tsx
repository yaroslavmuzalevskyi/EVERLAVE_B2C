import { Order, PAYMENT_STATUS } from "@/services/orders";
import { formatPrice } from "@/services/products";

type OrderCardProps = {
  order: Order;
  onResumePayment?: (orderNumber: number) => void;
  onCancel?: (orderNumber: number) => void;
  resuming?: boolean;
  cancelling?: boolean;
};

/** Render any status code generically: UNDER_REVIEW -> "Under review". */
const prettyStatus = (status: string) => {
  const words = status.replace(/_/g, " ").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

const paymentBadgeClass = (status: string) => {
  switch (status) {
    case PAYMENT_STATUS.PENDING:
      return "border-amber-400 text-amber-700";
    case PAYMENT_STATUS.UNDER_REVIEW:
      return "border-blue-400 text-blue-700";
    case PAYMENT_STATUS.CANCELLED:
      return "border-pr_dg/30 text-pr_dg/50";
    default:
      return "border-pr_dg/30 text-pr_dg";
  }
};

const formatDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function OrderCard({
  order,
  onResumePayment,
  onCancel,
  resuming,
  cancelling,
}: OrderCardProps) {
  const payment = order.payment ?? null;
  const tracking = order.tracking ?? null;
  const proof = payment?.proof ?? null;

  const totalQty = order.items.reduce((sum, item) => sum + item.qty, 0);
  const firstItem = order.items[0];
  const productLabel =
    order.items.length > 1
      ? `${firstItem?.productName ?? "Order"} + ${order.items.length - 1} more`
      : (firstItem?.productName ?? "Order");

  const paymentIsPending = payment?.status === PAYMENT_STATUS.PENDING;
  // Cancel is forbidden once the payment is UNDER_REVIEW, so a rejected
  // proof (PENDING with a proof present) is still cancellable.
  const canCancel = paymentIsPending;
  const proofRejected = paymentIsPending && Boolean(proof);

  const createdLabel = formatDate(order.createdAt);
  const shippedLabel = formatDate(tracking?.shippedAt);
  const deliveredLabel = formatDate(tracking?.deliveredAt);

  return (
    <div className="w-full rounded-2xl bg-pr_w px-6 py-5 text-pr_dg shadow-sm">
      {proofRejected ? (
        <div className="mb-4 rounded-xl border border-pr_dr/40 bg-pr_dr/5 px-4 py-3 text-xs text-pr_dg">
          <p className="font-semibold text-pr_dr">
            Previous proof of payment was rejected
          </p>
          <p className="mt-1">
            {proof?.reviewNote?.trim()
              ? proof.reviewNote
              : "Please upload a valid proof of payment to continue."}
          </p>
          {proof?.originalName ? (
            <p className="mt-1 text-pr_dg/60">
              Rejected file: {proof.originalName}
              {formatDate(proof.createdAt)
                ? ` (${formatDate(proof.createdAt)})`
                : ""}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs text-pr_dg/60">Order number</p>
          <p className="text-lg font-semibold">#{order.orderNumber}</p>
          {createdLabel ? (
            <p className="mt-0.5 text-xs text-pr_dg/50">
              Placed {createdLabel}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-pr_dg/30 px-4 py-2 text-xs">
            {prettyStatus(order.status)}
          </span>
          {payment ? (
            <span
              className={`rounded-full border px-4 py-2 text-xs font-medium ${paymentBadgeClass(payment.status)}`}
            >
              Payment: {prettyStatus(payment.status)}
            </span>
          ) : null}
          {paymentIsPending && onResumePayment ? (
            <button
              type="button"
              onClick={() => onResumePayment(order.orderNumber)}
              disabled={resuming || cancelling}
              className="rounded-full bg-pr_dg px-4 py-2 text-xs text-pr_w disabled:opacity-60"
            >
              {resuming
                ? "Loading..."
                : proofRejected
                  ? "Upload new proof"
                  : "Complete payment"}
            </button>
          ) : null}
          {canCancel && onCancel ? (
            <button
              type="button"
              onClick={() => onCancel(order.orderNumber)}
              disabled={cancelling || resuming}
              className="rounded-full border border-pr_dr px-4 py-2 text-xs text-pr_dr disabled:opacity-60"
            >
              {cancelling ? "Cancelling..." : "Cancel order"}
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-semibold">Product</p>
          <p className="mt-1 text-sm text-pr_dg/80">{productLabel}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Quantity</p>
          <p className="mt-1 text-sm text-pr_dg/80">{totalQty} pieces</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Shipping</p>
          <p className="mt-1 text-sm text-pr_dg/80">
            {order.shipping
              ? `${order.shipping.displayName ?? "Shipping"} — ${formatPrice(order.shipping.amountCents, order.currency)}`
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Total</p>
          <p className="mt-1 text-sm text-pr_dg/80">
            {formatPrice(order.totalAmountCents, order.currency)}
          </p>
        </div>
      </div>

      {payment?.reference || proof ? (
        <div className="mt-4 rounded-xl bg-pr_dg/5 px-4 py-3 text-xs text-pr_dg/80">
          {payment?.reference ? (
            <p>
              <span className="font-semibold">Payment reference:</span>{" "}
              <span className="font-mono">{payment.reference}</span>
            </p>
          ) : null}
          {proof ? (
            <p className="mt-1">
              <span className="font-semibold">Proof:</span>{" "}
              {proof.originalName ?? "uploaded"}
              {formatDate(proof.createdAt)
                ? ` (${formatDate(proof.createdAt)})`
                : ""}
            </p>
          ) : null}
          {proof?.reviewNote ? (
            <p className="mt-1">
              <span className="font-semibold">Review note:</span>{" "}
              {proof.reviewNote}
            </p>
          ) : null}
        </div>
      ) : null}

      {tracking?.trackingNumber || shippedLabel || deliveredLabel ? (
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-pr_dg/70">
          {tracking?.trackingNumber ? (
            <span>
              <span className="font-semibold">Tracking:</span>{" "}
              {tracking.trackingUrl ? (
                <a
                  href={tracking.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {tracking.trackingNumber}
                </a>
              ) : (
                tracking.trackingNumber
              )}
              {tracking.carrier ? ` (${tracking.carrier})` : ""}
            </span>
          ) : null}
          {shippedLabel ? <span>Shipped {shippedLabel}</span> : null}
          {deliveredLabel ? <span>Delivered {deliveredLabel}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
