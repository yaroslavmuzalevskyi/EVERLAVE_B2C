"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  fetchAdminBlogs,
  deleteAdminBlog,
  updateAdminBlog,
  type AdminBlog,
} from "@/services/adminBlog";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
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
      const res = await fetchAdminBlogs({
        page: p,
        limit: 20,
        q: q || undefined,
      });
      setBlogs(res.items);
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

  const handleToggleActive = async (blog: AdminBlog) => {
    try {
      await updateAdminBlog(blog.id, { publish: !blog.isActive });
      load(page, search);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update blog");
    }
  };

  const handleArchive = async (blog: AdminBlog) => {
    if (!window.confirm(`Archive blog "${blog.title}"?`)) return;
    try {
      await deleteAdminBlog(blog.id);
      load(page, search);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive");
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blogs ({total})</h1>
        <Link
          href="/admin/blogs/new"
          className="rounded-full bg-pr_lg px-5 py-2 text-sm font-semibold text-pr_dg"
        >
          + New Blog
        </Link>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search blogs..."
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
                <th className="pb-3 pr-4">Title</th>
                <th className="pb-3 pr-4">Category</th>
                <th className="pb-3 pr-4">Read Time</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-pr_w/60">
                    No blogs yet.
                  </td>
                </tr>
              ) : null}
              {blogs.map((blog) => (
                <tr key={blog.id} className="border-b border-pr_w/5">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/blogs/edit?id=${blog.id}`}
                      className="font-medium hover:underline"
                    >
                      {blog.title}
                    </Link>
                    <p className="text-xs text-pr_w/40">
                      {blog.excerpt || blog.slug}
                    </p>
                  </td>
                  <td className="py-3 pr-4">{blog.category?.name ?? "-"}</td>
                  <td className="py-3 pr-4">
                    {blog.readTime ? `${blog.readTime} min` : "-"}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        blog.isArchived
                          ? "bg-red-500/20 text-red-300"
                          : blog.isActive
                            ? "bg-green-500/20 text-green-300"
                            : "bg-pr_w/10 text-pr_w/60"
                      }`}
                    >
                      {blog.isArchived
                        ? "Archived"
                        : blog.isActive
                          ? "Active"
                          : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/blogs/edit?id=${blog.id}`}
                        className="rounded-full border border-pr_w/20 px-3 py-1 text-xs text-pr_w hover:bg-pr_w/10"
                      >
                        Edit
                      </Link>
                      {!blog.isArchived ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleToggleActive(blog)}
                            className={`rounded-full border px-3 py-1 text-xs ${
                              blog.isActive
                                ? "border-pr_w/20 text-pr_w"
                                : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                            }`}
                          >
                            {blog.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleArchive(blog)}
                            className="rounded-full border border-red-500/30 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10"
                          >
                            Archive
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 ? (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full border border-pr_w/20 px-3 py-1 text-xs disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-xs text-pr_w/60">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-full border border-pr_w/20 px-3 py-1 text-xs disabled:opacity-40"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
