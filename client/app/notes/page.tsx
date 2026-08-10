import { seo } from "@/lib/seo";
import { NotesPage } from "@/features/resources/components/notes-page";

export const metadata = seo({
  title: "Study Notes",
  description:
    "Chapter-wise study notes for NEB Class 12, CTEVT, Bachelor and Master — free PDFs from toppers and teachers.",
  path: "/notes",
});

export default function Page() {
  return <NotesPage />;
}
