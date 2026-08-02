import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/services/db";
import { seo } from "@/lib/seo";
import { UniversityDetail } from "@/features/universities/components/university-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const uni = db.universities.find((u) => u.slug === slug);
  if (!uni) return {};
  return seo({
    title: uni.name,
    description: uni.description,
    path: `/universities/${slug}`,
  });
}

export async function generateStaticParams() {
  return db.universities.map((u) => ({ slug: u.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!db.universities.some((u) => u.slug === slug)) notFound();
  return <UniversityDetail slug={slug} />;
}
