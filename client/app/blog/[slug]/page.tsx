import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { seo } from "@/lib/seo";
import { serverApi } from "@/lib/server-api";
import { BlogPostRoute } from "@/features/blog/components/blog-post-route";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await serverApi.post(slug);
  if (!post) return { title: "Article" };
  return seo({ title: post.title, description: post.excerpt, path: `/blog/${slug}` });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  // Raised from the server component so Next can serve a real 404 page. The
  // article body itself is fetched in the browser by <BlogPostRoute />.
  if (!(await serverApi.post(slug))) notFound();

  return <BlogPostRoute slug={slug} />;
}
