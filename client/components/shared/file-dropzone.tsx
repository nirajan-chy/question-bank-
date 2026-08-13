"use client";

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

type FileDropzoneProps = {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  onFiles: (files: File[]) => void;
  children?: React.ReactNode;
};

export function FileDropzone({
  accept,
  multiple = false,
  disabled = false,
  className,
  id,
  onFiles,
  children,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const depthRef = useRef(0);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    depthRef.current = 0;
    setDragging(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length) onFiles(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) onFiles(files);
    e.target.value = "";
  };

  return (
    <div
      id={id}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload file"
      onClick={() => {
        if (!disabled) inputRef.current?.click();
      }}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        depthRef.current += 1;
        setDragging(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => {
        e.preventDefault();
        depthRef.current = Math.max(0, depthRef.current - 1);
        if (depthRef.current === 0) setDragging(false);
      }}
      onDrop={handleDrop}
      className={cn(
        "relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all",
        dragging
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : "border-muted-foreground/25 hover:border-primary/40 hover:bg-muted/30",
        disabled && "pointer-events-none cursor-not-allowed opacity-60",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={handleChange}
        disabled={disabled}
      />
      {children ?? (
        <div className="flex flex-col items-center gap-2">
          <UploadCloud
            className={cn(
              "h-8 w-8",
              dragging ? "text-primary" : "text-muted-foreground"
            )}
          />
          <p className="text-sm font-semibold">
            {dragging ? "Drop your file here" : "Click to choose or drag & drop"}
          </p>
          {accept && (
            <p className="text-xs text-muted-foreground">Accepted: {accept}</p>
          )}
        </div>
      )}
    </div>
  );
}
