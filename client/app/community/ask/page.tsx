import type { Metadata } from "next";
import { seo } from "@/lib/seo";
import { AskQuestion } from "@/features/community/components/ask-question";

export const metadata: Metadata = seo({
  title: "Ask a Question",
  description: "Ask the Sandarbh community anything about your studies — exams, subjects or career paths.",
  path: "/community/ask",
});

export default function Page() {
  return <AskQuestion />;
}
