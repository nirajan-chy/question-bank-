"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Settings, Sparkles } from "lucide-react";
import { dashboardNav } from "@/lib/nav";
import { useUserStore } from "@/store/use-user-store";
import { cn, initials } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUserStore();

  const nextLevelXp = 5000;
  const progress = Math.min(100, Math.round((user.xp / nextLevelXp) * 100));

  return (
    <div className="container flex gap-8 py-8 md:py-12">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24 space-y-4">
          <Link href="/profile" className="flex items-center gap-3 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">
              {initials(user.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
            </div>
          </Link>

          <nav className="space-y-1 rounded-2xl border bg-card p-2">
            {dashboardNav.map((item) => {
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="rounded-2xl border border-primary/20 bg-brand-gradient p-5 text-white">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Level progress</p>
              <span className="flex items-center gap-1 text-xs">
                <Flame className="h-3.5 w-3.5" /> {user.streak} day streak
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0" />
              <div className="flex-1">
                <Progress value={progress} className="bg-white/20" indicatorClassName="bg-white" />
              </div>
              <span className="text-xs font-bold">{user.xp.toLocaleString()}/{nextLevelXp}</span>
            </div>
            <p className="mt-3 text-xs text-white/80">{nextLevelXp - user.xp} XP to next level</p>
            <Link href="/settings" className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/25">
              <Settings className="h-3.5 w-3.5" /> Manage settings
            </Link>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
