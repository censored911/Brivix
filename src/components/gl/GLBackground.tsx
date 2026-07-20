"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ScrollTrigger } from "@/lib/gsap";
import { modelConfigs, type MultiStageConfig, type SimpleConfig, type Stage } from "./modelConfigs";
import { applyFigureMaterials } from "./figureMaterials";

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

export default function GLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);

    const loader = new GLTFLoader();
    const triggers: ScrollTrigger[] = [];
    const groups: THREE.Group[] = [];
    const materials: THREE.ShaderMaterial[] = [];
    let disposed = false;

    // gl section elements by index
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-gl-section]")).reduce(
      (acc, el) => {
        acc[Number(el.dataset.glSection)] = el;
        return acc;
      },
      {} as Record<number, HTMLElement>
    );

    const cache = new Map<string, Promise<THREE.Group>>();
    const loadModel = (path: string) => {
      if (!cache.has(path)) {
        cache.set(
          path,
          new Promise((resolve, reject) => {
            loader.load(
              path,
              (gltf) => resolve(gltf.scene),
              undefined,
              (err) => reject(err)
            );
          })
        );
      }
      return cache.get(path)!;
    };

    modelConfigs.forEach((cfg) => {
      loadModel(cfg.modelPath).then((proto) => {
        if (disposed) return;
        const model = proto.clone(true);
        materials.push(...applyFigureMaterials(model, cfg));
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
                scrub: true,
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
                scrub: true,
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
                scrub: true,
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
                scrub: true,
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
    const tick = () => {
      // The clip/dither noise animates on uTime; the original feeds it
      // elapsed milliseconds * 0.001.
      const t = clock.getElapsedTime();
      materials.forEach((m) => {
        m.uniforms.uTime.value = t;
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
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
