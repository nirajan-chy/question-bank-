"use client";

import { useState } from "react";
import { Library } from "lucide-react";
import { useBooks } from "@/services/queries";
import { PageHeader } from "@/components/shared/page-header";
import { GridSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { BookCard } from "@/features/education/components/cards";
import { ResourceFilters } from "./resource-filters";

export function BooksPage() {
  const { data: books, isLoading } = useBooks();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All levels");
  const [sort, setSort] = useState("popular");

  const filtered = (books ?? [])
    .filter((b) => {
      const matchesQuery =
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.author.toLowerCase().includes(query.toLowerCase()) ||
        b.publisher.toLowerCase().includes(query.toLowerCase());
      const matchesLevel = level === "All levels" || b.level.includes(level.replace("NEB · ", ""));
      return matchesQuery && matchesLevel;
    })
    .sort((a, b) => {
      if (sort === "recent") return b.edition.localeCompare(a.edition);
      if (sort === "rating") return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  return (
    <>
      <PageHeader
        icon={Library}
        title="Books & Textbooks"
        description="The books every Nepali student needs — textbooks, guides and references for SEE, NEB, CTEVT and every university program."
        crumbs={[{ label: "Books" }]}
      />
      <section className="py-12 md:py-16">
        <div className="container">
          <ResourceFilters
            query={query}
            onQuery={setQuery}
            level={level}
            onLevel={setLevel}
            sort={sort}
            onSort={setSort}
          />
          {isLoading || !books ? (
            <GridSkeleton count={8} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No books found"
              description="Try adjusting your filters or search terms."
              actionLabel="Browse all books"
              actionHref="/books"
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
