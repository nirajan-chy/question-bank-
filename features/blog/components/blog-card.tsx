"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Eye } from "lucide-react";
import { Post } from "@/types";
import { cn, formatNumber, initials } from "@/lib/utils";

export const coverMap: Record<string, { gradient: string; emoji: string }> = {
  exam: { gradient: "from-amber-500 via-orange-500 to-red-500", emoji: "📝" },
  study: { gradient: "from-indigo-500 via-violet-500 to-fuchsia-500", emoji: "📚" },
  career: { gradient: "from-emerald-500 via-teal-500 to-cyan-500", emoji: "🎯" },
  tech: { gradient: "from-sky-500 via-blue-500 to-indigo-500", emoji: "💻" },
  scholarship: { gradient: "from-rose-500 via-pink-500 to-fuchsia-500", emoji: "🎓" },
  guide: { gradient: "from-slate-600 via-slate-500 to-slate-400", emoji: "🧭" },
};

export function BlogCard({ post, compact = false }: { post: Post; compact?: boolean }) {
  const cover = coverMap[post.cover] ?? coverMap.guide;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover"
    >
      <div className={cn("relative flex h-44 items-center justify-center bg-gradient-to-br", cover.gradient)}>
        <span className="text-6xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110">{cover.emoji}</span>
        <span className="absolute left-4 top-4 rounded-full bg-black/30 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          {post.category}
        </span>
        <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
          <Eye className="h-3 w-3" /> {formatNumber(post.views)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {post.readingTime} min read
          </span>
        </div>
        <h3 className="mt-3 font-display text-lg font-bold leading-snug transition-colors group-hover:text-primary">
          {post.title}
        </h3>
        {!compact && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>}
        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
              {initials(post.author)}
            </span>
            <div>
              <p className="text-xs font-semibold">{post.author}</p>
              <p className="text-[10px] text-muted-foreground">{post.authorRole}</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs font-medium text-primary">
            Read <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
