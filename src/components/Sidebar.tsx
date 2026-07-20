"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

const RAIL_ITEMS = ["EXPERIENTIAL", "BRANDING", "DIGITAL"];

/** One design pixel, matching globals.css --px (design width 1920). */
const dpx = () => window.innerWidth / 1920;

export default function Sidebar() {
  const [time, setTime] = useState<string | null>(null);
  const marksRef = useRef<HTMLDivElement>(null);
  const sectionFadeRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "Africa/Cairo",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // The brand marks stay dark while the opening headline owns the screen,
  // resolve in as the user scrolls toward "Great design…", then dissolve again
  // on approach to the footer so the fixed rail hands off cleanly to the
  // footer's own wordmark instead of sitting on top of it.
  //
  // Both fades are scroll-position-driven rather than triggered, so returning
  // to the hero — by scroll, by refresh, or by a CTA back to "/" — always
  // replays them exactly.
  //
  // The fades own different elements and different properties on purpose. A
  // scrubbed tween renders its start state whenever the page sits outside its
  // range, so sharing a property would let each fade clobber the other at the
  // opposite end of the page. Nesting multiplies the opacities instead, and
  // only the outer wrapper touches visibility — an explicit `visible` on the
  // inner one would defeat the outer's `hidden` rather than compose with it.
  //
  // A middle wrapper dips the marks out while "we activate nerves." owns the
  // screen and brings them back for "we stimulate memory.". That out-and-back
  // shape can't be split across two triggers on one property (see above), so
  // a single scrubbed timeline spanning both sections drives it.
  useEffect(() => {
    const marks = marksRef.current;
    const sectionFade = sectionFadeRef.current;
    const inner = innerRef.current;
    const heroStage = document.querySelector<HTMLElement>("[data-hero-stage-2]");
    const footer = document.getElementById("footer");
    const approach = document.getElementById("approach");
    const clients = document.getElementById("clients");
    if (!marks || !sectionFade || !inner) return;

    const ctx = gsap.context(() => {
      if (heroStage) {
        gsap.fromTo(
          marks,
          { autoAlpha: 0, y: () => 10 * dpx() },
          {
            autoAlpha: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              // Fully resolved by the time the stage reaches the top of the
              // viewport — i.e. when the user has arrived at the headline.
              trigger: heroStage,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          }
        );
      }

      if (approach && clients) {
        // Fade out on approach to "we activate nerves.", stay hidden while
        // it's in view, resolve back in as "we stimulate memory." arrives.
        // Scrub maps the segments onto the scroll distance between the two
        // sections; the long middle hold is what keeps the marks hidden.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: approach,
              start: "top 80%",
              endTrigger: clients,
              end: "top 60%",
              scrub: true,
            },
          })
          .to(sectionFade, { opacity: 0, ease: "none", duration: 1 })
          .set(sectionFade, { visibility: "hidden" })
          .to(sectionFade, { opacity: 0, ease: "none", duration: 3 })
          .set(sectionFade, { visibility: "inherit" })
          .to(sectionFade, { opacity: 1, ease: "none", duration: 1 });
      }

      if (footer) {
        gsap.fromTo(
          inner,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: footer,
              start: "top bottom+=30%",
              end: "top bottom",
              scrub: true,
              // Drop the click target once the logo is invisible; `inherit`
              // hands visibility back to the hero fade rather than pinning it.
              onLeave: () => gsap.set(inner, { visibility: "hidden" }),
              onEnterBack: () => gsap.set(inner, { visibility: "inherit" }),
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Left rail */}
      {/* Hidden on mobile: with the content gutters collapsed there is no
          clear column, so the fixed marks would sit on top of the sections;
          the mobile nav bar carries the wordmark instead. */}
      <div className="sidebar fixed z-10 left-15 top-20 bottom-20 grid grid-rows-3 items-start pointer-events-none max-s:hidden">
        {/* top: vertical service labels */}
        <div className="flex flex-col items-center gap-15 justify-self-start max-l:hidden">
          {RAIL_ITEMS.map((item, i) => (
            <div key={item} className="contents">
              {i > 0 && <div className="h-px bg-current w-12 rotate-90" />}
              <div className="_9 font-mono v-text uppercase">{item}</div>
            </div>
          ))}
        </div>
        {/* middle: wordmark + accent sign */}
        <div ref={marksRef} className="self-center">
          <div ref={sectionFadeRef}>
            <div ref={innerRef} className="relative">
              <Link href="/" className="flex flex-row items-end gap-11 pointer-events-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/brivix-logo.svg" alt="Brivix" className="w-160 max-s:w-110 h-auto" />
              </Link>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/sidebar-sign.svg"
                alt=""
                className="absolute -left-15 w-170 max-s:w-120 max-w-none h-auto"
                style={{ top: "calc(100% + 30 * var(--px))" }}
              />
            </div>
          </div>
        </div>
        {/* bottom: made with love */}
        <div className="_9 font-mono v-text uppercase self-end">
          ● Made with love
        </div>
      </div>

      {/* Right rail: clock + coordinates */}
      <div className="fixed z-10 right-15 top-0 bottom-0 flex flex-col items-center justify-center pointer-events-none max-l:hidden">
        <div className="_9 font-mono v-text uppercase whitespace-nowrap">
          {time ?? "00:00:00"}&nbsp;&nbsp;|&nbsp;&nbsp;30.0444° N, 31.2357° E&nbsp;&nbsp;●
        </div>
      </div>
    </>
  );
}
