"use client";

import { useEffect, useState } from "react";
import { FileText, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { admin } from "@/services/api";
import { cn } from "@/lib/utils";
import { FileDropzone } from "./file-dropzone";
import { Button } from "@/components/ui/button";

const MAX_SIZE = 15 * 1024 * 1024;

const ACCEPT = {
  image: "image/png,image/jpeg,image/webp,image/gif",
  pdf: "application/pdf",
};

export type FileUploadKind = "image" | "pdf";

type AdminFileUploadProps = {
  id?: string;
  kind: FileUploadKind;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
};

function resolveUrl(value: string): string {
  if (!value) return "";
  if (value.startsWith("http")) return value;
  if (value.startsWith("/uploads/")) return value;
  return `/uploads/${value}`;
}

export function AdminFileUpload({
  id,
  kind,
  value,
  onChange,
  label,
  className,
}: AdminFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const handleFile = async (file?: File) => {
    if (!file) return;
    const valid = ACCEPT[kind].split(",");
    if (!valid.includes(file.type)) {
      toast.error(`Invalid file type`, {
        description: kind === "image" ? "Please choose a PNG, JPG, WEBP or GIF image." : "Please choose a PDF file.",
      });
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("File too large", { description: "Maximum file size is 15 MB." });
      return;
    }
    if (kind === "image") {
      setPreview(URL.createObjectURL(file));
    }
    setUploading(true);
    setProgress(0);
    try {
      const result = await admin.uploadWithProgress(file, (pct) => setProgress(pct));
      onChange(result.url);
      toast.success(kind === "image" ? "Image uploaded" : "PDF uploaded", {
        description: result.filename,
      });
    } catch (error) {
      setPreview(null);
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const clear = () => {
    setPreview(null);
    onChange("");
  };

  const currentUrl = preview ?? (value ? resolveUrl(value) : "");

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <p className="text-sm font-medium">{label}</p>}
      <FileDropzone
        id={id}
        accept={ACCEPT[kind]}
        disabled={uploading}
        onFiles={(files) => handleFile(files[0])}
        className="py-5"
      >
        <div className="flex flex-col items-center gap-2">
          {kind === "image" ? (
            <ImageIcon className="h-7 w-7 text-muted-foreground" />
          ) : (
            <FileText className="h-7 w-7 text-muted-foreground" />
          )}
          <p className="text-sm font-semibold">
            {kind === "image" ? "Click to choose or drag & drop an image" : "Click to choose or drag & drop a PDF"}
          </p>
          <p className="text-xs text-muted-foreground">PNG · JPG · WEBP · GIF (max 15 MB)</p>
        </div>
      </FileDropzone>

      {uploading && (
        <div className="space-y-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">Uploading… {progress}%</p>
        </div>
      )}

      {currentUrl && !uploading && (
        <div className="flex items-center gap-2">
          {kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentUrl}
              alt="Uploaded"
              className="h-14 w-14 rounded-lg border object-cover"
            />
          ) : (
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full items-center gap-1.5 truncate rounded-md border border-primary/30 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10"
            >
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">View file</span>
            </a>
          )}
          <Button variant="ghost" size="sm" onClick={clear} type="button">
            <X className="h-4 w-4" /> Clear
          </Button>
        </div>
      )}
    </div>
  );
}
