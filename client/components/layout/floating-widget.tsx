"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Sparkles,
  Users,
  Bookmark,
  Flame,
  Search,
  Lightbulb,
  X,
} from "lucide-react";
import { useUserStore } from "@/store/use-user-store";

const items = [
  {
    label: "Ask AI",
    description: "Get instant study help",
    icon: Sparkles,
    href: "/search",
    gradient: "from-indigo-500 to-violet-600",
  },
  {
    label: "Ask Community",
    description: "Students helping students",
    icon: Users,
    href: "/community/ask",
    gradient: "from-sky-500 to-blue-600",
  },
  {
    label: "Bookmarks",
    description: "Your saved resources",
    icon: Bookmark,
    href: "/bookmarks",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    label: "Trending Discussions",
    description: "What everyone's asking",
    icon: Flame,
    href: "/community",
    gradient: "from-orange-500 to-red-600",
  },
  {
    label: "Quick Search",
    description: "Find any resource fast",
    icon: Search,
    href: "/search",
    gradient: "from-fuchsia-500 to-pink-600",
  },
  {
    label: "Study Tips",
    description: "Boost your productivity",
    icon: Lightbulb,
    href: "/blog/how-to-score-gpa-4-in-see",
    gradient: "from-amber-500 to-yellow-600",
  },
];

export function FloatingWidget() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const streak = useUserStore((s) => s.user.streak);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-72 origin-bottom-right rounded-2xl border bg-popover/95 p-3 shadow-xl backdrop-blur-xl"
          >
            <div className="mb-2 flex items-center justify-between px-2 pt-1">
              <p className="text-sm font-semibold">Quick help</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
                <Flame className="h-3 w-3" /> {streak} day streak
              </span>
            </div>
            <div className="grid gap-1">
              {items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setOpen(false);
                    router.push(item.href);
                  }}
                  className="group flex items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-accent"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm ${item.gradient}`}
                  >
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{item.label}</span>
                    <span className="block text-xs text-muted-foreground">{item.description}</span>
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close quick help" : "Open quick help"}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-white shadow-glow"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "sparkles"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
