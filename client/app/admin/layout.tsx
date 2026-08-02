"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);

  useEffect(() => {
    if (!token) router.replace("/login");
  }, [token, router]);

  if (!token) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Checking permissions…</p>
      </div>
    );
  }

  if (!isAdmin || user?.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex max-w-sm flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="h-7 w-7" />
          </span>
          <h1 className="mt-4 font-display text-xl font-bold">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account doesn&apos;t have permission to view this area. Sign in with an admin
            account to continue.
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/">Back to site</Link>
            </Button>
            <Button variant="gradient" asChild>
              <Link href="/login">Switch account</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminNav />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3 border-b bg-background px-4 py-3 lg:hidden">
            <Logo withText={false} />
            <p className="text-sm font-semibold">Admin Panel</p>
          </div>
          <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
