"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchPublicBlogs,
  type PublicBlogListItem,
} from "@/services/blog";

export default function BlogPage() {
  const [posts, setPosts] = useState<PublicBlogListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchPublicBlogs({ page: 1, limit: 50 })
      .then((res) => {
        if (active) setPosts(res.items);
      })
      .catch(() => {
        if (active) setPosts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-pr_dg text-pr_w">
      <section className="w-full px-4 pt-[120px] pb-20 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">All Articles</h1>
            <p className="mt-2 text-sm text-pr_w/70 sm:text-base">
              Our blog features in-depth articles designed to educate and inform
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="text-sm text-pr_w/70">Loading…</p>
          ) : posts.length === 0 ? (
            <p className="text-sm text-pr_w/70">No articles yet.</p>
          ) : (
            posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="text-pr_w"
              >
                <article>
                  <div
                    className="relative h-56 w-full rounded-br-3xl rounded-tl-3xl bg-pr_w/10 sm:h-60"
                    style={
                      post.mainImage?.url
                        ? {
                            backgroundImage: `url(${post.mainImage.url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : undefined
                    }
                  >
                    {post.draft ? (
                      <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">
                        Draft
                      </span>
                    ) : null}
                    {post.category?.name ? (
                      <span className="absolute right-4 top-4 rounded-full bg-sr_dg px-4 py-2 text-xs font-semibold text-pr_w">
                        {post.category.name}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold sm:text-xl">
                    {post.title}
                  </h3>
                  {post.excerpt ? (
                    <p className="mt-2 text-sm text-pr_w/70 sm:text-base">
                      {post.excerpt}
                    </p>
                  ) : null}
                </article>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
