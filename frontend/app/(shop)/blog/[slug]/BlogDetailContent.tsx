"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchPublicBlog,
  fetchPublicBlogs,
  formatBlogDateTime,
  formatReadTime,
  type PublicBlogBlock,
  type PublicBlogDetail,
  type PublicBlogListItem,
} from "@/services/blog";
import { useDocumentSeo } from "@/lib/seo/useDocumentSeo";

function renderHtml(body: string) {
  return { __html: body };
}

function ContentBlock({ block }: { block: PublicBlogBlock }) {
  if (block.type === "text") {
    return (
      <div
        className="mt-4 text-sm leading-relaxed text-pr_dg/80 [&_h1]:mt-4 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:text-base [&_h3]:font-semibold [&_p]:mt-3 [&_a]:underline [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6"
        dangerouslySetInnerHTML={renderHtml(block.body)}
      />
    );
  }
  if (block.type === "image") {
    if (!block.image?.url) return null;
    return (
      <div className="mt-6">
        <img
          src={block.image.url}
          alt={block.image.alt ?? ""}
          className="w-full rounded-2xl object-cover"
        />
      </div>
    );
  }
  if (block.type === "text_image") {
    const imgFirst = block.imagePosition === "left";
    return (
      <div className="mt-6 grid gap-6 md:grid-cols-2 md:items-center">
        {imgFirst && block.image?.url ? (
          <img
            src={block.image.url}
            alt={block.image.alt ?? ""}
            className="w-full rounded-2xl object-cover"
          />
        ) : null}
        <div
          className="text-sm leading-relaxed text-pr_dg/80 [&_h1]:mt-2 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mt-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-2 [&_h3]:text-base [&_h3]:font-semibold [&_p]:mt-2 [&_a]:underline"
          dangerouslySetInnerHTML={renderHtml(block.body)}
        />
        {!imgFirst && block.image?.url ? (
          <img
            src={block.image.url}
            alt={block.image.alt ?? ""}
            className="w-full rounded-2xl object-cover"
          />
        ) : null}
      </div>
    );
  }
  return null;
}

export default function BlogDetailContent({ slug }: { slug: string }) {
  const [post, setPost] = useState<PublicBlogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [similar, setSimilar] = useState<PublicBlogListItem[]>([]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchPublicBlog(slug)
      .then((res) => {
        if (active) setPost(res);
      })
      .catch(() => {
        if (active) setPost(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    let active = true;
    fetchPublicBlogs({ page: 1, limit: 6 })
      .then((res) => {
        if (active) {
          setSimilar(res.items.filter((item) => item.slug !== slug).slice(0, 3));
        }
      })
      .catch(() => {
        if (active) setSimilar([]);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  useDocumentSeo(
    post
      ? {
          title: post.seoMetadata?.title || post.title,
          description: post.seoMetadata?.description || post.excerpt,
          keywords: post.seoMetadata?.keywords,
          robots: post.seoMetadata?.robots || "index,follow",
          ogTitle: post.seoMetadata?.ogTitle,
          ogDescription: post.seoMetadata?.ogDescription,
          ogImage: post.seoMetadata?.ogImage || post.mainImage?.url,
          canonicalUrl: `/blog/${post.slug}`,
        }
      : null,
  );

  if (loading) {
    return (
      <div className="bg-pr_dg text-pr_w">
        <section className="w-full px-4 pt-[120px] pb-20 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
          <p className="text-sm text-pr_w/70">Loading…</p>
        </section>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-pr_dg text-pr_w">
        <section className="w-full px-4 pt-[120px] pb-20 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
          <p className="text-sm text-pr_w/70">
            Article not found.{" "}
            <Link href="/blog" className="text-pr_y">
              Back to Blog
            </Link>
          </p>
        </section>
      </div>
    );
  }

  const publishedAt = formatBlogDateTime(post.publishedAt);
  const readingTime = formatReadTime(post.readTime);
  const categoryName = post.category?.name;

  return (
    <div className="bg-pr_dg text-pr_w">
      <section className="w-full px-4 pt-[120px] pb-24 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
        <p className="text-sm text-pr_w/70">
          <Link href="/blog" className="hover:text-pr_w">
            Blog
          </Link>{" "}
          {categoryName ? `/ ${categoryName} ` : ""}/ {post.title}
        </p>

        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.8fr] lg:items-start">
          <div className="overflow-hidden rounded-3xl bg-pr_w text-pr_dg">
            <div
              className="h-[280px] w-full bg-sr_dg sm:h-[360px]"
              style={
                post.mainImage?.url
                  ? {
                      backgroundImage: `url(${post.mainImage.url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            />
            <div className="px-6 py-6 sm:px-8 sm:py-8">
              {post.content && post.content.length > 0 ? (
                post.content.map((block, index) => (
                  <ContentBlock key={index} block={block} />
                ))
              ) : (
                <p className="text-sm text-pr_dg/60">
                  This article has no content yet.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-pr_w p-6 text-pr_dg sm:p-7">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
              <div>
                <p className="text-pr_dg/60">Category</p>
                <p className="font-semibold">{categoryName || "-"}</p>
              </div>
              <div>
                <p className="text-pr_dg/60">Reading Time</p>
                <p className="font-semibold">{readingTime || "-"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-pr_dg/60">Published</p>
                <p className="font-semibold">{publishedAt || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold">Other Articles</h2>
          {similar.length === 0 ? (
            <p className="mt-4 text-sm text-pr_w/60">
              More articles are coming soon.
            </p>
          ) : (
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="text-pr_w"
                >
                  <article>
                    <div
                      className="relative h-56 w-full rounded-br-3xl rounded-tl-3xl bg-pr_w/10 sm:h-60"
                      style={
                        item.mainImage?.url
                          ? {
                              backgroundImage: `url(${item.mainImage.url})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }
                          : undefined
                      }
                    >
                      {item.category?.name ? (
                        <span className="absolute right-4 top-4 rounded-full bg-sr_dg px-4 py-2 text-xs font-semibold text-pr_w">
                          {item.category.name}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold sm:text-xl">
                      {item.title}
                    </h3>
                    {item.excerpt ? (
                      <p className="mt-2 text-sm text-pr_w/70 sm:text-base">
                        {item.excerpt}
                      </p>
                    ) : null}
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
