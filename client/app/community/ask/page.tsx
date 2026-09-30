import type { Metadata } from "next";

import { seo } from "@/lib/seo";
import { CommunityNav } from "@/features/community/components/community-nav";
import { AskQuestion } from "@/features/community/components/ask-question";

export const metadata: Metadata = seo({
  title: "Ask a question",
  description: "Post your doubt to the community and get a clear, worked-out answer.",
  path: "/community/ask",
  noIndex: true,
});

export default function Page() {
  return (
    <>
      <CommunityNav />
      <AskQuestion />
    </>
  );
}
