import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Inline SVG wordmark.
 *
 * Deliberately not a bitmap: it inherits `currentColor` so it needs no
 * light/dark asset swap (and no flash on first paint), stays crisp at any size,
 * and costs ~1 KB instead of megabytes.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-hidden="true"
      className={cn("h-9 w-9 shrink-0", className)}
    >
      <defs>
        <linearGradient id="prashnahub-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--brand-from))" />
          <stop offset="100%" stopColor="hsl(var(--brand-to))" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#prashnahub-mark)" />
      {/* An open book: two pages meeting at a spine. */}
      <path
        d="M11 13.5c3.6-1.6 6.6-1.6 9 0v14c-2.4-1.6-5.4-1.6-9 0v-14Z"
        fill="hsl(var(--primary-foreground))"
        fillOpacity="0.95"
      />
      <path
        d="M29 13.5c-3.6-1.6-6.6-1.6-9 0v14c2.4-1.6 5.4-1.6 9 0v-14Z"
        fill="hsl(var(--primary-foreground))"
        fillOpacity="0.7"
      />
    </svg>
  );
}

export function Logo({
  className,
  withText = true,
}: {
  className?: string;
  withText?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="PrashnaHub — home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
<<<<<<< HEAD
      <LogoMark className="transition-transform duration-300 group-hover:scale-105" />
      {withText && (
        <span className="font-display text-lg font-bold leading-none tracking-tight">
=======
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc}
        alt="PrashnaHub logo"
        className={cn("shrink-0 object-contain h-10 w-auto sm:h-12 sm:w-auto")}
      />
      {withText && (
        <span className="font-display text-base font-bold tracking-tight sm:text-lg">
>>>>>>> origin/main
          Prashna<span className="text-primary">Hub</span>
        </span>
      )}
    </Link>
  );
}
