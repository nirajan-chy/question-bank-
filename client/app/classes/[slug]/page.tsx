import type { Metadata } from "next";

import { seo } from "@/lib/seo";
import { serverApi } from "@/lib/server-api";
import { LevelDetail } from "@/features/classes/components/level-detail";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const level = await serverApi.level(slug);
  if (!level) return { title: "Class" };
  return seo({
    title: level.name,
    description: level.description,
    path: `/classes/${slug}`,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <LevelDetail slug={slug} />;
}
