"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { heroReady, loadPct, onLoadProgress, reportLoad } from "@/lib/heroReady";

export default function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let disposed = false;

    // Strict real progress: the percentage is the literal weighted sum of
    // genuinely-observed load steps (hero GLB bytes + fonts + first-frame paint),
    // read from the shared registry. No cosmetic tween — the number moves exactly
    // as the underlying downloads and compiles do, and only reaches 100% when
    // every critical initial-viewport asset is ready. Sync on subscribe so we
    // start from whatever progress already landed before this effect ran.
    const sync = () => {
      if (!disposed) setPct(loadPct());
    };
    const unsubscribe = onLoadProgress(sync);
    sync();

    // Above-the-fold fonts are a critical initial-viewport asset: with
    // font-display: swap, text would otherwise paint in a fallback and shift
    // when the real face arrives. Gate on the browser's own font-loading signal
    // so the reveal happens on the final type, never a fallback.
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => reportLoad("fonts", 1));
    } else {
      // No Font Loading API — don't stall the bar on a step we can't observe.
      reportLoad("fonts", 1);
    }

    // Lift the curtain up and out, then retire the element and light the page
    // chrome. Isolated so it can be fired the moment the gate opens.
    let lifted = false;
    const lift = () => {
      if (lifted || disposed) return;
      lifted = true;
      gsap.to(el, {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut",
        onComplete: () => {
          el.style.display = "none";
          document.documentElement.style.setProperty("--nav-blur-load", "1");
          document.body.classList.add("loaded");
        },
      });
    };

    // The gate: lift only once the hero 3D object is initialised and has painted
    // its first real frame — the same instant the strict counter reaches 100%,
    // since heroReady resolving completes the final load step. So the curtain
    // reveals a hero already dissolving into view over a genuine 100%, never an
    // empty scene, a pop-in, or a partial number. A hard cap guarantees the
    // curtain always lifts even if WebGL is unavailable or the model never loads.
    const HARD_CAP_MS = 6000;
    const cap = window.setTimeout(() => {
      // Fallback path: settle the bar to a coherent 100% before lifting rather
      // than revealing over a stalled number.
      reportLoad("heroModel", 1);
      reportLoad("fonts", 1);
      reportLoad("heroPaint", 1);
      sync();
      lift();
    }, HARD_CAP_MS);

    heroReady().then(() => {
      if (disposed) return;
      window.clearTimeout(cap);
      // heroReady() resolving means every step is complete; reflect the true
      // 100% on the number, then lift onto the reveal in progress.
      sync();
      lift();
    });

    return () => {
      disposed = true;
      window.clearTimeout(cap);
      unsubscribe();
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
