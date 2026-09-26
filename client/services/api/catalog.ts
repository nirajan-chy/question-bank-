import type {
  Level,
  University,
  Faculty,
  Course,
  Semester,
  Subject,
  Note,
  Book,
  QuestionBank,
  PastPaper,
  MockTest,
  MockTestResult,
  Scholarship,
  Notice,
  ResultEntry,
  Faq,
  Post,
  LeaderboardEntry,
  CommunityQuestion,
} from "@/types";

import { http, withQuery } from "../http";

export type SearchResults = {
  subjects: Subject[];
  notes: Note[];
  books: Book[];
  questionBanks: QuestionBank[];
  mockTests: MockTest[];
  scholarships: Scholarship[];
  posts: Post[];
  community: CommunityQuestion[];
};

/** Query options shared by every resource collection. */
export type ListOptions = {
  limit?: number;
  /** Server-side `ILIKE` search across the resource's text columns. */
  search?: string;
};

export type SubjectScopedOptions = ListOptions & {
  subjectSlug?: string;
};

/**
 * Public read API.
 *
 * Filters that the Express layer supports (`limit`, `search`, `subjectSlug`,
 * `courseSlug`, `featured`, `bestseller`) are pushed to the server so we never
 * download a whole table just to discard most of it in the browser.
 */
export const catalog = {
  levels: (opts?: ListOptions) => http<Level[]>(withQuery("/levels", opts)),
  level: (slug: string) => http<Level>(`/levels/${slug}`),

  universities: (opts?: ListOptions) => http<University[]>(withQuery("/universities", opts)),
  university: (slug: string) => http<University>(`/universities/${slug}`),

  faculties: (opts?: ListOptions) => http<Faculty[]>(withQuery("/faculties", opts)),
  faculty: (slug: string) => http<Faculty>(`/faculties/${slug}`),

  courses: (opts?: ListOptions) => http<Course[]>(withQuery("/courses", opts)),
  course: (slug: string) => http<Course>(`/courses/${slug}`),
  coursesByLevel: (levelSlug: string) => http<Course[]>(`/courses/level/${levelSlug}`),

  semesters: (opts?: ListOptions) => http<Semester[]>(withQuery("/semesters", opts)),
  semestersByCourse: (courseSlug: string) => http<Semester[]>(`/semesters/course/${courseSlug}`),

  subjects: (opts?: ListOptions) => http<Subject[]>(withQuery("/subjects", opts)),
  subject: (slug: string) => http<Subject>(`/subjects/${slug}`),
  subjectsByLevel: (levelSlug: string) => http<Subject[]>(`/subjects/level/${levelSlug}`),
  subjectsByCourse: (courseSlug: string) => http<Subject[]>(`/subjects/course/${courseSlug}`),
  subjectsByCourseSemester: (courseSlug: string, semester: number) =>
    http<Subject[]>(`/subjects/course/${courseSlug}/semester/${semester}`),
  trendingSubjects: (limit = 8) => http<Subject[]>(`/subjects/trending?limit=${limit}`),

  notes: (opts?: SubjectScopedOptions) => http<Note[]>(withQuery("/notes", opts)),
  books: (opts?: ListOptions & { bestseller?: boolean }) =>
    http<Book[]>(withQuery("/books", opts)),
  questionBanks: (opts?: SubjectScopedOptions) =>
    http<QuestionBank[]>(withQuery("/question-banks", opts)),
  pastPapers: (opts?: SubjectScopedOptions & { courseSlug?: string }) =>
    http<PastPaper[]>(withQuery("/past-papers", opts)),
  pastPaper: (slug: string) => http<PastPaper>(`/past-papers/${slug}`),
  mockTests: (opts?: SubjectScopedOptions) => http<MockTest[]>(withQuery("/mock-tests", opts)),
  mockTest: (slug: string) => http<MockTest>(`/mock-tests/${slug}`),
  submitMockTest: (slug: string, answers: Record<string, number>) =>
    http<MockTestResult>("/mock-tests/submit", {
      method: "POST",
      body: JSON.stringify({ slug, answers }),
    }),

  scholarships: (opts?: ListOptions & { featured?: boolean }) =>
    http<Scholarship[]>(withQuery("/scholarships", opts)),
  notices: (opts?: ListOptions) => http<Notice[]>(withQuery("/notices", opts)),
  results: (opts?: ListOptions) => http<ResultEntry[]>(withQuery("/results", opts)),
  faqs: (opts?: ListOptions) => http<Faq[]>(withQuery("/faqs", opts)),

  posts: (opts?: ListOptions) => http<Post[]>(withQuery("/posts", opts)),
  post: (slug: string) => http<Post>(`/posts/${slug}`),

  leaderboard: (opts?: ListOptions) => http<LeaderboardEntry[]>(withQuery("/leaderboard", opts)),

  search: (q: string) => http<SearchResults>(`/search?q=${encodeURIComponent(q)}`),
};
