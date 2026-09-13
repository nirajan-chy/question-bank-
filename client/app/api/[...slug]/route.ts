import { NextRequest, NextResponse } from "next/server";
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
import faq from "@/data/faq.json";
import posts from "@/data/posts.json";
import community from "@/data/community.json";
import communityChannels from "@/data/community-channels.json";
import communityMessages from "@/data/community-messages.json";
import leaderboard from "@/data/leaderboard.json";

function ok<T>(data: T) {
  return NextResponse.json({ success: true, data });
}

function notFound() {
  return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const path = slug.join("/");
  const { searchParams } = new URL(req.url);

  const limit = searchParams.get("limit");
  const q = searchParams.get("q");

  const slice = <T>(arr: T[]) =>
    limit ? arr.slice(0, Number(limit)) : arr;

  switch (path) {
    case "levels":
      return ok(levels);

    case "universities":
      return ok(universities);

    case "faculties":
      return ok(faculties);

    case "courses":
      return ok(courses);

    case "semesters":
      return ok(semesters);

    case "subjects":
      return ok(subjects);

    case "notes":
      return ok(
        slice(
          searchParams.get("subjectSlug")
            ? notes.filter((n) => n.subjectSlug === searchParams.get("subjectSlug"))
            : notes
        )
      );

    case "books":
      return ok(
        slice(
          searchParams.get("bestseller") === "true"
            ? books.filter((b) => b.bestseller)
            : books
        )
      );

    case "question-banks":
      return ok(
        slice(
          searchParams.get("subjectSlug")
            ? questionBanks.filter((q) => q.subjectSlug === searchParams.get("subjectSlug"))
            : questionBanks
        )
      );

    case "past-papers":
      return ok(
        slice(
          searchParams.get("subjectSlug")
            ? pastPapers.filter((p) => p.subjectSlug === searchParams.get("subjectSlug"))
            : pastPapers
        )
      );

    case "mock-tests":
      return ok(
        slice(
          searchParams.get("subjectSlug")
            ? mockTests.filter((m) => m.subjectSlug === searchParams.get("subjectSlug"))
            : mockTests
        )
      );

    case "scholarships":
      return ok(
        slice(
          searchParams.get("featured") === "true"
            ? scholarships.filter((s) => s.featured)
            : scholarships
        )
      );

    case "notices":
      return ok(slice(notices));

    case "results":
      return ok(results);

    case "faqs":
      return ok(faq);

    case "posts":
      return ok(slice(posts));

    case "community/questions":
      return ok(community);

    case "community/channels":
      return ok(communityChannels);

    case "leaderboard":
      return ok(leaderboard);

    case "search": {
      const query = (q || "").toLowerCase();
      if (!query) return ok({ subjects: [], notes: [], books: [], questionBanks: [], mockTests: [], scholarships: [], posts: [], community: [] });
      const match = (item: Record<string, unknown>, extra: string[] = []) => {
        const haystack = [item.title, item.name, item.description, ...(Array.isArray(item.tags) ? item.tags : []), ...extra]
          .join(" ").toLowerCase();
        return haystack.includes(query);
      };
      return ok({
        subjects: subjects.filter((s) => match(s, [s.level, s.category, s.emoji])),
        notes: notes.filter((n) => match(n, [n.subjectName, n.level, n.author])),
        books: books.filter((b) => match(b, [b.author, b.publisher, b.level])),
        questionBanks: questionBanks.filter((q) => match(q, [q.subjectName, q.level])),
        mockTests: mockTests.filter((m) => match(m, [m.subjectName, m.level])),
        scholarships: scholarships.filter((s) => match(s, [s.provider, s.level, s.category])),
        posts: posts.filter((p) => match(p, [p.category, p.author])),
        community: community.filter((c) => match(c, [c.author])),
      });
    }

    default:
      break;
  }

  // Dynamic routes: courses/:slug, subjects/:slug, etc.
  if (slug.length === 2) {
    const [resource, idOrSlug] = slug;

    if (resource === "courses") {
      const course = courses.find((c) => c.slug === idOrSlug);
      if (course) return ok(course);
      return notFound();
    }

    if (resource === "subjects") {
      const subject = subjects.find((s) => s.slug === idOrSlug);
      if (subject) return ok(subject);
      return notFound();
    }

    if (resource === "past-papers") {
      const paper = pastPapers.find((p) => p.slug === idOrSlug);
      if (paper) return ok(paper);
      return notFound();
    }

    if (resource === "mock-tests") {
      const test = mockTests.find((m) => m.slug === idOrSlug);
      if (test) return ok(test);
      return notFound();
    }

    if (resource === "posts") {
      const post = posts.find((p) => p.slug === idOrSlug);
      if (post) return ok(post);
      return notFound();
    }
  }

  // courses/level/:slug
  if (slug.length === 3 && slug[0] === "courses" && slug[1] === "level") {
    return ok(courses.filter((c) => c.levelSlug === slug[2]));
  }

  // subjects/level/:slug
  if (slug.length === 3 && slug[0] === "subjects" && slug[1] === "level") {
    return ok(subjects.filter((s) => s.levelSlug === slug[2]));
  }

  // subjects/course/:slug
  if (slug.length === 3 && slug[0] === "subjects" && slug[1] === "course") {
    return ok(subjects.filter((s) => s.courseSlug === slug[2]));
  }

  // semesters/course/:slug
  if (slug.length === 3 && slug[0] === "semesters" && slug[1] === "course") {
    return ok(semesters.filter((s) => s.courseSlug === slug[2]).sort((a, b) => a.number - b.number));
  }

  // subjects/trending
  if (slug.length === 2 && slug[0] === "subjects" && slug[1] === "trending") {
    const trending = subjects.filter((s) => s.trending).sort((a, b) => b.popularity - a.popularity);
    return ok(limit ? trending.slice(0, Number(limit)) : trending);
  }

  // subjects/course/:slug/semester/:num
  if (
    slug.length === 5 &&
    slug[0] === "subjects" &&
    slug[1] === "course" &&
    slug[3] === "semester"
  ) {
    const semNum = Number(slug[4]);
    return ok(subjects.filter((s) => s.courseSlug === slug[2] && s.semester === semNum));
  }

  // community/channels/:communityId/messages?channel=:channelId
  if (slug.length === 4 && slug[0] === "community" && slug[1] === "channels" && slug[3] === "messages") {
    const communityId = slug[2];
    const channelId = searchParams.get("channel");
    const filtered = communityMessages.filter(
      (m) => m.communityId === communityId && (!channelId || m.channelId === channelId)
    );
    return ok(filtered);
  }

  // community/messages/:messageId/reactions (POST handled below)
  if (slug.length === 4 && slug[0] === "community" && slug[1] === "messages" && slug[3] === "reactions") {
    return ok({ success: true });
  }

  return notFound();
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const path = slug.join("/");
  const body = await req.json().catch(() => ({}));

  // community/questions — post a new question
  if (path === "community/questions") {
    const newQuestion = {
      id: `c${Date.now()}`,
      slug: body.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "untitled",
      title: body.title || "Untitled",
      body: body.body || "",
      author: body.author || "Anonymous",
      tags: body.tags || [],
      votes: 0,
      answers: [],
      views: 0,
      createdAt: new Date().toISOString(),
    };
    return ok(newQuestion);
  }

  // community/channels/:communityId/messages — send a message
  if (slug.length === 4 && slug[0] === "community" && slug[1] === "channels" && slug[3] === "messages") {
    const newMessage = {
      id: `m${Date.now()}`,
      communityId: slug[2],
      channelId: body.channelId || "general",
      author: body.author || "Anonymous",
      role: body.role || "",
      avatar: (body.author || "A").split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2),
      content: body.content || "",
      reactions: [],
      attachment: body.attachment || null,
      createdAt: new Date().toISOString(),
    };
    return ok(newMessage);
  }

  // community/messages/:messageId/reactions — add reaction
  if (slug.length === 4 && slug[0] === "community" && slug[1] === "messages" && slug[3] === "reactions") {
    return ok({ success: true });
  }

  return notFound();
}
