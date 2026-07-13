import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/apiClient", () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from "@/lib/apiClient";
import {
  API_ERROR_CODES,
  Order,
  OrdersApiError,
  PAYMENT_METHOD_BITCOIN,
  checkout,
  confirmBitcoinPayment,
  openPaymentFromOrder,
  validateTxHash,
} from "@/services/orders";

const apiFetchMock = vi.mocked(apiFetch);

const jsonResponse = (body: unknown, ok = true, status = 200) =>
  ({
    ok,
    status,
    json: async () => body,
  }) as unknown as Response;

const VALID_TX_HASH =
  "7e8616cd3eea6929e066e4469864a2376670ba16d7fe33ad002b239205d8f3e9";

beforeEach(() => {
  apiFetchMock.mockReset();
});

describe("validateTxHash", () => {
  it("accepts an empty value (txHash is optional)", () => {
    expect(validateTxHash("")).toBeNull();
    expect(validateTxHash("   ")).toBeNull();
  });

  it("accepts a 64-char hex hash (either case)", () => {
    expect(validateTxHash(VALID_TX_HASH)).toBeNull();
    expect(validateTxHash(VALID_TX_HASH.toUpperCase())).toBeNull();
    expect(validateTxHash(`  ${VALID_TX_HASH}  `)).toBeNull();
  });

  it("rejects wrong lengths and non-hex characters", () => {
    expect(validateTxHash(VALID_TX_HASH.slice(0, 63))).not.toBeNull();
    expect(validateTxHash(`${VALID_TX_HASH}a`)).not.toBeNull();
    expect(validateTxHash("z".repeat(64))).not.toBeNull();
  });
});

describe("confirmBitcoinPayment", () => {
  it("omits txHash entirely when empty — never sends an empty string", async () => {
    apiFetchMock.mockResolvedValue(jsonResponse({ orderNumber: 1 }));

    await confirmBitcoinPayment(105044);
    await confirmBitcoinPayment(105044, "");
    await confirmBitcoinPayment(105044, "   ");

    for (const call of apiFetchMock.mock.calls) {
      expect(call[0]).toBe("/orders/105044/payment-confirmation");
      expect(JSON.parse(call[1]?.body as string)).toEqual({});
    }
  });

  it("sends the trimmed txHash when provided", async () => {
    apiFetchMock.mockResolvedValue(jsonResponse({ orderNumber: 1 }));

    await confirmBitcoinPayment(105044, `  ${VALID_TX_HASH} `);

    expect(JSON.parse(apiFetchMock.mock.calls[0][1]?.body as string)).toEqual({
      txHash: VALID_TX_HASH,
    });
  });

  it("returns the full response for the caller to replace local state", async () => {
    const payload = {
      orderNumber: 105044,
      orderStatus: "PENDING",
      payment: { method: "BITCOIN", status: "UNDER_REVIEW" },
    };
    apiFetchMock.mockResolvedValue(jsonResponse(payload));

    await expect(confirmBitcoinPayment(105044)).resolves.toEqual(payload);
  });

  it("throws an OrdersApiError carrying the backend code", async () => {
    apiFetchMock.mockResolvedValue(
      jsonResponse(
        { error: true, message: "Payment already under review", code: "PAYMENT_ALREADY_UNDER_REVIEW" },
        false,
        409,
      ),
    );

    const error = await confirmBitcoinPayment(105044).catch((e) => e);
    expect(error).toBeInstanceOf(OrdersApiError);
    expect(error.code).toBe(API_ERROR_CODES.PAYMENT_ALREADY_UNDER_REVIEW);
  });
});

describe("checkout", () => {
  const address = {
    fullName: "John Doe",
    line1: "10 Main Street",
    city: "Luxembourg",
    postalCode: "L-1234",
    country: "LU",
  };

  it("defaults to BANK_TRANSFER (existing flow unchanged)", async () => {
    apiFetchMock.mockResolvedValue(jsonResponse({}));
    await checkout(address);
    const body = JSON.parse(apiFetchMock.mock.calls[0][1]?.body as string);
    expect(body.paymentMethod).toBe("BANK_TRANSFER");
  });

  it("sends BITCOIN when selected", async () => {
    apiFetchMock.mockResolvedValue(jsonResponse({}));
    await checkout(address, "rate-id", PAYMENT_METHOD_BITCOIN);
    const body = JSON.parse(apiFetchMock.mock.calls[0][1]?.body as string);
    expect(body.paymentMethod).toBe("BITCOIN");
    expect(body.shippingRateId).toBe("rate-id");
  });

  it("surfaces OPEN_PAYMENT_EXISTS by code", async () => {
    apiFetchMock.mockResolvedValue(
      jsonResponse(
        {
          error: true,
          message: "An unpaid order already exists",
          code: "OPEN_PAYMENT_EXISTS",
          details: { orderNumber: 105045, paymentStatus: "PENDING" },
        },
        false,
        409,
      ),
    );

    const error = await checkout(address, undefined, PAYMENT_METHOD_BITCOIN).catch(
      (e) => e,
    );
    expect(error).toBeInstanceOf(OrdersApiError);
    expect(error.code).toBe(API_ERROR_CODES.OPEN_PAYMENT_EXISTS);
    expect(error.details).toMatchObject({ orderNumber: 105045 });
  });
});

describe("openPaymentFromOrder", () => {
  it("preserves crypto data (exact BTC string) from a list order", () => {
    const order = {
      orderNumber: 105044,
      status: "PENDING",
      totalAmountCents: 7591,
      currency: "EUR",
      address: {
        fullName: "John Doe",
        line1: "10 Main Street",
        city: "Luxembourg",
        postalCode: "L-1234",
        country: "LU",
      },
      items: [],
      payment: {
        method: "BITCOIN",
        status: "UNDER_REVIEW",
        reference: "BTC-105044",
        crypto: {
          network: "bitcoin-testnet",
          address: "tb1qexampleaddressxxxxxxxxxxxxxxxxxxxx",
          amountBtc: "0.00312627",
          txHash: VALID_TX_HASH,
        },
      },
    } satisfies Order;

    const open = openPaymentFromOrder(order);
    expect(open).not.toBeNull();
    expect(open!.payment.crypto?.amountBtc).toBe("0.00312627");
    expect(open!.payment.method).toBe("BITCOIN");
    expect(open!.orderStatus).toBe("PENDING");
  });

  it("returns null when the order has no payment", () => {
    expect(
      openPaymentFromOrder({
        orderNumber: 1,
        status: "PENDING",
        totalAmountCents: 0,
        currency: "EUR",
        address: {
          fullName: "",
          line1: "",
          city: "",
          postalCode: "",
          country: "",
        },
        items: [],
      }),
    ).toBeNull();
  });
});
