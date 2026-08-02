"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { useSubjects } from "@/services/queries";
import { PageHeader } from "@/components/shared/page-header";
import { GridSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { SubjectCard } from "@/features/education/components/cards";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const levels = [
  "All",
  "SEE · Class 10",
  "NEB · Class 11/12",
  "CTEVT",
  "Bachelor · TU",
  "Bachelor · KU/PU",
  "Bachelor · TU/PU",
  "Master",
];

export function SubjectsPage() {
  const { data: subjects, isLoading } = useSubjects();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All");

  const filtered = (subjects ?? []).filter((s) => {
    const matchesQuery =
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.category.toLowerCase().includes(query.toLowerCase());
    const matchesLevel = level === "All" || s.level.includes(level);
    return matchesQuery && matchesLevel;
  });

  return (
    <>
      <PageHeader
        icon={BookOpen}
        title="All Subjects"
        description="Every subject from SEE to Master — with notes, question banks, past papers, mock tests and videos in one place."
        crumbs={[{ label: "Subjects" }]}
      />
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {levels.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
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
            <Input
              placeholder="Search subjects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full lg:w-72"
            />
          </div>

          {isLoading || !subjects ? (
            <GridSkeleton count={8} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No subjects found"
              description={`Nothing matched "${query}". Try a different subject or level.`}
              actionLabel="View all subjects"
              actionHref="/subjects"
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
