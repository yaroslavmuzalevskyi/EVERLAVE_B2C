import { describe, expect, it } from "vitest";
import {
  deriveBitcoinOrderState,
  isCryptoExpired,
  isMarkedPaidLate,
  shortenAddress,
  shortenMiddle,
  shortenTxHash,
} from "@/lib/bitcoinPayment";

const NOW = new Date("2026-07-13T15:00:00.000Z").getTime();
const FUTURE = "2026-07-13T15:30:00.000Z";
const PAST = "2026-07-13T14:30:00.000Z";

describe("isCryptoExpired", () => {
  it("is not expired before expiresAt", () => {
    expect(isCryptoExpired(FUTURE, NOW)).toBe(false);
  });

  it("is expired at exactly expiresAt (Date.now() >= expiry)", () => {
    expect(isCryptoExpired("2026-07-13T15:00:00.000Z", NOW)).toBe(true);
  });

  it("is expired after expiresAt", () => {
    expect(isCryptoExpired(PAST, NOW)).toBe(true);
  });

  it("treats missing or invalid dates as not expired", () => {
    expect(isCryptoExpired(null, NOW)).toBe(false);
    expect(isCryptoExpired(undefined, NOW)).toBe(false);
    expect(isCryptoExpired("not-a-date", NOW)).toBe(false);
  });
});

describe("isMarkedPaidLate", () => {
  it("is on time when markedPaidAt <= expiresAt", () => {
    expect(isMarkedPaidLate(PAST, FUTURE)).toBe(false);
    expect(isMarkedPaidLate(FUTURE, FUTURE)).toBe(false);
  });

  it("is late when markedPaidAt > expiresAt", () => {
    expect(isMarkedPaidLate("2026-07-13T15:30:00.001Z", FUTURE)).toBe(true);
  });

  it("is never late without both timestamps", () => {
    expect(isMarkedPaidLate(null, FUTURE)).toBe(false);
    expect(isMarkedPaidLate(PAST, null)).toBe(false);
  });
});

describe("shortenMiddle / shortenAddress / shortenTxHash", () => {
  const address = "tb1qexampleaddressxxxxxxxxxxxxxxxxxxxx";
  const txHash =
    "7e8616cd3eea6929e066e4469864a2376670ba16d7fe33ad002b239205d8f3e9";

  it("keeps start and end of an address", () => {
    expect(shortenAddress(address)).toBe(
      `${address.slice(0, 10)}…${address.slice(-8)}`,
    );
  });

  it("shortens a txHash like the spec example", () => {
    expect(shortenTxHash(txHash)).toBe("7e8616cd…d8f3e9");
  });

  it("returns short values unchanged", () => {
    expect(shortenMiddle("short", 10, 8)).toBe("short");
  });
});

// Order status is orthogonal to payment status; the derived state must
// resolve every table row and fall back safely for unknown combos.
describe("deriveBitcoinOrderState", () => {
  const activeCrypto = { expiresAt: FUTURE, markedPaidAt: null };
  const expiredCrypto = { expiresAt: PAST, markedPaidAt: null };

  it("PENDING payment, not expired -> Awaiting Bitcoin payment", () => {
    const state = deriveBitcoinOrderState(
      { orderStatus: "PENDING", paymentStatus: "PENDING", crypto: activeCrypto },
      NOW,
    );
    expect(state.key).toBe("AWAITING_PAYMENT");
    expect(state.label).toBe("Awaiting Bitcoin payment");
    expect(state.canConfirm).toBe(true);
    expect(state.showQr).toBe(true);
    expect(state.cancelRecommended).toBe(false);
  });

  it("PENDING payment, expired -> Payment invoice expired, cancel recommended", () => {
    const state = deriveBitcoinOrderState(
      { orderStatus: "PENDING", paymentStatus: "PENDING", crypto: expiredCrypto },
      NOW,
    );
    expect(state.key).toBe("INVOICE_EXPIRED");
    expect(state.label).toBe("Payment invoice expired");
    expect(state.cancelRecommended).toBe(true);
    // Customer may still have paid — confirming stays possible.
    expect(state.canConfirm).toBe(true);
  });

  it("UNDER_REVIEW, marked on time", () => {
    const state = deriveBitcoinOrderState(
      {
        orderStatus: "PENDING",
        paymentStatus: "UNDER_REVIEW",
        crypto: { expiresAt: FUTURE, markedPaidAt: PAST },
      },
      NOW,
    );
    expect(state.key).toBe("UNDER_REVIEW_ON_TIME");
    expect(state.label).toBe("Payment under review — sent on time");
    expect(state.canConfirm).toBe(false);
    expect(state.showQr).toBe(false);
  });

  it("UNDER_REVIEW, marked after expiry", () => {
    const state = deriveBitcoinOrderState(
      {
        orderStatus: "PENDING",
        paymentStatus: "UNDER_REVIEW",
        crypto: { expiresAt: PAST, markedPaidAt: "2026-07-13T14:55:00.000Z" },
      },
      NOW,
    );
    expect(state.key).toBe("UNDER_REVIEW_LATE");
    expect(state.label).toBe("Payment under review — sent after expiry");
  });

  it("UNDER_REVIEW without markedPaidAt", () => {
    const state = deriveBitcoinOrderState(
      {
        orderStatus: "PENDING",
        paymentStatus: "UNDER_REVIEW",
        crypto: activeCrypto,
      },
      NOW,
    );
    expect(state.key).toBe("UNDER_REVIEW");
    expect(state.label).toBe("Payment under review");
  });

  it("CONFIRMED payment while order still PENDING", () => {
    const state = deriveBitcoinOrderState(
      { orderStatus: "PENDING", paymentStatus: "CONFIRMED", crypto: null },
      NOW,
    );
    expect(state.key).toBe("CONFIRMED_PROCESSING");
    expect(state.label).toBe("Payment confirmed — order processing");
    expect(state.isFinal).toBe(true);
  });

  it.each([
    ["PAID", "PAID", "Bitcoin payment confirmed"],
    ["SHIPPED", "SHIPPED", "Paid and shipped"],
    ["DELIVERED", "DELIVERED", "Delivered"],
    ["COMPLETED", "COMPLETED", "Completed"],
  ])("order %s", (orderStatus, key, label) => {
    const state = deriveBitcoinOrderState(
      { orderStatus, paymentStatus: "CONFIRMED", crypto: null },
      NOW,
    );
    expect(state.key).toBe(key);
    expect(state.label).toBe(label);
    expect(state.isFinal).toBe(true);
    expect(state.canConfirm).toBe(false);
  });

  it("cancelled order or payment", () => {
    expect(
      deriveBitcoinOrderState(
        { orderStatus: "CANCELLED", paymentStatus: "CANCELLED", crypto: null },
        NOW,
      ),
    ).toMatchObject({ key: "CANCELLED", label: "Order cancelled", isFinal: true });
    expect(
      deriveBitcoinOrderState(
        { orderStatus: "PENDING", paymentStatus: "CANCELLED", crypto: null },
        NOW,
      ),
    ).toMatchObject({ key: "CANCELLED", label: "Payment cancelled" });
  });

  it("refunded order or payment", () => {
    for (const input of [
      { orderStatus: "REFUNDED", paymentStatus: "CONFIRMED" },
      { orderStatus: "PAID", paymentStatus: "REFUNDED" },
    ]) {
      const state = deriveBitcoinOrderState({ ...input, crypto: null }, NOW);
      expect(state.key).toBe("REFUNDED");
      expect(state.label).toBe("Bitcoin payment refunded");
      expect(state.isFinal).toBe(true);
    }
  });

  it("never shows UNDER_REVIEW as confirmed", () => {
    const state = deriveBitcoinOrderState(
      {
        orderStatus: "PENDING",
        paymentStatus: "UNDER_REVIEW",
        crypto: activeCrypto,
      },
      NOW,
    );
    expect(state.label).not.toMatch(/confirmed/i);
    expect(state.tone).not.toBe("green");
  });

  it("unknown combinations fall back safely with all actions hidden", () => {
    for (const input of [
      { orderStatus: "PENDING", paymentStatus: "SOMETHING_NEW" },
      { orderStatus: "ON_HOLD", paymentStatus: "PENDING" },
      { orderStatus: "", paymentStatus: "" },
    ]) {
      const state = deriveBitcoinOrderState({ ...input, crypto: null }, NOW);
      expect(state.key).toBe("UNKNOWN");
      expect(state.label).toBe("Order status requires attention");
      expect(state.canConfirm).toBe(false);
      expect(state.canContinue).toBe(false);
      expect(state.cancelRecommended).toBe(false);
      expect(state.showQr).toBe(false);
    }
  });
});
