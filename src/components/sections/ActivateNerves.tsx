"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { nervesBlocks } from "@/data/content";

export default function ActivateNerves() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let disposed = false;

    const ctx = gsap.context(() => {
      const h2 = section.querySelector<HTMLElement>(".section-title");
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", section);

      let split: SplitText | undefined;

      // 1. Title reveal: char-by-char cascade rising out of masked lines —
      //    an impulse traveling through the headline. Replays on re-entry
      //    from either direction.
      if (h2) {
        document.fonts.ready.then(() => {
          if (disposed) return; // context reverted before fonts loaded
          ctx.add(() => {
            split = new SplitText(h2, {
              type: "lines,words,chars",
              linesClass: "line",
            });
            gsap.set(split.lines, { overflow: "hidden" });
            gsap.fromTo(
              split.chars,
              { yPercent: 110 },
              {
                yPercent: 0,
                stagger: 0.02,
                duration: 0.9,
                ease: "power4.out",
                scrollTrigger: {
                  trigger: h2,
                  start: "top 85%",
                  toggleActions: "restart none restart reverse",
                },
              }
            );
            ScrollTrigger.refresh();
          });
        });
      }

      // 2. Card reveals: one timeline per card — media clips open first,
      //    then index row, title, and paragraphs cascade in. Replays on
      //    re-entry (reverses out when scrolled back above the card).
      cards.forEach((card) => {
        const media = card.querySelector<HTMLElement>("[data-media]");
        const img = card.querySelector<HTMLElement>("[data-media] img");
        const fades = gsap.utils.toArray<HTMLElement>("[data-fade]", card);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        if (media) {
          tl.fromTo(
            media,
            { clipPath: "inset(12% 0 12% 0)", autoAlpha: 0, y: 60 },
            {
              clipPath: "inset(0% 0 0% 0)",
              autoAlpha: 1,
              y: 0,
              duration: 1.1,
              ease: "power3.out",
            }
          );
        }

        tl.fromTo(
          fades,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
          },
          media ? "-=0.7" : 0
        );

        // Scrubbed parallax drift inside the frame (scale gives it bleed room)
        if (img && media) {
          gsap.fromTo(
            img,
            { yPercent: -6, scale: 1.12 },
            {
              yPercent: 6,
              scale: 1.12,
              ease: "none",
              scrollTrigger: {
                trigger: media,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });
    }, section);

    return () => {
      disposed = true;
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="approach"
      data-gl-section="1"
      className="py-section relative z-1"
    >
      <div className="px-80 max-s:px-20">
        <h2 className="h1 section-title split-mask ml-100 max-s:ml-0 max-w-[900]">
          we trigger 
          <br />
          Insight.
          
        </h2>

        <div className="mx-auto mt-190 w-[1190] max-w-full flex flex-col gap-120 l:flex-row l:gap-80">
          {nervesBlocks.map((block, i) => (
            <article
              key={block.heading}
              data-card
              className={`group flex-1 min-w-0 ${i === 1 ? "l:mt-160" : ""}`}
            >
              <div data-media className="overflow-hidden">
                <div className="nerves-zoom">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={block.image}
                    alt={block.alt}
                    loading="lazy"
                    decoding="async"
                    className="block w-full aspect-[3/2] object-cover"
                  />
                </div>
              </div>

              <div
                data-fade
                className="mt-40 flex items-baseline justify-between border-t border-black/25 pt-25 font-mono _9"
              >
                <span>/{String(i + 1).padStart(2, "0")}</span>
                <span>APPROACH</span>
              </div>

              <h3 data-fade className="_35 sm_27 font-medium mt-30">
                {block.heading}
              </h3>

              <div className="flex flex-col gap-20 mt-30 max-w-[490]">
                {block.paragraphs.map((p) => (
                  <p key={p} data-fade className="_20 sm_14">
                    {p}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
