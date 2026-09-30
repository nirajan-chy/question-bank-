import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ApiClientError } from "@/services/http";

/**
 * Turns an unknown thrown value into a message that is safe (and useful) to
 * show a user. Anything we cannot explain falls back to a generic sentence
 * rather than leaking a stack trace or internal message.
 */
export function toErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (error instanceof ApiClientError) {
    if (error.status === 0) return "Could not reach the server. Check your connection and try again.";
    if (error.status === 404) return "We could not find what you were looking for.";
    if (error.status === 401) return "Your session has expired. Please sign in again.";
    if (error.status === 403) return "You do not have permission to view this.";
    if (error.status >= 500) return "The server had a problem. Please try again in a moment.";
    if (error.message) return error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function isOfflineError(error: unknown): boolean {
  return error instanceof ApiClientError && error.status === 0;
}

type ErrorStateProps = {
  title?: string;
  error?: unknown;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
};

export function ErrorState({
  title,
  error,
  onRetry,
  className,
  compact = false,
}: ErrorStateProps) {
  const message = error ? toErrorMessage(error) : "Something went wrong.";
  const offline = isOfflineError(error);
  const Icon = offline ? WifiOff : AlertTriangle;

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/25 bg-destructive/5 text-center",
        compact ? "px-4 py-8" : "px-6 py-14",
        className
      )}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="font-semibold">{title ?? "Could not load this"}</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-1">
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
}

/** Compact inline variant for panels, table cells and admin screens. */
export function InlineError({
  error,
  onRetry,
  className,
}: {
  error: unknown;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-center gap-3 rounded-lg border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm",
        className
      )}
    >
      <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
      <p className="flex-1 text-muted-foreground">{toErrorMessage(error)}</p>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      )}
    </div>
  );
}
