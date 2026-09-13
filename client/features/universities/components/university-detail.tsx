"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Users,
  Globe,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Building2,
  Landmark,
} from "lucide-react";
import { useUniversities } from "@/services/queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, cn } from "@/lib/utils";
import { gradientFor } from "@/lib/gradients";
import type { AffiliatedCollege } from "@/types";

export function UniversityDetail({ slug }: { slug: string }) {
  const { data: universities, isLoading } = useUniversities();
  const university = universities?.find((u) => u.slug === slug);
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);

  if (!isLoading && !university) notFound();
  if (!university) return <div className="py-24" />;

  const affiliated = university.affiliatedColleges || [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b bg-background py-10 md:py-14">
        <div className="container">
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/universities" className="transition-colors hover:text-foreground">Universities</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground">{university.name}</span>
          </nav>

          <div className="flex items-start gap-5">
            <div
              className={cn(
                "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-display text-lg font-bold text-white shadow-lg",
                gradientFor(university.name)
              )}
            >
              {university.short}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                {university.name}
              </h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                {university.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="gap-1.5">
                  <MapPin className="h-3 w-3" /> {university.location}
                </Badge>
                <Badge variant="secondary" className="gap-1.5">
                  <Calendar className="h-3 w-3" /> Est. {university.established}
                </Badge>
                <Badge variant="secondary" className="gap-1.5">
                  <Users className="h-3 w-3" /> {formatNumber(university.students)} students
                </Badge>
                <Badge variant="gradient">{university.ranking}</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-14">
        <div className="container grid gap-6 lg:grid-cols-3">
          {/* Programs + Affiliated Colleges */}
          <div className="space-y-6 lg:col-span-2">
            {/* Programs Offered */}
            <Card>
              <CardHeader>
                <CardTitle>Programs offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {university.programs.map((program) => (
                    <div
                      key={program}
                      className="flex items-center gap-2.5 rounded-lg border bg-muted/30 px-4 py-3 text-sm font-medium"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                      {program}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Affiliated Colleges */}
            {affiliated.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Affiliated Colleges & Campuses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {affiliated.map((prog) => {
                    const isExpanded = expandedProgram === prog.program;
                    const totalCount = prog.constituent.length + prog.affiliated.length;

                    return (
                      <div key={prog.program} className="rounded-xl border overflow-hidden">
                        <button
                          onClick={() => setExpandedProgram(isExpanded ? null : prog.program)}
                          className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <Landmark className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">{prog.program}</p>
                              <p className="text-xs text-muted-foreground">
                                {totalCount} {totalCount === 1 ? "campus" : "campuses"} · {prog.constituent.length} constituent · {prog.affiliated.length} affiliated
                              </p>
                            </div>
                          </div>
                          <ChevronDown
                            className={cn(
                              "h-5 w-5 text-muted-foreground transition-transform",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </button>

                        {isExpanded && (
                          <div className="border-t bg-muted/20 p-4 space-y-4">
                            {/* Constituent Campuses */}
                            {prog.constituent.length > 0 && (
                              <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                  Public / Constituent Campuses ({prog.constituent.length})
                                </p>
                                <div className="grid gap-2 sm:grid-cols-2">
                                  {prog.constituent.map((college, i) => (
                                    <CollegeItem key={i} college={college} />
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Affiliated Colleges */}
                            {prog.affiliated.length > 0 && (
                              <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                  Private / Affiliated Colleges ({prog.affiliated.length})
                                </p>
                                <div className="grid gap-2 sm:grid-cols-2">
                                  {prog.affiliated.map((college, i) => (
                                    <CollegeItem key={i} college={college} />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">University type</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="text-sm">{university.type}</Badge>
                <p className="mt-3 text-sm text-muted-foreground">
                  {university.type === "Private"
                    ? "A private university with modern curricula and independent governance."
                    : university.type === "Open"
                    ? "An open and distance learning university offering flexible programs."
                    : "A public university with constituent and affiliated colleges across Nepal."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Founded</span>
                  <span className="font-semibold">{university.established}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Students</span>
                  <span className="font-semibold">{formatNumber(university.students)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Programs</span>
                  <span className="font-semibold">{university.programs.length}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Ranking</span>
                  <span className="font-semibold">{university.ranking}</span>
                </div>
                {affiliated.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Affiliated Campuses</span>
                    <span className="font-semibold">
                      {affiliated.reduce((acc, p) => acc + p.constituent.length + p.affiliated.length, 0)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <a
              href={university.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border p-4 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-muted/50"
            >
              <Globe className="h-4 w-4 text-primary" />
              <div>
                <p>Official Website</p>
                <p className="text-xs text-muted-foreground">{university.website}</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function CollegeItem({ college }: { college: AffiliatedCollege }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border bg-background px-3 py-2.5 text-sm">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground">
        {college.name.split(" ").slice(0, 2).map(w => w[0]).join("")}
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium">{college.name}</p>
        <p className="truncate text-[11px] text-muted-foreground">{college.location}</p>
      </div>
    </div>
  );
}
