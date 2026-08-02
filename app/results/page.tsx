import { seo } from "@/lib/seo";
import { ResultsPage } from "@/features/opportunities/components/results-page";

export const metadata = seo({
  title: "Results",
  description:
    "SEE, NEB, TU, CTEVT and university exam results in Nepal — pass rates, highlights and official links.",
  path: "/results",
});

export default function Page() {
  return <ResultsPage />;
}
