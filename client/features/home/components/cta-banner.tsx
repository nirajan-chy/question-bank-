import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/motion";
import { StationeryBg } from "@/components/shared/stationery-bg";

export function CtaBanner() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border bg-background p-8 text-center md:p-14">
            <StationeryBg variant="compact" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                <Users className="h-3.5 w-3.5" /> Join 1,28,000+ students
              </span>
              <h2 className="mx-auto mt-5 max-w-2xl font-display text-2xl font-bold tracking-tight text-balance md:text-4xl">
                Start your journey to <span className="text-primary">exam excellence</span> today
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
                Free notes, question banks, past papers and mock tests — everything you need to
                score your best, in one place.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Button variant="gradient" size="lg" asChild>
                  <Link href="/classes">Start learning free</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/community">
                    Join the community <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
