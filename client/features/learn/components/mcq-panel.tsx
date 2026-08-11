"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  FileText,
  Loader2,
  PartyPopper,
  RefreshCcw,
  Trophy,
  XCircle,
  Zap,
  Target,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useMcqGenerate, useMcqSubmit, useRagDocuments } from "@/services/queries";
import type { McqQuiz, McqResult } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Stage = "config" | "quiz" | "results";

const DIFFICULTY_META = {
  easy: { label: "Easy", color: "text-success", bg: "bg-success/10", border: "border-success/30" },
  medium: { label: "Medium", color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" },
  hard: { label: "Hard", color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30" },
} as const;

export function McqPanel() {
  const { data: documents } = useRagDocuments();
  const generate = useMcqGenerate();
  const submit = useMcqSubmit();

  const [stage, setStage] = useState<Stage>("config");
  const [count, setCount] = useState("5");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [topics, setTopics] = useState("");
  const [notes, setNotes] = useState("");
  const [scope, setScope] = useState<string>("all");

  const [quiz, setQuiz] = useState<McqQuiz | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [result, setResult] = useState<McqResult | null>(null);

  const handleGenerate = async () => {
    const docIds = scope === "all" ? null : [scope];
    try {
      const generated = await generate.mutateAsync({
        count: Number(count),
        difficulty,
        topics: topics.trim() || undefined,
        notes: notes.trim() || undefined,
        document_ids: docIds,
      });
      setQuiz(generated);
      setAnswers(Array(generated.questions.length).fill(null));
      setResult(null);
      setStage("quiz");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    if (answers.some((a) => a === null)) {
      toast.error("Answer every question before submitting");
      return;
    }
    try {
      const res = await submit.mutateAsync({
        id: quiz.id,
        answers: answers as number[],
      });
      setResult(res);
      setStage("results");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const restart = () => {
    setStage("config");
    setQuiz(null);
    setResult(null);
    setAnswers([]);
  };

  const readyCount = (documents ?? []).filter((d) => d.status === "ready").length;
  const answeredCount = answers.filter((a) => a !== null).length;
  const quizProgress = quiz ? (answeredCount / quiz.questions.length) * 100 : 0;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Config stage */}
      {stage === "config" && (
        <div className="space-y-5">
          <Card className="overflow-hidden">
            <div className="border-b bg-gradient-to-r from-brand-gradient px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Target className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-lg font-bold">
                    Build a practice quiz
                  </h2>
                  <p className="text-sm text-white/80">
                    Questions generated strictly from your uploaded material
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="space-y-5 p-6">
              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    icon: FileText,
                    label: "Documents ready",
                    value: readyCount,
                    color: "text-blue-500",
                  },
                  {
                    icon: Target,
                    label: "Questions",
                    value: count,
                    color: "text-violet-500",
                  },
                  {
                    icon: Zap,
                    label: "Difficulty",
                    value: DIFFICULTY_META[difficulty].label,
                    color: DIFFICULTY_META[difficulty].color,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-2.5 rounded-xl border bg-muted/30 px-3 py-2.5"
                  >
                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                    <div>
                      <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                      <p className="text-sm font-semibold">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mcq-count">Number of questions</Label>
                  <Select value={count} onValueChange={setCount}>
                    <SelectTrigger id="mcq-count">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[3, 5, 10, 15, 20].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} questions
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mcq-difficulty">Difficulty</Label>
                  <Select
                    value={difficulty}
                    onValueChange={(v) =>
                      setDifficulty(v as "easy" | "medium" | "hard")
                    }
                  >
                    <SelectTrigger id="mcq-difficulty">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">
                        Easy — recall & definitions
                      </SelectItem>
                      <SelectItem value="medium">
                        Medium — understanding
                      </SelectItem>
                      <SelectItem value="hard">
                        Hard — analysis & application
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mcq-topics">Topic focus (optional)</Label>
                <Input
                  id="mcq-topics"
                  placeholder="e.g. Photosynthesis, Newton's laws, Chapter 3\u2026"
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mcq-notes">Extra guidance (optional)</Label>
                <Textarea
                  id="mcq-notes"
                  placeholder="e.g. Include numeric problems, focus on diagrams, make distractors tricky\u2026"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mcq-scope">Source</Label>
                <Select value={scope} onValueChange={setScope}>
                  <SelectTrigger id="mcq-scope">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All my documents</SelectItem>
                    {(documents ?? [])
                      .filter((d) => d.status === "ready")
                      .map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.filename}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full rounded-xl py-6 text-base font-semibold"
                size="lg"
                onClick={handleGenerate}
                disabled={generate.isPending || readyCount === 0}
              >
                {generate.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Generating
                    questions\u2026
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" /> Generate quiz
                  </>
                )}
              </Button>

              {readyCount === 0 && (
                <p className="text-center text-xs text-muted-foreground">
                  Upload at least one document (Documents tab) before generating
                  a quiz.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quiz stage */}
      {stage === "quiz" && quiz && (
        <div className="space-y-5">
          {/* Quiz header */}
          <Card className="overflow-hidden">
            <div className="border-b bg-muted/30 px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={restart}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <h2 className="font-display text-lg font-bold">
                      {quiz.title}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {quiz.questions.length} questions · {quiz.difficulty}{" "}
                      difficulty
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium",
                    DIFFICULTY_META[quiz.difficulty].bg,
                    DIFFICULTY_META[quiz.difficulty].border,
                    DIFFICULTY_META[quiz.difficulty].color
                  )}
                >
                  {DIFFICULTY_META[quiz.difficulty].label}
                </span>
              </div>
              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {answeredCount} of {quiz.questions.length} answered
                  </span>
                  <span>{Math.round(quizProgress)}%</span>
                </div>
                <Progress
                  value={quizProgress}
                  className="mt-1.5 h-2"
                />
              </div>
            </div>
          </Card>

          {/* Questions */}
          {quiz.questions.map((q, qi) => (
            <Card
              key={qi}
              className={cn(
                "transition-all",
                answers[qi] !== null && "border-primary/20"
              )}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-start gap-2 text-base">
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      answers[qi] !== null
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {qi + 1}
                  </span>
                  <span className="pt-0.5">{q.question}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pl-8">
                {q.options.map((option, oi) => (
                  <button
                    key={oi}
                    type="button"
                    onClick={() =>
                      setAnswers((prev) =>
                        prev.map((a, i) => (i === qi ? oi : a))
                      )
                    }
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
                      answers[qi] === oi
                        ? "border-primary bg-primary/10 font-medium shadow-sm"
                        : "hover:border-primary/30 hover:bg-muted/40"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                        answers[qi] === oi
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 text-muted-foreground"
                      )}
                    >
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <span>{option}</span>
                  </button>
                ))}
              </CardContent>
            </Card>
          ))}

          <Button
            className="w-full rounded-xl py-6 text-base font-semibold"
            size="lg"
            onClick={handleSubmit}
            disabled={submit.isPending}
          >
            {submit.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Grading\u2026
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" /> Submit quiz
              </>
            )}
          </Button>
        </div>
      )}

      {/* Results stage */}
      {stage === "results" && result && (
        <div className="space-y-5">
          {/* Score card */}
          <Card className="overflow-hidden border-0">
            <div
              className={cn(
                "relative px-6 py-10 text-center text-white",
                result.passed
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                  : "bg-gradient-to-br from-amber-500 to-orange-600"
              )}
            >
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
              <div className="relative">
                <span
                  className={cn(
                    "mx-auto flex h-20 w-20 items-center justify-center rounded-full",
                    result.passed ? "bg-white/20" : "bg-white/20"
                  )}
                >
                  {result.passed ? (
                    <PartyPopper className="h-10 w-10" />
                  ) : (
                    <Trophy className="h-10 w-10" />
                  )}
                </span>
                <p className="mt-4 text-5xl font-bold font-display">
                  {result.score}/{result.total}
                </p>
                <p className="mt-2 text-lg font-medium text-white/90">
                  {result.passed
                    ? "Excellent work!"
                    : "Keep practicing!"}
                </p>
                <p className="mt-1 text-sm text-white/70">
                  {result.passed
                    ? `You scored ${result.pass_percent}% — well done.`
                    : `You need ${result.pass_percent}% to pass. Review the explanations below.`}
                </p>
              </div>
            </div>
          </Card>

          {/* Question review */}
          {result.results.map((r, ri) => (
            <Card key={ri}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-start gap-2.5 text-base">
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                      r.correct ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                    )}
                  >
                    {r.correct ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5" />
                    )}
                  </span>
                  <span>
                    <span className="text-muted-foreground">{ri + 1}.</span>{" "}
                    {r.question}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pl-8">
                {r.options.map((option, oi) => (
                  <div
                    key={oi}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm",
                      oi === r.correct_index &&
                        "border-success/40 bg-success/10 font-medium",
                      oi === r.selected &&
                        oi !== r.correct_index &&
                        "border-destructive/40 bg-destructive/10",
                      oi !== r.correct_index &&
                        oi !== r.selected &&
                        "opacity-60"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
                        oi === r.correct_index
                          ? "border-success bg-success text-white"
                          : oi === r.selected
                            ? "border-destructive bg-destructive text-white"
                            : "border-muted-foreground/30"
                      )}
                    >
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <span>{option}</span>
                    {oi === r.correct_index && (
                      <CheckCircle2 className="ml-auto h-4 w-4 text-success" />
                    )}
                    {oi === r.selected && oi !== r.correct_index && (
                      <XCircle className="ml-auto h-4 w-4 text-destructive" />
                    )}
                  </div>
                ))}
                {r.explanation && (
                  <div className="mt-2 rounded-xl bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Explanation:{" "}
                    </span>
                    {r.explanation}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <Button
            className="w-full rounded-xl py-6 text-base font-semibold"
            size="lg"
            onClick={restart}
          >
            <RefreshCcw className="h-5 w-5" /> Generate another quiz
          </Button>
        </div>
      )}
    </div>
  );
}
