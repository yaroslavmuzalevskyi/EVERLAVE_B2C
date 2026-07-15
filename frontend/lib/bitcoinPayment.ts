import { CryptoPayment, PAYMENT_STATUS } from "@/services/orders";

export function isCryptoExpired(
  expiresAt: string | null | undefined,
  now: number = Date.now(),
): boolean {
  if (!expiresAt) return false;
  const expiry = new Date(expiresAt).getTime();
  if (Number.isNaN(expiry)) return false;
  return now >= expiry;
}

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

export function shortenMiddle(value: string, head = 10, tail = 8): string {
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

export const shortenAddress = (address: string) =>
  shortenMiddle(address, 10, 8);
export const shortenTxHash = (txHash: string) => shortenMiddle(txHash, 8, 6);

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
  label: string;
  tone: "amber" | "red" | "blue" | "green" | "muted";
  isFinal: boolean;
  canConfirm: boolean;
  canContinue: boolean;
  cancelRecommended: boolean;
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

export function deriveBitcoinOrderState(
  input: BitcoinStateInput,
  now: number = Date.now(),
): BitcoinOrderState {
  const { orderStatus, paymentStatus, crypto } = input;

  if (orderStatus === "REFUNDED" || paymentStatus === PAYMENT_STATUS.REFUNDED) {
    return finalState("REFUNDED", "Bitcoin payment refunded", "muted");
  }
  if (
    orderStatus === "CANCELLED" ||
    paymentStatus === PAYMENT_STATUS.CANCELLED
  ) {
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

  return finalState("UNKNOWN", "Order status requires attention", "muted");
}
