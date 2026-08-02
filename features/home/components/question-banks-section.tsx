"use client";

import { useQuestionBanks } from "@/services/queries";
import { SectionHeader } from "@/components/shared/section-header";
import { Stagger, StaggerItem } from "@/components/shared/motion";
import { GridSkeleton } from "@/components/shared/skeletons";
import { QuestionBankCard } from "@/features/education/components/cards";

export function QuestionBanksSection() {
  const { data: banks, isLoading } = useQuestionBanks({ limit: 4 });

  return (
    <section className="border-y bg-muted/30 py-16 md:py-24">
      <div className="container">
        <SectionHeader
          eyebrow="Question Banks"
          title="Practice the questions that matter"
          description="Exam-pattern question banks built from the last decade of board and university papers."
          href="/question-banks"
          linkLabel="All question banks"
        />
        {isLoading || !banks ? (
          <GridSkeleton count={4} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" />
        ) : (
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {banks.map((qb) => (
              <StaggerItem key={qb.id}>
                <QuestionBankCard qb={qb} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
