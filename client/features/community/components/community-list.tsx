"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronDown, Eye, HelpCircle, MessageSquare, MessageSquarePlus, Search, ThumbsUp } from "lucide-react";
import { useCommunity } from "@/services/queries";
import { cn, timeAgo, initials } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";

const sortOptions = ["Newest", "Most voted", "Active"] as const;

export function CommunityList() {
  const { data: questions = [], isPending } = useCommunity();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("all");
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("Newest");
  const [open, setOpen] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  const allTags = useMemo(() => Array.from(new Set(questions.flatMap((item) => item.tags))).slice(0, 10), [questions]);

  const filtered = useMemo(() => {
    let list = [...questions];
    if (tag !== "all") list = list.filter((item) => item.tags.includes(tag));
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter((item) => (item.title + " " + item.body + " " + item.tags.join(" ")).toLowerCase().includes(needle));
    }
    switch (sort) {
      case "Most voted":
        list.sort((a, b) => b.votes - a.votes);
        break;
      case "Active":
        list.sort((a, b) => (b.answers.length ? +new Date(b.answers[0].createdAt) : 0) - (a.answers.length ? +new Date(a.answers[0].createdAt) : 0));
        break;
      default:
        list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }
    return list;
  }, [q, tag, sort, questions]);

  return (
    <>
      <PageHeader
        icon={MessageSquarePlus}
        gradient="from-fuchsia-500 to-pink-600"
        title="Community Q&A"
        description="Ask questions, share answers and help fellow Nepali students — notes, papers and doubts, all in one thread."
        crumbs={[{ label: "Home", href: "/" }, { label: "Community" }]}
        actions={
          <Button variant="gradient" size="lg" asChild>
            <Link href="/community/ask">
              <MessageSquarePlus className="h-4 w-4" /> Ask a question
            </Link>
          </Button>
        }
      />

      <section className="py-10 md:py-14">
        <div className="container">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full max-w-md items-center gap-2 rounded-xl border bg-background p-1.5 pl-3 focus-within:ring-2 focus-within:ring-primary/40">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search questions..."
                className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sortOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    sort === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-1.5">
            <button
              onClick={() => setTag("all")}
              className={cn("rounded-full border px-3 py-1 text-xs font-medium transition-colors", tag === "all" ? "border-primary bg-primary/10 text-primary" : "bg-card hover:border-primary/40")}
            >
              All topics
            </button>
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(tag === t ? "all" : t)}
                className={cn("rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors", tag === t ? "border-primary bg-primary/10 text-primary" : "bg-card hover:border-primary/40")}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {isPending && (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="h-32 animate-pulse" />
                ))}
              </div>
            )}

            {!isPending && filtered.length === 0 && (
              <Card className="flex flex-col items-center gap-3 p-12 text-center">
                <HelpCircle className="h-10 w-10 text-muted-foreground" />
                <p className="font-medium">No questions match your filters</p>
                <p className="text-sm text-muted-foreground">Be the first to ask about this topic.</p>
                <Button variant="gradient" asChild>
                  <Link href="/community/ask">Ask a question</Link>
                </Button>
              </Card>
            )}

            {!isPending &&
              filtered.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.03 }}>                <Card className="overflow-hidden">
                  <div className="flex gap-4 p-4 md:p-5">
                    <div className="hidden shrink-0 flex-col items-center gap-2 sm:flex">
                      <span className={cn("flex h-16 w-16 flex-col items-center justify-center rounded-xl border text-sm font-bold", item.votes >= 0 ? "border-primary/30 bg-primary/5 text-primary" : "border-destructive/30 bg-destructive/5 text-destructive")}>
                        <ThumbsUp className="mb-0.5 h-3.5 w-3.5" />
                        {item.votes}
                      </span>
                      <span className={cn("flex h-16 w-16 flex-col items-center justify-center rounded-xl border text-sm font-bold", item.answered ? "border-success/40 bg-success/5 text-success" : "border-border text-muted-foreground")}>
                        <MessageSquare className="mb-0.5 h-3.5 w-3.5" />
                        {item.answerCount}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Eye className="h-3 w-3" /> {item.viewsFormatted}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <button
                        onClick={() => setOpen(open === item.id ? null : item.id)}
                        className="flex w-full items-start justify-between gap-3 text-left"
                      >
                        <h2 className={cn("font-display text-base font-semibold leading-snug transition-colors hover:text-primary md:text-lg", item.answered && "text-foreground")}>
                          {item.answered && <CheckCircle2 className="mr-1.5 inline h-4 w-4 text-success" />}
                          {item.title}
                        </h2>
                        <ChevronDown className={cn("mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform", open === item.id && "rotate-180")} />
                      </button>
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{item.body}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        {item.bounty ? (
                          <Badge variant="gradient">{item.bounty} pts bounty</Badge>
                        ) : (
                          item.answered && <Badge variant="success">Answered</Badge>
                        )}
                        {item.tags.map((t) => (
                          <button
                            key={t}
                            onClick={() => setTag(tag === t ? "all" : t)}
                            className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground capitalize transition-colors hover:bg-primary/10 hover:text-primary"
                          >
                            {t}
                          </button>
                        ))}
                        <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gradient text-[9px] font-bold text-white">
                            {initials(item.author)}
                          </span>
                          {item.author} · {timeAgo(item.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {open === item.id && item.answers.length > 0 && (
                    <div className="border-t bg-muted/30 px-4 py-4 md:px-6">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {item.answerCount} answer{item.answerCount === 1 ? "" : "s"}
                      </p>
                      <div className="space-y-3">
                        {item.answers.map((a) => (
                          <div key={a.id} className={cn("rounded-xl border bg-background p-4", a.accepted && "border-success/40 bg-success/[0.03]")}>
                            <div className="flex items-center gap-2">
                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-[9px] font-bold text-white">
                                {initials(a.author)}
                              </span>
                              <div>
                                <p className="text-xs font-semibold">{a.author} {a.accepted && <Badge variant="success" className="ml-1">Accepted</Badge>}</p>
                                <p className="text-[10px] text-muted-foreground">{a.authorRole} · {timeAgo(a.createdAt)}</p>
                              </div>
                              <span className="ml-auto flex items-center gap-1 text-xs font-medium text-primary">
                                <ThumbsUp className="h-3.5 w-3.5" /> {a.votes}
                              </span>
                            </div>
                            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">{a.body}</p>
                            {a.comments.length > 0 && (
                              <div className="mt-3 space-y-2 border-t pt-3">
                                {a.comments.map((c, ci) => (
                                  <p key={ci} className="text-xs text-muted-foreground">
                                    <span className="font-semibold text-foreground">{c.author}:</span> {c.body}
                                  </p>
                                ))}
                              </div>
                            )}
                            <div className="mt-3 flex items-center gap-2">
                              <Input
                                value={commentText[a.id] ?? ""}
                                onChange={(e) => setCommentText((s) => ({ ...s, [a.id]: e.target.value }))}
                                placeholder="Add a comment..."
                                className="h-8 text-xs"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  if (!commentText[a.id]?.trim()) return;
                                  setCommentText((s) => ({ ...s, [a.id]: "" }));
                                }}
                              >
                                Comment
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
