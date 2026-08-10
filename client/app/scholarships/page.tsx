import { seo } from "@/lib/seo";
import { ScholarshipsPage } from "@/features/opportunities/components/scholarships-page";

export const metadata = seo({
  title: "Scholarships",
  description:
    "Government and private scholarships in Nepal with live deadlines — for NEB, CTEVT, Bachelor and Master students.",
  path: "/scholarships",
});

export default function Page() {
  return <ScholarshipsPage />;
}
