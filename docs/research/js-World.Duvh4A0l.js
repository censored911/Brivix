import{D as I,G as O,m as Z,a as q,c as P,b as u,i as B}from"./animationUtils.CgMHCfxP.js";import{S as U,U as i,C as x,V as p,G as H,a as R,M as g,b as v,B as w,c as b,L as C,d as F,A as S,e as m,i as T}from"./GL.D5Drsdv4.js";import{g as j}from"./all.xlujcirQ.js";import{S as G}from"./ScrollTrigger.C4gmGO9R.js";import{A as M}from"./AnimateModel.BzLk166y.js";import"./index.xlujcirQ.js";import"./CSSPlugin.pkypRvgD.js";import"./Layout.astro_astro_type_script_index_0_lang.313rQJIa.js";import"./tempus.B_tY_6We.js";var N=`varying vec2 vUv;
varying vec2 screenUv;
varying vec3 vPosition;

void main()
{
    vUv = uv;
    vec4 modelPoisition = modelMatrix * vec4(position, 1.0);

    
    gl_Position = projectionMatrix * viewMatrix * modelPoisition;

    screenUv = vec2(gl_Position.xy / gl_Position.w) * 0.5 + 0.5;
    vPosition = modelPoisition.xyz;
}`,W=`uniform float uLoading;
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
}`;let z=class{constructor(e,t,o,n,a,s){this.app=e,this.gl=t,this.mesh=o,this.group=n,this.color=a,this.direction=s,this.init()}init(){this.setMaterial()}setMaterial(){this.material=new U({vertexShader:N,fragmentShader:W,transparent:!0,uniforms:{uLoading:new i(0),uProgress:new i(0),uMinZ:new i(-2),uMaxZ:new i(10),uColor:new i(new x(this.color,this.color,this.color)),uTime:new i(0),uMultiplier1:new i(2.8),uMultiplier2:new i(.82),uMultiplier3:new i(3.77),uDirection:new i(this.direction&&typeof this.direction=="object"?new p(this.direction.x,this.direction.y):this.direction?new p(1,-.5):new p(-1,-.5)),uAccentColor:new i(new x("#3DFF17")),uShowAccent:new i(1),uOpacity:new i(1)}}),this.mesh.material=this.material}resize(){}update(){this.material.uniforms.uTime.value=this.app.time.elapsed*.001}destroy(){}};j.registerPlugin(G);class D{constructor(e,t,o){this.world=e,this.app=t,this.main=o,this.destroyed=!1,this.initialized=!1,this.prevModel=null,this.footerModel=null,this.footerGradient=null,this.scrollTrigger=null,this.footerSection=this.main.querySelector(".footer")||this.main.querySelector("footer"),this.init()}init(){if(!(this.destroyed||!this.footerSection)){if(this.prevModel=this.world.models[3],this.footerModel=this.world.footerModel,this.footerGradient=this.world.footerGradient,!this.footerModel||!this.footerGradient){console.warn("FooterScrollAnimation: Models or gradient not ready");return}this.footerGradient.material&&this.footerGradient.material.uniforms&&(this.footerGradient.material.uniforms.uProgress.value=0),this.scrollTrigger=G.create({trigger:this.footerSection,start:"top center",end:"top top",onUpdate:e=>{this.footerGradient&&this.footerGradient.material&&this.footerGradient.material.uniforms&&(this.footerGradient.material.uniforms.uProgress.value=e.progress)}}),this.initialized=!0}}resize(){this.destroyed||!this.initialized||this.scrollTrigger&&this.scrollTrigger.refresh()}destroy(){this.destroyed||(this.destroyed=!0,this.scrollTrigger&&(this.scrollTrigger.kill(),this.scrollTrigger=null),this.prevModel=null,this.footerModel=null,this.footerGradient=null)}}const X="/_astro/model-3.zeNsMlvR.glb",Y="/_astro/model-4.CykbczgT.glb";var Q=`varying vec2 vUv;
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
}`,J=`uniform float uLoading;
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
}`;let K=class{constructor(e,t,o,n,a,s,d){this.app=e,this.gl=t,this.mesh=o,this.group=n,this.color=a,this.direction=s,this.model=d,this.animationTime=0,this.helpers=null,this.showHelpers=!1,this.init()}init(){this.setMaterial(),this.createHelpers(),this.setDebug()}createHelpers(){this.helpers=new H,this.helpers.visible=this.showHelpers;const e=new R(.1,16,16),t=new g({color:65280,wireframe:!1,opacity:.8,transparent:!0});this.fadeStartHelper=new v(e,t),this.helpers.add(this.fadeStartHelper);const o=new g({color:16711680,wireframe:!1,opacity:.8,transparent:!0});this.fadeEndHelper=new v(e,o),this.helpers.add(this.fadeEndHelper);const n=new g({color:65535,wireframe:!1,opacity:.8,transparent:!0});this.fadeStartHelper2=new v(e,n),this.helpers.add(this.fadeStartHelper2);const a=new g({color:16711935,wireframe:!1,opacity:.8,transparent:!0});this.fadeEndHelper2=new v(e,a),this.helpers.add(this.fadeEndHelper2);const s=new w,d=new Float32Array(6);s.setAttribute("position",new b(d,3));const l=new C({color:16776960,opacity:.5,transparent:!0});this.connectionLine=new F(s,l),this.helpers.add(this.connectionLine);const c=new w,h=new Float32Array(6);c.setAttribute("position",new b(h,3));const f=new C({color:65280,opacity:.5,transparent:!0});this.connectionLine2=new F(c,f),this.helpers.add(this.connectionLine2),this.fadeStartAxis=new S(.3),this.helpers.add(this.fadeStartAxis),this.fadeEndAxis=new S(.3),this.helpers.add(this.fadeEndAxis),this.group?this.group.add(this.helpers):this.mesh.parent&&this.mesh.parent.add(this.helpers),this.updateHelpers()}updateHelpers(){if(!this.helpers)return;const e=this.material.uniforms.uFadeStartPoint.value,t=this.material.uniforms.uFadeEndPoint.value,o=this.material.uniforms.uFadeStartPoint2.value,n=this.material.uniforms.uFadeEndPoint2.value,a=this.material.uniforms.uEnableSecondFade.value>.5;this.fadeStartHelper.position.copy(e),this.fadeEndHelper.position.copy(t),this.fadeStartAxis.position.copy(e),this.fadeEndAxis.position.copy(t);const s=this.connectionLine.geometry.attributes.position.array;if(s[0]=e.x,s[1]=e.y,s[2]=e.z,s[3]=t.x,s[4]=t.y,s[5]=t.z,this.connectionLine.geometry.attributes.position.needsUpdate=!0,this.fadeStartHelper2.visible=a,this.fadeEndHelper2.visible=a,this.connectionLine2.visible=a,a){this.fadeStartHelper2.position.copy(o),this.fadeEndHelper2.position.copy(n);const d=this.connectionLine2.geometry.attributes.position.array;d[0]=o.x,d[1]=o.y,d[2]=o.z,d[3]=n.x,d[4]=n.y,d[5]=n.z,this.connectionLine2.geometry.attributes.position.needsUpdate=!0}}toggleHelpers(e){this.showHelpers=e,this.helpers&&(this.helpers.visible=e)}setMaterial(){const e=this.model.fadePoints||{fadeStartPoint:{x:-.18,y:1.38,z:.26},fadeEndPoint:{x:.1,y:1.44,z:.54},fadeStartPoint2:{x:0,y:-2,z:0},fadeEndPoint2:{x:0,y:-3.5,z:0}};this.material=new U({vertexShader:Q,fragmentShader:J,transparent:!0,uniforms:{uLoading:new i(0),uFadeStartPoint:new i(new m(e.fadeStartPoint.x,e.fadeStartPoint.y,e.fadeStartPoint.z)),uFadeEndPoint:new i(new m(e.fadeEndPoint.x,e.fadeEndPoint.y,e.fadeEndPoint.z)),uFadeStartPoint2:new i(new m(e.fadeStartPoint2.x,e.fadeStartPoint2.y,e.fadeStartPoint2.z)),uFadeEndPoint2:new i(new m(e.fadeEndPoint2.x,e.fadeEndPoint2.y,e.fadeEndPoint2.z)),uEnableSecondFade:new i(this.model.name==="model4"?1:0),uFadeMixMode:new i(0),uDebugMode:new i(0),uDebugColor:new i(new m(.8671875,.8671875,.8671875)),uDitherSize:new i(.2),uProgress:new i(0),uMinZ:new i(-2),uMaxZ:new i(10),uTime:new i(0),uMultiplier1:new i(2.8),uMultiplier2:new i(.82),uMultiplier3:new i(3.77),uDirection:new i(this.direction&&typeof this.direction=="object"?new p(this.direction.x,this.direction.y):this.direction?new p(1,-.5):new p(-1,-.5)),uColor:new i(new x(.8671875,.8671875,.8671875)),uAccentColor:new i(new x("#3DFF17")),uShowAccent:new i(1),uOpacity:new i(1)}}),this.mesh.material=this.material,this.mesh.renderOrder=10}setDebug(){if(!this.app.debug||!this.app.debug.active||!this.app.debug.gui)return;this.mesh.name||this.group.name;const e=this.app.debug.gui.addFolder(`Test Material - ${this.model.name}`).close(),t={Red:()=>{this.material.uniforms.uDebugMode.value=1,this.material.uniforms.uDebugColor.value.set(.8671875,.8671875,.8671875)},Grey:()=>{this.material.uniforms.uDebugMode.value=0}};e.add(t,"Red"),e.add(t,"Grey");const o=e.addFolder("Fade Controls");o.add(this.material.uniforms.uDitherSize,"value",.1,10,.01).name("Dither Density"),o.add(this,"showHelpers").name("Show Helper Points").onChange(V=>{this.toggleHelpers(V)});const n=o.addFolder("Fade Start Point (Green - Center/Wrist)"),a=this.material.uniforms.uFadeStartPoint.value;n.add(a,"x",-2,2,.01).name("X").onChange(()=>this.updateHelpers()),n.add(a,"y",-2,2,.01).name("Y").onChange(()=>this.updateHelpers()),n.add(a,"z",-2,2,.01).name("Z").onChange(()=>this.updateHelpers());const s=o.addFolder("Fade End Point (Red - Fingertip)"),d=this.material.uniforms.uFadeEndPoint.value;s.add(d,"x",-2,2,.01).name("X").onChange(()=>this.updateHelpers()),s.add(d,"y",-2,2,.01).name("Y").onChange(()=>this.updateHelpers()),s.add(d,"z",-2,2,.01).name("Z").onChange(()=>this.updateHelpers()),o.add(this.material.uniforms.uEnableSecondFade,"value").name("Enable Second Fade").onChange(()=>this.updateHelpers());const l={"Max (Union)":0,"Add (Combine)":1};o.add(this.material.uniforms.uFadeMixMode,"value",l).name("Mix Mode");const c=o.addFolder("Fade Start Point 2 (Cyan - Ankle)"),h=this.material.uniforms.uFadeStartPoint2.value;c.add(h,"x",-2,2,.01).name("X").onChange(()=>this.updateHelpers()),c.add(h,"y",-2,2,.01).name("Y").onChange(()=>this.updateHelpers()),c.add(h,"z",-2,2,.01).name("Z").onChange(()=>this.updateHelpers());const f=o.addFolder("Fade End Point 2 (Magenta - Foot)"),y=this.material.uniforms.uFadeEndPoint2.value;f.add(y,"x",-2,2,.01).name("X").onChange(()=>this.updateHelpers()),f.add(y,"y",-2,2,.01).name("Y").onChange(()=>this.updateHelpers()),f.add(y,"z",-2,2,.01).name("Z").onChange(()=>this.updateHelpers()),e.add(this.material.uniforms.uLoading,"value",0,1,.01).name("Loading")}resize(){}update(){this.material.uniforms.uTime.value=this.app.time.elapsed*.001}destroy(){}};function A(r,e,t,o=.8671875){r.materialType==="Material"?(r.inner=new z(e,t,r.group.children[0],r.group,o,r.direction),r.inner.material.uniforms.uShowAccent.value=0):r.inner=new K(e,t,r.group.children[0],r.group,o,r.direction,r),r.material=new z(e,t,r.group.children[0].children[0].children[0],r.group,0,r.direction),r.inner.material.uniforms.uLoading.value=0,r.material.material.uniforms.uLoading.value=0}const ee="model1",te=0,oe="@static/models/model-1.glb",ne=5.59,ie={x:2.93,y:-7.54,z:0},se={x:0,y:-.641592653589793,z:0},ae={x:.6,y:-.5},re="TestMaterial",de={fadeStartPoint:{x:.0600000000000001,y:1.36,z:.4},fadeEndPoint:{x:.15,y:1.34,z:.63},fadeStartPoint2:{x:0,y:-2,z:0},fadeEndPoint2:{x:0,y:-3.5,z:0}},le={multiStage:!0,showMarkers:!1,stages:{pointA:{position:{x:2.93,y:-7.54,z:0},rotation:{x:0,y:0,z:0},scale:5.59},pointB:{position:{x:-1.93,y:-7.75,z:-.4699},rotation:{x:-.0615,y:1.3084,z:.1284},scale:5.41},pointC:{position:{x:0,y:-7.75,z:-4.11},rotation:{x:.3984,y:2.5884,z:-.0615},scale:7.57},pointD:{position:{x:-.4699,y:-12.12,z:-6.29},rotation:{x:.3984,y:3.72681,z:.0284},scale:12.16}},segments:{AB:{trigger:0,endTrigger:0,start:"top top+=1%",end:"top top-=390%"},BC:{trigger:0,endTrigger:0,start:"top top-=500%",end:"top top-=920%"},CD:{trigger:0,endTrigger:0,start:"top top-=1000%",end:"bottom -60%"}},visibilityTrigger:{trigger:1,endTrigger:1,start:"top 70%",end:"bottom top"}},ce={multiStage:!0,showMarkers:!1,stages:{pointA:{position:{x:2.51,y:-6.75,z:-2.51},rotation:{x:0,y:0,z:0},scale:5.8},pointB:{position:{x:-.739999999999998,y:-6.35,z:-4.29},rotation:{x:-.0615,y:1.3084,z:.1284},scale:5.24},pointC:{position:{x:-1.93,y:-8.1,z:-7.84},rotation:{x:.3984,y:2.5884,z:-.0615},scale:9.38},pointD:{position:{x:-.4699,y:-12.24,z:-6.29},rotation:{x:.3984,y:3.72681,z:.0284},scale:11.64}},segments:{AB:{trigger:0,endTrigger:0,start:"top top+=1%",end:"top top-=250%"},BC:{trigger:0,endTrigger:0,start:"top top-=310%",end:"top top-=540%"},CD:{trigger:0,endTrigger:0,start:"top top-=600%",end:"bottom -60%"}},visibilityTrigger:{trigger:1,endTrigger:0,start:"top 70%",end:"bottom -40%"}},E={name:ee,index:te,modelPath:oe,scale:ne,position:ie,rotate:se,direction:ae,materialType:re,fadePoints:de,animationConfig:le,mobileAnimationConfig:ce},pe="model2",he=1,fe="@static/models/model-2.glb",me=3.4,ue={x:0,y:0,z:0},ge={x:0,y:0,z:0},ve={x:1,y:-.5},xe="TestMaterial",ye={fadeStartPoint:{x:.39,y:.42,z:.07},fadeEndPoint:{x:.37,y:.32,z:.1},fadeStartPoint2:{x:0,y:-2,z:0},fadeEndPoint2:{x:0,y:-3.5,z:0}},Me={sectionIndex:1,startPos:{position:{x:0,y:-1.4,z:0},rotation:{x:-.303,y:-2.26318,z:0},scale:3.4},endPos:{position:{x:2.43,y:-.96,z:-.1899},rotation:{x:-.02469,y:-1.8847,z:0},scale:4.39},transform:{start:"top center",end:"top center-=200%",trigger:1,endTrigger:1},materialFadeIn:{enabled:!0,progress:{start:0,end:1}},materialFadeOut:{enabled:!0,progress:{start:1,end:0}},visibilityTrigger:{trigger:1,endTrigger:1,start:"top center",end:"bottom -30%"},showMarkers:!1},ze={sectionIndex:1,startPos:{position:{x:0,y:-1.4,z:0},rotation:{x:-.1515,y:-1.13159,z:0},scale:3.4},endPos:{position:{x:.150000000000002,y:-.449999999999999,z:-2.51},rotation:{x:.18681469282041482,y:-1.30318530717959,z:0},scale:4.58},transform:{start:"top center",end:"top center-=200%",trigger:1,endTrigger:1},materialFadeIn:{enabled:!0,progress:{start:0,end:1}},materialFadeOut:{enabled:!0,progress:{start:1,end:0}},visibilityTrigger:{trigger:1,endTrigger:1,start:"top center",end:"bottom top"},showMarkers:!1},_={name:pe,index:he,modelPath:fe,scale:me,position:ue,rotate:ge,direction:ve,materialType:xe,fadePoints:ye,animationConfig:Me,mobileAnimationConfig:ze},Pe="model3",we=2,be="@static/models/model-3.glb",Ce=2.29,Fe={x:0,y:0,z:0},Se={x:0,y:0,z:0},Te={x:0,y:0},De="Material",Ae={fadeStartPoint:{x:-.18,y:1.38,z:.26},fadeEndPoint:{x:.1,y:1.44,z:.54},fadeStartPoint2:{x:0,y:-2,z:0},fadeEndPoint2:{x:0,y:-3.5,z:0}},Ee={sectionIndex:2,startPos:{position:{x:-.89,y:-3.69,z:-5.79},rotation:{x:0,y:-2.20636,z:-.4462},scale:2.29},endPos:{position:{x:-2.22,y:-1.59,z:-.1899},rotation:{x:-1.14318530717959,y:.11363469282041,z:-.2231},scale:6.58},transform:{start:"top bottom",end:"top bottom-=200%",trigger:2,endTrigger:2},materialFadeIn:{enabled:!0,progress:{start:0,end:1}},materialFadeOut:{enabled:!0,progress:{start:1,end:0}},visibilityTrigger:{trigger:2,endTrigger:2,start:"top center",end:"bottom -35%"},showMarkers:!1},_e={sectionIndex:2,startPos:{position:{x:-.89,y:-3.69,z:-5.79},rotation:{x:0,y:-2.20636,z:-.4462},scale:2.29},endPos:{position:{x:-.739999999999998,y:-1.63,z:-.739999999999998},rotation:{x:-.263185307179586,y:-.633185307179586,z:-.183185307179586},scale:3.91},transform:{start:"top bottom",end:"top bottom-=200%",trigger:2,endTrigger:2},materialFadeIn:{enabled:!0,progress:{start:0,end:1}},materialFadeOut:{enabled:!0,progress:{start:1,end:0}},visibilityTrigger:{trigger:2,endTrigger:2,start:"top bottom",end:"bottom -15%"},showMarkers:!1},k={name:Pe,index:we,modelPath:be,scale:Ce,position:Fe,rotate:Se,direction:Te,materialType:De,fadePoints:Ae,animationConfig:Ee,mobileAnimationConfig:_e},ke="model4",$e=3,Le="@static/models/model-4.glb",Ue=2.03,He={x:0,y:0,z:0},Ge={x:0,y:0,z:0},Ve={x:1,y:-.5},Ie="TestMaterial",Oe={fadeStartPoint:{x:.02,y:.61,z:.2},fadeEndPoint:{x:.3,y:.8,z:.4},fadeStartPoint2:{x:-.35,y:.54,z:.2},fadeEndPoint2:{x:-.31,y:1.05,z:-.03}},Ze={sectionIndex:3,startPos:{position:{x:1.890000000000001,y:-2.29,z:2.61},rotation:{x:-1.81318530717959,y:1.85681469282041,z:-.00318530717958598},scale:2.03},endPos:{position:{x:1.07,y:-.449999999999999,z:1.21},rotation:{x:1.70681469282041,y:-.923185307179586,z:.306814692820414},scale:2.4},transform:{start:"top 60%",end:"top -140%",trigger:3,endTrigger:3},materialFadeIn:{enabled:!0,progress:{start:0,end:1}},materialFadeOut:{enabled:!0},visibilityTrigger:{trigger:3,endTrigger:3,start:"top 60%",end:"bottom -15%"},showMarkers:!1},qe={sectionIndex:3,startPos:{position:{x:1.890000000000001,y:-2.29,z:2.61},rotation:{x:0,y:0,z:0},scale:2.03},endPos:{position:{x:.150000000000002,y:-.439999999999998,z:2.49},rotation:{x:1.45681469282041,y:1.59681469282041,z:-.413185307179586},scale:1.32},transform:{start:"top bottom",end:"top bottom-=200%",trigger:3,endTrigger:3},materialFadeIn:{enabled:!0,progress:{start:0,end:1}},materialFadeOut:{enabled:!0},visibilityTrigger:{trigger:3,endTrigger:3,start:"top bottom",end:"bottom 40%"},showMarkers:!1},$={name:ke,index:$e,modelPath:Le,scale:Ue,position:He,rotate:Ge,direction:Ve,materialType:Ie,fadePoints:Oe,animationConfig:Ze,mobileAnimationConfig:qe},Be="footerModel",Re=0,je="@static/models/model-2.glb",Ne=11.8,We={x:-5.79,y:-7.89,z:1.91},Xe={x:9.47,y:-.68,z:-.870000000000001},Ye={x:0,y:0,z:0},Qe={x:0,y:0,z:0},Je={x:1,y:-.5},Ke="Material",et={sectionIndex:5,startPos:{position:{x:-5.33,y:-12.59,z:1.7},rotation:{x:-.4715,y:-.9715,z:1.5784},scale:11.8},endPos:{position:{x:-5.79,y:-7.89,z:1.91},rotation:{x:-.513185307179586,y:-.383185307179586,z:1.59681469282041},scale:11.8},transform:{start:"top bottom",end:"bottom bottom-=5%",trigger:4,endTrigger:4},materialFadeIn:{enabled:!0,progress:{start:0,end:1}},materialFadeOut:{enabled:!1},showMarkers:!1},tt={sectionIndex:5,startPos:{position:{x:9.47,y:-.68,z:-.870000000000001},rotation:{x:0,y:0,z:0},scale:11.8},endPos:{position:{x:5.72,y:1.55,z:.83},rotation:{x:-.503185307179586,y:2.62681469282041,z:0},scale:6.41},transform:{start:"top bottom",end:"bottom bottom",trigger:4,endTrigger:4},materialFadeIn:{enabled:!0,progress:{start:0,end:1}},materialFadeOut:{enabled:!1},showMarkers:!1},L={name:Be,index:Re,modelPath:je,scale:Ne,position:We,mobilePosition:Xe,rotate:Ye,mobileRotation:Qe,direction:Je,materialType:Ke,animationConfig:et,mobileAnimationConfig:tt};class ft{constructor(e,t,o,n){this.gl=e,this.app=t,this.scene=o,this.main=n,this.sizes=this.app.sizes,this.renderer=this.gl.renderer.instance,this.camera=this.gl.camera.instance,this.scene=o,this.debug=this.app.debug,this.debugFolders={},this.destroyed=!1,this.load()}load(){if(this.modelOptions(),this.dracoLoader=new I,this.dracoLoader.setDecoderPath("/draco/"),this.loader=new O,this.loader.setDRACOLoader(this.dracoLoader),this.app.options.models.length>0&&this.app.options.footerModel)this.useLoadedModels();else{const e=[];if(this.app.options.models.length<1)if(this.app.options.firstModel){const t=[...this.app.options.firstModel.children];for(const o of t)this.models[0].group.add(o.clone());this.scene.add(this.models[0].group),this.models[0].loaded=!0,this.app.options.models.push(this.models[0]),this.addDebugGUI(this.models[0],0)}else e.push(this.loader.loadAsync(this.models[0].url).then(t=>{const o=[...t.scene.children];for(const n of o)this.models[0].group.add(n);this.scene.add(this.models[0].group),this.models[0].loaded=!0,this.app.options.models.push(this.models[0]),this.addDebugGUI(this.models[0],0)}));this.app.options.footerModel||e.push(this.loader.loadAsync(this.footerModel.url).then(t=>{const o=[...t.scene.children];this.app.options.footerModel=o[0].clone()})),e.length===0?(this.loaded=!0,this.init()):Promise.all(e).then(()=>{this.loaded=!0,this.init()})}}addDebugGUI(e,t){}createModelFromConfig(e,t){const o=window.innerWidth<=768;return{name:e.name,index:e.index,url:t,group:new H,scale:e.scale,position:o&&e.mobilePosition?e.mobilePosition:e.position,rotate:o&&e.mobileRotation?e.mobileRotation:e.rotate,animatedRotation:{x:0,y:0,z:0},animatedScrollRotation:{x:0,y:0,z:0},loaded:!1,animationConfig:o&&e.mobileAnimationConfig?e.mobileAnimationConfig:e.animationConfig,direction:e.direction,fadePoints:e.fadePoints,materialType:e.materialType||"TestMaterial",desktopPosition:e.position,mobilePosition:e.mobilePosition,desktopRotation:e.rotate,mobileRotation:e.mobileRotation}}modelOptions(){const e={"@static/models/model-1.glb":q,"@static/models/model-2.glb":Z,"@static/models/model-3.glb":X,"@static/models/model-4.glb":Y},t=(o,n,a=!1)=>{if(a)return this.createModelFromConfig(o,n);if(this.app.options.models){const s=this.app.options.models.find(d=>d.url===n&&d.index===o.index&&d.name===o.name);if(s)return s}return this.createModelFromConfig(o,n)};this.models=[t(E,e[E.modelPath]),t(_,e[_.modelPath]),t(k,e[k.modelPath]),t($,e[$.modelPath])],this.footerModel=t(L,e[L.modelPath],!0),this.models.forEach(o=>{o.quicks||(o.quicks=P(o))}),this.footerModel.quicks||(this.footerModel.quicks=P(this.footerModel))}setupLoadedModel(e,t,o=!1){u(e),e.loaded=!0,e.group.visible=o,A(e,this.app,this.gl),this.scene.add(e.group),e.animationConfig&&(e.animation=new M(e,this.app,this.main,e.animationConfig)),this.addDebugGUI(e,t),this.app.options.models[t]!==e&&(this.app.options.models[t]=e)}loadOtherModelsFromCache(){for(let e=1;e<this.models.length;e++){const t=this.models[e];t&&t.loaded&&t.group?this.setupLoadedModel(t,e,!1):this.loadModelAsync(e)}}loadModelAsync(e){this.loader.load(this.models[e].url,t=>{const o=[...t.scene.children];for(const n of o)this.models[e].group.add(n);this.setupLoadedModel(this.models[e],e,!1)})}loadOtherModels(){const e=[];for(let t=1;t<this.models.length;t++){const o=t,n=new Promise(a=>{this.loader.load(this.models[o].url,s=>{const d=[...s.scene.children];for(const l of d)this.models[o].group.add(l);this.setupLoadedModel(this.models[o],o,!1),a()})});e.push(n)}Promise.all(e).then(()=>{this.footerGradient=new T(this.app,this.gl),this.footerScrollAnimation=new D(this,this.app,this.main),this.createFooterModel(),this.app.trigger("modelsLoaded")})}createFooterModel(){this.footerModel.group.children.length===0&&this.app.options.footerModel&&this.footerModel.group.add(this.app.options.footerModel),u(this.footerModel),this.footerModel.inner=new B(this.app,this.gl,this.footerModel.group.children[0],this.footerModel.group,.8671875),this.footerModel.material=new z(this.app,this.gl,this.footerModel.group.children[0].children[0].children[0],this.footerModel.group,0,this.footerModel.direction),this.footerModel.material.material.uniforms.uLoading.value=0,this.footerModel.group.renderOrder=100,this.footerModel.loaded=!0,this.scene.add(this.footerModel.group),this.addDebugGUI(this.footerModel,5),this.footerModel.animationConfig&&!this.footerModel.animation&&(this.footerModel.animation=new M(this.footerModel,this.app,this.main,this.footerModel.animationConfig))}useLoadedModels(){const e=this.app.options.models.find(t=>t.index===0&&t.name==="model1");this.models[0].group.add(e.group.children[0].clone()),this.setupLoadedModel(this.models[0],0,!0),this.createFooterModel(),this.footerGradient=new T(this.app,this.gl),this.footerScrollAnimation=new D(this,this.app,this.main),this.gl.loaded=!0,this.app.on("homeLoaderReady",()=>{this.destroyed||setTimeout(()=>{this.gl.trigger("loaded"),this.app.trigger("modelsLoaded"),this.app.page.loader.tl.play()},100)}),this.loadOtherModelsFromCache()}init(){!this.app.options.onceLoaded&&!this.app.options.noLoader&&this.app.globalLoader.tl.play(),u(this.models[0]),A(this.models[0],this.app,this.gl),this.gl.loaded=!0,this.gl.trigger("loaded"),this.models[0].animationConfig&&(this.models[0].animation=new M(this.models[0],this.app,this.main,this.models[0].animationConfig)),this.loadOtherModels()}ensureModelsVisible(){this.models&&this.models.forEach(e=>{e&&e.group&&(e.group.visible=!0,e.group.updateMatrixWorld(!0),e.animation&&e.animation.forcePositionUpdate&&e.animation.forcePositionUpdate())}),this.footerModel&&this.footerModel.group&&(this.footerModel.group.visible=!0,this.footerModel.group.updateMatrixWorld(!0),this.footerModel.animation&&this.footerModel.animation.forcePositionUpdate&&this.footerModel.animation.forcePositionUpdate()),this.models?.forEach(e=>{e&&e.material&&(e.material.material.needsUpdate=!0)})}setScroll(){}update(){const e=window.innerWidth<=768;this.models.forEach((t,o)=>{if(!t.loaded)return;const n=this.isModelInViewport(o);if(!(e&&!n)&&(t.group.visible||n)){const a=this.getModelUpdateFrequency(o,n);t.lastUpdateFrame||(t.lastUpdateFrame=0);const s=this.app.time.elapsed;if(s-t.lastUpdateFrame<a)return;t.lastUpdateFrame=s,t.inner&&t.inner.update(),t.material&&t.material.update()}}),this.footerGradient?.update(),this.gl.loaded}isModelInViewport(e){(!this.sectionElements||this.sectionElements.length===0)&&(this.sectionElements=document.querySelectorAll("section"));const t=this.sectionElements[e];if(!t)return!1;const o=t.getBoundingClientRect(),n=window.innerHeight,a=n*.5;return o.bottom>=-a&&o.top<=n+a}getModelUpdateFrequency(e,t){const o=window.innerWidth<=768;if(!t)return o?100:50;(!this.sectionElements||this.sectionElements.length===0)&&(this.sectionElements=document.querySelectorAll("section"));const n=this.sectionElements[e];if(!n)return 16;const a=n.getBoundingClientRect(),s=window.innerHeight,l=Math.abs(a.top+a.height/2-s/2)/s;return l<.3?o?33:16:l<.7?o?66:33:o?100:50}resize(){this.footerModel.loaded&&u(this.footerModel),this.footerScrollAnimation&&this.footerScrollAnimation.resize(),this.footerGradient&&this.footerGradient.resize()}onMouseMove(e,t){window.innerWidth<=768||(this.models.forEach(n=>{n.loaded&&(n.quicks.rotationX(t.y*.02),n.quicks.rotationY(t.x*.02),n.quicks.rotationZ(0))}),this.footerModel.loaded&&(this.footerModel.quicks.rotationX(0),this.footerModel.quicks.rotationY(t.x*.02),this.footerModel.quicks.rotationZ(t.y*.02))),this.footerGradient?.onMouseMove(e,t)}destroy(){this.destroyed||(this.destroyed=!0,this.models.forEach(e=>{e.loaded&&(e.group.children[0].children[0].children[0].material.dispose(),e.group.children[0].children[0].children[0].geometry.dispose(),e.group.children[0].material.dispose(),e.group.children[0].geometry.dispose(),this.scene.remove(e.group))}),this.footerModel.loaded&&(this.footerModel.group.children[0].children[0].children[0].material.dispose(),this.footerModel.group.children[0].children[0].children[0].geometry.dispose(),this.footerModel.group.children[0].material.dispose(),this.footerModel.group.children[0].geometry.dispose(),this.scene.remove(this.footerModel.group)),this.footerGradient?.destroy(),this.footerScrollAnimation&&(this.footerScrollAnimation.destroy(),this.footerScrollAnimation=null))}}export{ft as default};
