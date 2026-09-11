"use client";

import Link from "next/link";
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
  return (
    <>
      <PageHeader
        icon={BookOpen}
        title="Resources"
        description="All study materials in one place — notes, books, question banks, past papers and mock tests."
        crumbs={[{ label: "Resources" }]}
      />
      <section className="py-12 md:py-16">
        <div className="container">
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
        </div>
      </section>
    </>
  );
}
