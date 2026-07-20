"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

const PILLARS = [
  {
    title: "Transform",
    body: "We rebuild existing websites into modern, engaging experiences that capture attention, earn trust, and convert visitors into customers.",
  },
  {
    title: "Convert",
    body: "We turn generic ecommerce stores into high-performing shops through strategic UX, sharper UI, conversion optimization, and speed.",
  },
  {
    title: "Create",
    body: "We design and develop premium websites from scratch — planning, UI/UX, branding, color systems, animations, interactions, and 3D when it earns its place.",
  },
  {
    title: "Grow",
    body: "We shape brand identities and run digital marketing that brings the right audience to your door. Media buying is coming soon.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Discover",
    body: "We start by understanding your business, your audience, and what success looks like for you. No assumptions — just good questions, research, and a clear brief we both agree on.",
  },
  {
    step: "02",
    title: "Design",
    body: "We craft the look, feel, and flow of your website — layouts, color systems, typography, and interactions — refined with your feedback at every step, so there are no surprises at the end.",
  },
  {
    step: "03",
    title: "Build",
    body: "We develop your website with modern technology, tested across browsers and devices, tuned for speed, and ready to grow with your business.",
  },
  {
    step: "04",
    title: "Optimize",
    body: "Launch is the beginning, not the end. We measure how real visitors behave, then refine and support your website so it keeps performing long after day one.",
  },
];

const VALUES = [
  {
    title: "Clarity",
    body: "We explain our thinking in plain language. You’ll always know what we’re doing, why we’re doing it, and what happens next.",
  },
  {
    title: "Craft",
    body: "Details matter. The last 10% of polish is where premium lives, and we never skip it.",
  },
  {
    title: "Results",
    body: "Beautiful is not the goal — beautiful and effective is. Every design decision is tied to a business outcome.",
  },
  {
    title: "Partnership",
    body: "We work with you, not just for you. Honest advice, fast communication, and no surprises.",
  },
];

const REASONS = [
  "One team for design, development, and conversion — nothing gets lost between agencies.",
  "Senior attention on every project. Your website is never handed down the line.",
  "A transparent process with clear milestones, honest timelines, and open communication.",
  "Websites built to keep performing — fast, measurable, and ready to grow with you.",
];

/** Hairline + mono index row shared by every numbered section. */
function SectionHead({ index, label }: { index: string; label: string }) {
  return (
    <div data-head>
      <span data-head-rule className="block h-px bg-black/25 opacity-0" />
      <div className="flex items-baseline justify-between pt-25 font-mono _9 uppercase">
        <span data-head-item className="opacity-0">/{index}</span>
        <span data-head-item className="opacity-0">{label}</span>
      </div>
    </div>
  );
}

export default function AboutContent() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let disposed = false;

    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", (ctx) => {
      const splits: SplitText[] = [];

      // ---- Manifesto hero: kicker words settle in, the brand name rises
      //      out of a mask, then the copy resolves out of a blur — the same
      //      "coming into focus" beat the landing uses for memory.
      document.fonts.ready.then(() => {
        if (disposed) return;
        ctx.add(() => {
          const kicker = root.querySelector<HTMLElement>("[data-hero-kicker]");
          const title = root.querySelector<HTMLElement>("[data-hero-title]");
          const copy = gsap.utils.toArray<HTMLElement>("[data-hero-copy]", root);

          // The Loader counter runs 0–1.4s, then the curtain lifts until
          // ~2.3s. Starting here means the hero is mid-reveal as the curtain
          // clears the center of the screen — alive, not already settled.
          const tl = gsap.timeline({
            delay: 1.6,
            defaults: { ease: "power3.out" },
          });

          if (kicker) {
            const split = new SplitText(kicker, { type: "words" });
            splits.push(split);
            tl.from(split.words, {
              autoAlpha: 0,
              y: 12,
              duration: 0.6,
              stagger: 0.02,
            });
          }

          if (title) {
            const split = new SplitText(title, { type: "chars" });
            splits.push(split);
            tl.fromTo(
              split.chars,
              { yPercent: 110 },
              {
                yPercent: 0,
                duration: 1.1,
                ease: "power4.out",
                stagger: 0.05,
              },
              "-=0.3"
            );
          }

          if (copy.length) {
            tl.fromTo(
              copy,
              { autoAlpha: 0, y: 24, filter: "blur(8px)" },
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.9,
                stagger: 0.15,
                // Drop the inline blur(0px) once done so the elements don't
                // keep a filter-induced layer for the rest of the page's life.
                clearProps: "filter",
              },
              "-=0.55"
            );
          }

          // ---- Section titles: words rise out of masked lines as each
          //      section arrives; replays on re-entry like the landing titles.
          gsap.utils
            .toArray<HTMLElement>("[data-title]", root)
            .forEach((el) => {
              const split = new SplitText(el, {
                type: "lines,words",
                linesClass: "line",
              });
              splits.push(split);
              gsap.set(split.lines, { overflow: "hidden" });
              gsap.fromTo(
                split.words,
                { yPercent: 110 },
                {
                  yPercent: 0,
                  stagger: 0.06,
                  duration: 0.9,
                  ease: "power4.out",
                  scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "restart none restart reverse",
                  },
                }
              );
            });

          ScrollTrigger.refresh();
        });
      });

      // ---- Hero drifts up, softly shrinks, and fades as it scrolls away —
      //      mirroring the landing hero's exit.
      const hero = root.querySelector<HTMLElement>("[data-hero]");
      const heroInner = root.querySelector<HTMLElement>("[data-hero-inner]");
      if (hero && heroInner) {
        gsap.to(heroInner, {
          autoAlpha: 0,
          yPercent: -14,
          scale: 0.97,
          transformOrigin: "50% 50%",
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // ---- Section heads: the hairline draws itself across, then the mono
      //      index labels surface — structure appearing before content.
      gsap.utils.toArray<HTMLElement>("[data-head]", root).forEach((head) => {
        const rule = head.querySelector<HTMLElement>("[data-head-rule]");
        const items = gsap.utils.toArray<HTMLElement>("[data-head-item]", head);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: head, start: "top 88%", toggleActions: "play none none none" },
        });
        if (rule) {
          tl.fromTo(
            rule,
            { scaleX: 0, transformOrigin: "left center", autoAlpha: 0 },
            { scaleX: 1, autoAlpha: 1, duration: 1.1, ease: "power3.inOut" }
          );
        }
        tl.fromTo(
          items,
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.5"
        );
      });

      // ---- Pillar rows: hairline draw, title slides in from the left,
      //      body follows — one beat per row.
      gsap.utils.toArray<HTMLElement>("[data-pillar]", root).forEach((row) => {
        const rule = row.querySelector<HTMLElement>("[data-pillar-rule]");
        const title = row.querySelector<HTMLElement>("[data-pillar-title]");
        const body = row.querySelector<HTMLElement>("[data-pillar-body]");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 88%", toggleActions: "play none none none" },
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
        if (title) {
          tl.from(title, { autoAlpha: 0, x: -28, duration: 0.8 }, "-=0.6");
        }
        if (body) {
          tl.from(body, { autoAlpha: 0, y: 24, duration: 0.8 }, "-=0.55");
        }
      });

      // ---- Grid cells (process + values): fade up with a short cascade.
      //      (Plain stagger on purpose: grid:"auto" measures layout at tween
      //      creation and crashes on fresh loads before layout settles.)
      gsap.utils.toArray<HTMLElement>("[data-grid]", root).forEach((grid) => {
        const cells = gsap.utils.toArray<HTMLElement>("[data-cell]", grid);
        if (!cells.length) return;
        gsap.from(cells, {
          autoAlpha: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: grid, start: "top 85%", toggleActions: "play none none none" },
        });
      });

      // ---- Reasons: lines slide in from alternating sides — the same
      //      left/right cadence as the landing hero's scrub stages.
      const reasons = gsap.utils.toArray<HTMLElement>("[data-reason]", root);
      reasons.forEach((el, i) => {
        gsap.from(el, {
          autoAlpha: 0,
          x: (i % 2 === 0 ? -1 : 1) * 40,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
        });
      });

      // ---- Everything else: the shared fade-up vocabulary.
      gsap.utils.toArray<HTMLElement>("[data-fade]", root).forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
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
      {/* Manifesto hero */}
      <div data-hero className="-mx-80 max-s:-mx-20">
        <div
          data-hero-inner
          // Biased below centre by half the top padding. Dead-centre left an
          // equal void above and below a short block; the space above is read
          // as the nav's breathing room, the space below as a gap in the page.
          // Sitting low uses the top half and closes the band under the copy.
          className="flex min-h-svh flex-col items-center justify-center px-80 max-s:px-20 pt-[16svh] text-center"
        >
          <p
            data-hero-kicker
            className="_16 font-mono uppercase tracking-wider leading-[1.6] max-w-[420] mb-50"
          >
            We built Brivix with a single purpose — to turn overlooked
            websites into experiences that capture attention and convert it
            into growth.
          </p>
          <h1 data-hero-title className="h1 overflow-hidden mb-50">
            Brivix
          </h1>
          <div className="flex flex-col items-center gap-24 max-w-[440]">
            <p data-hero-copy className="_20">
              We were tired of websites that demand effort and give nothing
              back. So we build digital experiences that work quietly in the
              background — earning trust with every scroll.
            </p>
            <p data-hero-copy className="_20">
              Your website should serve your business, not consume it. Let the
              craft do the heavy lifting, so you can focus on the vision.
            </p>
          </div>
        </div>
      </div>

      {/* Story */}
      {/* No top margin here, unlike the sections below. The hero reserves a
          full viewport and centres a short block inside it, so it already ends
          with ~a third of a screen of slack — stacking the 200-unit section
          rhythm on top of that read as a dead band rather than a beat. */}
      <div className="ml-0 md:ml-285 max-w-[1100]">
        <SectionHead index="01" label="Our Story" />
        <h2 data-title className="_45 mt-40 max-w-[820]">
          Founded in 2024, built on a simple idea.
        </h2>
        <div className="flex flex-col gap-20 mt-40 max-w-[640]">
          <p data-fade className="_20">
            Most websites look busy but say nothing. And most redesigns change
            the paint without fixing the engine. Brivix started in 2024 to do
            both at once — design that captures attention, and strategy that
            turns attention into results.
          </p>
          <p data-fade className="_20">
            Today we work with businesses that want more from their online
            presence: brands ready to leave outdated websites behind, stores
            that want more from every visitor, and founders who want a premium
            website built right the first time.
          </p>
        </div>
      </div>

      {/* What we do */}
      <div className="ml-0 md:ml-285 max-w-[1100] mt-120">
        <SectionHead index="02" label="What We Do" />
        <h2 data-title className="_45 mt-40">
          Four ways we move brands forward.
        </h2>
        <div className="mt-60">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} data-pillar>
              <span data-pillar-rule className="block h-px bg-black/10" />
              <div className="flex flex-col gap-15 md:flex-row md:gap-0 py-35">
                <h3 data-pillar-title className="_35 md:w-[340] shrink-0">
                  {pillar.title}
                </h3>
                <p data-pillar-body className="_20 max-w-[560]">
                  {pillar.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Process */}
      <div className="ml-0 md:ml-285 max-w-[1100] mt-120">
        <SectionHead index="03" label="How We Work" />
        <h2 data-title className="_45 mt-40">
          A process with no guesswork.
        </h2>
        <div
          data-grid
          className="grid grid-cols-1 md:grid-cols-2 gap-x-80 gap-y-60 mt-60"
        >
          {PROCESS.map((phase) => (
            <div key={phase.step} data-cell>
              <div className="_9 font-mono uppercase border-b border-dashed border-black/40 pb-15">
                /{phase.step}
              </div>
              <h3 className="_27 mt-25">{phase.title}</h3>
              <p className="_20 mt-15 max-w-[480]">{phase.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="ml-0 md:ml-285 max-w-[1100] mt-120">
        <SectionHead index="04" label="What We Stand For" />
        <h2 data-title className="_45 mt-40">
          The standards behind the work.
        </h2>
        <div
          data-grid
          className="grid grid-cols-1 md:grid-cols-2 gap-x-80 gap-y-50 mt-60"
        >
          {VALUES.map((value) => (
            <div key={value.title} data-cell>
              <h3 className="_27 border-b border-black/10 pb-15">
                {value.title}
              </h3>
              <p className="_20 mt-15 max-w-[480]">{value.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Brivix + CTA */}
      <div className="ml-0 md:ml-285 max-w-[1100] mt-120 pb-120">
        <SectionHead index="05" label="Why Brivix" />
        <h2 data-title className="_45 mt-40 max-w-[820]">
          Why businesses choose to work with us.
        </h2>
        <ul className="flex flex-col mt-40 max-w-[720]">
          {REASONS.map((reason) => (
            <li
              key={reason}
              data-reason
              className="_20 border-b border-dashed border-black/25 py-20"
            >
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
