"use client";

import Link from "next/link";
<<<<<<< HEAD
import { BookOpen, FileText, ClipboardList, GraduationCap, ScrollText, Trophy } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { useNotes, useBooks, useQuestionBanks, usePastPapers, useMockTests, useScholarships } from "@/services/queries";

/** Counts come from the live catalogue so the tiles never drift from reality. */
export function ResourcesPage() {
  const notes = useNotes();
  const books = useBooks();
  const questionBanks = useQuestionBanks();
  const pastPapers = usePastPapers();
  const mockTests = useMockTests();
  const scholarships = useScholarships();

  const pending = notes.isPending || books.isPending || questionBanks.isPending;
  const failed = [notes, books, questionBanks, pastPapers, mockTests, scholarships].find((q) => q.isError);

  const sections = [
    {
      title: "Notes",
      description: "Comprehensive class notes from top students and teachers.",
      icon: BookOpen,
      count: notes.data?.length ?? 0,
      href: "/notes",
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Books",
      description: "Recommended textbooks and reference materials.",
      icon: FileText,
      count: books.data?.length ?? 0,
      href: "/books",
      color: "from-rose-500 to-pink-600",
    },
    {
      title: "Question Banks",
      description: "Practice questions organized by topic and difficulty.",
      icon: ClipboardList,
      count: questionBanks.data?.length ?? 0,
      href: "/question-banks",
      color: "from-indigo-500 to-blue-600",
    },
    {
      title: "Past Papers",
      description: "Previous year exam papers with solutions.",
      icon: ScrollText,
      count: pastPapers.data?.length ?? 0,
      href: "/past-papers",
      color: "from-slate-500 to-slate-700",
    },
    {
      title: "Mock Tests",
      description: "Timed practice tests to simulate real exam conditions.",
      icon: GraduationCap,
      count: mockTests.data?.length ?? 0,
      href: "/mock-tests",
      color: "from-fuchsia-500 to-purple-600",
    },
    {
      title: "Scholarships",
      description: "Scholarship opportunities for Nepali students.",
      icon: Trophy,
      count: scholarships.data?.length ?? 0,
      href: "/scholarships",
      color: "from-yellow-500 to-amber-600",
    },
  ];
=======
import { BookOpen, Library, FileQuestion, FileText, Timer, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { gradientFor } from "@/lib/gradients";

const resources = [
  {
    label: "Notes",
    href: "/notes",
    icon: BookOpen,
    description: "Chapter-wise notes for every level — read online or download PDF.",
  },
  {
    label: "Books",
    href: "/books",
    icon: Library,
    description: "Textbooks, guides and reference materials for all courses.",
  },
  {
    label: "Question Banks",
    href: "/question-banks",
    icon: FileQuestion,
    description: "Exam-style practice questions with answers and explanations.",
  },
  {
    label: "Past Papers",
    href: "/past-papers",
    icon: FileText,
    description: "Previous board and university exam papers with solutions.",
  },
  {
    label: "Mock Tests",
    href: "/mock-tests",
    icon: Timer,
    description: "Timed practice tests with instant scoring and analytics.",
  },
];

export function ResourcesPage() {
>>>>>>> origin/main
  return (
    <>
      <PageHeader
        icon={BookOpen}
        title="Resources"
<<<<<<< HEAD
        description="Everything you need to ace your exams — notes, books, question banks, past papers, mock tests and scholarships."
=======
        description="All study materials in one place — notes, books, question banks, past papers and mock tests."
>>>>>>> origin/main
        crumbs={[{ label: "Resources" }]}
      />
      <section className="py-12 md:py-16">
        <div className="container">
<<<<<<< HEAD
          {pending ? (
            <LoadingState label="Loading the catalogue" />
          ) : failed ? (
            <ErrorState
              title="Could not load resource counts"
              error={failed.error}
              onRetry={() => void failed.refetch()}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <Link key={section.title} href={section.href} className="group">
                    <Card className="h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-card-hover">
                      <CardContent className="p-6">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${section.color} text-white`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 font-display text-lg font-bold">{section.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground text-pretty">
                          {section.description}
                        </p>
                        <p className="mt-3 text-sm font-medium text-primary">
                          {section.count.toLocaleString("en-NP")} available →
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
=======
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <Link
                key={resource.href}
                href={resource.href}
                className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Card className="h-full p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover group-focus-visible:ring-2 group-focus-visible:ring-primary">
                  <div className={`absolute inset-x-0 top-0 h-1.5 rounded-t-xl bg-gradient-to-r ${gradientFor(resource.label)}`} />
                  <div className="flex items-start justify-between">
                    <resource.icon className="h-10 w-10 text-primary" />
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold group-hover:text-primary">
                    {resource.label}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {resource.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
>>>>>>> origin/main
        </div>
      </section>
    </>
  );
}
