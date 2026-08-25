/**
 * Client-side PDF → Markdown conversion.
 *
 * The PDF never leaves the browser: text is extracted locally with pdf.js and
 * converted to Markdown using font-size / layout heuristics. Nothing is
 * uploaded, so no file storage is needed on the server.
 *
 * The converter applies a question-paper-aware formatting pass that:
 *  - Centers university / institute / course metadata
 *  - Boldens exam labels (Full Marks, Pass Marks, Time)
 *  - Centers and boldens section headers
 *  - Wraps numbered questions with proper spacing
 */

import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type PdfTextItem = {
  str?: string;
  transform?: number[];
  height?: number;
  fontName?: string;
  hasEOL?: boolean;
};

type Line = {
  text: string;
  y: number;
  size: number;
  bold: boolean;
};

// ── detection helpers ────────────────────────────────────────────────

const BULLET_RE = /^[\s]*([•●▪◦‣·∙*]|[-–—])(\s+|\u00a0)/;
const NUMBERED_RE = /^[\s]*(\d{1,2})\s*[.)]\s+/;

/** University / institute / board name */
const HEADER_ORG_RE =
  /^(Tribhuvan\s+University|Kathmandu\s+University|Pokhara\s+University|Purbanchal\s+University|Mid-Western\s+University|Far-Western\s+University|Nepal\s+University|Institute\s+of\s+Science\s+and\s+Technology|Institute\s+of\s+Engineering|Faculty\s+of\s+Science\s+and\s+Technology|[A-Z][a-z]+\s+University|[A-Z][a-z]+\s+Institute)/i;

/** Course / level / semester line */
const HEADER_COURSE_RE =
  /^(Bachelor\s+Level|Master\s+Level|Higher\s+Secondary|Class\s+\d|SEE|CTEVT|BSc\s+CSIT|BBA|BBS|BA|B\.?Ed|MBBS|BCA|BIT|B\.?Sc|B\.?Com|MBA|MBS|MA|M\.?Sc)/i;

/** Year line — e.g. "2075 (BS)" or "2024 (AD)" */
const HEADER_YEAR_RE = /^\d{4}\s*\(?\s*(BS|AD|CE)\s*\)?$/i;

/** Exam metadata — "Full Marks: 60 + 20 + 20" etc. */
const MARKS_RE =
  /^(Full\s+Marks?|Pass\s+Marks?|Time|Duration|Total\s+Marks?|Maximum\s+Marks?|Minimum\s+Marks?)[\s:]/i;

/** Section header — "SECTION A", "Section - I" etc. */
const SECTION_RE = /^Section[\s\-–—]*[A-Z0-9IVX]+\.?$/i;

/** Question-paper instruction lines */
const INSTRUCTION_RE =
  /^(Attempt|Candidates?\s+are\s+required|The\s+figures|Note[s]?[\s:])/i;

// ── core conversion ──────────────────────────────────────────────────

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

/** Group raw text items into visual lines using their Y baseline. */
function itemsToLines(items: PdfTextItem[]): Line[] {
  const lines: {
    y: number;
    parts: { x: number; str: string; size: number; bold: boolean }[];
  }[] = [];

  for (const item of items) {
    const str = item.str ?? "";
    if (!str.trim()) continue;
    const t = item.transform ?? [1, 0, 0, 1, 0, 0];
    const x = t[4] ?? 0;
    const y = t[5] ?? 0;
    const size = Math.abs(item.height ?? t[3] ?? 10) || 10;
    const bold = /bold|black|heavy|semib/i.test(item.fontName ?? "");

    let line = lines.find(
      (l) => Math.abs(l.y - y) <= Math.max(2, size * 0.35)
    );
    if (!line) {
      line = { y, parts: [] };
      lines.push(line);
    }
    line.parts.push({ x, str, size, bold });
  }

  return lines
    .map((line) => {
      const sorted = [...line.parts].sort((a, b) => a.x - b.x);
      let text = "";
      let prevEnd = -Infinity;
      for (const part of sorted) {
        if (text && part.x - prevEnd > 1.5 && !/\s$/.test(text)) text += "  ";
        text += part.str;
        prevEnd = part.x + part.str.length * part.size * 0.5;
      }
      return {
        text: text.replace(/\s+/g, " ").trim(),
        y: line.y,
        size: round1(Math.max(...sorted.map((p) => p.size))),
        bold: sorted.some((p) => p.bold),
      };
    })
    .filter((l) => l.text.length > 0)
    .sort((a, b) => b.y - a.y);
}

function modeSize(lines: Line[]): number {
  const counts = new Map<number, number>();
  for (const l of lines)
    counts.set(l.size, (counts.get(l.size) ?? 0) + l.text.length);
  let best = 10;
  let bestCount = -1;
  for (const [size, count] of counts) {
    if (count > bestCount) {
      best = size;
      bestCount = count;
    }
  }
  return best;
}

function headingLevel(size: number, body: number, line: Line): number {
  if (line.text.length > 90) return 0;
  const ratio = size / body;
  if (ratio >= 1.7) return 1;
  if (ratio >= 1.35) return 2;
  if (ratio >= 1.12) return 3;
  if (ratio >= 1.02 && line.bold) return 4;
  return 0;
}

/**
 * Returns true when `line` should be treated as a continuation of the
 * previous paragraph (i.e. the same logical line wrapped in the PDF).
 */
function isContinuation(line: Line): boolean {
  const t = line.text.trimStart();
  // Starts with lowercase or common continuation punctuation
  if (/^[a-zà-öø-ÿ]/.test(t)) return true;
  if (/^[,;:\-–—]|^['"]/.test(t)) return true;
  // Starts with a lowercase preposition / conjunction
  if (/^(of|in|on|at|to|for|and|or|but|the|a|an|is|are|was|were|with|from|by)\b/i.test(t))
    return true;
  return false;
}

// ── question-paper post-processing ───────────────────────────────────

/**
 * After basic markdown conversion, apply question-paper-specific
 * formatting rules using HTML (supported inside markdown).
 */
function postProcess(blocks: string[]): string[] {
  const out: string[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];

    // ── center header block (university / institute / course / year) ──
    if (HEADER_ORG_RE.test(b.replace(/^[#*>]+\s*/, ""))) {
      out.push(centerBold(b.replace(/^[#*>]+\s*/, "")));
      continue;
    }
    if (HEADER_COURSE_RE.test(b.replace(/^[#*>]+\s*/, ""))) {
      out.push(centerBold(b.replace(/^[#*>]+\s*/, "")));
      continue;
    }
    if (HEADER_YEAR_RE.test(b.replace(/^[#*>]+\s*/, ""))) {
      out.push(centerBold(b.replace(/^[#*>]+\s*/, "")));
      continue;
    }
    // "Question Bank" / "Model Question" / "Past Paper" label
    if (/^###?\s*(Question\s+Bank|Model\s+Question|Past\s+Paper|Practice\s+Set|Guess\s+Paper)/i.test(b)) {
      out.push(centerBold(b.replace(/^#+\s*/, "")));
      continue;
    }

    // ── marks / time line ────────────────────────────────────────────
    if (MARKS_RE.test(b.replace(/^[#*>]+\s*/, ""))) {
      out.push(formatMarksTime(b.replace(/^[#*>]+\s*/, "")));
      continue;
    }

    // ── section header ───────────────────────────────────────────────
    if (SECTION_RE.test(b.replace(/^[#*>]+\s*/, ""))) {
      out.push(centerBold(b.replace(/^[#*>]+\s*/, "")));
      continue;
    }

    // ── instruction lines (Attempt any TWO, etc.) ────────────────────
    if (INSTRUCTION_RE.test(b.replace(/^[#*>]+\s*/, ""))) {
      out.push(`*${b.replace(/^[#*>]+\s*/, "")}*`);
      continue;
    }

    // ── numbered question ────────────────────────────────────────────
    const qMatch = b.match(/^(\d{1,3})\s*[.)]\s*(.+)/);
    if (qMatch) {
      // Check if next block is a continuation of this question
      const next = blocks[i + 1];
      if (next && isContinuation({ text: next, y: 0, size: 0, bold: false })) {
        // Merge the continuation into the question
        const merged = `${qMatch[1]}. ${qMatch[2]} ${next.trim()}`;
        out.push(merged);
        i++; // skip the continuation block
      } else {
        out.push(b);
      }
      continue;
    }

    out.push(b);
  }

  return out;
}

/** Wrap text in centered bold HTML. */
function centerBold(text: string): string {
  return `<div align="center">\n\n**${text}**\n\n</div>`;
}

/** Format marks / time line with bold labels. */
function formatMarksTime(text: string): string {
  const formatted = text
    .replace(
      /(Full\s+Marks?|Pass\s+Marks?|Total\s+Marks?|Maximum\s+Marks?|Minimum\s+Marks?|Time|Duration)([\s:]*)/gi,
      "**$1:** "
    )
    .replace(/\s+/g, " ")
    .trim();
  return `<div align="center">\n\n${formatted}\n\n</div>`;
}

// ── main conversion entry point ──────────────────────────────────────

/** Convert one page's extracted lines into markdown blocks. */
function linesToMarkdown(lines: Line[], body: number): string[] {
  const blocks: string[] = [];
  let paragraph = "";

  const flushParagraph = () => {
    if (paragraph) {
      blocks.push(paragraph);
      paragraph = "";
    }
  };

  const pushParagraphLine = (rawText: string) => {
    const text = rawText.trim();
    if (!text) {
      flushParagraph();
      return;
    }
    if (!paragraph) {
      paragraph = text;
      return;
    }
    // De-hyphenate words split across wrapped lines.
    if (/[\u2010-\u2014-]$/.test(paragraph)) {
      paragraph = paragraph.replace(/[\u2010-\u2014-]+$/, "") + text;
    } else {
      paragraph += ` ${text}`;
    }
  };

  for (const line of lines) {
    const heading = headingLevel(line.size, body, line);

    if (heading) {
      flushParagraph();
      blocks.push(`${"#".repeat(heading)} ${line.text}`);
      continue;
    }

    if (BULLET_RE.test(line.text)) {
      flushParagraph();
      blocks.push(`- ${line.text.replace(BULLET_RE, "").trim()}`);
      continue;
    }

    if (NUMBERED_RE.test(line.text)) {
      flushParagraph();
      blocks.push(line.text.replace(/^[\s]+/, ""));
      continue;
    }

    // A short ALL-CAPS or section-like line reads like a section label.
    if (
      line.text.length <= 60 &&
      /^[A-Z0-9][A-Z0-9\s&.,'()\-:/]+$/.test(line.text) &&
      /[A-Z]{3,}/.test(line.text)
    ) {
      flushParagraph();
      blocks.push(`### ${line.text}`);
      continue;
    }

    pushParagraphLine(line.text);
  }

  flushParagraph();
  return blocks;
}

export type PdfConversionResult = {
  markdown: string;
  pages: number;
  emptyPages: number[];
};

export async function convertPdfToMarkdown(
  file: File,
  onProgress?: (page: number, total: number) => void
): Promise<PdfConversionResult> {
  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;

  const pageBlocks: string[][] = [];
  const emptyPages: number[] = [];

  for (let i = 1; i <= doc.numPages; i++) {
    onProgress?.(i, doc.numPages);
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const lines = itemsToLines(content.items as PdfTextItem[]);

    if (lines.length === 0) {
      emptyPages.push(i);
      pageBlocks.push([
        `> _Page ${i} contained no extractable text (likely a scanned image)._`,
      ]);
      continue;
    }

    const raw = linesToMarkdown(lines, modeSize(lines));
    pageBlocks.push(postProcess(raw));
  }

  await doc.cleanup();

  const pages = pageBlocks.map((blocks) => blocks.join("\n\n"));
  return {
    markdown: pages.join("\n\n---\n\n"),
    pages: doc.numPages,
    emptyPages,
  };
}
