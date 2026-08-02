import { seo } from "@/lib/seo";
import { UniversitiesPage } from "@/features/universities/components/universities-page";

export const metadata = seo({
  title: "Universities",
  description:
    "Compare Nepal's universities — TU, KU, PU, Purbanchal, Gandaki and more. Programs, campuses, past papers and student life.",
  path: "/universities",
});

export default function Page() {
  return <UniversitiesPage />;
}
