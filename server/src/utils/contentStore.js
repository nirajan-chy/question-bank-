const path = require("path");
const fs = require("fs");

// Vercel serverless runs on a read-only filesystem except /tmp — same
// convention as utils/upload.js for PDFs.
const isServerless = Boolean(process.env.VERCEL);

const CONTENT_DIR = isServerless
  ? path.join("/tmp", "content")
  : path.resolve(__dirname, "../../content");

try {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
} catch (error) {
  console.error("⚠️ Could not create content directory:", error.message);
}

// Only [a-z0-9-] segments — blocks path traversal and keeps URLs clean.
const SAFE_SEGMENT = /^[a-z0-9][a-z0-9-]*$/;

/**
 * Build a repo-style content path:
 *   <courseSlug>/semester-<n>/<subjectSlug>/<year>.md   (with course+semester)
 *   <levelSlug>/<subjectSlug>/<year>.md                 (fallback, no course)
 * Every segment is validated; throws ApiError on anything unexpected.
 */
function buildContentPath({ courseSlug, semester, subjectSlug, levelSlug, year }) {
  const parts = [];
  if (courseSlug) parts.push(String(courseSlug));
  if (semester != null && Number.isFinite(Number(semester))) {
    parts.push(`semester-${Number(semester)}`);
  }
  parts.push(String(subjectSlug || levelSlug || "general"));
  parts.push(String(Number(year)));

  for (const part of parts) {
    if (!SAFE_SEGMENT.test(part)) {
      const ApiError = require("./ApiError");
      throw new ApiError(400, `Invalid content path segment: "${part}"`);
    }
  }
  return `${parts.join("/")}.md`;
}

function resolveSafe(contentPath) {
  const full = path.resolve(CONTENT_DIR, contentPath);
  if (!full.startsWith(CONTENT_DIR + path.sep)) {
    const ApiError = require("./ApiError");
    throw new ApiError(400, "Invalid content path");
  }
  return full;
}

/** Write a Markdown file; returns the content path that was written. */
function writeMarkdown(contentPath, markdown) {
  const full = resolveSafe(contentPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, String(markdown), "utf8");
  return contentPath;
}

function readMarkdown(contentPath) {
  try {
    return fs.readFileSync(resolveSafe(contentPath), "utf8");
  } catch {
    return null;
  }
}

function deleteMarkdown(contentPath) {
  if (!contentPath) return;
  try {
    fs.unlinkSync(resolveSafe(contentPath));
  } catch {
    // already gone — nothing to do
  }
}

module.exports = { CONTENT_DIR, buildContentPath, writeMarkdown, readMarkdown, deleteMarkdown };
