import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2", className)}>
      <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-brand-gradient text-white shadow-glow-sm transition-transform group-hover:scale-105">
        <GraduationCap className="h-5 w-5" />
        <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </span>
      {withText && (
        <span className="font-display text-lg font-bold tracking-tight">
          Prashna<span className="text-primary">Hub</span>
        </span>
      )}
    </Link>
  );
}
