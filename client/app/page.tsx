import { Hero } from "@/features/home/components/hero";
import { EducationLevels } from "@/features/home/components/education-levels";
import { Faculties } from "@/features/home/components/faculties";
import { Universities } from "@/features/home/components/universities";
import { TrendingSubjects } from "@/features/home/components/trending-subjects";
import { LatestNotes } from "@/features/home/components/latest-notes";
import { BooksSection } from "@/features/home/components/books-section";
import { QuestionBanksSection } from "@/features/home/components/question-banks-section";
import { MockTestsSection } from "@/features/home/components/mock-tests-section";
import { ScholarshipsSection } from "@/features/home/components/scholarships-section";
import { NoticesResults } from "@/features/home/components/notices-results";
import { FaqSection } from "@/features/home/components/faq-section";
import { Newsletter } from "@/features/home/components/newsletter";
import { CtaBanner } from "@/features/home/components/cta-banner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <EducationLevels />
      <Faculties />
      <Universities />
      <TrendingSubjects />
      <LatestNotes />
      <BooksSection />
      <QuestionBanksSection />
      <MockTestsSection />
      <ScholarshipsSection />
      <NoticesResults />
      <CtaBanner />
      <FaqSection />
      <Newsletter />
    </>
  );
}
