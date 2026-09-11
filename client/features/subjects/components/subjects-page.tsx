"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowUpRight, Search } from "lucide-react";
import { db } from "@/services/db";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  "Computing & IT": "from-blue-500 to-indigo-600",
  Management: "from-emerald-500 to-teal-600",
  Engineering: "from-orange-500 to-red-600",
  Hospitality: "from-pink-500 to-rose-600",
  Humanities: "from-violet-500 to-purple-600",
  "Social Sciences": "from-amber-500 to-yellow-600",
};

export function SubjectsPage() {
  const courses = db.courses;
  const subjects = db.subjects;
  const [query, setQuery] = useState("");

  const filteredCourses = courses.filter((c) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  });

  const getSubjectsCount = (courseSlug: string) =>
    subjects.filter((s) => s.courseSlug === courseSlug).length;

  return (
    <>
      <PageHeader
        icon={BookOpen}
        title="Subjects"
        description="Pick a course to see all its subjects — with notes, question banks, past papers and mock tests."
        crumbs={[{ label: "Subjects" }]}
      />
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {filteredCourses.length} courses · {subjects.length} subjects total
            </p>
            <Input
              placeholder="Search courses..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full sm:w-72"
            />
          </div>

          {filteredCourses.length === 0 ? (
            <div className="rounded-xl border bg-card p-12 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-4 font-medium">No courses found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different search term.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => {
                const count = getSubjectsCount(course.slug);
                return (
                  <Link key={course.id} href={`/courses/${course.slug}`}>
                    <Card className="group relative h-full overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover">
                      <div
                        className={cn(
                          "absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r",
                          categoryColors[course.category] || "from-slate-500 to-slate-700"
                        )}
                      />
                      <div className="flex items-start justify-between">
                        <span className="text-3xl">{course.icon}</span>
                        <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                      </div>
                      <h3 className="mt-4 font-display text-lg font-bold group-hover:text-primary">
                        {course.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {course.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        <Badge variant="secondary">{course.university}</Badge>
                        <Badge variant="info">{count} subjects</Badge>
                        <Badge variant="default">{course.semesterCount} semesters</Badge>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
