import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  BookOpen,
  Library,
  FileQuestion,
  FileText,
  Timer,
  GraduationCap,
  Award,
  Newspaper,
  User,
  Bookmark,
  Settings,
  Users,
  Search,
} from "lucide-react";

export type NavLink = {
  label: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
};

export const mainNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Classes", href: "/classes" },
  { label: "Bachelor", href: "/bachelor" },
  { label: "Universities", href: "/universities" },
  { label: "Subjects", href: "/subjects" },
  { label: "Notes", href: "/notes" },
  { label: "Books", href: "/books" },
  { label: "Question Banks", href: "/question-banks" },
  { label: "Past Papers", href: "/past-papers" },
  { label: "Mock Tests", href: "/mock-tests" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "Results", href: "/results" },
  { label: "Notices", href: "/notices" },
  { label: "Community", href: "/community" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const resourcesNav: NavLink[] = [
  { label: "Notes", href: "/notes", icon: BookOpen, description: "Chapter-wise notes for every level" },
  { label: "Books", href: "/books", icon: Library, description: "Textbooks, guides and references" },
  { label: "Question Banks", href: "/question-banks", icon: FileQuestion, description: "Exam-style practice questions" },
  { label: "Past Papers", href: "/past-papers", icon: FileText, description: "Previous board & university papers" },
  { label: "Mock Tests", href: "/mock-tests", icon: Timer, description: "Timed tests with instant scoring" },
];

export const dashboardNav: NavLink[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Profile", href: "/profile", icon: User },
  { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Community", href: "/community", icon: Users },
  { label: "Search", href: "/search", icon: Search },
];

export const quickLinks: NavLink[] = [
  { label: "Classes", href: "/classes", icon: BookOpen },
  { label: "Bachelor", href: "/bachelor", icon: GraduationCap },
  { label: "Universities", href: "/universities", icon: Award },
  { label: "Scholarships", href: "/scholarships", icon: Award },
  { label: "Results", href: "/results", icon: FileText },
  { label: "Notices", href: "/notices", icon: Newspaper },
];
