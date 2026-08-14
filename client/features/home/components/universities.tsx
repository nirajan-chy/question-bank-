"use client";

import Link from "next/link";
import { useUniversities } from "@/services/queries";
import { SectionHeader } from "@/components/shared/section-header";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";
import { gradientFor } from "@/lib/gradients";

export function Universities() {
  const { data: universities, isLoading } = useUniversities();

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <SectionHeader
          eyebrow="Universities"
          title="Study at Nepal's finest universities"
          description="TU, KU, PU, Purbanchal and more — curriculum, notes and past papers for every institution."
          href="/universities"
          linkLabel="All universities"
        />
        {isLoading || !universities ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-primary/10" />
            ))}
          </div>
        ) : (
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {universities.slice(0, 6).map((uni) => (
              <StaggerItem key={uni.id}>
                <Link
                  href={`/universities/${uni.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover"
                >
                  <span
                    className={cn(
                      "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br font-display text-lg font-bold text-white shadow-sm",
                      gradientFor(uni.name)
                    )}
                  >
                    {uni.short}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold group-hover:text-primary">{uni.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Est. {uni.established} · {formatNumber(uni.students)} students
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-primary">{uni.ranking}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
