import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/services/orders", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/services/orders")>();
  return {
    ...actual,
    confirmBitcoinPayment: vi.fn(),
    cancelOrder: vi.fn(),
  };
});

import BitcoinPaymentModal from "@/components/orders/BitcoinPaymentModal";
import { formatDateTime } from "@/lib/datetime";
import {
  OpenPayment,
  cancelOrder,
  confirmBitcoinPayment,
} from "@/services/orders";

const confirmMock = vi.mocked(confirmBitcoinPayment);
const cancelMock = vi.mocked(cancelOrder);

const ADDRESS = "tb1qexampleaddressxxxxxxxxxxxxxxxxxxxx";
const TX_HASH =
  "7e8616cd3eea6929e066e4469864a2376670ba16d7fe33ad002b239205d8f3e9";
const FUTURE = "2099-01-01T15:30:00.000Z";
const PAST = "2020-01-01T15:30:00.000Z";

const basePayment = (overrides?: {
  orderStatus?: string;
  paymentStatus?: string;
  crypto?: Partial<NonNullable<OpenPayment["payment"]["crypto"]>>;
}): OpenPayment => ({
  orderNumber: 105044,
  orderStatus: overrides?.orderStatus ?? "PENDING",
  totalAmountCents: 7591,
  currency: "EUR",
  payment: {
    method: "BITCOIN",
    status: overrides?.paymentStatus ?? "PENDING",
    reference: "BTC-105044",
    crypto: {
      network: "bitcoin-testnet",
      asset: "BTC",
      address: ADDRESS,
      amountBtc: "0.00312627",
      amountSats: 312627,
      exchangeRate: {
        base: "BTC",
        quote: "EUR",
        rate: "61500.00",
        source: "coingecko",
      },
      expiresAt: FUTURE,
      txHash: null,
      markedPaidAt: null,
      qrPayload: `bitcoin:${ADDRESS}?amount=0.00312627`,
      ...overrides?.crypto,
    },
  },
});

const renderModal = (payment: OpenPayment) =>
  render(
    <BitcoinPaymentModal
      payment={payment}
      isOpen
      onClose={() => {}}
      onUpdated={() => {}}
    />,
  );

beforeEach(() => {
  confirmMock.mockReset();
  cancelMock.mockReset();
});

describe("BitcoinPaymentModal — active PENDING invoice", () => {
  it("shows the exact BTC amount string, address, network, local expiry, QR and statuses", () => {
    renderModal(basePayment());

    expect(screen.getByText("Complete your Bitcoin payment")).toBeInTheDocument();
    // Exact BTC string, never reformatted through a JS number.
    expect(screen.getByText("0.00312627 BTC")).toBeInTheDocument();
    expect(screen.getByText(ADDRESS)).toBeInTheDocument();
    expect(screen.getByText("bitcoin-testnet")).toBeInTheDocument();
    expect(screen.getByText("BTC-105044")).toBeInTheDocument();
    // Expiry is rendered in the user's local timezone.
    expect(screen.getByText(formatDateTime(FUTURE)!)).toBeInTheDocument();
    // Status badges: order, payment and derived state.
    expect(screen.getByText("Order: Pending")).toBeInTheDocument();
    expect(screen.getByText("Payment: Pending")).toBeInTheDocument();
    expect(screen.getByText("Awaiting Bitcoin payment")).toBeInTheDocument();
    // QR present while actionable.
    expect(screen.getByLabelText("Payment QR code")).toBeInTheDocument();
  });

  it("copies the FULL address when the (shortened) value is clicked", async () => {
    // userEvent.setup() installs a working clipboard stub in jsdom.
    const user = userEvent.setup();
    renderModal(basePayment());

    await user.click(screen.getByRole("button", { name: "Copy Bitcoin address" }));
    expect(await window.navigator.clipboard.readText()).toBe(ADDRESS);

    await user.click(screen.getByRole("button", { name: "Copy Bitcoin amount" }));
    expect(await window.navigator.clipboard.readText()).toBe("0.00312627");
  });

  it("confirms without a txHash (body omitted) and replaces local state with the response", async () => {
    const user = userEvent.setup();
    confirmMock.mockResolvedValue(
      basePayment({
        paymentStatus: "UNDER_REVIEW",
        crypto: { markedPaidAt: "2026-07-13T14:55:00.000Z" },
      }),
    );
    renderModal(basePayment());

    await user.click(screen.getByRole("button", { name: "I paid" }));

    expect(confirmMock).toHaveBeenCalledWith(105044, "");
    expect(
      await screen.findByText("Payment sent — awaiting verification"),
    ).toBeInTheDocument();
  });

  it("passes a valid txHash through", async () => {
    const user = userEvent.setup();
    confirmMock.mockResolvedValue(basePayment({ paymentStatus: "UNDER_REVIEW" }));
    renderModal(basePayment());

    await user.type(
      screen.getByPlaceholderText("Transaction ID (optional)"),
      TX_HASH,
    );
    await user.click(screen.getByRole("button", { name: "I paid" }));

    expect(confirmMock).toHaveBeenCalledWith(105044, TX_HASH);
  });

  it("rejects an invalid txHash locally, preserving the input, without calling the API", async () => {
    const user = userEvent.setup();
    renderModal(basePayment());

    const input = screen.getByPlaceholderText("Transaction ID (optional)");
    await user.type(input, "not-a-hash");
    await user.click(screen.getByRole("button", { name: "I paid" }));

    expect(confirmMock).not.toHaveBeenCalled();
    expect(input).toHaveValue("not-a-hash");
    expect(
      screen.getByText(/doesn't look like a Bitcoin transaction ID/),
    ).toBeInTheDocument();
  });

  it("prevents duplicate submissions while a confirmation is pending", async () => {
    const user = userEvent.setup();
    let resolve: (value: OpenPayment) => void;
    confirmMock.mockImplementation(
      () => new Promise<OpenPayment>((r) => (resolve = r)),
    );
    renderModal(basePayment());

    const button = screen.getByRole("button", { name: "I paid" });
    await user.click(button);
    expect(button).toBeDisabled();
    await user.click(button);
    expect(confirmMock).toHaveBeenCalledTimes(1);

    resolve!(basePayment({ paymentStatus: "UNDER_REVIEW" }));
    await screen.findByText("Payment sent — awaiting verification");
  });

  it("keeps the txHash and shows the error after a failed confirmation", async () => {
    const user = userEvent.setup();
    confirmMock.mockRejectedValue(new Error("Network unreachable"));
    renderModal(basePayment());

    const input = screen.getByPlaceholderText("Transaction ID (optional)");
    await user.type(input, TX_HASH);
    await user.click(screen.getByRole("button", { name: "I paid" }));

    expect(await screen.findByText("Network unreachable")).toBeInTheDocument();
    expect(input).toHaveValue(TX_HASH);
    expect(screen.getByRole("button", { name: "I paid" })).toBeEnabled();
  });
});

describe("BitcoinPaymentModal — expired PENDING invoice", () => {
  it("recommends cancelling, requires confirmation, still allows paying", async () => {
    const user = userEvent.setup();
    cancelMock.mockResolvedValue({});
    renderModal(basePayment({ crypto: { expiresAt: PAST } }));

    expect(screen.getByText("Payment invoice expired")).toBeInTheDocument();
    expect(
      screen.getByText(/BTC exchange rate for this order is no longer valid/),
    ).toBeInTheDocument();
    // "I paid" remains available for customers who already sent BTC.
    expect(screen.getByRole("button", { name: "I paid" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel order" }));
    // Nothing cancelled yet — confirmation step first.
    expect(cancelMock).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Yes, cancel order" }));
    await waitFor(() => expect(cancelMock).toHaveBeenCalledWith(105044));
  });
});

describe("BitcoinPaymentModal — UNDER_REVIEW", () => {
  it("shows on-time verification state without QR or actions", () => {
    renderModal(
      basePayment({
        paymentStatus: "UNDER_REVIEW",
        crypto: {
          markedPaidAt: "2026-07-13T14:55:00.000Z",
          expiresAt: FUTURE,
          txHash: TX_HASH,
        },
      }),
    );

    expect(
      screen.getByText("Payment under review — sent on time"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Payment sent — awaiting verification"),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Payment QR code")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "I paid" })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Cancel order" }),
    ).not.toBeInTheDocument();
    // txHash shown shortened, copies in full.
    expect(screen.getByText("7e8616cd…d8f3e9")).toBeInTheDocument();
  });

  it("distinguishes a late confirmation", () => {
    renderModal(
      basePayment({
        paymentStatus: "UNDER_REVIEW",
        crypto: { markedPaidAt: "2026-07-13T14:55:00.000Z", expiresAt: PAST },
      }),
    );

    expect(
      screen.getByText("Payment under review — sent after expiry"),
    ).toBeInTheDocument();
  });
});

describe("BitcoinPaymentModal — final and unknown states", () => {
  it.each([
    ["PAID", "CONFIRMED", "Bitcoin payment confirmed"],
    ["PENDING", "CONFIRMED", "Payment confirmed — order processing"],
    ["CANCELLED", "CANCELLED", "Order cancelled"],
    ["REFUNDED", "REFUNDED", "Bitcoin payment refunded"],
  ])("order %s / payment %s hides all payment actions", (orderStatus, paymentStatus, label) => {
    renderModal(basePayment({ orderStatus, paymentStatus }));

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "I paid" })).not.toBeInTheDocument();
    expect(screen.queryByText("Cancel this order")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Payment QR code")).not.toBeInTheDocument();
  });

  it("renders a safe fallback for unknown status combinations", () => {
    renderModal(basePayment({ orderStatus: "ON_HOLD", paymentStatus: "MYSTERY" }));

    expect(screen.getByText("Order status requires attention")).toBeInTheDocument();
    // Raw badges stay visible.
    expect(screen.getByText("Order: On hold")).toBeInTheDocument();
    expect(screen.getByText("Payment: Mystery")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "I paid" })).not.toBeInTheDocument();
  });
});
