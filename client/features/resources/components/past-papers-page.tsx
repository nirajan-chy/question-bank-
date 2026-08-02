"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { usePastPapers } from "@/services/queries";
import { PageHeader } from "@/components/shared/page-header";
import { GridSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { PastPaperCard } from "@/features/education/components/cards";
import { ResourceFilters } from "./resource-filters";

export function PastPapersPage() {
  const { data: papers, isLoading } = usePastPapers();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All levels");
  const [sort, setSort] = useState("popular");

  const filtered = (papers ?? [])
    .filter((p) => {
      const matchesQuery =
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.subjectName.toLowerCase().includes(query.toLowerCase()) ||
        p.exam.toLowerCase().includes(query.toLowerCase());
      const matchesLevel = level === "All levels" || p.level.includes(level.replace("NEB · ", ""));
      return matchesQuery && matchesLevel;
    })
    .sort((a, b) => {
      if (sort === "recent") return b.year - a.year;
      if (sort === "rating") return b.downloads - a.downloads;
      return b.downloads - a.downloads;
    });

  return (
    <>
      <PageHeader
        icon={FileText}
        title="Past Papers"
        description="Official board and university exam papers from SEE, NEB, CTEVT, TU, KU and PU — practice under real exam conditions."
        crumbs={[{ label: "Past Papers" }]}
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
          {isLoading || !papers ? (
            <GridSkeleton count={8} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No past papers found"
              description="Try adjusting your filters or search terms."
              actionLabel="Browse all"
              actionHref="/past-papers"
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((paper) => (
                <PastPaperCard key={paper.id} paper={paper} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
