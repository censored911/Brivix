import {
  LEGAL_ADDRESS,
  LEGAL_COPYRIGHT_YEAR,
  LEGAL_ENTITY,
  type LegalDoc,
} from "@/data/legal";

/**
 * Dependency-free PDF writer for the legal documents.
 *
 * Why hand-rolled rather than a library: the only input is the static `LegalDoc`
 * object compiled into the bundle. Adding a third-party PDF engine would widen
 * the supply-chain surface for zero functional gain — this file emits a valid
 * PDF 1.4 from primitives, so the byte output is fully deterministic and there
 * is no external code in the download path.
 *
 * Encoding note: the documents are pure ASCII apart from the em dash (U+2014)
 * and the bullet glyph we add ourselves (U+2022). Both are mapped to their
 * WinAnsi code points and emitted as octal escapes, so the entire PDF byte
 * stream stays 7-bit — which keeps xref byte offsets equal to string indices.
 */

// --- Page geometry (A4, in PDF points) -------------------------------------
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 56;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BOTTOM = 64; // content floor, leaving room for the footer

type RGB = [number, number, number];

const BLACK: RGB = [0, 0, 0];
const GRAY: RGB = [0.42, 0.42, 0.42];
const BODY: RGB = [0.2, 0.2, 0.2];

// Standard-14 AFM advance widths (units per 1000 em) for codes 32–126.
// prettier-ignore
const W_REGULAR = [
  278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,
  556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,
  611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,
  667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,
  222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584,
];
// prettier-ignore
const W_BOLD = [
  278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,556,556,556,
  556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,
  611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,
  667,611,333,278,333,584,556,333,556,611,556,611,556,333,611,611,278,278,556,
  278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584,
];

const EM_DASH = 0x97; // WinAnsi em dash
const BULLET = 0x95; // WinAnsi bullet
const COPYRIGHT = 0xa9; // WinAnsi copyright sign (©)

/** Advance width of a glyph in points. */
function glyphWidth(code: number, bold: boolean, size: number): number {
  const table = bold ? W_BOLD : W_REGULAR;
  let units: number;
  if (code >= 32 && code <= 126) units = table[code - 32];
  else if (code === EM_DASH) units = 1000;
  else if (code === BULLET) units = 350;
  else if (code === COPYRIGHT) units = 737;
  else units = 556;
  return (units / 1000) * size;
}

/** Fold the document's non-ASCII chars into their WinAnsi code points. */
function norm(s: string): string {
  return s
    .replace(/—/g, String.fromCharCode(EM_DASH))
    .replace(/©/g, String.fromCharCode(COPYRIGHT));
}

function stringWidth(s: string, bold: boolean, size: number): number {
  let w = 0;
  for (let i = 0; i < s.length; i++) w += glyphWidth(s.charCodeAt(i), bold, size);
  return w;
}

/** Greedy word wrap with a hard-break fallback for over-long tokens. */
function wrap(s: string, bold: boolean, size: number, maxW: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of s.split(" ")) {
    const test = line ? `${line} ${word}` : word;
    if (stringWidth(test, bold, size) <= maxW || !line) {
      if (!line && stringWidth(word, bold, size) > maxW) {
        let chunk = "";
        for (const ch of word) {
          if (chunk && stringWidth(chunk + ch, bold, size) > maxW) {
            lines.push(chunk);
            chunk = ch;
          } else chunk += ch;
        }
        line = chunk;
      } else {
        line = test;
      }
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Escape a string for a PDF literal; high bytes become 3-digit octal. */
function escapePdf(s: string): string {
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c === 92) out += "\\\\";
    else if (c === 40) out += "\\(";
    else if (c === 41) out += "\\)";
    else if (c > 126) out += "\\" + ("000" + c.toString(8)).slice(-3);
    else out += s[i];
  }
  return out;
}

/** Format a coordinate compactly (avoids scientific notation). */
function num(n: number): string {
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function buildLegalPdf(doc: LegalDoc): Uint8Array {
  const pages: string[] = [];
  let cur = "";
  let y = PAGE_H - MARGIN;

  // A branded two-tier footer so every page is unmistakably an official Brivix
  // document: the wordmark and page number sit on the upper line, and the full
  // copyright / entity notice plus the document name on the line beneath.
  const footer = (pageIndex: number) => {
    // Hairline separating the footer band from the content above it.
    cur += `q 0.85 0.85 0.85 RG 0.6 w ${num(MARGIN)} 50 m ${num(PAGE_W - MARGIN)} 50 l S Q\n`;

    // Tier 1 — brand wordmark (left) + page number (right).
    cur += `BT /F2 9 Tf ${BLACK.join(" ")} rg 1 0 0 1 ${num(MARGIN)} 37 Tm (${escapePdf(LEGAL_ENTITY)}) Tj ET\n`;
    const label = `Page ${pageIndex + 1}`;
    const lx = PAGE_W - MARGIN - stringWidth(label, false, 8);
    cur += `BT /F1 8 Tf ${GRAY.join(" ")} rg 1 0 0 1 ${num(lx)} 37 Tm (${escapePdf(label)}) Tj ET\n`;

    // Tier 2 — copyright / entity notice (left) + document name (right).
    const notice = norm(
      `© ${LEGAL_COPYRIGHT_YEAR} ${LEGAL_ENTITY}. All rights reserved. — ${LEGAL_ADDRESS}`,
    );
    cur += `BT /F1 7.5 Tf ${GRAY.join(" ")} rg 1 0 0 1 ${num(MARGIN)} 24 Tm (${escapePdf(notice)}) Tj ET\n`;
    const title = norm(doc.title);
    const tx = PAGE_W - MARGIN - stringWidth(title, false, 7.5);
    cur += `BT /F1 7.5 Tf ${GRAY.join(" ")} rg 1 0 0 1 ${num(tx)} 24 Tm (${escapePdf(title)}) Tj ET\n`;
  };

  footer(0);

  const newPage = () => {
    pages.push(cur);
    cur = "";
    y = PAGE_H - MARGIN;
    footer(pages.length);
  };

  const ensure = (h: number) => {
    if (y - h < BOTTOM) newPage();
  };

  const drawRule = (yy: number) => {
    cur += `q 0.85 0.85 0.85 RG 0.6 w ${num(MARGIN)} ${num(yy)} m ${num(PAGE_W - MARGIN)} ${num(yy)} l S Q\n`;
  };

  const drawText = (
    str: string,
    x: number,
    baseline: number,
    font: "F1" | "F2",
    size: number,
    color: RGB,
  ) => {
    cur += `BT /${font} ${size} Tf ${color.join(" ")} rg 1 0 0 1 ${num(x)} ${num(baseline)} Tm (${escapePdf(str)}) Tj ET\n`;
  };

  const paragraph = (
    raw: string,
    font: "F1" | "F2",
    size: number,
    color: RGB,
    gap: number,
    indent = 0,
  ) => {
    const bold = font === "F2";
    const lh = size * 1.42;
    for (const line of wrap(norm(raw), bold, size, CONTENT_W - indent)) {
      ensure(lh);
      drawText(line, MARGIN + indent, y - size, font, size, color);
      y -= lh;
    }
    y -= gap;
  };

  const bullet = (raw: string) => {
    ensure(10 * 1.42);
    drawText(String.fromCharCode(BULLET), MARGIN, y - 10, "F1", 10, BODY);
    paragraph(raw, "F1", 10, BODY, 5, 16);
  };

  // --- Document head ---------------------------------------------------------
  paragraph(doc.kicker.toUpperCase(), "F1", 8, GRAY, 5);
  paragraph(doc.title, "F2", 24, BLACK, 6);
  paragraph(`Last updated — ${doc.updated}`, "F1", 8, GRAY, 12);
  y += 4;
  drawRule(y);
  y -= 18;
  for (const p of doc.intro) paragraph(p, "F1", 10.5, BODY, 8);
  y -= 8;

  // --- Numbered clauses ------------------------------------------------------
  doc.sections.forEach((section, i) => {
    ensure(64);
    y -= 6;
    drawRule(y);
    y -= 18;
    paragraph(`/${pad2(i + 1)}`, "F1", 8, GRAY, 4);
    paragraph(section.title, "F2", 14, BLACK, 8);

    section.paragraphs?.forEach((p) => paragraph(p, "F1", 10, BODY, 7));
    section.bullets?.forEach((b) => bullet(b));
    section.items?.forEach((it, j) => {
      paragraph(`${pad2(j + 1)}   ${it.label}`, "F2", 10.5, BLACK, 3);
      paragraph(it.body, "F1", 10, BODY, 8, 16);
    });
  });

  pages.push(cur);

  return assemble(pages);
}

/** Wrap the page content streams into a complete PDF file. */
function assemble(pages: string[]): Uint8Array {
  type Obj = { num: number; body: string };
  const objects: Obj[] = [];
  const add = (n: number, body: string) => objects.push({ num: n, body });

  add(1, "<< /Type /Catalog /Pages 2 0 R >>");
  add(
    3,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  );
  add(
    4,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  );

  const kids: string[] = [];
  pages.forEach((content, i) => {
    const pageNum = 5 + i * 2;
    const contentNum = 6 + i * 2;
    kids.push(`${pageNum} 0 R`);
    add(
      pageNum,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] ` +
        `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentNum} 0 R >>`,
    );
    add(contentNum, `<< /Length ${content.length} >>\nstream\n${content}endstream`);
  });

  add(2, `<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${pages.length} >>`);

  objects.sort((a, b) => a.num - b.num);

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  for (const o of objects) {
    offsets[o.num] = pdf.length;
    pdf += `${o.num} 0 obj\n${o.body}\nendobj\n`;
  }

  const xrefStart = pdf.length;
  const size = objects.length + 1; // + the free object 0
  pdf += `xref\n0 ${size}\n0000000000 65535 f \n`;
  for (let n = 1; n < size; n++) {
    pdf += `${String(offsets[n] ?? 0).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${size} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  // All bytes are 7-bit, so a byte-per-char copy is exact and keeps offsets valid.
  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xff;
  return bytes;
}
