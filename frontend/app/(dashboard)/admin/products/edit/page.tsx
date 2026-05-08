"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  fetchAdminProduct,
  updateAdminProduct,
  uploadProductImage,
  deleteProductImage,
  updateProductImage,
  createProductPacks,
  updateProductPack,
  AdminProduct,
} from "@/services/admin";
import { formatPrice } from "@/services/products";

type PackDraft = {
  id: string;
  name: string;
  paidQty: number;
  bonusQty: number;
  priceCents: number;
  currency: string;
  isActive: boolean;
  sortOrder: number;
};

type NewPackDraft = {
  name: string;
  paidQty: number;
  bonusQty: number;
  priceCents: number;
};

const emptyNewPack: NewPackDraft = {
  name: "",
  paidQty: 1,
  bonusQty: 0,
  priceCents: 0,
};

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
  const [genBalance, setGenBalance] = useState("");
  const [indicaPct, setIndicaPct] = useState<number | "">("");
  const [sativaPct, setSativaPct] = useState<number | "">("");
  const [effectsText, setEffectsText] = useState("");

  const [packs, setPacks] = useState<PackDraft[]>([]);
  const [packBusyId, setPackBusyId] = useState<string | null>(null);
  const [newPack, setNewPack] = useState<NewPackDraft>(emptyNewPack);
  const [creatingPack, setCreatingPack] = useState(false);

  const hydrateFromProduct = (p: AdminProduct) => {
    setProduct(p);
    setName(p.name);
    setPriceCents(p.priceCents);
    setStockQty(p.stockQty);
    setIsActive(p.isActive);
    setDescription(p.content?.description ?? "");
    setSubtitle(p.content?.subtitle ?? "");
    setGenBalance(p.content?.gen_balance_desk ?? "");
    setIndicaPct(
      typeof p.content?.geneticBalance?.indica === "number"
        ? p.content.geneticBalance.indica
        : "",
    );
    setSativaPct(
      typeof p.content?.geneticBalance?.sativa === "number"
        ? p.content.geneticBalance.sativa
        : "",
    );
    setEffectsText((p.content?.effects ?? []).join(", "));
    setPacks(
      (p.packs ?? []).map((pack) => ({
        id: pack.id,
        name: pack.name,
        paidQty: pack.paidQty,
        bonusQty: pack.bonusQty,
        priceCents: pack.priceCents,
        currency: pack.currency,
        isActive: pack.isActive,
        sortOrder: pack.sortOrder,
      })),
    );
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchAdminProduct(id)
      .then(hydrateFromProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const reload = async () => {
    if (!id) return;
    const fresh = await fetchAdminProduct(id);
    hydrateFromProduct(fresh);
    return fresh;
  };

  const handleSave = async () => {
    if (!id || !product) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const normalizedPriceCents = Number.isFinite(priceCents)
        ? Math.max(0, Math.trunc(priceCents))
        : 0;
      const normalizedStockQty = Number.isFinite(stockQty)
        ? Math.max(0, Math.trunc(stockQty))
        : 0;
      const effects = effectsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const indicaNum =
        typeof indicaPct === "number" && Number.isFinite(indicaPct)
          ? Math.max(0, Math.min(100, indicaPct))
          : undefined;
      const sativaNum =
        typeof sativaPct === "number" && Number.isFinite(sativaPct)
          ? Math.max(0, Math.min(100, sativaPct))
          : undefined;
      const geneticBalance =
        indicaNum !== undefined || sativaNum !== undefined
          ? {
              ...(product.content?.geneticBalance ?? {}),
              ...(indicaNum !== undefined ? { indica: indicaNum } : {}),
              ...(sativaNum !== undefined ? { sativa: sativaNum } : {}),
            }
          : product.content?.geneticBalance;

      await updateAdminProduct(id, {
        name: name.trim(),
        priceCents: normalizedPriceCents,
        stockQty: normalizedStockQty,
        isActive,
        content: {
          ...(product.content ?? {}),
          subtitle: subtitle.trim(),
          description: description.trim(),
          gen_balance_desk: genBalance.trim(),
          effects,
          ...(geneticBalance ? { geneticBalance } : {}),
        },
      });
      const fresh = await reload();
      if (!fresh) return;

      const savedAsExpected =
        fresh.name === name.trim() &&
        fresh.priceCents === normalizedPriceCents &&
        fresh.stockQty === normalizedStockQty &&
        fresh.isActive === isActive;

      if (savedAsExpected) {
        setSuccess("Saved.");
      } else {
        setError(
          "Backend accepted the request but some fields were not updated.",
        );
      }
      setTimeout(() => setSuccess(""), 6000);
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
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleImageSortOrderChange = async (imageId: string, sortOrder: number) => {
    if (!id) return;
    try {
      await updateProductImage(id, imageId, { sortOrder });
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update image order");
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!id) return;
    try {
      await deleteProductImage(id, imageId);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
    }
  };

  const updatePackDraft = (packId: string, patch: Partial<PackDraft>) => {
    setPacks((prev) =>
      prev.map((p) => (p.id === packId ? { ...p, ...patch } : p)),
    );
  };

  const handleSavePack = async (pack: PackDraft) => {
    if (!id) return;
    setPackBusyId(pack.id);
    setError("");
    try {
      await updateProductPack(id, pack.id, {
        name: pack.name.trim(),
        paidQty: Math.max(0, Math.trunc(pack.paidQty)),
        bonusQty: Math.max(0, Math.trunc(pack.bonusQty)),
        priceCents: Math.max(0, Math.trunc(pack.priceCents)),
        isActive: pack.isActive,
        sortOrder: Math.max(0, Math.trunc(pack.sortOrder)),
      });
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save pack");
    } finally {
      setPackBusyId(null);
    }
  };

  const handleTogglePackActive = async (pack: PackDraft) => {
    if (!id) return;
    setPackBusyId(pack.id);
    setError("");
    try {
      await updateProductPack(id, pack.id, { isActive: !pack.isActive });
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update pack");
    } finally {
      setPackBusyId(null);
    }
  };

  const handleCreatePack = async () => {
    if (!id) return;
    if (!newPack.name.trim()) {
      setError("Pack name is required");
      return;
    }
    setCreatingPack(true);
    setError("");
    try {
      await createProductPacks(id, [
        {
          name: newPack.name.trim(),
          paidQty: Math.max(0, Math.trunc(newPack.paidQty)),
          bonusQty: Math.max(0, Math.trunc(newPack.bonusQty)),
          priceCents: Math.max(0, Math.trunc(newPack.priceCents)),
          sortOrder: packs.length,
        },
      ]);
      setNewPack(emptyNewPack);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create pack");
    } finally {
      setCreatingPack(false);
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
  const smallInputClass =
    "w-full rounded-lg border border-pr_w/20 bg-transparent px-3 py-1.5 text-xs text-pr_w outline-none placeholder:text-pr_w/30";

  return (
    <div className="max-w-5xl">
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
          <div>
            <label className="text-xs text-pr_w/50">Genetic balance description</label>
            <input
              type="text"
              value={genBalance}
              onChange={(e) => setGenBalance(e.target.value)}
              placeholder="e.g. 60/40"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-pr_w/50">Indica %</label>
              <input
                type="number"
                min={0}
                max={100}
                value={indicaPct}
                onChange={(e) => {
                  const raw = e.target.value;
                  setIndicaPct(raw === "" ? "" : Number(raw));
                }}
                placeholder="60"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-pr_w/50">Sativa %</label>
              <input
                type="number"
                min={0}
                max={100}
                value={sativaPct}
                onChange={(e) => {
                  const raw = e.target.value;
                  setSativaPct(raw === "" ? "" : Number(raw));
                }}
                placeholder="40"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-pr_w/50">Effects (comma-separated)</label>
            <input
              type="text"
              value={effectsText}
              onChange={(e) => setEffectsText(e.target.value)}
              placeholder="Relaxed, Happy"
              className={inputClass}
            />
          </div>
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
                <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 text-xs">
                  <span className="text-pr_w/60">order</span>
                  <input
                    type="number"
                    defaultValue={img.sortOrder}
                    onBlur={(e) => {
                      const next = Number(e.target.value);
                      if (Number.isFinite(next) && next !== img.sortOrder) {
                        handleImageSortOrderChange(img.id, Math.max(0, Math.trunc(next)));
                      }
                    }}
                    className="w-12 rounded bg-transparent text-pr_w outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-semibold text-pr_w/80">Packs</h2>

        <div className="mt-3 space-y-3">
          {packs.length === 0 ? (
            <p className="text-xs text-pr_w/40">No packs yet.</p>
          ) : null}

          {packs.map((pack) => (
            <div
              key={pack.id}
              className={`rounded-2xl border px-4 py-3 ${
                pack.isActive ? "border-pr_w/10" : "border-red-500/20 opacity-70"
              }`}
            >
              <div className="grid gap-2 md:grid-cols-[1.5fr_0.7fr_0.7fr_1fr_0.6fr_auto] md:items-end">
                <div>
                  <label className="text-[10px] text-pr_w/40">Name</label>
                  <input
                    type="text"
                    value={pack.name}
                    onChange={(e) => updatePackDraft(pack.id, { name: e.target.value })}
                    className={smallInputClass}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-pr_w/40">Paid</label>
                  <input
                    type="number"
                    value={pack.paidQty}
                    onChange={(e) =>
                      updatePackDraft(pack.id, { paidQty: Number(e.target.value) })
                    }
                    className={smallInputClass}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-pr_w/40">Bonus</label>
                  <input
                    type="number"
                    value={pack.bonusQty}
                    onChange={(e) =>
                      updatePackDraft(pack.id, { bonusQty: Number(e.target.value) })
                    }
                    className={smallInputClass}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-pr_w/40">
                    Price (cents) = {formatPrice(pack.priceCents, pack.currency)}
                  </label>
                  <input
                    type="number"
                    value={pack.priceCents}
                    onChange={(e) =>
                      updatePackDraft(pack.id, { priceCents: Number(e.target.value) })
                    }
                    className={smallInputClass}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-pr_w/40">Order</label>
                  <input
                    type="number"
                    value={pack.sortOrder}
                    onChange={(e) =>
                      updatePackDraft(pack.id, { sortOrder: Number(e.target.value) })
                    }
                    className={smallInputClass}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSavePack(pack)}
                    disabled={packBusyId === pack.id}
                    className="rounded-full bg-pr_lg px-3 py-1.5 text-xs font-semibold text-pr_dg disabled:opacity-60"
                  >
                    {packBusyId === pack.id ? "..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTogglePackActive(pack)}
                    disabled={packBusyId === pack.id}
                    className={`rounded-full border px-3 py-1.5 text-xs disabled:opacity-60 ${
                      pack.isActive
                        ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                        : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                    }`}
                  >
                    {pack.isActive ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-pr_w/20 px-4 py-3">
          <p className="text-xs text-pr_w/60">Add new pack</p>
          <div className="mt-2 grid gap-2 md:grid-cols-[1.5fr_0.7fr_0.7fr_1fr_auto] md:items-end">
            <div>
              <label className="text-[10px] text-pr_w/40">Name</label>
              <input
                type="text"
                value={newPack.name}
                onChange={(e) => setNewPack({ ...newPack, name: e.target.value })}
                placeholder="Single"
                className={smallInputClass}
              />
            </div>
            <div>
              <label className="text-[10px] text-pr_w/40">Paid</label>
              <input
                type="number"
                value={newPack.paidQty}
                onChange={(e) =>
                  setNewPack({ ...newPack, paidQty: Number(e.target.value) })
                }
                className={smallInputClass}
              />
            </div>
            <div>
              <label className="text-[10px] text-pr_w/40">Bonus</label>
              <input
                type="number"
                value={newPack.bonusQty}
                onChange={(e) =>
                  setNewPack({ ...newPack, bonusQty: Number(e.target.value) })
                }
                className={smallInputClass}
              />
            </div>
            <div>
              <label className="text-[10px] text-pr_w/40">Price (cents)</label>
              <input
                type="number"
                value={newPack.priceCents}
                onChange={(e) =>
                  setNewPack({ ...newPack, priceCents: Number(e.target.value) })
                }
                className={smallInputClass}
              />
            </div>
            <button
              type="button"
              onClick={handleCreatePack}
              disabled={creatingPack}
              className="rounded-full bg-pr_lg px-4 py-1.5 text-xs font-semibold text-pr_dg disabled:opacity-60"
            >
              {creatingPack ? "Adding..." : "+ Add"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-pr_w/10 pt-6">
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

        {error ? <span className="text-sm text-pr_dr">{error}</span> : null}
        {success ? <span className="text-sm text-green-400">{success}</span> : null}
      </div>
    </div>
  );
}
