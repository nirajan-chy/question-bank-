"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles, TrendingUp, BookOpen, Timer, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CountUp } from "@/components/shared/count-up";
import { StationeryBg } from "@/components/shared/stationery-bg";

type HeroStat = { label: string; value: number; suffix: string; icon: React.ComponentType<{ className?: string }> };

const stats: HeroStat[] = [
  // { label: "Students learning", value: 128000, suffix: "+", icon: Users },
  // { label: "Study resources", value: 2400, suffix: "+", icon: BookOpen },
  // { label: "Questions solved", value: 2400000, suffix: "+", icon: TrendingUp },
  // { label: "Mock tests taken", value: 360000, suffix: "+", icon: Timer },
];

const ease = [0.21, 0.47, 0.32, 0.98] as const;

export function Hero({ onSearch }: { onSearch?: (q: string) => void }) {
  const router = useRouter();
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (new FormData(form).get("q") as string).trim();
    if (!q) return;
    onSearch?.(q);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <section className="relative overflow-hidden bg-background">
      <StationeryBg />

      <div className="container relative px-4 pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary md:text-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Nepal&apos;s #1 education platform
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-balance md:text-6xl lg:text-7xl"
          >
            Ace Every Exam.
            <br />
            <span className="text-primary">Your Learning Space at Your Own Pace.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="mt-5 max-w-2xl text-sm text-muted-foreground text-pretty md:text-lg"
          >
            Notes, books, question banks, past papers and mock tests for NEB, CTEVT,
            Bachelor and Master — covering TU, KU, PU, Purbanchal and more. Free for every
            Nepali student.
          </motion.p>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
            className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-2xl border bg-background/80 p-1.5 shadow-card-hover backdrop-blur-xl focus-within:ring-2 focus-within:ring-primary/40"
          >
            <Search className="ml-3 h-5 w-5 shrink-0 text-muted-foreground" />
            <Input
              name="q"
              placeholder="Search notes, subjects, papers..."
              className="h-11 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button type="submit" size="lg" className="hidden h-11 sm:inline-flex">
              Search
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease }}
            className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground"
          >
            <span>Popular:</span>
            {["Physics", "BSc CSIT", "NEB Papers", "CTEVT Nursing"].map((t) => (
              <Link
                key={t}
                href={`/search?q=${encodeURIComponent(t)}`}
                className="rounded-full border bg-background px-3 py-1 transition-colors hover:border-primary hover:text-primary"
              >
                {t}
              </Link>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease }}
            className="mt-14 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border bg-background/70 p-4 text-left backdrop-blur-sm transition-colors hover:border-primary/40"
              >
                <s.icon className="h-4 w-4 text-primary" />
                <p className="mt-2 font-display text-xl font-bold md:text-2xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
                <p className="text-[11px] text-muted-foreground md:text-xs">{s.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex items-center gap-3"
          >
            <Link
              href="/classes"
              className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
            >
              Explore classes
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
