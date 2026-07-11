"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import { formatPrice } from "@/services/products";
import {
  API_ERROR_CODES,
  OpenPayment,
  OrdersApiError,
  PAYMENT_STATUS,
  PROOF_ACCEPT_ATTRIBUTE,
  cancelOrder,
  uploadPaymentProof,
  validateProofFile,
} from "@/services/orders";

type PaymentModalProps = {
  payment: OpenPayment | null;
  isOpen: boolean;
  onClose: () => void;
  /** Called after the payment changed server-side (proof uploaded / cancelled). */
  onUpdated?: () => void;
  ordersHref?: string;
};

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

const detailRowClass =
  "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between";

export default function PaymentModal({
  payment,
  isOpen,
  onClose,
  onUpdated,
  ordersHref = "/user_profile/orders",
}: PaymentModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [copiedField, setCopiedField] = useState<"reference" | "iban" | null>(
    null,
  );

  // Reset transient state whenever the modal opens for a (new) payment.
  useEffect(() => {
    if (!isOpen) return;
    setFile(null);
    setFileError("");
    setUploading(false);
    setUploadError("");
    setSubmitted(false);
    setConfirmingCancel(false);
    setCancelling(false);
    setCancelError("");
    setCopiedField(null);
  }, [isOpen, payment?.orderNumber]);

  if (!payment) return null;

  const bank = payment.payment.bankAccount ?? {};
  const reference = payment.payment.reference;
  const isPending = payment.payment.status === PAYMENT_STATUS.PENDING;

  const copyToClipboard = async (value: string, field: "reference" | "iban") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => {
        setCopiedField((current) => (current === field ? null : current));
      }, 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — user can select manually.
    }
  };

  const handleFileChange = (selected: File | null) => {
    setUploadError("");
    if (!selected) {
      setFile(null);
      setFileError("");
      return;
    }
    const error = validateProofFile(selected);
    if (error) {
      setFile(null);
      setFileError(error);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFileError("");
    setFile(selected);
  };

  const handleConfirm = async () => {
    if (!file || uploading) return;
    setUploading(true);
    setUploadError("");
    try {
      await uploadPaymentProof(payment.orderNumber, file);
      setSubmitted(true);
      onUpdated?.();
    } catch (err) {
      if (
        err instanceof OrdersApiError &&
        err.code === API_ERROR_CODES.PAYMENT_ALREADY_UNDER_REVIEW
      ) {
        // Proof is already in — treat as success.
        setSubmitted(true);
        onUpdated?.();
      } else {
        setUploadError(
          err instanceof Error ? err.message : "Failed to upload payment proof",
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (cancelling) return;
    setCancelling(true);
    setCancelError("");
    try {
      await cancelOrder(payment.orderNumber);
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl">
      {submitted ? (
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
            ✓
          </div>
          <h2 className="mt-4 text-xl font-semibold">
            We&apos;re reviewing your payment
          </h2>
          <p className="mt-2 text-sm text-pr_dg/70">
            Your proof of payment for order #{payment.orderNumber} has been
            received. Our team will verify the transfer and update your order —
            you can follow the status on your orders page.
          </p>
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
          <h2 className="text-xl font-semibold">Complete your payment</h2>
          <p className="mt-1 text-sm text-pr_dg/70">
            Order #{payment.orderNumber} — transfer the amount below to our
            bank account, then upload your proof of payment.
          </p>

          {/* Single method for now; becomes a selector when more methods (e.g. crypto) are added. */}
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-pr_dg/60">Payment method</span>
            <span className="rounded-full border border-pr_dg/30 px-3 py-1 text-xs font-semibold">
              Bank transfer
            </span>
          </div>

          <div className="mt-4 rounded-2xl bg-pr_dg/5 p-4">
            <div className={detailRowClass}>
              <span className="text-sm text-pr_dg/60">Amount</span>
              <span className="text-lg font-semibold">
                {formatPrice(payment.totalAmountCents, payment.currency)}
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-3 rounded-2xl border border-pr_dg/15 p-4 text-sm">
            {bank.accountHolder ? (
              <div className={detailRowClass}>
                <span className="text-pr_dg/60">Account holder</span>
                <span className="font-medium">{bank.accountHolder}</span>
              </div>
            ) : null}
            {bank.bankName ? (
              <div className={detailRowClass}>
                <span className="text-pr_dg/60">Bank</span>
                <span className="font-medium">{bank.bankName}</span>
              </div>
            ) : null}
            {bank.iban ? (
              <div className={detailRowClass}>
                <span className="text-pr_dg/60">IBAN</span>
                <span className="flex items-center gap-2">
                  <span className="break-all font-mono text-xs font-medium sm:text-sm">
                    {bank.iban}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(bank.iban!, "iban")}
                    className="shrink-0 rounded-full border border-pr_dg/30 px-3 py-1 text-xs"
                  >
                    {copiedField === "iban" ? "Copied!" : "Copy"}
                  </button>
                </span>
              </div>
            ) : null}
            {bank.bic ? (
              <div className={detailRowClass}>
                <span className="text-pr_dg/60">BIC</span>
                <span className="font-mono text-xs font-medium sm:text-sm">
                  {bank.bic}
                </span>
              </div>
            ) : null}
          </div>

          {reference ? (
            <div className="mt-4 rounded-2xl border-2 border-pr_dg bg-pr_w p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-pr_dg/60">
                Payment reference
              </p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <span className="break-all font-mono text-lg font-bold">
                  {reference}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(reference, "reference")}
                  className="shrink-0 rounded-full bg-pr_dg px-4 py-2 text-xs font-semibold text-pr_w"
                >
                  {copiedField === "reference" ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="mt-2 text-xs font-medium text-pr_dr">
                Include this reference in your transfer, otherwise we can&apos;t
                match your payment.
              </p>
            </div>
          ) : null}

          <div className="mt-5 border-t border-pr_dg/10 pt-4">
            <p className="text-sm font-semibold">Proof of payment</p>
            <p className="mt-1 text-xs text-pr_dg/60">
              Upload a receipt or screenshot of your transfer (JPEG, PNG, WEBP,
              HEIC/HEIF or PDF, max 10 MB).
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept={PROOF_ACCEPT_ATTRIBUTE}
              className="hidden"
              onChange={(event) =>
                handleFileChange(event.target.files?.[0] ?? null)
              }
            />

            {file ? (
              <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-pr_dg/5 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-pr_dg/60">
                    {formatBytes(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="shrink-0 rounded-full border border-pr_dg/30 px-3 py-1 text-xs disabled:opacity-60"
                >
                  Replace
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 w-full rounded-xl border border-dashed border-pr_dg/40 px-4 py-6 text-sm text-pr_dg/70 hover:border-pr_dg/70"
              >
                Choose a file...
              </button>
            )}

            {fileError ? (
              <p className="mt-2 text-xs text-pr_dr">{fileError}</p>
            ) : null}
            {uploadError ? (
              <p className="mt-2 text-xs text-pr_dr">{uploadError}</p>
            ) : null}

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!file || uploading}
              className="mt-4 w-full rounded-full bg-pr_dg px-4 py-3 text-sm font-semibold text-pr_w disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Confirm"}
            </button>
            <p className="mt-2 text-center text-xs text-pr_dg/60">
              Your order stays unpaid until proof is uploaded. You can close
              this window and come back later.
            </p>
          </div>

          {isPending ? (
            <div className="mt-4 border-t border-pr_dg/10 pt-4 text-center">
              {confirmingCancel ? (
                <div className="space-y-2">
                  <p className="text-xs text-pr_dg/70">
                    Cancel order #{payment.orderNumber}? This cannot be undone.
                  </p>
                  {cancelError ? (
                    <p className="text-xs text-pr_dr">{cancelError}</p>
                  ) : null}
                  <div className="flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleCancelOrder}
                      disabled={cancelling}
                      className="rounded-full border border-pr_dr px-4 py-2 text-xs font-semibold text-pr_dr disabled:opacity-60"
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
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingCancel(true)}
                  className="text-xs text-pr_dg/60 underline hover:text-pr_dr"
                >
                  Cancel this order
                </button>
              )}
            </div>
          ) : null}
        </div>
      )}
    </Modal>
  );
}
