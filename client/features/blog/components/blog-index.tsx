"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Star } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { BlogCard } from "@/features/blog/components/blog-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { GridSkeleton } from "@/components/shared/skeletons";
import { cn } from "@/lib/utils";
import { usePosts } from "@/services/queries";

const ALL = "All";

export function BlogIndex() {
  const { data: posts = [], isPending, isError, error, refetch } = usePosts();
  const [category, setCategory] = useState<string>(ALL);
  const [search, setSearch] = useState("");

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))],
    [posts]
  );

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return posts
      .filter((p) => category === ALL || p.category === category)
      .filter((p) => !term || p.title.toLowerCase().includes(term) || p.excerpt.toLowerCase().includes(term))
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  }, [posts, category, search]);

  // The newest post gets the hero treatment, but only when nothing is filtered
  // out — otherwise a filtered list would jump around while the user types.
  const featured = category === ALL && !search.trim() ? visible[0] : undefined;
  const rest = featured ? visible.slice(1) : visible;

  return (
    <>
      <PageHeader
        icon={Search}
        gradient="from-orange-500 via-amber-500 to-yellow-500"
        title="The PrashnaHub Blog"
        description="Exam strategies, study plans and career guides written by toppers, teachers and counsellors — straight from the exam hall."
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        actions={
          <div className="w-full md:w-72">
            <label htmlFor="blog-search" className="sr-only">
              Search articles
            </label>
            <Input
              id="blog-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="h-11"
            />
          </div>
        }
      />

      <section className="py-12 md:py-16">
        <div className="container">
          {categories.length > 1 && (
            <div className="no-scrollbar mb-8 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    category === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-card hover:border-primary/40 hover:text-primary"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {isPending ? (
            <GridSkeleton count={6} />
          ) : isError ? (
            <ErrorState title="Could not load the blog" error={error} onRetry={() => void refetch()} />
          ) : visible.length === 0 ? (
            <EmptyState
              title="No articles found"
              description={
                search.trim()
                  ? `Nothing matches “${search.trim()}”. Try a different search.`
                  : "No articles in this category yet."
              }
              action={
                (search.trim() || category !== ALL) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearch("");
                      setCategory(ALL);
                    }}
                  >
                    Clear filters
                  </Button>
                )
              }
            />
          ) : (
            <>
              {featured && (
                <div className="mb-10 grid gap-6 lg:grid-cols-2 lg:items-stretch">
                  <div className="hidden lg:block">
                    <BlogCard post={featured} compact />
                  </div>
                  <div className="flex flex-col justify-center rounded-2xl border border-primary/30 bg-brand-gradient p-8 text-primary-foreground">
                    <Badge className="w-fit gap-1 bg-white/15 text-primary-foreground hover:bg-white/15">
                      <Star className="h-3 w-3" aria-hidden="true" />
                      Latest
                    </Badge>
                    <h2 className="mt-4 font-display text-2xl font-bold leading-snug text-pretty md:text-3xl">
                      {featured.title}
                    </h2>
                    <p className="mt-3 text-sm text-primary-foreground/80 text-pretty">
                      {featured.excerpt}
                    </p>
                    <Link
                      href={`/blog/${featured.slug}`}
                      className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary transition-transform hover:scale-[1.02]"
                    >
                      Read article
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
