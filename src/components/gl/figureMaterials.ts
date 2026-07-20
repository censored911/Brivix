import * as THREE from "three";
import {
  simpleVertexShader,
  simpleFragmentShader,
  modelVertexShader,
  modelFragmentShader,
} from "./shaders";
import { defaultFadePoints, type ModelConfig } from "./modelConfigs";

/**
 * Port of the original site's figure materials.
 *
 * Each GLB is two nested meshes and they are deliberately shaded differently:
 *
 *   rndr_pose_0X_v2        the body     -> light grey (#DDD), dither-eroded
 *     └ veins └ (mesh)     the strokes  -> solid black
 *
 * The sketch look is *baked into the geometry* — `veins` is real extruded tube
 * geometry (170k-380k tris of stroke). It is rendered as solid triangles, never
 * as a wireframe: wireframing tubes draws every edge of every tube segment,
 * which multiplies the line count and alpha-stacks into solid black.
 *
 * Three things keep the linework light and the text underneath readable:
 *   1. frontFaceMask  - drops back-facing strokes so the far side of the body
 *                       doesn't show through and double the density.
 *   2. ditheredFade   - stipples the body away (uDitherSize) instead of filling.
 *   3. clipMask       - the depth+noise reveal, gated by uLoading.
 */

const ACCENT = "#F97316";
/** The original's body grey: 0.8671875 == 222/256 (#DEDEDE). */
export const BODY_GREY = 0.8671875;

function vec3(v: { x: number; y: number; z: number }) {
  return new THREE.Vector3(v.x, v.y, v.z);
}

/**
 * The original's `Material` class: flat depth/noise clip reveal, single colour.
 * Used for the black veins on every figure, and for the body of "Material" models.
 */
function createSimpleMaterial(grey: number, direction: { x: number; y: number }) {
  return new THREE.ShaderMaterial({
    vertexShader: simpleVertexShader,
    fragmentShader: simpleFragmentShader,
    transparent: true,
    uniforms: {
      uLoading: { value: 0 },
      uProgress: { value: 0 },
      uMinZ: { value: -2 },
      uMaxZ: { value: 10 },
      uColor: { value: new THREE.Color(grey, grey, grey) },
      uTime: { value: 0 },
      uMultiplier1: { value: 2.8 },
      uMultiplier2: { value: 0.82 },
      uMultiplier3: { value: 3.77 },
      uDirection: { value: new THREE.Vector2(direction.x, direction.y) },
      uAccentColor: { value: new THREE.Color(ACCENT) },
      uShowAccent: { value: 1 },
      uOpacity: { value: 1 },
    },
  });
}

/**
 * The original's `TestMaterial` class: adds front-face masking, two spatial fade
 * axes and dither erosion. Note the fragment shader outputs `uDebugColor` (not
 * `uColor`) — that is the real body colour despite the name.
 */
function createDitherMaterial(cfg: ModelConfig, grey: number) {
  const fp = cfg.fadePoints ?? defaultFadePoints;
  return new THREE.ShaderMaterial({
    vertexShader: modelVertexShader,
    fragmentShader: modelFragmentShader,
    transparent: true,
    uniforms: {
      uLoading: { value: 0 },
      uFadeStartPoint: { value: vec3(fp.fadeStartPoint) },
      uFadeEndPoint: { value: vec3(fp.fadeEndPoint) },
      uFadeStartPoint2: { value: vec3(fp.fadeStartPoint2) },
      uFadeEndPoint2: { value: vec3(fp.fadeEndPoint2) },
      uEnableSecondFade: { value: cfg.name === "model4" ? 1 : 0 },
      uFadeMixMode: { value: 0 },
      uDebugMode: { value: 0 },
      uDebugColor: { value: new THREE.Vector3(grey, grey, grey) },
      uDitherSize: { value: 0.2 },
      uProgress: { value: 0 },
      uMinZ: { value: -2 },
      uMaxZ: { value: 10 },
      uTime: { value: 0 },
      uMultiplier1: { value: 2.8 },
      uMultiplier2: { value: 0.82 },
      uMultiplier3: { value: 3.77 },
      uDirection: { value: new THREE.Vector2(cfg.direction.x, cfg.direction.y) },
      uColor: { value: new THREE.Color(grey, grey, grey) },
      uAccentColor: { value: new THREE.Color(ACCENT) },
      uShowAccent: { value: 1 },
      uOpacity: { value: 1 },
    },
  });
}

function isVeins(obj: THREE.Object3D) {
  for (let p: THREE.Object3D | null = obj; p; p = p.parent) {
    if (/vein/i.test(p.name)) return true;
  }
  return false;
}

/**
 * Restyle a loaded GLB in place. Returns the created materials so the caller can
 * drive uTime / uOpacity without re-traversing.
 */
export function applyFigureMaterials(root: THREE.Object3D, cfg: ModelConfig) {
  const materials: THREE.ShaderMaterial[] = [];

  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;

    if (isVeins(obj)) {
      // The ink strokes: always the simple shader at pure black.
      const mat = createSimpleMaterial(0, cfg.direction);
      obj.material = mat;
      materials.push(mat);
      return;
    }

    // The body.
    if (cfg.materialType === "TestMaterial") {
      const mat = createDitherMaterial(cfg, BODY_GREY);
      obj.material = mat;
      obj.renderOrder = 10;
      materials.push(mat);
    } else {
      const mat = createSimpleMaterial(BODY_GREY, cfg.direction);
      // The original zeroes the accent for plain "Material" bodies.
      mat.uniforms.uShowAccent.value = 0;
      obj.material = mat;
      materials.push(mat);
    }
  });

  // uLoading gates the clip reveal; at 0 nothing rasterises at all. The original
  // ramps it during its load sequence — we rest it at fully-revealed and let the
  // existing per-section visibility drive uOpacity instead.
  materials.forEach((m) => {
    m.uniforms.uLoading.value = 1;
  });

  return materials;
}
