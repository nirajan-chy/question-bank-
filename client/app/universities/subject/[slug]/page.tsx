import { notFound } from "next/navigation";
import { use } from "react";
import { subjectCategories } from "@/lib/university-subjects";
import { UniversitiesBySubject } from "@/features/universities/components/universities-by-subject";
import { PageHeader } from "@/components/shared/page-header";

export default function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const category = subjectCategories.find((c) => c.slug === slug);

  if (!category) notFound();

  const Icon = category.icon;

  return (
    <>
      <PageHeader
        icon={Icon}
        title={category.name}
        description={category.description}
        crumbs={[{ label: "Universities", href: "/universities" }, { label: category.name }]}
      />
      <section className="py-12 md:py-16">
        <div className="container">
          <UniversitiesBySubject subjectSlug={category.name} />
        </div>
      </section>
    </>
  );
}
