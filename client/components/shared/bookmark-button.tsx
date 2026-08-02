"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { useUserStore } from "@/store/use-user-store";
import { Button } from "@/components/ui/button";
import type { BookmarkItem } from "@/types";

export function BookmarkButton({ item }: { item: BookmarkItem }) {
  const isBookmarked = useUserStore((s) => s.isBookmarked(item.id));
  const toggleBookmark = useUserStore((s) => s.toggleBookmark);

  const handle = () => {
    toggleBookmark(item);
    toast.success(isBookmarked ? "Removed from bookmarks" : "Saved to bookmarks", {
      description: isBookmarked ? undefined : item.title,
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handle}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      className={isBookmarked ? "text-primary" : "text-muted-foreground"}
    >
      {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
    </Button>
  );
}
