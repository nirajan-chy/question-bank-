"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileQuestion,
  Flag,
  Play,
  Trophy,
  XCircle,
} from "lucide-react";
import { useMockTest } from "@/services/queries";
import { api } from "@/services/api";
import type { MockTestQuestion, MockTestResult } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const letter = (i: number) => String.fromCharCode(65 + i);

function fmtTime(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function StartScreen({
  questions,
  durationMinutes,
  onStart,
}: {
  questions: MockTestQuestion[];
  durationMinutes: number;
  onStart: () => void;
}) {
  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardContent className="space-y-6 p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow-sm">
              <FileQuestion className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold">Ready to start?</h2>
              <p className="text-sm text-muted-foreground">
                The timer starts as soon as you begin.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-2xl font-bold">{questions.length}</p>
              <p className="text-xs text-muted-foreground">Questions</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-2xl font-bold">{durationMinutes}m</p>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-2xl font-bold">{totalMarks}</p>
              <p className="text-xs text-muted-foreground">Marks</p>
            </div>
          </div>

          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" /> Select one answer per question.
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" /> You can navigate back to change answers.
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" /> The test auto-submits when time runs out.
            </li>
          </ul>

          <Button size="lg" className="w-full" onClick={onStart}>
            <Play className="h-4 w-4" /> Start test
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function QuestionScreen({
  questions,
  answers,
  secondsLeft,
  onSelect,
  onSubmit,
  submitting,
}: {
  questions: MockTestQuestion[];
  answers: Record<string, number>;
  secondsLeft: number;
  onSelect: (id: string, index: number) => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const q = questions[current];
  const answered = Object.values(answers).filter((v) => v !== undefined).length;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="warning" className="gap-1.5 text-sm">
            <Clock className="h-4 w-4" />
            {fmtTime(Math.max(0, secondsLeft))}
          </Badge>
          <Badge variant="outline">
            {answered}/{questions.length} answered
          </Badge>
        </div>
        <Button
          variant="destructive"
          size="sm"
          disabled={submitting}
          onClick={onSubmit}
        >
          <Flag className="h-4 w-4" /> Submit
        </Button>
      </div>

      {/* Navigator */}
      <div className="flex flex-wrap gap-1.5 rounded-xl border bg-muted/20 p-3">
        {questions.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCurrent(i)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold transition-colors",
              answers[item.id] !== undefined
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted",
              i === current && "ring-2 ring-ring ring-offset-1"
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg font-semibold leading-snug">
              <span className="mr-2 text-muted-foreground">Q{current + 1}.</span>
              {q.question}
            </h3>
            <Badge variant="secondary" className="shrink-0">
              {q.marks || 1} mark{(q.marks || 1) > 1 ? "s" : ""}
            </Badge>
          </div>

          <div className="space-y-2">
            {q.options.map((option, i) => {
              const selected = answers[q.id] === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelect(q.id, i)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
                    selected
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "hover:border-primary/40 hover:bg-muted/40"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {letter(i)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={current === 0}
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>
        {current < questions.length - 1 ? (
          <Button onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}>
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="gradient" disabled={submitting} onClick={onSubmit}>
            <Flag className="h-4 w-4" /> Finish test
          </Button>
        )}
      </div>
    </div>
  );
}

function ResultScreen({
  result,
  onRetry,
}: {
  result: MockTestResult;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card className={cn(result.passed ? "border-success/40" : "border-destructive/40")}>
        <CardContent className="space-y-5 p-8 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient text-white shadow-glow">
            {result.passed ? <Trophy className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold">
              {result.passed ? "Test passed!" : "Keep practicing"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You scored {result.score} out of {result.total} marks
            </p>
          </div>
          <div className="mx-auto grid max-w-md grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-2xl font-bold">{result.percentage}%</p>
              <p className="text-xs text-muted-foreground">Score</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-2xl font-bold text-success">
                {result.results.filter((r) => r.correct).length}
              </p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <p className="text-2xl font-bold text-destructive">
                {result.results.filter((r) => !r.correct).length}
              </p>
              <p className="text-xs text-muted-foreground">Wrong</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={onRetry}>
              <Play className="h-4 w-4" /> Try again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/mock-tests">Browse all tests</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="font-display text-lg font-bold">Review answers</h3>
        {result.results.map((r, i) => (
          <Card key={r.id}>
            <CardContent
              className={cn(
                "space-y-3 border-l-4 p-5",
                r.correct ? "border-l-success" : "border-l-destructive"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium leading-snug">
                  <span className="mr-2 text-muted-foreground">Q{i + 1}.</span>
                  {r.question}
                </p>
                {r.correct ? (
                  <Badge variant="success" className="shrink-0 gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Correct
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="shrink-0 gap-1">
                    <XCircle className="h-3 w-3" /> Wrong
                  </Badge>
                )}
              </div>
              <ul className="space-y-1 text-sm">
                {r.options.map((option, oi) => {
                  const isCorrect = oi === r.correctIndex;
                  const isSelected = oi === r.selected;
                  return (
                    <li
                      key={oi}
                      className={cn(
                        "rounded-lg border px-3 py-2",
                        isCorrect
                          ? "border-success/50 bg-success/10"
                          : isSelected
                            ? "border-destructive/50 bg-destructive/10"
                            : "bg-muted/30"
                      )}
                    >
                      {letter(oi)}. {option}
                      {isCorrect && (
                        <span className="ml-2 text-xs font-medium text-success">✓ correct</span>
                      )}
                      {isSelected && !isCorrect && (
                        <span className="ml-2 text-xs font-medium text-destructive">✗ your answer</span>
                      )}
                    </li>
                  );
                })}
              </ul>
              {r.explanation && (
                <p className="rounded-lg bg-info/10 px-3 py-2 text-xs text-info">
                  <strong>Explanation:</strong> {r.explanation}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function TakeTest({ slug }: { slug: string }) {
  const { data: test, isLoading } = useMockTest(slug);
  const [phase, setPhase] = useState<"start" | "taking" | "result">("start");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<MockTestResult | null>(null);
  const submitRef = useRef(false);
  const answersRef = useRef<Record<string, number>>({});

  const questions = useMemo(() => (Array.isArray(test?.questionData) ? test.questionData : []), [test]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const handleSubmit = async () => {
    if (submitRef.current) return;
    submitRef.current = true;
    setSubmitting(true);
    try {
      const res = await api.submitMockTest(slug, answersRef.current);
      setResult(res);
      setPhase("result");
    } catch (error) {
      toast.error("Submission failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
      submitRef.current = false;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (phase !== "taking") return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          void handleSubmit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const start = () => {
    setAnswers({});
    answersRef.current = {};
    setResult(null);
    submitRef.current = false;
    setSecondsLeft(Math.max(0, (test?.durationMinutes || 0) * 60));
    setPhase("taking");
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <XCircle className="mx-auto h-10 w-10 text-muted-foreground/50" />
        <p className="mt-3 font-semibold">Mock test not found</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/mock-tests">Back to mock tests</Link>
        </Button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground/50" />
        <p className="mt-3 font-semibold">{test.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          This mock test has no questions yet. Check back soon.
        </p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/mock-tests">Back to mock tests</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/mock-tests"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All mock tests
          </Link>
          <h1 className="mt-1 font-display text-2xl font-bold">{test.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {test.subjectName} · {test.level}
          </p>
        </div>
        {phase !== "result" && (
          <div className="flex gap-2">
            <Badge variant="secondary">{test.difficulty}</Badge>
            <Badge variant="outline">{test.attempts} attempts</Badge>
            <Badge variant="outline">{test.avgScore}% avg</Badge>
          </div>
        )}
      </div>

      {phase === "start" && (
        <StartScreen
          questions={questions}
          durationMinutes={test.durationMinutes}
          onStart={start}
        />
      )}
      {phase === "taking" && (
        <QuestionScreen
          questions={questions}
          answers={answers}
          secondsLeft={secondsLeft}
          onSelect={(id, index) => setAnswers((a) => ({ ...a, [id]: index }))}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
      {phase === "result" && result && (
        <ResultScreen result={result} onRetry={start} />
      )}
    </div>
  );
}
