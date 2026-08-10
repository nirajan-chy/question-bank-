import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { seo } from "@/lib/seo";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { AboutSections } from "@/features/about/components/about-sections";

export const metadata: Metadata = seo({
  title: "About Us",
  description: "Sandarbh is Nepal's free education platform — notes, books, question banks, past papers and mock tests for every level, from NEB to Master.",
  path: "/about",
});

export default function Page() {
  return (
    <>
      <PageHeader
        icon={GraduationCap}
        gradient="from-emerald-500 to-teal-500"
        title="Every Nepali student deserves quality study material."
        description="Sandarbh (सन्दर्भ — 'reference') is a free, curriculum-first education platform covering NEB Class 12, CTEVT, Bachelor & Master across Nepal's major universities."
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "128k+", label: "Students learning" },
              { value: "2,400+", label: "Study resources" },
              { value: "77", label: "Districts reached" },
              { value: "15", label: "Levels & streams" },
            ].map((s) => (
              <Card key={s.label} className="p-6 text-center">
                <p className="font-display text-3xl font-extrabold text-gradient">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <AboutSections />
    </>
  );
}
