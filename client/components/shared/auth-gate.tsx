"use client";

import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/use-auth-store";

/**
 * Blocks a feature until the visitor signs in.
 *
 * Wrapping the destination instead of redirecting on click means the nav link
 * stays a normal link: one click always lands somewhere meaningful, and the
 * sign-in button carries `?next=` so the user comes straight back afterwards.
 */
export function AuthGate({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  const pathname = usePathname() ?? "/";
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  if (!hasHydrated) {
    return (
      <section className="container py-12 md:py-16">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border bg-card p-10 text-center shadow-card">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-72" />
          <div className="mt-3 flex gap-3">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </section>
    );
  }

  if (user) return <>{children}</>;

  const next = encodeURIComponent(pathname);

  return (
    <section className="container py-12 md:py-16">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 rounded-2xl border bg-card px-6 py-12 text-center shadow-card">
        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-primary-foreground shadow-glow-sm">
          <Icon className="h-8 w-8" />
          <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-muted text-muted-foreground">
            <Lock className="h-3 w-3" />
          </span>
        </span>

        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>

        <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button size="lg" className="gradient shadow-glow-sm" asChild>
            <Link href={`/login?next=${next}`}>Sign in to continue</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href={`/register?next=${next}`}>Create an account</Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Free to use — no card required. We&apos;ll bring you right back here.
        </p>
      </div>
    </section>
  );
}
