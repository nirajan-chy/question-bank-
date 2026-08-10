"use client";

import { useBooks } from "@/services/queries";
import { SectionHeader } from "@/components/shared/section-header";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { GridSkeleton } from "@/components/shared/skeletons";
import { BookCard } from "@/features/education/components/cards";

export function BooksSection() {
  const { data: books, isLoading } = useBooks({ limit: 8 });

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <SectionHeader
          eyebrow="Books"
          title="Books every student needs"
          description="Textbooks, guides and reference books for NEB, CTEVT and every university program."
          href="/books"
          linkLabel="All books"
        />
        {isLoading || !books ? (
          <GridSkeleton count={8} />
        ) : (
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((book) => (
              <StaggerItem key={book.id}>
                <BookCard book={book} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
