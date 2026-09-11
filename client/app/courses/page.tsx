import { seo } from "@/lib/seo";
import { CoursesPage } from "@/features/courses/components/courses-page";

export const metadata = seo({
  title: "Courses",
  description:
    "Browse all bachelor and master courses — BBA, BCA, BIT, CSIT, BBS, BHM, BBM, BITM, BTTM, BA, BE, BSW and more with notes, question banks and past papers.",
  path: "/courses",
});

export default function Page() {
  return <CoursesPage />;
}
