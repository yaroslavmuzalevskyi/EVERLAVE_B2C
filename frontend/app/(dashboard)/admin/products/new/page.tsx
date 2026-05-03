"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminProduct } from "@/services/admin";

export default function AdminProductNewPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceCents, setPriceCents] = useState(0);
  const [stockQty, setStockQty] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [categorySlug, setCategorySlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (priceCents <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const product = await createAdminProduct({
        name: name.trim(),
        content: {
          subtitle: subtitle.trim() || undefined,
          description: description.trim() || undefined,
        },
        priceCents,
        stockQty,
        isActive,
        categorySlug: categorySlug.trim() || undefined,
      });
      router.push(`/admin/products/edit?id=${product.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-pr_w/20 bg-transparent px-4 py-2 text-sm text-pr_w outline-none placeholder:text-pr_w/30";

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="text-sm text-pr_w/60 hover:text-pr_w"
        >
          &larr; Back
        </button>
        <h1 className="text-2xl font-semibold">New Product</h1>
      </div>

      {error ? <p className="mt-4 text-sm text-pr_dr">{error}</p> : null}

      <div className="mt-8 space-y-4">
        <div>
          <label className="text-xs text-pr_w/50">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product name"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs text-pr_w/50">Subtitle</label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Short subtitle"
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-pr_w/50">Price (cents) *</label>
            <input
              type="number"
              value={priceCents}
              onChange={(e) => setPriceCents(Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-pr_w/50">Stock</label>
            <input
              type="number"
              value={stockQty}
              onChange={(e) => setStockQty(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-pr_w/50">Category slug</label>
          <input
            type="text"
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            placeholder="e.g. feminized"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs text-pr_w/50">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Product description"
            className={`${inputClass} min-h-[100px] rounded-2xl`}
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs text-pr_w/50">Active</label>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`h-6 w-11 rounded-full transition ${
              isActive ? "bg-green-500" : "bg-pr_w/20"
            }`}
          >
            <span
              className={`block h-5 w-5 rounded-full bg-white transition ${
                isActive ? "translate-x-5.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          disabled={saving}
          className="rounded-full bg-pr_lg px-6 py-2 text-sm font-semibold text-pr_dg disabled:opacity-60"
        >
          {saving ? "Creating..." : "Create product"}
        </button>
      </div>
    </div>
  );
}
