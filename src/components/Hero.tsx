"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

/** One design pixel, matching globals.css --px (design width 1920). */
const dpx = () => window.innerWidth / 1920;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      let disposed = false;
      document.fonts.ready.then(() => {
        if (disposed) return;

        const h1 = el.querySelector(".hero-title");
        if (h1) {
          const split = new SplitText(h1, { type: "words" });
          gsap.set(split.words, { autoAlpha: 0, y: "80vh" });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "top top-=55%",
              scrub: 0.4,
            },
          });
          tl.to(split.words, {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
          });
        }

        // The full headline stays pinned (sticky) while stage-1 scrolls, then
        // drifts up, shrinks, and fades across a wide scroll window so it
        // lingers well into the page before disappearing.
        gsap.to(".hero-stage-1 .hero-inner", {
          autoAlpha: 0,
          yPercent: -18,
          scale: 0.96,
          transformOrigin: "50% 50%",
          ease: "power1.in",
          scrollTrigger: {
            trigger: el,
            start: "top top-=150%",
            end: "top top-=310%",
            scrub: true,
          },
        });

        // Stages 2 & 3: lines slide in horizontally from alternating sides while
        // pinned. The original fires this between 1.25x and 1.9x viewport past the
        // stage's top, then holds the finished line for the rest of the sticky run.
        el.querySelectorAll<HTMLElement>(".hero-stage-scrub").forEach((stage) => {
          const lines = stage.querySelectorAll<HTMLElement>(".hero-line");
          if (!lines.length) return;
          // Each line lands well before the next starts: the first is settled
          // ~20% into the window, the last exactly at its end.
          gsap.fromTo(
            lines,
            {
              x: (i: number) => (i % 2 === 0 ? -1 : 1) * 64 * dpx(),
              autoAlpha: 0,
            },
            {
              x: 0,
              autoAlpha: 1,
              duration: 0.4,
              stagger: 0.5,
              ease: "none",
              scrollTrigger: {
                trigger: stage,
                start: "top top-=100%",
                end: "top top-=190%",
                scrub: true,
              },
            }
          );
        });

        ScrollTrigger.refresh();
      });

      // Scroll indicator: dot travels down the pill on a loop, then the whole
      // indicator fades the moment the visitor starts scrolling.
      const dot = el.querySelector<HTMLElement>(".scroll-indicator-dot");
      if (dot) {
        gsap.fromTo(
          dot,
          { yPercent: -100 },
          { yPercent: 260, duration: 1.3, ease: "power1.inOut", repeat: -1, repeatDelay: 0.35 }
        );
      }
      gsap.to(".scroll-indicator", {
        autoAlpha: 0,
        scrollTrigger: {
          trigger: el,
          start: "top top-=2%",
          end: "top top-=7%",
          scrub: true,
        },
      });

      return () => {
        disposed = true;
      };
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={ref} data-gl-section="0" className="pb-section relative">
      {/* Stage 1 — tall section; hero-inner is sticky so the headline stays
          pinned on screen while the user scrolls through the extra travel,
          then fades out gradually before stage 2 takes over. */}
      <div className="hero-stage-1 relative h-[350vh] w-full">
        <div className="hero-inner sticky top-0 flex min-h-svh w-full flex-col items-center justify-center relative">
          <h1 className="h1 hero-title text-center">we form identities.</h1>

          {/* Scroll indicator — fades out as soon as scrolling begins */}
          <div className="scroll-indicator pointer-events-none absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
            <div className="relative h-11 w-px overflow-hidden bg-black/15">
              <div className="scroll-indicator-dot absolute left-0 top-0 w-full rounded-full bg-black/55" style={{ height: "40%" }} />
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/35">Scroll</span>
          </div>
        </div>
      </div>

      <div className="relative w-full pl-[20.8333vw] pr-[4.1666vw] max-s:pl-15 max-s:pr-15">
        {/* Stage 2 — line breaks and the ragged right edge are authored, not
            width-driven; the trailing margins step the lines in from the right. */}
        <div
          data-hero-stage-2
          className="hero-stage-scrub relative h-[550vh] mt-[40vh] max-s:h-[250vh]"
        >
          <div className="hero-inner sticky top-0 z-2 flex min-h-svh flex-col items-end justify-center">
            <h2 className="h2 hero-h2 section-title text-right">
              <div className="mr-[370] max-s:mr-30">
                <div className="hero-line">Great design</div>
              </div>
              <div className="mr-52 max-s:mr-30">
                <div className="hero-line">doesn&rsquo;t just guide</div>
              </div>
              <div className="mr-52 max-s:mr-10">
                <div className="hero-line">behavior,</div>
              </div>
            </h2>
          </div>
        </div>

        {/* Stage 3 — leading margins step the lines out into a staircase. */}
        <div className="hero-stage-scrub relative h-[550vh] -mb-[40vh] max-s:h-[250vh]">
          <div className="hero-inner sticky top-0 z-2 flex min-h-svh flex-col items-start justify-center">
            <h2 className="h2 hero-h2 section-title">
              <div>
                <div className="hero-line">It speaks</div>
              </div>
              <div className="ml-113 max-s:ml-30">
                <div className="hero-line">directly to</div>
              </div>
              <div className="ml-350 max-s:ml-70">
                <div className="hero-line">the nervous</div>
              </div>
              <div className="ml-780 max-s:ml-140">
                <div className="hero-line">system.</div>
              </div>
            </h2>
          </div>
        </div>
      </div>
    </header>
  );
}
