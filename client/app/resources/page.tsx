import { seo } from "@/lib/seo";
import { ResourcesPage } from "@/features/resources/components/resources-page";

export const metadata = seo({
  title: "Resources",
  description:
    "All study resources in one place — notes, books, question banks, past papers and mock tests for every level.",
  path: "/resources",
});

export default function Page() {
  return <ResourcesPage />;
}
