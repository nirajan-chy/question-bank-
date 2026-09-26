import type { Metadata } from "next";

import { seo } from "@/lib/seo";
import { CommunityNav } from "@/features/community/components/community-nav";
import { CommunityList } from "@/features/community/components/community-list";

export const metadata: Metadata = seo({
  title: "Questions",
  description: "Ask a question, get unblocked by toppers and teachers, and help other students out.",
  path: "/community/questions",
});

export default function Page() {
  return (
    <>
      <CommunityNav />
      <CommunityList />
    </>
  );
}
