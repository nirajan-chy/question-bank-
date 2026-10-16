/**
 * Reads an in-app destination from `?next=` after a sign-in or sign-up.
 *
 * Sanitised: only same-origin absolute paths are allowed, so a crafted link
 * can never bounce a fresh session to an external site.
 *
 * Reads `window.location` directly rather than `useSearchParams()` — the auth
 * forms are prerendered, and `useSearchParams()` would force them into a
 * Suspense boundary.
 */
export function readNextPath(): string | null {
  if (typeof window === "undefined") return null;

  const next = new URLSearchParams(window.location.search).get("next");
  if (!next) return null;
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return null;

  return next;
}

/** Carries `?next=` across the sign-in ↔ sign-up toggle. */
export function withNext(path: string): string {
  if (typeof window === "undefined") return path;

  const next = readNextPath();
  return next ? `${path}?next=${encodeURIComponent(next)}` : path;
}
