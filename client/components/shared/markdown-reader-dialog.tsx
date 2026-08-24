"use client";

import { Download } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "./markdown-content";

/**
 * Full-page reader for markdown content stored with a resource (converted
 * from PDF at import time — no files are stored server-side).
 */
export function MarkdownReaderDialog({
  open,
  onOpenChange,
  title,
  subtitle,
  content,
  pdfUrl,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  content?: string | null;
  pdfUrl?: string | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[92vh] max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:rounded-xl">
        <DialogHeader className="flex-row items-center justify-between gap-3 border-b bg-muted/30 px-4 py-3">
          <div className="min-w-0">
            <DialogTitle className="truncate text-sm font-semibold sm:text-base">{title}</DialogTitle>
            {subtitle && <DialogDescription className="truncate text-xs">{subtitle}</DialogDescription>}
          </div>
          {pdfUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={pdfUrl} download>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </a>
            </Button>
          )}
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-8 sm:py-6">
          {content?.trim() ? (
            <MarkdownContent content={content} className="mx-auto max-w-3xl" />
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">No readable content available.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
