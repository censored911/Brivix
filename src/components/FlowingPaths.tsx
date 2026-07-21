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
}: {
  position: number;
  viewBox: string;
}) {
  return (
    <svg
      className="absolute inset-0 h-full w-full text-black"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      {buildPaths(position).map((path) => (
        <path
          key={path.id}
          d={path.d}
          // Phones paint every strand across the whole viewport at raster time;
          // halving the density there keeps the initial rasterization cheap
          // (the slice crop already hides much of the field).
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
      // ---- Why this replaced the stroke-dashoffset flow.
      //
      // The previous version animated `strokeDashoffset` on 72 paths of a
      // fixed, full-viewport SVG. strokeDashoffset is not a compositable
      // property, so every animated frame forced a full repaint of a
      // screen-sized layer — the field alone held the page at ~29fps and
      // fought Lenis's 60fps scroll ticker, producing the scroll stutter.
      //
      // Instead we keep the strands' painted geometry completely static (one
      // rasterization, no per-frame repaint) and give the *illusion* of a
      // living flow by drifting each layer as a whole on the GPU: a slow,
      // seamless transform loop (translate + micro-rotate) plus a gentle
      // opacity breath. Transform and opacity are compositor-only, so the
      // field now costs ~0 main-thread work per frame and stays glued to
      // whatever framerate the scroller runs at.
      const layers = gsap.utils.toArray<SVGElement>(
        "[data-strand-layer]",
        root
      );

      const tweens = layers.map((layer, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        // A long, offset, yoyoing drift per layer. Different periods per layer
        // keep the layers from ever realigning, so the field reads as a
        // continuous slow current rather than a rigid slab sliding around.
        return gsap.to(layer, {
          xPercent: dir * 4,
          yPercent: dir * -3,
          rotation: dir * 1.2,
          transformOrigin: "50% 50%",
          duration: 26 + i * 7,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      // Ease from the SSR-painted opacity into a soft, endless breath. One
      // tween drives all layers together — opacity composites, so this is
      // effectively free.
      const breath = gsap.fromTo(
        layers,
        { opacity: 1 },
        {
          opacity: 0.55,
          duration: 5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        }
      );

      return () => {
        tweens.forEach((t) => t.kill());
        breath.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      // The field lives on z-0, below content, and never intercepts input.
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      {/* Each strand layer is wrapped in its own drifting div. The wrapper is
          the compositor layer that transforms (see effect); the SVG inside is
          rasterized once and never repaints. Phones keep one portrait sweep;
          desktop keeps the full two-direction landscape field.
          will-change + translateZ promote the wrapper to its own GPU layer so
          the drift never invalidates the content painted above it. */}
      <div
        data-strand-layer
        className="s:hidden absolute inset-0 will-change-transform [transform:translateZ(0)] [backface-visibility:hidden]"
      >
        <PathLayer position={1} viewBox={VIEWBOX_PORTRAIT} />
      </div>
      <div
        data-strand-layer
        className="max-s:hidden absolute inset-0 will-change-transform [transform:translateZ(0)] [backface-visibility:hidden]"
      >
        <PathLayer position={1} viewBox={VIEWBOX_LANDSCAPE} />
      </div>
      <div
        data-strand-layer
        className="max-s:hidden absolute inset-0 will-change-transform [transform:translateZ(0)] [backface-visibility:hidden]"
      >
        <PathLayer position={-1} viewBox={VIEWBOX_LANDSCAPE} />
      </div>
    </div>
  );
}
