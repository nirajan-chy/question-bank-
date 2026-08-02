"use client";

import { useState } from "react";
import { Award } from "lucide-react";
import { useScholarships } from "@/services/queries";
import { PageHeader } from "@/components/shared/page-header";
import { GridSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { ScholarshipCard } from "@/features/education/components/cards";
import { cn } from "@/lib/utils";

const categories = ["All", "Government", "Merit", "Need-based", "Leadership", "Community", "Research"];

export function ScholarshipsPage() {
  const { data: scholarships, isLoading } = useScholarships();
  const [category, setCategory] = useState("All");

  const filtered = (scholarships ?? []).filter(
    (s) => category === "All" || s.category.includes(category)
  );

  return (
    <>
      <PageHeader
        icon={Award}
        title="Scholarships & Funding"
        description="Government and private scholarships with live deadlines — from SEE to Master. Filter by type and apply before it's too late."
        crumbs={[{ label: "Scholarships" }]}
      />
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
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

          {isLoading || !scholarships ? (
            <GridSkeleton count={6} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No scholarships in this category"
              description="Check back soon or browse all scholarships."
              actionLabel="View all"
              actionHref="/scholarships"
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((scholarship) => (
                <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
