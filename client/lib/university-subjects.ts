import { BookOpen, Microscope, Calculator, Leaf, Building, Heart, Scale, Monitor, GraduationCap, Palette, Wrench } from "lucide-react";

export interface SubjectCategory {
  slug: string;
  name: string;
  description: string;
  icon: typeof BookOpen;
  gradient: string;
}

export const subjectCategories: SubjectCategory[] = [
  {
    slug: "csit",
    name: "Computer Science & IT",
    description: "Programming, algorithms, DBMS, AI and more.",
    icon: Monitor,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    slug: "agriculture",
    name: "Agriculture & Forestry",
    description: "Agronomy, animal science and forestry programs.",
    icon: Leaf,
    gradient: "from-green-500 to-emerald-600",
  },
  {
    slug: "engineering",
    name: "Engineering",
    description: "Civil, computer, electrical and mechanical engineering.",
    icon: Wrench,
    gradient: "from-orange-500 to-red-600",
  },
  {
    slug: "management",
    name: "Management",
    description: "Accountancy, economics, business studies and finance.",
    icon: Building,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    slug: "science",
    name: "Science & Technology",
    description: "Physics, chemistry, biology, mathematics and applied science.",
    icon: Microscope,
    gradient: "from-cyan-500 to-teal-600",
  },
  {
    slug: "humanities",
    name: "Humanities & Social Sciences",
    description: "Nepali, English, sociology, history and liberal arts.",
    icon: BookOpen,
    gradient: "from-amber-500 to-yellow-600",
  },
  {
    slug: "education",
    name: "Education",
    description: "Teacher training and pedagogy programs.",
    icon: GraduationCap,
    gradient: "from-rose-500 to-pink-600",
  },
  {
    slug: "health",
    name: "Health Sciences",
    description: "Nursing, pharmacy, public health and medicine.",
    icon: Heart,
    gradient: "from-red-500 to-rose-600",
  },
  {
    slug: "law",
    name: "Law",
    description: "Legal studies for LLB and LLM aspirants.",
    icon: Scale,
    gradient: "from-slate-500 to-gray-700",
  },
  {
    slug: "math",
    name: "Mathematics",
    description: "Pure and applied mathematics programs.",
    icon: Calculator,
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    slug: "hospitality",
    name: "Hospitality & Tourism",
    description: "Hotel management, tourism and travel programs.",
    icon: Palette,
    gradient: "from-fuchsia-500 to-pink-600",
  },
];
