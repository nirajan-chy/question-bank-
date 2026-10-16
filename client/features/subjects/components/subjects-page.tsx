"use client";

import { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { ErrorState } from "@/components/shared/error-state";
import { GridSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSubjects } from "@/services/queries";
import { SubjectCard } from "@/features/education/components/cards";

const ALL = "All";

export function SubjectsPage() {
  const { data: subjects, isPending, isError, error, refetch } = useSubjects();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState(ALL);

  // Levels are derived from the API rather than hard-coded, so a subject
  // added to the database shows up as a filter without a frontend change.
  const levels = useMemo(
    () => [ALL, ...Array.from(new Set((subjects ?? []).map((s) => s.level).filter(Boolean)))],
    [subjects]
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (subjects ?? []).filter((s) => {
      const matchesQuery =
        !term ||
        s.name.toLowerCase().includes(term) ||
        s.category.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term);
      const matchesLevel = level === ALL || s.level === level;
      return matchesQuery && matchesLevel;
    });
  }, [subjects, query, level]);

  return (
    <>
      <PageHeader
        icon={BookOpen}
        title="All Subjects"
        description="Every subject from NEB to Master — with notes, question banks, past papers, mock tests and videos in one place."
        crumbs={[{ label: "Subjects" }]}
      />
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {levels.length > 1 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by level">
                {levels.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(l)}
                    aria-pressed={level === l}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                      level === l
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:border-primary/40 hover:text-primary"
                    )}
                  >
                    {l}
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
                placeholder="Search subjects…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9"
                aria-label="Search subjects"
              />
            </div>
          </div>

          {isPending ? (
            <GridSkeleton count={8} />
          ) : isError ? (
            <ErrorState title="Could not load subjects" error={error} onRetry={() => void refetch()} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="h-5 w-5" />}
              title="No subjects found"
              description={
                query || level !== ALL
                  ? "Try a different search term or clear the level filter."
                  : "Nothing has been published here yet."
              }
              action={
                (query || level !== ALL) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery("");
                      setLevel(ALL);
                    }}
                  >
                    Clear filters
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
