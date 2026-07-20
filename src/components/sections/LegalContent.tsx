"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import type { LegalDoc } from "@/data/legal";

/**
 * Renders either legal document. The motion is a deliberately quieter cut of
 * the About page vocabulary — masked title, blurred-in lead, hairline draws
 * per section — because a document people read should not fight the reader.
 */
export default function LegalContent({
  doc,
  pdfHref,
}: {
  doc: LegalDoc;
  /** When set, renders a Download-PDF button in the document head. */
  pdfHref?: string;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let disposed = false;
    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", (ctx) => {
      const splits: SplitText[] = [];

      document.fonts.ready.then(() => {
        if (disposed) return;
        ctx.add(() => {
          const kicker = root.querySelector<HTMLElement>("[data-hero-kicker]");
          const title = root.querySelector<HTMLElement>("[data-hero-title]");
          const lead = gsap.utils.toArray<HTMLElement>("[data-hero-copy]", root);

          // Matches the About hero: starts while the Loader curtain is still
          // clearing, so the page is mid-reveal rather than already settled.
          const tl = gsap.timeline({
            delay: 1.6,
            defaults: { ease: "power3.out" },
          });

          if (kicker) {
            tl.from(kicker, { autoAlpha: 0, y: 12, duration: 0.6 });
          }

          if (title) {
            const split = new SplitText(title, { type: "chars" });
            splits.push(split);
            tl.fromTo(
              split.chars,
              { yPercent: 110 },
              { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.04 },
              "-=0.3"
            );
          }

          if (lead.length) {
            tl.fromTo(
              lead,
              { autoAlpha: 0, y: 24, filter: "blur(8px)" },
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.9,
                stagger: 0.15,
                // Drop the inline filter so these keep no compositing layer.
                clearProps: "filter",
              },
              "-=0.55"
            );
          }

          ScrollTrigger.refresh();
        });
      });

      // Each clause: hairline draws across, then the heading and body surface.
      gsap.utils.toArray<HTMLElement>("[data-clause]", root).forEach((row) => {
        const rule = row.querySelector<HTMLElement>("[data-clause-rule]");
        const items = gsap.utils.toArray<HTMLElement>("[data-clause-item]", row);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          defaults: { ease: "power3.out" },
        });
        if (rule) {
          tl.from(rule, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 1,
            ease: "power3.inOut",
          });
        }
        tl.from(
          items,
          { autoAlpha: 0, y: 20, duration: 0.7, stagger: 0.08 },
          "-=0.6"
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-fade]", root).forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });

      return () => {
        splits.forEach((s) => s.revert());
      };
    });

    return () => {
      disposed = true;
      mm.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="relative z-1 px-80 max-s:px-20">
      {/* Document head */}
      <div className="ml-0 md:ml-285 max-w-[1100] pt-250 max-s:pt-180">
        <p
          data-hero-kicker
          className="_9 font-mono uppercase tracking-wider"
        >
          {doc.kicker}
        </p>
        <h1
          data-hero-title
          className="_45 overflow-hidden mt-25 max-w-[820]"
        >
          {doc.title}
        </h1>
        <div
          data-hero-copy
          className="flex flex-wrap items-center justify-between gap-15 mt-25 pb-20 border-b border-dashed border-black/40"
        >
          <p className="_9 font-mono uppercase">Last updated — {doc.updated}</p>
          {pdfHref && (
            <a
              href={pdfHref}
              download
              rel="nofollow noopener"
              aria-label={`Download ${doc.title} as PDF`}
              className="group inline-flex items-center gap-10 rounded-full border border-black/25 pl-16 pr-8 py-6 _9 font-mono uppercase tracking-wider transition-[color,background-color,border-color,transform] duration-[500ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-black hover:border-black hover:text-white active:scale-[0.98]"
            >
              Download PDF
              <span className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-black/20 transition-transform duration-[500ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-y-[1px] group-hover:border-white/40">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="h-11 w-11"
                >
                  <path
                    d="M12 3.5v11m0 0l-3.5-3.5M12 14.5l3.5-3.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.5 19.5h13"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </a>
          )}
        </div>
        <div className="flex flex-col gap-20 mt-40 max-w-[640]">
          {doc.intro.map((p) => (
            <p key={p} data-hero-copy className="_20">
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* Clauses */}
      <div className="ml-0 md:ml-285 max-w-[1100] mt-120 pb-200">
        {doc.sections.map((section, i) => (
          <div key={section.title} data-clause className="mt-60 first:mt-0">
            <span data-clause-rule className="block h-px bg-black/10" />
            <div className="flex flex-col gap-15 md:flex-row md:gap-0 pt-25">
              <h2
                data-clause-item
                className="_27 md:w-[340] shrink-0 md:pr-40"
              >
                <span className="_9 font-mono uppercase block mb-10 opacity-60">
                  /{String(i + 1).padStart(2, "0")}
                </span>
                {section.title}
              </h2>
              <div className="flex flex-col gap-15 max-w-[600]">
                {section.paragraphs?.map((p) => (
                  <p key={p} data-clause-item className="_20">
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul data-clause-item className="flex flex-col">
                    {section.bullets.map((b) => (
                      <li
                        key={b}
                        className="_20 border-b border-dashed border-black/25 py-15 last:border-b-0"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {section.items && (
                  <ol data-clause-item className="flex flex-col">
                    {section.items.map((item, j) => (
                      <li
                        key={item.label}
                        className="group grid grid-cols-[3ch_1fr] gap-x-20 py-20 border-b border-dashed border-black/25 last:border-b-0 first:pt-0"
                      >
                        <span className="_9 font-mono uppercase tracking-wider tabular-nums opacity-45 pt-[0.4em] transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:opacity-100 group-hover:translate-x-[2px]">
                          {String(j + 1).padStart(2, "0")}
                        </span>
                        <div className="flex flex-col gap-8">
                          <span className="_20 font-medium">{item.label}</span>
                          <span className="_16 opacity-70">{item.body}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
