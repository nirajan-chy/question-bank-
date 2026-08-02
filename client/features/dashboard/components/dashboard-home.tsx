"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
} from "lucide-react";
import { db } from "@/services/db";
import { useUserStore } from "@/store/use-user-store";
import { useStudyStore } from "@/store/use-study-store";
import { cn, formatNumber } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

function lastNDays(n: number) {
  const days: { date: string; label: string; minutes: number }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    days.push({
      date,
      label: d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 3),
      minutes: 0,
    });
  }
  return days;
}

export function DashboardHome() {
  const { user, incrementStreak } = useUserStore();
  const { sessions, pomodoroMinutes, isRunning, setRunning, pomodoroMode, setMode, completePomodoro, completedPomodoros } = useStudyStore();
  const [secondsLeft, setSecondsLeft] = useState(pomodoroMinutes * 60);

  const week = useMemo(() => {
    const days = lastNDays(7);
    for (const s of sessions) {
      const day = days.find((d) => d.date === s.date);
      if (day) day.minutes += s.minutes;
    }
    const total = days.reduce((a, d) => a + d.minutes, 0);
    const max = Math.max(60, ...days.map((d) => d.minutes));
    return { days, total, max };
  }, [sessions]);

  const heat = useMemo(() => {
    const cells = lastNDays(56);
    const active = new Set(sessions.map((s) => s.date));
    const minutesByDate = new Map(sessions.map((s) => [s.date, s.minutes]));
    return cells.map((d) => ({ ...d, active: active.has(d.date), minutes: minutesByDate.get(d.date) ?? 0 }));
  }, [sessions]);

  useEffect(() => {
    setSecondsLeft(pomodoroMinutes * 60);
  }, [pomodoroMinutes]);

  useEffect(() => {
    if (!isRunning) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          if (pomodoroMode === "focus") {
            completePomodoro();
            setMode("break");
            setSecondsLeft(5 * 60);
            setRunning(false);
          } else {
            setMode("focus");
            setSecondsLeft(pomodoroMinutes * 60);
            setRunning(false);
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isRunning, pomodoroMode, pomodoroMinutes, completePomodoro, setMode, setRunning]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const timerProgress = (1 - secondsLeft / (pomodoroMinutes * 60)) * 100;

  const stats = [
    { icon: Flame, label: "Day streak", value: user.streak, suffix: " days", accent: "from-orange-500 to-red-500" },
    { icon: Sparkles, label: "Total XP", value: user.xp.toLocaleString(), accent: "from-violet-500 to-fuchsia-500" },
    { icon: Clock, label: "Hours this week", value: (week.total / 60).toFixed(1), suffix: "h", accent: "from-sky-500 to-blue-600" },
    { icon: Target, label: "Pomodoros", value: completedPomodoros, accent: "from-emerald-500 to-teal-500" },
  ];

  const leaderboard = [...db.leaderboard].sort((a, b) => a.rank - b.rank);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">Namaste, {user.name.split(" ")[0]} 🙏</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} · Let’s keep the streak alive.
          </p>
        </div>
        <Button variant="gradient" asChild>
          <Link href="/mock-tests">Start a mock test</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05, ease }}>
            <Card className="p-5">
              <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white", s.accent)}>
                <s.icon className="h-4 w-4" />
              </span>
              <p className="mt-3 font-display text-2xl font-bold">
                {s.value}
                {s.suffix ?? ""}
              </p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold">Last 7 days</h2>
            <Badge variant="secondary">{formatNumber(week.total)} min total</Badge>
          </div>
          <div className="mt-6 flex h-44 items-end gap-2">
            {week.days.map((d, i) => (
              <div key={d.date} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-1 items-end justify-center rounded-lg bg-muted/40">
                  <div
                    className={cn(
                      "w-full rounded-lg bg-gradient-to-t transition-all duration-500",
                      i === 6 ? "from-primary to-fuchsia-500" : "from-primary/70 to-primary/30"
                    )}
                    style={{ height: `${Math.max(4, (d.minutes / week.max) * 100)}%` }}
                  />
                  <span className="absolute -top-6 hidden rounded bg-background px-1.5 py-0.5 text-[10px] font-medium shadow group-hover:block">
                    {d.minutes}m
                  </span>
                </div>
                <span className={cn("text-[10px] text-muted-foreground", i === 6 && "font-bold text-primary")}>{d.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold">Pomodoro</h2>
            <div className="flex gap-1 rounded-lg bg-muted p-1">
              {(["focus", "break"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setSecondsLeft((m === "focus" ? pomodoroMinutes : 5) * 60);
                    setRunning(false);
                  }}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors",
                    pomodoroMode === m ? "bg-background shadow-sm" : "text-muted-foreground"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="relative mx-auto mt-6 flex h-40 w-40 items-center justify-center rounded-full bg-muted/40">
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" strokeWidth="8" className="stroke-muted" />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                className="stroke-primary transition-all duration-1000"
                strokeDasharray={`${(timerProgress / 100) * 439.8} 439.8`}
              />
            </svg>
            <div className="text-center">
              <p className="font-display text-4xl font-bold tabular-nums">
                {mm}:{ss}
              </p>
              <p className="text-xs capitalize text-muted-foreground">{pomodoroMode} time</p>
            </div>
          </div>
          <div className="mt-5 flex justify-center gap-2">
            <Button
              size="icon"
              variant={isRunning ? "destructive" : "default"}
              onClick={() => setRunning(!isRunning)}
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="outline" onClick={() => { setRunning(false); setSecondsLeft(pomodoroMinutes * 60); }}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Timer className="h-3.5 w-3.5" /> {completedPomodoros} completed · Focus then take a 5-min break
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold">Streak heatmap</h2>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Flame className="h-3.5 w-3.5 text-orange-500" /> {user.streak} days
            </span>
          </div>
          <div className="mt-5 grid grid-cols-8 gap-1.5">
            {heat.map((d, i) => (
              <div
                key={i}
                title={`${d.date}${d.active ? ` — ${d.minutes} min` : ""}`}
                className={cn(
                  "aspect-square rounded-[4px] transition-colors",
                  d.active
                    ? d.minutes >= 60
                      ? "bg-gradient-to-br from-orange-400 to-red-500"
                      : "bg-gradient-to-br from-orange-300 to-amber-500"
                    : "bg-muted"
                )}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span>Less</span>
            <span className="h-2.5 w-2.5 rounded-[3px] bg-muted" />
            <span className="h-2.5 w-2.5 rounded-[3px] bg-orange-300" />
            <span className="h-2.5 w-2.5 rounded-[3px] bg-gradient-to-br from-orange-400 to-red-500" />
            <span>More</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold">This week’s goal</h2>
            <Badge variant="secondary">10/15 h</Badge>
          </div>
          <div className="mt-5 flex items-end justify-center gap-3 pb-2">
            {week.days.map((d) => (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-20 w-full items-end justify-center">
                  <div
                    className={cn("w-4 rounded-md", d.minutes >= 45 ? "bg-success" : d.minutes > 0 ? "bg-primary/60" : "bg-muted")}
                    style={{ height: `${Math.min(100, (d.minutes / 60) * 100)}%` }}
                  />
                </div>
                <span className="text-[9px] text-muted-foreground">{d.label[0]}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-4 w-full" onClick={incrementStreak}>
            <CheckCircle2 className="h-4 w-4" /> Log today’s session
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold">Leaderboard</h2>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-4 space-y-2.5">
            {leaderboard.slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-center gap-3">
                <span className={cn("w-6 text-center font-display text-sm font-bold", e.rank <= 3 ? "text-primary" : "text-muted-foreground")}>
                  {e.rank}
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-[10px] font-bold text-white">
                  {e.avatar}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{e.name}</p>
                  <p className="text-[10px] text-muted-foreground">{e.level} · {formatNumber(e.xp)} XP</p>
                </div>
                <span className="flex items-center gap-0.5 text-[10px] text-orange-500">
                  <Flame className="h-3 w-3" /> {e.streak}
                </span>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
            <Link href="/profile">View full leaderboard</Link>
          </Button>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold">Continue studying</h2>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-4 space-y-3">
            {db.subjects.slice(0, 3).map((s, i) => (
              <Link key={s.id} href={`/subjects/${s.slug}`} className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:border-primary/40 hover:bg-accent/40">
                <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-lg", s.gradient)}>{s.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{s.name}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Progress value={[65, 40, 82][i]} className="h-1.5" />
                    <span className="text-[10px] text-muted-foreground">{[65, 40, 82][i]}%</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold">Recent sessions</h2>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-4 space-y-3">
            {sessions.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-xl border p-3">
                <span className="text-xl">{s.subjectEmoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{s.subject}</p>
                  <p className="text-[11px] text-muted-foreground">{s.mode} · {s.date}</p>
                </div>
                <Badge variant="outline">{s.minutes} min</Badge>
              </div>
            ))}
            {sessions.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No sessions yet. Start your first one!</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
