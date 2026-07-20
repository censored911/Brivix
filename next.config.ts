import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * Every route here is statically prerendered (`next build` reports all pages
 * as `○ Static`). Next can only inject a CSP nonce during server-side
 * rendering, so a nonce-based policy would force every page into dynamic
 * rendering — a real cost for a marketing site, to defend inline scripts that
 * are all our own build output. So this is a static policy instead, and
 * `script-src`/`style-src` must permit 'unsafe-inline':
 *
 *   - Next emits an inline bootstrap script per page for hydration.
 *   - Tailwind + `style={{ ... }}` attributes across the components are
 *     inline styles.
 *
 * That is the honest trade for staying static. The rest of the policy is
 * still worth having: it locks down where scripts, connections, frames and
 * objects may come from at all, which is what actually contains an injection.
 *
 * `connect-src` carries api.open-meteo.com for the Nav weather widget — the
 * only outbound request the site makes.
 *
 * Development needs two extra allowances, and only development gets them:
 * React's dev build calls `eval()` for debugging features (rebuilding
 * callstacks, the component inspector), and Turbopack's HMR client opens a
 * websocket back to the dev server. Neither is present in `next build` output,
 * so the shipped policy stays as strict as it was.
 */
const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  // `blob:` is required by three.js, not by our own code: GLTFLoader unpacks
  // the textures embedded in each .glb into blob: URLs and fetches them back.
  // Without it every model loads geometry but renders untextured. blob: URLs
  // are minted by this document and are same-origin, so this widens the policy
  // to the page's own objects — no external origin gains anything.
  `connect-src 'self' blob: https://api.open-meteo.com${isDev ? " ws: wss:" : ""}`,
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // Clickjacking cover that does not depend on the CSP being enforced —
  // `frame-ancestors` is inert while a policy is Report-Only, this is not.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  // Drop the `x-powered-by: Next.js` version banner.
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
