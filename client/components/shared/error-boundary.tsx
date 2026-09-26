"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /** Route segment this boundary guards, used in the console report. */
  label?: string;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render-time crashes so one broken component cannot blank the whole
 * app. The caught error is reported to the console with the guarded route so
 * it is actually diagnosable instead of vanishing silently.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      `[ErrorBoundary]${this.props.label ? ` (${this.props.label})` : ""} render error:`,
      error,
      info.componentStack
    );
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <TriangleAlert className="h-6 w-6" />
        </span>
        <div>
          <h2 className="font-display text-lg font-semibold">This page ran into a problem</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Reloading usually clears it. If it keeps happening, let us know.
          </p>
        </div>
        <Button onClick={() => window.location.reload()} className="mt-1">
          <RefreshCw className="h-4 w-4" />
          Reload page
        </Button>
      </div>
    );
  }
}
