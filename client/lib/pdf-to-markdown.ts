/**
 * Client-side PDF → Markdown conversion.
 *
 * The PDF never leaves the browser: text is extracted locally with pdf.js and
 * converted to Markdown using font-size / layout heuristics. Nothing is
 * uploaded, so no file storage is needed on the server.
 *
 * Post-processing applies a question-paper-aware formatting pass:
 *  - Center + bold university / institute / course metadata
 *  - Bold marks/time on a separate line
 *  - Center + bold section headers
 *  - Properly spaced numbered questions
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

const HEADER_ORG_RE =
  /^(Tribhuvan\s+University|Kathmandu\s+University|Pokhara\s+University|Purbanchal\s+University|Mid-Western\s+University|Far-Western\s+University|Nepal\s+University|Institute\s+of\s+Science\s+and\s+Technology|Institute\s+of\s+Engineering|Faculty\s+of\s+[A-Za-z\s]+|[A-Z][a-z]+\s+University)/i;

const HEADER_COURSE_RE =
  /^(Bachelor\s+Level|Master\s+Level|Higher\s+Secondary|Class\s+\d|SEE|CTEVT|BSc\s+CSIT|BBA|BBS|BA|B\.?Ed|MBBS|BCA|BIT|B\.?Sc|B\.?Com|MBA|MBS|MA|M\.?Sc)/i;

const HEADER_YEAR_RE = /^\d{4}\s*\(?\s*(BS|AD|CE)\s*\)?$/i;
const YEAR_STANDALONE_RE = /^\d{4}$/;

const MARKS_RE =
  /(Full\s+Marks?|Pass\s+Marks?|Time|Duration|Total\s+Marks?|Maximum\s+Marks?|Minimum\s+Marks?)[\s:]/i;

const SECTION_RE = /^Section[\s\-–—]*[A-Z0-9IVX]+\.?$/i;

const INSTRUCTION_RE =
  /^(Attempt|Candidates?\s+are\s+required|The\s+figures|Note[s]?[\s:])/i;

// ── core conversion ──────────────────────────────────────────────────

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

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

function isContinuation(line: Line): boolean {
  const t = line.text.trimStart();
  if (/^[a-zà-öø-ÿ]/.test(t)) return true;
  if (/^[,;:\-–—]|^['"]/.test(t)) return true;
  if (/^(of|in|on|at|to|for|and|or|but|the|a|an|is|are|was|were|with|from|by)\b/i.test(t))
    return true;
  return false;
}

// ── question-paper post-processing ───────────────────────────────────

/**
 * Split a combined line that contains course info + marks + instructions
 * into separate lines at recognized boundaries.
 */
function splitCombinedLine(text: string): string[] {
  const parts: string[] = [];
  let remaining = text;

  // Split before "Full Marks:" / "Pass Marks:" / "Time:"
  const marksIdx = remaining.search(/\b(Full\s+Marks?|Pass\s+Marks?|Time\s*:)/i);
  if (marksIdx > 0) {
    const before = remaining.slice(0, marksIdx).trim();
    const after = remaining.slice(marksIdx).trim();
    if (before) parts.push(before);
    remaining = after;
  }

  // Split before "Candidates are required" / "The figures"
  const instrIdx = remaining.search(/\b(Candidates?\s+are\s+required|The\s+figures)/i);
  if (instrIdx > 0) {
    const before = remaining.slice(0, instrIdx).trim();
    const after = remaining.slice(instrIdx).trim();
    if (before) parts.push(before);
    if (after) parts.push(after);
  } else {
    if (remaining) parts.push(remaining);
  }

  return parts;
}

function postProcess(blocks: string[]): string[] {
  const out: string[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const clean = b.replace(/^[#*>]+\s*/, "").trim();

    // ── University / Institute / Organization ──────────────────────
    if (HEADER_ORG_RE.test(clean)) {
      out.push(centerBold(clean));
      continue;
    }

    // ── Course / Level line ────────────────────────────────────────
    if (HEADER_COURSE_RE.test(clean)) {
      // This line often contains course + marks + instructions merged.
      // Split them into separate lines.
      const segments = splitCombinedLine(clean);
      for (const seg of segments) {
        if (MARKS_RE.test(seg)) {
          out.push(centerBold(formatMarksTime(seg)));
        } else if (INSTRUCTION_RE.test(seg)) {
          out.push(centerText(seg));
        } else {
          out.push(centerBold(seg));
        }
      }
      continue;
    }

    // ── Year (standalone "2081" or "2081 (BS)") ───────────────────
    if (YEAR_STANDALONE_RE.test(clean) || HEADER_YEAR_RE.test(clean)) {
      out.push(centerBold(clean));
      continue;
    }

    // ── "Question Bank" / "Model Question" label ──────────────────
    if (/^(Question\s+Bank|Model\s+Question|Past\s+Paper|Practice\s+Set|Guess\s+Paper)/i.test(clean)) {
      out.push(centerBold(clean));
      continue;
    }

    // ── Marks / Time line ─────────────────────────────────────────
    if (MARKS_RE.test(clean)) {
      out.push(centerBold(formatMarksTime(clean)));
      continue;
    }

    // ── Section header ────────────────────────────────────────────
    if (SECTION_RE.test(clean)) {
      out.push(centerBold(clean));
      continue;
    }

    // ── Instruction lines ─────────────────────────────────────────
    if (INSTRUCTION_RE.test(clean)) {
      out.push(centerText(clean));
      continue;
    }

    // ── Numbered question ─────────────────────────────────────────
    const qMatch = b.match(/^(\d{1,3})\s*[.)]\s*(.+)/);
    if (qMatch) {
      // Check if next block is a continuation of this question
      const next = blocks[i + 1];
      if (next && isContinuation({ text: next, y: 0, size: 0, bold: false })) {
        const merged = `${qMatch[1]}. ${qMatch[2]} ${next.trim()}`;
        out.push(merged);
        i++;
      } else {
        out.push(b);
      }
      continue;
    }

    out.push(b);
  }

  return out;
}

/** Center + bold text. */
function centerBold(text: string): string {
  return `<div align="center">\n\n**${text}**\n\n</div>`;
}

/** Center text without bold. */
function centerText(text: string): string {
  return `<div align="center">\n\n${text}\n\n</div>`;
}

/** Format marks/time with bold labels. */
function formatMarksTime(text: string): string {
  return text
    .replace(
      /(Full\s+Marks?|Pass\s+Marks?|Total\s+Marks?|Maximum\s+Marks?|Minimum\s+Marks?|Time|Duration)([\s:]*)/gi,
      "**$1:** "
    )
    .replace(/\s+/g, " ")
    .trim();
}

// ── main conversion ──────────────────────────────────────────────────

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

    if (
      line.text.length <= 60 &&
      /^[A-Z0-9][A-Z0-9\s&.,'()\-:/]+$/.test(line.text) &&
      /[A-Z]{3,}/.test(line.text)
    ) {
      flushParagraph();
      blocks.push(line.text);
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
