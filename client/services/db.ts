import levels from "@/data/levels.json";
import universities from "@/data/universities.json";
import faculties from "@/data/faculties.json";
import courses from "@/data/courses.json";
import semesters from "@/data/semesters.json";
import subjects from "@/data/subjects.json";
import notes from "@/data/notes.json";
import books from "@/data/books.json";
import questionBanks from "@/data/question-banks.json";
import pastPapers from "@/data/past-papers.json";
import mockTests from "@/data/mock-tests.json";
import scholarships from "@/data/scholarships.json";
import notices from "@/data/notices.json";
import results from "@/data/results.json";
import testimonials from "@/data/testimonials.json";
import faq from "@/data/faq.json";
import posts from "@/data/posts.json";
import community from "@/data/community.json";
import leaderboard from "@/data/leaderboard.json";

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
  Testimonial,
  Faq,
  Post,
  CommunityQuestion,
  LeaderboardEntry,
} from "@/types";

export const db = {
  levels: levels as Level[],
  universities: universities as University[],
  faculties: faculties as Faculty[],
  courses: courses as Course[],
  semesters: semesters as Semester[],
  subjects: subjects as Subject[],
  notes: notes as Note[],
  books: books as Book[],
  questionBanks: questionBanks as QuestionBank[],
  pastPapers: pastPapers as PastPaper[],
  mockTests: mockTests as MockTest[],
  scholarships: scholarships as Scholarship[],
  notices: notices as Notice[],
  results: results as ResultEntry[],
  testimonials: testimonials as Testimonial[],
  faq: faq as Faq[],
  posts: posts as Post[],
  community: community as CommunityQuestion[],
  leaderboard: leaderboard as LeaderboardEntry[],
};

export function getLevels() {
  return db.levels;
}

export function getUniversities() {
  return db.universities;
}

export function getFaculties() {
  return db.faculties;
}

export function getCourses() {
  return db.courses;
}

export function getCourseBySlug(slug: string) {
  return db.courses.find((c) => c.slug === slug);
}

export function getCoursesByLevel(levelSlug: string) {
  return db.courses.filter((c) => c.levelSlug === levelSlug);
}

export function getSemesters() {
  return db.semesters;
}

export function getSemestersByCourse(courseSlug: string) {
  return db.semesters.filter((s) => s.courseSlug === courseSlug).sort((a, b) => a.number - b.number);
}

export function getSubjects() {
  return db.subjects;
}

export function getSubjectBySlug(slug: string) {
  return db.subjects.find((s) => s.slug === slug);
}

export function getSubjectsByLevel(levelSlug: string) {
  return db.subjects.filter((s) => s.levelSlug === levelSlug);
}

export function getSubjectsByCourse(courseSlug: string) {
  return db.subjects.filter((s) => s.courseSlug === courseSlug);
}

export function getSubjectsByCourseSemester(courseSlug: string, semester: number) {
  return db.subjects.filter((s) => s.courseSlug === courseSlug && s.semester === semester);
}

export function getTrendingSubjects(limit = 8) {
  return db.subjects
    .filter((s) => s.trending)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export function getNotes(opts?: { limit?: number; subjectSlug?: string; level?: string }) {
  let list = [...db.notes];
  if (opts?.subjectSlug) list = list.filter((n) => n.subjectSlug === opts.subjectSlug);
  if (opts?.level) list = list.filter((n) => n.level.includes(opts.level!));
  return opts?.limit ? list.slice(0, opts.limit) : list;
}

export function getBooks(opts?: { limit?: number; bestseller?: boolean }) {
  let list = [...db.books];
  if (opts?.bestseller) list = list.filter((b) => b.bestseller);
  return opts?.limit ? list.slice(0, opts.limit) : list;
}

export function getQuestionBanks(opts?: { limit?: number; subjectSlug?: string }) {
  let list = [...db.questionBanks];
  if (opts?.subjectSlug) list = list.filter((q) => q.subjectSlug === opts.subjectSlug);
  return opts?.limit ? list.slice(0, opts.limit) : list;
}

export function getPastPapers(opts?: { limit?: number; subjectSlug?: string }) {
  let list = [...db.pastPapers];
  if (opts?.subjectSlug) list = list.filter((p) => p.subjectSlug === opts.subjectSlug);
  return opts?.limit ? list.slice(0, opts.limit) : list;
}

export function getMockTests(opts?: { limit?: number; subjectSlug?: string }) {
  let list = [...db.mockTests];
  if (opts?.subjectSlug) list = list.filter((m) => m.subjectSlug === opts.subjectSlug);
  return opts?.limit ? list.slice(0, opts.limit) : list;
}

export function getScholarships(opts?: { limit?: number; featured?: boolean }) {
  let list = [...db.scholarships];
  if (opts?.featured) list = list.filter((s) => s.featured);
  return opts?.limit ? list.slice(0, opts.limit) : list;
}

export function getNotices(opts?: { limit?: number }) {
  const list = [...db.notices].sort(
    (a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return opts?.limit ? list.slice(0, opts.limit) : list;
}

export function getResults() {
  return [...db.results].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getTestimonials() {
  return db.testimonials;
}

export function getFaqs() {
  return db.faq;
}

export function getPosts(opts?: { limit?: number; category?: string }) {
  let list = [...db.posts];
  if (opts?.category) list = list.filter((p) => p.category === opts.category);
  return opts?.limit ? list.slice(0, opts.limit) : list;
}

export function getPostBySlug(slug: string) {
  return db.posts.find((p) => p.slug === slug);
}

export function getCommunityQuestions() {
  return db.community;
}

export function getCommunityQuestionBySlug(slug: string) {
  return db.community.find((q) => q.slug === slug);
}

export function getLeaderboard() {
  return [...db.leaderboard].sort((a, b) => a.rank - b.rank);
}

export function searchAll(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return { subjects: [], notes: [], books: [], questionBanks: [], mockTests: [], scholarships: [], posts: [], community: [] };

  const match = <T extends { title?: string; name?: string; description?: string; tags?: string[] }>(item: T, extra: string[] = []) => {
    const haystack = [item.title, item.name, item.description, ...(item.tags ?? []), ...extra]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  };

  return {
    subjects: db.subjects.filter((s) => match(s, [s.level, s.category, s.emoji])),
    notes: db.notes.filter((n) => match(n, [n.subjectName, n.level, n.author])),
    books: db.books.filter((b) => match(b, [b.author, b.publisher, b.level])),
    questionBanks: db.questionBanks.filter((qb) => match(qb, [qb.subjectName, qb.level])),
    mockTests: db.mockTests.filter((m) => match(m, [m.subjectName, m.level])),
    scholarships: db.scholarships.filter((s) => match(s, [s.provider, s.level, s.category])),
    posts: db.posts.filter((p) => match(p, [p.category, p.author])),
    community: db.community.filter((c) => match(c, [c.author])),
  };
}
