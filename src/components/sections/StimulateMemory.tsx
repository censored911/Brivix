"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { sectorRows, principles } from "@/data/content";

const MARQUEE_DURATIONS = ["40s", "50s", "40s"];

export default function StimulateMemory() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // 1. Title reveal: words resolve out of a soft blur — a memory coming
      //    into focus. Replays on re-entry from either direction. No line
      //    masks here; blur needs to bleed past the line box.
      const title = root.querySelector<HTMLElement>(".section-title");
      if (title) {
        document.fonts.ready.then(() => {
          const split = new SplitText(title, { type: "lines,words" });
          gsap.fromTo(
            split.words,
            { autoAlpha: 0, filter: "blur(14px)", y: 20 },
            {
              autoAlpha: 1,
              filter: "blur(0px)",
              y: 0,
              stagger: 0.1,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: title,
                start: "top 85%",
                toggleActions: "restart none restart reverse",
              },
            }
          );
          ScrollTrigger.refresh();
        });
      }

      // 2. Element reveals: every block inside the card fades up on its own
      //    as it enters the viewport.
      gsap.utils.toArray<HTMLElement>("[data-reveal]", root).forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        });
      });

    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="clients"
      data-gl-section="2"
      className="py-section relative z-1"
      ref={rootRef}
    >
      <h2 className="h1 section-title relative z-2 ml-380 max-s:ml-20 max-w-700">
        we stimulate memory.
      </h2>

      <div
        data-card
        className="ml-380 max-s:ml-0 w-1190 max-w-full mt-80 relative p-100 max-s:p-30 backdrop-blur-sm"
        style={{ background: "rgba(245,245,245,0.92)" }}
      >
        <div
          data-reveal
          className="flex items-baseline justify-between font-mono uppercase border-b border-black/25 pb-20 mb-70"
        >
          <span className="_9">(Trusted By)</span>
          <span className="_9">Growing Businesses</span>
        </div>

        {/* Both --spacing and --px rebase from /1920 to /390 under the s
            breakpoint, so these utility numbers are ~2.5x wider on a phone
            than the desktop design intends — hence the max-s tightening here
            and on the items, or the marquee shows one word at a time. */}
        <div className="flex flex-col gap-60 max-s:gap-36">
          {sectorRows.map((row, i) => (
            <div
              key={i}
              data-reveal
              className="overflow-hidden"
              style={{
                maskImage:
                  "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
              }}
            >
              <div
                className={`marquee-track${i === 1 ? " rev" : ""}`}
                style={
                  {
                    "--marquee-duration": MARQUEE_DURATIONS[i],
                  } as React.CSSProperties
                }
              >
                {/* Doubled so the track loops seamlessly — same contract the
                    logo marquee used. The duplicate half is decorative
                    repetition, so it is hidden from assistive tech. */}
                {[...row, ...row].map((name, j) => (
                  <div
                    key={`${name}-${j}`}
                    className="marquee-item pr-120 max-s:pr-40 shrink-0 flex items-center gap-60 max-s:gap-20"
                    aria-hidden={j >= row.length}
                  >
                    {/* Desktop keeps the 45-design-px display size. On phones a
                        dedicated size (see .marquee-name) shrinks each name so
                        two-plus fit the 390 viewport and the loop reads as
                        continuous motion rather than one word at a time —
                        --px rebasing to /390 makes the desktop multiplier far
                        too large otherwise. */}
                    <span className="marquee-name _45 whitespace-nowrap leading-none">
                      {name}
                    </span>
                    <span className="_16 font-mono opacity-30 shrink-0">✳</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          data-reveal
          className="mt-80 border-t border-black/15"
        />

        <div
          data-reveal
          className="mt-40 flex items-baseline justify-between font-mono _9 uppercase"
        >
          <span>(Operations)</span>
          <span>Standards</span>
        </div>

        <div className="mt-70 grid grid-cols-1 gap-y-40 gap-x-25 sm:grid-cols-2 md:grid-cols-4">
          {principles.map((p) => (
            <div key={p.index} data-reveal>
              <div className="border-b border-black/40 pb-20 flex items-baseline gap-12">
                <span className="_9 font-mono opacity-45">{p.index}</span>
                <span className="_27 leading-none">{p.title}</span>
              </div>
              <p className="_16 pt-20 pb-15 border-b border-dashed border-black/40 leading-[1.45]">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
