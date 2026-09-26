"use client";

import { useState } from "react";
import { Award, BookOpen, GraduationCap, Hash, Landmark, School, Search, Sparkles, Trophy, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";
import { gradientFor } from "@/lib/gradients";
import { Input } from "@/components/ui/input";
import type { Community } from "@/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  School,
  BookOpen,
  Trophy,
  Sparkles,
  GraduationCap,
  Wrench,
  Landmark,
  Award,
};

type CommunitySidebarProps = {
  communities: Community[];
  selectedCommunity: string;
  selectedChannel: string;
  onSelectCommunity: (id: string) => void;
  onSelectChannel: (id: string) => void;
};

export function CommunitySidebar({
  communities,
  selectedCommunity,
  selectedChannel,
  onSelectCommunity,
  onSelectChannel,
}: CommunitySidebarProps) {
  const [search, setSearch] = useState("");

  const filtered = communities.filter((community) =>
    community.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <aside
      aria-label="Chat rooms"
      className="max-h-64 w-full shrink-0 overflow-y-auto border-b bg-card lg:max-h-none lg:h-full lg:w-72 lg:border-b-0 lg:border-r"
    >
      <div className="border-b p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rooms…"
            aria-label="Search rooms"
            className="h-9 pl-9"
          />
        </div>
      </div>

      <nav className="p-2">
        {filtered.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            No rooms match “{search}”.
          </p>
        ) : (
          filtered.map((community) => {
            const Icon = iconMap[community.icon] ?? Hash;
            const isSelected = community.id === selectedCommunity;

            return (
              <div key={community.id} className="mb-1">
                <button
                  type="button"
                  onClick={() => onSelectCommunity(community.id)}
                  aria-current={isSelected ? "true" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors",
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white",
                      gradientFor(community.name)
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{community.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {community.memberCount.toLocaleString("en-NP")} members
                    </span>
                  </span>
                </button>

                {isSelected && community.channels.length > 0 && (
                  <ul className="ml-4 mt-1 space-y-0.5 border-l pl-3">
                    {community.channels.map((channel) => {
                      const isActive = channel.id === selectedChannel;
                      return (
                        <li key={channel.id}>
                          <button
                            type="button"
                            onClick={() => onSelectChannel(channel.id)}
                            aria-current={isActive ? "page" : undefined}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                              isActive
                                ? "bg-primary/10 font-medium text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            <Hash className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{channel.name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })
        )}
      </nav>
    </aside>
  );
}
