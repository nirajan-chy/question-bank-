import type { Metadata } from "next";

import { seo } from "@/lib/seo";
import { serverApi } from "@/lib/server-api";
import { SubjectDetail } from "@/features/subjects/components/subject-detail";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const subject = await serverApi.subject(slug);
  if (!subject) return { title: "Subject" };
  return seo({
    title: `${subject.name} — Past Questions`,
    description: subject.description,
    path: `/subjects/${slug}`,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <SubjectDetail slug={slug} />;
}
