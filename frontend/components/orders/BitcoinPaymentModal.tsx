"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "react-qr-code";
import Modal from "@/components/ui/Modal";
import CopyValue from "@/components/orders/CopyValue";
import { formatPrice } from "@/services/products";
import { formatDateTime } from "@/lib/datetime";
import {
  deriveBitcoinOrderState,
  isMarkedPaidLate,
  shortenTxHash,
} from "@/lib/bitcoinPayment";
import {
  API_ERROR_CODES,
  OpenPayment,
  OrdersApiError,
  PAYMENT_STATUS,
  cancelOrder,
  confirmBitcoinPayment,
  validateTxHash,
} from "@/services/orders";

type BitcoinPaymentModalProps = {
  payment: OpenPayment | null;
  isOpen: boolean;
  onClose: () => void;
  /** Called after the payment changed server-side (confirmed / cancelled). */
  onUpdated?: () => void;
  ordersHref?: string;
};

const detailRowClass =
  "flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between";

const toneBadgeClass: Record<string, string> = {
  amber: "border-amber-400 text-amber-700",
  red: "border-pr_dr text-pr_dr",
  blue: "border-blue-400 text-blue-700",
  green: "border-green-500 text-green-700",
  muted: "border-pr_dg/30 text-pr_dg/60",
};

/** UNDER_REVIEW -> "Under review". */
const prettyStatus = (status: string) => {
  const words = status.replace(/_/g, " ").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

export default function BitcoinPaymentModal({
  payment,
  isOpen,
  onClose,
  onUpdated,
  ordersHref = "/user_profile/orders",
}: BitcoinPaymentModalProps) {
  // After "I paid" the confirmation response replaces the payment we render.
  const [updatedPayment, setUpdatedPayment] = useState<OpenPayment | null>(
    null,
  );
  const [submitted, setSubmitted] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [txHashError, setTxHashError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  // Re-evaluated periodically so an open invoice flips to "expired" live.
  const [now, setNow] = useState(() => Date.now());

  // Reset transient state whenever the modal opens for a (new) payment.
  useEffect(() => {
    if (!isOpen) return;
    setUpdatedPayment(null);
    setSubmitted(false);
    setTxHash("");
    setTxHashError("");
    setConfirming(false);
    setConfirmError("");
    setConfirmingCancel(false);
    setCancelling(false);
    setCancelError("");
    setNow(Date.now());
  }, [isOpen, payment?.orderNumber]);

  const current = updatedPayment ?? payment;
  const crypto = current?.payment.crypto ?? null;
  const isPendingPayment =
    current?.payment.status === PAYMENT_STATUS.PENDING;

  useEffect(() => {
    if (!isOpen || !isPendingPayment) return;
    const interval = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(interval);
  }, [isOpen, isPendingPayment]);

  if (!current) return null;

  const state = deriveBitcoinOrderState(
    {
      orderStatus: current.orderStatus,
      paymentStatus: current.payment.status,
      crypto,
    },
    now,
  );

  const expiresLabel = formatDateTime(crypto?.expiresAt);
  const markedPaidLabel = formatDateTime(crypto?.markedPaidAt);
  const markedLate = isMarkedPaidLate(crypto?.markedPaidAt, crypto?.expiresAt);
  const networkLabel = crypto?.network ?? "bitcoin";
  const qrValue = crypto?.qrPayload || crypto?.address || "";

  const handleConfirm = async () => {
    if (confirming || cancelling) return;
    const validationError = validateTxHash(txHash);
    if (validationError) {
      setTxHashError(validationError);
      return;
    }
    setTxHashError("");
    setConfirming(true);
    setConfirmError("");
    try {
      const response = await confirmBitcoinPayment(
        current.orderNumber,
        txHash,
      );
      setUpdatedPayment(response);
      setSubmitted(true);
      onUpdated?.();
    } catch (err) {
      if (
        err instanceof OrdersApiError &&
        err.code === API_ERROR_CODES.PAYMENT_ALREADY_UNDER_REVIEW
      ) {
        // Confirmation is already in — treat as success.
        setSubmitted(true);
        onUpdated?.();
      } else {
        // Keep the entered txHash so the user can retry.
        setConfirmError(
          err instanceof Error ? err.message : "Failed to confirm the payment",
        );
      }
    } finally {
      setConfirming(false);
    }
  };

  const handleCancelOrder = async () => {
    if (cancelling || confirming) return;
    setCancelling(true);
    setCancelError("");
    try {
      await cancelOrder(current.orderNumber);
      onUpdated?.();
      onClose();
    } catch (err) {
      setCancelError(
        err instanceof Error ? err.message : "Failed to cancel the order",
      );
    } finally {
      setCancelling(false);
    }
  };

  const reviewCrypto = updatedPayment?.payment.crypto ?? crypto;
  const reviewLate = isMarkedPaidLate(
    reviewCrypto?.markedPaidAt,
    reviewCrypto?.expiresAt,
  );

  const cancelSection =
    isPendingPayment && !state.isFinal ? (
      <div className="mt-4 border-t border-pr_dg/10 pt-4 text-center">
        {confirmingCancel ? (
          <div className="space-y-2">
            <p className="text-xs text-pr_dg/70">
              Cancel order #{current.orderNumber}? This cannot be undone.
            </p>
            {cancelError ? (
              <p className="text-xs text-pr_dr">{cancelError}</p>
            ) : null}
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={cancelling}
                className={`rounded-full px-4 py-2 text-xs font-semibold disabled:opacity-60 ${
                  state.cancelRecommended
                    ? "bg-pr_dr text-pr_w"
                    : "border border-pr_dr text-pr_dr"
                }`}
              >
                {cancelling ? "Cancelling..." : "Yes, cancel order"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmingCancel(false)}
                disabled={cancelling}
                className="rounded-full border border-pr_dg/30 px-4 py-2 text-xs"
              >
                Keep order
              </button>
            </div>
          </div>
        ) : state.cancelRecommended ? null : (
          <button
            type="button"
            onClick={() => setConfirmingCancel(true)}
            className="text-xs text-pr_dg/60 underline hover:text-pr_dr"
          >
            Cancel this order
          </button>
        )}
      </div>
    ) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-xl"
      closeOnBackdrop={false}
      showCloseButton
    >
      {submitted ? (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
            ₿
          </div>
          <h2 className="mt-4 text-xl font-semibold">
            Payment sent — awaiting verification
          </h2>
          <p className="mt-2 text-sm text-pr_dg/70">
            Thanks! We&apos;ll verify your Bitcoin transaction for order #
            {current.orderNumber} on the blockchain and update your order —
            you can follow the status on your orders page.
          </p>
          {reviewLate ? (
            <p className="mx-auto mt-3 max-w-md rounded-xl border border-amber-400 bg-amber-50 px-4 py-2 text-xs text-amber-800">
              Your confirmation arrived after the invoice expired. The exchange
              rate may have changed — our team will review the received amount.
            </p>
          ) : null}
          {reviewCrypto?.txHash ? (
            <div className="mt-3 text-xs text-pr_dg/70">
              Transaction ID:{" "}
              <CopyValue
                value={reviewCrypto.txHash}
                display={shortenTxHash(reviewCrypto.txHash)}
                label="Copy transaction ID"
                className="text-xs"
              />
            </div>
          ) : null}
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href={ordersHref}
              className="rounded-full bg-pr_dg px-5 py-2 text-sm font-semibold text-pr_w"
            >
              View my orders
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-pr_dg/30 px-5 py-2 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold">
            {state.canConfirm
              ? "Complete your Bitcoin payment"
              : "Bitcoin payment details"}
          </h2>
          <p className="mt-1 text-sm text-pr_dg/70">
            Order #{current.orderNumber}
            {state.canConfirm
              ? " — send the exact amount below to our Bitcoin address, then tell us you paid."
              : ""}
          </p>

          {/* Order status / payment status / derived Bitcoin state */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-pr_dg/30 px-3 py-1">
              Order: {prettyStatus(current.orderStatus)}
            </span>
            <span className="rounded-full border border-pr_dg/30 px-3 py-1">
              Payment: {prettyStatus(current.payment.status)}
            </span>
            <span
              className={`rounded-full border px-3 py-1 font-semibold ${toneBadgeClass[state.tone]}`}
            >
              {state.label}
            </span>
          </div>

          {state.cancelRecommended ? (
            <div className="mt-4 rounded-xl border border-pr_dr/40 bg-pr_dr/5 px-4 py-3 text-sm">
              <p className="font-semibold text-pr_dr">
                This payment invoice has expired
              </p>
              <p className="mt-1 text-xs text-pr_dg/80">
                The BTC exchange rate for this order is no longer valid. We
                recommend cancelling this order and placing a new one to get a
                fresh rate. If you already sent the Bitcoin, use &quot;I
                paid&quot; below instead.
              </p>
              {cancelError && !confirmingCancel ? (
                <p className="mt-2 text-xs text-pr_dr">{cancelError}</p>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmingCancel(true)}
                  disabled={cancelling || confirming}
                  className="rounded-full bg-pr_dr px-5 py-2 text-xs font-semibold text-pr_w disabled:opacity-60"
                >
                  Cancel order
                </button>
                <span className="text-xs text-pr_dg/60">
                  or continue with the payment below
                </span>
              </div>
            </div>
          ) : null}

          {state.key === "UNDER_REVIEW" ||
          state.key === "UNDER_REVIEW_ON_TIME" ||
          state.key === "UNDER_REVIEW_LATE" ? (
            <div className="mt-4 rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-sm text-blue-900">
              <p className="font-semibold">
                Payment sent — awaiting verification
              </p>
              <p className="mt-1 text-xs">
                We&apos;re verifying your transaction on the blockchain. Your
                order will update once the payment is confirmed.
              </p>
              {markedPaidLabel ? (
                <p className="mt-1 text-xs">
                  You confirmed on {markedPaidLabel}
                  {markedLate
                    ? " — after the invoice expired. The exchange rate may have changed; our team will review the received amount."
                    : " — within the invoice validity window."}
                </p>
              ) : null}
            </div>
          ) : null}

          {state.key === "CONFIRMED_PROCESSING" || state.key === "PAID" ? (
            <div className="mt-4 rounded-xl border border-green-500 bg-green-50 px-4 py-3 text-sm text-green-800">
              Your Bitcoin payment has been confirmed. Thank you!
            </div>
          ) : null}

          {state.key === "UNKNOWN" ? (
            <div className="mt-4 rounded-xl border border-amber-400 bg-amber-50 px-4 py-3 text-xs text-amber-800">
              This order needs attention — please contact support if it
              doesn&apos;t update soon.
            </div>
          ) : null}

          {/* Amount */}
          <div className="mt-4 rounded-2xl bg-pr_dg/5 p-4">
            <div className={detailRowClass}>
              <span className="text-sm text-pr_dg/60">Total</span>
              <span className="text-lg font-semibold">
                {formatPrice(current.totalAmountCents, current.currency)}
              </span>
            </div>
            {crypto ? (
              <div className={`${detailRowClass} mt-2`}>
                <span className="text-sm text-pr_dg/60">Amount to send</span>
                <CopyValue
                  value={crypto.amountBtc}
                  display={`${crypto.amountBtc} ${crypto.asset ?? "BTC"}`}
                  label="Copy Bitcoin amount"
                  className="text-lg font-bold"
                />
              </div>
            ) : null}
            {crypto?.amountSats != null ? (
              <p className="mt-1 text-right text-xs text-pr_dg/50">
                = {crypto.amountSats.toLocaleString()} sats
              </p>
            ) : null}
            {crypto?.exchangeRate?.rate ? (
              <p className="mt-2 border-t border-pr_dg/10 pt-2 text-xs text-pr_dg/60">
                Rate: 1 {crypto.exchangeRate.base ?? "BTC"} ={" "}
                {crypto.exchangeRate.rate}{" "}
                {crypto.exchangeRate.quote ?? current.currency}
                {crypto.exchangeRate.source
                  ? ` (via ${crypto.exchangeRate.source})`
                  : ""}
              </p>
            ) : null}
          </div>

          {/* QR — only while the payment is actionable */}
          {state.showQr && qrValue ? (
            <div className="mt-4 flex justify-center">
              <div className="rounded-2xl border border-pr_dg/15 bg-white p-4">
                <QRCode value={qrValue} size={168} aria-label="Payment QR code" />
              </div>
            </div>
          ) : null}

          {/* Invoice details */}
          {crypto ? (
            <div className="mt-4 space-y-3 rounded-2xl border border-pr_dg/15 p-4 text-sm">
              <div className={detailRowClass}>
                <span className="shrink-0 text-pr_dg/60">Bitcoin address</span>
                <CopyValue
                  value={crypto.address}
                  label="Copy Bitcoin address"
                  className="text-xs sm:text-sm"
                />
              </div>
              <div className={detailRowClass}>
                <span className="text-pr_dg/60">Network</span>
                <span className="font-medium">{networkLabel}</span>
              </div>
              {current.payment.reference ? (
                <div className={detailRowClass}>
                  <span className="text-pr_dg/60">Payment reference</span>
                  <span className="font-mono text-xs font-medium sm:text-sm">
                    {current.payment.reference}
                  </span>
                </div>
              ) : null}
              {expiresLabel ? (
                <div className={detailRowClass}>
                  <span className="text-pr_dg/60">
                    {state.key === "INVOICE_EXPIRED"
                      ? "Expired on"
                      : "Rate valid until"}
                  </span>
                  <span
                    className={`font-medium ${state.key === "INVOICE_EXPIRED" ? "text-pr_dr" : ""}`}
                  >
                    {expiresLabel}
                  </span>
                </div>
              ) : null}
              {markedPaidLabel ? (
                <div className={detailRowClass}>
                  <span className="text-pr_dg/60">Marked as paid</span>
                  <span className="font-medium">
                    {markedPaidLabel}
                    {markedLate ? " (after expiry)" : " (on time)"}
                  </span>
                </div>
              ) : null}
              {crypto.txHash ? (
                <div className={detailRowClass}>
                  <span className="shrink-0 text-pr_dg/60">Transaction ID</span>
                  <CopyValue
                    value={crypto.txHash}
                    display={shortenTxHash(crypto.txHash)}
                    label="Copy transaction ID"
                    className="text-xs sm:text-sm"
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-pr_dg/5 px-4 py-3 text-xs text-pr_dg/70">
              Payment details are no longer available for this order.
            </p>
          )}

          {/* "I paid" */}
          {state.canConfirm ? (
            <div className="mt-5 border-t border-pr_dg/10 pt-4">
              <p className="text-sm font-semibold">Already sent the Bitcoin?</p>
              <p className="mt-1 text-xs text-pr_dg/60">
                Optionally paste your transaction ID (txid) so we can verify
                faster. No screenshots or files needed.
              </p>
              <input
                type="text"
                value={txHash}
                onChange={(event) => {
                  setTxHash(event.target.value);
                  if (txHashError) setTxHashError("");
                }}
                placeholder="Transaction ID (optional)"
                spellCheck={false}
                className="mt-3 w-full rounded-full border border-pr_dg/30 px-4 py-2 font-mono text-xs outline-none focus:border-pr_dg sm:text-sm"
              />
              {txHashError ? (
                <p className="mt-2 text-xs text-pr_dr">{txHashError}</p>
              ) : null}
              {confirmError ? (
                <p className="mt-2 text-xs text-pr_dr">{confirmError}</p>
              ) : null}
              <button
                type="button"
                onClick={handleConfirm}
                disabled={confirming || cancelling}
                className="mt-4 w-full rounded-full bg-pr_dg px-4 py-3 text-sm font-semibold text-pr_w disabled:cursor-not-allowed disabled:opacity-50"
              >
                {confirming ? "Submitting..." : "I paid"}
              </button>
              <p className="mt-2 text-center text-xs text-pr_dg/60">
                Your order stays unpaid until we verify the transaction on the
                blockchain. You can close this window and come back later.
              </p>
            </div>
          ) : null}

          {cancelSection}
        </div>
      )}
    </Modal>
  );
}
