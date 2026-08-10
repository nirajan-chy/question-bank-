"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Loader2,
  PartyPopper,
  RefreshCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useMcqGenerate, useMcqSubmit, useRagDocuments } from "@/services/queries";
import type { McqQuiz, McqResult } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

type Stage = "config" | "quiz" | "results";

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

  return (
    <div className="mx-auto max-w-3xl">
      {stage === "config" && (
        <Card>
          <CardHeader>
            <CardTitle>Build a practice quiz</CardTitle>
            <CardDescription>
              The AI creates questions strictly from your uploaded material — no internet facts, no
              hallucinations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
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
                  onValueChange={(v) => setDifficulty(v as "easy" | "medium" | "hard")}
                >
                  <SelectTrigger id="mcq-difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy — recall & definitions</SelectItem>
                    <SelectItem value="medium">Medium — understanding</SelectItem>
                    <SelectItem value="hard">Hard — analysis & application</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mcq-topics">Topic focus (optional)</Label>
              <Input
                id="mcq-topics"
                placeholder="e.g. Photosynthesis, Newton's laws, Chapter 3…"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mcq-notes">Extra guidance (optional)</Label>
              <Textarea
                id="mcq-notes"
                placeholder="e.g. Include numeric problems, focus on diagrams, make distractors tricky…"
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
              className="w-full"
              onClick={handleGenerate}
              disabled={generate.isPending || readyCount === 0}
            >
              {generate.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating questions…
                </>
              ) : (
                "Generate quiz"
              )}
            </Button>

            {readyCount === 0 && (
              <p className="text-center text-xs text-muted-foreground">
                Upload at least one document (Documents tab) before generating a quiz.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {stage === "quiz" && quiz && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">{quiz.title}</h2>
              <p className="text-sm text-muted-foreground">
                {quiz.questions.length} questions · {quiz.difficulty} difficulty
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={restart}>
              <ArrowLeft className="h-4 w-4" /> Back to config
            </Button>
          </div>

          {quiz.questions.map((q, qi) => (
            <Card key={qi}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  <span className="mr-2 text-muted-foreground">{qi + 1}.</span>
                  {q.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {q.options.map((option, oi) => (
                  <button
                    key={oi}
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)))
                    }
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                      answers[qi] === oi
                        ? "border-primary bg-primary/10 font-medium"
                        : "hover:border-primary/40 hover:bg-muted/40"
                    )}
                  >
                    {answers[qi] === oi ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                    )}
                    <span>
                      <span className="mr-2 font-semibold text-muted-foreground">
                        {String.fromCharCode(65 + oi)}.
                      </span>
                      {option}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>
          ))}

          <Button className="w-full" size="lg" onClick={handleSubmit} disabled={submit.isPending}>
            {submit.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Grading…
              </>
            ) : (
              "Submit quiz"
            )}
          </Button>
        </div>
      )}

      {stage === "results" && result && (
        <div className="space-y-5">
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
              {result.passed ? (
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
                  <PartyPopper className="h-7 w-7" />
                </span>
              ) : (
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-warning/15 text-warning">
                  <Trophy className="h-7 w-7" />
                </span>
              )}
              <p className="text-3xl font-bold">
                {result.score}/{result.total}
              </p>
              <p className="text-sm text-muted-foreground">
                {result.passed
                  ? `Great work — you passed (${result.pass_percent}%+).`
                  : `Keep practicing — you need ${result.pass_percent}% to pass. Review the explanations below.`}
              </p>
              <Button onClick={restart} variant="outline" size="sm">
                <RefreshCcw className="h-4 w-4" /> New quiz
              </Button>
            </CardContent>
          </Card>

          {result.results.map((r, ri) => (
            <Card key={ri}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-start gap-2 text-base">
                  {r.correct ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                  )}
                  <span>
                    <span className="mr-2 text-muted-foreground">{ri + 1}.</span>
                    {r.question}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-1.5">
                  {r.options.map((option, oi) => (
                    <div
                      key={oi}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-2",
                        oi === r.correct_index && "border-success/40 bg-success/10",
                        oi === r.selected && oi !== r.correct_index && "border-destructive/40 bg-destructive/10"
                      )}
                    >
                      {oi === r.correct_index ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                      ) : oi === r.selected ? (
                        <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                      )}
                      <span className={cn(oi === r.correct_index && "font-medium")}>
                        {String.fromCharCode(65 + oi)}. {option}
                      </span>
                    </div>
                  ))}
                </div>
                {r.explanation && (
                  <p className="rounded-lg bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">Explanation: </span>
                    {r.explanation}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}

          <Button className="w-full" size="lg" onClick={restart}>
            <RefreshCcw className="h-4 w-4" /> Generate another quiz
          </Button>
        </div>
      )}
    </div>
  );
}
