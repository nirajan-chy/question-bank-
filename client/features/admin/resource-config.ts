import {
  BookOpen,
  BookOpenCheck,
  Building2,
  ClipboardList,
  Contact,
  FileText,
  GraduationCap,
  Landmark,
  Layers,
  ListChecks,
  Medal,
  MessageSquare,
  MessagesSquare,
  NotebookPen,
  Quote,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

export type AdminResource = {
  path: string;
  label: string;
  icon: typeof Layers;
  color: string;
};

export const adminResources: AdminResource[] = [
  { path: "levels", label: "Levels", icon: Layers, color: "from-blue-500 to-indigo-600" },
  { path: "universities", label: "Universities", icon: Landmark, color: "from-violet-500 to-purple-600" },
  { path: "faculties", label: "Faculties", icon: Building2, color: "from-cyan-500 to-sky-600" },
  { path: "courses", label: "Courses", icon: GraduationCap, color: "from-indigo-500 to-blue-600" },
  { path: "semesters", label: "Semesters", icon: Sparkles, color: "from-sky-500 to-indigo-600" },
  { path: "subjects", label: "Subjects", icon: BookOpen, color: "from-emerald-500 to-teal-600" },
  { path: "notes", label: "Notes", icon: NotebookPen, color: "from-amber-500 to-orange-600" },
  { path: "books", label: "Books", icon: BookOpenCheck, color: "from-rose-500 to-pink-600" },
  { path: "question-banks", label: "Question Banks", icon: ClipboardList, color: "from-indigo-500 to-blue-600" },
  { path: "past-papers", label: "Past Papers", icon: FileText, color: "from-slate-500 to-slate-700" },
  { path: "mock-tests", label: "Mock Tests", icon: ListChecks, color: "from-fuchsia-500 to-purple-600" },
  { path: "scholarships", label: "Scholarships", icon: Medal, color: "from-yellow-500 to-amber-600" },
  { path: "notices", label: "Notices", icon: ScrollText, color: "from-red-500 to-rose-600" },
  { path: "results", label: "Results", icon: Trophy, color: "from-lime-500 to-green-600" },
  { path: "testimonials", label: "Testimonials", icon: Quote, color: "from-pink-500 to-rose-600" },
  { path: "faqs", label: "FAQs", icon: MessageSquare, color: "from-orange-500 to-red-600" },
  { path: "posts", label: "Blog Posts", icon: BookOpenCheck, color: "from-teal-500 to-emerald-600" },
  { path: "community", label: "Community Questions", icon: MessagesSquare, color: "from-fuchsia-500 to-pink-600" },
  { path: "communities", label: "Communities", icon: MessageSquare, color: "from-pink-500 to-rose-600" },
  { path: "community-messages", label: "Community Messages", icon: MessagesSquare, color: "from-purple-500 to-fuchsia-600" },
  { path: "leaderboard", label: "Leaderboard", icon: Trophy, color: "from-amber-500 to-orange-600" },
  { path: "contacts", label: "Contacts", icon: Contact, color: "from-blue-500 to-cyan-600" },
];

export const adminUsersResource: AdminResource = {
  path: "users",
  label: "Users",
  icon: Users,
  color: "from-slate-600 to-slate-800",
};

export const adminGuardIcon = ShieldCheck;
