"use client";

import { useTrendingSubjects } from "@/services/queries";
import { SectionHeader } from "@/components/shared/section-header";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { GridSkeleton } from "@/components/shared/skeletons";
import { SubjectCard } from "@/features/education/components/cards";

export function TrendingSubjects() {
  const { data: subjects, isLoading } = useTrendingSubjects(8);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <SectionHeader
          eyebrow="Trending"
          title="Hot right now"
          description="The subjects and resources thousands of Nepali students are studying today."
          href="/subjects"
          linkLabel="All subjects"
        />
        {isLoading || !subjects ? (
          <GridSkeleton count={8} />
        ) : (
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {subjects.map((subject) => (
              <StaggerItem key={subject.id}>
                <SubjectCard subject={subject} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
