import "server-only";

import { cache } from "react";

import { SERVER_API_BASE } from "@/config/env";

/**
 * Server-side reads used for route metadata only.
 *
 * Page content is always fetched in the browser through the React Query layer
 * (`services/queries.ts`) so users see live data. This helper exists so
 * `generateMetadata` can still produce a real title/description from the
 * database — but it never throws: if the API is unreachable (during a build,
 * or in a preview deploy) the page simply falls back to static metadata instead
 * of failing the whole route.
 *
 * Node is not subject to CORS, so this talks to the backend directly rather
 * than looping through the Next rewrite proxy.
 */

const TIMEOUT_MS = 8000;

type Envelope<T> = { success: boolean; data?: T; message?: string };

/** De-duplicates identical reads within a single render pass. */
export const fetchFromApi = cache(async <T,>(path: string): Promise<T | null> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${SERVER_API_BASE}${path}`, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;

    const body = (await res.json()) as Envelope<T>;
    return body.success ? (body.data ?? null) : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
});

export const serverApi = {
  subject: (slug: string) => fetchFromApi<{ name: string; description?: string }>(`/subjects/${slug}`),
  level: (slug: string) => fetchFromApi<{ name: string; description?: string }>(`/levels/${slug}`),
  course: (slug: string) => fetchFromApi<{ name: string; description?: string }>(`/courses/${slug}`),
  university: (slug: string) =>
    fetchFromApi<{ name: string; description?: string; type?: string }>(`/universities/${slug}`),
  post: (slug: string) => fetchFromApi<{ title: string; excerpt?: string }>(`/posts/${slug}`),
};
