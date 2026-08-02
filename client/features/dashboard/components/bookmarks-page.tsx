"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bookmark, ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/store/use-user-store";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

const typeMeta: Record<string, { label: string; className: string }> = {
  note: { label: "Note", className: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  book: { label: "Book", className: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  "question-bank": { label: "Question bank", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  "past-paper": { label: "Past paper", className: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  "mock-test": { label: "Mock test", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  post: { label: "Blog post", className: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  scholarship: { label: "Scholarship", className: "bg-pink-500/10 text-pink-600 dark:text-pink-400" },
};

export function BookmarksPage() {
  const { bookmarks, removeBookmark } = useUserStore();
  const [filter, setFilter] = useState<string>("All");

  const types = ["All", ...Array.from(new Set(bookmarks.map((b) => typeMeta[b.type]?.label ?? b.type)))];
  const filtered = bookmarks.filter((b) => filter === "All" || (typeMeta[b.type]?.label ?? b.type) === filter);

  const remove = (id: string, title: string) => {
    removeBookmark(id);
    toast.success("Removed from bookmarks", { description: title });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">My bookmarks</h1>
          <p className="mt-1 text-sm text-muted-foreground">{bookmarks.length} saved item{bookmarks.length === 1 ? "" : "s"} for quick access.</p>
        </div>
        <div className="flex gap-1.5">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                filter === t ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary/40"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-10 w-10 text-muted-foreground" />}
          title={bookmarks.length === 0 ? "No bookmarks yet" : "Nothing in this filter"}
          description={bookmarks.length === 0 ? "Tap the bookmark icon on any note, book, paper or question bank to save it here." : "Try a different type filter."}
          action={
            <Button asChild>
              <Link href="/notes">Browse resources</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((b, i) => {
            const meta = typeMeta[b.type];
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Card className="group flex items-center gap-4 p-4 transition-all hover:border-primary/40 hover:shadow-card-hover">
                  {meta && (
                    <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold", meta.className)}>
                      {meta.label}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <Link href={b.href} className="line-clamp-1 font-medium transition-colors group-hover:text-primary">
                      {b.title}
                    </Link>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{b.subtitle}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">Saved {new Date(b.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button size="icon-sm" variant="ghost" asChild>
                      <Link href={b.href}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="icon-sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => remove(b.id, b.title)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="flex items-center justify-center gap-1 pt-2 text-xs text-muted-foreground">
          <ArrowRight className="h-3.5 w-3.5" /> Bookmarked items stay synced to this account.
        </p>
      )}
    </div>
  );
}
