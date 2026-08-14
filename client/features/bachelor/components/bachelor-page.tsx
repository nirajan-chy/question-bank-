"use client";

import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import { useFaculties, useSubjectsByLevel, useUniversities } from "@/services/queries";
import { PageHeader } from "@/components/shared/page-header";
import { GridSkeleton } from "@/components/shared/skeletons";
import { SubjectCard } from "@/features/education/components/cards";
import { cn } from "@/lib/utils";
import { gradientFor } from "@/lib/gradients";

export function BachelorPage() {
  const { data: subjects, isLoading: loadingSubjects } = useSubjectsByLevel("bachelor");
  const { data: universities, isLoading: loadingUniversities } = useUniversities();
  const { data: faculties } = useFaculties();

  const bachelorFaculties = (faculties ?? []).filter((f) =>
    ["engineering", "computing-it", "management", "health-sciences", "education", "humanities-social-sciences"].includes(f.slug)
  );

  return (
    <>
      <PageHeader
        icon={GraduationCap}
        gradient="from-sky-600 via-blue-700 to-indigo-700"
        title="Bachelor's Programs"
        description="BSc CSIT, engineering, BBA, nursing, law and more — semester resources, old questions and guides for TU, KU, PU, Purbanchal & Gandaki."
        crumbs={[{ label: "Bachelor" }]}
        actions={
          <Link
            href="/universities"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-gradient px-5 text-sm font-semibold text-white shadow-glow-sm transition-transform hover:scale-[1.02]"
          >
            Compare universities <ArrowRight className="h-4 w-4" />
          </Link>
        }
      >
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {bachelorFaculties.slice(0, 6).map((f) => (
            <div
              key={f.id}
              className="rounded-xl border bg-background/80 p-3 text-center backdrop-blur-sm"
            >
              <span className={cn("mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white", gradientFor(f.name))}>
                {f.short.slice(0, 1)}
              </span>
              <p className="mt-2 text-xs font-semibold">{f.name}</p>
              <p className="text-[10px] text-muted-foreground">{f.programs.length} programs</p>
            </div>
          ))}
        </div>
      </PageHeader>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold md:text-2xl">Popular Bachelor subjects</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Semester-wise notes, past papers and mock tests
              </p>
            </div>
          </div>
          {loadingSubjects || !subjects ? (
            <GridSkeleton count={4} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {subjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          )}

          <div className="mt-16">
            <h2 className="font-display text-xl font-bold md:text-2xl">Where to study</h2>
            <p className="mt-1 text-sm text-muted-foreground">Top universities offering bachelor’s degrees</p>
            {loadingUniversities || !universities ? (
              <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-xl bg-primary/10" />
                ))}
              </div>
            ) : (
              <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {universities.slice(0, 6).map((uni) => (
                  <Link
                    key={uni.id}
                    href={`/universities/${uni.slug}`}
                    className="group flex items-center gap-4 rounded-xl border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover"
                  >
                    <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-display text-sm font-bold text-white", gradientFor(uni.name))}>
                      {uni.short}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold group-hover:text-primary">{uni.name}</p>
                      <p className="text-xs text-muted-foreground">{uni.programs.length} programs · {uni.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
