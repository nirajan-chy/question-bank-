import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

export function PageHeader({
  title,
  description,
  crumbs = [],
  icon: Icon,
  gradient = "from-indigo-600 via-violet-600 to-fuchsia-600",
  actions,
  children,
}: {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  icon?: LucideIcon;
  gradient?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b bg-mesh-light dark:bg-mesh-dark">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.4] mask-fade-b" />
      <div className="container relative py-12 md:py-16">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              {crumb.href ? (
                <Link href={crumb.href} className="transition-colors hover:text-foreground">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-foreground">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              {Icon && (
                <span
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-glow-sm",
                    gradient
                  )}
                >
                  <Icon className="h-6 w-6" />
                </span>
              )}
              <h1 className="font-display text-3xl font-bold tracking-tight text-balance md:text-4xl">
                {title}
              </h1>
            </div>
            {description && (
              <p className="mt-3 text-sm text-muted-foreground text-pretty md:text-base">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </div>
        {children}
      </div>
    </header>
  );
}
