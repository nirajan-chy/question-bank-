"use client";

import { Children, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  BookMarked,
  ClipboardList,
  Download,
  FileQuestion,
  FileText,
  LayoutGrid,
  ListChecks,
  PlayCircle,
  Share2,
  Timer,
} from "lucide-react";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { useSubject } from "@/services/queries";
import { db } from "@/services/db";
import { cn, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookmarkButton } from "@/components/shared/bookmark-button";
import { SubjectCard, NoteCard, BookCard, QuestionBankCard, PastPaperCard } from "@/features/education/components/cards";
import { useCopy } from "@/hooks/use-copy";
import { EmptyState } from "@/components/shared/empty-state";

export const subjectTabs = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "syllabus", label: "Syllabus", icon: FileText },
  { id: "notes", label: "Notes", icon: BookOpen },
  { id: "books", label: "Books", icon: BookMarked },
  { id: "question-banks", label: "Question Banks", icon: FileQuestion },
  { id: "past-papers", label: "Past Papers", icon: ClipboardList },
  { id: "mcqs", label: "MCQs", icon: ListChecks },
  { id: "assignments", label: "Assignments", icon: ClipboardList },
  { id: "videos", label: "Videos", icon: PlayCircle },
  { id: "downloads", label: "Downloads", icon: Download },
] as const;

export type SubjectTabId = (typeof subjectTabs)[number]["id"];

export function SubjectDetail({ slug, initialTab = "overview" }: { slug: string; initialTab?: string }) {
  const { data: subject, isLoading } = useSubject(slug);
  const [tab, setTab] = useState<SubjectTabId>(
    subjectTabs.some((t) => t.id === initialTab) ? (initialTab as SubjectTabId) : "overview"
  );
  const { copied, copy } = useCopy();

  const related = useMemo(() => {
    if (!subject) return [];
    return subject.relatedSlugs
      .map((s) => db.subjects.find((x) => x.slug === s))
      .filter(Boolean) as NonNullable<typeof subject>[];
  }, [subject]);

  if (!isLoading && !subject) notFound();
  if (!subject || isLoading) {
    return (
      <div className="container py-16">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-primary/10" />
        <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-primary/10" />
        <div className="mt-10 h-64 animate-pulse rounded-2xl bg-primary/10" />
      </div>
    );
  }

  const handleShare = async () => {
    await copy(window.location.href);
    toast.success(copied ? "Link copied" : "Link copied to clipboard");
  };

  const mcqs = subject.mcqs > 0 ? generateMcqs(subject.name) : [];
  const videos = generateVideos(subject);
  const downloads = generateDownloads(subject);
  const assignments = generateAssignments(subject);

  return (
    <>
      <header className="relative overflow-hidden border-b bg-mesh-light dark:bg-mesh-dark">
        <div className={cn("absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r", subject.gradient)} />
        <div className="container py-10 md:py-14">
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/subjects" className="hover:text-foreground">Subjects</Link>
            <span>/</span>
            <span className="font-medium text-foreground">{subject.name}</span>
          </nav>
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className={cn("flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl text-white shadow-glow-sm", subject.gradient)}>
                  {subject.emoji}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-2xl font-bold md:text-4xl">{subject.name}</h1>
                    {subject.trending && <Badge variant="warning">🔥 Trending</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {subject.level} · {subject.category}
                  </p>
                </div>
              </div>
              <p className="mt-5 max-w-2xl text-sm text-muted-foreground text-pretty md:text-base">
                {subject.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {subject.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Card className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Your progress</p>
                  <span className="text-sm font-bold text-primary">62%</span>
                </div>
                <Progress value={62} className="mt-3" indicatorClassName={cn("bg-gradient-to-r", subject.gradient)} />
                <p className="mt-3 text-xs text-muted-foreground">
                  {formatNumber(420)} questions solved · {formatNumber(18)} hours studied
                </p>
                <div className="mt-4 flex gap-2">
                  <Button variant="gradient" size="sm" className="flex-1">
                    <Timer className="h-4 w-4" /> Start mock test
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <BookmarkButton
                    item={{
                      id: `subject-${subject.id}`,
                      type: "note",
                      title: subject.name,
                      subtitle: `${subject.level} · Subject page`,
                      href: `/subjects/${subject.slug}`,
                      savedAt: new Date().toISOString(),
                      icon: "note",
                    }}
                  />
                </div>
              </Card>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl border bg-card p-3 text-center">
                  <p className="font-display text-lg font-bold">{subject.notes}</p>
                  <p className="text-[10px] text-muted-foreground">Notes</p>
                </div>
                <div className="rounded-xl border bg-card p-3 text-center">
                  <p className="font-display text-lg font-bold">{subject.questionBanks}</p>
                  <p className="text-[10px] text-muted-foreground">Q Banks</p>
                </div>
                <div className="rounded-xl border bg-card p-3 text-center">
                  <p className="font-display text-lg font-bold">{subject.mcqs}</p>
                  <p className="text-[10px] text-muted-foreground">MCQs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="sticky top-16 z-30 border-b bg-background/90 backdrop-blur-md">
        <div className="container no-scrollbar flex gap-1 overflow-x-auto py-2">
          {subjectTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <section className="py-10 md:py-14">
        <div className="container">
          {tab === "overview" && <OverviewTab subject={subject} />}
          {tab === "syllabus" && <SyllabusTab subject={subject} />}
          {tab === "notes" && (
            <ResourceGrid empty={<EmptyState title="No notes yet" description="Notes for this subject are coming soon." />}>
              {db.notes
                .filter((n) => n.subjectSlug === subject.slug)
                .map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
            </ResourceGrid>
          )}
          {tab === "books" && (
            <ResourceGrid empty={<EmptyState title="No books yet" description="Books for this subject are coming soon." />}>
              {db.books
                .filter((b) => b.subjects.some((s) => s.toLowerCase().includes(subject.name.toLowerCase().split(" ")[0])))
                .map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
            </ResourceGrid>
          )}
          {tab === "question-banks" && (
            <ResourceGrid empty={<EmptyState title="No question banks yet" description="Question banks are coming soon." />}>
              {db.questionBanks
                .filter((qb) => qb.subjectSlug === subject.slug)
                .map((qb) => (
                  <QuestionBankCard key={qb.id} qb={qb} />
                ))}
            </ResourceGrid>
          )}
          {tab === "past-papers" && (
            <ResourceGrid empty={<EmptyState title="No past papers yet" description="Past papers are coming soon." />}>
              {db.pastPapers
                .filter((p) => p.subjectSlug === subject.slug)
                .map((paper) => (
                  <PastPaperCard key={paper.id} paper={paper} />
                ))}
            </ResourceGrid>
          )}
          {tab === "mcqs" && <McqTab subject={subject} mcqs={mcqs} />}
          {tab === "assignments" && <AssignmentsTab assignments={assignments} />}
          {tab === "videos" && <VideosTab subject={subject} videos={videos} />}
          {tab === "downloads" && <DownloadsTab subject={subject} downloads={downloads} />}

          <div className="mt-16">
            <h2 className="mb-6 font-display text-xl font-bold md:text-2xl">Related subjects</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((s) => (
                <SubjectCard key={s.id} subject={s} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ResourceGrid({ children, empty }: { children: React.ReactNode; empty: React.ReactNode }) {
  return (
    <div>
      {Children.count(children) > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
      ) : (
        empty
      )}
    </div>
  );
}

function OverviewTab({ subject }: { subject: NonNullable<ReturnType<typeof useSubject>["data"]> }) {
  const statItems = [
    { label: "Units", value: subject.units.length },
    { label: "Syllabus hours", value: subject.syllabus.reduce((a, s) => a + s.hours, 0) },
    { label: "Notes", value: subject.notes },
    { label: "Books", value: subject.books },
    { label: "Question banks", value: subject.questionBanks },
    { label: "Past papers", value: subject.pastPapers },
    { label: "MCQs", value: subject.mcqs },
    { label: "Videos", value: subject.videos },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <h2 className="font-display text-xl font-bold">About this subject</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">{subject.overview}</p>

        <h3 className="mt-8 font-display text-lg font-bold">Units covered</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {subject.units.map((unit) => (
            <span key={unit} className="rounded-lg border bg-card px-3 py-1.5 text-sm font-medium">
              {unit}
            </span>
          ))}
        </div>

        <h3 className="mt-8 font-display text-lg font-bold">What to expect</h3>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            Exam-pattern practice from the most repeated questions of the last decade.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            Step-by-step solutions so you learn the method, not just the answer.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            Timed mock tests mirroring the exact paper structure and marking scheme.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            Progress tracking synced to your dashboard and study streak.
          </li>
        </ul>
      </div>
      <div className="space-y-4">
        <Card className="p-5">
          <h4 className="text-sm font-semibold">Subject stats</h4>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {statItems.map((item) => (
              <div key={item.label} className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="font-display text-lg font-bold">{item.value}</p>
                <p className="text-[10px] text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h4 className="text-sm font-semibold">Popularity</h4>
          <div className="mt-3 flex items-center gap-3">
            <Progress value={subject.popularity} className="flex-1" />
            <span className="text-sm font-bold text-primary">{subject.popularity}%</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Based on active learners this month.
          </p>
        </Card>
      </div>
    </div>
  );
}

function SyllabusTab({ subject }: { subject: NonNullable<ReturnType<typeof useSubject>["data"]> }) {
  const totalHours = subject.syllabus.reduce((a, s) => a + s.hours, 0);
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between rounded-xl border bg-card px-5 py-4">
        <p className="text-sm font-medium">Total syllabus hours</p>
        <span className="font-display text-lg font-bold">{totalHours}h</span>
      </div>
      {subject.syllabus.map((unit, i) => (
        <Card key={unit.unit} className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-gradient font-display text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="font-semibold">{unit.unit}</h3>
            </div>
            <Badge variant="secondary">{unit.hours}h</Badge>
          </div>
          <ul className="mt-4 grid gap-2 pl-0 sm:grid-cols-2">
            {unit.topics.map((topic) => (
              <li key={topic} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                {topic}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}

type Mcq = { id: number; question: string; options: string[]; answer: number };

function generateMcqs(subjectName: string): Mcq[] {
  return [
    { id: 1, question: `Which of the following best describes a key concept in ${subjectName}?`, options: ["Option A", "Option B", "Option C", "Option D"], answer: 1 },
    { id: 2, question: `Identify the correct statement about ${subjectName} fundamentals.`, options: ["Statement 1", "Statement 2", "Statement 3", "Statement 4"], answer: 2 },
    { id: 3, question: `In ${subjectName}, which result is most commonly tested in board exams?`, options: ["Result 1", "Result 2", "Result 3", "Result 4"], answer: 0 },
    { id: 4, question: `Which formula is used to solve a standard problem in ${subjectName}?`, options: ["Formula A", "Formula B", "Formula C", "Formula D"], answer: 3 },
    { id: 5, question: `A classic exam question on ${subjectName} would most likely involve:`, options: ["Concept 1", "Concept 2", "Concept 3", "Concept 4"], answer: 1 },
  ];
}

function McqTab({ subject, mcqs }: { subject: NonNullable<ReturnType<typeof useSubject>["data"]>; mcqs: Mcq[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const score = mcqs.filter((m) => answers[m.id] === m.answer).length;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between rounded-xl border bg-card px-5 py-4">
        <div>
          <p className="text-sm font-medium">Practice MCQs</p>
          <p className="text-xs text-muted-foreground">
            {Object.keys(answers).length}/{mcqs.length} answered · Score: {score}/{mcqs.length}
          </p>
        </div>
        <Badge variant="gradient">{subject.mcqs}+ in full bank</Badge>
      </div>
      <div className="space-y-4">
        {mcqs.map((mcq) => (
          <Card key={mcq.id} className="p-5">
            <p className="text-sm font-medium">
              {mcq.id}. {mcq.question}
            </p>
            <div className="mt-3 space-y-2">
              {mcq.options.map((opt, idx) => {
                const selected = answers[mcq.id];
                const isCorrect = idx === mcq.answer;
                const isSelected = selected === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setAnswers((a) => ({ ...a, [mcq.id]: idx }))}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors",
                      selected === undefined && "hover:border-primary/50 hover:bg-primary/5",
                      isSelected && !isCorrect && "border-destructive bg-destructive/5 text-destructive",
                      isSelected && isCorrect && "border-success bg-success/5 text-success",
                      selected !== undefined && isCorrect && "border-success bg-success/5 text-success",
                      selected !== undefined && !isSelected && "opacity-50"
                    )}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {answers[mcq.id] !== undefined && (
              <p className={cn("mt-3 text-xs", answers[mcq.id] === mcq.answer ? "text-success" : "text-destructive")}>
                {answers[mcq.id] === mcq.answer
                  ? "Correct! Great job."
                  : `Incorrect. The correct answer is ${String.fromCharCode(65 + mcq.answer)}.`}
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

type Video = { id: number; title: string; duration: string; views: string; topic: string };

function generateVideos(subject: NonNullable<ReturnType<typeof useSubject>["data"]>): Video[] {
  return subject.units.slice(0, 4).map((unit, i) => ({
    id: i + 1,
    title: `${subject.name} — ${unit}: Concept + Solved Examples`,
    duration: `${18 + i * 4} min`,
    views: `${(8 + i * 3)}k`,
    topic: unit,
  }));
}

function VideosTab({ subject, videos }: { subject: NonNullable<ReturnType<typeof useSubject>["data"]>; videos: Video[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {videos.map((video) => (
        <Card key={video.id} className="group overflow-hidden transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover">
          <div className={cn("relative flex aspect-video items-center justify-center bg-gradient-to-br", subject.gradient)}>
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm transition-transform group-hover:scale-110">
              <PlayCircle className="h-7 w-7 text-white" />
            </span>
            <span className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
              {video.duration}
            </span>
          </div>
          <div className="p-4">
            <p className="text-xs font-medium text-primary">{video.topic}</p>
            <h3 className="mt-1 line-clamp-2 text-sm font-semibold">{video.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{video.views} views</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

type Assignment = { id: number; title: string; due: string; questions: number; difficulty: string };

function generateAssignments(subject: NonNullable<ReturnType<typeof useSubject>["data"]>): Assignment[] {
  return subject.units.slice(0, 4).map((unit, i) => ({
    id: i + 1,
    title: `${unit} — Practice Assignment`,
    due: `Week ${i + 2}`,
    questions: 12 + i * 4,
    difficulty: ["Easy", "Medium", "Hard"][i % 3],
  }));
}

function AssignmentsTab({ assignments }: { assignments: Assignment[] }) {
  const [done, setDone] = useState<Record<number, boolean>>({});
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {assignments.map((a) => (
        <Card key={a.id} className={cn("flex items-center gap-4 p-5 transition-colors", done[a.id] && "border-success/50 bg-success/5")}>
          <input
            type="checkbox"
            checked={!!done[a.id]}
            onChange={() => setDone((d) => ({ ...d, [a.id]: !d[a.id] }))}
            className="h-4 w-4 rounded border-primary accent-primary"
          />
          <div className="min-w-0 flex-1">
            <p className={cn("font-medium", done[a.id] && "line-through opacity-60")}>{a.title}</p>
            <p className="text-xs text-muted-foreground">{a.questions} questions · {a.difficulty} · Due {a.due}</p>
          </div>
          <Badge variant="outline">{a.questions} Qs</Badge>
        </Card>
      ))}
    </div>
  );
}

type DownloadItem = { name: string; size: string; type: string; downloads: number };

function generateDownloads(subject: NonNullable<ReturnType<typeof useSubject>["data"]>): DownloadItem[] {
  return [
    { name: `${subject.name} — Full Syllabus (PDF)`, size: "1.2 MB", type: "PDF", downloads: subject.downloads },
    { name: `${subject.name} — Formula & Key Points Sheet`, size: "0.8 MB", type: "PDF", downloads: Math.round(subject.downloads * 0.8) },
    { name: `${subject.name} — Unit-wise Question Bank`, size: "2.4 MB", type: "PDF", downloads: Math.round(subject.downloads * 0.6) },
    { name: `${subject.name} — Last 5 Years Papers (Solved)`, size: "3.1 MB", type: "PDF", downloads: Math.round(subject.downloads * 0.5) },
    { name: `${subject.name} — Mock Test Set (Timed)`, size: "1.9 MB", type: "PDF", downloads: Math.round(subject.downloads * 0.4) },
  ];
}

function DownloadsTab({ subject, downloads }: { subject: NonNullable<ReturnType<typeof useSubject>["data"]>; downloads: DownloadItem[] }) {
  const [downloaded, setDownloaded] = useState<Record<number, boolean>>({});

  const handle = (id: number) => {
    setDownloaded((d) => ({ ...d, [id]: true }));
    toast.success("Download started", { description: "Your file will be ready in a moment (mock)." });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      <Card className="flex items-center gap-4 p-5">
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white", subject.gradient)}>
          <Download className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Complete {subject.name} package</p>
          <p className="text-xs text-muted-foreground">
            {subject.notes} notes · {subject.questionBanks} question banks · {subject.pastPapers} past papers
          </p>
        </div>
        <Button variant="gradient" size="sm" onClick={() => handle(0)}>
          {downloaded[0] ? "Downloading..." : "Download all"}
        </Button>
      </Card>
      {downloads.map((item, i) => (
        <Card key={item.name} className="flex items-center gap-4 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-[10px] font-bold text-destructive">
            {item.type}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.size} · {formatNumber(item.downloads)} downloads</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => handle(i + 1)}>
            <Download className="h-4 w-4" />
            {downloaded[i + 1] ? "Done" : "Download"}
          </Button>
        </Card>
      ))}
    </div>
  );
}
