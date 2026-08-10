"use client";

import { useLevels } from "@/services/queries";
import { SectionHeader } from "@/components/shared/section-header";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { GridSkeleton } from "@/components/shared/skeletons";
import { LevelCard } from "@/features/education/components/cards";

export function EducationLevels() {
  const { data: levels, isLoading } = useLevels();

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <SectionHeader
          eyebrow="Education Levels"
          title="One platform for every level"
          description="NEB Class 12, CTEVT, Bachelor & Master — TU, KU, PU and every major Nepali university, all in one place."
          href="/classes"
          linkLabel="All classes"
        />
        {isLoading || !levels ? (
          <GridSkeleton count={8} />
        ) : (
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {levels.map((level) => (
              <StaggerItem key={level.id}>
                <LevelCard {...level} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
