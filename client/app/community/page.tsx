import type { Metadata } from "next";
import { seo } from "@/lib/seo";

export const metadata: Metadata = seo({
  title: "Community",
  description: "Join study communities, discuss topics, and help fellow students — all in one place.",
  path: "/community",
});

export default function Page() {
  return null;
}