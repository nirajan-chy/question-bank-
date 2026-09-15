"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  ExternalLink,
  FileText,
  Landmark,
  Clock,
} from "lucide-react";
import { usePastPapers } from "@/services/queries";
import { resolveFileUrl } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";
import type { PastPaper } from "@/types";
import { PageHeader } from "@/components/shared/page-header";
import { GridSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { PastPaperCard } from "@/features/education/components/cards";
import { ResourceFilters } from "./resource-filters";
import { PdfViewer } from "./pdf-viewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function PastPapersPage() {
  const { data: papers, isLoading } = usePastPapers();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All levels");
  const [sort, setSort] = useState("popular");
  const [selected, setSelected] = useState<PastPaper | null>(null);

  const filtered = (papers ?? [])
    .filter((p) => {
      const matchesQuery =
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.subjectName.toLowerCase().includes(query.toLowerCase()) ||
        p.exam.toLowerCase().includes(query.toLowerCase());
      const matchesLevel = level === "All levels" || p.level.includes(level.replace("NEB · ", ""));
      return matchesQuery && matchesLevel;
    })
    .sort((a, b) => {
      if (sort === "recent") return b.year - a.year;
      if (sort === "rating") return b.downloads - a.downloads;
      return b.downloads - a.downloads;
    });

  return (
    <>
      <PageHeader
        icon={FileText}
        title="Past Papers"
        description="Official board and university exam papers from NEB, CTEVT, TU, KU and PU — practice under real exam conditions."
        crumbs={[{ label: "Past Papers" }]}
      />
      <section className="py-12 md:py-16">
        <div className="container">
          {selected ? (
            <PastPaperInlineView paper={selected} onBack={() => setSelected(null)} />
          ) : (
            <>
              <ResourceFilters
                query={query}
                onQuery={setQuery}
                level={level}
                onLevel={setLevel}
                sort={sort}
                onSort={setSort}
              />
              {isLoading || !papers ? (
                <GridSkeleton count={8} />
              ) : filtered.length === 0 ? (
                <EmptyState
                  title="No past papers found"
                  description="Try adjusting your filters or search terms."
                  actionLabel="Browse all"
                  actionHref="/past-papers"
                />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {filtered.map((paper) => (
                    <PastPaperCard key={paper.id} paper={paper} onSelect={setSelected} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

function PastPaperInlineView({ paper, onBack }: { paper: PastPaper; onBack: () => void }) {
  const pdfUrl = paper.pdfUrl ? resolveFileUrl(paper.pdfUrl) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
            <ArrowLeft className="h-4 w-4" /> All past papers
          </Button>
          <h1 className="font-display text-2xl font-bold leading-tight">{paper.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">{paper.subjectName}</Badge>
            <Badge variant="outline">{paper.level}</Badge>
            <Badge variant="outline">{paper.year} BS</Badge>
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
        <PdfViewer url={pdfUrl} title={paper.title} className="min-h-[70vh]" />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-20 text-center">
          <FileText className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm font-semibold text-muted-foreground">No PDF uploaded yet</p>
          <p className="text-xs text-muted-foreground">An admin can upload it from the Admin panel.</p>
        </div>
      )}
    </div>
  );
}

function Meta({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value: string }) {
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
