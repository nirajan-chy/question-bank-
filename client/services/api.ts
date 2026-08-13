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
  Scholarship,
  Notice,
  ResultEntry,
  Faq,
  Post,
  CommunityQuestion,
  Community,
  CommunityMessage,
  MessageAttachment,
  LeaderboardEntry,
  User,
  AuthResponse,
  AdminStats,
  UserStats,
  ContactSubmission,
  ResourceMeta,
  RagDocument,
  RagSource,
  RagAnswer,
  RagMessage,
  McqGenerateRequest,
  McqQuiz,
  McqResult,
} from "@/types";

import { http, httpForm, httpUpload, getAuthToken, BASE_URL } from "./http";

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
  mockTests: (opts?: { limit?: number; subjectSlug?: string }) =>
    http<MockTest[]>(withQuery("/mock-tests", opts)),
  scholarships: (opts?: { limit?: number; featured?: boolean }) =>
    http<Scholarship[]>(withQuery("/scholarships", opts)),
  notices: (opts?: { limit?: number }) => http<Notice[]>(withQuery("/notices", opts)),
  results: () => http<ResultEntry[]>("/results"),
  faqs: () => http<Faq[]>("/faqs"),

  posts: (opts?: { limit?: number }) => http<Post[]>(withQuery("/posts", opts)),
  post: (slug: string) => http<Post>(`/posts/${slug}`),

  community: () => http<CommunityQuestion[]>("/community"),
  askQuestion: (payload: { title: string; body: string; tags: string[]; author?: string }) =>
    http<CommunityQuestion>("/community", { method: "POST", body: JSON.stringify(payload) }),

  communities: () => http<Community[]>("/communities"),
  communityMessages: (communityId: string, channelId: string) =>
    http<CommunityMessage[]>(`/communities/${communityId}/messages?channel=${encodeURIComponent(channelId)}`),
  sendCommunityMessage: (
    communityId: string,
    channelId: string,
    payload: { author: string; role?: string; content: string; attachment?: MessageAttachment | null }
  ) =>
    http<CommunityMessage>(`/communities/${communityId}/messages`, {
      method: "POST",
      body: JSON.stringify({ ...payload, channelId }),
    }),
  reactToMessage: (messageId: string, emoji: string) =>
    http<CommunityMessage>(`/communities/messages/${messageId}/reactions`, {
      method: "POST",
      body: JSON.stringify({ emoji }),
    }),

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
  userStats: () => http<UserStats>("/admin/user-stats"),
  meta: (resource: string) => http<ResourceMeta>(`/admin/meta/${resource}`),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return httpUpload<{ url: string; filename: string; size: number; mimeType: string }>(
      "/admin/upload",
      formData
    );
  },
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

export const learn = {
  documents: () => http<RagDocument[]>("/rag/documents"),
  uploadDocument: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return httpForm<RagDocument>("/rag/documents", form);
  },
  deleteDocument: (id: string) => http<null>(`/rag/documents/${id}`, { method: "DELETE" }),

  chatHistory: (limit = 50) => http<RagMessage[]>(`/rag/chat/history?limit=${limit}`),
  ask: (question: string, documentIds?: string[] | null) =>
    http<RagAnswer>("/rag/chat", {
      method: "POST",
      body: JSON.stringify({ question, document_ids: documentIds ?? null, history: null }),
    }),

  mcqGenerate: (payload: McqGenerateRequest) =>
    http<McqQuiz>("/rag/mcq/generate", { method: "POST", body: JSON.stringify(payload) }),
  mcq: (id: string) => http<McqQuiz>(`/rag/mcq/${id}`),
  mcqSubmit: (id: string, answers: number[]) =>
    http<McqResult>(`/rag/mcq/${id}/submit`, { method: "POST", body: JSON.stringify({ answers }) }),
};

export type ChatStreamEvent =
  | { type: "meta"; data: { question: string } }
  | { type: "delta"; data: { text: string } }
  | { type: "sources"; data: { sources: RagSource[] } }
  | { type: "error"; data: { message: string } }
  | { type: "done"; data: Record<string, never> };

/** Stream a chat answer from the RAG service through the Express SSE proxy. */
export async function streamChat(
  question: string,
  documentIds: string[] | null,
  onEvent: (event: ChatStreamEvent) => void,
  signal?: AbortSignal
): Promise<void> {
  const headers = new Headers({ "Content-Type": "application/json" });
  const token = getAuthToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${BASE_URL}/rag/chat/stream`, {
    method: "POST",
    headers,
    body: JSON.stringify({ question, document_ids: documentIds, history: null }),
    signal,
  });

  if (!res.ok || !res.body) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body?.message ?? message;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const parse = () => {
    let boundary: number;
    while ((boundary = buffer.indexOf("\n\n")) !== -1) {
      const block = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      const lines = block.split("\n");
      const event = lines.find((l) => l.startsWith("event:"))?.slice(6).trim() ?? "message";
      const data = lines.find((l) => l.startsWith("data:"))?.slice(5).trim();
      if (!data) continue;
      try {
        onEvent({ type: event as ChatStreamEvent["type"], data: JSON.parse(data) } as ChatStreamEvent);
      } catch {
        // ignore malformed frames
      }
    }
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    parse();
  }
  parse();
}

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
