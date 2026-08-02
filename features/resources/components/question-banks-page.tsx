"use client";

import { useState } from "react";
import { FileQuestion } from "lucide-react";
import { useQuestionBanks } from "@/services/queries";
import { PageHeader } from "@/components/shared/page-header";
import { GridSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { QuestionBankCard } from "@/features/education/components/cards";
import { ResourceFilters } from "./resource-filters";

export function QuestionBanksPage() {
  const { data: banks, isLoading } = useQuestionBanks();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All levels");
  const [sort, setSort] = useState("popular");

  const filtered = (banks ?? [])
    .filter((qb) => {
      const matchesQuery =
        qb.title.toLowerCase().includes(query.toLowerCase()) ||
        qb.subjectName.toLowerCase().includes(query.toLowerCase());
      const matchesLevel = level === "All levels" || qb.level.includes(level.replace("NEB · ", ""));
      return matchesQuery && matchesLevel;
    })
    .sort((a, b) => {
      if (sort === "recent") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sort === "rating") return b.rating - a.rating;
      return b.attempts - a.attempts;
    });

  return (
    <>
      <PageHeader
        icon={FileQuestion}
        title="Question Banks"
        description="Exam-pattern practice built from the last decade of SEE, NEB, CTEVT and university papers. Solved and explained."
        crumbs={[{ label: "Question Banks" }]}
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
          {isLoading || !banks ? (
            <GridSkeleton count={8} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No question banks found"
              description="Try adjusting your filters or search terms."
              actionLabel="Browse all"
              actionHref="/question-banks"
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((qb) => (
                <QuestionBankCard key={qb.id} qb={qb} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
