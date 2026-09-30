import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  Bookmark,
  Building2,
  ClipboardList,
  FileQuestion,
  FileText,
  GraduationCap,
<<<<<<< HEAD
  Home,
  Info,
  Layers,
  LayoutDashboard,
  Library,
  Mail,
  MessageSquare,
  Newspaper,
  Rss,
  School,
  Search,
  Settings,
  ShieldCheck,
  Timer,
  User,
=======
  Globe,
>>>>>>> origin/main
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Shown as secondary text inside dropdowns and the command palette. */
  description?: string;
};

<<<<<<< HEAD
export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

/**
 * The single source of truth for site navigation.
 *
 * The top bar, the mobile sheet, the footer columns and the command palette
 * are all derived from this array — adding a route is a one-line change here
 * instead of four edits across four files.
 */
export const navGroups: NavGroup[] = [
  {
    id: "explore",
    label: "Explore",
    items: [
      {
        label: "Home",
        href: "/",
        icon: Home,
        description: "Everything study-related in one place",
      },
      {
        label: "Classes",
        href: "/classes",
        icon: School,
        description: "SEE, +2 and undergraduate levels",
      },
      {
        label: "Subjects",
        href: "/subjects",
        icon: Layers,
        description: "Syllabus, notes and practice by subject",
      },
      {
        label: "Universities",
        href: "/universities",
        icon: Building2,
        description: "TU, KU, PU, Pokhara and more",
      },
      {
        label: "Courses",
        href: "/courses",
        icon: GraduationCap,
        description: "Programmes, semesters and subjects",
      },
    ],
  },
  {
    id: "resources",
    label: "Study Resources",
    items: [
      {
        label: "Notes",
        href: "/notes",
        icon: BookOpen,
        description: "Chapter-wise notes for every level",
      },
      {
        label: "Books",
        href: "/books",
        icon: Library,
        description: "Textbooks, guides and references",
      },
      {
        label: "Question Banks",
        href: "/question-banks",
        icon: FileQuestion,
        description: "Exam-style practice questions",
      },
      {
        label: "Past Papers",
        href: "/past-papers",
        icon: FileText,
        description: "Previous board and university papers",
      },
      {
        label: "Mock Tests",
        href: "/mock-tests",
        icon: Timer,
        description: "Timed tests with instant scoring",
      },
    ],
  },
  {
    id: "opportunities",
    label: "Opportunities",
    items: [
      {
        label: "Scholarships",
        href: "/scholarships",
        icon: Award,
        description: "Grants and fully-funded programmes",
      },
      {
        label: "Results",
        href: "/results",
        icon: ClipboardList,
        description: "Published board and university results",
      },
      {
        label: "Notices",
        href: "/notices",
        icon: Newspaper,
        description: "Announcements and exam updates",
      },
    ],
  },
  {
    id: "community",
    label: "Community",
    items: [
      {
        label: "Q&A",
        href: "/community",
        icon: MessageSquare,
        description: "Ask a question, help a classmate",
      },
      {
        label: "Blog",
        href: "/blog",
        icon: Rss,
        description: "Guides, tips and study advice",
      },
      {
        label: "About",
        href: "/about",
        icon: Info,
        description: "Who we are and what we do",
      },
      {
        label: "Contact",
        href: "/contact",
        icon: Mail,
        description: "Send us a message",
      },
    ],
  },
=======
export const mainNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Universities", href: "/universities" },
  { label: "Community", href: "/community" },
  { label: "Resources", href: "/resources" },
>>>>>>> origin/main
];

/** Every public destination, flattened — used by search and the command palette. */
export const allNavItems: NavItem[] = navGroups.flatMap((group) => group.items);

/** Signed-in user navigation inside the dashboard shell. */
export const accountNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, description: "Your study overview" },
  {
    label: "Self Learning Center",
    href: "/learn",
    icon: GraduationCap,
    description: "Upload documents, chat with AI, take AI quizzes",
  },
  { label: "My Profile", href: "/profile", icon: User, description: "Your public details" },
  { label: "Bookmarks", href: "/bookmarks", icon: Bookmark, description: "Everything you saved" },
  { label: "Search", href: "/search", icon: Search, description: "Search all study material" },
  { label: "Settings", href: "/settings", icon: Settings, description: "Account and preferences" },
  { label: "Admin Panel", href: "/admin", icon: ShieldCheck, description: "Manage site content" },
];

/** Sidebar links inside /dashboard, /profile, /bookmarks and /settings. */
export const dashboardNav: NavItem[] = accountNav.filter(
  (item) => !["/search", "/admin"].includes(item.href)
);

<<<<<<< HEAD
/** Groups rendered as footer columns. */
export const footerGroups = navGroups.filter(
  (group) => group.id !== "explore" || group.items.length > 1
);

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
=======
export const quickLinks: NavLink[] = [
  { label: "Courses", href: "/courses", icon: Globe },
  { label: "Community", href: "/community", icon: Users },
  { label: "Scholarships", href: "/scholarships", icon: Award },
  { label: "Results", href: "/results", icon: FileText },
  { label: "Notices", href: "/notices", icon: Newspaper },
];
>>>>>>> origin/main
