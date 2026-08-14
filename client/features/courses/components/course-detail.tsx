"use client";

import { useState } from "react";
import { useCourse, useSemestersByCourse, useSubjectsByCourse } from "@/services/queries";
import { PageHeader } from "@/components/shared/page-header";
import { GridSkeleton } from "@/components/shared/skeletons";
import { SubjectCard } from "@/features/education/components/cards";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { gradientFor } from "@/lib/gradients";
import { BookOpen } from "lucide-react";

export function CourseDetail({ slug }: { slug: string }) {
  const { data: course, isLoading: loadingCourse } = useCourse(slug);
  const { data: semesters = [], isLoading: loadingSemesters } = useSemestersByCourse(slug);
  const { data: subjects = [], isLoading: loadingSubjects } = useSubjectsByCourse(slug);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

  if (!loadingCourse && !course) return null;
  if (!course) return <GridSkeleton count={4} className="mt-24" />;

  const filteredSubjects = selectedSemester
    ? subjects.filter((s) => s.semester === selectedSemester)
    : subjects;

  return (
    <>
      <PageHeader
        title={course.name}
        description={course.description}
        gradient={gradientFor(course.name)}
        crumbs={[
          { label: "Classes", href: "/classes" },
          { label: course.levelSlug === "bachelor" ? "Bachelor" : "Master", href: "/classes" },
          { label: course.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{course.university}</Badge>
            <Badge variant="info">{course.semesterCount} semesters</Badge>
          </div>
        }
      />

      {/* Semester Filter */}
      <section className="border-b bg-muted/30">
        <div className="container py-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedSemester(null)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                selectedSemester === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:text-foreground"
              )}
            >
              All Semesters
            </button>
            {semesters.map((sem) => (
              <button
                key={sem.id}
                onClick={() => setSelectedSemester(sem.number)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  selectedSemester === sem.number
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                {sem.short}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold md:text-2xl">
                {selectedSemester ? `Semester ${selectedSemester} Subjects` : "All Subjects"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {filteredSubjects.length} subjects with full study resources
              </p>
            </div>
          </div>

          {loadingSubjects || loadingSemesters ? (
            <GridSkeleton count={8} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" />
          ) : filteredSubjects.length === 0 ? (
            <div className="rounded-xl border bg-card p-12 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-4 font-medium">No subjects found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedSemester
                  ? `No subjects for Semester ${selectedSemester} yet.`
                  : "Subjects are being added soon."}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filteredSubjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}