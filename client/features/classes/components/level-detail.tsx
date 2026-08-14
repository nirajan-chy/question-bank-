"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useLevels, useSubjectsByLevel, useCoursesByLevel } from "@/services/queries";
import { PageHeader } from "@/components/shared/page-header";
import { GridSkeleton } from "@/components/shared/skeletons";
import { SubjectCard } from "@/features/education/components/cards";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { gradientFor } from "@/lib/gradients";

export function LevelDetail({ slug }: { slug: string }) {
  const { data: levels, isLoading: loadingLevels } = useLevels();
  const level = levels?.find((l) => l.slug === slug);
  const { data: subjects, isLoading: loadingSubjects } = useSubjectsByLevel(slug);
  const { data: courses, isLoading: loadingCourses } = useCoursesByLevel(slug);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);

  if (!loadingLevels && !level) notFound();
  if (!level) return <GridSkeleton count={4} className="mt-24" />;

  const hasCourses = level.slug === "bachelor" || level.slug === "master";
  const hasStreams = level.streams && level.streams.length > 0;

  const filteredSubjects = hasStreams && selectedStream
    ? subjects?.filter((s) => s.stream === selectedStream)
    : subjects;

  return (
    <>
      <PageHeader
        title={level.name}
        description={level.description}
        crumbs={[{ label: "Classes", href: "/classes" }, { label: level.name }]}
      />

      {/* Stream Filter for Class 12 */}
      {hasStreams && (
        <section className="border-b bg-muted/30">
          <div className="container py-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedStream(null)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  selectedStream === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                All Streams
              </button>
              {level.streams!.map((stream) => (
                <button
                  key={stream}
                  onClick={() => setSelectedStream(stream)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    selectedStream === stream
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:text-foreground"
                  )}
                >
                  {stream}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 md:py-16">
        <div className="container">
          {/* Bachelor/Master: Show Courses */}
          {hasCourses ? (
            <>
              <h2 className="font-display text-xl font-bold md:text-2xl">
                {level.name} Programs
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {courses?.length ?? 0} programs with semester-wise resources
              </p>
              {loadingCourses || !courses ? (
                <GridSkeleton count={8} className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" />
              ) : (
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {courses.map((course) => (
                    <Link key={course.id} href={`/courses/${course.slug}`}>
                      <div className="group h-full overflow-hidden rounded-xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover">
                        <div className="flex items-start justify-between">
                          <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-2xl text-white shadow-sm", gradientFor(course.name))}>
                            {course.icon}
                          </span>
                          <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                        </div>
                        <h3 className="mt-4 font-semibold group-hover:text-primary">{course.name}</h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">{course.university}</p>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
                        <div className="mt-4 flex items-center gap-2">
                          <Badge variant="info">{course.semesterCount} semesters</Badge>
                          <Badge variant="secondary">{course.category}</Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Class 12 / CTEVT: Show Subjects */}
              <h2 className="font-display text-xl font-bold md:text-2xl">
                {selectedStream ? `${selectedStream} Subjects` : `Subjects in ${level.name}`}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {filteredSubjects?.length ?? 0} subjects with full study resources
              </p>
              {loadingSubjects || !subjects ? (
                <GridSkeleton count={8} className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" />
              ) : (
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {(filteredSubjects ?? []).map((subject) => (
                    <SubjectCard key={subject.id} subject={subject} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}