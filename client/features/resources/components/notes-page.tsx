"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { useNotes } from "@/services/queries";
import { PageHeader } from "@/components/shared/page-header";
import { GridSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { NoteCard } from "@/features/education/components/cards";
import { ResourceFilters } from "./resource-filters";

export function NotesPage() {
  const { data: notes, isLoading } = useNotes();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All levels");
  const [sort, setSort] = useState("popular");

  const filtered = (notes ?? [])
    .filter((n) => {
      const matchesQuery =
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.subjectName.toLowerCase().includes(query.toLowerCase()) ||
        n.author.toLowerCase().includes(query.toLowerCase());
      const matchesLevel = level === "All levels" || n.level.includes(level.replace("NEB · ", ""));
      return matchesQuery && matchesLevel;
    })
    .sort((a, b) => {
      if (sort === "recent") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sort === "rating") return b.rating - a.rating;
      return b.downloads - a.downloads;
    });

  return (
    <>
      <PageHeader
        icon={BookOpen}
        title="Study Notes"
        description="Chapter-wise notes written by toppers and teachers — updated for the latest CDC and NEB curriculum. Free to download."
        crumbs={[{ label: "Notes" }]}
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
          {isLoading || !notes ? (
            <GridSkeleton count={8} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No notes found"
              description="Try adjusting your filters or search terms."
              actionLabel="Browse all notes"
              actionHref="/notes"
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
