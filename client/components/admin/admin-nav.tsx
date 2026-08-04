"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutDashboard, LogOut } from "lucide-react";
import { adminResources, adminUsersResource } from "@/features/admin/resource-config";
import { useAuthStore } from "@/store/use-auth-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const link = (path: string) =>
    cn(
      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      pathname === `/admin/${path}`
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-accent hover:text-foreground"
    );

  const allResources = [
    ...adminResources,
    { ...adminUsersResource, path: "users", label: "Users" },
  ];

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r bg-background max-lg:hidden">
      <div className="flex items-center gap-2 px-4 py-4">
        <Logo withText />
      </div>

      <div className="px-4 pb-3">
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/admin"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </Link>
      </div>

      <div className="flex-1 space-y-0.5 overflow-y-auto px-4 pb-4">
        <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Content
        </p>
        {allResources.map((r) => {
          const Icon = r.icon;
          return (
            <Link key={r.path} href={`/admin/${r.path}`} className={link(r.path)}>
              <Icon className="h-4 w-4" /> {r.label}
            </Link>
          );
        })}
      </div>

      <div className="border-t p-4">
        {user && (
          <p className="mb-2 truncate px-1 text-xs text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{user.name}</span>
          </p>
        )}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href="/">
              <Home className="h-4 w-4" /> Site
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              logout();
              router.push("/");
              router.refresh();
            }}
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
