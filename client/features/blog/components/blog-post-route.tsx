"use client";

import { BlogPostPage } from "@/features/blog/components/blog-post-page";
import { ErrorState } from "@/components/shared/error-state";
import { usePost } from "@/services/queries";

/**
 * Client half of /blog/[slug].
 *
 * The route itself is a server component (it needs to raise `notFound()` for
 * SEO), but the article is rendered from the live API through React Query, so
 * the fetch has to happen in a client component.
 */
export function BlogPostRoute({ slug }: { slug: string }) {
  const { data: post, isPending, isError, error, refetch } = usePost(slug);

  if (isPending) return <BlogPostSkeleton />;

  if (isError) {
    return (
      <div className="container max-w-3xl py-20">
        <ErrorState title="Could not load this article" error={error} onRetry={() => void refetch()} />
      </div>
    );
  }

  if (!post) return null;
  return <BlogPostPage post={post} />;
}

function BlogPostSkeleton() {
  return (
    <div className="container max-w-3xl py-12">
      <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      <div className="mt-6 h-10 w-full animate-pulse rounded-lg bg-muted" />
      <div className="mt-3 h-10 w-4/5 animate-pulse rounded-lg bg-muted" />
      <div className="mt-8 h-64 w-full animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}
