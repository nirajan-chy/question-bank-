"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Eye, MessageSquarePlus, Send } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { useCommunity } from "@/services/queries";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";

const schema = z.object({
  title: z.string().min(12, "Title should be at least 12 characters").max(120, "Keep the title under 120 characters"),
  body: z.string().min(30, "Give enough detail — at least 30 characters"),
});

type Form = z.infer<typeof schema>;

export function AskQuestion() {
  const { data: questions = [] } = useCommunity();
  const suggestedTags = useMemo(
    () => Array.from(new Set(questions.flatMap((q) => q.tags))),
    [questions]
  );
  const [tags, setTags] = useState<string[]>(["see"]);
  const [tagInput, setTagInput] = useState("");
  const [preview, setPreview] = useState(false);
  const [posted, setPosted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  const title = watch("title") ?? "";
  const body = watch("body") ?? "";

  const toggleTag = (t: string) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const addCustomTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  };

  const onSubmit = async () => {
    setSubmitting(true);
    try {
      await api.askQuestion({ title, body, tags });
      setPosted(true);
      toast.success("Question posted!", { description: "The community will answer shortly." });
    } catch (error) {
      toast.error("Could not post your question", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (posted) {
    return (
      <Card className="mx-auto flex max-w-lg flex-col items-center p-12 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
          <Send className="h-7 w-7" />
        </span>
        <h2 className="mt-5 font-display text-xl font-bold">Your question is live!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You’ll be notified when someone answers. Meanwhile, keep helping others — it earns XP.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="gradient" asChild>
            <Link href="/community">Back to community</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <PageHeader
        icon={MessageSquarePlus}
        gradient="from-fuchsia-500 to-pink-600"
        title="Ask the community"
        description="Write a clear question — include what you've tried and your level. The more specific, the faster toppers and teachers help."
        crumbs={[{ label: "Home", href: "/" }, { label: "Community", href: "/community" }, { label: "Ask" }]}
      />

      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-3xl space-y-6">
          <Card className="p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Question title</Label>
                <Input
                  id="title"
                  placeholder="e.g. How do I solve quadratic equations by completing the square?"
                  {...register("title")}
                />
                {errors.title ? (
                  <p className="text-xs text-destructive">{errors.title.message}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">{title.length}/120 characters</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Details</Label>
                <Textarea
                  id="body"
                  rows={7}
                  placeholder="Explain the problem, what you've tried so far, and what your level is (SEE, +2, Bachelor...)."
                  {...register("body")}
                />
                {errors.body && <p className="text-xs text-destructive">{errors.body.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedTags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTag(t)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors",
                        tags.includes(t) ? "border-primary bg-primary/10 text-primary" : "bg-card hover:border-primary/40"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex max-w-xs gap-2">
                  <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add a custom tag..." className="h-9 text-xs" />
                  <Button type="button" variant="outline" size="sm" onClick={addCustomTag}>Add</Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((t) => (
                      <Badge key={t} variant="outline" className="gap-1 capitalize">
                        {t}
                        <button type="button" onClick={() => setTags((p) => p.filter((x) => x !== t))}>×</button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5">
                <Button type="button" variant="outline" onClick={() => setPreview((p) => !p)}>
                  <Eye className="h-4 w-4" /> {preview ? "Hide preview" : "Preview"}
                </Button>
                <Button type="submit" variant="gradient" disabled={submitting}>
                  <Send className="h-4 w-4" /> {submitting ? "Posting..." : "Post question"}
                </Button>
              </div>
            </form>
          </Card>

          {preview && (
            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preview</p>
              <h2 className="mt-3 font-display text-lg font-bold">{title || "Your question title"}</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                {body || "Your question details will appear here..."}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium capitalize text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </Card>
          )}

          <Link href="/community" className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to community
          </Link>
        </div>
      </section>
    </>
  );
}
