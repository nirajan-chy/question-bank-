import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * The browser only ever talks to the Next server.
 *
 * Every API call and every uploaded file is fetched from a *relative* path
 * (`/api/...`, `/uploads/...`) and forwarded here by the rewrites below, so
 * the request is same-origin and CORS never enters the picture. That means the
 * app works on whatever port it is served from — 3000, 3001, a LAN address or
 * a container — without asking the API server for an allow-list change.
 *
 * `NEXT_PUBLIC_BASE_URL` now describes the *backend* only (it is never read by
 * browser code), and is used solely as the forwarding target.
 */
function readEnvLocal() {
  try {
    const text = readFileSync(join(HERE, ".env.local"), "utf8");
    const found = text.match(/^\s*NEXT_PUBLIC_BASE_URL\s*=\s*(.+?)\s*$/m);
    return found?.[1]?.replace(/^["']|["']$/g, "");
  } catch {
    return undefined;
  }
}

/** Accepts `host`, `host:port`, `host/api` or a full URL; returns an origin. */
function normalizeBackendOrigin(raw) {
  const value = (raw ?? "").trim().replace(/^["']|["']$/g, "");
  if (!value) return "http://localhost:5000";
  try {
    const url = new URL(value);
    const path = url.pathname.replace(/\/+$/, "");
    if (path === "/api") url.pathname = "";
    return url.toString().replace(/\/+$/, "");
  } catch {
    // Bare values like "localhost:5000" or "http://host/api".
    const withoutApi = value.replace(/\/api\/?$/, "").replace(/\/+$/, "");
    return `http://${withoutApi.replace(/^https?:\/\//i, "")}`;
  }
}

const BACKEND_ORIGIN = normalizeBackendOrigin(
  process.env.API_PROXY_TARGET ?? process.env.NEXT_PUBLIC_BASE_URL ?? readEnvLocal()
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
  },
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${BACKEND_ORIGIN}/api/:path*` },
      { source: "/uploads/:path*", destination: `${BACKEND_ORIGIN}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
