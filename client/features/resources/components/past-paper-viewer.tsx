"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  CalendarDays,
  Landmark,
  Clock,
} from "lucide-react";
import { usePastPaper } from "@/services/queries";
import { resolveFileUrl } from "@/lib/utils";
import { GridSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function PastPaperViewer({ slug }: { slug: string }) {
  const { data: paper, isLoading, isError } = usePastPaper(slug);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <GridSkeleton count={1} />
        <SkeletonBar />
      </div>
    );
  }

  if (isError || !paper) {
    return (
      <EmptyState
        title="Past paper not found"
        description="This paper may have been removed."
        actionLabel="Browse all papers"
        actionHref="/past-papers"
      />
    );
  }

  const pdfUrl = resolveFileUrl(paper.pdfUrl);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link href="/past-papers">
              <ArrowLeft className="h-4 w-4" /> All past papers
            </Link>
          </Button>
          <h1 className="font-display text-2xl font-bold leading-tight">{paper.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">{paper.subjectName}</Badge>
            <Badge variant="outline">{paper.level}</Badge>
          </div>
        </div>
        {pdfUrl && (
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" /> Open in new tab
              </a>
            </Button>
            <Button variant="gradient" asChild>
              <a href={pdfUrl} download>
                <Download className="h-4 w-4" /> Download
              </a>
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
          <Meta icon={CalendarDays} label="Year" value={`${paper.year} BS`} />
          <Meta icon={FileText} label="Exam" value={paper.exam} />
          <Meta icon={Landmark} label="Board" value={paper.board} />
          <Meta icon={Clock} label="Duration" value={paper.duration} />
        </CardContent>
      </Card>

      {pdfUrl ? (
        <Card className="overflow-hidden">
          <iframe
            src={pdfUrl}
            title={paper.title}
            className="h-[80vh] w-full border-0 bg-muted/30"
          />
        </Card>
      ) : (
        <EmptyState
          icon={<GraduationCap className="h-6 w-6" />}
          title="No PDF uploaded yet"
          description={`The file for “${paper.title}” hasn't been added. An admin can upload it from the Admin → Past Papers panel.`}
          actionLabel="Back to papers"
          actionHref="/past-papers"
        />
      )}
    </div>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border bg-muted/30 px-3 py-2.5">
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold">{value || "—"}</p>
      </div>
    </div>
  );
}

function SkeletonBar() {
  return <div className="h-[70vh] animate-pulse rounded-xl bg-muted/40" />;
}
