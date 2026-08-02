import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/services/db";
import { seo } from "@/lib/seo";
import { SubjectDetail } from "@/features/subjects/components/subject-detail";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const subject = db.subjects.find((s) => s.slug === slug);
  if (!subject) return {};
  return seo({
    title: `${subject.name} — Notes, Question Banks & Syllabus`,
    description: subject.description,
    path: `/subjects/${slug}`,
  });
}

export async function generateStaticParams() {
  return db.subjects.map((s) => ({ slug: s.slug }));
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  if (!db.subjects.some((s) => s.slug === slug)) notFound();
  const { tab } = await searchParams;
  return <SubjectDetail slug={slug} initialTab={tab} />;
}
