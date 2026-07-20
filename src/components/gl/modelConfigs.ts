// Scroll choreography extracted from the original site's World bundle
// (docs/research/world-model-configs.txt)

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Stage {
  position: Vec3;
  rotation: Vec3;
  scale: number;
}

export interface SegmentTrigger {
  trigger: number; // gl section index (data-gl-section)
  endTrigger: number;
  start: string;
  end: string;
}

export interface MultiStageConfig {
  multiStage: true;
  stages: { pointA: Stage; pointB: Stage; pointC: Stage; pointD: Stage };
  segments: { AB: SegmentTrigger; BC: SegmentTrigger; CD: SegmentTrigger };
  visibilityTrigger: SegmentTrigger;
}

export interface SimpleConfig {
  multiStage?: false;
  startPos: Stage;
  endPos: Stage;
  transform: SegmentTrigger;
  visibilityTrigger?: SegmentTrigger;
}

export interface FadePoints {
  fadeStartPoint: Vec3;
  fadeEndPoint: Vec3;
  fadeStartPoint2: Vec3;
  fadeEndPoint2: Vec3;
}

/**
 * Which shader the *body* mesh gets, mirroring the original's two material
 * classes. "Material" is the plain depth-clip reveal; "TestMaterial" adds
 * front-face masking, spatial fades and dither erosion. The black "veins"
 * stroke mesh always uses "Material" regardless of this value.
 */
export type MaterialType = "Material" | "TestMaterial";

/** Default fade points from the original's TestMaterial.setMaterial() fallback. */
export const defaultFadePoints: FadePoints = {
  fadeStartPoint: { x: -0.18, y: 1.38, z: 0.26 },
  fadeEndPoint: { x: 0.1, y: 1.44, z: 0.54 },
  fadeStartPoint2: { x: 0, y: -2, z: 0 },
  fadeEndPoint2: { x: 0, y: -3.5, z: 0 },
};

export interface ModelConfig {
  name: string;
  index: number;
  modelPath: string;
  scale: number;
  position: Vec3;
  rotate: Vec3;
  /** uDirection: biases the depth-clip reveal across the screen. */
  direction: { x: number; y: number };
  materialType: MaterialType;
  fadePoints?: FadePoints;
  animationConfig: MultiStageConfig | SimpleConfig;
}

export const modelConfigs: ModelConfig[] = [
  {
    name: "model1",
    index: 0,
    modelPath: "/models/model-1.glb",
    scale: 5.59,
    position: { x: 2.93, y: -7.54, z: 0 },
    rotate: { x: 0, y: -0.641592653589793, z: 0 },
    direction: { x: 0.6, y: -0.5 },
    materialType: "TestMaterial",
    fadePoints: {
      fadeStartPoint: { x: 0.06, y: 1.36, z: 0.4 },
      fadeEndPoint: { x: 0.15, y: 1.34, z: 0.63 },
      fadeStartPoint2: { x: 0, y: -2, z: 0 },
      fadeEndPoint2: { x: 0, y: -3.5, z: 0 },
    },
    animationConfig: {
      multiStage: true,
      stages: {
        pointA: { position: { x: 2.93, y: -7.54, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: 5.59 },
        pointB: { position: { x: -1.93, y: -7.75, z: -0.4699 }, rotation: { x: -0.0615, y: 1.3084, z: 0.1284 }, scale: 5.41 },
        pointC: { position: { x: 0, y: -7.75, z: -4.11 }, rotation: { x: 0.3984, y: 2.5884, z: -0.0615 }, scale: 7.57 },
        pointD: { position: { x: -0.4699, y: -12.12, z: -6.29 }, rotation: { x: 0.3984, y: 3.72681, z: 0.0284 }, scale: 12.16 },
      },
      segments: {
        AB: { trigger: 0, endTrigger: 0, start: "top top+=1%", end: "top top-=390%" },
        BC: { trigger: 0, endTrigger: 0, start: "top top-=390%", end: "top top-=920%" },
        CD: { trigger: 0, endTrigger: 0, start: "top top-=920%", end: "bottom -60%" },
      },
      visibilityTrigger: { trigger: 1, endTrigger: 1, start: "top bottom", end: "top 30%" },
    },
  },
  {
    name: "model2",
    index: 1,
    modelPath: "/models/model-2.glb",
    scale: 3.4,
    position: { x: 0, y: 0, z: 0 },
    rotate: { x: 0, y: 0, z: 0 },
    direction: { x: 1, y: -0.5 },
    materialType: "TestMaterial",
    fadePoints: {
      fadeStartPoint: { x: 0.39, y: 0.42, z: 0.07 },
      fadeEndPoint: { x: 0.37, y: 0.32, z: 0.1 },
      fadeStartPoint2: { x: 0, y: -2, z: 0 },
      fadeEndPoint2: { x: 0, y: -3.5, z: 0 },
    },
    animationConfig: {
      startPos: { position: { x: 2.0, y: -2.1, z: 0 }, rotation: { x: -0.303, y: -2.26318, z: 0 }, scale: 3.1 },
      endPos: { position: { x: 4.7, y: -1.5, z: -0.1899 }, rotation: { x: -0.02469, y: -1.8847, z: 0 }, scale: 3.7 },
      transform: { start: "top center", end: "top center-=200%", trigger: 1, endTrigger: 1 },
      visibilityTrigger: { trigger: 1, endTrigger: 1, start: "top center", end: "bottom 70%" },
    },
  },
  {
    name: "model3",
    index: 2,
    modelPath: "/models/model-3.glb",
    scale: 2.29,
    position: { x: 0, y: 0, z: 0 },
    rotate: { x: 0, y: 0, z: 0 },
    direction: { x: 0, y: 0 },
    materialType: "Material",
    fadePoints: defaultFadePoints,
    animationConfig: {
      startPos: { position: { x: -0.89, y: -3.69, z: -5.79 }, rotation: { x: 0, y: -2.20636, z: -0.4462 }, scale: 2.29 },
      endPos: { position: { x: -3.4, y: -0.4, z: -0.1899 }, rotation: { x: -1.14318530717959, y: 0.11363469282041, z: -0.2231 }, scale: 5.2 },
      transform: { start: "top bottom", end: "top bottom-=200%", trigger: 2, endTrigger: 2 },
      visibilityTrigger: { trigger: 2, endTrigger: 2, start: "top center", end: "bottom 80%" },
    },
  },
  {
    name: "model4",
    index: 3,
    modelPath: "/models/model-4.glb",
    scale: 2.03,
    position: { x: 0, y: 0, z: 0 },
    rotate: { x: 0, y: 0, z: 0 },
    direction: { x: 1, y: -0.5 },
    materialType: "TestMaterial",
    // model4 is the only model with the second fade axis enabled.
    fadePoints: {
      fadeStartPoint: { x: 0.02, y: 0.61, z: 0.2 },
      fadeEndPoint: { x: 0.3, y: 0.8, z: 0.4 },
      fadeStartPoint2: { x: -0.35, y: 0.54, z: 0.2 },
      fadeEndPoint2: { x: -0.31, y: 1.05, z: -0.03 },
    },
    animationConfig: {
      startPos: { position: { x: 1.890000000000001, y: -2.29, z: 2.61 }, rotation: { x: -1.81318530717959, y: 1.85681469282041, z: -0.00318530717958598 }, scale: 2.03 },
      endPos: { position: { x: 1.07, y: -0.449999999999999, z: 1.21 }, rotation: { x: 1.70681469282041, y: -0.923185307179586, z: 0.306814692820414 }, scale: 2.4 },
      transform: { start: "top 60%", end: "top -140%", trigger: 3, endTrigger: 3 },
      visibilityTrigger: { trigger: 3, endTrigger: 3, start: "top 60%", end: "bottom 70%" },
    },
  },
  {
    name: "footerModel",
    index: 4,
    modelPath: "/models/model-2.glb",
    scale: 11.8,
    // Shifted 0.9 world units left of the original -5.79/-5.33 so the raised
    // fingers clear the footer's PRIMARY link column; the start→end delta is
    // preserved, so the rise animation itself is unchanged.
    position: { x: -6.69, y: -7.89, z: 1.91 },
    rotate: { x: 0, y: 0, z: 0 },
    direction: { x: 1, y: -0.5 },
    materialType: "Material",
    animationConfig: {
      startPos: { position: { x: -6.23, y: -12.59, z: 1.7 }, rotation: { x: -0.4715, y: -0.9715, z: 1.5784 }, scale: 11.8 },
      endPos: { position: { x: -6.69, y: -7.89, z: 1.91 }, rotation: { x: -0.513185307179586, y: -0.383185307179586, z: 1.59681469282041 }, scale: 11.8 },
      transform: { start: "top bottom", end: "bottom bottom-=5%", trigger: 4, endTrigger: 4 },
    },
  },
];
