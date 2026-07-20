"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { handleHashClick } from "@/lib/scrollToSection";
import ContactLink from "@/components/ContactLink";

function SunIcon() {
  return (
    <svg className="w-full h-full" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.5" cy="10.5" r="3" stroke="currentColor" strokeWidth="0.8" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        const x1 = 10.5 + Math.cos(a) * 5.2;
        const y1 = 10.5 + Math.sin(a) * 5.2;
        const x2 = 10.5 + Math.cos(a) * 7.5;
        const y2 = 10.5 + Math.sin(a) * 7.5;
        return <path key={i} d={`M${x1} ${y1}L${x2} ${y2}`} stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />;
      })}
    </svg>
  );
}

// `contact` entries render through ContactLink (chooser) rather than a plain
// anchor — the href lives inside that component.
const MENU_LINKS: { label: string; href?: string; contact?: true }[] = [
  { label: "Approach", href: "/#approach" },
  { label: "Clients", href: "/#clients" },
  { label: "Services", href: "/#services" },
  { label: "About Us", href: "/about" },
  { label: "Contact", contact: true },
];

export default function Nav() {
  const [weather, setWeather] = useState<{ temp: number; desc: string } | null>(null);
  const [open, setOpen] = useState(false);

  // Third-party response — validated before it reaches render. An unreachable
  // API, a slow one, or a malformed payload all land on the same seasonal
  // fallback rather than rendering "NaN°".
  useEffect(() => {
    const ac = new AbortController();
    // Distinct from the abort signal: a *timeout* abort should still show the
    // fallback, an *unmount* abort must not touch state at all.
    let unmounted = false;
    const timeout = setTimeout(() => ac.abort(), 5000);

    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=30.0444&longitude=31.2357&current_weather=true&temperature_unit=celsius",
      { signal: ac.signal }
    )
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        const temp = d?.current_weather?.temperature;
        if (typeof temp !== "number" || !Number.isFinite(temp)) {
          throw new Error("malformed payload");
        }
        const code =
          typeof d.current_weather.weathercode === "number"
            ? d.current_weather.weathercode
            : 0;
        const desc =
          code === 0 ? "sunny" : code < 4 ? "cloudy" : code < 70 ? "rainy" : "stormy";
        setWeather({ temp: Math.round(temp), desc });
      })
      .catch(() => {
        if (!unmounted) setWeather({ temp: 31, desc: "sunny" });
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      unmounted = true;
      clearTimeout(timeout);
      ac.abort();
    };
  }, []);

  // Freeze Lenis while the menu owns the screen; hand scroll back on close,
  // on unmount, and if the viewport grows past the mobile breakpoint (where
  // the menu no longer exists but would otherwise keep scroll locked).
  useEffect(() => {
    const lenis = window.__lenis;
    if (open) lenis?.stop();
    else lenis?.start();
    return () => {
      window.__lenis?.start();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 40rem)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open]);

  // Restart Lenis before scrolling — the open menu has it stopped, and it
  // ignores scrollTo in that state.
  const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) =>
    handleHashClick(e, href, {
      onNavigate: () => setOpen(false),
      restartLenis: true,
    });

  return (
    <nav className="nav fixed z-9 top-0 right-0 left-0 pointer-events-none">
      <div className="nav-blur max-s:hidden" />

      {/* Desktop chrome — untouched, hidden under the mobile breakpoint */}
      <div className="max-s:hidden flex flex-row items-start justify-between pt-20 pl-[47vw] pr-82 relative">
        {/* weather */}
        <div className="flex flex-row items-center gap-18 pointer-events-auto">
          <div className="w-15 h-15">
            <SunIcon />
          </div>
          <div className="font-mono _9 uppercase leading-[1.4]">
            Cairo, Egypt
            <br />
            {weather ? `${weather.temp}° ${weather.desc}` : "––° ––"}
          </div>
        </div>
        {/* links */}
        <div className="flex flex-col items-start gap-4 pointer-events-auto">
          <a href="/about" className="link-anim _16">
            <span data-text="About Us">About Us</span>
          </a>
          <ContactLink className="link-anim _16">
            <span data-text="Contact">Contact</span>
          </ContactLink>
        </div>
      </div>

      {/* Mobile full-screen menu (under the bar so the toggle stays reachable) */}
      <div
        className={`s:hidden fixed inset-0 flex flex-col justify-between bg-grey pt-110 px-20 pb-30 transition-[opacity,visibility,translate] duration-500 ${
          open
            ? "opacity-100 visible translate-y-0 pointer-events-auto"
            : "opacity-0 invisible -translate-y-10 pointer-events-none"
        }`}
        style={{ transitionTimingFunction: "var(--smooth)" }}
        aria-hidden={!open}
      >
        <div className="flex flex-col">
          <span className="_9 font-mono uppercase border-b border-dashed border-black/60 pb-8 mb-20">
            Menu
          </span>
          {MENU_LINKS.map((link) =>
            link.contact ? (
              <ContactLink key={link.label} className="h2 py-8">
                {link.label}
              </ContactLink>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => onLinkClick(e, link.href!)}
                className="h2 py-8"
              >
                {link.label}
              </a>
            )
          )}
        </div>
        <div className="flex flex-row items-center gap-12">
          <div className="w-18 h-18">
            <SunIcon />
          </div>
          <div className="font-mono _9 uppercase leading-[1.4]">
            Cairo, Egypt
            <br />
            {weather ? `${weather.temp}° ${weather.desc}` : "––° ––"}
          </div>
        </div>
      </div>

      {/* Mobile bar: wordmark + menu toggle */}
      <div className="s:hidden relative flex items-center justify-between h-60 pl-20 pr-8 pointer-events-auto bg-white/60 backdrop-blur-md border-b border-black/10">
        <Link href="/" aria-label="Brivix — home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brivix-logo.svg" alt="Brivix" className="w-80 h-auto" />
        </Link>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative w-44 h-44 flex items-center justify-center"
        >
          <span
            className={`absolute h-px w-22 bg-current transition-transform duration-500 ${
              open ? "rotate-45" : "-translate-y-4"
            }`}
            style={{ transitionTimingFunction: "var(--smooth)" }}
          />
          <span
            className={`absolute h-px w-22 bg-current transition-transform duration-500 ${
              open ? "-rotate-45" : "translate-y-4"
            }`}
            style={{ transitionTimingFunction: "var(--smooth)" }}
          />
        </button>
      </div>
    </nav>
  );
}
