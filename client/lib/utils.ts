import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_ORIGIN = (
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:5000/api"
).replace(/\/api\/?$/, "");

export function resolveFileUrl(url?: string | null): string {
  if (!url) return "";
  if (/^https?:\/\//.test(url)) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? url : `/${url}`}`;
}

/** Full URL for a past-question markdown body stored under the API's /content mount. */
export function resolveContentUrl(contentPath?: string | null): string {
  if (!contentPath) return "";
  const clean = contentPath.replace(/^\/+/, "");
  return `${API_ORIGIN}/content/${clean}`;
}

/**
 * Resolve an asset referenced inside a markdown file (e.g. "./images/q1.png")
 * against its location under the /content mount.
 */
export function resolveContentAsset(
  basePath: string | undefined,
  src: string | undefined
): string {
  if (!src) return "";
  if (/^(https?:|data:|\/\/)/i.test(src)) return src;
  const rel = src.replace(/^\.?\//, "");
  const dir = basePath ? basePath.split("/").slice(0, -1).join("/") : "";
  return dir ? `${API_ORIGIN}/content/${dir}/${rel}` : `${API_ORIGIN}/content/${rel}`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: n >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(n);
}

export function formatDate(
  date: string | Date,
  opts?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...opts,
  }).format(d);
}

export function formatTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export function timeAgo(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [604800, "week"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [secondsPer, unit] of intervals) {
    const count = Math.floor(seconds / secondsPer);
    if (count >= 1) return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map(p => p[0])
    .join("")
    .toUpperCase();
}

export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 220));
}
