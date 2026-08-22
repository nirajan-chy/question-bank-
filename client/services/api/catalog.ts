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

import { http } from "../http";

type SearchResults = {
  subjects: Subject[];
  notes: Note[];
  books: Book[];
  questionBanks: QuestionBank[];
  mockTests: MockTest[];
  scholarships: Scholarship[];
  posts: Post[];
  community: CommunityQuestion[];
};

export type { SearchResults };

export const catalog = {
  levels: () => http<Level[]>("/levels"),
  universities: () => http<University[]>("/universities"),
  faculties: () => http<Faculty[]>("/faculties"),
  courses: () => http<Course[]>("/courses"),
  course: (slug: string) => http<Course>(`/courses/${slug}`),
  coursesByLevel: (levelSlug: string) => http<Course[]>(`/courses/level/${levelSlug}`),
  semesters: () => http<Semester[]>("/semesters"),
  semestersByCourse: (courseSlug: string) => http<Semester[]>(`/semesters/course/${courseSlug}`),
  subjects: () => http<Subject[]>("/subjects"),
  subject: (slug: string) => http<Subject>(`/subjects/${slug}`),
  subjectsByLevel: (levelSlug: string) => http<Subject[]>(`/subjects/level/${levelSlug}`),
  subjectsByCourse: (courseSlug: string) => http<Subject[]>(`/subjects/course/${courseSlug}`),
  subjectsByCourseSemester: (courseSlug: string, semester: number) =>
    http<Subject[]>(`/subjects/course/${courseSlug}/semester/${semester}`),
  trendingSubjects: (limit = 8) => http<Subject[]>(`/subjects/trending?limit=${limit}`),

  notes: (opts?: { limit?: number; subjectSlug?: string }) =>
    http<Note[]>(withQuery("/notes", opts)),
  books: (opts?: { limit?: number; bestseller?: boolean }) =>
    http<Book[]>(withQuery("/books", opts)),
  questionBanks: (opts?: { limit?: number; subjectSlug?: string }) =>
    http<QuestionBank[]>(withQuery("/question-banks", opts)),
  pastPapers: (opts?: { limit?: number; subjectSlug?: string }) =>
    http<PastPaper[]>(withQuery("/past-papers", opts)),
  pastPaper: (slug: string) => http<PastPaper>(`/past-papers/${slug}`),
  mockTests: (opts?: { limit?: number; subjectSlug?: string }) =>
    http<MockTest[]>(withQuery("/mock-tests", opts)),
  mockTest: (slug: string) => http<MockTest>(`/mock-tests/${slug}`),
  submitMockTest: (slug: string, answers: Record<string, number>) =>
    http<MockTestResult>("/mock-tests/submit", {
      method: "POST",
      body: JSON.stringify({ slug, answers }),
    }),
  scholarships: (opts?: { limit?: number; featured?: boolean }) =>
    http<Scholarship[]>(withQuery("/scholarships", opts)),
  notices: (opts?: { limit?: number }) => http<Notice[]>(withQuery("/notices", opts)),
  results: () => http<ResultEntry[]>("/results"),
  faqs: () => http<Faq[]>("/faqs"),

  posts: (opts?: { limit?: number }) => http<Post[]>(withQuery("/posts", opts)),
  post: (slug: string) => http<Post>(`/posts/${slug}`),

  leaderboard: () => http<LeaderboardEntry[]>("/leaderboard"),
  search: (query: string) => http<SearchResults>(`/search?q=${encodeURIComponent(query)}`),
};

export const stats = {
  resources: 30,
  students: 128000,
  colleges: 560,
  questionsSolved: 2400000,
};

export function withQuery(
  path: string,
  opts?: Record<string, string | number | boolean | undefined>
): string {
  if (!opts) return path;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(opts)) {
    if (value === undefined || value === false) continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}
