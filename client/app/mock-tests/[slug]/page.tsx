import { use } from "react";
import { TakeTest } from "@/features/mock-tests/components/take-test";

export default function MockTestDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <main className="py-10">
      <div className="container">
        <TakeTest slug={slug} />
      </div>
    </main>
  );
}
