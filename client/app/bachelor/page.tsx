import { seo } from "@/lib/seo";
import { BachelorPage } from "@/features/bachelor/components/bachelor-page";

export const metadata = seo({
  title: "Bachelor Programs",
  description:
    "BSc CSIT, engineering, BBA, BBS, nursing and more at TU, KU, PU, Purbanchal — semester notes, old questions and mock tests.",
  path: "/bachelor",
});

export default function Page() {
  return <BachelorPage />;
}
