import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api, admin, adminContacts, learn, publicForms } from "./api";
import type { ContactPayload } from "./api/public-forms";
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
  LeaderboardEntry,
  CommunityQuestion,
  Community,
  CommunityMessage,
  McqGenerateRequest,
  RagDocument,
  User,
} from "@/types";

/** Catalogue content is stable — a long stale window keeps navigation instant. */
const CONTENT_STALE_MS = 5 * 60 * 1000;

/**
 * Shared options for read-only catalogue queries.
 *
 * Deliberately *not* annotated as `Partial<UseQueryOptions>`: that generic
 * defaults `TQueryFnData` to `unknown`, and spreading it into `useQuery` makes
 * TypeScript fall back to `unknown` for `data` instead of inferring it from
 * `queryFn`. Keeping it a plain object lets inference work.
 */
const contentDefaults = {
  staleTime: CONTENT_STALE_MS,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
};

export const queryKeys = {
  levels: ["levels"] as const,
  universities: ["universities"] as const,
  faculties: ["faculties"] as const,
  courses: ["courses"] as const,
  course: (slug: string) => ["courses", slug] as const,
  coursesByLevel: (level: string) => ["courses", "level", level] as const,
  semesters: ["semesters"] as const,
  semestersByCourse: (course: string) => ["semesters", "course", course] as const,
  subjects: ["subjects"] as const,
  subject: (slug: string) => ["subjects", slug] as const,
  subjectsByLevel: (level: string) => ["subjects", "level", level] as const,
  subjectsByCourse: (course: string) => ["subjects", "course", course] as const,
  subjectsByCourseSemester: (course: string, semester: number) =>
    ["subjects", "course", course, "semester", semester] as const,
  trendingSubjects: (limit: number) => ["subjects", "trending", limit] as const,

  notes: (opts?: object) => ["notes", opts ?? {}] as const,
  books: (opts?: object) => ["books", opts ?? {}] as const,
  questionBanks: (opts?: object) => ["question-banks", opts ?? {}] as const,
  pastPapers: (opts?: object) => ["past-papers", opts ?? {}] as const,
  pastPaper: (slug: string) => ["past-papers", slug] as const,
  mockTests: (opts?: object) => ["mock-tests", opts ?? {}] as const,
  mockTest: (slug: string) => ["mock-tests", slug] as const,
  scholarships: (opts?: object) => ["scholarships", opts ?? {}] as const,
  notices: (opts?: object) => ["notices", opts ?? {}] as const,
  results: ["results"] as const,
  faqs: ["faqs"] as const,
  posts: (opts?: object) => ["posts", opts ?? {}] as const,
  post: (slug: string) => ["posts", slug] as const,
  leaderboard: ["leaderboard"] as const,
  search: (q: string) => ["search", q] as const,

  questions: ["community", "questions"] as const,
  channels: ["community", "channels"] as const,
  channelMessages: (communityId: string, channelId: string) =>
    ["community", "channels", communityId, "messages", channelId] as const,

  admin: {
    stats: ["admin", "stats"] as const,
    userStats: ["admin", "user-stats"] as const,
    users: (search = "") => ["admin", "users", search] as const,
    resource: (resource: string, search = "") => ["admin", resource, search] as const,
    meta: (resource: string) => ["admin", resource, "meta"] as const,
  },

  learn: {
    documents: ["learn", "documents"] as const,
    chatHistory: ["learn", "chat-history"] as const,
    quiz: (id: string) => ["learn", "quiz", id] as const,
  },
};

/* ─── Explorer ────────────────────────────────────────────────────────────── */

export const useLevels = () =>
  useQuery({ queryKey: queryKeys.levels, queryFn: () => api.levels(), ...contentDefaults });

export const useLevel = (slug: string) =>
  useQuery({
    queryKey: ["levels", slug],
    queryFn: () => api.level(slug),
    enabled: Boolean(slug),
    ...contentDefaults,
  });

export const useUniversities = (opts?: { limit?: number; search?: string }) =>
  useQuery({ queryKey: queryKeys.universities, queryFn: () => api.universities(opts), ...contentDefaults });

export const useUniversity = (slug: string) =>
  useQuery({
    queryKey: ["universities", slug],
    queryFn: () => api.university(slug),
    enabled: Boolean(slug),
    ...contentDefaults,
  });

export const useFaculties = () =>
  useQuery({ queryKey: queryKeys.faculties, queryFn: () => api.faculties(), ...contentDefaults });

export const useCourses = (opts?: { search?: string }) =>
  useQuery({ queryKey: queryKeys.courses, queryFn: () => api.courses(opts), ...contentDefaults });

export const useCourse = (slug: string) =>
  useQuery({
    queryKey: queryKeys.course(slug),
    queryFn: () => api.course(slug),
    enabled: Boolean(slug),
    ...contentDefaults,
  });

export const useCoursesByLevel = (level: string) =>
  useQuery({
    queryKey: queryKeys.coursesByLevel(level),
    queryFn: () => api.coursesByLevel(level),
    enabled: Boolean(level),
    ...contentDefaults,
  });

export const useSemestersByCourse = (courseSlug: string) =>
  useQuery({
    queryKey: queryKeys.semestersByCourse(courseSlug),
    queryFn: () => api.semestersByCourse(courseSlug),
    enabled: Boolean(courseSlug),
    ...contentDefaults,
  });

/* ─── Subjects ────────────────────────────────────────────────────────────── */

export const useSubjects = (opts?: { limit?: number; search?: string }) =>
  useQuery({ queryKey: queryKeys.subjects, queryFn: () => api.subjects(opts), ...contentDefaults });

export const useSubject = (slug: string) =>
  useQuery({
    queryKey: queryKeys.subject(slug),
    queryFn: () => api.subject(slug),
    enabled: Boolean(slug),
    ...contentDefaults,
  });

export const useSubjectsByLevel = (level: string) =>
  useQuery({
    queryKey: queryKeys.subjectsByLevel(level),
    queryFn: () => api.subjectsByLevel(level),
    enabled: Boolean(level),
    ...contentDefaults,
  });

export const useSubjectsByCourse = (course: string) =>
  useQuery({
    queryKey: queryKeys.subjectsByCourse(course),
    queryFn: () => api.subjectsByCourse(course),
    enabled: Boolean(course),
    ...contentDefaults,
  });

export const useSubjectsByCourseSemester = (course: string, semester: number) =>
  useQuery({
    queryKey: queryKeys.subjectsByCourseSemester(course, semester),
    queryFn: () => api.subjectsByCourseSemester(course, semester),
    enabled: Boolean(course) && Number.isFinite(semester),
    ...contentDefaults,
  });

export const useTrendingSubjects = (limit = 8) =>
<<<<<<< HEAD
  useQuery({
    queryKey: queryKeys.trendingSubjects(limit),
    queryFn: () => api.trendingSubjects(limit),
    ...contentDefaults,
  });

/* ─── Study resources ─────────────────────────────────────────────────────── */

export const useNotes = (opts?: { limit?: number; subjectSlug?: string; search?: string }) =>
  useQuery({ queryKey: queryKeys.notes(opts), queryFn: () => api.notes(opts), ...contentDefaults });

export const useBooks = (opts?: { limit?: number; bestseller?: boolean; search?: string }) =>
  useQuery({ queryKey: queryKeys.books(opts), queryFn: () => api.books(opts), ...contentDefaults });

export const useQuestionBanks = (opts?: { limit?: number; subjectSlug?: string; search?: string }) =>
  useQuery({
    queryKey: queryKeys.questionBanks(opts),
    queryFn: () => api.questionBanks(opts),
    ...contentDefaults,
  });

export const usePastPapers = (opts?: { limit?: number; subjectSlug?: string; search?: string }) =>
  useQuery({ queryKey: queryKeys.pastPapers(opts), queryFn: () => api.pastPapers(opts), ...contentDefaults });

=======
  useQuery({ queryKey: queryKeys.trendingSubjects, queryFn: () => api.trendingSubjects(limit) });
export const useNotes = (opts?: { limit?: number; subjectSlug?: string }) =>
  useQuery({ queryKey: queryKeys.notes(opts), queryFn: () => api.notes(opts) });
export const useNote = (slug: string) =>
  useQuery({
    queryKey: ["notes", slug] as const,
    queryFn: () => api.note(slug),
    enabled: Boolean(slug),
  });
export const useRelatedNotes = (slug: string) =>
  useQuery({
    queryKey: ["notes", slug, "related"] as const,
    queryFn: () => api.relatedNotes(slug),
    enabled: Boolean(slug),
  });
export const useBooks = (opts?: { limit?: number }) =>
  useQuery({ queryKey: queryKeys.books(opts), queryFn: () => api.books(opts) });
export const useQuestionBanks = (opts?: { limit?: number; subjectSlug?: string }) =>
  useQuery({ queryKey: queryKeys.questionBanks(opts), queryFn: () => api.questionBanks(opts) });
export const usePastPapers = (opts?: { limit?: number; subjectSlug?: string }) =>
  useQuery({ queryKey: queryKeys.pastPapers(opts), queryFn: () => api.pastPapers(opts) });
>>>>>>> origin/main
export const usePastPaper = (slug: string) =>
  useQuery({
    queryKey: queryKeys.pastPaper(slug),
    queryFn: () => api.pastPaper(slug),
    enabled: Boolean(slug),
    ...contentDefaults,
  });

export const useMockTests = (opts?: { limit?: number; subjectSlug?: string; search?: string }) =>
  useQuery({ queryKey: queryKeys.mockTests(opts), queryFn: () => api.mockTests(opts), ...contentDefaults });

export const useMockTest = (slug: string) =>
  useQuery({
    queryKey: queryKeys.mockTest(slug),
    queryFn: () => api.mockTest(slug),
    enabled: Boolean(slug),
    ...contentDefaults,
  });

/**
 * Submitting a test bumps `attempts`/`avgScore` on the record server-side, so
 * both the list and the detail cache have to be invalidated.
 */
export const useSubmitMockTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, answers }: { slug: string; answers: Record<string, number> }) =>
      api.submitMockTest(slug, answers),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.mockTest(variables.slug) });
      void queryClient.invalidateQueries({ queryKey: ["mock-tests"] });
    },
  });
};

/* ─── Opportunities & content ────────────────────────────────────────────── */

export const useScholarships = (opts?: { limit?: number; featured?: boolean; search?: string }) =>
  useQuery({ queryKey: queryKeys.scholarships(opts), queryFn: () => api.scholarships(opts), ...contentDefaults });

export const useNotices = (opts?: { limit?: number; search?: string }) =>
  useQuery({ queryKey: queryKeys.notices(opts), queryFn: () => api.notices(opts), ...contentDefaults });

export const useResults = () =>
  useQuery({ queryKey: queryKeys.results, queryFn: () => api.results(), ...contentDefaults });

export const useFaqs = () =>
  useQuery({ queryKey: queryKeys.faqs, queryFn: () => api.faqs(), ...contentDefaults });

export const usePosts = (opts?: { limit?: number; search?: string }) =>
  useQuery({ queryKey: queryKeys.posts(opts), queryFn: () => api.posts(opts), ...contentDefaults });

export const usePost = (slug: string) =>
  useQuery({
    queryKey: queryKeys.post(slug),
    queryFn: () => api.post(slug),
    enabled: Boolean(slug),
    ...contentDefaults,
  });

export const useLeaderboard = () =>
  useQuery({ queryKey: queryKeys.leaderboard, queryFn: () => api.leaderboard(), ...contentDefaults });

export const useSearch = (query: string) => {
  const term = query.trim();
  return useQuery({
    queryKey: queryKeys.search(term),
    queryFn: () => api.search(term),
    enabled: term.length > 0,
    staleTime: 30 * 1000,
  });
};

/* ─── Community ───────────────────────────────────────────────────────────── */

export const useCommunityQuestions = () =>
  useQuery({ queryKey: queryKeys.questions, queryFn: () => api.questions(), ...contentDefaults });

export const useAskCommunityQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.askQuestion,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.questions });
    },
  });
};

export const useAddAnswer = (questionId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    // The endpoint responds with the whole updated question, answers included.
    mutationFn: (payload: { body: string; author?: string }) =>
      api.addAnswer(questionId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.questions });
    },
  });
};

export const useChannels = () =>
  useQuery({ queryKey: queryKeys.channels, queryFn: () => api.channels(), ...contentDefaults });

/** Legacy alias: the sidebar/page still refer to "communities". */
export const useCommunity = useChannels;

export const useChannelMessages = (communityId: string, channelId: string) =>
  useQuery({
    queryKey: queryKeys.channelMessages(communityId, channelId),
    queryFn: () => api.channelMessages(communityId, channelId),
    enabled: Boolean(communityId && channelId),
  });

export const useSendMessage = (communityId: string, channelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { author: string; role?: string; content: string }) =>
      api.sendMessage(communityId, channelId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.channelMessages(communityId, channelId),
      });
    },
  });
};

export const useReactToMessage = (communityId: string, channelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ messageId, emoji }: { messageId: string; emoji: string }) =>
      api.reactToMessage(messageId, emoji),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.channelMessages(communityId, channelId),
      });
    },
  });
};

/* ─── Public forms ────────────────────────────────────────────────────────── */

export const useSubmitContact = () =>
  useMutation({ mutationFn: (payload: ContactPayload) => publicForms.contact(payload) });

/* ─── Admin ───────────────────────────────────────────────────────────────── */

export const useAdminStats = () =>
  useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: () => admin.stats(),
    retry: false,
  });

export const useAdminUserStats = () =>
  useQuery({
    queryKey: queryKeys.admin.userStats,
    queryFn: () => admin.userStats(),
    retry: false,
  });

export const useAdminResource = (resource: string, search = "") =>
  useQuery({
    queryKey: queryKeys.admin.resource(resource, search),
    queryFn: () => admin.list(resource, search),
    enabled: Boolean(resource),
    retry: false,
    placeholderData: (previous) => previous,
  });

export const useAdminResourceMeta = (resource: string) =>
  useQuery({
    queryKey: queryKeys.admin.meta(resource),
    queryFn: () => admin.meta(resource),
    enabled: Boolean(resource),
    retry: false,
    staleTime: 10 * 60 * 1000,
  });

export const useAdminUsers = (search = "") =>
  useQuery({
    queryKey: queryKeys.admin.users(search),
    queryFn: () => admin.users(search),
    retry: false,
    placeholderData: (previous) => previous,
  });

export const useAdminContacts = () =>
  useQuery({ queryKey: ["admin", "contacts"], queryFn: adminContacts, retry: false });

/* ─── Self Learning Center (RAG) ──────────────────────────────────────────── */

export const useRagDocuments = () =>
  useQuery({
    queryKey: queryKeys.learn.documents,
    queryFn: () => learn.documents(),
    // Poll only while the Python service is still embedding a file.
    refetchInterval: (query) => {
      const docs = query.state.data as RagDocument[] | undefined;
      return docs?.some((doc) => doc.status === "processing") ? 2500 : false;
    },
  });

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => learn.uploadDocument(file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.learn.documents });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => learn.deleteDocument(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.learn.documents });
    },
  });
};

export const useRagChatHistory = () =>
  useQuery({
    queryKey: queryKeys.learn.chatHistory,
    queryFn: () => learn.chatHistory(50),
    retry: false,
  });

export const useAskRagQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ question, documentIds }: { question: string; documentIds?: string[] | null }) =>
      learn.ask(question, documentIds ?? null),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.learn.chatHistory });
    },
  });
};

export const useMcqGenerate = () =>
  useMutation({ mutationFn: (payload: McqGenerateRequest) => learn.mcqGenerate(payload) });

export const useMcq = (id: string | null) =>
  useQuery({
    queryKey: queryKeys.learn.quiz(id ?? ""),
    queryFn: () => learn.mcq(id as string),
    enabled: Boolean(id),
    retry: false,
  });

export const useMcqSubmit = () =>
  useMutation({
    mutationFn: ({ id, answers }: { id: string; answers: number[] }) => learn.mcqSubmit(id, answers),
  });

/* ── Re-exported response shapes, so features never import from two places ── */
export type {
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
  LeaderboardEntry,
  CommunityQuestion,
  Community,
  CommunityMessage,
  User,
};
