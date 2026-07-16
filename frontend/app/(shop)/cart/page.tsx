"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  fetchCart,
  removeCartItem,
  updateCartItem,
  clearCart,
} from "@/services/cart";
import {
  API_ERROR_CODES,
  PAYMENT_METHOD_BANK_TRANSFER,
  PAYMENT_METHOD_BITCOIN,
  PaymentMethod,
  checkout,
  fetchCurrentPayment,
  fetchDeliveryCountries,
  fetchDeliveryOptions,
  DeliveryCountry,
  DeliveryOption,
  OpenPayment,
  OrdersApiError,
} from "@/services/orders";
import { formatPrice } from "@/services/products";
import { useAuth } from "@/components/auth/AuthProvider";
import OpenPaymentModal from "@/components/orders/OpenPaymentModal";

type CartState = Awaited<ReturnType<typeof fetchCart>>;

type AddressState = {
  fullName: string;
  line1: string;
  line2: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
};

const initialAddress: AddressState = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  postalCode: "",
  country: "",
  phone: "",
};

// ISO-2 → dial code (add as needed; only used to auto-prefix a bare phone).
const COUNTRY_DIAL_CODES: Record<string, string> = {
  LU: "352",
  FR: "33",
  DE: "49",
  BE: "32",
  NL: "31",
  AT: "43",
  IT: "39",
  ES: "34",
  PT: "351",
  PL: "48",
  CZ: "420",
  SK: "421",
  IE: "353",
  GB: "44",
  DK: "45",
  SE: "46",
  NO: "47",
  FI: "358",
  CH: "41",
  GR: "30",
  HU: "36",
  RO: "40",
  BG: "359",
  HR: "385",
  SI: "386",
  EE: "372",
  LV: "371",
  LT: "370",
  US: "1",
  CA: "1",
};

/**
 * Normalize a user-entered phone into E.164 (`+<digits>`). If the user
 * already prefixed with `+`, we trust them; otherwise we prepend the
 * dial code for the selected country. Returns `undefined` if the phone
 * is empty, or a normalized string.
 */
function normalizePhoneE164(
  raw: string,
  country: string,
): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("+")) {
    return "+" + trimmed.slice(1).replace(/\D/g, "");
  }
  const digitsOnly = trimmed.replace(/\D/g, "");
  if (!digitsOnly) return undefined;
  const dial = COUNTRY_DIAL_CODES[country];
  if (!dial) return "+" + digitsOnly; // best effort
  // Strip a leading local zero, common in many EU countries.
  const local = digitsOnly.replace(/^0+/, "");
  return `+${dial}${local}`;
}

const selectClass =
  "w-full rounded-full border border-pr_dg/30 px-4 pr-8 py-2 text-sm text-pr_dg outline-none bg-white disabled:opacity-60 disabled:cursor-not-allowed appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 20 20%22%3E%3Cpath stroke=%22%236b7280%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%221.5%22 d=%22m6 8 4 4 4-4%22/%3E%3C/svg%3E')] bg-[right_0.5rem_center] bg-[length:1.25rem] bg-no-repeat";

export default function CartPage() {
  const disableAuth = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutNotice, setCheckoutNotice] = useState("");
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [address, setAddress] = useState<AddressState>(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PAYMENT_METHOD_BANK_TRANSFER,
  );
  const [activePayment, setActivePayment] = useState<OpenPayment | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [deliveryCountries, setDeliveryCountries] = useState<DeliveryCountry[]>([]);
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [selectedDeliveryOptionId, setSelectedDeliveryOptionId] = useState("");
  const [loadingOptions, setLoadingOptions] = useState(false);

  const loadCart = async (options?: { showSpinner?: boolean }) => {
    const showSpinner = options?.showSpinner ?? true;
    if (showSpinner) setLoading(true);
    setError("");
    try {
      const data = await fetchCart();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cart");
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
    fetchDeliveryCountries().then(setDeliveryCountries);
  }, []);

  const handleCountryChange = async (countryCode: string) => {
    setAddress((prev) => ({ ...prev, country: countryCode }));
    setSelectedDeliveryOptionId("");
    setDeliveryOptions([]);
    if (!countryCode) return;
    setLoadingOptions(true);
    try {
      const options = await fetchDeliveryOptions(countryCode);
      setDeliveryOptions(options);
      if (options.length === 1) setSelectedDeliveryOptionId(options[0].id);
      // if >1 options, leave empty so user must pick
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleQtyChange = async (itemId: string, qty: number) => {
    if (qty < 1) return;
    setUpdatingItemId(itemId);
    try {
      await updateCartItem(itemId, qty);
      await loadCart({ showSpinner: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update item");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    setUpdatingItemId(itemId);
    try {
      await removeCartItem(itemId);
      await loadCart({ showSpinner: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove item");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleClear = async () => {
    setUpdatingItemId("__clear__");
    try {
      await clearCart();
      await loadCart({ showSpinner: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear cart");
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleAddressChange = (field: keyof AddressState, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const selectedOption = deliveryOptions.find((o) => o.id === selectedDeliveryOptionId);
  const selectedOptionIsFree = selectedOption?.supportsFreeDelivery === true &&
    selectedOption.freeShippingThresholdCents !== null &&
    (cart?.subtotalCents ?? 0) >= selectedOption.freeShippingThresholdCents;

  const handleCheckout = async () => {
    setCheckoutError("");
    setCheckoutNotice("");

    if (!isAuthenticated && !disableAuth) {
      router.push("/signin?next=%2Fcart");
      return;
    }

    if (!cart || cart.items.length === 0) {
      setCheckoutError("Your cart is empty.");
      return;
    }

    if (
      !address.fullName.trim() ||
      !address.line1.trim() ||
      !address.city.trim() ||
      !address.postalCode.trim() ||
      !address.country.trim()
    ) {
      setCheckoutError("Please fill in all required address fields.");
      return;
    }

    if (!agreedToTerms) {
      setCheckoutError(
        "Please accept the Terms and Conditions to continue.",
      );
      return;
    }

    try {
      setCheckoutLoading(true);
      const result = await checkout(
        {
          fullName: address.fullName.trim(),
          line1: address.line1.trim(),
          city: address.city.trim(),
          postalCode: address.postalCode.trim(),
          country: address.country.trim(),
          line2: address.line2.trim() || undefined,
          phone: normalizePhoneE164(address.phone, address.country),
        },
        selectedDeliveryOptionId || undefined,
        paymentMethod,
      );

      setAddress(initialAddress);
      // The cart is cleared server-side on order creation — just refresh it.
      // (On checkout failure we never touch the cart.)
      await loadCart();
      setActivePayment(result);
    } catch (err) {
      if (
        err instanceof OrdersApiError &&
        err.code === API_ERROR_CODES.OPEN_PAYMENT_EXISTS
      ) {
        // An unpaid order already exists: re-open its payment instead of
        // surfacing an error or creating a second order.
        try {
          const existing = await fetchCurrentPayment();
          if (existing) {
            setCheckoutNotice(
              existing.payment.method === PAYMENT_METHOD_BITCOIN
                ? `You already have an active Bitcoin payment for order #${existing.orderNumber} — continuing that payment.`
                : `You already have an unpaid order #${existing.orderNumber} — continuing that payment.`,
            );
            setActivePayment(existing);
          } else {
            // Already under review (or gone) — nothing to upload here.
            router.push("/user_profile/orders");
          }
        } catch {
          setCheckoutError(
            "You already have an unpaid order. Please check your orders page.",
          );
        }
      } else {
        setCheckoutError(
          err instanceof Error ? err.message : "Checkout failed",
        );
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pr_dg text-pr_w">
      <section className="w-full px-4 pt-[120px] pb-24 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-2xl font-semibold">Cart</h1>
          {cart?.items?.length ? (
            <button
              type="button"
              onClick={handleClear}
              disabled={updatingItemId !== null}
              className="self-start rounded-full border border-pr_w/30 px-4 py-2 text-xs text-pr_w/80 disabled:opacity-60"
            >
              Clear cart
            </button>
          ) : null}
        </div>

        {loading && !cart ? (
          <p className="mt-6 text-sm text-pr_w/70">Loading cart...</p>
        ) : error ? (
          <p className="mt-6 text-sm text-pr_dr">{error}</p>
        ) : !cart || cart.items.length === 0 ? (
          <p className="mt-6 text-sm text-pr_w/70">
            Your cart is empty right now.
          </p>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_0.6fr]">
            <div className="space-y-4">
              {cart.items.map((item) => {
                const itemId = item.id?.trim();
                if (!itemId) return null;
                const isPack = Boolean(item.pack);
                const unitsPerPack = item.pack?.totalUnits ?? 1;
                const qtyLabel = isPack
                  ? item.qty === 1
                    ? "pack"
                    : "packs"
                  : item.qty === 1
                    ? "seed"
                    : "seeds";

                return (
                  <div
                    key={itemId}
                    className="rounded-2xl bg-pr_w p-4 text-pr_dg"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        {item.product.images?.[0]?.url ? (
                          item.product.slug ? (
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="block"
                            >
                              <img
                                src={item.product.images[0].url}
                                alt={item.product.name}
                                className="h-20 w-20 rounded-xl object-cover"
                              />
                            </Link>
                          ) : (
                            <img
                              src={item.product.images[0].url}
                              alt={item.product.name}
                              className="h-20 w-20 rounded-xl object-cover"
                            />
                          )
                        ) : (
                          <div className="h-20 w-20 rounded-xl bg-sr_dg/20" />
                        )}
                        <div>
                          <p className="text-sm font-semibold">
                            {item.product.name}
                          </p>
                          {isPack ? (
                            <p className="mt-1 text-xs text-pr_dg/60">
                              {item.qty} {item.qty === 1 ? "pack" : "packs"} (
                              {unitsPerPack}{" "}
                              {unitsPerPack === 1 ? "seed" : "seeds"} per pack)
                            </p>
                          ) : (
                            <p className="mt-1 text-xs text-pr_dg/60">
                              {item.qty} {item.qty === 1 ? "seed" : "seeds"}{" "}
                              total
                            </p>
                          )}
                          <p className="mt-1 text-xs text-pr_dg/60">
                            {formatPrice(
                              item.product.priceCents,
                              item.product.currency,
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-full border border-pr_dg/20">
                          <button
                            type="button"
                            onClick={() =>
                              handleQtyChange(itemId, item.qty - 1)
                            }
                            disabled={updatingItemId === itemId}
                            className="h-8 w-8 rounded-full text-sm"
                          >
                            -
                          </button>
                          <span className="min-w-[72px] px-3 text-center">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="text-sm font-medium">
                                {item.qty}
                              </span>
                              <span className="text-[10px] uppercase tracking-wide text-pr_dg/50">
                                {qtyLabel}
                              </span>
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleQtyChange(itemId, item.qty + 1)
                            }
                            disabled={updatingItemId === itemId}
                            className="h-8 w-8 rounded-full text-sm"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm font-semibold">
                          {formatPrice(item.lineTotal, item.product.currency)}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRemove(itemId)}
                          disabled={updatingItemId === itemId}
                          className="text-xs text-pr_dr"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl bg-pr_w p-6 text-pr_dg h-fit">
              <h2 className="text-sm font-semibold">Order summary</h2>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-semibold">
                  {formatPrice(
                    cart.subtotalCents,
                    cart.items[0]?.product.currency ?? "EUR",
                  )}
                </span>
              </div>

              {selectedOption ? (
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {selectedOptionIsFree
                      ? "Free"
                      : formatPrice(selectedOption.priceCents, selectedOption.currency)}
                  </span>
                </div>
              ) : null}

              {selectedOption ? (
                <div className="mt-3 flex items-center justify-between border-t border-pr_dg/10 pt-3 text-sm">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">
                    {formatPrice(
                      cart.subtotalCents + (selectedOptionIsFree ? 0 : selectedOption.priceCents),
                      selectedOption.currency,
                    )}
                  </span>
                </div>
              ) : null}

              <div className="mt-6 border-t border-pr_dg/10 pt-5">
                <p className="text-sm font-semibold">Delivery address</p>
                <div className="mt-3 space-y-3 text-xs">
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(event) =>
                      handleAddressChange("fullName", event.target.value)
                    }
                    placeholder="Full name"
                    className="w-full rounded-full border border-pr_dg/30 px-4 py-2 text-sm text-pr_dg outline-none"
                  />
                  <input
                    type="text"
                    value={address.line1}
                    onChange={(event) =>
                      handleAddressChange("line1", event.target.value)
                    }
                    placeholder="Street address"
                    className="w-full rounded-full border border-pr_dg/30 px-4 py-2 text-sm text-pr_dg outline-none"
                  />
                  <input
                    type="text"
                    value={address.line2}
                    onChange={(event) =>
                      handleAddressChange("line2", event.target.value)
                    }
                    placeholder="Line 2 (optional)"
                    className="w-full rounded-full border border-pr_dg/30 px-4 py-2 text-sm text-pr_dg outline-none"
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      value={address.city}
                      onChange={(event) =>
                        handleAddressChange("city", event.target.value)
                      }
                      placeholder="City"
                      className="w-full rounded-full border border-pr_dg/30 px-4 py-2 text-sm text-pr_dg outline-none"
                    />
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={(event) =>
                        handleAddressChange("postalCode", event.target.value)
                      }
                      placeholder="Postal code"
                      className="w-full rounded-full border border-pr_dg/30 px-4 py-2 text-sm text-pr_dg outline-none"
                    />
                  </div>

                  <select
                    value={address.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select country</option>
                    {deliveryCountries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <div>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(event) =>
                        handleAddressChange("phone", event.target.value)
                      }
                      placeholder="Phone (optional, e.g. +352661954190)"
                      className="w-full rounded-full border border-pr_dg/30 px-4 py-2 text-sm text-pr_dg outline-none"
                    />
                    {address.phone.trim() && !address.phone.trim().startsWith("+") ? (
                      <p className="mt-1 px-2 text-[11px] text-pr_dg/60">
                        Will be sent as{" "}
                        <span className="font-mono">
                          {normalizePhoneE164(address.phone, address.country) ??
                            address.phone}
                        </span>
                        . Include a &quot;+&quot; and country code to override.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              {address.country ? (
                <div className="mt-4 border-t border-pr_dg/10 pt-4">
                  <p className="text-sm font-semibold">Delivery method</p>
                  <div className="mt-3">
                    {loadingOptions ? (
                      <p className="text-xs text-pr_dg/60">Loading options...</p>
                    ) : (
                      <select
                        value={selectedDeliveryOptionId}
                        onChange={(e) => setSelectedDeliveryOptionId(e.target.value)}
                        disabled={deliveryOptions.length === 0}
                        className={selectClass}
                      >
                        {deliveryOptions.length === 0 ? (
                          <option value="">No delivery options available</option>
                        ) : (
                          <>
                            {deliveryOptions.length > 1 && !selectedDeliveryOptionId && (
                              <option value="">Choose delivery method</option>
                            )}
                            {deliveryOptions.map((opt) => {
                              const isFree = opt.supportsFreeDelivery &&
                                opt.freeShippingThresholdCents !== null &&
                                cart.subtotalCents >= opt.freeShippingThresholdCents;
                              return (
                                <option key={opt.id} value={opt.id}>
                                  {opt.displayName} -{" "}
                                  {isFree ? "Free" : formatPrice(opt.priceCents, opt.currency)}
                                </option>
                              );
                            })}
                          </>
                        )}
                      </select>
                    )}

                    {selectedOption?.supportsFreeDelivery &&
                    selectedOption.freeShippingThresholdCents !== null &&
                    !selectedOptionIsFree ? (
                      <p className="mt-2 rounded-xl bg-pr_dg/5 px-3 py-2 text-xs text-pr_dg/70">
                        Add{" "}
                        <span className="font-semibold text-pr_dg">
                          {formatPrice(
                            selectedOption.freeShippingThresholdCents - cart.subtotalCents,
                            selectedOption.currency,
                          )}
                        </span>{" "}
                        more for free shipping
                      </p>
                    ) : selectedOptionIsFree ? (
                      <p className="mt-2 rounded-xl bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
                        You&apos;ve got free delivery!
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className="mt-4 border-t border-pr_dg/10 pt-4">
                <p className="text-sm font-semibold">Payment method</p>
                <div className="mt-3 flex flex-col gap-2">
                  {(
                    [
                      {
                        value: PAYMENT_METHOD_BANK_TRANSFER,
                        title: "Bank transfer",
                        hint: "Pay by SEPA transfer and upload proof of payment",
                      },
                      {
                        value: PAYMENT_METHOD_BITCOIN,
                        title: "Bitcoin",
                        hint: "Pay the exact BTC amount to a one-time address",
                      },
                    ] as const
                  ).map((option) => {
                    const checked = paymentMethod === option.value;
                    return (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                          checked
                            ? "border-pr_dg bg-pr_dg/5"
                            : "border-pr_dg/20"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          className="mt-0.5 accent-pr_dg"
                          checked={checked}
                          onChange={() => setPaymentMethod(option.value)}
                        />
                        <span>
                          <span className="block text-sm font-medium">
                            {option.title}
                          </span>
                          <span className="block text-xs text-pr_dg/60">
                            {option.hint}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {checkoutError ? (
                <p className="mt-3 text-xs text-pr_dr">{checkoutError}</p>
              ) : null}
              {checkoutNotice ? (
                <p className="mt-3 rounded-xl bg-pr_dg/5 px-3 py-2 text-xs text-pr_dg/80">
                  {checkoutNotice}
                </p>
              ) : null}

              {!isAuthenticated && !disableAuth ? (
                <p className="mt-3 text-xs text-pr_dg/70">
                  Sign in to complete checkout.
                </p>
              ) : null}

              <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-xs text-pr_dg/80">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(event) => {
                    setAgreedToTerms(event.target.checked);
                    if (event.target.checked) setCheckoutError("");
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-pr_dg"
                />
                <span>
                  I have read and agree to the{" "}
                  <Link
                    href="/terms-and-conditions"
                    target="_blank"
                    className="font-semibold text-pr_dg underline"
                  >
                    Terms and Conditions
                  </Link>
                  .
                </span>
              </label>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="mt-5 w-full rounded-full bg-pr_dg px-4 py-2 text-sm font-semibold text-pr_w disabled:opacity-60"
              >
                {checkoutLoading
                  ? "Processing..."
                  : !isAuthenticated && !disableAuth
                    ? "Sign in to checkout"
                    : "Proceed to checkout"}
              </button>
            </div>
          </div>
        )}
      </section>

      <OpenPaymentModal
        payment={activePayment}
        isOpen={activePayment !== null}
        onClose={() => setActivePayment(null)}
        onUpdated={() => {
          // Proof uploaded / payment confirmed / order cancelled — refresh cart state.
          loadCart({ showSpinner: false });
        }}
      />
    </div>
  );
}
