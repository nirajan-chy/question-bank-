"use client";

import { Component, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <span className="text-2xl">&#9888;</span>
            </div>
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              An unexpected error occurred. Please try again.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <RefreshCw className="h-4 w-4" /> Reload page
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
