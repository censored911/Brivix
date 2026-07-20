import { buildLegalPdf } from "@/lib/legalPdf";
import { TERMS } from "@/data/legal";

/**
 * Serves the Terms & Conditions as a single downloadable PDF, generated from
 * the same `TERMS` object the page renders — so the two can never drift.
 *
 * Security posture: the handler reads nothing from the request (no query,
 * headers, cookies, or body), so there is no user-controlled input and nothing
 * to inject or tamper with. Output is deterministic bytes from statically
 * compiled data, which lets us prerender it (`force-static`): in production the
 * file is a build-time asset with no per-request code execution. Response
 * headers force an attachment download, forbid MIME sniffing, and apply a
 * locked-down CSP so the file cannot act as a script/HTML vector if opened.
 */
export const dynamic = "force-static";

const FILENAME = "Brivix-Terms-and-Conditions.pdf";

export function GET(): Response {
  const pdf = buildLegalPdf(TERMS);

  return new Response(pdf as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${FILENAME}"`,
      "Content-Length": String(pdf.byteLength),
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
