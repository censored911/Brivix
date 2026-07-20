"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const counter = { v: 0 };
    const tl = gsap.timeline();
    tl.to(counter, {
      v: 100,
      duration: 1.4,
      ease: "power2.inOut",
      onUpdate: () => setPct(Math.round(counter.v)),
    });
    tl.to(el, {
      yPercent: -100,
      duration: 0.9,
      ease: "power4.inOut",
      onComplete: () => {
        el.style.display = "none";
        document.documentElement.style.setProperty("--nav-blur-load", "1");
        document.body.classList.add("loaded");
      },
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={ref} className="loader fixed left-0 right-0 top-0 h-dvh z-12 bg-grey">
      <div className="absolute left-15 right-15 top-1/2 -translate-y-1/2 h-px bg-black/20">
        <div
          className="absolute left-0 top-0 h-full bg-black transition-[width] duration-100"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute -top-15 font-mono _9 uppercase"
          style={{ left: `${pct}%`, transform: "translateX(-100%)" }}
        >
          {pct}%
        </div>
      </div>
    </div>
  );
}
