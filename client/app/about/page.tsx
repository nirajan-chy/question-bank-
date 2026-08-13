import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { seo } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { AboutSections } from "@/features/about/components/about-sections";

export const metadata: Metadata = seo({
  title: "About Us",
  description: "PrashnaHub is Nepal's free education platform — notes, books, question banks, past papers and mock tests for every level, from NEB to Master.",
  path: "/about",
});

export default function Page() {
  return (
    <>
      <PageHeader
        icon={GraduationCap}
        gradient="from-emerald-500 to-teal-500"
        title="Every Nepali student deserves quality study material."
        description="PrashnaHub is a free, curriculum-first education platform covering NEB Class 12, CTEVT, Bachelor & Master across Nepal's major universities."
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <section className="py-12 md:py-16">
        <div className="container">
    
        </div>
      </section>

      <AboutSections />
    </>
  );
}
