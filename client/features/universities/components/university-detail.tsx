"use client";

import { notFound } from "next/navigation";
import { MapPin, Calendar, Users, Globe } from "lucide-react";
import { useUniversities } from "@/services/queries";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AffiliatedColleges } from "@/features/universities/components/affiliated-colleges";
import { formatNumber } from "@/lib/utils";
import { gradientFor } from "@/lib/gradients";

export function UniversityDetail({ slug }: { slug: string }) {
  const { data: universities, isLoading } = useUniversities();
  const university = universities?.find((u) => u.slug === slug);

  if (!isLoading && !university) notFound();
  if (!university) return <div className="py-24" />;

  return (
    <>
      <PageHeader
        title={university.name}
        description={university.description}
        gradient={gradientFor(university.name)}
        crumbs={[{ label: "Universities", href: "/universities" }, { label: university.name }]}
        actions={
          <Badge variant="gradient" className="px-4 py-1.5 text-sm">
            {university.ranking}
          </Badge>
        }
      >
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border bg-background/80 p-4 backdrop-blur-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <p className="mt-2 font-display text-lg font-bold">Est. {university.established}</p>
            <p className="text-xs text-muted-foreground">Founded</p>
          </div>
          <div className="rounded-xl border bg-background/80 p-4 backdrop-blur-sm">
            <Users className="h-4 w-4 text-primary" />
            <p className="mt-2 font-display text-lg font-bold">{formatNumber(university.students)}</p>
            <p className="text-xs text-muted-foreground">Students</p>
          </div>
          <div className="rounded-xl border bg-background/80 p-4 backdrop-blur-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <p className="mt-2 font-display text-sm font-bold">{university.location}</p>
            <p className="text-xs text-muted-foreground">Campus</p>
          </div>
          <a
            href={university.website}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border bg-background/80 p-4 backdrop-blur-sm transition-colors hover:border-primary/40"
          >
            <Globe className="h-4 w-4 text-primary" />
            <p className="mt-2 font-display text-sm font-bold">Official site</p>
            <p className="text-xs text-muted-foreground">Visit →</p>
          </a>
        </div>
      </PageHeader>

      <section className="py-12 md:py-16">
        <div className="container space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">University type</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="text-sm">{university.type}</Badge>
                <p className="mt-3 text-sm text-muted-foreground">
                  {university.type === "Autonomous"
                    ? "An autonomous university with semester-based curricula and independent governance."
                    : university.type === "Constituent"
                    ? "A state university with constituent and affiliated colleges across Nepal."
                    : "A university operating through affiliated colleges nationwide."}
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ranking</span>
                  <span className="font-semibold">{university.ranking}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <AffiliatedColleges slug={university.slug} />
        </div>
      </section>
    </>
  );
}
