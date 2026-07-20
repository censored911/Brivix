"use client";

import type Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Scroll so a section's content — not its border box — sits at the top of
 * the viewport. Sections carry 100vh of pacing padding (`.py-section` /
 * `.pt-section`), so landing on the raw element top shows the previous
 * section's imagery. Offsetting by the padding, minus a little headroom,
 * lands on the section's own headline.
 */
export function scrollToSection(el: HTMLElement, immediate = false) {
  const pad = parseFloat(getComputedStyle(el).paddingTop) || 0;
  const offset = Math.max(0, pad - window.innerHeight * 0.15);

  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset, immediate, duration: 1.4 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: immediate ? "auto" : "smooth" });
  }
}

/**
 * Click handler for `/#section` links — shared by the nav and the footer,
 * which need identical behaviour.
 *
 * In-page links smooth-scroll through Lenis instead of taking the native hash
 * jump. Links to other pages, and hash links whose target is absent from the
 * current page, fall through to normal navigation untouched.
 *
 * `onNavigate` fires only on the paths that actually navigate or scroll (the
 * nav uses it to close its mobile menu — deliberately *not* called when the
 * target is missing and the browser is about to leave the page anyway).
 * `restartLenis` is for callers that freeze Lenis while an overlay is open:
 * it ignores `scrollTo` while stopped, so it has to be running first.
 */
export function handleHashClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  { onNavigate, restartLenis = false }: {
    onNavigate?: () => void;
    restartLenis?: boolean;
  } = {}
) {
  if (!href.startsWith("/#")) {
    onNavigate?.();
    return;
  }
  const target = document.getElementById(href.slice(2));
  if (!target) return;
  e.preventDefault();
  history.replaceState(null, "", href.slice(1));
  if (restartLenis) window.__lenis?.start();
  onNavigate?.();
  scrollToSection(target);
}
