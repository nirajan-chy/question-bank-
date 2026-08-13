"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  withText = true,
}: {
  className?: string;
  withText?: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const logoSrc = isDark
    ? "/white%20and%20green.png"
    : "/black%20and%20green.png";

  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2", className)}
    >
      <img
        src={logoSrc}
        alt="PrashnaHub logo"
        className={cn("shrink-0 object-contain", "h-10  sm:h-12 sm:w-[70px]")}
      />
      {withText && (
        <span className="font-display text-base font-bold tracking-tight sm:text-lg mr-[120px]">
          Prashna<span className="text-primary">Hub</span>
        </span>
      )}
    </Link>
  );
}
