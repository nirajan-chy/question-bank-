import { seo } from "@/lib/seo";
import { NotesPage } from "@/features/resources/components/notes-page";

export const metadata = seo({
  title: "Study Notes",
  description:
    "Chapter-wise study notes for Class 8-12 (SEE, NEB), CTEVT, Bachelor and Master — free PDFs from toppers and teachers.",
  path: "/notes",
});

export default function Page() {
  return <NotesPage />;
}
