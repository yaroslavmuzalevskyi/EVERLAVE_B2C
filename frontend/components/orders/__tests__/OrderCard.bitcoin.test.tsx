import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import OrderCard from "@/components/orders/OrderCard";
import { Order } from "@/services/orders";

const ADDRESS = "tb1qexampleaddressxxxxxxxxxxxxxxxxxxxx";
const TX_HASH =
  "7e8616cd3eea6929e066e4469864a2376670ba16d7fe33ad002b239205d8f3e9";
const FUTURE = "2099-01-01T15:30:00.000Z";
const PAST = "2020-01-01T15:30:00.000Z";

const bitcoinOrder = (overrides?: {
  status?: string;
  paymentStatus?: string;
  crypto?: Record<string, unknown> | null;
}): Order => ({
  orderNumber: 105044,
  status: overrides?.status ?? "PENDING",
  totalAmountCents: 7591,
  currency: "EUR",
  createdAt: "2026-07-13T12:00:00.000Z",
  address: {
    fullName: "John Doe",
    line1: "10 Main Street",
    city: "Luxembourg",
    postalCode: "L-1234",
    country: "LU",
  },
  items: [{ productName: "Soft Matter Auto (AK16)", unitPriceCents: 913, qty: 7 }],
  payment: {
    method: "BITCOIN",
    status: overrides?.paymentStatus ?? "PENDING",
    reference: "BTC-105044",
    crypto:
      overrides?.crypto === null
        ? null
        : {
            network: "bitcoin-testnet",
            asset: "BTC",
            address: ADDRESS,
            amountBtc: "0.00123456",
            expiresAt: FUTURE,
            txHash: null,
            markedPaidAt: null,
            ...overrides?.crypto,
          },
  },
});

describe("OrderCard — Bitcoin orders", () => {
  it("active PENDING: derived badge, exact BTC amount, shortened copyable address, Continue payment", async () => {
    const user = userEvent.setup();
    const onResume = vi.fn();
    render(
      <OrderCard order={bitcoinOrder()} onResumePayment={onResume} onCancel={() => {}} />,
    );

    expect(screen.getByText("Awaiting Bitcoin payment")).toBeInTheDocument();
    expect(screen.getByText("0.00123456 BTC")).toBeInTheDocument();
    // Address shown shortened (start + end) but copies in full.
    const shortened = `${ADDRESS.slice(0, 10)}…${ADDRESS.slice(-8)}`;
    expect(screen.getByText(shortened)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Copy Bitcoin address" }));
    expect(await window.navigator.clipboard.readText()).toBe(ADDRESS);

    await user.click(screen.getByRole("button", { name: "Continue payment" }));
    expect(onResume).toHaveBeenCalledWith(105044);
    // No proof-file UI for Bitcoin.
    expect(screen.queryByText(/proof/i)).not.toBeInTheDocument();
  });

  it("expired PENDING: cancel is primary, continue stays available", () => {
    render(
      <OrderCard
        order={bitcoinOrder({ crypto: { expiresAt: PAST } })}
        onResumePayment={() => {}}
        onCancel={() => {}}
      />,
    );

    expect(screen.getByText("Payment invoice expired")).toBeInTheDocument();
    expect(
      screen.getByText("This Bitcoin payment invoice has expired"),
    ).toBeInTheDocument();
    const buttons = screen.getAllByRole("button");
    const cancelIndex = buttons.findIndex((b) => b.textContent === "Cancel order");
    const continueIndex = buttons.findIndex(
      (b) => b.textContent === "Continue payment",
    );
    // Cancel is rendered before (more prominent than) continue.
    expect(cancelIndex).toBeGreaterThanOrEqual(0);
    expect(continueIndex).toBeGreaterThan(cancelIndex);
  });

  it("UNDER_REVIEW: view payment details, shortened copyable txHash, no cancel", async () => {
    const user = userEvent.setup();
    const onView = vi.fn();
    const order = bitcoinOrder({
      paymentStatus: "UNDER_REVIEW",
      crypto: { txHash: TX_HASH, markedPaidAt: "2026-07-13T14:55:00.000Z" },
    });
    render(<OrderCard order={order} onViewPayment={onView} onCancel={() => {}} />);

    expect(
      screen.getByText("Payment under review — sent on time"),
    ).toBeInTheDocument();
    expect(screen.getByText("7e8616cd…d8f3e9")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Copy transaction ID" }));
    expect(await window.navigator.clipboard.readText()).toBe(TX_HASH);

    expect(
      screen.queryByRole("button", { name: "Cancel order" }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "View payment details" }));
    expect(onView).toHaveBeenCalledWith(order);
  });

  it("final states show no payment actions", () => {
    render(
      <OrderCard
        order={bitcoinOrder({ status: "PAID", paymentStatus: "CONFIRMED", crypto: null })}
        onResumePayment={() => {}}
        onCancel={() => {}}
        onViewPayment={() => {}}
      />,
    );

    expect(screen.getByText("Bitcoin payment confirmed")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("OrderCard — bank transfer orders unchanged", () => {
  it("still offers Complete payment and Cancel order", () => {
    const order: Order = {
      ...bitcoinOrder(),
      payment: {
        method: "BANK_TRANSFER",
        status: "PENDING",
        reference: "REF-1",
      },
    };
    render(
      <OrderCard order={order} onResumePayment={() => {}} onCancel={() => {}} />,
    );

    expect(screen.getByRole("button", { name: "Complete payment" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel order" })).toBeInTheDocument();
    expect(screen.queryByText("Awaiting Bitcoin payment")).not.toBeInTheDocument();
  });
});
