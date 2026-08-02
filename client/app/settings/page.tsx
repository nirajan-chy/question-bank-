import type { Metadata } from "next";
import { seo } from "@/lib/seo";
import { SettingsPage } from "@/features/dashboard/components/settings-page";

export const metadata: Metadata = seo({
  title: "Settings",
  description: "Manage your Sandarbh profile, preferences and notifications.",
  path: "/settings",
});

export default function Page() {
  return <SettingsPage />;
}
