"use client";

import { useNotices, useResults } from "@/services/queries";
import { SectionHeader } from "@/components/shared/section-header";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { NoticeCard, ResultCard } from "@/features/education/components/cards";
import { Skeleton } from "@/components/ui/skeleton";

export function NoticesResults() {
  const { data: notices, isLoading: loadingNotices } = useNotices({ limit: 3 });
  const { data: results, isLoading: loadingResults } = useResults();

  return (
    <section className="py-16 md:py-24">
      <div className="container grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeader
            eyebrow="Notices"
            title="Latest announcements"
            description="Exam routines, admissions, results and curriculum updates."
            href="/notices"
            linkLabel="All notices"
          />
          {loadingNotices || !notices ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <Stagger className="space-y-3">
              {notices.map((notice) => (
                <StaggerItem key={notice.id}>
                  <NoticeCard notice={notice} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>

        <div>
          <SectionHeader
            eyebrow="Results"
            title="Exam results tracker"
            description="SEE, NEB, TU, CTEVT and university results at a glance."
            href="/results"
            linkLabel="All results"
          />
          {loadingResults || !results ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full" />
              ))}
            </div>
          ) : (
            <Stagger className="space-y-3">
              {results.slice(0, 3).map((result) => (
                <StaggerItem key={result.id}>
                  <ResultCard result={result} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </div>
    </section>
  );
}
