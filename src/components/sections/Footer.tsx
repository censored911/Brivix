"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { handleHashClick } from "@/lib/scrollToSection";
import { CONTACT_EMAIL } from "@/lib/contact";
import ContactLink from "@/components/ContactLink";

// `contact` entries render through ContactLink (chooser) rather than a plain
// anchor — the href lives inside that component.
const COLUMNS: {
  header: string;
  links: { label: string; href?: string; contact?: true }[];
}[] = [
  {
    header: "PRIMARY",
    links: [
      { label: "Approach", href: "/#approach" },
      { label: "Clients", href: "/#clients" },
      { label: "Services", href: "/#services" },
    ],
  },
  {
    header: "GO DEEPER",
    links: [{ label: "About", href: "/about" }],
  },
  {
    header: "SOCIAL",
    links: [
      { label: "Instagram", href: "https://www.instagram.com/itsbrivix/" },
    ],
  },
  {
    header: "WANT TO SEE OUR WORK?",
    links: [{ label: CONTACT_EMAIL, contact: true }],
  },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [time, setTime] = useState<string | null>(null);

  const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) =>
    handleHashClick(e, href);

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "Africa/Cairo",
        })
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline fades in on its own as it scrolls into view.
      gsap.from("[data-footer-title]", {
        autoAlpha: 0,
        y: 50,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-footer-title]",
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });

      // Everything below the headline keeps the original group reveal.
      gsap.from("[data-footer-rest]", {
        autoAlpha: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      id="footer"
      ref={footerRef}
      data-gl-section="4"
      className="footer relative z-2 overflow-clip mt-120"
      style={{
        background:
          "radial-gradient(120% 140% at 15% 85%, rgba(249,115,22,0.55), rgba(249,115,22,0.12) 45%, transparent 70%)",
      }}
    >
      <div className="px-80 max-s:px-20 pt-100">
        <h2 data-footer-title className="_45 ml-0 md:ml-285">
          Let&rsquo;s build your next
          <br />
          project together.
        </h2>

        <div
          data-footer-rest
          className="grid grid-cols-2 md:grid-cols-4 gap-40 mt-80 ml-0 md:ml-285"
        >
          {COLUMNS.map((col) => (
            // The contact column carries a full email address, which is far
            // wider than a half-width mobile cell — `link-anim` clips its
            // overflow for the two-line hover slide, so a narrow cell would
            // silently truncate it to "brivix.agency@outl". Give that column
            // the full row on mobile; the address then fits unbroken.
            <div
              key={col.header}
              className={col.links.some((l) => l.contact) ? "max-s:col-span-2" : undefined}
            >
              <span className="_9 font-mono uppercase border-b border-dashed border-black/60 pb-8 block">
                {col.header}
              </span>
              <div className="flex flex-col gap-8 mt-15">
                {col.links.map((link) =>
                  link.contact ? (
                    <ContactLink key={link.label} className="link-anim _27">
                      <span data-text={link.label}>{link.label}</span>
                    </ContactLink>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => onLinkClick(e, link.href!)}
                      className="link-anim _27"
                      {...(link.href!.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <span data-text={link.label}>{link.label}</span>
                    </a>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        {/* `relative z-1` keeps this row above the wordmark below it: that
            wordmark's glyph box is far taller than its wrapper, so without a
            stacking context of our own it paints last and swallows clicks on
            the legal links. */}
        <div
          data-footer-rest
          className="relative z-1 grid grid-cols-2 gap-x-20 gap-y-25 md:flex md:gap-0 justify-between items-start mt-100 pt-15 border-t border-dashed border-black/60 ml-0 md:ml-285 font-mono _9 uppercase"
        >
          {/* Mobile pairs the two two-line blocks on one row and gives the
              links their own full-width row beneath, instead of stacking all
              four items into a ragged column. */}
          <p className="max-s:order-1">
            &copy; Copyright 2026 Brivix.
            <br />
            All rights reserved
          </p>
          {/* Legal sits in the baseline row rather than a fifth link column:
              it is reference material, not navigation, and the columns above
              are sized for four. Stacked two-deep on desktop so it keeps the
              same two-line rhythm as the blocks either side of it. */}
          <div className="max-s:order-3 max-s:col-span-2 flex gap-20 md:flex-col md:gap-4 items-start">
            {LEGAL.map((link) => (
              <Link key={link.href} href={link.href} className="link-anim">
                <span data-text={link.label}>{link.label}</span>
              </Link>
            ))}
          </div>
          <p className="max-s:order-2">
            Cairo, Egypt
            <br />
            {time ?? "00:00:00"}
          </p>
          {/* The slash run is one long token and browsers break after "/",
              so on mobile it would wrap into a multi-line wall colliding with
              the wordmark below — clip it to a single full-width line there. */}
          <p className="max-s:order-4 max-s:col-span-2 max-s:max-w-full max-s:whitespace-nowrap max-s:overflow-clip">
            Impossible to resist{" "}
            {"////////////////////////////////////////////////"}
          </p>
        </div>

        {/* The wrapper is shorter than the type, so the glyphs overflow past
            the footer's border box and its overflow-clip cuts them. The page
            therefore ends mid-letterform: the wordmark stays clipped by the
            viewport bottom at max scroll and no extra scroll can reveal it. */}
        {/* Sized in vw (430/1920 and 250/1920 of the design width) instead of
            --px: identical on desktop, but on mobile --px rebases to /390 and
            would blow the wordmark past the viewport. */}
        {/* Ornament, not content: `pointer-events-none` stops the oversized
            glyph box — which is taller than this wrapper and paints last —
            from stealing clicks from the links above it, and `select-none`
            keeps a stray drag from highlighting it. */}
        {/* On mobile the wrapper is tall enough to show the wordmark whole:
            the clipped-letterform treatment reads as art direction at desktop
            width, but as a rendering fault on a 390px screen. */}
        <div
          data-footer-rest
          className="h-[13.02vw] max-s:h-[26vw] pointer-events-none select-none"
        >
          <div
            className="font-medium leading-none"
            style={{
              fontSize: "22.396vw",
              letterSpacing: "-0.05em",
            }}
          >
            Brivix.
          </div>
        </div>
      </div>
    </footer>
  );
}
