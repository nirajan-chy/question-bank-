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

async function readJson(file: string): Promise<any[]> {
  try {
    const raw = await readFile(join(DATA_DIR, file), "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeJson(file: string, data: any[]): Promise<void> {
  await writeFile(join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

function ok<T>(data: T) {
  return NextResponse.json({ success: true, data });
}

function notFound() {
  return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
}

function badRequest(msg: string) {
  return NextResponse.json({ success: false, message: msg }, { status: 400 });
}

// GET /api/admin/[slug] — list all or get by ?id=
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const file = resourceFiles[slug];
  if (!file) return notFound();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const search = searchParams.get("search")?.toLowerCase();
  const limit = searchParams.get("limit");

  let data = await readJson(file);

  if (id) {
    const item = data.find((d: any) => d.id === id || d.slug === id);
    if (!item) return notFound();
    return ok(item);
  }

  if (search) {
    data = data.filter((item: any) => {
      const haystack = Object.values(item).join(" ").toLowerCase();
      return haystack.includes(search);
    });
  }

  if (limit) {
    data = data.slice(0, Number(limit));
  }

  return ok(data);
}

// POST /api/admin/[slug] — create new item
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const file = resourceFiles[slug];
  if (!file) return notFound();

  const body = await req.json().catch(() => (null));
  if (!body) return badRequest("Invalid JSON body");

  const data = await readJson(file);

  // Auto-generate ID and slug
  const id = body.id || `${slug.slice(0, 3)}_${Date.now()}`;
  const newItem = {
    id,
    slug: body.slug || body.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || id,
    ...body,
    id,
  };

  data.push(newItem);
  await writeJson(file, data);

  return ok(newItem);
}

// PUT /api/admin/[slug] — update item by ?id=
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const file = resourceFiles[slug];
  if (!file) return notFound();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return badRequest("Missing ?id= query param");

  const body = await req.json().catch(() => (null));
  if (!body) return badRequest("Invalid JSON body");

  const data = await readJson(file);
  const index = data.findIndex((d: any) => d.id === id);
  if (index === -1) return notFound();

  data[index] = { ...data[index], ...body, id };
  await writeJson(file, data);

  return ok(data[index]);
}

// DELETE /api/admin/[slug] — delete item by ?id=
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const file = resourceFiles[slug];
  if (!file) return notFound();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return badRequest("Missing ?id= query param");

  const data = await readJson(file);
  const index = data.findIndex((d: any) => d.id === id);
  if (index === -1) return notFound();

  const deleted = data.splice(index, 1)[0];
  await writeJson(file, data);

  return ok(deleted);
}
