"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const PATH_COUNT = 36;

function buildPaths(position: number) {
  return Array.from({ length: PATH_COUNT }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    // Every seventh strand carries the brand accent; the rest stay ink-black.
    accent: i % 7 === 3,
    opacity: 0.05 + i * 0.015,
    width: 0.35 + i * 0.02,
  }));
}

/** Framing.
 *
 *  The strand field is composed against a landscape frame. With
 *  `preserveAspectRatio="slice"` the scale is `max(w/696, h/316)`, so a portrait
 *  phone (390×844) scales by 2.67 and crops to a ~146×316 window of user space
 *  centred near x≈275–421 — a corner of the composition the sweep never enters.
 *  The result is a blank page with a few strands clipping the bottom-left.
 *
 *  `viewBox` has no CSS equivalent, so it cannot be media-queried; the portrait
 *  frame has to be its own element. This window is proportioned for a phone and
 *  positioned on the body of the sweep, so the arc reads across the screen.
 */
const VIEWBOX_LANDSCAPE = "0 0 696 316";
const VIEWBOX_PORTRAIT = "-220 -120 560 1212";

function PathLayer({
  position,
  viewBox,
  className = "",
}: {
  position: number;
  viewBox: string;
  className?: string;
}) {
  return (
    <svg
      className={`absolute inset-0 h-full w-full text-black ${className}`}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      {buildPaths(position).map((path) => (
        <path
          key={path.id}
          d={path.d}
          // Phones paint every strand across the whole viewport each frame;
          // halving the density there is visually negligible (the slice crop
          // already hides much of the field) but halves the repaint cost.
          className={path.id % 2 === 1 ? "max-s:hidden" : undefined}
          stroke={path.accent ? "var(--color-accent)" : "currentColor"}
          strokeWidth={path.width}
          strokeOpacity={path.accent ? path.opacity * 0.8 : path.opacity}
        />
      ))}
    </svg>
  );
}

export default function FlowingPaths() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Every strand animates from one paused master clock instead of the
      // 60fps ticker. The strands drift ~1px per frame, so stepping them at
      // 24fps is invisible — but any strand changing repaints the whole
      // layer, so batching all writes to 24 ticks/s cuts the field's paint
      // cost by ~60% (measured: the full field alone held the page at ~29fps
      // when painted every frame).
      const master = gsap.timeline({ paused: true });

      root.querySelectorAll<SVGPathElement>("path").forEach((path) => {
        // Hidden strands (mobile density cut) still get their tweens so they
        // resume seamlessly if the viewport crosses the breakpoint — but
        // getTotalLength() can throw on non-rendered geometry in some engines.
        let length: number;
        try {
          length = path.getTotalLength();
        } catch {
          return;
        }
        if (!length) return;
        // Random phase per strand so the flow is visibly in motion from the
        // very first frame instead of every path starting in lockstep.
        const phase = -length * Math.random();

        // Dash + gap sum to the full path length so the offset loop is seamless.
        gsap.set(path, {
          strokeDasharray: `${length * 0.7} ${length * 0.3}`,
          strokeDashoffset: phase,
        });
        master.to(
          path,
          {
            strokeDashoffset: phase - length,
            duration: 20 + Math.random() * 10,
            ease: "none",
            repeat: -1,
          },
          0
        );
        // Ease from the SSR-painted state (opacity 1) into the breathing
        // loop — no static hold, no opacity snap on hydration.
        master.add(
          gsap
            .timeline()
            .to(path, { opacity: 0.2, duration: 0.8, ease: "power1.out" })
            .to(path, {
              opacity: 0.45,
              duration: 4 + Math.random() * 4,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            }),
          0
        );
      });

      // Advance the master clock in real time, but commit style writes at
      // most 24 times a second so the layer repaints on that cadence.
      const STEP = 1 / 24;
      let last = gsap.ticker.time;
      const gate = (time: number) => {
        const elapsed = time - last;
        if (elapsed < STEP) return;
        last = time;
        master.time(master.time() + elapsed);
      };
      gsap.ticker.add(gate);

      return () => {
        gsap.ticker.remove(gate);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      // Pin the strand field to its own compositor layer so its every-frame
      // repaint stays isolated from the content above it (the noise blend and
      // nav blur wedge composite on the GPU instead of invalidating the page).
      className="fixed inset-0 z-0 pointer-events-none will-change-transform [transform:translateZ(0)]"
      aria-hidden="true"
    >
      {/* Paint cost scales linearly with visible strands (measured: 36
          painted ≈ 29fps vs 18 ≈ 44fps on a throttled phone). Phones keep one
          coherent sweep at half density; desktop keeps the full field. */}
      <PathLayer position={1} viewBox={VIEWBOX_PORTRAIT} className="s:hidden" />
      <PathLayer position={1} viewBox={VIEWBOX_LANDSCAPE} className="max-s:hidden" />
      <PathLayer position={-1} viewBox={VIEWBOX_LANDSCAPE} className="max-s:hidden" />
    </div>
  );
}
