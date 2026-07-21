"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { modelConfigs, type MultiStageConfig, type SimpleConfig, type Stage } from "./modelConfigs";
import { applyFigureMaterials } from "./figureMaterials";
import { markHeroReady, reportLoad } from "@/lib/heroReady";

/** The hero figure is model index 0 — the one that owns the first impression
 *  and must transition out of the preloader. */
const HERO_INDEX = 0;

function applyStage(group: THREE.Group, s: Stage) {
  group.position.set(s.position.x, s.position.y, s.position.z);
  group.rotation.set(s.rotation.x, s.rotation.y, s.rotation.z);
  group.scale.setScalar(s.scale);
}

function lerpStage(group: THREE.Group, a: Stage, b: Stage, t: number, baseRot: THREE.Euler) {
  group.position.set(
    a.position.x + (b.position.x - a.position.x) * t,
    a.position.y + (b.position.y - a.position.y) * t,
    a.position.z + (b.position.z - a.position.z) * t
  );
  group.rotation.set(
    baseRot.x + a.rotation.x + (b.rotation.x - a.rotation.x) * t,
    baseRot.y + a.rotation.y + (b.rotation.y - a.rotation.y) * t,
    baseRot.z + a.rotation.z + (b.rotation.z - a.rotation.z) * t
  );
  group.scale.setScalar(a.scale + (b.scale - a.scale) * t);
}

function setOpacity(root: THREE.Object3D, opacity: number) {
  root.traverse((obj) => {
    const mat = (obj as THREE.Mesh).material as THREE.Material | undefined;
    if (mat instanceof THREE.ShaderMaterial && mat.uniforms.uOpacity) {
      mat.uniforms.uOpacity.value = opacity;
    }
  });
  root.visible = opacity > 0.01;
}

/** Camera framing.
 *
 *  A PerspectiveCamera's fov is *vertical*, so the horizontal field is
 *  `fov * aspect`. The scene is composed against a landscape viewport; on a
 *  portrait phone (aspect ~0.46 vs ~1.78) the horizontal field collapses to a
 *  third of what it was staged for and the figures blow past both edges.
 *
 *  Below the `s` breakpoint — the same 640px line the CSS scale rebases at —
 *  widen the vertical fov to buy the horizontal framing back. Fully restoring
 *  it would need ~135°, which is a fisheye, so it is capped. Desktop is
 *  untouched by construction: at ≥640px this returns the original 65.
 */
const BASE_FOV = 65;
const REF_ASPECT = 16 / 9;
const MAX_FOV = 95;

function fovFor(width: number, height: number) {
  if (width >= 640) return BASE_FOV;
  const aspect = width / height;
  if (aspect >= REF_ASPECT) return BASE_FOV;
  // Horizontal half-angle the scene was composed at.
  const halfH = Math.atan(Math.tan((BASE_FOV * Math.PI) / 360) * REF_ASPECT);
  const fov = (360 / Math.PI) * Math.atan(Math.tan(halfH) / aspect);
  return Math.min(fov, MAX_FOV);
}

/** Phones (below the s breakpoint) can't afford MSAA at 2x DPR while Lenis and
 *  several scrubbed ScrollTriggers drive per-frame matrix lerps. Detected once
 *  at mount; desktop keeps the original antialias + 2x path untouched. */
const isMobile = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 40rem)").matches;

export default function GLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mobile = isMobile();

    const scene = new THREE.Scene();
    // Matches the original's Camera.setInstance() on desktop. Their code also
    // computes a fov from `fovNum = 1200`, but never assigns it — the ctor's 65
    // is what ships, and resize() only ever updates aspect. We diverge below
    // 640px only, where that fixed fov crops the scene (see fovFor).
    const camera = new THREE.PerspectiveCamera(
      fovFor(innerWidth, innerHeight),
      innerWidth / innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    // Visual-calibration handle. Development only — in production it would be
    // dead scaffolding on a global, pinning the scene graph against GC.
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as Record<string, unknown>).__glDebug = { scene, camera };
    }

    // Antialias is the single biggest per-fragment cost here; on mobile the
    // dither/stroke look already hides aliasing, so drop MSAA and cap DPR at
    // 1.5 (vs desktop's 2). Desktop keeps antialias + 2x exactly as before.
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !mobile });
    renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
    renderer.setSize(innerWidth, innerHeight);

    // Rate-limit the scrubbed matrix work so it's driven by GSAP's own eased
    // catch-up rather than every raw Lenis tick. A small scrub value (vs the
    // previous `scrub: true`, which is instant/unsmoothed) decouples the JS
    // lerp + Three re-render from scroll frequency — the single biggest lever
    // for scrub jank per gsap-performance. Slightly higher on mobile, whose GPU
    // and main thread have the least headroom under Lenis.
    const SCRUB = mobile ? 0.6 : 0.4;
    // Mobile browsers fire resize on every URL-bar show/hide during scroll;
    // letting ScrollTrigger refresh on those mid-scroll is a known stutter
    // source. Ignore them — real layout changes still refresh explicitly.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const loader = new GLTFLoader();
    const triggers: ScrollTrigger[] = [];
    const groups: THREE.Group[] = [];
    const materials: THREE.ShaderMaterial[] = [];
    // The hero figure's materials, tracked separately so the intro reveal can
    // drive their uLoading clip from 0 → 1 without touching the other figures
    // (which stay fully materialised and are governed by scroll visibility).
    const heroMaterials: THREE.ShaderMaterial[] = [];
    let disposed = false;

    // Intro-reveal state. uLoading gates the shader's depth/noise clip: at 0 the
    // hero is not rasterised at all; ramping to 1 dissolves it into existence
    // front-to-back through the dither. `revealDriven` flips true once the hero
    // has loaded and rendered one real frame, after which the tick loop writes
    // reveal.v into the hero materials every frame.
    const reveal = { v: 0 };
    let revealDriven = false;
    let heroFramePainted = false;
    let revealStarted = false;

    // Begin the premium materialise-from-preloader ramp. Called only after the
    // hero is genuinely ready to draw (loaded + one frame painted), so the
    // animation never stutters on a first-frame shader compile.
    const startHeroReveal = () => {
      if (revealStarted || disposed) return;
      revealStarted = true;
      revealDriven = true;
      // Tell the preloader the hero is live so the curtain lifts onto the
      // reveal in progress — not before it, not long after.
      markHeroReady();

      // Respect reduced-motion: resolve the hero almost immediately with a
      // short crossfade instead of the long theatrical dissolve.
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.to(reveal, {
        v: 1,
        duration: reduced ? 0.4 : 2.2,
        // A long, soft-settling ease: quick to commit, slow to resolve the last
        // sliver of dither — reads as intentional and high-end rather than a
        // linear wipe. Runs behind and through the lifting curtain.
        ease: reduced ? "power1.out" : "power2.inOut",
        delay: reduced ? 0 : 0.15,
      });
    };

    // gl section elements by index
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-gl-section]")).reduce(
      (acc, el) => {
        acc[Number(el.dataset.glSection)] = el;
        return acc;
      },
      {} as Record<number, HTMLElement>
    );

    const cache = new Map<string, Promise<THREE.Group>>();
    const loadModel = (path: string, onProgress?: (e: ProgressEvent) => void) => {
      if (!cache.has(path)) {
        cache.set(
          path,
          new Promise((resolve, reject) => {
            loader.load(
              path,
              (gltf) => resolve(gltf.scene),
              onProgress,
              (err) => reject(err)
            );
          })
        );
      }
      return cache.get(path)!;
    };

    // The hero GLB is the heaviest critical asset and the one the preloader's
    // strict percentage is mostly made of. Stream its byte progress into the
    // load registry as it downloads; the counter reflects the real transfer,
    // never a timed guess. `lengthComputable` is true when the response carries
    // Content-Length (our own /public assets always do), so this tracks the true
    // fraction of bytes received. If it isn't computable, the step simply stays
    // at 0 until the paint step lands — the bar never fabricates progress.
    const reportHeroProgress = (e: ProgressEvent) => {
      if (e.lengthComputable && e.total > 0) {
        reportLoad("heroModel", e.loaded / e.total);
      }
    };

    modelConfigs.forEach((cfg) => {
      const onProgress =
        cfg.index === HERO_INDEX ? reportHeroProgress : undefined;
      loadModel(cfg.modelPath, onProgress).then((proto) => {
        if (disposed) return;
        const model = proto.clone(true);
        const figMats = applyFigureMaterials(model, cfg);
        materials.push(...figMats);
        if (cfg.index === HERO_INDEX) {
          // Hold the hero fully clipped (invisible) until the reveal ramp
          // starts — otherwise it pops in fully-formed the instant the GLB
          // resolves, unsynchronised with the preloader.
          figMats.forEach((m) => {
            m.uniforms.uLoading.value = 0;
            heroMaterials.push(m);
          });
        }
        const group = new THREE.Group();
        group.add(model);
        const baseRot = new THREE.Euler(cfg.rotate.x, cfg.rotate.y, cfg.rotate.z);

        const ac = cfg.animationConfig;
        if ("multiStage" in ac && ac.multiStage) {
          const msc = ac as MultiStageConfig;
          applyStage(group, msc.stages.pointA);
          group.rotation.set(
            baseRot.x + msc.stages.pointA.rotation.x,
            baseRot.y + msc.stages.pointA.rotation.y,
            baseRot.z + msc.stages.pointA.rotation.z
          );

          const segs: Array<[Stage, Stage, typeof msc.segments.AB]> = [
            [msc.stages.pointA, msc.stages.pointB, msc.segments.AB],
            [msc.stages.pointB, msc.stages.pointC, msc.segments.BC],
            [msc.stages.pointC, msc.stages.pointD, msc.segments.CD],
          ];
          segs.forEach(([a, b, seg]) => {
            const trigEl = sections[seg.trigger];
            if (!trigEl) return;
            triggers.push(
              ScrollTrigger.create({
                trigger: trigEl,
                endTrigger: sections[seg.endTrigger] ?? trigEl,
                start: seg.start,
                end: seg.end,
                scrub: SCRUB,
                onUpdate: (self) => lerpStage(group, a, b, self.progress, baseRot),
              })
            );
          });
          // fade out when the next section's visibility trigger engages
          const vt = msc.visibilityTrigger;
          const vtEl = sections[vt.trigger];
          if (vtEl) {
            triggers.push(
              ScrollTrigger.create({
                trigger: vtEl,
                endTrigger: sections[vt.endTrigger] ?? vtEl,
                start: vt.start,
                end: vt.end,
                scrub: SCRUB,
                onUpdate: (self) => setOpacity(group, 1 - Math.min(1, self.progress * 2)),
              })
            );
          }
        } else {
          const sc = ac as SimpleConfig;
          applyStage(group, sc.startPos);
          group.rotation.set(
            baseRot.x + sc.startPos.rotation.x,
            baseRot.y + sc.startPos.rotation.y,
            baseRot.z + sc.startPos.rotation.z
          );
          setOpacity(group, 0);

          const trigEl = sections[sc.transform.trigger];
          if (trigEl) {
            triggers.push(
              ScrollTrigger.create({
                trigger: trigEl,
                endTrigger: sections[sc.transform.endTrigger] ?? trigEl,
                start: sc.transform.start,
                end: sc.transform.end,
                scrub: SCRUB,
                onUpdate: (self) => lerpStage(group, sc.startPos, sc.endPos, self.progress, baseRot),
              })
            );
          }
          const vt = sc.visibilityTrigger ?? sc.transform;
          const vtEl = sections[vt.trigger];
          if (vtEl) {
            triggers.push(
              ScrollTrigger.create({
                trigger: vtEl,
                endTrigger: sections[vt.endTrigger] ?? vtEl,
                start: vt.start,
                end: vt.end,
                scrub: SCRUB,
                onUpdate: (self) => {
                  // fade in over first 15%, fade out over last 15%
                  const p = self.progress;
                  const o = p < 0.15 ? p / 0.15 : p > 0.85 ? (1 - p) / 0.15 : 1;
                  setOpacity(group, Math.max(0, Math.min(1, o)));
                },
              })
            );
          }
        }

        groups.push(group);
        scene.add(group);

        // Pre-compile this figure's shader programs now, off the reveal's
        // critical path. Without this the program links on the frame the mesh
        // first draws — for the hero that would be the frame the reveal starts,
        // stalling its opening motion. compile() is synchronous but happens
        // during idle load time, so it costs nothing the user can feel.
        renderer.compile(scene, camera);

        ScrollTrigger.refresh();
      }).catch((err) => {
        // Degrade silently for visitors — a missing figure is not worth an
        // error state. But a 404'd .glb must not vanish without a trace at
        // development time, or a broken deploy ships looking merely empty.
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[gl] model failed to load: ${cfg.modelPath}`, err);
        }
      });
    });

    let raf = 0;
    const clock = new THREE.Clock();
    // Mobile GPUs have the least headroom while Lenis + the scrubbed matrix
    // work run, and that contention is what makes the landing scroll feel
    // heavier than About (which has no WebGL). Cap the *continuous dither*
    // redraw to ~30fps on phones: it roughly halves the per-frame GPU/main-
    // thread cost during the long static holds, handing that budget back to
    // the DOM scroll-reveals. The intro reveal is exempt (full rate) so the
    // opening dissolve stays perfectly fluid, and scrub onUpdate callbacks are
    // ScrollTrigger-driven, so figure motion during scroll is never throttled.
    const FRAME_MS = mobile ? 1000 / 30 : 0;
    let lastDraw = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);

      // Nothing visible → nothing to draw. Between section hand-offs every
      // group is faded out (setOpacity flips .visible off), which is exactly
      // where the Hero→Insight scroll spends much of its travel. Skipping the
      // draw *and* the uTime writes there reclaims the GPU for the DOM
      // animations that are janking. The scrub onUpdate callbacks still fire
      // on their own (they're driven by ScrollTrigger, not this loop), so the
      // scene is always correct the instant a group becomes visible again.
      let anyVisible = false;
      for (let i = 0; i < groups.length; i++) {
        if (groups[i].visible) {
          anyVisible = true;
          break;
        }
      }
      if (!anyVisible) return;

      // Mobile dither-rate cap. Skip this frame's redraw if we're inside the
      // ~33ms budget — unless the intro reveal is live, which must never be
      // throttled. `now` comes from the same rAF clock so the cadence is even.
      if (FRAME_MS && !revealDriven) {
        const now = performance.now();
        if (now - lastDraw < FRAME_MS) return;
        lastDraw = now;
      }

      // The clip/dither noise animates on uTime; the original feeds it
      // elapsed milliseconds * 0.001.
      const t = clock.getElapsedTime();
      materials.forEach((m) => {
        m.uniforms.uTime.value = t;
      });

      // Drive the intro reveal: write the eased ramp into the hero's clip
      // uniform every frame while it runs. Kept in the render loop (not the
      // GSAP onUpdate) so the uniform and the draw are always the same frame —
      // no torn state, no flicker.
      if (revealDriven) {
        for (let i = 0; i < heroMaterials.length; i++) {
          heroMaterials[i].uniforms.uLoading.value = reveal.v;
        }
      }

      renderer.render(scene, camera);

      // First real frame with the hero present and compiled: the GLB is loaded,
      // materials/shaders are applied, and this render() has just forced their
      // compile + a genuine paint at uLoading 0 (invisible but fully warmed).
      // Only now is it safe to start the reveal — the animation can't hit a
      // shader-compile stall, so it stays fluid from its very first frame.
      if (!heroFramePainted && heroMaterials.length > 0) {
        heroFramePainted = true;
        // One extra rAF so the compiled frame is guaranteed presented before
        // the clip starts moving — belt-and-braces against a first-move hitch.
        requestAnimationFrame(startHeroReveal);
      }
    };

    // Pause the entire loop while the tab is backgrounded — no reason to burn
    // the GPU (and the clock) on a scene no one can see. getDelta-free clock
    // use (getElapsedTime) means the dither animation simply resumes on return.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.fov = fovFor(innerWidth, innerHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    };
    addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      removeEventListener("resize", onResize);
      triggers.forEach((t) => t.kill());
      groups.forEach((g) => scene.remove(g));
      renderer.dispose();
    };
  }, []);

  return (
    <div className="canvas-container fixed left-0 right-0 top-0 h-screen -z-1 pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
