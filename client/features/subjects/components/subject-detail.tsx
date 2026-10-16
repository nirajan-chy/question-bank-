"use client";

import { Children, useMemo } from "react";
import Link from "next/link";
import { Share2, Timer } from "lucide-react";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { useSubject, useSubjects, usePastPapers } from "@/services/queries";
import { cn, formatNumber } from "@/lib/utils";
import { gradientFor } from "@/lib/gradients";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookmarkButton } from "@/components/shared/bookmark-button";
import { SubjectCard, PastPaperCard } from "@/features/education/components/cards";
import { useCopy } from "@/hooks/use-copy";
import { EmptyState } from "@/components/shared/empty-state";

export function SubjectDetail({ slug }: { slug: string }) {
  const { data: subject, isLoading } = useSubject(slug);
  const { data: allSubjects = [] } = useSubjects();
  const { data: subjectPapers = [] } = usePastPapers({ subjectSlug: subject?.slug });
  const { copied, copy } = useCopy();

  const related = useMemo(() => {
    if (!subject) return [];
    return subject.relatedSlugs
      .map((s) => allSubjects.find((x) => x.slug === s))
      .filter(Boolean) as NonNullable<typeof subject>[];
  }, [subject, allSubjects]);

  if (!isLoading && !subject) notFound();
  if (!subject || isLoading) {
    return (
      <div className="container py-16">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-primary/10" />
        <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-primary/10" />
        <div className="mt-10 h-64 animate-pulse rounded-2xl bg-primary/10" />
      </div>
    );
  }

  const handleShare = async () => {
    await copy(window.location.href);
    toast.success(copied ? "Link copied" : "Link copied to clipboard");
  };

  const papers = subjectPapers.filter((p) => p.subjectSlug === subject.slug);

  return (
    <>
      <header className="relative overflow-hidden border-b bg-mesh-light dark:bg-mesh-dark">
        <div className={cn("absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r", gradientFor(subject.name))} />
        <div className="container py-10 md:py-14">
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/subjects" className="hover:text-foreground">Subjects</Link>
            <span>/</span>
            <span className="font-medium text-foreground">{subject.name}</span>
          </nav>
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={cn("flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl text-white shadow-glow-sm", gradientFor(subject.name))}>
                  {subject.emoji}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-2xl font-bold md:text-4xl">{subject.name}</h1>
                    {subject.trending && <Badge variant="warning">🔥 Trending</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {subject.level} · {subject.category}
                  </p>
                </div>
              </div>
              <p className="mt-5 max-w-2xl text-sm text-muted-foreground text-pretty md:text-base">
                {subject.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {subject.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Card className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Your progress</p>
                  <span className="text-sm font-bold text-primary">62%</span>
                </div>
                <Progress value={62} className="mt-3" indicatorClassName={cn("bg-gradient-to-r", gradientFor(subject.name))} />
                <p className="mt-3 text-xs text-muted-foreground">
                  {formatNumber(420)} questions solved · {formatNumber(18)} hours studied
                </p>
                <div className="mt-4 flex gap-2">
                  <Button variant="gradient" size="sm" className="flex-1">
                    <Timer className="h-4 w-4" /> Start mock test
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <BookmarkButton
                    item={{
                      id: `subject-${subject.id}`,
                      type: "note",
                      title: subject.name,
                      subtitle: `${subject.level} · Subject page`,
                      href: `/subjects/${subject.slug}`,
                      savedAt: new Date().toISOString(),
                      icon: "note",
                    }}
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </header>

      <section className="py-10 md:py-14">
        <div className="container">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold md:text-2xl">Past questions</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Previous-year papers for {subject.name}.
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {papers.length} {papers.length === 1 ? "paper" : "papers"}
            </Badge>
          </div>

          <ResourceGrid empty={<EmptyState title="No past papers yet" description="Past papers for this subject are coming soon." />}>
            {papers.map((paper) => (
              <PastPaperCard key={paper.id} paper={paper} />
            ))}
          </ResourceGrid>

          <div className="mt-16">
            <h2 className="mb-6 font-display text-xl font-bold md:text-2xl">Related subjects</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((s) => (
                <SubjectCard key={s.id} subject={s} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ResourceGrid({ children, empty }: { children: React.ReactNode; empty: React.ReactNode }) {
  return (
    <div>
      {Children.count(children) > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
      ) : (
        empty
      )}
    </div>
  );
}
