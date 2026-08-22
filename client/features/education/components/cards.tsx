import Link from "next/link";
import { ArrowUpRight, BookOpen, FileQuestion, FileText, Flame, PlayCircle, Star, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { gradientFor } from "@/lib/gradients";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookmarkButton } from "@/components/shared/bookmark-button";
import type {
  Subject,
  Note,
  Book,
  QuestionBank,
  PastPaper,
  MockTest,
  Scholarship,
  Notice,
  ResultEntry,
} from "@/types";
import { formatDate, formatNumber, resolveFileUrl } from "@/lib/utils";

export function LevelCard({
  name,
  slug,
  description,
  badge,
  subjects,
  gradient = "from-indigo-600 via-violet-600 to-fuchsia-600",
}: {
  name: string;
  slug: string;
  short: string;
  description: string;
  badge?: string;
  subjects: string[];
  gradient?: string;
}) {
  return (
    <Link href={`/classes/${slug}`}>
      <Card className="group h-full overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover">
        <div className={cn("mb-5 h-1.5 w-12 rounded-full bg-gradient-to-r", gradient)} />
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-bold">{name}</h3>
            {badge && (
              <span
                className={cn(
                  "mt-1.5 inline-flex items-center rounded-full bg-gradient-to-r px-2.5 py-0.5 text-[10px] font-semibold text-white",
                  gradient
                )}
              >
                {badge}
              </span>
            )}
          </div>
          <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {subjects.slice(0, 3).map((s) => (
            <span key={s} className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              {s}
            </span>
          ))}
          {subjects.length > 3 && (
            <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              +{subjects.length - 3}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}

export function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <Link href={`/subjects/${subject.slug}`}>
      <Card className="group relative h-full overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover">
        <div className="flex items-start justify-between">
          <span
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-xl text-white shadow-sm",
              gradientFor(subject.name)
            )}
          >
            {subject.emoji}
          </span>
          {subject.trending && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-600 dark:text-orange-400">
              <Flame className="h-3 w-3" /> Trending
            </span>
          )}
        </div>
        <h3 className="mt-4 font-semibold">{subject.name}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{subject.level}</p>
        <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><FileQuestion className="h-3 w-3" /> {subject.questionBanks} Q banks</span>
          <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {subject.pastPapers} papers</span>
          <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {subject.notes} notes</span>
          <span className="flex items-center gap-1"><PlayCircle className="h-3 w-3" /> {subject.videos} videos</span>
        </div>
      </Card>
    </Link>
  );
}

export function NoteCard({ note }: { note: Note }) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <Badge variant="secondary" className="font-medium">{note.level}</Badge>
        <BookmarkButton
          item={{
            id: note.id,
            type: "note",
            title: note.title,
            subtitle: `${note.subjectName} · ${note.author}`,
            href: `/subjects/${note.subjectSlug}?tab=notes`,
            savedAt: new Date().toISOString(),
            icon: "note",
          }}
        />
      </div>
      <h3 className="mt-3 line-clamp-2 font-semibold leading-snug group-hover:text-primary">{note.title}</h3>
      <p className="mt-2 line-clamp-2 flex-1 text-xs text-muted-foreground">{note.description}</p>
      {note.pdfUrl && (
        <a
          href={resolveFileUrl(note.pdfUrl)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
        >
          <FileText className="h-3.5 w-3.5" /> Open PDF
        </a>
      )}
      <div className="mt-4 flex items-center justify-between border-t pt-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {note.rating}</span>
        <span>{formatNumber(note.downloads)} downloads</span>
        <span className="truncate">{note.author}</span>
      </div>
    </>
  );

  const cardClass = "group flex h-full flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover";

  return note.pdfUrl ? (
    <Card className={cn(cardClass, "cursor-pointer")} onClick={() => window.open(resolveFileUrl(note.pdfUrl), "_blank")}>
      {inner}
    </Card>
  ) : (
    <Link href={`/subjects/${note.subjectSlug}?tab=notes`}>
      <Card className={cardClass}>{inner}</Card>
    </Link>
  );
}

export function BookCard({ book }: { book: Book }) {
  return (
    <Link href="/books">
      <Card className="group h-full p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover">
        <div className="flex gap-4">
          <div className={cn(
            "relative flex h-24 w-[4.5rem] shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-2xl text-white shadow-md",
            book.cover === "maths" && "from-indigo-500 to-violet-600",
            book.cover === "science" && "from-sky-500 to-cyan-600",
            book.cover === "physics" && "from-blue-500 to-indigo-600",
            book.cover === "chemistry" && "from-emerald-500 to-green-600",
            book.cover === "csit" && "from-fuchsia-500 to-purple-600",
            book.cover === "nepali" && "from-rose-500 to-red-600",
            book.cover === "management" && "from-stone-500 to-zinc-600",
            book.cover === "english" && "from-teal-500 to-emerald-600",
            book.cover === "economics" && "from-lime-500 to-green-600",
            book.cover === "social" && "from-amber-500 to-orange-600",
            book.cover === "nursing" && "from-pink-500 to-rose-600",
            book.cover === "default" && "from-slate-500 to-slate-700"
          )}>
            {book.title.split(" ")[0][0]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="secondary">{book.level}</Badge>
              {book.bestseller && <Badge variant="warning">Bestseller</Badge>}
            </div>
            <h3 className="mt-2 line-clamp-1 font-semibold group-hover:text-primary">{book.title}</h3>
            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{book.author}</p>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {book.rating}</span>
              <span>{book.pages} pages</span>
            </div>
            <p className="mt-1.5 text-sm font-semibold text-primary">Rs. {book.price}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function QuestionBankCard({ qb }: { qb: QuestionBank }) {
  const inner = (
    <>
      <div className="flex items-start justify-between">
        <Badge variant="secondary">{qb.level}</Badge>
        <BookmarkButton
          item={{
            id: qb.id,
            type: "question-bank",
            title: qb.title,
            subtitle: `${qb.subjectName} · ${qb.questions} questions`,
            href: "/question-banks",
            savedAt: new Date().toISOString(),
            icon: "question-bank",
          }}
        />
      </div>
      <h3 className="mt-3 line-clamp-2 font-semibold leading-snug group-hover:text-primary">{qb.title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{qb.subjectName} · {qb.year} BS</p>
      <div className="mt-3 flex items-center gap-2">
        <Badge variant="info">{qb.questions} Qs</Badge>
        <Badge variant="default">{qb.difficulty}</Badge>
        {qb.free ? <Badge variant="success">Free</Badge> : <Badge variant="warning">Premium</Badge>}
      </div>
      {qb.pdfUrl && (
        <a
          href={resolveFileUrl(qb.pdfUrl)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
        >
          <FileText className="h-3.5 w-3.5" /> Open PDF
        </a>
      )}
      <div className="mt-4 flex items-center justify-between border-t pt-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><Timer className="h-3 w-3" /> {formatNumber(qb.attempts)} attempts</span>
        <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {qb.rating}</span>
      </div>
    </>
  );

  const cardClass = "group flex h-full flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover";

  return qb.pdfUrl ? (
    <Card className={cn(cardClass, "cursor-pointer")} onClick={() => window.open(resolveFileUrl(qb.pdfUrl), "_blank")}>
      {inner}
    </Card>
  ) : (
    <Link href="/question-banks">
      <Card className={cardClass}>{inner}</Card>
    </Link>
  );
}

export function PastPaperCard({ paper }: { paper: PastPaper }) {
  const inner = (
    <>
      <div className="flex items-start justify-between">
        <Badge variant="secondary">{paper.year} BS</Badge>
        <span className="flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
          <FileText className="h-3 w-3" /> PDF
        </span>
      </div>
      <h3 className="mt-3 line-clamp-2 font-semibold leading-snug group-hover:text-primary">{paper.title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{paper.exam}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
        <div className="rounded-md bg-muted/50 p-1.5">
          <p className="font-semibold">{paper.duration}</p>
          <p className="text-muted-foreground">Duration</p>
        </div>
        <div className="rounded-md bg-muted/50 p-1.5">
          <p className="font-semibold">{paper.fullMarks}</p>
          <p className="text-muted-foreground">Full marks</p>
        </div>
        <div className="rounded-md bg-muted/50 p-1.5">
          <p className="font-semibold">{formatNumber(paper.downloads)}</p>
          <p className="text-muted-foreground">Downloads</p>
        </div>
      </div>
    </>
  );

  const cardClass = "group flex h-full flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover";

  return (
    <Link href={paper.pdfUrl ? `/past-papers/${paper.slug}` : "/past-papers"} aria-disabled={!paper.pdfUrl}>
      <Card className={cn(cardClass, !paper.pdfUrl && "opacity-70")}>{inner}</Card>
    </Link>
  );
}

export function MockTestCard({ mock }: { mock: MockTest }) {
  return (
    <Link href={`/mock-tests/${mock.slug}`}>
      <Card className="group h-full p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover">
        <div className="flex items-start justify-between">
          <Badge variant="secondary">{mock.level}</Badge>
          {mock.premium ? <Badge variant="warning">Premium</Badge> : <Badge variant="success">Free</Badge>}
        </div>
        <h3 className="mt-3 line-clamp-2 font-semibold leading-snug group-hover:text-primary">{mock.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{mock.subjectName}</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
          <div className="rounded-md bg-muted/50 p-1.5">
            <p className="font-semibold">{mock.questions}</p>
            <p className="text-muted-foreground">Questions</p>
          </div>
          <div className="rounded-md bg-muted/50 p-1.5">
            <p className="font-semibold">{mock.durationMinutes}m</p>
            <p className="text-muted-foreground">Duration</p>
          </div>
          <div className="rounded-md bg-muted/50 p-1.5">
            <p className="font-semibold">{mock.avgScore}%</p>
            <p className="text-muted-foreground">Avg score</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function ScholarshipCard({ scholarship }: { scholarship: Scholarship }) {
  const deadline = new Date(scholarship.deadline);
  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / 86400000);

  return (
    <Link href="/scholarships">
      <Card className="group relative h-full overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover">
        <div className={cn("absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r", gradientFor(scholarship.title))} />
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-2 font-semibold leading-snug group-hover:text-primary">{scholarship.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{scholarship.provider}</p>
          </div>
          <span className={cn("shrink-0 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-bold text-white", gradientFor(scholarship.title))}>
            {scholarship.amount}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge variant="secondary">{scholarship.level}</Badge>
          <Badge variant="info">{scholarship.category}</Badge>
          <Badge variant={daysLeft > 20 ? "success" : "warning"}>
            {daysLeft > 0 ? `${daysLeft} days left` : "Closing soon"}
          </Badge>
        </div>
        <div className="mt-4 border-t pt-3 text-[11px] text-muted-foreground">
          Deadline: <span className="font-medium text-foreground">{formatDate(scholarship.deadline)}</span> · {scholarship.seats} seats
        </div>
      </Card>
    </Link>
  );
}

export function NoticeCard({ notice }: { notice: Notice }) {
  return (
    <Link href="/notices">
      <Card className="group flex h-full flex-col p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover">
        <div className="flex items-center justify-between gap-2">
          <Badge variant={notice.pinned ? "gradient" : "secondary"}>{notice.pinned ? "📌 Pinned" : notice.category}</Badge>
          <span className="text-[11px] text-muted-foreground">{formatDate(notice.date)}</span>
        </div>
        <h3 className="mt-3 line-clamp-2 font-semibold leading-snug group-hover:text-primary">{notice.title}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-xs text-muted-foreground">{notice.body}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {notice.tags.map((t) => (
            <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{t}</span>
          ))}
        </div>
      </Card>
    </Link>
  );
}

export function ResultCard({ result }: { result: ResultEntry }) {
  const passColor = result.passRate >= 85 ? "text-success" : result.passRate >= 70 ? "text-warning" : "text-destructive";
  return (
    <Card className="group h-full p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold group-hover:text-primary">{result.exam}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{result.board} · Published {formatDate(result.publishedAt)}</p>
        </div>
        <Badge variant="secondary">{result.level}</Badge>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-md bg-muted/50 p-2">
          <p className="font-display text-lg font-bold">{result.totalCandidates.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Candidates</p>
        </div>
        <div className="rounded-md bg-muted/50 p-2">
          <p className="font-display text-lg font-bold text-success">{result.passed.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Passed</p>
        </div>
        <div className="rounded-md bg-muted/50 p-2">
          <p className={cn("font-display text-lg font-bold", passColor)}>{result.passRate}%</p>
          <p className="text-[10px] text-muted-foreground">Pass rate</p>
        </div>
      </div>
    </Card>
  );
}
