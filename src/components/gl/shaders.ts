// AUTO-EXTRACTED from the original site bundle (docs/research/js-World.Duvh4A0l.js).
// Verbatim GLSL — do not hand-edit. Regenerate rather than tweak.
//
// simple*  -> the original's `Material` class: flat depth/noise clip reveal.
//             Used for the black "veins" stroke mesh on every model, and for
//             the body of models whose materialType is "Material".
// model*   -> the original's `TestMaterial` class: adds normal-based front-face
//             masking, spatial fade points and dither erosion. Used for the body
//             of models whose materialType is "TestMaterial".

export const simpleVertexShader = `varying vec2 vUv;
varying vec2 screenUv;
varying vec3 vPosition;

void main()
{
    vUv = uv;
    vec4 modelPoisition = modelMatrix * vec4(position, 1.0);

    
    gl_Position = projectionMatrix * viewMatrix * modelPoisition;

    screenUv = vec2(gl_Position.xy / gl_Position.w) * 0.5 + 0.5;
    vPosition = modelPoisition.xyz;
}`;

export const simpleFragmentShader = `uniform float uLoading;
uniform float uProgress;
uniform float uMinZ;
uniform float uMaxZ;
uniform float uTime;
uniform float uMultiplier1;
uniform float uMultiplier2;
uniform float uMultiplier3;
uniform vec2 uDirection;
uniform vec3 uAccentColor;
uniform vec3 uColor;
uniform float uShowAccent;
uniform float uOpacity;

varying vec2 vUv;
varying vec2 screenUv;
varying vec3 vPosition;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  
  
  
  
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; 
  vec3 x3 = x0 - D.yyy;      

  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857; 
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  
  
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
m = m * m;
return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                            dot(p2,x2), dot(p3,x3) ) );
}

vec3 snoiseVec3(vec3 x)
{
    float s = snoise(vec3(x));
    float s1 = snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2));
    float s2 = snoise(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4));
    vec3 c = vec3(s, s1, s2);
    return c;
}

vec3 curlNoise( vec3 p )
{
    const float e = 0.1;
    vec3 dx = vec3( e, 0.0, 0.0 );
    vec3 dy = vec3( 0.0, e, 0.0 );
    vec3 dz = vec3( 0.0, 0.0, e );

    vec3 p_x0 = snoiseVec3( p - dx );
    vec3 p_x1 = snoiseVec3( p + dx );
    vec3 p_y0 = snoiseVec3( p - dy );
    vec3 p_y1 = snoiseVec3( p + dy );
    vec3 p_z0 = snoiseVec3( p - dz );
    vec3 p_z1 = snoiseVec3( p + dz );

    float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
    float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
    float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

    const float div = 1.0 / (2.0 * e);

    return normalize(vec3(x, y, z) * div);
}

void main()
{
    vec2 uv = vUv;

    
    vec2 displacedUv = uv + snoise(vec3(uv * uMultiplier1, uTime * 0.05));
    float noiseValue = snoise(vec3(displacedUv * uMultiplier2, uTime * 0.1));

    
    float zDistance = abs(vPosition.z - cameraPosition.z);

    
    float normalizedDepth = (zDistance - uMinZ) / (uMaxZ - uMinZ);
    normalizedDepth = clamp(normalizedDepth, 0.0, 1.0);

    
    
    float directionalBias = dot(screenUv - vec2(0.5), uDirection) * 0.5;
    normalizedDepth += directionalBias;

    
    float displacedProgress = uLoading + noiseValue * 0.02;

    
    float clipMask = smoothstep(normalizedDepth - 0.001, normalizedDepth + 0.001, displacedProgress);

    
    float edgeDistance = abs(normalizedDepth - displacedProgress);
    float edgeGlow = exp(-edgeDistance * 30.0) * clipMask * uShowAccent;

    
    float finalAlpha = clipMask * uLoading;

    gl_FragColor = vec4(uColor, clipMask * uOpacity);
}`;

export const modelVertexShader = `varying vec2 vUv;
varying vec2 screenUv;
varying vec3 vPosition;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vViewNormal;
varying vec3 vModelPosition;

void main()
{
    vUv = uv;
    vModelPosition = position; 
    
    vec4 modelPoisition = modelMatrix * vec4(position, 1.0);
    vec4 mvPosition = viewMatrix * modelPoisition;
    
    
    vViewPosition = mvPosition.xyz;
    
    
    vNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    vViewNormal = normalize(normalMatrix * normal);

    
    gl_Position = projectionMatrix * mvPosition;

    screenUv = vec2(gl_Position.xy / gl_Position.w) * 0.5 + 0.5;
    vPosition = modelPoisition.xyz;
}`;

export const modelFragmentShader = `uniform float uLoading;
uniform float uProgress;

uniform float uMinZ;
uniform float uMaxZ;
uniform float uTime;
uniform float uMultiplier1;
uniform float uMultiplier2;
uniform float uMultiplier3;
uniform vec2 uDirection;

uniform vec3 uAccentColor;
uniform vec3 uColor;
uniform float uShowAccent;
uniform float uOpacity;

uniform vec3 uFadeStartPoint;
uniform vec3 uFadeEndPoint;
uniform vec3 uFadeStartPoint2;
uniform vec3 uFadeEndPoint2;
uniform float uEnableSecondFade;
uniform float uFadeMixMode;

uniform float uDebugMode;
uniform vec3 uDebugColor;

uniform float uDitherSize;

varying vec2 vUv;
varying vec2 screenUv;
varying vec3 vPosition;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vViewNormal;
varying vec3 vModelPosition;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  
  
  
  
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; 
  vec3 x3 = x0 - D.yyy;      

  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857; 
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  
  
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
m = m * m;
return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                            dot(p2,x2), dot(p3,x3) ) );
}

vec3 snoiseVec3(vec3 x)
{
    float s = snoise(vec3(x));
    float s1 = snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2));
    float s2 = snoise(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4));
    vec3 c = vec3(s, s1, s2);
    return c;
}

vec3 curlNoise( vec3 p )
{
    const float e = 0.1;
    vec3 dx = vec3( e, 0.0, 0.0 );
    vec3 dy = vec3( 0.0, e, 0.0 );
    vec3 dz = vec3( 0.0, 0.0, e );

    vec3 p_x0 = snoiseVec3( p - dx );
    vec3 p_x1 = snoiseVec3( p + dx );
    vec3 p_y0 = snoiseVec3( p - dy );
    vec3 p_y1 = snoiseVec3( p + dy );
    vec3 p_z0 = snoiseVec3( p - dz );
    vec3 p_z1 = snoiseVec3( p + dz );

    float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
    float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
    float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

    const float div = 1.0 / (2.0 * e);

    return normalize(vec3(x, y, z) * div);
}
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float getDitherThreshold(vec2 coords, float ditherSize) {
    
    vec2 scaledCoords = coords * 500.0 / max(ditherSize, 0.1);

    
    float noise1 = random(floor(scaledCoords));
    float noise2 = random(floor(scaledCoords * 0.5)) * 0.5;
    float noise3 = random(floor(scaledCoords * 2.0)) * 0.25;

    
    float threshold = fract(noise1 + noise2 + noise3);

    return threshold;
}
float calculateFade(vec3 modelPos, vec3 startPoint, vec3 endPoint) {
    
    float totalDistance = length(endPoint - startPoint);

    
    if (totalDistance < 0.001) return 0.0;

    
    vec3 startToEnd = endPoint - startPoint;
    vec3 startToPos = modelPos - startPoint;
    float progressAlongAxis = dot(startToPos, normalize(startToEnd)) / totalDistance;
    progressAlongAxis = clamp(progressAlongAxis, 0.0, 1.0);

    
    return smoothstep(0.0, 1.0, progressAlongAxis);
}

float calculateCombinedFadeMask(
    vec3 modelPos,
    vec3 fadeStartPoint,
    vec3 fadeEndPoint,
    vec3 fadeStartPoint2,
    vec3 fadeEndPoint2,
    float enableSecondFade,
    float fadeMixMode
) {
    
    float fadeMask1 = calculateFade(modelPos, fadeStartPoint, fadeEndPoint);

    
    float fadeMask2 = 0.0;
    if (enableSecondFade > 0.5) {
        fadeMask2 = calculateFade(modelPos, fadeStartPoint2, fadeEndPoint2);
    }

    
    float fadeMask;
    if (fadeMixMode < 0.5) {
        
        fadeMask = max(fadeMask1, fadeMask2);
    } else {
        
        fadeMask = clamp(fadeMask1 + fadeMask2, 0.0, 1.0);
    }

    return fadeMask;
}
float calculateClipMask(
    vec2 uv,
    vec3 position,
    vec2 screenUv,
    float uLoading,
    float uTime,
    float uMultiplier1,
    float uMultiplier2,
    float uMinZ,
    float uMaxZ,
    vec2 uDirection
) {
    
    vec2 displacedUv = uv + snoise(vec3(uv * uMultiplier1, uTime * 0.05));
    float noiseValue = snoise(vec3(displacedUv * uMultiplier2, uTime * 0.1));

    
    float zDistance = abs(position.z - cameraPosition.z);

    
    float normalizedDepth = (zDistance - uMinZ) / (uMaxZ - uMinZ);
    normalizedDepth = clamp(normalizedDepth, 0.0, 1.0);

    
    
    float directionalBias = dot(screenUv - vec2(0.5), uDirection) * 0.5;
    normalizedDepth += directionalBias;

    
    float displacedProgress = uLoading + noiseValue * 0.02;

    
    return smoothstep(normalizedDepth - 0.001, normalizedDepth + 0.001, displacedProgress);
}

void main() {
    
    
    float fadeMask = calculateCombinedFadeMask(
        vModelPosition,
        uFadeStartPoint,
        uFadeEndPoint,
        uFadeStartPoint2,
        uFadeEndPoint2,
        uEnableSecondFade,
        uFadeMixMode
    );

    
    
    float facingCamera = vViewNormal.z;
    float frontFaceMask = smoothstep(-0.1, 0.1, facingCamera);

    
    float finalMask = fadeMask * frontFaceMask;

    
    
    vec2 ditherCoords = vModelPosition.xy + vModelPosition.z * 0.5;
    float ditherThreshold = getDitherThreshold(ditherCoords, uDitherSize);

    
    float ditherBias = smoothstep(0.0, 1.0, finalMask);
    float ditheredFade = step(ditherThreshold, ditherBias);

    
    
    float clipMask = calculateClipMask(
        vUv,
        vPosition,
        screenUv,
        uLoading,
        uTime,
        uMultiplier1,
        uMultiplier2,
        uMinZ,
        uMaxZ,
        uDirection
    );

    
    
    float finalAlpha = clipMask * uOpacity;

    
    if (clipMask > 0.001) {
        finalAlpha *= ditheredFade;
    }

    
    gl_FragColor = vec4(uDebugColor, ditheredFade * finalAlpha);
}`;

