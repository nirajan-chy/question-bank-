import type {
  Level,
  University,
  Faculty,
  Subject,
  Note,
  Book,
  QuestionBank,
  PastPaper,
  MockTest,
  Scholarship,
  Notice,
  ResultEntry,
  Post,
  CommunityQuestion,
  LeaderboardEntry,
} from "@/types";

import {
  db,
  getLevels,
  getUniversities,
  getFaculties,
  getSubjects,
  getSubjectBySlug,
  getSubjectsByLevel,
  getTrendingSubjects,
  getNotes,
  getBooks,
  getQuestionBanks,
  getPastPapers,
  getMockTests,
  getScholarships,
  getNotices,
  getResults,
  getPosts,
  getPostBySlug,
  getCommunityQuestions,
  getLeaderboard,
  searchAll,
} from "./db";

const latency = 250;
const jitter = () => latency + Math.random() * 200;

async function resolve<T>(data: T): Promise<T> {
  await new Promise((r) => setTimeout(r, jitter()));
  return data;
}

export const api = {
  levels: () => resolve<Level[]>(getLevels()),
  universities: () => resolve<University[]>(getUniversities()),
  faculties: () => resolve<Faculty[]>(getFaculties()),
  subjects: () => resolve<Subject[]>(getSubjects()),
  subject: (slug: string) => resolve<Subject | undefined>(getSubjectBySlug(slug)),
  subjectsByLevel: (levelSlug: string) => resolve<Subject[]>(getSubjectsByLevel(levelSlug)),
  trendingSubjects: (limit = 8) => resolve<Subject[]>(getTrendingSubjects(limit)),
  notes: (opts?: { limit?: number; subjectSlug?: string }) => resolve<Note[]>(getNotes(opts)),
  books: (opts?: { limit?: number; bestseller?: boolean }) => resolve<Book[]>(getBooks(opts)),
  questionBanks: (opts?: { limit?: number; subjectSlug?: string }) =>
    resolve<QuestionBank[]>(getQuestionBanks(opts)),
  pastPapers: (opts?: { limit?: number; subjectSlug?: string }) =>
    resolve<PastPaper[]>(getPastPapers(opts)),
  mockTests: (opts?: { limit?: number; subjectSlug?: string }) => resolve<MockTest[]>(getMockTests(opts)),
  scholarships: (opts?: { limit?: number; featured?: boolean }) =>
    resolve<Scholarship[]>(getScholarships(opts)),
  notices: (opts?: { limit?: number }) => resolve<Notice[]>(getNotices(opts)),
  results: () => resolve<ResultEntry[]>(getResults()),
  posts: (opts?: { limit?: number }) => resolve<Post[]>(getPosts(opts)),
  post: (slug: string) => resolve<Post | undefined>(getPostBySlug(slug)),
  community: () => resolve<CommunityQuestion[]>(getCommunityQuestions()),
  leaderboard: () => resolve<LeaderboardEntry[]>(getLeaderboard()),
  search: (query: string) => resolve(searchAll(query)),
};

export const stats = {
  resources: db.notes.length + db.books.length + db.questionBanks.length,
  students: 128000,
  colleges: 560,
  questionsSolved: 2400000,
};
