import type { Metadata } from "next";
import { seo } from "@/lib/seo";
import { LearnShell } from "@/features/learn/components/learn-shell";

export const metadata: Metadata = seo({
  title: "Self Learning Center",
  description:
    "Your private AI study room on PrashnaHub — upload your own notes, books and past papers, ask grounded questions with citations, and generate practice MCQs from your material.",
  path: "/learn",
});

export default function LearnPage() {
  return <LearnShell />;
}
