import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/services/db";
import { seo } from "@/lib/seo";
import { LevelDetail } from "@/features/classes/components/level-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const level = db.levels.find((l) => l.slug === slug);
  if (!level) return {};
  return seo({
    title: `${level.name} · ${level.short}`,
    description: level.description,
    path: `/classes/${slug}`,
  });
}

export async function generateStaticParams() {
  return db.levels.map((l) => ({ slug: l.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!db.levels.some((l) => l.slug === slug)) notFound();
  return <LevelDetail slug={slug} />;
}
