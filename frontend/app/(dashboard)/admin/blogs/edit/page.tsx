"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  fetchAdminBlog,
  fetchAdminBlogCategories,
  fetchAdminBlogImages,
  updateAdminBlog,
  uploadAdminBlogImage,
  updateAdminBlogImage,
  deleteAdminBlogImage,
  EMPTY_BLOG_SEO,
  type AdminBlog,
  type AdminBlogCategory,
  type AdminBlogImage,
  type BlogContentBlock,
  type BlogSeoMetadata,
} from "@/services/adminBlog";

type EditableSeo = BlogSeoMetadata;

const inputClass =
  "w-full rounded-xl border border-pr_w/20 bg-transparent px-3 py-2 text-sm outline-none";
const smallInputClass =
  "w-full rounded-lg border border-pr_w/15 bg-transparent px-2 py-1 text-xs outline-none";

export default function AdminBlogEditPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [blog, setBlog] = useState<AdminBlog | null>(null);
  const [categories, setCategories] = useState<AdminBlogCategory[]>([]);
  const [images, setImages] = useState<AdminBlogImage[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [readTime, setReadTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [mainImageId, setMainImageId] = useState<string | null>(null);
  const [content, setContent] = useState<BlogContentBlock[]>([]);
  const [seo, setSeo] = useState<EditableSeo>(EMPTY_BLOG_SEO);

  const hydrate = (b: AdminBlog) => {
    setBlog(b);
    setTitle(b.title ?? "");
    setSlug(b.slug ?? "");
    setExcerpt(b.excerpt ?? "");
    setReadTime(b.readTime ?? 0);
    setIsActive(Boolean(b.isActive));
    setPublishedAt(b.publishedAt ?? null);
    setCategoryId(b.category?.id ?? b.categoryId ?? "");
    setMainImageId(b.mainImageId ?? b.mainImage?.id ?? null);
    setContent(Array.isArray(b.content) ? b.content : []);
    const seoRaw = (b.seoMetadata ?? {}) as Partial<BlogSeoMetadata>;
    setSeo({
      title: seoRaw.title ?? "",
      description: seoRaw.description ?? "",
      keywords: Array.isArray(seoRaw.keywords) ? seoRaw.keywords : [],
      robots: seoRaw.robots ?? "index,follow",
      ogTitle: seoRaw.ogTitle ?? "",
      ogDescription: seoRaw.ogDescription ?? "",
    });
  };

  const loadAll = async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const [b, cats, imgs] = await Promise.all([
        fetchAdminBlog(id),
        fetchAdminBlogCategories().catch(() => [] as AdminBlogCategory[]),
        fetchAdminBlogImages(id).catch(() => [] as AdminBlogImage[]),
      ]);
      hydrate(b);
      setCategories(cats);
      setImages(imgs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  const reloadImages = async () => {
    if (!id) return;
    try {
      const imgs = await fetchAdminBlogImages(id);
      setImages(imgs);
    } catch {}
  };

  useEffect(() => {
    loadAll();
  }, [id]);

  const handlePublishNow = async () => {
    if (!id) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await updateAdminBlog(id, { publish: true });
      const fresh = await fetchAdminBlog(id);
      hydrate(fresh);
      setSuccess("Published.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const sanitizedContent = content.map((block) => {
        if (block.type === "text") {
          return { type: "text", body: block.body };
        }
        if (block.type === "image") {
          return { type: "image", imageId: block.imageId };
        }
        return {
          type: "text_image",
          imagePosition: block.imagePosition,
          body: block.body,
          imageId: block.imageId,
        };
      });

      const payload: Record<string, unknown> = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        readTime: Number.isFinite(readTime)
          ? Math.max(0, Math.trunc(readTime))
          : 0,
        isActive,
        mainImageId: mainImageId ?? null,
        content: sanitizedContent,
        seoMetadata: {
          title: seo.title,
          description: seo.description,
          keywords: seo.keywords,
          robots: seo.robots || "index,follow",
          ogTitle: seo.ogTitle,
          ogDescription: seo.ogDescription,
        },
      };
      if (categoryId) payload.categoryId = categoryId;
      await updateAdminBlog(id, payload);
      const fresh = await fetchAdminBlog(id);
      hydrate(fresh);
      setSuccess("Saved.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    setUploading(true);
    setError("");
    try {
      await uploadAdminBlogImage(id, file);
      await reloadImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAltChange = async (imageId: string, alt: string) => {
    if (!id) return;
    try {
      await updateAdminBlogImage(id, imageId, { alt: alt.trim() || null });
      await reloadImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update alt");
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!id) return;
    if (!window.confirm("Delete image?")) return;
    try {
      await deleteAdminBlogImage(id, imageId);
      if (mainImageId === imageId) setMainImageId(null);
      setContent((prev) =>
        prev.map((b) => {
          if (b.type === "image" && b.imageId === imageId) {
            return { ...b, imageId: "" } as BlogContentBlock;
          }
          if (b.type === "text_image" && b.imageId === imageId) {
            return { ...b, imageId: "" } as BlogContentBlock;
          }
          return b;
        }),
      );
      await reloadImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
    }
  };

  const updateBlock = (index: number, patch: Partial<BlogContentBlock>) => {
    setContent((prev) =>
      prev.map((b, i) =>
        i === index ? ({ ...b, ...patch } as BlogContentBlock) : b,
      ),
    );
  };

  const removeBlock = (index: number) => {
    setContent((prev) => prev.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, dir: -1 | 1) => {
    setContent((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const addBlock = (kind: BlogContentBlock["type"]) => {
    setContent((prev) => {
      if (kind === "text") {
        return [...prev, { type: "text", body: "" }];
      }
      if (kind === "image") {
        return [...prev, { type: "image", imageId: "" }];
      }
      return [
        ...prev,
        { type: "text_image", imagePosition: "left", body: "", imageId: "" },
      ];
    });
  };

  if (!id) {
    return (
      <p className="text-sm text-pr_w/60">
        Missing blog id.{" "}
        <Link href="/admin/blogs" className="underline">
          Back
        </Link>
      </p>
    );
  }

  if (loading) {
    return <p className="text-sm text-pr_w/60">Loading…</p>;
  }

  if (!blog) {
    return (
      <p className="text-sm text-pr_w/60">
        Blog not found.{" "}
        <Link href="/admin/blogs" className="underline">
          Back
        </Link>
      </p>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Blog</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="text-sm text-pr_w/60 hover:text-pr_w"
          >
            ← Back
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-pr_lg px-5 py-2 text-sm font-semibold text-pr_dg disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-pr_dr">{error}</p> : null}
      {success ? <p className="mt-4 text-sm text-green-400">{success}</p> : null}

      {!publishedAt ? (
        <div className="mt-4 flex flex-col gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Draft - never published. Click <b>Publish now</b> to make this blog
            visible on the public site.
          </span>
          <button
            type="button"
            onClick={handlePublishNow}
            disabled={saving}
            className="rounded-full bg-pr_lg px-4 py-1.5 text-xs font-semibold text-pr_dg disabled:opacity-60"
          >
            {saving ? "Publishing…" : "Publish now"}
          </button>
        </div>
      ) : isActive ? (
        <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs text-green-300">
          Active - visible on /blog
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-pr_w/15 bg-pr_w/5 px-4 py-2 text-xs text-pr_w/70">
          Inactive - hidden from /blog (previously published on{" "}
          {new Date(publishedAt).toLocaleString()})
        </div>
      )}

      <section className="mt-6 space-y-4">
        <h2 className="text-sm font-semibold text-pr_w/80">Basic info</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs text-pr_w/60">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
            {slug ? (
              <p className="mt-1 text-[10px] text-pr_w/40">slug: {slug}</p>
            ) : null}
          </div>
          <div>
            <label className="text-xs text-pr_w/60">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={inputClass}
            >
              <option value="" className="bg-pr_dg">
                -
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-pr_dg">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-pr_w/60">Read time (minutes)</label>
            <input
              type="number"
              min={0}
              value={readTime}
              onChange={(e) =>
                setReadTime(Math.max(0, Number(e.target.value) || 0))
              }
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-pr_w/60">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
          {publishedAt ? (
            <div className="md:col-span-2 flex items-center gap-2">
              <input
                id="isActive"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <label htmlFor="isActive" className="text-sm">
                Active (visible on /blog)
              </label>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-pr_w/80">
            Image library ({images.length})
          </h2>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-pr_w/30 bg-pr_w/5 px-4 py-8 text-sm font-semibold text-pr_w hover:bg-pr_w/10 disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "+ Click to upload image (jpeg, png, webp, gif · max 5MB)"}
        </button>

        <div className="mt-4">
          <label className="text-xs text-pr_w/60">Main image (cover)</label>
          <select
            value={mainImageId ?? ""}
            onChange={(e) => setMainImageId(e.target.value || null)}
            className={inputClass}
          >
            <option value="" className="bg-pr_dg">
              - none -
            </option>
            {images.map((img) => (
              <option key={img.id} value={img.id} className="bg-pr_dg">
                {img.alt || img.id.slice(0, 8)}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
          {images.length === 0 ? (
            <p className="text-xs text-pr_w/40">No images uploaded yet.</p>
          ) : null}
          {images.map((img) => (
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
              {mainImageId === img.id ? (
                <span className="absolute top-2 left-2 rounded-full bg-pr_lg px-2 py-0.5 text-[10px] font-semibold text-pr_dg">
                  Main
                </span>
              ) : null}
              <input
                type="text"
                defaultValue={img.alt ?? ""}
                placeholder="alt text"
                onBlur={(e) => {
                  const next = e.target.value;
                  if ((next || "") !== (img.alt || "")) {
                    handleAltChange(img.id, next);
                  }
                }}
                className="mt-1 w-full rounded bg-pr_w/5 px-2 py-1 text-[10px] text-pr_w outline-none"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-pr_w/80">Content blocks</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => addBlock("text")}
            className="rounded-full border border-pr_w/20 px-3 py-1 text-xs"
          >
            + Text
          </button>
          <button
            type="button"
            onClick={() => addBlock("image")}
            className="rounded-full border border-pr_w/20 px-3 py-1 text-xs"
          >
            + Image
          </button>
          <button
            type="button"
            onClick={() => addBlock("text_image")}
            className="rounded-full border border-pr_w/20 px-3 py-1 text-xs"
          >
            + Text + Image
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {content.length === 0 ? (
            <p className="text-xs text-pr_w/40">No content blocks.</p>
          ) : null}
          {content.map((block, index) => (
            <BlockEditor
              key={index}
              block={block}
              index={index}
              total={content.length}
              images={images}
              onUpdate={(patch) => updateBlock(index, patch)}
              onRemove={() => removeBlock(index)}
              onMove={(dir) => moveBlock(index, dir)}
            />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-pr_w/80">SEO</h2>
        <p className="mt-1 text-[11px] text-pr_w/40">
          All 5 fields are always sent on save. canonicalUrl/ogImage are
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

      <div className="mt-10 flex justify-end gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-pr_lg px-6 py-2 text-sm font-semibold text-pr_dg disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

function BlockEditor({
  block,
  index,
  total,
  images,
  onUpdate,
  onRemove,
  onMove,
}: {
  block: BlogContentBlock;
  index: number;
  total: number;
  images: AdminBlogImage[];
  onUpdate: (patch: Partial<BlogContentBlock>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  return (
    <div className="rounded-2xl border border-pr_w/10 px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-pr_w/60">
          #{index + 1} · {block.type}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            className="rounded border border-pr_w/15 px-2 py-0.5 text-[10px] text-pr_w/70 disabled:opacity-40"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            className="rounded border border-pr_w/15 px-2 py-0.5 text-[10px] text-pr_w/70 disabled:opacity-40"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded border border-red-500/30 px-2 py-0.5 text-[10px] text-red-400 hover:bg-red-500/10"
          >
            Remove
          </button>
        </div>
      </div>

      {block.type === "text" ? (
        <textarea
          value={block.body}
          onChange={(e) => onUpdate({ body: e.target.value })}
          rows={5}
          placeholder="HTML body, e.g. <p>Hello</p>"
          className={`mt-2 ${inputClass}`}
        />
      ) : null}

      {block.type === "image" ? (
        <div className="mt-2">
          <label className="text-[10px] text-pr_w/40">Pick image</label>
          <select
            value={block.imageId}
            onChange={(e) => onUpdate({ imageId: e.target.value })}
            className={smallInputClass}
          >
            <option value="" className="bg-pr_dg">
              - choose -
            </option>
            {images.map((img) => (
              <option key={img.id} value={img.id} className="bg-pr_dg">
                {img.alt || img.id.slice(0, 8)}
              </option>
            ))}
          </select>
          {block.imageId ? (
            <ImagePreview imageId={block.imageId} images={images} />
          ) : null}
        </div>
      ) : null}

      {block.type === "text_image" ? (
        <div className="mt-2 grid gap-2 md:grid-cols-[1fr_2fr]">
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-pr_w/40">Image position</label>
              <select
                value={block.imagePosition}
                onChange={(e) =>
                  onUpdate({
                    imagePosition: e.target.value as "left" | "right",
                  })
                }
                className={smallInputClass}
              >
                <option value="left" className="bg-pr_dg">
                  left
                </option>
                <option value="right" className="bg-pr_dg">
                  right
                </option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-pr_w/40">Image</label>
              <select
                value={block.imageId}
                onChange={(e) => onUpdate({ imageId: e.target.value })}
                className={smallInputClass}
              >
                <option value="" className="bg-pr_dg">
                  - choose -
                </option>
                {images.map((img) => (
                  <option key={img.id} value={img.id} className="bg-pr_dg">
                    {img.alt || img.id.slice(0, 8)}
                  </option>
                ))}
              </select>
              {block.imageId ? (
                <ImagePreview imageId={block.imageId} images={images} />
              ) : null}
            </div>
          </div>
          <textarea
            value={block.body}
            onChange={(e) => onUpdate({ body: e.target.value })}
            rows={6}
            placeholder="HTML body"
            className={inputClass}
          />
        </div>
      ) : null}
    </div>
  );
}

function ImagePreview({
  imageId,
  images,
}: {
  imageId: string;
  images: AdminBlogImage[];
}) {
  const img = images.find((i) => i.id === imageId);
  if (!img) return null;
  return (
    <img
      src={img.resolvedUrl || img.url || ""}
      alt={img.alt ?? ""}
      className="mt-2 h-20 w-full rounded object-cover"
    />
  );
}
