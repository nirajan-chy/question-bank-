"use client";

import { useNotes } from "@/services/queries";
import { SectionHeader } from "@/components/shared/section-header";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { GridSkeleton } from "@/components/shared/skeletons";
import { NoteCard } from "@/features/education/components/cards";

export function LatestNotes() {
  const { data: notes, isLoading } = useNotes({ limit: 4 });

  return (
    <section className="border-y bg-muted/30 py-16 md:py-24">
      <div className="container">
        <SectionHeader
          eyebrow="Notes"
          title="Fresh notes from toppers & teachers"
          description="Chapter-wise, exam-focused notes updated for the latest CDC and NEB curriculum."
          href="/notes"
          linkLabel="All notes"
        />
        {isLoading || !notes ? (
          <GridSkeleton count={4} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" />
        ) : (
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {notes.map((note) => (
              <StaggerItem key={note.id}>
                <NoteCard note={note} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
