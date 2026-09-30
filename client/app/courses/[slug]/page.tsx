import type { Metadata } from "next";

import { seo } from "@/lib/seo";
import { serverApi } from "@/lib/server-api";
import { CourseDetail } from "@/features/courses/components/course-detail";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await serverApi.course(slug);
  if (!course) return { title: "Course" };
  return seo({
    title: `${course.name} — Notes, Question Banks & Syllabus`,
    description: course.description,
    path: `/courses/${slug}`,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <CourseDetail slug={slug} />;
}
