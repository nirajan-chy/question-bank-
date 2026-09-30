import type { Metadata } from "next";

import { seo } from "@/lib/seo";
import { BlogIndex } from "@/features/blog/components/blog-index";

export const metadata: Metadata = seo({
  title: "Blog",
  description:
    "Exam strategies, study plans, career guides and scholarship updates for Nepali students — written by toppers, teachers and counsellors.",
  path: "/blog",
});

export default function Page() {
  return <BlogIndex />;
}
