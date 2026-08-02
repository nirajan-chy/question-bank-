import type { Metadata } from "next";
import { Newspaper, Search } from "lucide-react";
import { seo } from "@/lib/seo";
import { db } from "@/services/db";
import { PageHeader } from "@/components/shared/page-header";
import { BlogCard } from "@/features/blog/components/blog-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = seo({
  title: "Blog",
  description: "Exam strategies, study plans, career guides and scholarship updates for Nepali students — written by toppers, teachers and counsellors.",
  path: "/blog",
});

const categories = ["All", ...Array.from(new Set(db.posts.map((p) => p.category)))];

export default async function Page({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const active = category && categories.includes(category) ? category : "All";
  const posts = db.posts
    .filter((p) => active === "All" || p.category === active)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  const featured = posts[0];

  return (
    <>
      <PageHeader
        icon={Newspaper}
        gradient="from-orange-500 via-amber-500 to-yellow-500"
        title="The Sandarbh Blog"
        description="Exam strategies, study plans and career guides written by toppers, teachers and counsellors — straight from the exam hall."
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        actions={
          <form action="/blog" className="flex w-full max-w-xs items-center gap-2 rounded-xl border bg-background p-1 pl-3 md:w-64">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              name="category"
              defaultValue={active === "All" ? "" : active}
              placeholder="Filter by category..."
              className="h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button type="submit" className="hidden">Go</button>
          </form>
        }
      />

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
            {categories.map((c) => (
              <a
                key={c}
                href={c === "All" ? "/blog" : `/blog?category=${encodeURIComponent(c)}`}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  active === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary/40 hover:text-primary"
                )}
              >
                {c}
              </a>
            ))}
          </div>

          {featured && (
            <div className="mb-10 grid gap-6 lg:grid-cols-2 lg:items-stretch">
              <div className="hidden lg:block">
                <BlogCard post={featured} compact />
              </div>
              <div className="flex flex-col justify-center rounded-2xl border border-primary/30 bg-brand-gradient p-8 text-white">
                <Badge className="w-fit bg-white/15 text-white hover:bg-white/15">★ Featured</Badge>
                <h2 className="mt-4 font-display text-2xl font-bold leading-snug md:text-3xl">{featured.title}</h2>
                <p className="mt-3 text-sm text-white/80">{featured.excerpt}</p>
                <a href={`/blog/${featured.slug}`} className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary transition-transform hover:scale-[1.02]">
                  Read article →
                </a>
              </div>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
