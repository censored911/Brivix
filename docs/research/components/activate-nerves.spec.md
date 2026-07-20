# ActivateNerves Specification (section index 1)

## Overview
- **Target file:** `src/components/sections/ActivateNerves.tsx` ("use client")
- **Screenshots:** `docs/design-references/section2-y9800.jpeg`, `section2-y12000.jpeg`
- **Interaction model:** scroll-driven reveals (GSAP ScrollTrigger; import from `@/lib/gsap`)

## DOM Structure
`<section id="approach" data-gl-section="1" className="py-section relative z-1">`
- container div: `px-80` (design px; Tailwind spacing = design px in this project)
- `<h2 className="h1 section-title">we activate nerves.</h2>` — two lines, wraps naturally, positioned left-ish under sidebar area, margin-left ≈ 260 design px ("we" on first line, "activate nerves." below — use `w-[8ch]`-ish natural wrap, see screenshot)
- Media block: 16:9, width ≈ 1190 design px, margin-left ≈ 380, margin-top ≈ 190: `<img src="/images/nerves-1.webp">` (1920×1080). Slight parallax: `y` drifts -5%→5% with scrub.
- 3 text blocks (data from `nervesBlocks` in `@/data/content`): each row `flex` with mono index label + h3 heading + paragraphs column.
  - Layout per block (desktop): grid/flex row, heading left (`h3` class `_35 font-medium`, width ~10-13ch), paragraphs right column width ≈ 490 design px, `_20` class, `gap-40`, block spacing `mt-160`.
  - Blocks stagger: alternate left offset (block1 ml-380, block2 ml-680, block3 ml-980 approx — stepped rightward, see screenshots).

## Styles (extracted)
- h2 uses `.h1` type class: 190 design px, -0.05em tracking, weight 400.
- h3: `.h3`/`._35 font-medium` = 35 design px, weight 500.
- p: `._20` = 20 design px, line-height 1.3.
- Section text color: black on grey (bg transparent — canvas shows through).

## States & Behaviors
### SplitText title reveal
- Trigger: ScrollTrigger on h2, `start: "top 80%"`, once.
- SplitText type "lines,words", lines masked (`overflow:hidden`), words `yPercent: 100 → 0`, stagger 0.06, duration 1, ease "power4.out".
### Text block fade-up
- Each block: `opacity 0→1, y 40→0`, `start: "top 85%"`, duration 0.9, ease "power3.out", once.
### Image reveal
- `clipPath: inset(15% 0 15% 0) → inset(0 0 0 0)` + subtle parallax scrub.

## Responsive
- Desktop (1440): as above. Mobile (≤640 `s:`): everything stacks, `px-15`, image full width, blocks full width no offsets, `sm_27`/`sm_14` type classes.

## Verify
`npx tsc --noEmit` must pass.
