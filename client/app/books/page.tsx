import { seo } from "@/lib/seo";
import { BooksPage } from "@/features/resources/components/books-page";

export const metadata = seo({
  title: "Books & Textbooks",
  description:
    "Textbooks, guides and reference books for NEB, CTEVT and university programs in Nepal.",
  path: "/books",
});

export default function Page() {
  return <BooksPage />;
}
