import type { Metadata } from "next";

import { seo } from "@/lib/seo";
import { serverApi } from "@/lib/server-api";
import { UniversityDetail } from "@/features/universities/components/university-detail";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const university = await serverApi.university(slug);
  if (!university) return { title: "University" };
  return seo({
    title: university.name,
    description: university.description,
    path: `/universities/${slug}`,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <UniversityDetail slug={slug} />;
}
