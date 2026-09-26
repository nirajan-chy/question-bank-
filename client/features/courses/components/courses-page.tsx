"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Globe, Search } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorState } from "@/components/shared/error-state";
import { GridSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCourses } from "@/services/queries";

const ALL = "All";

export function CoursesPage() {
  const { data: courses = [], isPending, isError, error, refetch } = useCourses();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);

  // Categories are derived from the API rather than hard-coded, so a course
  // added to the database shows up without a frontend change.
  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(courses.map((c) => c.category).filter(Boolean)))],
    [courses]
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return courses.filter((c) => {
      const matchesQuery =
        !term ||
        c.name.toLowerCase().includes(term) ||
        (c.description ?? "").toLowerCase().includes(term);
      const matchesCategory = category === ALL || c.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [courses, query, category]);

  return (
    <>
      <PageHeader
        icon={Globe}
        title="Courses"
        description="Pick your course and jump straight to subjects, notes, question banks, past papers and mock tests."
        crumbs={[{ label: "Courses" }]}
      />
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    aria-pressed={category === c}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                      category === c
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:border-primary/40 hover:text-primary"
                    )}
                  >
                    {c}
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
                placeholder="Search courses…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9"
                aria-label="Search courses"
              />
            </div>
          </div>

          {isPending ? (
            <GridSkeleton count={8} />
          ) : isError ? (
            <ErrorState title="Could not load courses" error={error} onRetry={() => void refetch()} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Globe className="h-5 w-5" />}
              title="No courses found"
              description="Try a different search term or clear the category filter."
              action={
                (query || category !== ALL) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery("");
                      setCategory(ALL);
                    }}
                  >
                    Clear filters
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Card className="h-full p-6 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-card-hover group-focus-visible:ring-2 group-focus-visible:ring-primary">
                    <div className="flex items-start justify-end">
                      <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                    <h3 className="mt-2 font-display text-lg font-extrabold tracking-tight group-hover:text-primary">
                      {course.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {course.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      <Badge variant="secondary">{course.university}</Badge>
                      <Badge variant="info">{course.semesterCount} semesters</Badge>
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
