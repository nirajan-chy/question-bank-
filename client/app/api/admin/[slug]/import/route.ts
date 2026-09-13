import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
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

// POST /api/admin/[slug]/import — bulk import from JSON array
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const file = resourceFiles[slug];
  if (!file) {
    return NextResponse.json({ success: false, message: "Unknown resource" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.items)) {
    return NextResponse.json(
      { success: false, message: "Expected { items: [...] }" },
      { status: 400 }
    );
  }

  const filePath = join(DATA_DIR, file);
  let existing: any[] = [];
  try {
    const raw = await readFile(filePath, "utf-8");
    existing = JSON.parse(raw);
  } catch {
    existing = [];
  }

  const mode = body.mode || "append"; // "append" | "replace" | "upsert"
  const items = body.items;

  let result: any[];

  if (mode === "replace") {
    result = items;
  } else if (mode === "upsert") {
    result = [...existing];
    for (const item of items) {
      const idx = result.findIndex((r: any) => r.id === item.id || r.slug === item.slug);
      if (idx >= 0) {
        result[idx] = { ...result[idx], ...item };
      } else {
        result.push(item);
      }
    }
  } else {
    // append — skip duplicates by id
    const existingIds = new Set(existing.map((r: any) => r.id).filter(Boolean));
    const newItems = items.filter((item: any) => !item.id || !existingIds.has(item.id));
    result = [...existing, ...newItems];
  }

  await writeFile(filePath, JSON.stringify(result, null, 2), "utf-8");

  return NextResponse.json({
    success: true,
    data: {
      imported: items.length,
      total: result.length,
      mode,
    },
  });
}
