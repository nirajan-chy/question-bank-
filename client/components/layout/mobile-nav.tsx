"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, ShieldCheck } from "lucide-react";

import { cn, initials } from "@/lib/utils";
import { isNavItemActive, navGroups } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { useAuthStore } from "@/store/use-auth-store";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const logout = useAuthStore((s) => s.logout);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full max-w-sm flex-col p-0">
        <SheetHeader className="border-b px-6 py-4 text-left">
          <SheetTitle>
            <Logo />
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {navGroups.map((group, index) => (
            <div key={group.id}>
              {index > 0 && <Separator className="my-4" />}
              <p className="px-2 pb-1.5 text-2xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              <nav className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = isNavItemActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0 opacity-80" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="border-t px-4 py-4">
          {hasHydrated && user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-brand-gradient text-xs text-primary-foreground">
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" asChild onClick={close}>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="outline" size="sm" asChild onClick={close}>
                  <Link href="/learn">Learn</Link>
                </Button>
                {isAdmin && (
                  <Button variant="outline" size="sm" asChild onClick={close}>
                    <Link href="/admin">
                      <ShieldCheck className="h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    logout();
                    close();
                    router.push("/");
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" asChild onClick={close}>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button variant="gradient" size="sm" asChild onClick={close}>
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
