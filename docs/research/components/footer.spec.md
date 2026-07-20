# Footer Specification (section index 4)

## Overview
- **Target file:** `src/components/sections/Footer.tsx` ("use client")
- **Screenshot:** `docs/design-references/footer-y22793.jpeg`
- **Interaction model:** scroll-driven entrance; live clock; link hovers

## DOM Structure
`<footer id="footer" data-gl-section="4" className="footer relative z-2 overflow-clip mt-120">`
Note: green gradient + 3D arm are rendered by the global WebGL canvas — footer itself is transparent EXCEPT a CSS fallback radial gradient: `background: radial-gradient(120% 140% at 15% 85%, rgba(61,255,23,0.55), rgba(61,255,23,0.12) 45%, transparent 70%)`.
- Container `px-80 pt-100`:
- `<h2 className="_45">Let's build your next<br/>project together.</h2>` — ml ≈ 285 design px. (Original reads "Let's build your next experiential project together." with "experiential" as decorative script overlap — render plain per screenshot text.)
- Links grid `grid grid-cols-4 gap-40 mt-80 ml-285` (each column):
  - mono header `_9 font-mono uppercase` with dashed border-bottom (`border-b border-dashed border-black/60 pb-8`): "PRIMARY" / "GO DEEPER" / "SOCIAL" / "WANT TO SEE OUR WORK?"
  - links `_27` stacked `gap-8 mt-15`: PRIMARY: Approach(#approach) Clients(#clients) Awards(#clients) Services(#services); GO DEEPER: About(/); SOCIAL: Instagram, X (https://instagram.com/mantis.works, https://x.com); WORK: hey@mantis.works (mailto).
  - Use the `.link-anim` pattern from globals.css: `<a className="link-anim _27"><span data-text="Approach">Approach</span></a>` — masked two-line hover slide.
- Bottom meta row: `flex justify-between mt-100 pt-15 border-t border-dashed border-black/60 font-mono _9 uppercase ml-285`:
  - "© COPYRIGHT 2026 MANTIS WORKS<br/>ALL RIGHT RESERVED"
  - "NEW YORK CITY<br/>{live HH:MM:SS}" — tick every second (America/New_York).
  - "WE COULD JUST EAT YOU UP ///////////////////…" (slashes fill).
- Giant wordmark: bottom, `Mantis` text `font-size: calc(430 * var(--px))`, weight 500, letter-spacing -0.05em, `leading-none`, clipped by footer overflow (`margin-bottom: calc(-80 * var(--px))`), full-bleed left `ml-0`. Use plain text (font matches).

## States & Behaviors
- Footer content fade-up on enter (`opacity 0→1, y 60→0`, start "top 80%", once).
- Live clock: setInterval 1000ms, cleanup on unmount, `timeZone: 'America/New_York'`.
- Link hover: handled by `.link-anim` CSS.

## Responsive
- Mobile: grid-cols-2 gap-30, ml-0, px-15, wordmark 110 design px (of 390 scale).

## Verify
`npx tsc --noEmit` must pass.
