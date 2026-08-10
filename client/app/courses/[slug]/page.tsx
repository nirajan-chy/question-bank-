import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/services/db";
import { seo } from "@/lib/seo";
import { CourseDetail } from "@/features/courses/components/course-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = db.courses.find((c) => c.slug === slug);
  if (!course) return {};
  return seo({
    title: `${course.name} — Notes, Question Banks & Syllabus`,
    description: course.description,
    path: `/courses/${slug}`,
  });
}

export async function generateStaticParams() {
  return db.courses.map((c) => ({ slug: c.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!db.courses.some((c) => c.slug === slug)) notFound();
  return <CourseDetail slug={slug} />;
}