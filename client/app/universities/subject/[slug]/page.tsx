import { notFound } from "next/navigation";
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
}
