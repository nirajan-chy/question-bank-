"use client";

import { useState } from "react";
import { Eye, FileCode, FileText, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { convertPdfToMarkdown } from "@/lib/pdf-to-markdown";
import { cn } from "@/lib/utils";
import { FileDropzone } from "./file-dropzone";
import { MarkdownContent } from "./markdown-content";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MAX_SIZE = 15 * 1024 * 1024;

/**
 * Markdown field with built-in client-side PDF → Markdown conversion.
 * The selected PDF is parsed in the browser and never uploaded anywhere.
 */
export function MarkdownEditor({
  id,
  label,
  value,
  onChange,
  placeholder,
  className,
}: {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [converting, setConverting] = useState(false);
  const [progressLabel, setProgressLabel] = useState("");

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Invalid file type", { description: "Please choose a PDF file." });
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("File too large", { description: "Maximum file size is 15 MB." });
      return;
    }

    setConverting(true);
    try {
      const result = await convertPdfToMarkdown(file, (page, total) =>
        setProgressLabel(`Extracting page ${page} of ${total}…`)
      );
      onChange(result.markdown);
      if (result.emptyPages.length === result.pages) {
        toast.warning("No text found", {
          description: "This PDF looks like scanned images — nothing could be extracted.",
        });
      } else {
        toast.success(`Converted ${result.pages} page${result.pages > 1 ? "s" : ""}`, {
          description:
            result.emptyPages.length > 0
              ? `Pages with no text skipped: ${result.emptyPages.join(", ")}`
              : file.name,
        });
      }
    } catch (error) {
      toast.error("Conversion failed", {
        description: error instanceof Error ? error.message : "The PDF could not be read.",
      });
    } finally {
      setConverting(false);
      setProgressLabel("");
    }
  };

  const words = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label htmlFor={id}>
          {label}
          <Badge variant="outline" className="ml-2 text-[9px]">markdown</Badge>
        </Label>
        <span className="text-[11px] text-muted-foreground">
          {value.length.toLocaleString()} chars · {words.toLocaleString()} words
        </span>
      </div>

      <div className="rounded-xl border border-primary/30 bg-primary/[0.03] p-3">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Import a PDF — converted to markdown right in your browser. The file is never uploaded.
        </p>
        <FileDropzone
          accept="application/pdf"
          disabled={converting}
          onFiles={(files) => handleFile(files[0])}
          className="py-4"
        >
          <div className="flex items-center justify-center gap-2">
            {converting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <p className="text-sm font-semibold">{progressLabel || "Converting…"}</p>
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold">Click to choose or drag &amp; drop a PDF</p>
              </>
            )}
          </div>
        </FileDropzone>
      </div>

      <Tabs defaultValue="write">
        <div className="flex items-center justify-between">
          <TabsList className="h-8">
            <TabsTrigger value="write" className="gap-1.5 px-3 text-xs">
              <FileCode className="h-3.5 w-3.5" /> Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-1.5 px-3 text-xs">
              <Eye className="h-3.5 w-3.5" /> Preview
            </TabsTrigger>
          </TabsList>
          {value && (
            <Button variant="ghost" size="sm" type="button" onClick={() => onChange("")}>
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </Button>
          )}
        </div>
        <TabsContent value="write" className="mt-2">
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder ?? "# Chapter 1\n\n**Q1.** First question…\n\n- Option A\n- Option B"}
            rows={14}
            spellCheck={false}
            className="w-full rounded-lg border bg-background p-3 font-mono text-xs leading-6 outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-2">
          <div className="max-h-[60vh] min-h-56 overflow-y-auto rounded-lg border bg-background p-4">
            {value.trim() ? (
              <MarkdownContent content={value} />
            ) : (
              <p className="py-10 text-center text-xs text-muted-foreground">
                Nothing to preview yet.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
