import type { Metadata } from "next";
import { seo } from "@/lib/seo";
import { CommunityList } from "@/features/community/components/community-list";

export const metadata: Metadata = seo({
  title: "Community Q&A",
  description: "Ask questions and help fellow Nepali students — notes, papers and doubts in one thread. Free for everyone.",
  path: "/community",
});

export default function Page() {
  return <CommunityList />;
}
