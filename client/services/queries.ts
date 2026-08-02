import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

export const queryKeys = {
  levels: ["levels"] as const,
  universities: ["universities"] as const,
  faculties: ["faculties"] as const,
  subjects: ["subjects"] as const,
  subject: (slug: string) => ["subjects", slug] as const,
  subjectsByLevel: (level: string) => ["subjects", "level", level] as const,
  trendingSubjects: ["subjects", "trending"] as const,
  notes: (opts?: { limit?: number; subjectSlug?: string }) => ["notes", opts] as const,
  books: (opts?: { limit?: number }) => ["books", opts] as const,
  questionBanks: (opts?: { limit?: number; subjectSlug?: string }) =>
    ["question-banks", opts] as const,
  pastPapers: (opts?: { limit?: number; subjectSlug?: string }) => ["past-papers", opts] as const,
  mockTests: (opts?: { limit?: number; subjectSlug?: string }) => ["mock-tests", opts] as const,
  scholarships: (opts?: { limit?: number; featured?: boolean }) => ["scholarships", opts] as const,
  notices: (opts?: { limit?: number }) => ["notices", opts] as const,
  results: ["results"] as const,
  testimonials: ["testimonials"] as const,
  faqs: ["faqs"] as const,
  posts: (opts?: { limit?: number }) => ["posts", opts] as const,
  post: (slug: string) => ["posts", slug] as const,
  community: ["community"] as const,
  leaderboard: ["leaderboard"] as const,
  search: (q: string) => ["search", q] as const,
};

export const useLevels = () => useQuery({ queryKey: queryKeys.levels, queryFn: api.levels });
export const useUniversities = () => useQuery({ queryKey: queryKeys.universities, queryFn: api.universities });
export const useFaculties = () => useQuery({ queryKey: queryKeys.faculties, queryFn: api.faculties });
export const useSubjects = () => useQuery({ queryKey: queryKeys.subjects, queryFn: api.subjects });
export const useSubject = (slug: string) =>
  useQuery({ queryKey: queryKeys.subject(slug), queryFn: () => api.subject(slug) });
export const useSubjectsByLevel = (level: string) =>
  useQuery({ queryKey: queryKeys.subjectsByLevel(level), queryFn: () => api.subjectsByLevel(level) });
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
export const useScholarships = (opts?: { limit?: number; featured?: boolean }) =>
  useQuery({ queryKey: queryKeys.scholarships(opts), queryFn: () => api.scholarships(opts) });
export const useNotices = (opts?: { limit?: number }) =>
  useQuery({ queryKey: queryKeys.notices(opts), queryFn: () => api.notices(opts) });
export const useResults = () => useQuery({ queryKey: queryKeys.results, queryFn: api.results });
export const useTestimonials = () => useQuery({ queryKey: queryKeys.testimonials, queryFn: api.testimonials });
export const useFaqs = () => useQuery({ queryKey: queryKeys.faqs, queryFn: api.faqs });
export const usePosts = (opts?: { limit?: number }) =>
  useQuery({ queryKey: queryKeys.posts(opts), queryFn: () => api.posts(opts) });
export const usePost = (slug: string) =>
  useQuery({ queryKey: queryKeys.post(slug), queryFn: () => api.post(slug) });
export const useCommunity = () => useQuery({ queryKey: queryKeys.community, queryFn: api.community });
export const useLeaderboard = () => useQuery({ queryKey: queryKeys.leaderboard, queryFn: api.leaderboard });
export const useSearch = (query: string) =>
  useQuery({ queryKey: queryKeys.search(query), queryFn: () => api.search(query), enabled: query.trim().length > 0 });
