"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  fetchAdminProduct,
  updateAdminProduct,
  uploadProductImage,
  deleteProductImage,
  AdminProduct,
} from "@/services/admin";
import { formatPrice } from "@/services/products";

export default function AdminProductEditPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [priceCents, setPriceCents] = useState(0);
  const [stockQty, setStockQty] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState("");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchAdminProduct(id)
      .then((p) => {
        setProduct(p);
        setName(p.name);
        setPriceCents(p.priceCents);
        setStockQty(p.stockQty);
        setIsActive(p.isActive);
        setDescription(p.content?.description ?? "");
        setSubtitle(p.content?.subtitle ?? "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await updateAdminProduct(id, {
        name,
        priceCents,
        stockQty,
        isActive,
        content: {
          ...product?.content,
          description,
          subtitle,
        },
      });
      setProduct(updated);
      setSuccess("Product updated");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    setUploading(true);
    setError("");
    try {
      await uploadProductImage(id, file, product?.images?.length ?? 0);
      const updated = await fetchAdminProduct(id);
      setProduct(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!id) return;
    try {
      await deleteProductImage(id, imageId);
      const updated = await fetchAdminProduct(id);
      setProduct(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
    }
  };

  if (!id) {
    return <p className="text-sm text-pr_dr">No product ID provided</p>;
  }

  if (loading) {
    return <p className="text-sm text-pr_w/60">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-sm text-pr_dr">{error || "Product not found"}</p>;
  }

  const inputClass =
    "w-full rounded-xl border border-pr_w/20 bg-transparent px-4 py-2 text-sm text-pr_w outline-none placeholder:text-pr_w/30";

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="text-sm text-pr_w/60 hover:text-pr_w"
        >
          &larr; Back
        </button>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <span
          className={`rounded-full px-2 py-1 text-xs ${
            isActive ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {error ? <p className="mt-4 text-sm text-pr_dr">{error}</p> : null}
      {success ? <p className="mt-4 text-sm text-green-400">{success}</p> : null}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-pr_w/80">Details</h2>
          <div>
            <label className="text-xs text-pr_w/50">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-pr_w/50">Subtitle</label>
            <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-pr_w/50">Price (cents)</label>
              <input
                type="number"
                value={priceCents}
                onChange={(e) => setPriceCents(Number(e.target.value))}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-pr_w/30">
                = {formatPrice(priceCents, product.currency)}
              </p>
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
            <label className="text-xs text-pr_w/50">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
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
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-pr_lg px-6 py-2 text-sm font-semibold text-pr_dg disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-pr_w/80">Images</h2>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full rounded-2xl border border-dashed border-pr_w/30 p-6 text-sm text-pr_w/50 hover:border-pr_w/50 transition disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Click to upload image"}
          </button>

          <div className="grid grid-cols-2 gap-3">
            {product.images?.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.resolvedUrl || img.url || ""}
                  alt=""
                  className="h-32 w-full rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img.id)}
                  className="absolute top-2 right-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition"
                >
                  Delete
                </button>
                <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs">
                  #{img.sortOrder}
                </span>
              </div>
            ))}
          </div>

          {product.packs && product.packs.length > 0 ? (
            <div>
              <h2 className="text-sm font-semibold text-pr_w/80">Packs</h2>
              <div className="mt-3 space-y-2">
                {product.packs.map((pack) => (
                  <div
                    key={pack.id}
                    className="flex items-center justify-between rounded-xl border border-pr_w/10 px-4 py-2 text-sm"
                  >
                    <span>{pack.name}</span>
                    <span className="text-pr_w/60">
                      {pack.paidQty}+{pack.bonusQty} = {pack.totalUnits} |{" "}
                      {formatPrice(pack.priceCents, pack.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
