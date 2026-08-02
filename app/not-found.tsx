import Link from "next/link";
import { BookOpen, Compass, GraduationCap, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/subjects", label: "Browse subjects", icon: BookOpen },
  { href: "/classes", label: "Find your class", icon: GraduationCap },
  { href: "/search", label: "Search everything", icon: Compass },
];

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-mesh-light dark:bg-mesh-dark" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.4] mask-radial-faded" />
      <div className="container relative py-20 text-center">
        <p className="font-display text-[6rem] font-extrabold leading-none text-gradient md:text-[10rem]">404</p>
        <h1 className="mt-2 font-display text-2xl font-bold md:text-3xl">This page isn’t on the syllabus</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground md:text-base">
          The page you’re looking for may have been moved, renamed or never existed. Let’s get you back to studying.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="gradient" size="lg" asChild>
            <Link href="/">
              <Home className="h-4 w-4" /> Back to home
            </Link>
          </Button>
          {links.map((l) => (
            <Button key={l.href} variant="outline" size="lg" asChild>
              <Link href={l.href}>
                <l.icon className="h-4 w-4" /> {l.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
