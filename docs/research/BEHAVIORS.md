# mantis.works — Behavior Bible

## Global
- **Smooth scroll:** Lenis (`html.lenis`). GSAP ScrollTrigger synced to Lenis. RAF driven (tempus).
- **`body.at-top`** class present only at scrollY 0 (removed on scroll; used for nav/logo states).
- **Noise overlay:** fixed, full-viewport `div.noise` with `background-image: noise.webp`, `z-index:2`, pointer-events none, centered translate(-50%,-50%), width/height > viewport (~lvh), opacity subtle.
- **WebGL canvas:** fixed full-screen behind content (`-z-1`), pointer-events none. Three.js. 4 GLB "scribble human" models + footer arm model. Custom shader material: black lines, dither/noise fade reveal along model axis (fadeStart/EndPoints), accent color `#3DFF17`. Scroll-driven multi-stage transforms — exact configs in `world-model-configs.txt`.
- **Loader:** fixed overlay `.loader` (z-12) on initial load; reveals page, sets `--nav-blur-load:1`.
- **Fonts:** Denim 400/500 (display+body), Graebenbach Mono 400/600 (labels). All type scales as vw of 1920 design width (h1: 190px design → `calc(190/1920*100vw)`).
- **Cursor/theme colors:** bg `rgb(222,222,222)` (--color-grey), text black, accent green `#3DFF17`.
- **Easings:** `--ease: .8s cubic-bezier(.84,0,.16,1)`, `--smooth: cubic-bezier(.76,0,.24,1)`, `--fast-ease: .6s`, `--color-ease: .4s ease-out`.

## Fixed chrome
- **Nav (top right, fixed z-9):** "About Us" / "Contact" links (Denim 16px design). Behind it a progressive blur wedge (conic-gradient mask, backdrop blur 20px, rotation 13deg — CSS vars --nav-blur-*). Weather widget top-center: sun icon + "NEW YORK CITY / {temp}° SUNNY" from open-meteo API (lat 40.7128, lon -74.006, fahrenheit), Graebenbach Mono ~8px design, uppercase.
- **Sidebar (fixed left, z-10, grid-rows-3):** top: vertical text "EXPERIENTIAL | BRANDING | DIGITAL" (writing-mode vertical, Mono, w-12 px divider lines) with SplitText reveal on load. middle: Mantis wordmark SVG (~160px design) + "EXPERIENCE STUDIO" mono label. Green origami mantis illustration sits at bottom-left edge (part of the WebGL scene / accent). bottom: "MADE WITH LOVE" vertical mono text.
- **Right edge (part of nav/sidebar):** vertical mono text with live clock "HH:MM:SS" + "40.7128° N, 74.0060° W" + "© 2025".

## Hero (header, 9009px tall, trigger index 0)
- Text stage 1 (y≈0): `h1` "we create feelings." centered, w-max, with pill button "View our reel" overlapping text (white pill, Denim ~27px design). SplitText line/word reveal on load after loader.
- Stage 2 (y≈ hero 500–920%… visually y 800–3900): h2.section-title text-right "Great design doesn't just guide behavior." — words reveal via SplitText masked lines, scrub-linked.
- Stage 3 (y≈5600+): h2.section-title left "It speaks directly to the nervous system." Same reveal, appears word-by-word with scroll ("It speaks" first).
- Model1 flies through 4 keyframe stages (A→B→C→D) mapped to scroll segments (AB: 1%–390%, BC: 500%–920%, CD: 1000%–end).
- Texts fade out between stages (opacity + y drift).

## Section 1 — "we activate nerves." (trigger 1)
- `h2.h1.section-title` reveal (SplitText scrub).
- Large media block (16:9): nerves imagery (nerves-1/2/3.webp) — concrete wall light imagery; appears with clip/scale reveal on enter.
- 3 text columns/blocks: h3 "There's a better way." / "Small Teams, Big Ideas." / "Streamlined by AI." each with paragraphs (`_20` ≈ 20px design). Fade-up on enter viewport (Batch/Fade modules).
- Model2 visible in this section, own transform tween.

## Section 2 — "we stimulate memory." (trigger 2)
- `h2.h1.section-title` reveal.
- White card (`bg near-white, full-bleed within container`): "We've created experiences for the world's most impactful brands."
- **Logo marquee:** 3 rows (adidas, Google, Complex, Microsoft, Spotify, NBA / Meta, Saks Fifth, HBO Max, Sonos, EA / Pepsi, Hypebeast, Wilson, Levi's, Airbnb), infinite translateX loop, alternating directions, logos duplicated 5–7×. Marque.js: velocity-reactive (scroll speed skews/accelerates).
- "The industry has taken note." + **Awards grid** (6 columns): FWA ×26, Awwwards ×11, Webby ×11, CSSDA ×10, The Drum ×6, Cannes ×1 — with mono footnotes "(INCLUDING) FWA OF THE YEAR…". Numbers count up on enter (Numbers.js).
- Model3 (jumping figure) behind/above.

## Section 3 — "we excite neurons." (trigger 3)
- `h2.h1.section-title` reveal.
- "Experiential /SERVICES" heading row (Denim 25px design + mono label).
- **Services accordion stack:** 6 items — Architecture; Spatial & Interior Design; Interactive / Creative Technology; Event Production; Content & Immersive AV; Brand Experience & Strategy (full copy in content-extract-2.json). Each `services_item`: white gradient bar, backdrop blur, `+` icon, staggered left offset (stacked/stepped layout), click toggles open (Accordion.js: height auto tween, + rotates to ×). Items have `white-gradient-light` background.
- Section ends `pb-[80vh]` — model4 plays out beneath.

## Footer (trigger 4)
- Green gradient (radial, #3DFF17-ish → grey) rendered by WebGL footerGradient plane + wireframe forearm model rising on scroll into view (scrub "top bottom → bottom bottom").
- "Let's build your next project together." (h2 ~45px design)
- 4 link columns (mono uppercase labels + Denim links): PRIMARY: Approach/Clients/Awards/Services · GO DEEPER: About · SOCIAL: Instagram/X · WANT TO SEE OUR WORK?: hey@mantis.works
- Bottom row mono: "© COPYRIGHT 2026 MANTIS WORKS ALL RIGHT RESERVED" · "NEW YORK CITY {live time}" · "WE COULD JUST EAT YOU UP /////…"
- Giant "Mantis" wordmark clipped at bottom (~50vh tall, overflow-clip).
- Link hover: LinkAnimation.js — text slides up, duplicate slides in from below (masked two-line hover).

## Reel overlay (`.real`, fixed z-15)
- Opens on "View our reel" click. Fullscreen video (`/videos/real.mp4` desktop, `/videos/mob-real.mp4` mobile), custom UI: timecode "00:03 / 00:15", "MANTIS LAUNCH REEL ■ 2025" mono labels, close button. Scale/clip open transition; Lenis paused while open.

## Hover states
- Nav links & footer links: two-line masked slide (translateY -100% on hover, .8s cubic-bezier(.84,0,.16,1)).
- "View our reel" pill: scale/color shift (white bg pill, black text; hover slightly scales).
- Accordion tops: background lightens; cursor pointer.

## Responsive (breakpoints from Tailwind-ish prefixes: `l:` ≈ ≤1024, `s:` ≈ ≤640)
- Sidebar collapses: vertical texts hidden on `l:`; logo moves to top-left; weather moves to right-bottom vertical on `l:`, hidden on `s:`.
- Hero text scales with vw; sizes bump up in vw terms on small screens (sm_ variants ≈ 14/27px design on 390 basis).
- Sections stack single-column on `s:`. Awards grid → 2–3 cols. Accordion full-width, no stepped offsets.
