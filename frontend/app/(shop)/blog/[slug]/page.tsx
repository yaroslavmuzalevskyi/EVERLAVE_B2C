import Link from "next/link";
import { blogPosts } from "@/lib/blog";

type BlogPageProps = {
  params: { slug: string } | Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: BlogPageProps) {
  const resolvedParams = await params;
  const post = blogPosts.find((item) => item.slug === resolvedParams.slug);

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

  const similar = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <div className="bg-pr_dg text-pr_w">
      <section className="w-full px-4 pt-[120px] pb-24 sm:px-6 md:px-8 lg:px-12 xl:px-[130px]">
        <p className="text-sm text-pr_w/70">
          <Link href="/blog" className="hover:text-pr_w">
            Blog
          </Link>{" "}
          / {post.tag} / {post.title}
        </p>

        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          <div>
            <div className="h-[280px] w-full rounded-2xl bg-sr_dg sm:h-[360px]" />
            <div className="mt-6 rounded-2xl bg-pr_w p-6 text-pr_dg">
              {post.sections.map((section) => (
                <div key={section.heading} className="mb-6 last:mb-0">
                  <h2 className="text-lg font-semibold">{section.heading}</h2>
                  {section.body.map((paragraph, index) => (
                    <p key={`${section.heading}-${index}`} className="mt-3 text-sm text-pr_dg/80">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-pr_w p-5 text-pr_dg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-pr_dg/60">Publication Date</p>
                  <p className="font-semibold">{post.publishedAt}</p>
                </div>
                <div>
                  <p className="text-pr_dg/60">Category</p>
                  <p className="font-semibold">{post.tag}</p>
                </div>
                <div>
                  <p className="text-pr_dg/60">Reading Time</p>
                  <p className="font-semibold">{post.readingTime}</p>
                </div>
                <div>
                  <p className="text-pr_dg/60">Views</p>
                  <p className="font-semibold">{post.views}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-pr_w p-5 text-pr_dg">
              {post.sections.map((section) => (
                <p key={section.heading} className="border-b border-pr_dg/10 py-3 text-sm font-semibold last:border-none">
                  {section.heading}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold">Similar Articles</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((item) => (
              <Link key={item.slug} href={`/blog/${item.slug}`} className="text-pr_w">
                <article>
                  <div className="relative h-56 w-full rounded-br-3xl rounded-tl-3xl bg-pr_w sm:h-60">
                    <span className="absolute right-4 top-4 rounded-full bg-sr_dg px-4 py-2 text-xs font-semibold text-pr_w">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-pr_w/70 sm:text-base">
                    {item.description}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
