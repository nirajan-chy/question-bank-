"use client";

import Link from "next/link";
import { useState } from "react";
import { Globe, Search, ArrowUpRight } from "lucide-react";
import { db } from "@/services/db";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Computing & IT",
  "Management",
  "Engineering",
  "Hospitality",
  "Humanities",
  "Social Sciences",
];

export function CoursesPage() {
  const courses = db.courses;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = courses.filter((c) => {
    const matchesQuery =
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All" || c.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <>
      <PageHeader
        icon={Globe}
        title="Courses"
        description="Pick your course and jump straight to subjects, notes, question banks, past papers and mock tests."
        crumbs={[{ label: "Courses" }]}
      />
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    category === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "hover:border-primary/40 hover:text-primary"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <Input
              placeholder="Search courses..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full lg:w-72"
              aria-label="Search courses"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border bg-card p-12 text-center">
              <Globe className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-4 font-medium">No courses found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different search or category.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                   <Card className="h-full p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover group-focus-visible:ring-2 group-focus-visible:ring-primary">
                     <div className="flex items-start justify-end">
                       <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                     </div>
                     <h3 className="mt-2 font-display text-lg font-extrabold tracking-tight group-hover:text-primary">
                       {course.name}
                     </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {course.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      <Badge variant="secondary">{course.university}</Badge>
                      <Badge variant="info">{course.semesterCount} semesters</Badge>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
