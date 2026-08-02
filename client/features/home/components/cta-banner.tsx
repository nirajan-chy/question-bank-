import Link from "next/link";
import { ArrowRight, Sparkles, Users } from "lucide-react";
import { FadeIn } from "@/components/shared/motion";

export function CtaBanner() {
  return (
    <section className="pb-16 md:pb-24">
      <div className="container">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border bg-mesh-light p-8 text-center dark:bg-mesh-dark md:p-14">
            <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40 mask-fade-b" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                <Users className="h-3.5 w-3.5" /> Join 1,28,000+ students
              </span>
              <h2 className="mx-auto mt-5 max-w-2xl font-display text-2xl font-bold tracking-tight text-balance md:text-4xl">
                Start your journey to <span className="text-gradient">exam excellence</span> today
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
                Free notes, question banks, past papers and mock tests — everything you need to
                score your best, in one place.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/classes"
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-gradient px-6 text-sm font-semibold text-white shadow-glow-sm transition-transform hover:scale-[1.03] active:scale-95"
                >
                  <Sparkles className="h-4 w-4" /> Start learning free
                </Link>
                <Link
                  href="/community"
                  className="inline-flex h-11 items-center gap-2 rounded-lg border bg-background px-6 text-sm font-semibold transition-colors hover:bg-accent"
                >
                  Join the community <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
