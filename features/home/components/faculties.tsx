"use client";

import Link from "next/link";
import { useFaculties } from "@/services/queries";
import { SectionHeader } from "@/components/shared/section-header";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { cn } from "@/lib/utils";

export function Faculties() {
  const { data: faculties, isLoading } = useFaculties();

  if (isLoading || !faculties) {
    return (
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="h-7 w-56 animate-pulse rounded bg-primary/10" />
          <div className="mt-8 flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 w-40 shrink-0 animate-pulse rounded-xl bg-primary/10" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-y bg-muted/30 py-16 md:py-24">
      <div className="container">
        <SectionHeader
          eyebrow="Faculties"
          title="Explore by faculty"
          description="Science, Management, Engineering, Health, IT and more — find resources tuned to your stream."
          href="/classes"
          linkLabel="Browse all"
        />
        <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {faculties.map((faculty) => (
            <StaggerItem key={faculty.id}>
              <Link
                href="/classes"
                className="group flex h-full flex-col rounded-2xl border bg-background p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover"
              >
                <span className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white", faculty.gradient)}>
                  {faculty.short.slice(0, 1)}
                </span>
                <h3 className="mt-4 font-semibold group-hover:text-primary">{faculty.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{faculty.description}</p>
                <p className="mt-3 text-xs font-medium text-primary">
                  {faculty.programs.length} programs →
                </p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
