import { seo } from "@/lib/seo";
import { QuestionBanksPage } from "@/features/resources/components/question-banks-page";

export const metadata = seo({
  title: "Question Banks",
  description:
    "Exam-pattern question banks for NEB, CTEVT, TU, KU and PU — built from the last decade of papers.",
  path: "/question-banks",
});

export default function Page() {
  return <QuestionBanksPage />;
}
