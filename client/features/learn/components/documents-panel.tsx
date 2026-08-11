"use client";

import { useRef, useState } from "react";
import {
  FileText,
  FileSpreadsheet,
  FileType,
  Loader2,
  Trash2,
  UploadCloud,
  Clock,
  CheckCircle2,
  AlertCircle,
  HardDrive,
} from "lucide-react";
import { toast } from "sonner";
import { useDeleteDocument, useRagDocuments, useUploadDocument } from "@/services/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ACCEPTED = ".pdf,.docx,.txt";

function fileIcon(type: string) {
  switch (type) {
    case "pdf":
      return <FileType className="h-5 w-5 text-red-500" />;
    case "docx":
      return <FileText className="h-5 w-5 text-blue-500" />;
    case "txt":
      return <FileSpreadsheet className="h-5 w-5 text-emerald-500" />;
    default:
      return <FileText className="h-5 w-5 text-muted-foreground" />;
  }
}

function fileBg(type: string) {
  switch (type) {
    case "pdf":
      return "bg-red-500/10";
    case "docx":
      return "bg-blue-500/10";
    case "txt":
      return "bg-emerald-500/10";
    default:
      return "bg-muted";
  }
}

export function DocumentsPanel() {
  const { data: documents, isLoading } = useRagDocuments();
  const upload = useUploadDocument();
  const remove = useDeleteDocument();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const readyDocs = (documents ?? []).filter((d) => d.status === "ready");
  const totalChunks = readyDocs.reduce((acc, d) => acc + d.chunk_count, 0);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx", "txt"].includes(ext ?? "")) {
      toast.error("Only PDF, DOCX and TXT files are supported");
      return;
    }
    try {
      toast.promise(upload.mutateAsync(file), {
        loading: "Reading and indexing your document\u2026",
        success: `"${file.name}" is ready \u2014 you can now ask questions about it.`,
        error: (err: Error) => err.message,
      });
    } catch {
      // toast.promise handles the error UI
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      {/* Document list */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Your documents</CardTitle>
            {documents && documents.length > 0 && (
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <HardDrive className="h-3.5 w-3.5" />
                  {documents.length} file{documents.length !== 1 && "s"}
                </span>
                <span>·</span>
                <span>{totalChunks.toLocaleString()} chunks</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
              ))}
            </div>
          ) : !documents || documents.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60">
                <FileText className="h-8 w-8 text-muted-foreground/40" />
              </span>
              <p className="mt-5 font-display text-lg font-semibold">No documents yet</p>
              <p className="mt-1.5 max-w-xs text-sm text-muted-foreground leading-relaxed">
                Upload your first study material to unlock AI answers and quizzes.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-5"
                onClick={() => inputRef.current?.click()}
              >
                <UploadCloud className="h-4 w-4" /> Upload a file
              </Button>
            </div>
          ) : (
            <ul className="space-y-2">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="group flex items-center gap-4 rounded-xl border bg-background/60 p-4 transition-all hover:border-primary/20 hover:shadow-sm"
                >
                  <span
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                      fileBg(doc.file_type)
                    )}
                  >
                    {fileIcon(doc.file_type)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{doc.filename}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                      <span className="font-medium uppercase">{doc.file_type}</span>
                      <span className="text-muted-foreground/40">·</span>
                      <span>{doc.chunk_count.toLocaleString()} chunks</span>
                      <span className="text-muted-foreground/40">·</span>
                      <span>{formatDate(doc.created_at)}</span>
                      {doc.status === "ready" && (
                        <>
                          <span className="text-muted-foreground/40">·</span>
                          <span>{(doc.char_count / 1000).toFixed(1)}k chars</span>
                        </>
                      )}
                    </div>
                    {doc.status === "failed" && doc.error && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {doc.error}
                      </p>
                    )}
                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      "shrink-0 gap-1 rounded-full px-2.5 py-0.5",
                      doc.status === "ready" &&
                        "border-success/30 bg-success/10 text-success",
                      doc.status === "processing" &&
                        "border-info/30 bg-info/10 text-info",
                      doc.status === "failed" &&
                        "border-destructive/30 bg-destructive/10 text-destructive"
                    )}
                  >
                    {doc.status === "ready" && (
                      <CheckCircle2 className="h-3 w-3" />
                    )}
                    {doc.status === "processing" && (
                      <Clock className="h-3 w-3 animate-pulse" />
                    )}
                    {doc.status === "failed" && (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {doc.status === "ready"
                      ? "Ready"
                      : doc.status === "processing"
                        ? "Indexing\u2026"
                        : "Failed"}
                  </Badge>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                    onClick={() => {
                      remove.mutate(doc.id, {
                        onSuccess: () =>
                          toast.success(`Deleted "${doc.filename}"`),
                        onError: (err: Error) => toast.error(err.message),
                      });
                    }}
                    disabled={remove.isPending}
                    aria-label={`Delete ${doc.filename}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Upload zone */}
      <div className="space-y-4">
        <Card
          className={cn(
            "overflow-hidden transition-all",
            dragging
              ? "border-primary ring-2 ring-primary/20 shadow-glow-sm"
              : "hover:border-primary/20"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
        >
          <CardContent className="p-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="relative flex w-full flex-col items-center gap-4 bg-gradient-to-b from-primary/5 to-transparent px-6 py-12 text-center transition-colors hover:from-primary/8"
            >
              {upload.isPending ? (
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow-sm">
                  <Loader2 className="h-7 w-7 animate-spin" />
                </span>
              ) : (
                <span
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow-sm transition-transform",
                    dragging && "scale-110"
                  )}
                >
                  <UploadCloud className="h-7 w-7" />
                </span>
              )}
              <div>
                <p className="text-sm font-semibold">
                  {dragging
                    ? "Drop your file here"
                    : upload.isPending
                      ? "Uploading\u2026"
                      : "Click to choose a file"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  or drag & drop · PDF, DOCX, TXT up to 100 MB
                </p>
              </div>
              <span className="text-xs text-muted-foreground/60">
                Your document is chunked and embedded — indexing takes a few seconds
              </span>
            </button>
          </CardContent>
        </Card>

        {/* Quick tips */}
        <div className="rounded-xl border bg-muted/20 px-5 py-4">
          <p className="text-xs font-semibold text-foreground">Tips</p>
          <ul className="mt-2 space-y-2 text-xs text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
              Upload textbooks, class notes, or past exam papers
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
              Each file is split into searchable chunks automatically
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
              Delete any file anytime — it won&apos;t affect other uploads
            </li>
          </ul>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
