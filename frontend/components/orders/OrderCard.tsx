type OrderCardProps = {
  orderId: string;
  product: string;
  price: string;
  quantity: string;
  total: string;
  statusDate: string;
  statusLabel: string;
};

export default function OrderCard({
  orderId,
  product,
  price,
  quantity,
  total,
  statusDate,
  statusLabel,
}: OrderCardProps) {
  return (
    <div className="w-full rounded-2xl bg-pr_w px-6 py-5 text-pr_dg shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs text-pr_dg/60">Order ID</p>
          <p className="text-lg font-semibold">{orderId}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-pr_dg/30 px-4 py-2 text-xs">
            {statusDate}
          </span>
          <span className="rounded-full border border-pr_dg/30 px-4 py-2 text-xs">
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-semibold">Product</p>
          <p className="mt-1 text-sm text-pr_dg/80">{product}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Price</p>
          <p className="mt-1 text-sm text-pr_dg/80">{price}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Quantity</p>
          <p className="mt-1 text-sm text-pr_dg/80">{quantity}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Total</p>
          <p className="mt-1 text-sm text-pr_dg/80">{total}</p>
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold">Total: {total}</p>
    </div>
  );
}
