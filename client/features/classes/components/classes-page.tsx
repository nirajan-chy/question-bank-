"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { useLevels } from "@/services/queries";
import { PageHeader } from "@/components/shared/page-header";
import { GridSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { LevelCard } from "@/features/education/components/cards";

export function ClassesPage() {
  const { data: levels, isLoading } = useLevels();
  const [query, setQuery] = useState("");

  const filtered = (levels ?? []).filter(
    (l) =>
      l.name.toLowerCase().includes(query.toLowerCase()) ||
      l.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <PageHeader
        icon={BookOpen}
        gradient="from-indigo-600 via-violet-600 to-fuchsia-600"
        title="Classes & Levels"
        description="From Class 8 to Master's — pick your level and access every subject, note, question bank and mock test tailored to your exam."
        crumbs={[{ label: "Classes" }]}
        actions={
          <Input
            placeholder="Search levels..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-64"
          />
        }
      />
      <section className="py-12 md:py-16">
        <div className="container">
          {isLoading || !levels ? (
            <GridSkeleton count={8} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No levels found"
              description={`No education level matched "${query}". Try a different search.`}
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((level) => (
                <LevelCard key={level.id} {...level} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
