import Link from "next/link";
import { blogPosts } from "@/lib/blog";

export default function BlogPage() {
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
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="text-pr_w">
              <article>
                <div className="relative h-56 w-full rounded-br-3xl rounded-tl-3xl bg-pr_w sm:h-60">
                  <span className="absolute right-4 top-4 rounded-full bg-sr_dg px-4 py-2 text-xs font-semibold text-pr_w">
                    {post.tag}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold sm:text-xl">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-pr_w/70 sm:text-base">
                  {post.description}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
