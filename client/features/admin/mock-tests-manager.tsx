"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  FileJson,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { admin } from "@/services/api";
import { useAdminResource } from "@/services/queries";
import { useDebounce } from "@/hooks/use-debounce";
import { FileDropzone } from "@/components/shared/file-dropzone";
import type { MockTest, MockTestQuestion } from "@/types";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

type DraftQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number | null;
  marks: number;
  difficulty: Difficulty;
  topic: string | null;
  explanation: string | null;
  errors: string[];
};

const letterIndex = (letter: string): number | null => {
  const m = /^([a-f])$/i.exec(letter.trim());
  if (!m) return null;
  return m[1].toLowerCase().charCodeAt(0) - 97;
};

function normalizeDifficulty(value: unknown): Difficulty {
  const v = String(value ?? "").toLowerCase();
  if (v.startsWith("easy")) return "Easy";
  if (v.startsWith("hard")) return "Hard";
  return "Medium";
}

function buildQuestion(raw: unknown, index: number): DraftQuestion {
  const item = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const draft: DraftQuestion = {
    id: `q${index + 1}`,
    question: String(item.question ?? item.text ?? item.q ?? "").trim(),
    options: Array.isArray(item.options)
      ? (item.options as unknown[])
          .map((o) => String(o ?? "").trim())
          .filter(Boolean)
      : [],
    correctIndex: null,
    marks: Math.max(1, Number(item.marks ?? item.mark ?? 1) || 1),
    difficulty: normalizeDifficulty(item.difficulty),
    topic: item.topic ? String(item.topic) : null,
    explanation: item.explanation ? String(item.explanation) : null,
    errors: [],
  };

  let ci: number | null = null;
  const rawCorrect = item.correctIndex ?? item.correct ?? item.answer;
  if (typeof rawCorrect === "number") {
    ci = Math.floor(rawCorrect);
  } else if (typeof rawCorrect === "string") {
    const viaLetter = letterIndex(rawCorrect);
    if (viaLetter !== null) {
      ci = viaLetter;
    } else {
      const viaText = draft.options.findIndex((o) => o.toLowerCase() === rawCorrect.trim().toLowerCase());
      ci = viaText >= 0 ? viaText : null;
    }
  }
  draft.correctIndex = ci;

  const errors: string[] = [];
  if (!draft.question) errors.push("Question text is required");
  if (draft.options.length < 2) errors.push("At least 2 options are required");
  if (draft.options.length > 6) errors.push("At most 6 options are allowed");
  if (draft.correctIndex === null || draft.correctIndex < 0 || draft.correctIndex >= draft.options.length) {
    errors.push("Correct answer is missing or invalid");
  }
  draft.errors = errors;
  return draft;
}

function parseImport(fileText: string): { questions: DraftQuestion[]; error?: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(fileText);
  } catch {
    return { questions: [], error: "The file is not valid JSON." };
  }
  let list: unknown[];
  if (Array.isArray(parsed)) {
    list = parsed;
  } else if (parsed && typeof parsed === "object" && Array.isArray((parsed as { questions?: unknown[] }).questions)) {
    list = (parsed as { questions: unknown[] }).questions;
  } else {
    return { questions: [], error: 'Unrecognized format. Expected a JSON array of questions or { "questions": [...] }.' };
  }
  if (list.length === 0) return { questions: [], error: "The file contains no questions." };
  if (list.length > 200) return { questions: [], error: `Too many questions (${list.length}). Maximum is 200 per test.` };
  return { questions: list.map((q, i) => buildQuestion(q, i)) };
}

function validateDraft(q: DraftQuestion): string[] {
  const errors: string[] = [];
  if (!q.question.trim()) errors.push("Question text is required");
  const options = q.options.map((o) => o.trim()).filter(Boolean);
  if (options.length < 2) errors.push("At least 2 options are required");
  if (options.length > 6) errors.push("At most 6 options are allowed");
  if (q.correctIndex === null || q.correctIndex < 0 || q.correctIndex >= options.length) {
    errors.push("Correct answer is missing or invalid");
  }
  return errors;
}

function toPayload(questions: DraftQuestion[]): MockTestQuestion[] {
  return questions.map((q) => ({
    id: q.id,
    question: q.question.trim(),
    options: q.options.map((o) => o.trim()).filter(Boolean),
    correctIndex: q.correctIndex as number,
    marks: Math.max(1, q.marks || 1),
    difficulty: q.difficulty,
    topic: q.topic,
    explanation: q.explanation,
  }));
}

type FormState = {
  title: string;
  subjectSlug: string;
  subjectName: string;
  level: string;
  durationMinutes: string;
  fullMarks: string;
  difficulty: Difficulty;
  description: string;
  premium: boolean;
  tags: string;
  questions: DraftQuestion[];
};

function mockToForm(mock: MockTest): FormState {
  const data = Array.isArray(mock.questionData) ? mock.questionData : [];
  return {
    title: mock.title,
    subjectSlug: mock.subjectSlug,
    subjectName: mock.subjectName,
    level: mock.level,
    durationMinutes: String(mock.durationMinutes || 0),
    fullMarks: String(mock.fullMarks || 0),
    difficulty: mock.difficulty,
    description: mock.description,
    premium: mock.premium,
    tags: (mock.tags ?? []).join("\n"),
    questions: data.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      marks: Number(q.marks) || 1,
      difficulty: q.difficulty ?? "Medium",
      topic: q.topic ?? null,
      explanation: q.explanation ?? null,
      errors: [],
    })),
  };
}

function MockTestForm({
  initial,
  onDone,
  onCancel,
}: {
  initial?: MockTest;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => (initial ? mockToForm(initial) : {
    title: "",
    subjectSlug: "",
    subjectName: "",
    level: "",
    durationMinutes: "30",
    fullMarks: "0",
    difficulty: "Medium",
    description: "",
    premium: false,
    tags: "",
    questions: [],
  }));
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const updateQuestion = (id: string, patch: Partial<DraftQuestion>) => {
    setForm((f) => ({
      ...f,
      questions: f.questions.map((q) => {
        if (q.id !== id) return q;
        const next = { ...q, ...patch };
        return { ...next, errors: validateDraft(next) };
      }),
    }));
  };

  const removeQuestion = (id: string) =>
    setForm((f) => ({ ...f, questions: f.questions.filter((q) => q.id !== id) }));

  const handleImportFile = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const { questions, error } = parseImport(text);
      if (error) {
        toast.error("Import failed", { description: error });
        return;
      }
      setForm((f) => ({ ...f, questions: [...f.questions, ...questions] }));
      const valid = questions.filter((q) => q.errors.length === 0).length;
      toast.success(`Imported ${questions.length} questions`, {
        description: `${valid} valid, ${questions.length - valid} need attention.`,
      });
    } catch {
      toast.error("Import failed", { description: "Could not read the file." });
    } finally {
      setImporting(false);
    }
  };

  const handleSave = async () => {
    const questions = form.questions.map((q) => ({ ...q, errors: validateDraft(q) }));
    setForm((f) => ({ ...f, questions }));
    const invalid = questions.filter((q) => q.errors.length > 0);
    if (invalid.length > 0) {
      toast.error(`Cannot save — ${invalid.length} question(s) have errors`, {
        description: invalid[0].errors.join("; "),
      });
      return;
    }
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (questions.length === 0) {
      toast.error("Add at least one question (import a JSON file or build questions below)");
      return;
    }

    setSaving(true);
    const slug = form.subjectName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const payload = {
      title: form.title.trim(),
      subjectSlug: slug,
      subjectName: form.subjectName.trim(),
      level: form.level.trim(),
      durationMinutes: Number(form.durationMinutes) || 0,
      fullMarks: Number(form.fullMarks) || 0,
      difficulty: form.difficulty,
      description: form.description.trim(),
      premium: form.premium,
      tags: form.tags.split("\n").map((t) => t.trim()).filter(Boolean),
      questionData: toPayload(questions),
    };
    try {
      if (initial) {
        await admin.update("mock-tests", initial.id, payload);
        toast.success("Mock test updated");
      } else {
        await admin.create("mock-tests", payload);
        toast.success("Mock test published");
      }
      onDone();
    } catch (error) {
      toast.error("Save failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const invalidCount = form.questions.filter((q) => q.errors.length > 0).length;

  return (
    <Card className="border-primary/30 bg-primary/[0.03]">
      <CardContent className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">
            {initial ? "Edit Mock Test" : "New Mock Test"}
          </h2>
          <Button variant="ghost" size="icon-sm" onClick={onCancel} aria-label="Close form">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="mt-title">Title *</Label>
            <Input
              id="mt-title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Physics Mock Test 1"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mt-subject-name">Subject name *</Label>
            <Input
              id="mt-subject-name"
              value={form.subjectName}
              onChange={(e) => set("subjectName", e.target.value)}
              placeholder="e.g. Physics"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mt-level">Level *</Label>
            <Input
              id="mt-level"
              value={form.level}
              onChange={(e) => set("level", e.target.value)}
              placeholder="e.g. Class 12 · NEB"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mt-difficulty">Difficulty</Label>
            <Select
              value={form.difficulty}
              onValueChange={(v) => set("difficulty", v as Difficulty)}
            >
              <SelectTrigger id="mt-difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mt-duration">Duration (minutes)</Label>
            <Input
              id="mt-duration"
              type="number"
              min={1}
              value={form.durationMinutes}
              onChange={(e) => set("durationMinutes", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mt-marks">Full marks</Label>
            <Input
              id="mt-marks"
              type="number"
              min={0}
              value={form.fullMarks}
              onChange={(e) => set("fullMarks", e.target.value)}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="mt-description">Description</Label>
            <Textarea
              id="mt-description"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="What is this test about?"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="mt-tags">Tags (one per line)</Label>
            <Textarea
              id="mt-tags"
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              rows={2}
              placeholder={"mechanics\nelectrodynamics"}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3 sm:col-span-2">
            <Label htmlFor="mt-premium">Premium (requires subscription)</Label>
            <Switch
              id="mt-premium"
              checked={form.premium}
              onCheckedChange={(c) => set("premium", c)}
            />
          </div>

          {/* Question import + preview */}
          <div className="sm:col-span-2">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-semibold">Questions</h3>
                <p className="text-xs text-muted-foreground">
                  {form.questions.length} loaded
                  {invalidCount > 0 && (
                    <span className="ml-1 font-medium text-destructive">
                      · {invalidCount} with errors
                    </span>
                  )}
                </p>
              </div>
              {form.questions.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => set("questions", [])}
                >
                  <Trash2 className="h-4 w-4" /> Clear all
                </Button>
              )}
            </div>

            <FileDropzone
              accept=".json,application/json"
              disabled={importing}
              onFiles={handleImportFile}
              className="py-6"
            >
              <div className="flex flex-col items-center gap-2">
                <FileJson className="h-7 w-7 text-muted-foreground" />
                <p className="text-sm font-semibold">
                  {importing ? "Reading file…" : "Import questions from JSON"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Drag & drop or click to browse · JSON array or {"{ \"questions\": [...] }"}
                </p>
              </div>
            </FileDropzone>

            {form.questions.length > 0 && (
              <ul className="mt-4 space-y-3">
                {form.questions.map((q, idx) => (
                  <li key={q.id} className="rounded-xl border bg-background p-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Q{idx + 1}</Badge>
                        <Badge variant={q.difficulty === "Hard" ? "destructive" : q.difficulty === "Easy" ? "success" : "warning"}>
                          {q.difficulty}
                        </Badge>
                        {q.errors.length > 0 && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" /> {q.errors[0]}
                          </Badge>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Remove question"
                        onClick={() => removeQuestion(q.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Textarea
                        value={q.question}
                        onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                        rows={2}
                        placeholder="Question text"
                        className="sm:col-span-2"
                      />
                      <Textarea
                        value={q.options.join("\n")}
                        onChange={(e) =>
                          updateQuestion(q.id, { options: e.target.value.split("\n") })
                        }
                        rows={3}
                        placeholder={"Option A\nOption B\nOption C\nOption D"}
                        className="sm:col-span-2"
                      />
                      <div className="space-y-1.5">
                        <Label>Correct answer</Label>
                        <Select
                          value={q.correctIndex === null ? undefined : String(q.correctIndex)}
                          onValueChange={(v) => updateQuestion(q.id, { correctIndex: Number(v) })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select correct option" />
                          </SelectTrigger>
                          <SelectContent>
                            {q.options.map((opt, i) => (
                              <SelectItem key={i} value={String(i)}>
                                {String.fromCharCode(65 + i)} · {opt.slice(0, 40)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Marks</Label>
                        <Input
                          type="number"
                          min={1}
                          value={q.marks}
                          onChange={(e) => updateQuestion(q.id, { marks: Math.max(1, Number(e.target.value) || 1) })}
                        />
                      </div>
                      <Textarea
                        value={q.explanation ?? ""}
                        onChange={(e) => updateQuestion(q.id, { explanation: e.target.value || null })}
                        rows={2}
                        placeholder="Explanation (optional)"
                        className="sm:col-span-2"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 sm:col-span-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? "Saving…" : initial ? "Save changes" : "Publish mock test"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function MockTestsManager() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const debouncedSearch = useDebounce(query.trim(), 300);
  const { data: raw = [], isLoading, isFetching } = useAdminResource("mock-tests", debouncedSearch);
  const tests = useMemo(() => raw as unknown as MockTest[], [raw]);
  const [mode, setMode] = useState<{ type: "edit"; record: MockTest } | { type: "create" } | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "mock-tests", debouncedSearch] });
    queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
  };

  const remove = async (id: string) => {
    try {
      await admin.remove("mock-tests", id);
      toast.success("Mock test deleted");
      invalidate();
    } catch (error) {
      toast.error("Delete failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Mock Tests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${tests.length} tests`}
          </p>
        </div>
        <Button variant="gradient" onClick={() => setMode({ type: "create" })}>
          <Plus className="h-4 w-4" /> Add Mock Test
        </Button>
      </div>

      {mode && (
        <MockTestForm
          initial={mode.type === "edit" ? mode.record : undefined}
          onDone={() => {
            setMode(null);
            invalidate();
          }}
          onCancel={() => setMode(null)}
        />
      )}

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-2 border-b p-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mock tests…"
              className="h-8 border-0 shadow-none focus-visible:ring-0"
            />
            {query && (
              <Button variant="ghost" size="icon-sm" onClick={() => setQuery("")} aria-label="Clear search">
                <X className="h-4 w-4" />
              </Button>
            )}
            {isFetching && <Skeleton className="h-4 w-16" />}
          </div>

          {isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : tests.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <XCircle className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {query ? "No mock tests match your search." : "No mock tests found."}
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {tests.map((test) => (
                <li key={test.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 truncate text-sm font-semibold">
                      {test.title}
                      {test.premium && <Badge variant="warning">Premium</Badge>}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {test.subjectName} · {test.level} · {test.questions} questions ·{" "}
                      {test.durationMinutes}m · {test.attempts} attempts
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {test.questions > 0 && test.questionData?.length ? (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Playable
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <AlertTriangle className="h-3 w-3" /> No questions
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setMode({ type: "edit", record: test })}
                      aria-label={`Edit ${test.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {confirmingId === test.id ? (
                      <div className="flex items-center gap-1">
                        <Button variant="destructive" size="sm" onClick={() => remove(test.id)}>
                          <CheckCircle2 className="h-4 w-4" /> Confirm
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => setConfirmingId(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setConfirmingId(test.id)}
                        aria-label={`Delete ${test.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
