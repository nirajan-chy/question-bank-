"use client";

import { useMockTests } from "@/services/queries";
import { SectionHeader } from "@/components/shared/section-header";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { GridSkeleton } from "@/components/shared/skeletons";
import { MockTestCard } from "@/features/education/components/cards";

export function MockTestsSection() {
  const { data: tests, isLoading } = useMockTests({ limit: 4 });

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <SectionHeader
          eyebrow="Mock Tests"
          title="Train like it's exam day"
          description="Timed mock tests with instant scoring, GPA projection and step-by-step solutions."
          href="/mock-tests"
          linkLabel="All mock tests"
        />
        {isLoading || !tests ? (
          <GridSkeleton count={4} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" />
        ) : (
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tests.map((test) => (
              <StaggerItem key={test.id}>
                <MockTestCard mock={test} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
