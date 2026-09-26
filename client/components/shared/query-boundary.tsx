"use client";

import type { ReactNode } from "react";

import { ErrorState } from "./error-state";

type QueryBoundaryProps = {
  isLoading: boolean;
  error?: unknown;
  onRetry?: () => void;
  /** When true and the request succeeded, render the empty slot instead. */
  isEmpty?: boolean;
  loading?: ReactNode;
  empty?: ReactNode;
  children: ReactNode;
};

/**
 * One place that decides what a request renders in each of its four states.
 *
 * Every list and detail screen in the app goes through this, which is why no
 * page can accidentally show an empty grid when the API is actually down.
 *
 *   <QueryBoundary
 *     isLoading={isLoading}
 *     error={error}
 *     onRetry={refetch}
 *     isEmpty={items.length === 0}
 *     loading={<GridSkeleton />}
 *     empty={<EmptyState title="No notes yet" />}
 *   >
 *     {items.map(...)}
 *   </QueryBoundary>
 */
export function QueryBoundary({
  isLoading,
  error,
  onRetry,
  isEmpty = false,
  loading,
  empty,
  children,
}: QueryBoundaryProps) {
  if (isLoading) return <>{loading}</>;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (isEmpty) return <>{empty}</>;
  return <>{children}</>;
}

type AsyncBlockProps = Omit<QueryBoundaryProps, "children"> & {
  children: ReactNode;
  /** Rendered while loading — usually a skeleton, never a bare spinner. */
  skeleton?: ReactNode;
  /** Rendered when the request succeeded but produced nothing. */
  emptyState?: ReactNode;
  className?: string;
};

/**
 * `QueryBoundary` with a column layout and a consistent gap, for the common
 * "one section of a page" case.
 */
export function AsyncBlock({
  skeleton,
  emptyState,
  className,
  children,
  ...boundary
}: AsyncBlockProps) {
  return (
    <QueryBoundary
      {...boundary}
      loading={skeleton ?? <div className="h-40" />}
      empty={emptyState ?? <div className="h-40" />}
    >
      <div className={className}>{children}</div>
    </QueryBoundary>
  );
}
