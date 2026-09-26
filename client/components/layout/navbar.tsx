"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bookmark,
  ChevronDown,
  Command,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { cn, initials } from "@/lib/utils";
import { isNavItemActive, navGroups, type NavItem } from "@/lib/nav";
import { Logo } from "@/components/shared/logo";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUiStore } from "@/store/use-ui-store";
import { useAuthStore } from "@/store/use-auth-store";
import { MobileNav } from "./mobile-nav";

function NavDropdown({
  group,
  pathname,
}: {
  group: { id: string; label: string; items: NavItem[] };
  pathname: string;
}) {
  const active = group.items.some((item) => isNavItemActive(pathname, item.href));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            active ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {group.label}
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
        {group.items.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href} className="flex items-start gap-3 p-2">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <item.icon className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">{item.label}</span>
                {item.description && (
                  <span className="block text-xs text-muted-foreground">{item.description}</span>
                )}
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const ACCOUNT_LINKS: { label: string; href: string; icon: LucideIcon; adminOnly?: boolean }[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Self Learning Center", href: "/learn", icon: GraduationCap },
  { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Admin panel", href: "/admin", icon: ShieldCheck, adminOnly: true },
];

function AccountMenu() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const logout = useAuthStore((s) => s.logout);

  const links = ACCOUNT_LINKS.filter((link) => !link.adminOnly || isAdmin);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account menu">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-brand-gradient text-xs text-primary-foreground">
              {initials(user?.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs font-normal text-muted-foreground">{user?.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {links.map((link) => (
          <DropdownMenuItem key={link.href} asChild className="gap-2">
            <Link href={link.href}>
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-destructive focus:text-destructive"
          onSelect={() => {
            logout();
            router.push("/");
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const pathname = usePathname() ?? "/";
  const [scrolled, setScrolled] = useState(false);
  const setCommandOpen = useUiStore((s) => s.setCommandOpen);
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-shadow duration-200",
        scrolled
          ? "border-border bg-background/85 shadow-card backdrop-blur-lg supports-[backdrop-filter]:bg-background/70"
          : "border-transparent bg-background"
      )}
    >
      <nav className="container flex h-16 items-center gap-3" aria-label="Main">
        <div className="flex min-w-0 items-center gap-1">
          <Logo />
          <div className="ml-4 hidden items-center gap-0.5 lg:flex">
            {navGroups.map((group) => (
              <NavDropdown key={group.id} group={group} pathname={pathname} />
            ))}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className={cn(
              "hidden h-9 items-center gap-2 rounded-lg border bg-muted/50 px-3 text-sm text-muted-foreground",
              "transition-colors hover:bg-muted md:inline-flex"
            )}
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline">Search</span>
            <kbd className="hidden items-center gap-0.5 rounded border bg-background px-1.5 py-0.5 font-mono text-2xs lg:inline-flex">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </button>

          <ModeToggle />

          {!hasHydrated ? (
            <span className="h-8 w-8" aria-hidden />
          ) : user ? (
            <AccountMenu />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button variant="gradient" size="sm" asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}

          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
