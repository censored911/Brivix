"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { serviceGroups } from "@/data/content";
import { CONTACT_EMAIL } from "@/lib/contact";
import ContactLink from "@/components/ContactLink";

function AccordionItem({
  title,
  body,
  related,
  step,
}: {
  title: string;
  body: string;
  related: string[];
  step: number;
}) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const el = contentRef.current;
    if (!el) return;
    const next = !open;
    setOpen(next);
    gsap.to(el, {
      height: next ? "auto" : 0,
      duration: 0.6,
      ease: "power3.inOut",
      // Layout height changed — retrigger positions (footer model, section
      // fades) are stale until ScrollTrigger recomputes them.
      onComplete: () => ScrollTrigger.refresh(),
    });
  };

  return (
    <div
      data-service-item
      className="services_item white-gradient-light backdrop-blur-md border-b border-black/10 max-s:ml-0!"
      style={{ marginLeft: `calc(${step * 18} * var(--px))` }}
    >
      <div
        className="flex items-center gap-10 px-20 py-20 cursor-pointer group hover:bg-white/50 transition-colors duration-[400ms]"
        onClick={toggle}
        role="button"
        aria-expanded={open}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
      >
        <span
          className={`relative w-12 h-12 shrink-0 transition-transform duration-[400ms] ${
            open ? "rotate-45" : ""
          }`}
          style={{ transitionTimingFunction: "var(--smooth)" }}
          aria-hidden
        >
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-px w-full bg-black" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-px w-full bg-black rotate-90" />
        </span>
        <span className="_27">{title}</span>
      </div>

      <div ref={contentRef} className="h-0 overflow-hidden">
        <div className="px-20 pb-30 pt-5">
          <p className="_20" style={{ maxWidth: "calc(600 * var(--px))" }}>
            {body}
          </p>
          <div className="_9 font-mono uppercase mt-30 mb-10">
            Related Services
          </div>
          <ul className="flex flex-col gap-6">
            {related.map((item) => (
              <li key={item} className="_16">
                {item}
              </li>
            ))}
          </ul>
          <ContactLink className="_9 font-mono uppercase mt-20 inline-block">
            Reach out for examples! &rarr; {CONTACT_EMAIL}
          </ContactLink>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const h2 = section.querySelector<HTMLElement>(".section-title");
      let split: SplitText | undefined;

      // 1. Title reveal: words fire in with a springy overshoot — neurons
      //    lighting up one after another. Replays on re-entry from either
      //    direction. No line masks; the overshoot needs room to breathe.
      if (h2) {
        document.fonts.ready.then(() => {
          if (!ctx.data) return; // context reverted before fonts loaded
          ctx.add(() => {
            split = new SplitText(h2, { type: "lines,words" });
            gsap.fromTo(
              split.words,
              { autoAlpha: 0, scale: 0.8, y: 30, transformOrigin: "50% 100%" },
              {
                autoAlpha: 1,
                scale: 1,
                y: 0,
                stagger: 0.09,
                duration: 0.9,
                ease: "back.out(1.6)",
                scrollTrigger: {
                  trigger: h2,
                  start: "top 80%",
                  toggleActions: "restart none restart reverse",
                },
              }
            );
            ScrollTrigger.refresh();
          });
        });
      }

      // 2. Group fade-ups (header + items, staggered per group)
      const groups = gsap.utils.toArray<HTMLElement>(
        "[data-service-group]",
        section
      );
      groups.forEach((group) => {
        const els = gsap.utils.toArray<HTMLElement>(
          "[data-service-header], [data-service-item]",
          group
        );
        gsap.from(els, {
          autoAlpha: 0,
          y: 40,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: group,
            start: "top 85%",
            once: true,
          },
        });
      });

      return () => {
        split?.revert();
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      data-gl-section="3"
      className="pt-section pb-[80vh] relative z-1"
    >
      <h2 className="h1 section-title split-mask ml-260 max-s:ml-20 max-s:mr-20 max-w-[800] mb-120">
        we excite neurons.
      </h2>

      <div className="flex flex-col gap-120 ml-400 max-s:ml-0">
        {serviceGroups.map((group) => (
          <div key={group.category} data-service-group>
            <div
              data-service-header
              className="bg-white pl-20 py-40 flex items-baseline gap-10"
            >
              <h3 className="h3">{group.category}</h3>
              <span className="_9 font-mono uppercase">/services</span>
            </div>

            {group.items.map((item, i) => (
              <AccordionItem
                key={item.title}
                title={item.title}
                body={item.body}
                related={item.related}
                step={i}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
