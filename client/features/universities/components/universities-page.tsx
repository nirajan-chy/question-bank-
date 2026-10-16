"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Landmark, Search } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/shared/error-state";
import { GridSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";
import { gradientFor } from "@/lib/gradients";
import { useUniversities } from "@/services/queries";

const ALL = "All";

export function UniversitiesPage() {
  const { data: universities, isPending, isError, error, refetch } = useUniversities();
  const [query, setQuery] = useState("");
  const [type, setType] = useState(ALL);

  // Types come from the API so a new university type shows up on its own.
  const types = useMemo(
    () => [ALL, ...Array.from(new Set((universities ?? []).map((u) => u.type).filter(Boolean)))],
    [universities]
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (universities ?? []).filter((u) => {
      const matchesQuery =
        !term ||
        u.name.toLowerCase().includes(term) ||
        u.location.toLowerCase().includes(term) ||
        u.short.toLowerCase().includes(term) ||
        u.description.toLowerCase().includes(term);
      const matchesType = type === ALL || u.type === type;
      return matchesQuery && matchesType;
    });
  }, [universities, query, type]);

  return (
    <>
      <PageHeader
        icon={Landmark}
        title="Universities of Nepal"
        description="Explore curriculum, programs, past papers and campus life across Nepal's leading universities — TU, KU, PU, Purbanchal and more."
        crumbs={[{ label: "Universities" }]}
      />
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {types.length > 1 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by university type">
                {types.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    aria-pressed={type === t}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                      type === t
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:border-primary/40 hover:text-primary"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
            <div className="relative w-full lg:w-72">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                placeholder="Search universities…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9"
                aria-label="Search universities"
              />
            </div>
          </div>

          {isPending ? (
            <GridSkeleton count={8} />
          ) : isError ? (
            <ErrorState title="Could not load universities" error={error} onRetry={() => void refetch()} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Landmark className="h-5 w-5" />}
              title="No universities found"
              description={
                query || type !== ALL
                  ? "Try a different search term or clear the type filter."
                  : "Nothing has been published here yet."
              }
              action={
                (query || type !== ALL) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery("");
                      setType(ALL);
                    }}
                  >
                    Clear filters
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((uni) => (
                <Link
                  key={uni.id}
                  href={`/universities/${uni.slug}`}
                  className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Card className="h-full p-6 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-card-hover group-focus-visible:ring-2 group-focus-visible:ring-primary">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-display text-base font-bold text-white",
                          gradientFor(uni.name)
                        )}
                      >
                        {uni.short}
                      </span>
                      <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>

                    <h3 className="mt-4 font-display text-lg font-extrabold tracking-tight group-hover:text-primary">
                      {uni.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {uni.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      <Badge variant="secondary">{uni.type}</Badge>
                      <Badge variant="info">{uni.ranking}</Badge>
                      <Badge variant="secondary">{formatNumber(uni.students)} students</Badge>
                      <Badge variant="secondary">{uni.location}</Badge>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
