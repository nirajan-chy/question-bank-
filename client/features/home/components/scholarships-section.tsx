"use client";

import { useScholarships } from "@/services/queries";
import { SectionHeader } from "@/components/shared/section-header";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { GridSkeleton } from "@/components/shared/skeletons";
import { ScholarshipCard } from "@/features/education/components/cards";

export function ScholarshipsSection() {
  const { data: scholarships, isLoading } = useScholarships({ featured: true });

  return (
    <section className="border-y bg-muted/30 py-16 md:py-24">
      <div className="container">
        <SectionHeader
          eyebrow="Scholarships"
          title="Fund your education"
          description="Government and private scholarships with live deadlines — don't miss your chance."
          href="/scholarships"
          linkLabel="All scholarships"
        />
        {isLoading || !scholarships ? (
          <GridSkeleton count={3} className="grid gap-5 md:grid-cols-3" />
        ) : (
          <Stagger className="grid gap-5 md:grid-cols-3">
            {scholarships.map((scholarship) => (
              <StaggerItem key={scholarship.id}>
                <ScholarshipCard scholarship={scholarship} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
