"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/** Inline spinner for buttons and toolbars. */
export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-4 w-4 animate-spin", className)} aria-hidden="true" />;
}

/**
 * The single loading primitive. Replaces the five different hand-rolled
 * "Loading..." treatments that were scattered across the app.
 */
export function LoadingState({
  label = "Loading",
  className,
  children,
}: {
  label?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex min-h-[40vh] flex-col items-center justify-center gap-3", className)}
    >
      {children ?? (
        <>
          <Spinner className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{label}…</p>
        </>
      )}
      <span className="sr-only">{label}</span>
    </div>
  );
}
