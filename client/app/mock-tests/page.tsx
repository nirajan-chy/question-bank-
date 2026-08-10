import { seo } from "@/lib/seo";
import { MockTestsPage } from "@/features/resources/components/mock-tests-page";

export const metadata = seo({
  title: "Mock Tests",
  description:
    "Timed mock tests for NEB, CTEVT and university exams with instant scoring, GPA projection and solutions.",
  path: "/mock-tests",
});

export default function Page() {
  return <MockTestsPage />;
}
