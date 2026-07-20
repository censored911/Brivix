"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollToSection } from "@/lib/scrollToSection";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // body.at-top class management (mirrors original)
    const onScroll = ({ scroll }: { scroll: number }) => {
      document.body.classList.toggle("at-top", scroll <= 1);
    };
    lenis.on("scroll", onScroll);

    // Arriving with a hash (e.g. /#services from another page): the native
    // jump lands on the section's 100vh pacing padding, so re-aim at the
    // content once layout has settled.
    const hashTarget = window.location.hash
      ? document.getElementById(window.location.hash.slice(1))
      : null;
    let hashTimer: number | undefined;
    if (hashTarget) {
      hashTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
        scrollToSection(hashTarget, true);
      }, 100);
    }

    return () => {
      window.clearTimeout(hashTimer);
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
