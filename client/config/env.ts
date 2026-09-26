/**
 * API location for browser code.
 *
 * The base is *relative* (`/api`, `` for media): `next.config.mjs` rewrites
 * those paths to the real backend, so every request stays same-origin and CORS
 * is never involved. The app therefore works on any port or host — 3000, 3001,
 * a LAN address or a container — without the API server having to allow-list
 * each one.
 *
 * `NEXT_PUBLIC_BASE_URL` now describes the *backend* only: it is read by
 * `next.config.mjs` (forwarding target) and `lib/server-api.ts` (Node-side
 * metadata reads), never by browser code.
 */

/** Browser requests go through Next's rewrite proxy. */
export const API_BASE_URL = "/api";

/** Alias kept for existing call sites. */
export const BASEURL = API_BASE_URL;

/**
 * Prefix for files the API serves (PDFs, images, uploads) — also relative, so
 * `/uploads/...` is proxied by Next just like the API.
 */
export const API_ORIGIN = "";

/** Where the backend actually lives, for Node-only code. */
export const SERVER_API_BASE = `${
  (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000").replace(/\/api\/?$/, "").replace(/\/+$/, "") || "/api"
}/api`;
