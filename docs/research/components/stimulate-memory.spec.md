# StimulateMemory Specification (section index 2)

## Overview
- **Target file:** `src/components/sections/StimulateMemory.tsx` ("use client")
- **Screenshots:** `docs/design-references/section3-y16500.jpeg`, `section3-y17800.jpeg`
- **Interaction model:** scroll-driven reveals + time-driven marquee + count-up numbers

## DOM Structure
`<section id="clients" data-gl-section="2" className="py-section relative z-1">`
- `<h2 className="h1 section-title">we stimulate memory.</h2>` (ml ≈ 380 design px, overlaps the white card below; "we" / "stimulate" / "memory." wraps over 3 lines, see screenshot; z-index above card)
- White card: width ≈ 1190 design px, ml ≈ 380, `mt ≈ -120` (title overlaps top edge), `bg-white/90 backdrop-blur-sm` (near-white rgb(245,245,245)), padding 100 design px block.
  - Intro p: "We've created experiences for the world's most impactful brands." — `_27`, width ~24ch, mb-80.
  - **Logo marquee** (3 rows, from `clientLogoRows` in `@/data/content`, logos at `/logos/{name}.svg`):
    - Each row: `.marquee-track` (CSS class exists in globals.css; duplicate row content 2× inside track for seamless -50% loop). Row 2 uses `rev` class (opposite direction). `--marquee-duration: 40s` rows 1/3, `50s` row 2.
    - Logo img height ≈ 45 design px, gap ≈ 120 design px, `object-contain`, grayscale/black logos as provided.
    - Rows `overflow:hidden`, `mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent)`.
  - "The industry has taken note." — `_27`, mt-120, mb-60.
  - **Awards grid** (`awards` from `@/data/content`, logos at `/awards/{logo}.svg`): 6 columns (`grid-cols-6`, `s:grid-cols-2`), each cell: logo (h ≈ 45 design px, border-b hairline `border-black/40` above and below), then `×{count}` where × is small (27 design px, baseline-ish) and count is 76 design px Denim; hairline `border-b border-dashed border-black/40`; below: mono `_9` uppercase footnote block "(INCLUDING)…" if `including` present.

## States & Behaviors
- Title SplitText reveal (same recipe as other sections: lines/words masked, start "top 80%", once).
- Card: `opacity 0→1, y 60→0` on enter (start "top 75%").
- **Count-up:** each award count animates 0→N when grid enters viewport (`start: "top 80%"`, once, duration 1.2, ease "power2.out", snap to integer — use gsap to tween an object and set textContent).
- Marquee: continuous; pause on `prefers-reduced-motion` (already handled by CSS).

## Responsive
- Mobile: card full-width `mx-15`, padding 30, awards 2 cols, marquee logo h 28 design px.

## Verify
`npx tsc --noEmit` must pass.
