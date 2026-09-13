import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");

const resourceFiles: Record<string, string> = {
  levels: "levels.json",
  universities: "universities.json",
  faculties: "faculties.json",
  courses: "courses.json",
  semesters: "semesters.json",
  subjects: "subjects.json",
  notes: "notes.json",
  books: "books.json",
  "question-banks": "question-banks.json",
  "past-papers": "past-papers.json",
  "mock-tests": "mock-tests.json",
  scholarships: "scholarships.json",
  notices: "notices.json",
  results: "results.json",
  faqs: "faq.json",
  posts: "posts.json",
  community: "community.json",
  "community-channels": "community-channels.json",
  "community-messages": "community-messages.json",
  leaderboard: "leaderboard.json",
  contacts: "contacts.json",
};

// GET /api/admin/[slug]/export — export all as JSON download
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const file = resourceFiles[slug];
  if (!file) {
    return NextResponse.json({ success: false, message: "Unknown resource" }, { status: 404 });
  }

  try {
    const raw = await readFile(join(DATA_DIR, file), "utf-8");
    const data = JSON.parse(raw);

    return new NextResponse(JSON.stringify(data, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${slug}-export.json"`,
      },
    });
  } catch {
    return NextResponse.json({ success: false, message: "File not found" }, { status: 404 });
  }
}
