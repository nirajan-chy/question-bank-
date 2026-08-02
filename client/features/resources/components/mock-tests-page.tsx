"use client";

import { useState } from "react";
import { Timer } from "lucide-react";
import { useMockTests } from "@/services/queries";
import { PageHeader } from "@/components/shared/page-header";
import { GridSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { MockTestCard } from "@/features/education/components/cards";
import { ResourceFilters } from "./resource-filters";

export function MockTestsPage() {
  const { data: tests, isLoading } = useMockTests();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All levels");
  const [sort, setSort] = useState("popular");

  const filtered = (tests ?? [])
    .filter((m) => {
      const matchesQuery =
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.subjectName.toLowerCase().includes(query.toLowerCase());
      const matchesLevel = level === "All levels" || m.level.includes(level.replace("NEB · ", ""));
      return matchesQuery && matchesLevel;
    })
    .sort((a, b) => {
      if (sort === "recent") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sort === "rating") return b.avgScore - a.avgScore;
      return b.attempts - a.attempts;
    });

  return (
    <>
      <PageHeader
        icon={Timer}
        title="Mock Tests"
        description="Timed mock exams with instant scoring, GPA projection and step-by-step solutions. Train like it's the real exam."
        crumbs={[{ label: "Mock Tests" }]}
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-1.5 text-sm font-medium text-success">
            Avg score improved by 18% in 6 weeks
          </span>
        }
      />
      <section className="py-12 md:py-16">
        <div className="container">
          <ResourceFilters
            query={query}
            onQuery={setQuery}
            level={level}
            onLevel={setLevel}
            sort={sort}
            onSort={setSort}
          />
          {isLoading || !tests ? (
            <GridSkeleton count={8} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No mock tests found"
              description="Try adjusting your filters or search terms."
              actionLabel="Browse all"
              actionHref="/mock-tests"
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((test) => (
                <MockTestCard key={test.id} mock={test} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
