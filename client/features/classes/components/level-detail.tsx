"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useLevels, useSubjectsByLevel } from "@/services/queries";
import { PageHeader } from "@/components/shared/page-header";
import { GridSkeleton } from "@/components/shared/skeletons";
import { SubjectCard } from "@/features/education/components/cards";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileQuestion, FileText, Timer, BookOpen } from "lucide-react";

export function LevelDetail({ slug }: { slug: string }) {
  const { data: levels, isLoading: loadingLevels } = useLevels();
  const level = levels?.find((l) => l.slug === slug);

  const { data: subjects, isLoading: loadingSubjects } = useSubjectsByLevel(slug);

  if (!loadingLevels && !level) notFound();

  if (!level) return <GridSkeleton count={4} className="mt-24" />;

  const shortcuts = [
    { label: "Question Banks", href: "/question-banks", icon: FileQuestion, count: "50+" },
    { label: "Past Papers", href: "/past-papers", icon: FileText, count: "30+" },
    { label: "Mock Tests", href: "/mock-tests", icon: Timer, count: "20+" },
    { label: "Notes", href: "/notes", icon: BookOpen, count: "120+" },
  ];

  return (
    <>
      <PageHeader
        title={level.name}
        description={level.description}
        gradient={level.gradient}
        crumbs={[{ label: "Classes", href: "/classes" }, { label: level.name }]}
        actions={
          <Button variant="gradient" asChild>
            <Link href="/mock-tests">
              Take a mock test <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      >
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {shortcuts.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="group flex items-center gap-3 rounded-xl border bg-background/80 p-4 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <s.icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.count} resources</p>
              </div>
            </Link>
          ))}
        </div>
      </PageHeader>

      <section className="py-12 md:py-16">
        <div className="container">
          <h2 className="font-display text-xl font-bold md:text-2xl">
            Subjects in {level.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {subjects?.length ?? 0} subjects with full study resources
          </p>
          {loadingSubjects || !subjects ? (
            <GridSkeleton count={8} className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" />
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {subjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
