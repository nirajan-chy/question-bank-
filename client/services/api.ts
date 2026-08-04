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
  Testimonial,
  Faq,
  Post,
  CommunityQuestion,
  LeaderboardEntry,
  User,
  AuthResponse,
  AdminStats,
  ContactSubmission,
  ResourceMeta,
} from "@/types";

import { http } from "./http";

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

export const api = {
  levels: () => http<Level[]>("/levels"),
  universities: () => http<University[]>("/universities"),
  faculties: () => http<Faculty[]>("/faculties"),
  subjects: () => http<Subject[]>("/subjects"),
  subject: (slug: string) => http<Subject>(`/subjects/${slug}`),
  subjectsByLevel: (levelSlug: string) => http<Subject[]>(`/subjects/level/${levelSlug}`),
  trendingSubjects: (limit = 8) => http<Subject[]>(`/subjects/trending?limit=${limit}`),

  notes: (opts?: { limit?: number; subjectSlug?: string }) =>
    http<Note[]>(withQuery("/notes", opts)),
  books: (opts?: { limit?: number; bestseller?: boolean }) =>
    http<Book[]>(withQuery("/books", opts)),
  questionBanks: (opts?: { limit?: number; subjectSlug?: string }) =>
    http<QuestionBank[]>(withQuery("/question-banks", opts)),
  pastPapers: (opts?: { limit?: number; subjectSlug?: string }) =>
    http<PastPaper[]>(withQuery("/past-papers", opts)),
  mockTests: (opts?: { limit?: number; subjectSlug?: string }) =>
    http<MockTest[]>(withQuery("/mock-tests", opts)),
  scholarships: (opts?: { limit?: number; featured?: boolean }) =>
    http<Scholarship[]>(withQuery("/scholarships", opts)),
  notices: (opts?: { limit?: number }) => http<Notice[]>(withQuery("/notices", opts)),
  results: () => http<ResultEntry[]>("/results"),
  testimonials: () => http<Testimonial[]>("/testimonials"),
  faqs: () => http<Faq[]>("/faqs"),

  posts: (opts?: { limit?: number }) => http<Post[]>(withQuery("/posts", opts)),
  post: (slug: string) => http<Post>(`/posts/${slug}`),

  community: () => http<CommunityQuestion[]>("/community"),
  askQuestion: (payload: { title: string; body: string; tags: string[]; author?: string }) =>
    http<CommunityQuestion>("/community", { method: "POST", body: JSON.stringify(payload) }),

  leaderboard: () => http<LeaderboardEntry[]>("/leaderboard"),
  search: (query: string) => http<SearchResults>(`/search?q=${encodeURIComponent(query)}`),
};

export const stats = {
  resources: 30,
  students: 128000,
  colleges: 560,
  questionsSolved: 2400000,
};

export const auth = {
  login: (email: string, password: string) =>
    http<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) =>
    http<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),
  me: () => http<User>("/auth/me"),
};

type AdminResourceRecord = Record<string, unknown>;

export const admin = {
  stats: () => http<AdminStats>("/admin/stats"),
  meta: (resource: string) => http<ResourceMeta>(`/admin/meta/${resource}`),
  users: () => http<User[]>("/admin/users"),
  updateUser: (id: string, patch: Partial<Pick<User, "name" | "role" | "avatar" | "bio">> & { password?: string }) =>
    http<User>(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(patch) }),
  deleteUser: (id: string) =>
    http<null>(`/admin/users/${id}`, { method: "DELETE" }),

  list: (resource: string) => http<AdminResourceRecord[]>(`/admin/${resource}`),
  create: (resource: string, data: AdminResourceRecord) =>
    http<AdminResourceRecord>(`/admin/${resource}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (resource: string, id: string, data: AdminResourceRecord) =>
    http<AdminResourceRecord>(`/admin/${resource}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (resource: string, id: string) =>
    http<null>(`/admin/${resource}/${id}`, { method: "DELETE" }),
};

export const adminContacts = () => http<ContactSubmission[]>("/admin/contacts");

function withQuery(
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
