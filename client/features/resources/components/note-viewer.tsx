"use client";

import { useCallback, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  Star,
  User,
  BookOpen,
} from "lucide-react";
import { api } from "@/services/api";
import { useNote, useRelatedNotes } from "@/services/queries";
import { formatNumber } from "@/lib/utils";
import { GridSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { NoteCard } from "@/features/education/components/cards";
import { PdfViewer } from "./pdf-viewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function NoteViewer({ slug }: { slug: string }) {
  const { data: note, isLoading, isError } = useNote(slug);
  const { data: relatedNotes } = useRelatedNotes(slug);

  // Track view on mount
  useEffect(() => {
    if (note?.slug) {
      api.trackNoteView(note.slug).catch(() => {});
    }
  }, [note?.slug]);

  const handleDownload = useCallback(async () => {
    if (!note?.slug || !note?.pdfUrl) return;
    try {
      await api.trackNoteDownload(note.slug);
    } catch {
      // silently fail — download still proceeds
    }
    // Trigger actual file download
    const link = document.createElement("a");
    link.href = `/api/pdf/${note.slug}`;
    link.download = `${note.title || note.slug}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [note?.slug, note?.pdfUrl, note?.title]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <GridSkeleton count={1} />
        <SkeletonBar />
      </div>
    );
  }

  if (isError || !note) {
    return (
      <EmptyState
        title="Note not found"
        description="This note may have been removed."
        actionLabel="Browse all notes"
        actionHref="/notes"
      />
    );
  }

  const pdfUrl = note.pdfUrl
    ? `/api/pdf/${note.slug}`
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <Link href="/notes">
              <ArrowLeft className="h-4 w-4" /> All notes
            </Link>
          </Button>
          <h1 className="font-display text-2xl font-bold leading-tight">
            {note.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">{note.subjectName}</Badge>
            <Badge variant="outline">{note.level}</Badge>
            {note.unit && <Badge variant="outline">{note.unit}</Badge>}
          </div>
        </div>
        {pdfUrl && (
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="h-4 w-4" /> Open in new tab
              </a>
            </Button>
            <Button variant="gradient" onClick={handleDownload}>
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
        )}
      </div>

      {/* Metadata card */}
      <Card>
        <CardContent className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
          <Meta icon={User} label="Author" value={note.author} />
          <Meta icon={Star} label="Rating" value={`${note.rating} / 5`} />
          <Meta
            icon={Eye}
            label="Views"
            value={formatNumber(note.views)}
          />
          <Meta
            icon={Download}
            label="Downloads"
            value={formatNumber(note.downloads)}
          />
        </CardContent>
      </Card>

      {/* Description */}
      {note.description && (
        <p className="text-sm text-muted-foreground">{note.description}</p>
      )}

      {/* PDF Viewer */}
      {pdfUrl ? (
        <PdfViewer
          url={pdfUrl}
          title={note.title}
          className="min-h-[70vh]"
        />
      ) : (
        <EmptyState
          icon={<BookOpen className="h-6 w-6" />}
          title="No PDF uploaded yet"
          description={`The file for "${note.title}" hasn't been added. An admin can upload it from the Admin → Notes panel.`}
          actionLabel="Back to notes"
          actionHref="/notes"
        />
      )}

      {/* Related notes */}
      {relatedNotes && relatedNotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-bold">
            More notes in {note.subjectName}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedNotes.map((n) => (
              <NoteCard key={n.id} note={n} />
            ))}
          </div>
        </div>
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
