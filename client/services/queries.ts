import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, admin, learn } from "./api";
import type { McqGenerateRequest } from "@/types";

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
  trendingSubjects: ["subjects", "trending"] as const,
  notes: (opts?: { limit?: number; subjectSlug?: string }) => ["notes", opts] as const,
  books: (opts?: { limit?: number }) => ["books", opts] as const,
  questionBanks: (opts?: { limit?: number; subjectSlug?: string }) =>
    ["question-banks", opts] as const,
  pastPapers: (opts?: { limit?: number; subjectSlug?: string }) => ["past-papers", opts] as const,
  mockTests: (opts?: { limit?: number; subjectSlug?: string }) => ["mock-tests", opts] as const,
  mockTest: (slug: string) => ["mock-tests", slug] as const,
  scholarships: (opts?: { limit?: number; featured?: boolean }) => ["scholarships", opts] as const,
  notices: (opts?: { limit?: number }) => ["notices", opts] as const,
  results: ["results"] as const,
  faqs: ["faqs"] as const,
  posts: (opts?: { limit?: number }) => ["posts", opts] as const,
  post: (slug: string) => ["posts", slug] as const,
  community: ["community"] as const,
  communities: ["communities"] as const,
  communityMessages: (communityId: string, channelId: string) =>
    ["communities", communityId, "messages", channelId] as const,
  leaderboard: ["leaderboard"] as const,
  search: (q: string) => ["search", q] as const,
};

export const useLevels = () => useQuery({ queryKey: queryKeys.levels, queryFn: api.levels });
export const useUniversities = () => useQuery({ queryKey: queryKeys.universities, queryFn: api.universities });
export const useFaculties = () => useQuery({ queryKey: queryKeys.faculties, queryFn: api.faculties });
export const useCourses = () => useQuery({ queryKey: queryKeys.courses, queryFn: api.courses });
export const useCourse = (slug: string) =>
  useQuery({ queryKey: queryKeys.course(slug), queryFn: () => api.course(slug) });
export const useCoursesByLevel = (level: string) =>
  useQuery({ queryKey: queryKeys.coursesByLevel(level), queryFn: () => api.coursesByLevel(level) });
export const useSemestersByCourse = (courseSlug: string) =>
  useQuery({ queryKey: queryKeys.semestersByCourse(courseSlug), queryFn: () => api.semestersByCourse(courseSlug) });
export const useSubjects = () => useQuery({ queryKey: queryKeys.subjects, queryFn: api.subjects });
export const useSubject = (slug: string) =>
  useQuery({ queryKey: queryKeys.subject(slug), queryFn: () => api.subject(slug) });
export const useSubjectsByLevel = (level: string) =>
  useQuery({ queryKey: queryKeys.subjectsByLevel(level), queryFn: () => api.subjectsByLevel(level) });
export const useSubjectsByCourse = (course: string) =>
  useQuery({ queryKey: queryKeys.subjectsByCourse(course), queryFn: () => api.subjectsByCourse(course) });
export const useSubjectsByCourseSemester = (course: string, semester: number) =>
  useQuery({ queryKey: queryKeys.subjectsByCourseSemester(course, semester), queryFn: () => api.subjectsByCourseSemester(course, semester) });
export const useTrendingSubjects = (limit = 8) =>
  useQuery({ queryKey: queryKeys.trendingSubjects, queryFn: () => api.trendingSubjects(limit) });
export const useNotes = (opts?: { limit?: number; subjectSlug?: string }) =>
  useQuery({ queryKey: queryKeys.notes(opts), queryFn: () => api.notes(opts) });
export const useBooks = (opts?: { limit?: number }) =>
  useQuery({ queryKey: queryKeys.books(opts), queryFn: () => api.books(opts) });
export const useQuestionBanks = (opts?: { limit?: number; subjectSlug?: string }) =>
  useQuery({ queryKey: queryKeys.questionBanks(opts), queryFn: () => api.questionBanks(opts) });
export const usePastPapers = (opts?: { limit?: number; subjectSlug?: string }) =>
  useQuery({ queryKey: queryKeys.pastPapers(opts), queryFn: () => api.pastPapers(opts) });
export const useMockTests = (opts?: { limit?: number; subjectSlug?: string }) =>
  useQuery({ queryKey: queryKeys.mockTests(opts), queryFn: () => api.mockTests(opts) });
export const useMockTest = (slug: string) =>
  useQuery({
    queryKey: queryKeys.mockTest(slug),
    queryFn: () => api.mockTest(slug),
    enabled: Boolean(slug),
  });
export const useScholarships = (opts?: { limit?: number; featured?: boolean }) =>
  useQuery({ queryKey: queryKeys.scholarships(opts), queryFn: () => api.scholarships(opts) });
export const useNotices = (opts?: { limit?: number }) =>
  useQuery({ queryKey: queryKeys.notices(opts), queryFn: () => api.notices(opts) });
export const useResults = () => useQuery({ queryKey: queryKeys.results, queryFn: api.results });
export const useFaqs = () => useQuery({ queryKey: queryKeys.faqs, queryFn: api.faqs });
export const usePosts = (opts?: { limit?: number }) =>
  useQuery({ queryKey: queryKeys.posts(opts), queryFn: () => api.posts(opts) });
export const usePost = (slug: string) =>
  useQuery({ queryKey: queryKeys.post(slug), queryFn: () => api.post(slug) });
export const useCommunity = () => useQuery({ queryKey: queryKeys.community, queryFn: api.community });
export const useCommunities = () =>
  useQuery({ queryKey: queryKeys.communities, queryFn: api.communities });
export const useCommunityMessages = (communityId: string, channelId: string) =>
  useQuery({
    queryKey: queryKeys.communityMessages(communityId, channelId),
    queryFn: () => api.communityMessages(communityId, channelId),
    enabled: Boolean(communityId && channelId),
  });
export const useSendCommunityMessage = (communityId: string, channelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { author: string; role?: string; content: string }) =>
      api.sendCommunityMessage(communityId, channelId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.communityMessages(communityId, channelId) }),
  });
};
export const useReactToMessage = (communityId: string, channelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ messageId, emoji }: { messageId: string; emoji: string }) =>
      api.reactToMessage(messageId, emoji),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.communityMessages(communityId, channelId) }),
  });
};
export const useLeaderboard = () => useQuery({ queryKey: queryKeys.leaderboard, queryFn: api.leaderboard });
export const useSearch = (query: string) =>
  useQuery({ queryKey: queryKeys.search(query), queryFn: () => api.search(query), enabled: query.trim().length > 0 });

export const useAdminStats = () =>
  useQuery({
    queryKey: ["admin", "stats"] as const,
    queryFn: admin.stats,
    retry: false,
  });

export const useAdminUserStats = () =>
  useQuery({
    queryKey: ["admin", "user-stats"] as const,
    queryFn: admin.userStats,
    retry: false,
  });

export const useAdminResource = (resource: string, search = "") =>
  useQuery({
    queryKey: ["admin", resource, search] as const,
    queryFn: () => admin.list(resource, search),
    retry: false,
  });

export const useAdminResourceMeta = (resource: string) =>
  useQuery({
    queryKey: ["admin", resource, "meta"] as const,
    queryFn: () => admin.meta(resource),
    retry: false,
  });

export const useAdminUsers = () =>
  useQuery({
    queryKey: ["admin", "users"] as const,
    queryFn: admin.users,
    retry: false,
  });

// ─── Self Learning Center (RAG) ───────────────────────────────────────────────

export const queryKeysLearn = {
  documents: ["learn", "documents"] as const,
  chatHistory: ["learn", "chat-history"] as const,
  quiz: (id: string) => ["learn", "quiz", id] as const,
};

export const useRagDocuments = () =>
  useQuery({ queryKey: queryKeysLearn.documents, queryFn: learn.documents });

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => learn.uploadDocument(file),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeysLearn.documents }),
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => learn.deleteDocument(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeysLearn.documents }),
  });
};

export const useRagChatHistory = () =>
  useQuery({ queryKey: queryKeysLearn.chatHistory, queryFn: () => learn.chatHistory(50) });

export const useAskQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ question, documentIds }: { question: string; documentIds?: string[] | null }) =>
      learn.ask(question, documentIds ?? null),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeysLearn.chatHistory }),
  });
};

export const useMcqGenerate = () =>
  useMutation({
    mutationFn: (payload: McqGenerateRequest) => learn.mcqGenerate(payload),
  });

export const useMcq = (id: string | null) =>
  useQuery({
    queryKey: queryKeysLearn.quiz(id ?? ""),
    queryFn: () => learn.mcq(id as string),
    enabled: Boolean(id),
  });

export const useMcqSubmit = () =>
  useMutation({
    mutationFn: ({ id, answers }: { id: string; answers: number[] }) =>
      learn.mcqSubmit(id, answers),
  });
