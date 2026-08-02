import { seo } from "@/lib/seo";
import { NoticesPage } from "@/features/opportunities/components/notices-page";

export const metadata = seo({
  title: "Notices",
  description:
    "Exam routines, admission deadlines, result alerts and curriculum updates from NEB, CDC, CTEVT and universities.",
  path: "/notices",
});

export default function Page() {
  return <NoticesPage />;
}
