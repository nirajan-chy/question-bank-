import { use } from "react";
import { PastPaperViewer } from "@/features/resources/components/past-paper-viewer";

export default function PastPaperDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <main className="py-10">
      <div className="container">
        <PastPaperViewer slug={slug} />
      </div>
    </main>
  );
}
