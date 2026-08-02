import type { Metadata } from "next";
import { seo } from "@/lib/seo";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

export const metadata: Metadata = seo({
  title: "Dashboard",
  description: "Track your study streak, XP, sessions, pomodoro timer and leaderboard position on Sandarbh.",
  path: "/dashboard",
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
