"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav, resourcesNav } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/use-auth-store";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const logout = useAuthStore((s) => s.logout);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px] overflow-y-auto p-0">
        <SheetHeader className="border-b px-6 py-4 text-left">
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <div className="px-4 py-4">
          <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Explore
          </p>
          <nav className="flex flex-col gap-0.5">
            {mainNav
              .filter((link) => !resourcesNav.some((r) => r.href === link.href))
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-accent",
                    isActive(link.href)
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
          </nav>
          <Separator className="my-4" />
          <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Resources
          </p>
          <nav className="flex flex-col gap-0.5">
            {resourcesNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-accent",
                  isActive(link.href) ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Separator className="my-4" />
          {hasHydrated && user ? (
            <div className="px-2">
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-brand-gradient text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" asChild onClick={() => setOpen(false)}>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="outline" size="sm" asChild onClick={() => setOpen(false)}>
                  <Link href="/learn">Learn</Link>
                </Button>
                {isAdmin && (
                  <Button variant="outline" size="sm" asChild onClick={() => setOpen(false)}>
                    <Link href="/admin">
                      <ShieldCheck className="h-4 w-4" /> Admin
                    </Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => {
                    logout();
                    setOpen(false);
                    router.push("/");
                    router.refresh();
                  }}
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 px-2">
              <Button variant="outline" size="sm" asChild onClick={() => setOpen(false)}>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button variant="gradient" size="sm" asChild onClick={() => setOpen(false)}>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
