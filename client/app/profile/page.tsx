import type { Metadata } from "next";
import { seo } from "@/lib/seo";
import { ProfilePage } from "@/features/dashboard/components/profile-page";

export const metadata: Metadata = seo({
  title: "My Profile",
  description: "Your PrashnaHub profile — study stats, badges, XP and weekly leaderboard position.",
  path: "/profile",
});

export default function Page() {
  return <ProfilePage />;
}
