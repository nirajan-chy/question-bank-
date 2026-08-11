// ─── Domain types for Sandarbh ───────────────────────────────────────────────

export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar: string;
  bio: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type AdminStats = {
  counts: Record<string, number>;
  recentContacts: ContactSubmission[];
  recentQuestions: CommunityQuestion[];
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
};

export type ResourceField = {
  key: string;
  type: "STRING" | "TEXT" | "INTEGER" | "FLOAT" | "BOOLEAN" | "JSONB" | "DATE" | "DATEONLY" | "ENUM" | "UUID" | string;
  allowNull: boolean;
  primaryKey: boolean;
  defaultValue: unknown;
  unique: boolean;
  values?: string[];
};

export type ResourceMeta = {
  name: string;
  attributes: ResourceField[];
};

export type Level = {
  id: string;
  slug: string;
  name: string;
  short: string;
  description: string;
  subjects: string[];
  streams?: string[];
};

export type Course = {
  id: string;
  slug: string;
  name: string;
  short: string;
  description: string;
  levelSlug: string;
  category: string;
  icon: string;
  gradient: string;
  semesterCount: number;
  university: string;
  tags: string[];
};

export type Semester = {
  id: string;
  slug: string;
  name: string;
  short: string;
  number: number;
  courseSlug: string;
  description: string;
  tags: string[];
};

export type University = {
  id: string;
  slug: string;
  name: string;
  short: string;
  established: number;
  location: string;
  type: "Constituent" | "Affiliated" | "Autonomous";
  description: string;
  programs: string[];
  ranking: string;
  students: number;
  website: string;
  gradient: string;
};

export type Faculty = {
  id: string;
  slug: string;
  name: string;
  short: string;
  description: string;
  icon: string;
  gradient: string;
  programs: string[];
};

export type Subject = {
  id: string;
  slug: string;
  name: string;
  level: string;
  levelSlug: string;
  courseSlug?: string;
  semester?: number;
  stream?: string;
  category: string;
  description: string;
  overview: string;
  units: string[];
  syllabus: { unit: string; topics: string[]; hours: number }[];
  emoji: string;
  gradient: string;
  popularity: number;
  notes: number;
  books: number;
  questionBanks: number;
  pastPapers: number;
  mcqs: number;
  assignments: number;
  videos: number;
  downloads: number;
  trending: boolean;
  relatedSlugs: string[];
  tags: string[];
};

export type Note = {
  id: string;
  slug: string;
  title: string;
  subjectSlug: string;
  subjectName: string;
  level: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  updatedAt: string;
  unit?: string;
  description: string;
  pages: number;
  downloads: number;
  views: number;
  rating: number;
  free: boolean;
  pdfUrl?: string;
  tags: string[];
};

export type Book = {
  id: string;
  slug: string;
  title: string;
  author: string;
  publisher: string;
  edition: string;
  level: string;
  language: "English" | "Nepali" | "Bilingual";
  isbn: string;
  pages: number;
  price: number;
  rating: number;
  reviews: number;
  cover: string;
  description: string;
  subjects: string[];
  tags: string[];
  bestseller: boolean;
};

export type QuestionBank = {
  id: string;
  slug: string;
  title: string;
  subjectSlug: string;
  subjectName: string;
  level: string;
  year: number;
  questions: number;
  difficulty: "Easy" | "Medium" | "Hard";
  attempts: number;
  rating: number;
  updatedAt: string;
  description: string;
  format: "PDF" | "Interactive" | "Both";
  pdfUrl?: string;
  free: boolean;
  tags: string[];
};

export type PastPaper = {
  id: string;
  slug: string;
  title: string;
  subjectSlug: string;
  subjectName: string;
  level: string;
  year: number;
  exam: string;
  board: string;
  duration: string;
  fullMarks: number;
  passMarks: number;
  downloads: number;
  format: "PDF";
  description: string;
  pdfUrl?: string;
  tags: string[];
};

export type MockTest = {
  id: string;
  slug: string;
  title: string;
  subjectSlug: string;
  subjectName: string;
  level: string;
  questions: number;
  durationMinutes: number;
  fullMarks: number;
  attempts: number;
  avgScore: number;
  difficulty: "Easy" | "Medium" | "Hard";
  updatedAt: string;
  description: string;
  premium: boolean;
  tags: string[];
};

export type Scholarship = {
  id: string;
  slug: string;
  title: string;
  provider: string;
  level: string;
  amount: string;
  deadline: string;
  seats: number;
  eligibility: string[];
  requirements: string[];
  category: string;
  description: string;
  gradient: string;
  featured: boolean;
  tags: string[];
};

export type Notice = {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  body: string;
  pinned: boolean;
  tags: string[];
};

export type ResultEntry = {
  id: string;
  exam: string;
  level: string;
  board: string;
  year: number;
  publishedAt: string;
  totalCandidates: number;
  passed: number;
  passRate: number;
  url: string;
  notable: string[];
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  cover: string;
  publishedAt: string;
  readingTime: number;
  views: number;
  likes: number;
  tags: string[];
  body: string[];
};

export type CommunityQuestion = {
  id: string;
  title: string;
  slug: string;
  body: string;
  author: string;
  authorRole: string;
  avatar: string;
  tags: string[];
  views: number;
  votes: number;
  answers: CommunityAnswer[];
  answerCount: number;
  viewsFormatted: string;
  answered: boolean;
  acceptedAnswerId: string | null;
  createdAt: string;
  bounty?: number;
};

export type CommunityAnswer = {
  id: string;
  author: string;
  authorRole: string;
  avatar: string;
  body: string;
  votes: number;
  accepted: boolean;
  createdAt: string;
  comments: { author: string; body: string; createdAt: string }[];
};

export type CommunityChannel = {
  id: string;
  name: string;
  description: string;
};

export type Community = {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  memberCount: number;
  badge?: string;
  channels: CommunityChannel[];
  createdAt?: string;
};

export type MessageReaction = {
  emoji: string;
  count: number;
};

export type MessageAttachment = {
  name: string;
  size: string;
  type: string;
};

export type CommunityMessage = {
  id: string;
  communityId: string;
  channelId: string;
  author: string;
  role: string;
  avatar: string;
  content: string;
  reactions: MessageReaction[];
  attachment: MessageAttachment | null;
  createdAt: string;
};

export type StudySession = {
  id: string;
  subject: string;
  subjectEmoji: string;
  date: string;
  minutes: number;
  mode: "Focus" | "Pomodoro" | "Review";
};

export type LeaderboardEntry = {
  id: string;
  name: string;
  level: string;
  streak: number;
  points: number;
  xp: number;
  rank: number;
  avatar: string;
};

export type BookmarkItem = {
  id: string;
  type: "note" | "book" | "question-bank" | "past-paper" | "mock-test" | "post" | "scholarship";
  title: string;
  subtitle: string;
  href: string;
  savedAt: string;
  icon: string;
};

// ─── Self Learning Center (RAG) ───────────────────────────────────────────────

export type RagDocument = {
  id: string;
  filename: string;
  file_type: "pdf" | "docx" | "txt";
  status: "processing" | "ready" | "failed";
  error?: string | null;
  chunk_count: number;
  char_count: number;
  created_at: string;
};

export type RagSource = {
  document_id: string;
  document_name: string;
  snippet: string;
  page?: number | null;
};

export type RagAnswer = {
  answer: string;
  sources: RagSource[];
};

export type RagMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: RagSource[] | null;
  created_at: string;
};

export type McqGenerateRequest = {
  count: number;
  difficulty: "easy" | "medium" | "hard";
  topics?: string;
  document_ids?: string[] | null;
  notes?: string;
};

export type McqQuestion = {
  question: string;
  options: string[];
  topic?: string | null;
};

export type McqQuiz = {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  status: "pending" | "submitted";
  score: number;
  total: number;
  created_at: string;
  questions: McqQuestion[];
};

export type McqResultQuestion = McqQuestion & {
  selected: number | null;
  correct_index: number;
  correct: boolean;
  explanation: string;
};

export type McqResult = {
  id: string;
  score: number;
  total: number;
  passed: boolean;
  pass_percent: number;
  results: McqResultQuestion[];
};
