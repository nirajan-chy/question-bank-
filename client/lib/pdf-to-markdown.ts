/**
 * Client-side PDF → Markdown conversion.
 *
 * The PDF never leaves the browser: text is extracted locally with pdf.js and
 * converted to Markdown using font-size / layout heuristics. Nothing is
 * uploaded, so no file storage is needed on the server.
 *
 * Limitations (inherent to text-extraction based conversion):
 * - Scanned/image-only PDFs produce no text — pages are marked so the editor
 *   can warn the user.
 * - Complex multi-column layouts are flattened in reading order per column
 *   block; tables become plain lines best cleaned up manually.
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

const BULLET_RE = /^[\s]*([•●▪◦‣·∙*]|[-–—])(\s+|\u00a0)/;
const NUMBERED_RE = /^[\s]*(\d{1,2})\s*[.)]\s+/;

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

/** Group raw text items into visual lines using their Y baseline. */
function itemsToLines(items: PdfTextItem[]): Line[] {
  const lines: { y: number; parts: { x: number; str: string; size: number; bold: boolean }[] }[] = [];

  for (const item of items) {
    const str = item.str ?? "";
    if (!str.trim()) continue;
    const t = item.transform ?? [1, 0, 0, 1, 0, 0];
    const x = t[4] ?? 0;
    const y = t[5] ?? 0;
    const size = Math.abs(item.height ?? t[3] ?? 10) || 10;
    const bold = /bold|black|heavy|semib/i.test(item.fontName ?? "");

    let line = lines.find((l) => Math.abs(l.y - y) <= Math.max(2, size * 0.35));
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
        // Re-insert spacing for horizontal gaps (column breaks, indents).
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
  for (const l of lines) counts.set(l.size, (counts.get(l.size) ?? 0) + l.text.length);
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
  if ((ratio >= 1.02 || line.bold) && size <= body * 1.15 && line.bold) return 4;
  return 0;
}

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

    // A short ALL-CAPS or numbered-question line reads like a section label.
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
      pageBlocks.push([`> _Page ${i} contained no extractable text (likely a scanned image)._`]);
      continue;
    }

    pageBlocks.push(linesToMarkdown(lines, modeSize(lines)));
  }

  await doc.cleanup();

  const pages = pageBlocks.map((blocks) => blocks.join("\n\n"));
  return {
    markdown: pages.join("\n\n---\n\n"),
    pages: doc.numPages,
    emptyPages,
  };
}
