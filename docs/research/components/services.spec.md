# Services Specification (section index 3)

## Overview
- **Target file:** `src/components/sections/Services.tsx` ("use client")
- **Screenshot:** `docs/design-references/section4-y20800.jpeg`
- **Interaction model:** scroll reveals + CLICK-driven accordions

## DOM Structure
`<section id="services" data-gl-section="3" className="pt-section pb-[80vh] relative z-1">`
- `<h2 className="h1 section-title">we excite neurons.</h2>` (ml ≈ 260 design px, wraps "we excite" / "neurons.")
- 3 category groups (`serviceGroups` from `@/data/content`), each:
  - Group header bar: white bg (`bg-white`), pl-15 py-40, contains `<h3 className="h3">{category}</h3>` + mono label `/SERVICES` (`_9 font-mono uppercase`) — like "Experiential /SERVICES".
  - 4 accordion items stacked below. **Stepped layout:** each successive item indents further right: item i has `margin-left: calc(i * 18 * var(--px))` and full remaining width (see screenshot: staircase effect).
- Accordion item (`services_item white-gradient-light backdrop-blur-md`):
  - Top row (`accordion_top`): `flex items-center gap-10 px-20 py-20 cursor-pointer`, contains `+` icon (plus made of two 1px black bars, 12×12 design px, rotates 45° when open → ×) and title `_27`.
  - Content (collapsed by default, `height: 0, overflow: hidden`): padding `px-20 pb-30`, body paragraph `_20` (max-width ~600 design px), then mono label "RELATED SERVICES" `_9 font-mono uppercase mt-30 mb-10`, then related list as wrapped flex of pill-ish text items (`_16`, separated by line breaks — simple `flex flex-col gap-6`), then `mt-20` mono link "REACH OUT FOR EXAMPLES! → hey@mantis.works" (mailto link).

## States & Behaviors
### Accordion toggle (CLICK)
- Click on `accordion_top` toggles the item. Only one open per group is NOT enforced (independent toggles).
- Open: gsap.to(content, { height: "auto", duration: 0.6, ease: "power3.inOut" }); plus icon rotates 45° (`transition: transform .4s var(--smooth)`).
- Close: height back to 0.
### Reveals
- Title SplitText (lines/words masked, start "top 80%", once).
- Each group + items: `opacity 0→1, y 40→0` stagger 0.08 on enter (start "top 85%", once).
### Hover
- `accordion_top:hover` background lightens: `background: rgba(255,255,255,.5)`, transition `background var(--color-ease)`.

## Responsive
- Mobile: no stepped indents (ml-0), `px-15`, body max-w-260 (design px scale of 390).

## Verify
`npx tsc --noEmit` must pass.
