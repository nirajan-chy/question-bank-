"use client";

import { useState } from "react";
import { 
  ChevronDown, 
  ChevronRight, 
  Hash, 
  Plus, 
  Search,
  Users,
  School,
  BookOpen,
  Trophy,
  Sparkles,
  GraduationCap,
  Wrench,
  Landmark,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

interface CommunitySidebarProps {
  communities: Community[];
  selectedCommunity: string;
  selectedChannel: string;
  onSelectCommunity: (id: string) => void;
  onSelectChannel: (id: string) => void;
}

export function CommunitySidebar({
  communities,
  selectedCommunity,
  selectedChannel,
  onSelectCommunity,
  onSelectChannel,
}: CommunitySidebarProps) {
  const [search, setSearch] = useState("");
  const [expandedCommunities, setExpandedCommunities] = useState<string[]>([selectedCommunity]);

  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedCommunities((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-80 border-r bg-card flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Communities</h2>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search communities..."
            className="pl-9 h-9"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredCommunities.map((community) => {
          const Icon = iconMap[community.icon] || Hash;
          const isExpanded = expandedCommunities.includes(community.id);
          const isSelected = selectedCommunity === community.id;

          return (
            <div key={community.id} className="mb-1">
              <button
                onClick={() => {
                  onSelectCommunity(community.id);
                  toggleExpand(community.id);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                  isSelected
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white",
                    community.gradient
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{community.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {community.memberCount.toLocaleString()} members
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0" />
                )}
              </button>

              {isExpanded && isSelected && (
                <div className="ml-4 mt-1 space-y-0.5 border-l pl-3">
                  {community.channels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => onSelectChannel(channel.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                        selectedChannel === channel.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Hash className="h-4 w-4 shrink-0" />
                      <span className="truncate">{channel.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Invite Members Button */}
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full justify-start gap-2">
          <Users className="h-4 w-4" />
          Invite Members
        </Button>
      </div>
    </div>
  );
}