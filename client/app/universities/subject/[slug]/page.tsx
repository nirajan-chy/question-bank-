import { notFound } from "next/navigation";
<<<<<<< HEAD
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
=======
import type { Metadata } from "next";
import { seo } from "@/lib/seo";
import { subjectCategories } from "@/lib/university-subjects";
import { UniversitiesBySubject } from "@/features/universities/components/universities-by-subject";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = subjectCategories.find((c) => c.slug === slug);
  if (!category) return {};
  return seo({
    title: `Universities Offering ${category.name}`,
    description: `Find and compare universities that offer ${category.name} programs in Nepal.`,
    path: `/universities/subject/${slug}`,
  });
}

export async function generateStaticParams() {
  return subjectCategories.map((c) => ({ slug: c.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!subjectCategories.some((c) => c.slug === slug)) notFound();
  return <UniversitiesBySubject slug={slug} />;
>>>>>>> origin/main
}
