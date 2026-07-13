"use client";

import PaymentModal from "@/components/orders/PaymentModal";
import BitcoinPaymentModal from "@/components/orders/BitcoinPaymentModal";
import { OpenPayment, PAYMENT_METHOD_BITCOIN } from "@/services/orders";

type OpenPaymentModalProps = {
  payment: OpenPayment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
  ordersHref?: string;
};

/**
 * Dispatches an open payment to the modal matching its method:
 * BITCOIN -> BitcoinPaymentModal, everything else -> bank-transfer
 * PaymentModal (the existing default).
 */
export default function OpenPaymentModal(props: OpenPaymentModalProps) {
  if (props.payment?.payment.method === PAYMENT_METHOD_BITCOIN) {
    return <BitcoinPaymentModal {...props} />;
  }
  return <PaymentModal {...props} />;
}
