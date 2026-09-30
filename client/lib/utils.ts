import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { API_ORIGIN } from "@/config/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Turns a stored `/uploads/x.pdf` into a URL the browser can load.
 *
 * Relative, so Next's rewrite proxy forwards it to the API server — media is
 * fetched same-origin for the same reason API calls are.
 */
export function resolveFileUrl(url?: string | null): string {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? url : `/${url}`}`;
}

/* ─── Numbers ─────────────────────────────────────────────────────────────── */

const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const plain = new Intl.NumberFormat("en-US");

export function formatNumber(value: number): string {
  return Number.isFinite(value) ? (Math.abs(value) >= 1000 ? compact.format(value) : plain.format(value)) : "0";
}

export function formatCurrency(value: number, currency = "NPR"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`;
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

/* ─── Dates ───────────────────────────────────────────────────────────────── */

const DATE_FMT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const DATETIME_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

/**
 * Coerces the many date shapes the API returns (ISO strings, `YYYY-MM-DD`, and
 * occasional epoch numbers) into a `Date`, or `null` when unusable.
 */
export function toDate(value: string | number | Date | null | undefined): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: string | number | Date | null | undefined, fallback = "—"): string {
  const date = toDate(value);
  return date ? DATE_FMT.format(date) : fallback;
}

export function formatDateTime(value: string | number | Date | null | undefined, fallback = "—"): string {
  const date = toDate(value);
  return date ? DATETIME_FMT.format(date) : fallback;
}

/** `timeAgo` returns `null` for missing input so callers can omit the label. */
export function timeAgo(value: string | number | Date | null | undefined): string | null {
  const date = toDate(value);
  if (!date) return null;

  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 45) return "just now";

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["week", 604_800],
    ["day", 86_400],
    ["hour", 3600],
    ["minute", 60],
  ];

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, perUnit] of units) {
    if (seconds >= perUnit) return rtf.format(-Math.floor(seconds / perUnit), unit);
  }
  return "just now";
}

/** `m:ss` / `h:mm:ss` for exam timers. */
export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}

/* ─── Text ────────────────────────────────────────────────────────────────── */

export function initials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function readingTime(text: string | null | undefined): number {
  if (!text) return 1;
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 220));
}

export function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${formatNumber(count)} ${count === 1 ? singular : plural}`;
}

/** Case/format-insensitive substring test used by every client-side filter. */
export function matches(haystack: string | null | undefined, needle: string): boolean {
  if (!needle) return true;
  return (haystack ?? "").toLowerCase().includes(needle.toLowerCase());
}

/** Keeps only entries that contain every term, in any order. */
export function matchesAll(values: (string | null | undefined)[], query: string): boolean {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = values.filter(Boolean).join(" ").toLowerCase();
  return terms.every((term) => haystack.includes(term));
}
