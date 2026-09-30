"use client";

import { useCallback, useEffect, useState } from "react";
import { BookOpen, Download, Eye, Star, User, ArrowLeft } from "lucide-react";
import { api } from "@/services/api";
import { useNotes } from "@/services/queries";
import type { Note } from "@/types";
import { formatNumber } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { GridSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { NoteCard } from "@/features/education/components/cards";
import { ResourceFilters } from "./resource-filters";
import { PdfViewer } from "./pdf-viewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function NotesPage() {
  const { data: notes, isLoading } = useNotes();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All levels");
  const [sort, setSort] = useState("popular");
  const [selected, setSelected] = useState<Note | null>(null);

  const filtered = (notes ?? [])
    .filter((n) => {
      const matchesQuery =
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.subjectName.toLowerCase().includes(query.toLowerCase()) ||
        n.author.toLowerCase().includes(query.toLowerCase());
      const matchesLevel = level === "All levels" || n.level.includes(level.replace("NEB · ", ""));
      return matchesQuery && matchesLevel;
    })
    .sort((a, b) => {
      if (sort === "recent") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sort === "rating") return b.rating - a.rating;
      return b.downloads - a.downloads;
    });

  const handleSelect = useCallback((note: Note) => {
    setSelected(note);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <PageHeader
        icon={BookOpen}
        title="Study Notes"
        description="Chapter-wise notes written by toppers and teachers — updated for the latest CDC and NEB curriculum. Free to download."
        crumbs={[{ label: "Notes" }]}
      />
      <section className="py-12 md:py-16">
        <div className="container">
          {selected ? (
            <NoteInlineView note={selected} onBack={() => setSelected(null)} />
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
              {isLoading || !notes ? (
                <GridSkeleton count={8} />
              ) : filtered.length === 0 ? (
                <EmptyState
                  title="No notes found"
                  description="Try adjusting your filters or search terms."
                  actionLabel="Browse all notes"
                  actionHref="/notes"
                />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {filtered.map((note) => (
                    <NoteCard key={note.id} note={note} onSelect={handleSelect} />
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

function NoteInlineView({ note, onBack }: { note: Note; onBack: () => void }) {
  // Track view
  useEffect(() => {
    api.trackNoteView(note.slug).catch(() => {});
  }, [note.slug]);

  const handleDownload = useCallback(() => {
    api.trackNoteDownload(note.slug).catch(() => {});
    const link = document.createElement("a");
    link.href = `/api/pdf/${note.slug}`;
    link.download = `${note.title || note.slug}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [note.slug, note.title]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
            <ArrowLeft className="h-4 w-4" /> Back to notes
          </Button>
          <h1 className="font-display text-2xl font-bold leading-tight">{note.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">{note.subjectName}</Badge>
            <Badge variant="outline">{note.level}</Badge>
            {note.unit && <Badge variant="outline">{note.unit}</Badge>}
          </div>
        </div>
        {note.pdfUrl && (
          <div className="flex gap-2">
            <Button variant="gradient" onClick={handleDownload}>
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
          <Meta icon={User} label="Author" value={note.author} />
          <Meta icon={Star} label="Rating" value={`${note.rating} / 5`} />
          <Meta icon={Eye} label="Views" value={formatNumber(note.views)} />
          <Meta icon={Download} label="Downloads" value={formatNumber(note.downloads)} />
        </CardContent>
      </Card>

      {note.description && (
        <p className="text-sm text-muted-foreground">{note.description}</p>
      )}

      {note.pdfUrl ? (
        <PdfViewer url={`/api/pdf/${note.slug}`} title={note.title} className="min-h-[70vh]" />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-20 text-center">
          <BookOpen className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm font-semibold text-muted-foreground">No PDF uploaded yet</p>
          <p className="text-xs text-muted-foreground">An admin can upload it from the Admin panel.</p>
        </div>
      )}
    </div>
  );
}

function Meta({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
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
