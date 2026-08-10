import { seo } from "@/lib/seo";
import { ClassesPage } from "@/features/classes/components/classes-page";

export const metadata = seo({
  title: "Classes & Levels",
  description:
    "NEB Class 12, CTEVT, Bachelor and Master resources — notes, question banks, past papers and mock tests.",
  path: "/classes",
});

export default function Page() {
  return <ClassesPage />;
}
