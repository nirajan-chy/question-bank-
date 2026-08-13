"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Award, BookOpen, Clock, Flame, Medal, Sparkles, Target, Trophy } from "lucide-react";
import { useLeaderboard } from "@/services/queries";
import { useUserStore } from "@/store/use-user-store";
import { useStudyStore } from "@/store/use-study-store";
import { cn, formatNumber, initials } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

const badgeDefs: Record<string, { icon: typeof Flame; color: string; desc: string }> = {
  "Early Bird": { icon: Sparkles, color: "from-violet-500 to-fuchsia-500", desc: "Joined PrashnaHub in its first year" },
  "Question Solver": { icon: Target, color: "from-sky-500 to-blue-600", desc: "Answered 100+ practice questions" },
  "10-Day Streak": { icon: Flame, color: "from-orange-500 to-red-500", desc: "Studied 10 days in a row" },
  "Mock Test Veteran": { icon: Trophy, color: "from-amber-500 to-orange-500", desc: "Took 10+ full mock tests" },
  "Community Helper": { icon: Award, color: "from-emerald-500 to-teal-500", desc: "Answered 5 community questions" },
  "Consistent Learner": { icon: Clock, color: "from-rose-500 to-pink-500", desc: "Studied 30+ hours this month" },
};

export function ProfilePage() {
  const { user } = useUserStore();
  const { sessions, completedPomodoros } = useStudyStore();

  const totalMinutes = sessions.reduce((a, s) => a + s.minutes, 0);
  const { data: leaderboard = [] } = useLeaderboard();
  const myRank = leaderboard.findIndex((e) => e.name.toLowerCase().includes("sujan")) + 1;
  const displayRank = myRank || 6;

  const allBadges = [
    ...user.badges.map((b) => ({ name: b, unlocked: true })),
    ...Object.keys(badgeDefs)
      .filter((b) => !user.badges.includes(b))
      .map((b) => ({ name: b, unlocked: false })),
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
        <Card className="relative overflow-hidden">
          <div className="h-28 bg-mesh-light dark:bg-mesh-dark" />
          <div className="bg-grid-pattern absolute inset-x-0 top-0 h-28 opacity-30" />
          <div className="relative px-6 pb-6">
            <div className="-mt-10 flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <span className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-background bg-brand-gradient text-2xl font-bold text-white shadow-lg">
                  {initials(user.name)}
                </span>
                <div className="pb-1">
                  <h1 className="font-display text-2xl font-bold">{user.name}</h1>
                  <p className="text-sm text-muted-foreground">@{user.username} · {user.college}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{user.bio}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pb-1">
                <span className="flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm font-semibold">
                  <Flame className="h-4 w-4 text-orange-500" /> {user.streak}
                </span>
                <span className="flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm font-semibold">
                  <Sparkles className="h-4 w-4 text-violet-500" /> {formatNumber(user.xp)} XP
                </span>
                <Button variant="gradient" size="sm" asChild>
                  <Link href="/settings">Edit profile</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { icon: BookOpen, label: "Sessions logged", value: sessions.length, accent: "from-sky-500 to-blue-600" },
          { icon: Clock, label: "Total study hours", value: (totalMinutes / 60).toFixed(1), suffix: "h", accent: "from-violet-500 to-fuchsia-500" },
          { icon: Target, label: "Pomodoros done", value: completedPomodoros, accent: "from-emerald-500 to-teal-500" },
          { icon: Trophy, label: "Global rank", value: `#${displayRank}`, accent: "from-amber-500 to-orange-500" },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white", s.accent)}>
              <s.icon className="h-4 w-4" />
            </span>
            <p className="mt-3 font-display text-2xl font-bold">
              {s.value}
              {s.suffix ?? ""}
            </p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <h2 className="font-display font-bold">Level progress</h2>
          <p className="mt-1 text-xs text-muted-foreground">Earn XP by solving questions, taking mocks and helping the community.</p>
          <div className="mt-4 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-violet-500" />
            <Progress value={(user.xp / 5000) * 100} className="flex-1" indicatorClassName="bg-gradient-to-r from-violet-500 to-fuchsia-500" />
            <span className="text-xs font-bold">{user.xp.toLocaleString()}/5,000</span>
          </div>
          <div className="mt-6 space-y-3">
            {[
              { label: "Questions solved", value: 420, max: 500 },
              { label: "Mock tests taken", value: 8, max: 10 },
              { label: "Community answers", value: 3, max: 5 },
            ].map((g) => (
              <div key={g.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{g.label}</span>
                  <span className="font-medium">{g.value}/{g.max}</span>
                </div>
                <Progress value={(g.value / g.max) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display font-bold">Badges</h2>
          <p className="mt-1 text-xs text-muted-foreground">{allBadges.filter((b) => b.unlocked).length} of {allBadges.length} unlocked</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {allBadges.map((b) => {
              const def = badgeDefs[b.name] ?? badgeDefs["Early Bird"];
              return (
                <div
                  key={b.name}
                  className={cn(
                    "rounded-xl border p-3 text-center transition-colors",
                    b.unlocked ? "border-primary/30 bg-card" : "border-dashed opacity-40 grayscale"
                  )}
                  title={def.desc}
                >
                  <span className={cn("mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-white", def.color)}>
                    <def.icon className="h-4 w-4" />
                  </span>
                  <p className="mt-2 text-[11px] font-semibold leading-tight">{b.name}</p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold">Weekly leaderboard</h2>
            <Medal className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-4 space-y-2.5">
            {leaderboard.map((e) => {
              const isMe = e.name.toLowerCase().includes("sujan");
              return (
                <div key={e.id} className={cn("flex items-center gap-3 rounded-lg px-2 py-1.5", isMe && "rounded-lg bg-primary/10")}>
                  <span className={cn("w-6 text-center font-display text-sm font-bold", e.rank <= 3 ? "text-primary" : "text-muted-foreground")}>
                    {e.rank}
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-[10px] font-bold text-white">
                    {e.avatar}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">
                      {e.name} {isMe && <span className="text-primary">(you)</span>}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{e.level}</p>
                  </div>
                  <span className="flex items-center gap-0.5 text-[10px] text-orange-500">
                    <Flame className="h-3 w-3" /> {e.streak}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
