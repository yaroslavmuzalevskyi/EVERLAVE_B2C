"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/auth/RequireAuth";
import {
  fetchCart,
  removeCartItem,
  updateCartItem,
  clearCart,
} from "@/services/cart";
import { checkout } from "@/services/orders";
import { formatPrice } from "@/services/products";

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

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [address, setAddress] = useState<AddressState>(initialAddress);

  const loadCart = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchCart();
      setCart(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleQtyChange = async (productId: string, qty: number) => {
    if (qty < 1) return;
    await updateCartItem(productId, qty);
    await loadCart();
  };

  const handleRemove = async (productId: string) => {
    await removeCartItem(productId);
    await loadCart();
  };

  const handleClear = async () => {
    await clearCart();
    await loadCart();
  };

  const handleAddressChange = (field: keyof AddressState, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckout = async () => {
    setCheckoutError("");

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

    try {
      setCheckoutLoading(true);
      await checkout({
        fullName: address.fullName.trim(),
        line1: address.line1.trim(),
        city: address.city.trim(),
        postalCode: address.postalCode.trim(),
        country: address.country.trim(),
        line2: address.line2.trim() || undefined,
        phone: address.phone.trim() || undefined,
      });

      setAddress(initialAddress);
      await loadCart();
      router.push("/user_profile/orders");
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : "Checkout failed",
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-pr_dg text-pr_w">
        <section className="w-full px-4 pt-[120px] pb-24 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-2xl font-semibold">Cart</h1>
            {cart?.items?.length ? (
              <button
                type="button"
                onClick={handleClear}
                className="self-start rounded-full border border-pr_w/30 px-4 py-2 text-xs text-pr_w/80"
              >
                Clear cart
              </button>
            ) : null}
          </div>

          {loading ? (
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
                {cart.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="rounded-2xl bg-pr_w p-4 text-pr_dg"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        {item.product.images?.[0]?.url ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="h-20 w-20 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="h-20 w-20 rounded-xl bg-sr_dg/20" />
                        )}
                        <div>
                          <p className="text-sm font-semibold">
                            {item.product.name}
                          </p>
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
                              handleQtyChange(item.product.id, item.qty - 1)
                            }
                            className="h-8 w-8 rounded-full text-sm"
                          >
                            -
                          </button>
                          <span className="px-3 text-sm">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleQtyChange(item.product.id, item.qty + 1)
                            }
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
                          onClick={() => handleRemove(item.product.id)}
                          className="text-xs text-pr_dr"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
                    <input
                      type="text"
                      value={address.country}
                      onChange={(event) =>
                        handleAddressChange("country", event.target.value)
                      }
                      placeholder="Country"
                      className="w-full rounded-full border border-pr_dg/30 px-4 py-2 text-sm text-pr_dg outline-none"
                    />
                    <input
                      type="text"
                      value={address.phone}
                      onChange={(event) =>
                        handleAddressChange("phone", event.target.value)
                      }
                      placeholder="Phone (optional)"
                      className="w-full rounded-full border border-pr_dg/30 px-4 py-2 text-sm text-pr_dg outline-none"
                    />
                  </div>
                </div>

                {checkoutError ? (
                  <p className="mt-3 text-xs text-pr_dr">{checkoutError}</p>
                ) : null}

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="mt-5 w-full rounded-full bg-pr_dg px-4 py-2 text-sm font-semibold text-pr_w disabled:opacity-60"
                >
                  {checkoutLoading ? "Processing..." : "Proceed to checkout"}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </RequireAuth>
  );
}
