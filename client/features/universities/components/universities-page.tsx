"use client";

import Link from "next/link";
import { useState } from "react";
import { Landmark, MapPin, Users } from "lucide-react";
import { useUniversities } from "@/services/queries";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn, formatNumber } from "@/lib/utils";
import { GridSkeleton } from "@/components/shared/skeletons";

const types = ["All", "Constituent", "Autonomous", "Affiliated"] as const;

export function UniversitiesPage() {
  const { data: universities, isLoading } = useUniversities();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof types)[number]>("All");

  const filtered = (universities ?? []).filter(
    (u) =>
      (type === "All" || u.type === type) &&
      (u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.location.toLowerCase().includes(query.toLowerCase()) ||
        u.short.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <>
      <PageHeader
        icon={Landmark}
        title="Universities of Nepal"
        description="Explore curriculum, programs, past papers and campus life across Nepal's leading universities — TU, KU, PU, Purbanchal and more."
        crumbs={[{ label: "Universities" }]}
      />
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Search universities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full md:w-72"
            />
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    type === t
                      ? "border-primary bg-primary text-primary-foreground"
                      : "hover:border-primary/40 hover:text-primary"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {isLoading || !universities ? (
            <GridSkeleton count={6} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((uni) => (
                <Link
                  key={uni.id}
                  href={`/universities/${uni.slug}`}
                  className="group flex h-full flex-col rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-display text-lg font-bold text-white",
                        uni.gradient
                      )}
                    >
                      {uni.short}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold group-hover:text-primary">{uni.name}</h3>
                      <p className="text-xs text-muted-foreground">Est. {uni.established} · {uni.ranking}</p>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-3 flex-1 text-sm text-muted-foreground">
                    {uni.description}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-1.5">
                    {uni.programs.slice(0, 3).map((p) => (
                      <span key={p} className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium">
                        {p}
                      </span>
                    ))}
                    {uni.programs.length > 3 && (
                      <span className="text-[11px] text-muted-foreground">+{uni.programs.length - 3}</span>
                    )}
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {uni.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {formatNumber(uni.students)}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">{uni.type}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
