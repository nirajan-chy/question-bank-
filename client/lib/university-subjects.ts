import {
  Code2,
  Wrench,
  Stethoscope,
  Monitor,
  BarChart3,
  Globe,
  Briefcase,
  Heart,
  Pill,
  Leaf,
  Scale,
  GraduationCap,
  Activity,
  Hotel,
  BookOpen,
  Brain,
  Landmark,
} from "lucide-react";

export type SubjectCategory = {
  id: string;
  name: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  keywords: string[];
};

export const subjectCategories: SubjectCategory[] = [
  {
    id: "csit",
    name: "Computer Science & Information Technology",
    slug: "csit",
    icon: Code2,
    color: "from-blue-500 to-cyan-500",
    keywords: ["csit", "computer science", "information technology", "b.sc csit"],
  },
  {
    id: "engineering",
    name: "BE / Engineering",
    slug: "engineering",
    icon: Wrench,
    color: "from-orange-500 to-amber-500",
    keywords: ["be", "engineering", "b.tech", "civil", "computer engineering", "electrical", "mechanical"],
  },
  {
    id: "mbbs",
    name: "MBBS",
    slug: "mbbs",
    icon: Stethoscope,
    color: "from-red-500 to-rose-500",
    keywords: ["mbbs", "medicine", "medical"],
  },
  {
    id: "bca",
    name: "BCA",
    slug: "bca",
    icon: Monitor,
    color: "from-cyan-500 to-teal-500",
    keywords: ["bca", "computer applications"],
  },
  {
    id: "bbs",
    name: "BBS",
    slug: "bbs",
    icon: BarChart3,
    color: "from-violet-500 to-purple-500",
    keywords: ["bbs", "business studies"],
  },
  {
    id: "bit",
    name: "BIT",
    slug: "bit",
    icon: Globe,
    color: "from-indigo-500 to-blue-500",
    keywords: ["bit", "information technology"],
  },
  {
    id: "bba",
    name: "BBA",
    slug: "bba",
    icon: Briefcase,
    color: "from-emerald-500 to-green-500",
    keywords: ["bba", "business administration"],
  },
  {
    id: "nursing",
    name: "Nursing",
    slug: "nursing",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
    keywords: ["nursing", "b.sc nursing"],
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    slug: "pharmacy",
    icon: Pill,
    color: "from-teal-500 to-emerald-500",
    keywords: ["pharmacy", "b.pharm", "pharm"],
  },
  {
    id: "agriculture",
    name: "Agriculture",
    slug: "agriculture",
    icon: Leaf,
    color: "from-green-500 to-lime-500",
    keywords: ["agriculture", "forestry", "b.sc agriculture", "b.sc forestry", "animal science", "veterinary"],
  },
  {
    id: "law",
    name: "Law",
    slug: "law",
    icon: Scale,
    color: "from-amber-500 to-yellow-500",
    keywords: ["law", "llb", "legal"],
  },
  {
    id: "education",
    name: "Education",
    slug: "education",
    icon: GraduationCap,
    color: "from-blue-500 to-indigo-500",
    keywords: ["education", "b.ed", "m.ed", "teaching"],
  },
  {
    id: "public-health",
    name: "Public Health",
    slug: "public-health",
    icon: Activity,
    color: "from-rose-500 to-pink-500",
    keywords: ["public health", "health sciences", "b.pt", "physiotherapy"],
  },
  {
    id: "hotel-tourism",
    name: "Hotel & Tourism Management",
    slug: "hotel-tourism",
    icon: Hotel,
    color: "from-orange-500 to-red-500",
    keywords: ["bhm", "bttm", "hotel management", "tourism", "hospitality"],
  },
  {
    id: "arts",
    name: "Arts & Humanities",
    slug: "arts",
    icon: BookOpen,
    color: "from-violet-500 to-fuchsia-500",
    keywords: ["ba", "ma", "arts", "humanities", "english", "nepali", "history", "political science", "economics", "sociology"],
  },
  {
    id: "other",
    name: "Other Subjects",
    slug: "other",
    icon: Brain,
    color: "from-gray-500 to-slate-500",
    keywords: [],
  },
];

export function matchSubjectCategory(programs: string[], category: SubjectCategory): boolean {
  const programStr = programs.join(" ").toLowerCase();
  return category.keywords.some((kw) => programStr.includes(kw.toLowerCase()));
}

export function countUniversitiesForCategory(
  universities: Array<{ programs: string[] }>,
  category: SubjectCategory
): number {
  if (category.id === "other") {
    const allOther = subjectCategories.filter((c) => c.id !== "other");
    return universities.filter((u) => !allOther.some((c) => matchSubjectCategory(u.programs, c))).length;
  }
  return universities.filter((u) => matchSubjectCategory(u.programs, category)).length;
}
