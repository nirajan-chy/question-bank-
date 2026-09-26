"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, MessageSquarePlus, MessagesSquare } from "lucide-react";

import { cn } from "@/lib/utils";

const TABS = [
  { label: "Chat rooms", href: "/community", icon: MessagesSquare, exact: true },
  { label: "Questions", href: "/community/questions", icon: MessageSquare, exact: false },
  { label: "Ask", href: "/community/ask", icon: MessageSquarePlus, exact: false },
];

/** Sub-navigation shared by the three community views. */
export function CommunityNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav aria-label="Community sections" className="border-b bg-background">
      <div className="container flex h-12 items-center gap-1">
        {TABS.map((tab) => {
          const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
