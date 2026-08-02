"use client";

import { Newspaper } from "lucide-react";
import { useResults } from "@/services/queries";
import { PageHeader } from "@/components/shared/page-header";
import { ResultCard } from "@/features/education/components/cards";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";

export function ResultsPage() {
  const { data: results, isLoading } = useResults();

  return (
    <>
      <PageHeader
        icon={Newspaper}
        title="Exam Results"
        description="SEE, NEB, TU, CTEVT and university results — pass rates, highlights and direct links to official portals."
        crumbs={[{ label: "Results" }]}
      />
      <section className="py-12 md:py-16">
        <div className="container max-w-4xl">
          {isLoading || !results ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <EmptyState title="No results yet" description="Check back once exams are published." />
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <ResultCard key={result.id} result={result} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
