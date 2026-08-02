import type { Metadata } from "next";
import { seo } from "@/lib/seo";
import { SearchPage } from "@/features/search/components/search-page";

export const metadata: Metadata = seo({
  title: "Search",
  description: "Search notes, books, question banks, mock tests, scholarships, blog posts and community threads across every level.",
  path: "/search",
});

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  return <SearchPage initialQuery={q ?? ""} />;
}
