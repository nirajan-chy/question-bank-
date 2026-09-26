"use client";

import Link from "next/link";
import { MapPin, Building2 } from "lucide-react";
import { useUniversities } from "@/services/queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber, cn } from "@/lib/utils";
import { gradientFor } from "@/lib/gradients";

export function UniversitiesBySubject({ subjectSlug }: { subjectSlug: string }) {
  const { data: universities, isLoading } = useUniversities();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  const filtered = (universities ?? []).filter((u) =>
    u.programs?.some((p) => p.toLowerCase().includes(subjectSlug.toLowerCase())) ||
    u.description?.toLowerCase().includes(subjectSlug.toLowerCase())
  );

  if (filtered.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center">
        <Building2 className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-4 font-medium">No universities found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          No universities offer programs in this subject yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((uni) => (
        <Link key={uni.id} href={`/universities/${uni.slug}`}>
          <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-display text-sm font-bold text-white shadow-md",
                    gradientFor(uni.name)
                  )}
                >
                  {uni.short}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base font-bold tracking-tight group-hover:text-primary">
                    {uni.name}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="gap-1 text-2xs">
                      <MapPin className="h-2.5 w-2.5" /> {uni.location}
                    </Badge>
                    <Badge variant="outline" className="text-2xs">{uni.type}</Badge>
                  </div>
                </div>
              </div>

              <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
                {uni.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-1">
                {uni.programs.slice(0, 4).map((prog) => (
                  <Badge key={prog} variant="info" className="text-2xs">
                    {prog}
                  </Badge>
                ))}
                {uni.programs.length > 4 && (
                  <Badge variant="outline" className="text-2xs">
                    +{uni.programs.length - 4} more
                  </Badge>
                )}
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span>Est. {uni.established}</span>
                <span aria-hidden>·</span>
                <span>{formatNumber(uni.students)} students</span>
                <span aria-hidden>·</span>
                <span>{uni.ranking}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
