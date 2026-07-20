# Sketched Figures — Rendering Specification

Reverse-engineered from the original site's own bundle, `docs/research/js-World.Duvh4A0l.js`
(app code, 37KB) and `docs/research/js-GL.D5Drsdv4.js` (three.js r178 + their GL app classes).
Not inferred from screenshots — the shaders and uniform values below are verbatim.

- **Target files:** `src/components/gl/{figureMaterials.ts, shaders.ts, modelConfigs.ts, GLBackground.tsx}`
- **Interaction model:** N/A for rendering. Scroll choreography is unchanged and lives in `GLBackground.tsx`.

## The central fact

**The sketch look is baked into the geometry, not produced by a wireframe.**

Each GLB is two nested meshes:

```
rndr_pose_0X_v2        body    9k–50k tris
  └ veins
      └ (unnamed)      strokes 171k–376k tris   <- real extruded tube geometry
```

`veins` *is* the linework — thin 3D tubes following the stroke paths. It is rendered as
**solid triangles**. Wireframing it draws every edge of every tube segment, multiplying the
line count and alpha-stacking into solid black. This was the previous implementation's bug:
it set `wireframe: true` and then deleted ~80% of the triangles to compensate, which is what
produced the wrong density, wrong stroke weight and black masses.

## Materials

The original has two material classes; `A()` in the bundle wires them up:

| Mesh | Material | Colour |
|---|---|---|
| body (`group.children[0]`) | `TestMaterial` or `Material` per config | `0.8671875` grey (222/256, #DEDEDE) |
| veins (`…children[0].children[0]`) | always `Material` | `0` — pure black |

- **`Material`** (`simpleVertexShader` / `simpleFragmentShader`) — flat depth+noise clip reveal.
  Outputs `vec4(uColor, clipMask * uOpacity)`. For plain `Material` bodies the original sets
  `uShowAccent = 0`.
- **`TestMaterial`** (`modelVertexShader` / `modelFragmentShader`) — adds front-face masking,
  two spatial fade axes and dither erosion. Note it outputs **`uDebugColor`**, not `uColor`,
  despite the name. `renderOrder = 10`.

### What keeps the linework light and text readable

1. `frontFaceMask = smoothstep(-0.1, 0.1, vViewNormal.z)` — drops back-facing strokes so the
   far side of the body doesn't show through and double the density.
2. `ditheredFade = step(ditherThreshold, ditherBias)` — stipples the body instead of filling
   it. `uDitherSize = 0.2`. At screen scale this reads as a soft grey mass.
3. `clipMask` — depth+noise reveal gated by `uLoading`. **At `uLoading = 0` nothing rasterises
   at all**; we rest it at `1` (fully revealed) and let the existing per-section visibility
   drive `uOpacity`.

The soft grey mass visible through the translucent white panels (clients / services) is
**correct** — verified present on the live original at the same sections.

## Per-model configuration (verbatim)

| model | materialType | uDirection | 2nd fade |
|---|---|---|---|
| model1 | TestMaterial | `{0.6, -0.5}` | off |
| model2 | TestMaterial | `{1, -0.5}` | off |
| model3 | Material | `{0, 0}` | off |
| model4 | TestMaterial | `{1, -0.5}` | **on** (only model with `uEnableSecondFade = 1`) |
| footerModel | Material | `{1, -0.5}` | off |

Fade points are per-model and live in `modelConfigs.ts`.

Shared uniforms: `uMinZ -2`, `uMaxZ 10`, `uMultiplier1 2.8`, `uMultiplier2 0.82`,
`uMultiplier3 3.77`, `uAccentColor #3DFF17`, `uShowAccent 1`, `uOpacity 1`.
`uTime` = elapsed seconds (original: `app.time.elapsed * 0.001`).

## Camera

From `Camera.setInstance()` in the GL bundle:

```js
new PerspectiveCamera(65, width / height, 0.1, 1000);
instance.position.z = 5;
```

Their code also computes a fov from `fovNum = 1200` (`atan(h/2/1200) * 2 * 180/PI` ≈ 32°) but
**never assigns it** — the constructor's `65` is what ships, and `resize()` only updates
`aspect`. Figure scale and placement depend on this; the clone previously used fov 35 / z 8.

## Regenerating the shaders

`shaders.ts` is auto-extracted, not hand-written. The GLSL contains no backticks or `${`, so it
round-trips safely into TS template literals. Re-extract from the bundle rather than editing it
by hand.
