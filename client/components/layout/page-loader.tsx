"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { LogoMark } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

/** Floor on the first-load splash so it never flickers on a fast connection. */
const SPLASH_MIN_MS = 750;
/** Opacity transition on the splash curtain (Tailwind `duration-300`). */
const SPLASH_FADE_MS = 300;
/** Give up waiting for `load` — the CSS covers a JS-less visitor anyway. */
const SPLASH_CEILING_MS = 5000;
/** How long the top progress bar runs after a client-side navigation. */
const NAV_BAR_MS = 900;

/** Indeterminate 1/3-width sweep, shared by the splash track and the route bar. */
function LoaderIndicator() {
  return (
    <span
      aria-hidden="true"
      className="loader-indicator h-full w-1/3 rounded-full bg-brand-gradient animate-loader-slide"
    />
  );
}

/**
 * First-paint curtain: brand mark, wordmark and a progress track. Holds until
 * the window has loaded, then fades out.
 */
function Splash({ leaving }: { leaving: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed inset-0 z-[60] grid place-items-center bg-background/90 px-6 backdrop-blur-md transition-opacity duration-300",
        leaving && "pointer-events-none opacity-0",
      )}
    >
      <div className="flex w-full max-w-[15rem] flex-col items-center gap-5 text-center">
        <div className="relative grid place-items-center">
          <span
            aria-hidden="true"
            className="absolute h-24 w-24 rounded-full bg-primary/25 blur-2xl"
          />
          <LogoMark className="relative h-14 w-14 animate-loader-breathe" />
        </div>

        <p className="font-display text-xl font-bold leading-none tracking-tight">
          Prashna<span className="text-primary">Hub</span>
        </p>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <LoaderIndicator />
        </div>

        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}

/**
 * Route-change feedback: a hairline bar pinned above the navbar (z-40) and
 * announcement bar (z-50). Deliberately `pointer-events: none` territory — by
 * the time `usePathname` updates, the new route has already rendered and
 * blocking a click would only add latency.
 */
function RouteBar() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden bg-primary/15"
    >
      <LoaderIndicator />
    </div>
  );
}

/**
 * App-wide loading indicator.
 *
 * First paint gets a blocking splash; every client-side navigation afterwards
 * gets a thin top bar instead of a full-screen curtain.
 */
export function PageLoader() {
  const pathname = usePathname();
  const [splash, setSplash] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [nav, setNav] = useState(false);

  const splashDone = useRef(false);
  const splashTimers = useRef<number[]>([]);
  const navTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const start = Date.now();
    let settled = false;

    const schedule = (fn: () => void, ms: number) => {
      splashTimers.current.push(window.setTimeout(fn, ms));
    };

    const run = () => {
      if (settled) return;
      settled = true;

      const delay = Math.max(0, SPLASH_MIN_MS - (Date.now() - start));
      schedule(() => {
        setLeaving(true);
        schedule(() => {
          splashDone.current = true;
          setLeaving(false);
          setSplash(false);
        }, SPLASH_FADE_MS);
      }, delay);
    };

    if (document.readyState === "complete") run();
    else window.addEventListener("load", run, { once: true });

    schedule(run, SPLASH_CEILING_MS);

    return () => {
      window.removeEventListener("load", run);
      splashTimers.current.forEach((id) => window.clearTimeout(id));
      splashTimers.current = [];
      window.clearTimeout(navTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!splashDone.current) return;

    window.clearTimeout(navTimer.current);
    setNav(true);
    navTimer.current = window.setTimeout(() => setNav(false), NAV_BAR_MS);

    return () => window.clearTimeout(navTimer.current);
  }, [pathname]);

  if (splash) return <Splash leaving={leaving} />;
  if (!nav) return null;
  return <RouteBar />;
}
