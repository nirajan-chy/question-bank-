"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Search, SearchX } from "lucide-react";
import { useSearch } from "@/services/queries";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SubjectCard, NoteCard, BookCard, QuestionBankCard, MockTestCard, ScholarshipCard } from "@/features/education/components/cards";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

const emptyResults = {
  subjects: [],
  notes: [],
  books: [],
  questionBanks: [],
  mockTests: [],
  scholarships: [],
  posts: [],
  community: [],
};

export function SearchPage({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const debounced = useDebounce(q, 250);

  useEffect(() => {
    if (debounced.trim()) router.replace(`/search?q=${encodeURIComponent(debounced.trim())}`, { scroll: false });
  }, [debounced, router]);

  const { data: searchData, isFetching } = useSearch(debounced);
  const results = searchData ?? emptyResults;

  const active = debounced.trim();
  const hasResults = Object.values(results).some((arr) => arr.length > 0);

  return (
    <>
      <PageHeader
        icon={Search}
        gradient="from-violet-500 to-fuchsia-500"
        title="Search Sandarbh"
        description="Find notes, books, question banks, mock tests, scholarships, blog posts and community threads across every level."
        crumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
      />

      <section className="py-10 md:py-14">
        <div className="container">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/search?q=${encodeURIComponent(q.trim())}`);
            }}
            className="mx-auto flex max-w-2xl items-center gap-2 rounded-2xl border bg-background p-1.5 shadow-card-hover focus-within:ring-2 focus-within:ring-primary/40"
          >
            <Search className="ml-3 h-5 w-5 shrink-0 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Try 'SEE Maths', 'Physics 12', 'TU scholarship'..."
              className="h-11 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button type="submit" className="h-11">
              Search
            </Button>
          </form>

          {!active && (
            <div className="mx-auto mt-10 max-w-2xl">
              <p className="text-sm font-medium text-muted-foreground">Popular searches</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["SEE Maths", "Grade 12 Physics", "BSc CSIT", "NEB Papers", "TU scholarship", "Accountancy"].map((t) => (
                  <Link
                    key={t}
                    href={`/search?q=${encodeURIComponent(t)}`}
                    onClick={() => setQ(t)}
                    className="rounded-full border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {active && (
            <>
              <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  {isFetching ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Searching...
                    </span>
                  ) : hasResults ? (
                    <>
                      <span className="font-semibold text-foreground">
                        {Object.values(results).reduce((a, b) => a + b.length, 0)}
                      </span>{" "}
                      results for <span className="font-semibold text-foreground">&ldquo;{active}&rdquo;</span>
                    </>
                  ) : (
                    <>No results found</>
                  )}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(results)
                    .filter(([, arr]) => arr.length > 0)
                    .map(([key, arr]) => (
                      <Badge key={key} variant="outline" className="capitalize">
                        {key.replace(/([A-Z])/g, " $1")} · {arr.length}
                      </Badge>
                    ))}
                </div>
              </div>

              {!hasResults && (
                <div className="mt-10">
                  <EmptyState
                    icon={<SearchX className="h-10 w-10 text-muted-foreground" />}
                    title={`Nothing found for "${active}"`}
                    description="Try a different keyword, or browse by level and subject instead."
                  />
                </div>
              )}

              {results.subjects.length > 0 && (
                <ResultBlock label="Subjects" count={results.subjects.length}>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {results.subjects.slice(0, 8).map((s) => (
                      <SubjectCard key={s.id} subject={s} />
                    ))}
                  </div>
                </ResultBlock>
              )}

              {results.notes.length > 0 && (
                <ResultBlock label="Notes" count={results.notes.length}>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {results.notes.slice(0, 8).map((n) => (
                      <NoteCard key={n.id} note={n} />
                    ))}
                  </div>
                </ResultBlock>
              )}

              {results.books.length > 0 && (
                <ResultBlock label="Books" count={results.books.length}>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {results.books.slice(0, 8).map((b) => (
                      <BookCard key={b.id} book={b} />
                    ))}
                  </div>
                </ResultBlock>
              )}

              {results.questionBanks.length > 0 && (
                <ResultBlock label="Question banks" count={results.questionBanks.length}>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {results.questionBanks.slice(0, 8).map((qb) => (
                      <QuestionBankCard key={qb.id} qb={qb} />
                    ))}
                  </div>
                </ResultBlock>
              )}

              {results.mockTests.length > 0 && (
                <ResultBlock label="Mock tests" count={results.mockTests.length}>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {results.mockTests.slice(0, 8).map((m) => (
                      <MockTestCard key={m.id} mock={m} />
                    ))}
                  </div>
                </ResultBlock>
              )}

              {results.scholarships.length > 0 && (
                <ResultBlock label="Scholarships" count={results.scholarships.length}>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {results.scholarships.slice(0, 8).map((s) => (
                      <ScholarshipCard key={s.id} scholarship={s} />
                    ))}
                  </div>
                </ResultBlock>
              )}

              {(results.posts.length > 0 || results.community.length > 0) && (
                <ResultBlock label="Blog & community" count={results.posts.length + results.community.length}>
                  <div className="space-y-3">
                    {results.posts.slice(0, 4).map((p) => (
                      <Link key={p.id} href={`/blog/${p.slug}`} className="group block rounded-xl border bg-card p-4 transition-all hover:border-primary/40">
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-medium group-hover:text-primary">{p.title}</p>
                            <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{p.excerpt}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                        </div>
                      </Link>
                    ))}
                    {results.community.slice(0, 4).map((c) => (
                      <Link key={c.id} href="/community" className="group block rounded-xl border bg-card p-4 transition-all hover:border-primary/40">
                        <div className="flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-medium group-hover:text-primary">{c.title}</p>
                            <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{c.body}</p>
                          </div>
                          <Badge variant="secondary" className="shrink-0">{c.answers?.length ?? 0} answers</Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                </ResultBlock>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

function ResultBlock({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  return (
    <div className="mt-12">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold md:text-xl">{label}</h2>
        <Badge variant="secondary">{count}</Badge>
      </div>
      {children}
    </div>
  );
}
