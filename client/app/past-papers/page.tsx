import { seo } from "@/lib/seo";
import { PastPapersPage } from "@/features/resources/components/past-papers-page";

export const metadata = seo({
  title: "Past Papers",
  description:
    "Official NEB, CTEVT, TU, KU and PU past exam papers — free to download and practice.",
  path: "/past-papers",
});

export default function Page() {
  return <PastPapersPage />;
}
