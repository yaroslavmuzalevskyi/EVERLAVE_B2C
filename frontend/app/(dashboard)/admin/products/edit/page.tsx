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
  createProductFilterValue,
  updateProductFilterValue,
  deleteProductFilterValue,
  AdminProduct,
  AdminFilterValue,
  EMPTY_PRODUCT_SEO,
  type AdminProductSeoMetadata,
} from "@/services/admin";
import { fetchCategoryFilters, CategoryFilter } from "@/services/categories";
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
  const [effectsText, setEffectsText] = useState("");
  const [seo, setSeo] = useState<AdminProductSeoMetadata>(EMPTY_PRODUCT_SEO);

  const [packs, setPacks] = useState<PackDraft[]>([]);
  const [packBusyId, setPackBusyId] = useState<string | null>(null);
  const [newPack, setNewPack] = useState<NewPackDraft>(emptyNewPack);
  const [creatingPack, setCreatingPack] = useState(false);

  const [categoryFilters, setCategoryFilters] = useState<CategoryFilter[]>([]);
  const [filterBusyId, setFilterBusyId] = useState<string | null>(null);
  const [newFilterSlug, setNewFilterSlug] = useState("");
  const [newFilterDraft, setNewFilterDraft] = useState<{
    optionValue: string;
    booleanValue: boolean;
    numberValue: string;
    numberMin: string;
    numberMax: string;
  }>({
    optionValue: "",
    booleanValue: false,
    numberValue: "",
    numberMin: "",
    numberMax: "",
  });
  const [creatingFilter, setCreatingFilter] = useState(false);

  const hydrateFromProduct = (p: AdminProduct) => {
    setProduct(p);
    setName(p.name);
    setPriceCents(p.priceCents);
    setStockQty(p.stockQty);
    setIsActive(p.isActive);
    setDescription(p.content?.description ?? "");
    setSubtitle(p.subtitle ?? p.content?.subtitle ?? "");
    setGenBalance(p.content?.gen_balance_desk ?? "");
    setEffectsText((p.content?.effects ?? []).join(", "));
    const seoRaw = (p.seoMetadata ?? {}) as Partial<AdminProductSeoMetadata>;
    setSeo({
      title: seoRaw.title ?? "",
      description: seoRaw.description ?? "",
      keywords: Array.isArray(seoRaw.keywords) ? seoRaw.keywords : [],
      robots: seoRaw.robots ?? "index,follow",
      ogTitle: seoRaw.ogTitle ?? "",
      ogDescription: seoRaw.ogDescription ?? "",
    });
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
      .then((p) => {
        hydrateFromProduct(p);
        if (p.category?.slug) {
          fetchCategoryFilters(p.category.slug)
            .then(setCategoryFilters)
            .catch(() => setCategoryFilters([]));
        }
      })
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

      await updateAdminProduct(id, {
        name: name.trim(),
        subtitle: subtitle.trim(),
        priceCents: normalizedPriceCents,
        stockQty: normalizedStockQty,
        isActive,
        content: {
          ...(product.content ?? {}),
          subtitle: subtitle.trim(),
          description: description.trim(),
          gen_balance_desk: genBalance,
          effects,
        },
        seoMetadata: {
          title: seo.title,
          description: seo.description,
          keywords: seo.keywords,
          robots: seo.robots || "index,follow",
          ogTitle: seo.ogTitle,
          ogDescription: seo.ogDescription,
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

  const handleImageAltChange = async (imageId: string, alt: string) => {
    if (!id) return;
    try {
      await updateProductImage(id, imageId, { alt: alt.trim() || null });
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update alt");
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

  const handleArchivePack = async (pack: PackDraft) => {
    if (!id) return;
    if (!window.confirm(`Archive pack "${pack.name}"? It won't be shown anymore.`)) {
      return;
    }
    setPackBusyId(pack.id);
    setError("");
    try {
      await updateProductPack(id, pack.id, { isArchived: true });
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive pack");
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

  const resetNewFilterDraft = () => {
    setNewFilterSlug("");
    setNewFilterDraft({
      optionValue: "",
      booleanValue: false,
      numberValue: "",
      numberMin: "",
      numberMax: "",
    });
  };

  const handleCreateFilterValue = async () => {
    if (!id) return;
    const filter = categoryFilters.find((f) => f.slug === newFilterSlug);
    if (!filter) {
      setError("Pick a filter first");
      return;
    }
    setCreatingFilter(true);
    setError("");
    try {
      const payload: Record<string, unknown> = { filterSlug: filter.slug };
      if (filter.type === "select" || filter.type === "multi") {
        if (!newFilterDraft.optionValue.trim()) {
          setError("Option value is required");
          setCreatingFilter(false);
          return;
        }
        payload.optionValue = newFilterDraft.optionValue.trim();
      } else if (filter.type === "boolean") {
        payload.booleanValue = newFilterDraft.booleanValue;
      } else if (filter.type === "number") {
        const n = Number(newFilterDraft.numberValue);
        if (!Number.isFinite(n)) {
          setError("Number value is required");
          setCreatingFilter(false);
          return;
        }
        payload.numberValue = n;
      } else if (filter.type === "range") {
        const min = Number(newFilterDraft.numberMin);
        const max = Number(newFilterDraft.numberMax);
        if (!Number.isFinite(min) || !Number.isFinite(max)) {
          setError("Min and max are required for range filter");
          setCreatingFilter(false);
          return;
        }
        payload.numberMin = min;
        payload.numberMax = max;
      }
      await createProductFilterValue(id, payload);
      resetNewFilterDraft();
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add filter");
    } finally {
      setCreatingFilter(false);
    }
  };

  const handleUpdateFilterValue = async (
    fv: AdminFilterValue,
    data: Parameters<typeof updateProductFilterValue>[2],
  ) => {
    if (!id) return;
    setFilterBusyId(fv.id);
    setError("");
    try {
      await updateProductFilterValue(id, fv.id, data);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update filter");
    } finally {
      setFilterBusyId(null);
    }
  };

  const handleDeleteFilterValue = async (fv: AdminFilterValue) => {
    if (!id) return;
    if (!window.confirm(`Delete filter "${fv.filter.name}"?`)) return;
    setFilterBusyId(fv.id);
    setError("");
    try {
      await deleteProductFilterValue(id, fv.id);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete filter");
    } finally {
      setFilterBusyId(null);
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
                min={0}
                value={priceCents}
                onChange={(e) => setPriceCents(Math.max(0, Number(e.target.value)))}
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
                min={0}
                value={stockQty}
                onChange={(e) => setStockQty(Math.max(0, Number(e.target.value)))}
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
            <textarea
              value={genBalance}
              onChange={(e) => setGenBalance(e.target.value)}
              rows={4}
              placeholder="Free-form text. Line breaks are preserved."
              className={`${inputClass} min-h-[100px] rounded-2xl`}
            />
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
                  alt={img.alt ?? ""}
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
                    min={0}
                    defaultValue={img.sortOrder}
                    onBlur={(e) => {
                      const raw = Number(e.target.value);
                      const next = Number.isFinite(raw)
                        ? Math.max(0, Math.trunc(raw))
                        : img.sortOrder;
                      e.target.value = String(next);
                      if (next !== img.sortOrder) {
                        handleImageSortOrderChange(img.id, next);
                      }
                    }}
                    className="w-12 rounded bg-transparent text-pr_w outline-none"
                  />
                </div>
                <input
                  type="text"
                  defaultValue={img.alt ?? ""}
                  placeholder="alt text"
                  onBlur={(e) => {
                    const next = e.target.value;
                    if ((next || "") !== (img.alt || "")) {
                      handleImageAltChange(img.id, next);
                    }
                  }}
                  className="mt-1 w-full rounded bg-pr_w/5 px-2 py-1 text-[10px] text-pr_w outline-none"
                />
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
              <div className="grid gap-2 md:grid-cols-[1.5fr_0.6fr_auto] md:items-end">
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
                  <label className="text-[10px] text-pr_w/40">Order</label>
                  <input
                    type="number"
                    min={0}
                    value={pack.sortOrder}
                    onChange={(e) =>
                      updatePackDraft(pack.id, {
                        sortOrder: Math.max(0, Number(e.target.value)),
                      })
                    }
                    className={smallInputClass}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
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
                  {!pack.isActive ? (
                    <button
                      type="button"
                      onClick={() => handleArchivePack(pack)}
                      disabled={packBusyId === pack.id}
                      className="rounded-full border border-pr_w/30 px-3 py-1.5 text-xs text-pr_w/70 hover:bg-pr_w/5 disabled:opacity-60"
                    >
                      Archive
                    </button>
                  ) : null}
                </div>
              </div>
              <p className="mt-2 text-[11px] text-pr_w/40">
                {pack.paidQty}+{pack.bonusQty} · {formatPrice(pack.priceCents, pack.currency)} · price &amp; quantities are locked after creation
              </p>
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
                min={0}
                value={newPack.paidQty}
                onChange={(e) =>
                  setNewPack({
                    ...newPack,
                    paidQty: Math.max(0, Number(e.target.value)),
                  })
                }
                className={smallInputClass}
              />
            </div>
            <div>
              <label className="text-[10px] text-pr_w/40">Bonus</label>
              <input
                type="number"
                min={0}
                value={newPack.bonusQty}
                onChange={(e) =>
                  setNewPack({
                    ...newPack,
                    bonusQty: Math.max(0, Number(e.target.value)),
                  })
                }
                className={smallInputClass}
              />
            </div>
            <div>
              <label className="text-[10px] text-pr_w/40">Price (cents)</label>
              <input
                type="number"
                min={0}
                value={newPack.priceCents}
                onChange={(e) =>
                  setNewPack({
                    ...newPack,
                    priceCents: Math.max(0, Number(e.target.value)),
                  })
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

      <FilterValuesSection
        productFilterValues={product.filterValues ?? []}
        categoryFilters={categoryFilters}
        newFilterSlug={newFilterSlug}
        setNewFilterSlug={setNewFilterSlug}
        newFilterDraft={newFilterDraft}
        setNewFilterDraft={setNewFilterDraft}
        creatingFilter={creatingFilter}
        filterBusyId={filterBusyId}
        onCreate={handleCreateFilterValue}
        onUpdate={handleUpdateFilterValue}
        onDelete={handleDeleteFilterValue}
        smallInputClass={smallInputClass}
      />

      <section className="mt-10 border-t border-pr_w/10 pt-6">
        <h2 className="text-sm font-semibold text-pr_w/80">SEO</h2>
        <p className="mt-1 text-[11px] text-pr_w/40">
          All 6 fields are always sent on save. canonicalUrl/ogImage are
          derived server-side.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs text-pr_w/60">SEO title</label>
            <input
              type="text"
              value={seo.title}
              onChange={(e) => setSeo({ ...seo, title: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-pr_w/60">SEO description</label>
            <input
              type="text"
              value={seo.description}
              onChange={(e) => setSeo({ ...seo, description: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-pr_w/60">OG title</label>
            <input
              type="text"
              value={seo.ogTitle}
              onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-pr_w/60">OG description</label>
            <input
              type="text"
              value={seo.ogDescription}
              onChange={(e) =>
                setSeo({ ...seo, ogDescription: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-pr_w/60">Robots</label>
            <select
              value={
                ["index,follow", "noindex,follow", "noindex,nofollow"].includes(
                  seo.robots,
                )
                  ? seo.robots
                  : "index,follow"
              }
              onChange={(e) => setSeo({ ...seo, robots: e.target.value })}
              className={inputClass}
            >
              <option value="index,follow" className="bg-pr_dg">
                index, follow (default - visible to search engines)
              </option>
              <option value="noindex,follow" className="bg-pr_dg">
                noindex, follow (don&apos;t index, follow links)
              </option>
              <option value="noindex,nofollow" className="bg-pr_dg">
                noindex, nofollow (hide from search engines)
              </option>
            </select>
          </div>
          <div>
            <label className="text-xs text-pr_w/60">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={(seo.keywords ?? []).join(", ")}
              onChange={(e) =>
                setSeo({
                  ...seo,
                  keywords: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className={inputClass}
            />
          </div>
        </div>
      </section>

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

type NewFilterDraft = {
  optionValue: string;
  booleanValue: boolean;
  numberValue: string;
  numberMin: string;
  numberMax: string;
};

function FilterValuesSection({
  productFilterValues,
  categoryFilters,
  newFilterSlug,
  setNewFilterSlug,
  newFilterDraft,
  setNewFilterDraft,
  creatingFilter,
  filterBusyId,
  onCreate,
  onUpdate,
  onDelete,
  smallInputClass,
}: {
  productFilterValues: AdminFilterValue[];
  categoryFilters: CategoryFilter[];
  newFilterSlug: string;
  setNewFilterSlug: (v: string) => void;
  newFilterDraft: NewFilterDraft;
  setNewFilterDraft: (v: NewFilterDraft) => void;
  creatingFilter: boolean;
  filterBusyId: string | null;
  onCreate: () => void;
  onUpdate: (
    fv: AdminFilterValue,
    data: Parameters<typeof updateProductFilterValue>[2],
  ) => void;
  onDelete: (fv: AdminFilterValue) => void;
  smallInputClass: string;
}) {
  const usedFilterSlugs = new Set(
    productFilterValues.map((fv) => fv.filter.slug),
  );
  const availableFilters = categoryFilters.filter(
    (f) => f.type === "multi" || !usedFilterSlugs.has(f.slug),
  );
  const selectedFilter = availableFilters.find((f) => f.slug === newFilterSlug);

  return (
    <div className="mt-10">
      <h2 className="text-sm font-semibold text-pr_w/80">Filter values</h2>
      <p className="mt-1 text-xs text-pr_w/40">
        Per-product filter values. Available filters come from the product category.
      </p>

      <div className="mt-3 space-y-3">
        {productFilterValues.length === 0 ? (
          <p className="text-xs text-pr_w/40">No filter values set.</p>
        ) : null}

        {productFilterValues.map((fv) => (
          <FilterValueRow
            key={fv.id}
            fv={fv}
            busy={filterBusyId === fv.id}
            onUpdate={onUpdate}
            onDelete={onDelete}
            smallInputClass={smallInputClass}
          />
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-pr_w/20 px-4 py-3">
        <p className="text-xs text-pr_w/60">Add filter value</p>
        <div className="mt-2 grid gap-2 md:grid-cols-[1fr_2fr_auto] md:items-end">
          <div>
            <label className="text-[10px] text-pr_w/40">Filter</label>
            <select
              value={newFilterSlug}
              onChange={(e) => setNewFilterSlug(e.target.value)}
              className={smallInputClass}
            >
              <option value="" className="bg-pr_dg">
                Select filter…
              </option>
              {availableFilters.map((f) => (
                <option key={f.slug} value={f.slug} className="bg-pr_dg">
                  {f.name} ({f.type})
                </option>
              ))}
            </select>
          </div>
          <div>
            <NewFilterValueInputs
              filter={selectedFilter}
              draft={newFilterDraft}
              setDraft={setNewFilterDraft}
              smallInputClass={smallInputClass}
            />
          </div>
          <button
            type="button"
            onClick={onCreate}
            disabled={creatingFilter || !selectedFilter}
            className="rounded-full bg-pr_lg px-4 py-1.5 text-xs font-semibold text-pr_dg disabled:opacity-60"
          >
            {creatingFilter ? "Adding..." : "+ Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

function NewFilterValueInputs({
  filter,
  draft,
  setDraft,
  smallInputClass,
}: {
  filter: CategoryFilter | undefined;
  draft: NewFilterDraft;
  setDraft: (v: NewFilterDraft) => void;
  smallInputClass: string;
}) {
  if (!filter) {
    return <p className="text-[11px] text-pr_w/40">Pick a filter to enter a value.</p>;
  }

  if (filter.type === "select" || filter.type === "multi") {
    if (filter.options && filter.options.length > 0) {
      return (
        <select
          value={draft.optionValue}
          onChange={(e) => setDraft({ ...draft, optionValue: e.target.value })}
          className={smallInputClass}
        >
          <option value="" className="bg-pr_dg">
            Select option…
          </option>
          {filter.options.map((o) => (
            <option key={o.value} value={o.value} className="bg-pr_dg">
              {o.value}
            </option>
          ))}
        </select>
      );
    }
    return (
      <input
        type="text"
        value={draft.optionValue}
        onChange={(e) => setDraft({ ...draft, optionValue: e.target.value })}
        placeholder="Option value"
        className={smallInputClass}
      />
    );
  }

  if (filter.type === "boolean") {
    return (
      <select
        value={draft.booleanValue ? "true" : "false"}
        onChange={(e) =>
          setDraft({ ...draft, booleanValue: e.target.value === "true" })
        }
        className={smallInputClass}
      >
        <option value="true" className="bg-pr_dg">
          true
        </option>
        <option value="false" className="bg-pr_dg">
          false
        </option>
      </select>
    );
  }

  if (filter.type === "number") {
    return (
      <input
        type="number"
        value={draft.numberValue}
        onChange={(e) => setDraft({ ...draft, numberValue: e.target.value })}
        placeholder="Number"
        className={smallInputClass}
      />
    );
  }

  if (filter.type === "range") {
    return (
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          value={draft.numberMin}
          onChange={(e) => setDraft({ ...draft, numberMin: e.target.value })}
          placeholder="Min"
          className={smallInputClass}
        />
        <input
          type="number"
          value={draft.numberMax}
          onChange={(e) => setDraft({ ...draft, numberMax: e.target.value })}
          placeholder="Max"
          className={smallInputClass}
        />
      </div>
    );
  }

  return <p className="text-[11px] text-pr_w/40">Unsupported filter type.</p>;
}

function FilterValueRow({
  fv,
  busy,
  onUpdate,
  onDelete,
  smallInputClass,
}: {
  fv: AdminFilterValue;
  busy: boolean;
  onUpdate: (
    fv: AdminFilterValue,
    data: Parameters<typeof updateProductFilterValue>[2],
  ) => void;
  onDelete: (fv: AdminFilterValue) => void;
  smallInputClass: string;
}) {
  const type = fv.filter.type;

  const rangeFromValue = (() => {
    if (fv.range && typeof fv.range === "object") {
      const min = fv.range.min;
      const max = fv.range.max;
      if (min != null || max != null) {
        return { min: Number(min ?? max), max: Number(max ?? min) };
      }
    }
    if (
      fv.value &&
      typeof fv.value === "object" &&
      !Array.isArray(fv.value)
    ) {
      const obj = fv.value as { min?: number | null; max?: number | null };
      if (obj.min != null || obj.max != null) {
        return {
          min: Number(obj.min ?? obj.max),
          max: Number(obj.max ?? obj.min),
        };
      }
    }
    if (Array.isArray(fv.value) && fv.value.length >= 1) {
      const min = Number(fv.value[0]);
      const max = Number(fv.value[1] ?? fv.value[0]);
      if (Number.isFinite(min)) return { min, max };
    }
    if (typeof fv.value === "string") {
      const matches = fv.value.match(/-?\d+(?:\.\d+)?/g);
      if (matches && matches.length >= 2) {
        return { min: Number(matches[0]), max: Number(matches[1]) };
      }
      if (matches && matches.length === 1) {
        return { min: Number(matches[0]), max: Number(matches[0]) };
      }
    }
    return undefined;
  })();

  const numberFromValue = (() => {
    if (typeof fv.value === "number") return fv.value;
    if (typeof fv.value === "string") {
      const n = Number(fv.value);
      if (Number.isFinite(n)) return n;
    }
    return undefined;
  })();

  const [optionValue, setOptionValue] = useState(
    fv.option?.value ?? (typeof fv.value === "string" ? fv.value : ""),
  );
  const [boolValue, setBoolValue] = useState(Boolean(fv.booleanValue ?? fv.value));
  const [numberValue, setNumberValue] = useState(
    fv.numberValue != null
      ? String(fv.numberValue)
      : numberFromValue != null
        ? String(numberFromValue)
        : "",
  );
  const [numberMin, setNumberMin] = useState(
    fv.numberMin != null
      ? String(fv.numberMin)
      : fv.min != null
        ? String(fv.min)
        : rangeFromValue
          ? String(rangeFromValue.min)
          : "",
  );
  const [numberMax, setNumberMax] = useState(
    fv.numberMax != null
      ? String(fv.numberMax)
      : fv.max != null
        ? String(fv.max)
        : rangeFromValue
          ? String(rangeFromValue.max)
          : "",
  );

  const handleSave = () => {
    if (type === "select" || type === "multi") {
      onUpdate(fv, { optionValue: optionValue.trim() });
    } else if (type === "boolean") {
      onUpdate(fv, { booleanValue: boolValue });
    } else if (type === "number") {
      const n = Number(numberValue);
      if (!Number.isFinite(n)) return;
      onUpdate(fv, { numberValue: n });
    } else if (type === "range") {
      const min = Number(numberMin);
      const max = Number(numberMax);
      if (!Number.isFinite(min) || !Number.isFinite(max)) return;
      onUpdate(fv, { numberMin: min, numberMax: max });
    }
  };

  return (
    <div className="rounded-2xl border border-pr_w/10 px-4 py-3">
      <div className="grid gap-2 md:grid-cols-[1fr_2fr_auto] md:items-end">
        <div>
          <p className="text-xs text-pr_w/80">{fv.filter.name}</p>
          <p className="text-[10px] text-pr_w/40">type: {type}</p>
        </div>
        <div>
          {type === "select" || type === "multi" ? (
            <input
              type="text"
              value={optionValue}
              onChange={(e) => setOptionValue(e.target.value)}
              className={smallInputClass}
            />
          ) : null}
          {type === "boolean" ? (
            <select
              value={boolValue ? "true" : "false"}
              onChange={(e) => setBoolValue(e.target.value === "true")}
              className={smallInputClass}
            >
              <option value="true" className="bg-pr_dg">
                true
              </option>
              <option value="false" className="bg-pr_dg">
                false
              </option>
            </select>
          ) : null}
          {type === "number" ? (
            <input
              type="number"
              value={numberValue}
              onChange={(e) => setNumberValue(e.target.value)}
              className={smallInputClass}
            />
          ) : null}
          {type === "range" ? (
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={numberMin}
                onChange={(e) => setNumberMin(e.target.value)}
                placeholder="Min"
                className={smallInputClass}
              />
              <input
                type="number"
                value={numberMax}
                onChange={(e) => setNumberMax(e.target.value)}
                placeholder="Max"
                className={smallInputClass}
              />
            </div>
          ) : null}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={busy}
            className="rounded-full bg-pr_lg px-3 py-1.5 text-xs font-semibold text-pr_dg disabled:opacity-60"
          >
            {busy ? "..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => onDelete(fv)}
            disabled={busy}
            className="rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
