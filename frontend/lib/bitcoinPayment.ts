import { CryptoPayment, PAYMENT_STATUS } from "@/services/orders";

/**
 * Pure helpers for the customer-facing Bitcoin payment flow.
 * Everything here is deterministic (time is injectable) so it can be
 * unit-tested without a DOM.
 */

// --- Time helpers (all timestamps are UTC ISO strings from the API) ---

/** True when the invoice expiry has passed. Missing/invalid dates are never expired. */
export function isCryptoExpired(
  expiresAt: string | null | undefined,
  now: number = Date.now(),
): boolean {
  if (!expiresAt) return false;
  const expiry = new Date(expiresAt).getTime();
  if (Number.isNaN(expiry)) return false;
  return now >= expiry;
}

/** True when the customer clicked "I paid" after the invoice expired. */
export function isMarkedPaidLate(
  markedPaidAt: string | null | undefined,
  expiresAt: string | null | undefined,
): boolean {
  if (!markedPaidAt || !expiresAt) return false;
  const marked = new Date(markedPaidAt).getTime();
  const expiry = new Date(expiresAt).getTime();
  if (Number.isNaN(marked) || Number.isNaN(expiry)) return false;
  return marked > expiry;
}

// --- Display helpers ---

/**
 * Shorten a long value (address / txHash) keeping both ends visible:
 * "tb1qexampl…xxxxxxxx". Values short enough to show whole are returned
 * unchanged. Always copy the FULL value, never the shortened one.
 */
export function shortenMiddle(value: string, head = 10, tail = 8): string {
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

export const shortenAddress = (address: string) => shortenMiddle(address, 10, 8);
export const shortenTxHash = (txHash: string) => shortenMiddle(txHash, 8, 6);

// --- Derived Bitcoin order state ---

export type BitcoinStateKey =
  | "AWAITING_PAYMENT"
  | "INVOICE_EXPIRED"
  | "UNDER_REVIEW_ON_TIME"
  | "UNDER_REVIEW_LATE"
  | "UNDER_REVIEW"
  | "CONFIRMED_PROCESSING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED"
  | "UNKNOWN";

export type BitcoinOrderState = {
  key: BitcoinStateKey;
  /** Human-readable derived state, e.g. "Awaiting Bitcoin payment". */
  label: string;
  /** Badge tone for the derived state. */
  tone: "amber" | "red" | "blue" | "green" | "muted";
  /** Final states hide every payment action. */
  isFinal: boolean;
  /** "I paid" is available (payment still PENDING). */
  canConfirm: boolean;
  /** The invoice can still be opened ("Continue payment"). */
  canContinue: boolean;
  /** Expired PENDING invoice: recommend cancelling as the primary action. */
  cancelRecommended: boolean;
  /** Show the QR code — only while the payment is actionable. */
  showQr: boolean;
};

type BitcoinStateInput = {
  orderStatus: string;
  paymentStatus: string;
  crypto?: Pick<CryptoPayment, "expiresAt" | "markedPaidAt"> | null;
};

const finalState = (
  key: BitcoinStateKey,
  label: string,
  tone: BitcoinOrderState["tone"],
): BitcoinOrderState => ({
  key,
  label,
  tone,
  isFinal: true,
  canConfirm: false,
  canContinue: false,
  cancelRecommended: false,
  showQr: false,
});

/**
 * Single source of truth mapping order status + payment status (+ invoice
 * timing) to a customer-facing Bitcoin payment state. Never show
 * UNDER_REVIEW as paid/confirmed — the admin has not verified it yet.
 * Unknown combinations fall back to a safe state with all actions hidden.
 */
export function deriveBitcoinOrderState(
  input: BitcoinStateInput,
  now: number = Date.now(),
): BitcoinOrderState {
  const { orderStatus, paymentStatus, crypto } = input;

  if (orderStatus === "REFUNDED" || paymentStatus === PAYMENT_STATUS.REFUNDED) {
    return finalState("REFUNDED", "Bitcoin payment refunded", "muted");
  }
  if (orderStatus === "CANCELLED" || paymentStatus === PAYMENT_STATUS.CANCELLED) {
    return finalState(
      "CANCELLED",
      orderStatus === "CANCELLED" ? "Order cancelled" : "Payment cancelled",
      "muted",
    );
  }
  if (orderStatus === "COMPLETED") {
    return finalState("COMPLETED", "Completed", "green");
  }
  if (orderStatus === "DELIVERED") {
    return finalState("DELIVERED", "Delivered", "green");
  }
  if (orderStatus === "SHIPPED") {
    return finalState("SHIPPED", "Paid and shipped", "green");
  }
  if (orderStatus === "PAID") {
    return finalState("PAID", "Bitcoin payment confirmed", "green");
  }

  if (orderStatus === "PENDING") {
    if (paymentStatus === PAYMENT_STATUS.CONFIRMED) {
      return finalState(
        "CONFIRMED_PROCESSING",
        "Payment confirmed — order processing",
        "green",
      );
    }

    if (paymentStatus === PAYMENT_STATUS.UNDER_REVIEW) {
      const base = {
        tone: "blue" as const,
        isFinal: false,
        canConfirm: false,
        canContinue: false,
        cancelRecommended: false,
        showQr: false,
      };
      if (!crypto?.markedPaidAt) {
        return { ...base, key: "UNDER_REVIEW", label: "Payment under review" };
      }
      if (isMarkedPaidLate(crypto.markedPaidAt, crypto.expiresAt)) {
        return {
          ...base,
          key: "UNDER_REVIEW_LATE",
          label: "Payment under review — sent after expiry",
        };
      }
      return {
        ...base,
        key: "UNDER_REVIEW_ON_TIME",
        label: "Payment under review — sent on time",
      };
    }

    if (paymentStatus === PAYMENT_STATUS.PENDING) {
      if (isCryptoExpired(crypto?.expiresAt, now)) {
        return {
          key: "INVOICE_EXPIRED",
          label: "Payment invoice expired",
          tone: "red",
          isFinal: false,
          canConfirm: true,
          canContinue: true,
          cancelRecommended: true,
          showQr: true,
        };
      }
      return {
        key: "AWAITING_PAYMENT",
        label: "Awaiting Bitcoin payment",
        tone: "amber",
        isFinal: false,
        canConfirm: true,
        canContinue: true,
        cancelRecommended: false,
        showQr: true,
      };
    }
  }

  // Unknown combination: don't crash, don't offer risky actions — the raw
  // order/payment badges stay visible alongside this fallback label.
  return finalState("UNKNOWN", "Order status requires attention", "muted");
}
