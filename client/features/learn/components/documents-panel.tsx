"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useDeleteDocument, useRagDocuments, useUploadDocument } from "@/services/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ACCEPTED = ".pdf,.docx,.txt";

export function DocumentsPanel() {
  const { data: documents, isLoading } = useRagDocuments();
  const upload = useUploadDocument();
  const remove = useDeleteDocument();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx", "txt"].includes(ext ?? "")) {
      toast.error("Only PDF, DOCX and TXT files are supported");
      return;
    }
    try {
      toast.promise(upload.mutateAsync(file), {
        loading: "Reading and indexing your document…",
        success: `"${file.name}" is ready — you can now ask questions about it.`,
        error: (err: Error) => err.message,
      });
    } catch {
      // toast.promise handles the error UI
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader>
          <CardTitle>Your documents</CardTitle>
          <CardDescription>
            Files here are private to you and power both the chat and the quiz builder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : !documents || documents.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-4 font-medium">No documents yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload your first study material to unlock AI answers and quizzes.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center gap-4 rounded-xl border bg-card p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{doc.filename}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                      <span>{doc.file_type.toUpperCase()}</span>
                      <span>·</span>
                      <span>{doc.chunk_count.toLocaleString()} chunks</span>
                      <span>·</span>
                      <span>{formatDate(doc.created_at)}</span>
                      {doc.status === "ready" && <span>·</span>}
                      {doc.status === "ready" && (
                        <span>{(doc.char_count / 1000).toFixed(1)}k characters</span>
                      )}
                    </p>
                    {doc.status === "failed" && doc.error && (
                      <p className="mt-1 text-xs text-destructive">{doc.error}</p>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "shrink-0",
                      doc.status === "ready" && "border-success/30 bg-success/10 text-success",
                      doc.status === "processing" && "border-muted bg-muted/40 text-muted-foreground",
                      doc.status === "failed" && "border-destructive/30 bg-destructive/10 text-destructive"
                    )}
                  >
                    {doc.status === "ready" ? "Ready" : doc.status === "processing" ? "Indexing…" : "Failed"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      remove.mutate(doc.id, {
                        onSuccess: () => toast.success(`Deleted "${doc.filename}"`),
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

      <Card
        className={cn(
          "transition-colors",
          dragging && "border-primary ring-2 ring-primary/30"
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
        <CardHeader>
          <CardTitle>Upload material</CardTitle>
          <CardDescription>
            Drag & drop a file here, or click to browse. PDF, DOCX and TXT up to 20 MB.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors hover:border-primary/50 hover:bg-muted/40"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-white">
              {upload.isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <UploadCloud className="h-6 w-6" />}
            </span>
            <span className="text-sm font-medium">Click to choose a file</span>
            <span className="text-xs text-muted-foreground">
              Your document is chunked and embedded — indexing takes a few seconds.
            </span>
          </button>
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
        </CardContent>
      </Card>
    </div>
  );
}
