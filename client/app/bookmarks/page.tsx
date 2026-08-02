import type { Metadata } from "next";
import { seo } from "@/lib/seo";
import { BookmarksPage } from "@/features/dashboard/components/bookmarks-page";

export const metadata: Metadata = seo({
  title: "My Bookmarks",
  description: "All your saved notes, books, question banks, past papers and mock tests in one place.",
  path: "/bookmarks",
});

export default function Page() {
  return <BookmarksPage />;
}
