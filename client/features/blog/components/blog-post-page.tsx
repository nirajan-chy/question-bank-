"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, Clock, Eye, Heart, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Post } from "@/types";
import { cn, formatNumber, initials } from "@/lib/utils";
import { db } from "@/services/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { coverMap } from "./blog-card";
import { BlogCard } from "./blog-card";
import { useCopy } from "@/hooks/use-copy";

export function BlogPostPage({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const { copied, copy } = useCopy();
  const cover = coverMap[post.cover] ?? coverMap.guide;

  const related = db.posts.filter((p) => p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t))).slice(0, 3);
  const fallback = related.length ? related : db.posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const share = async () => {
    await copy(window.location.href);
    toast.success("Link copied to clipboard");
  };

  return (
    <>
      <article className="border-b bg-mesh-light dark:bg-mesh-dark">
        <div className="container max-w-3xl py-12 md:py-16">
          <Link href="/blog" className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>
          <Badge variant="gradient">{post.category}</Badge>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4 font-display text-3xl font-bold leading-tight text-balance md:text-4xl"
          >
            {post.title}
          </motion.h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                {initials(post.author)}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{post.author}</p>
                <p className="text-xs text-muted-foreground">{post.authorRole}</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {post.readingTime} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" /> {formatNumber(post.views)} views
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                #{tag.replace(/\s+/g, "")}
              </span>
            ))}
          </div>
        </div>
      </article>

      <div className={cn("flex h-64 items-center justify-center bg-gradient-to-br md:h-80", cover.gradient)}>
        <span className="text-8xl drop-shadow-2xl md:text-9xl">{cover.emoji}</span>
      </div>

      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <div className="space-y-6">
            {post.body.map((para, i) => (
              <p key={i} className="text-[15px] leading-8 text-muted-foreground md:text-base md:leading-9">
                {i === 0 ? (
                  <>
                    <span className="float-left mr-3 font-display text-5xl font-bold leading-[0.8] text-primary">{para.charAt(0)}</span>
                    {para.slice(1)}
                  </>
                ) : (
                  para
                )}
              </p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-5">
            <div className="flex items-center gap-3">
              <Button
                variant={liked ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setLiked((v) => !v);
                  toast.success(liked ? "Removed like" : "Thanks for liking!");
                }}
              >
                <Heart className={cn("h-4 w-4", liked && "fill-current")} />
                {formatNumber(post.likes + (liked ? 1 : 0))}
              </Button>
              <Button variant="outline" size="sm" onClick={share}>
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {copied ? "Copied!" : `Help ${formatNumber(post.likes)} other students`}
            </p>
          </div>

          <Card className="mt-6 flex flex-wrap items-center gap-4 border-primary/20 bg-brand-gradient p-6 text-white">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-lg font-bold">
              {initials(post.author)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold">{post.author}</p>
              <p className="text-sm text-white/80">{post.authorRole} at Sandarbh</p>
            </div>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/community">Ask a question</Link>
            </Button>
          </Card>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-12 md:py-16">
        <div className="container">
          <h2 className="mb-6 font-display text-xl font-bold md:text-2xl">Related articles</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fallback.map((p) => (
              <BlogCard key={p.id} post={p} compact />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
