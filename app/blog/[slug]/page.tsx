import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/services/db";
import { seo } from "@/lib/seo";
import { BlogPostPage } from "@/features/blog/components/blog-post-page";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = db.posts.find((p) => p.slug === slug);
  if (!post) return {};
  return seo({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
  });
}

export async function generateStaticParams() {
  return db.posts.map((p) => ({ slug: p.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = db.posts.find((p) => p.slug === slug);
  if (!post) notFound();
  return <BlogPostPage post={post} />;
}
