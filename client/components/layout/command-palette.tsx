"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Bookmark,
  Search,
  Home,
  BookOpen,
  GraduationCap,
  FileQuestion,
  Timer,
  Award,
  Newspaper,
  Users,
  Sparkles,
  Settings,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useUiStore } from "@/store/use-ui-store";

const commands = [
  { group: "Navigate", items: [
    { label: "Home", icon: Home, href: "/" },
    { label: "Classes", icon: GraduationCap, href: "/classes" },
    { label: "Subjects", icon: BookOpen, href: "/subjects" },
    { label: "Question Banks", icon: FileQuestion, href: "/question-banks" },
    { label: "Mock Tests", icon: Timer, href: "/mock-tests" },
    { label: "Scholarships", icon: Award, href: "/scholarships" },
    { label: "Results", icon: Newspaper, href: "/results" },
    { label: "Community", icon: Users, href: "/community" },
  ]},
  { group: "Account", items: [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Self Learning Center", icon: Sparkles, href: "/learn" },
    { label: "Bookmarks", icon: Bookmark, href: "/bookmarks" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ]},
];

export function CommandPalette() {
  const router = useRouter();
  const open = useUiStore((s) => s.commandOpen);
  const setOpen = useUiStore((s) => s.setCommandOpen);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!useUiStore.getState().commandOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const run = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const filtered = commands
    .map((group) => ({
      ...group,
      items: group.items.filter((i) =>
        i.label.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command or search..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick actions">
          <CommandItem
            onSelect={() => {
              setOpen(false);
              router.push("/search");
            }}
          >
            <Search className="h-4 w-4" />
            <span>Search all resources</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setOpen(false);
              router.push("/community/ask");
            }}
          >
            <Sparkles className="h-4 w-4" />
            <span>Ask a question</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        {filtered.map((group) => (
          <CommandGroup key={group.group} heading={group.group}>
            {group.items.map((item) => (
              <CommandItem key={item.href} onSelect={() => run(item.href)}>
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
