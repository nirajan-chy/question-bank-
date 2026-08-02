"use client";

import { Megaphone } from "lucide-react";
import { useNotices } from "@/services/queries";
import { PageHeader } from "@/components/shared/page-header";
import { NoticeCard } from "@/features/education/components/cards";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";

export function NoticesPage() {
  const { data: notices, isLoading } = useNotices();

  return (
    <>
      <PageHeader
        icon={Megaphone}
        title="Notices & Announcements"
        description="Exam routines, admission deadlines, result alerts and curriculum updates — all in one feed."
        crumbs={[{ label: "Notices" }]}
      />
      <section className="py-12 md:py-16">
        <div className="container max-w-4xl">
          {isLoading || !notices ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full" />
              ))}
            </div>
          ) : notices.length === 0 ? (
            <EmptyState title="No notices" description="No announcements right now. Check back soon." />
          ) : (
            <div className="space-y-4">
              {notices.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
