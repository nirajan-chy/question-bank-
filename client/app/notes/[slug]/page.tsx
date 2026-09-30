import { use } from "react";
import { NoteViewer } from "@/features/resources/components/note-viewer";

export default function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <main className="py-10">
      <div className="container">
        <NoteViewer slug={slug} />
      </div>
    </main>
  );
}
