"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  fetchAdminProducts,
  deleteAdminProduct,
  AdminProduct,
} from "@/services/admin";
import { formatPrice } from "@/services/products";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const load = async (p: number, q: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchAdminProducts({ page: p, limit: 20, q: q || undefined });
      setProducts(res.items);
      setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(page, search);
  }, [page]);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      load(1, value);
    }, 300);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminProduct(id);
      load(page, search);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products ({total})</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-pr_lg px-5 py-2 text-sm font-semibold text-pr_dg"
        >
          + New Product
        </Link>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search products..."
        className="mt-4 w-full max-w-md rounded-full border border-pr_w/20 bg-transparent px-4 py-2 text-sm text-pr_w outline-none placeholder:text-pr_w/40"
      />

      {error ? <p className="mt-4 text-sm text-pr_dr">{error}</p> : null}

      {loading ? (
        <p className="mt-6 text-sm text-pr_w/60">Loading...</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pr_w/10 text-left text-pr_w/60">
                <th className="pb-3 pr-4">Image</th>
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Price</th>
                <th className="pb-3 pr-4">Stock</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-pr_w/5">
                  <td className="py-3 pr-4">
                    {product.image?.resolvedUrl ? (
                      <img
                        src={product.image.resolvedUrl}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-pr_w/10" />
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/products/edit?id=${product.id}`}
                      className="font-medium hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-pr_w/40">{product.slug}</p>
                  </td>
                  <td className="py-3 pr-4">
                    {formatPrice(product.priceCents, product.currency)}
                  </td>
                  <td className="py-3 pr-4">{product.stockQty}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        product.isActive
                          ? "bg-green-900/30 text-green-400"
                          : "bg-red-900/30 text-red-400"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/edit?id=${product.id}`}
                        className="rounded-full border border-pr_w/20 px-3 py-1 text-xs hover:bg-pr_w/5"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="rounded-full border border-red-500/30 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10"
                      >
                        Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="mt-6 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-full border border-pr_w/20 px-3 py-1 text-xs disabled:opacity-30"
          >
            Prev
          </button>
          <span className="text-xs text-pr_w/60">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-full border border-pr_w/20 px-3 py-1 text-xs disabled:opacity-30"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
