import { seo } from "@/lib/seo";
import { SubjectsPage } from "@/features/subjects/components/subjects-page";

export const metadata = seo({
  title: "Subjects",
  description:
    "Browse every subject from SEE, NEB, CTEVT, Bachelor and Master — notes, question banks, past papers and mock tests.",
  path: "/subjects",
});

export default function Page() {
  return <SubjectsPage />;
}
