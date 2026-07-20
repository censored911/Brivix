# mantis.works — Page Topology (assembly blueprint)

## z-index / layer stack (body children)
| Layer | Element | Position | z | Notes |
|---|---|---|---|---|
| 1 | `div.noise` | fixed, centered | 2 | noise.webp tile, pointer-events none |
| 2 | `div.loader` | fixed inset-0 h-dvh | 12 | initial load only |
| 3 | `nav` | fixed top-right | 9 | About Us/Contact + weather + blur wedge |
| 4 | `div.sidebar` | fixed left-15 top-20 bottom-20, grid-rows-3 | 10 | vertical labels / logo / made-with-love |
| 5 | `main` | flow | — | header + 3 sections + footer |
| 6 | `div.canvas-container` | fixed inset-x-0 top-0 h-screen | -1 | Three.js canvas, pointer-events none |
| 7 | `div.real` | fixed inset-0 h-dvh | 15 | reel video overlay (hidden until opened) |

## main flow (desktop 1440, total ~23,449px)
| # | Element | y-range | Height | Interaction model |
|---|---|---|---|---|
| 0 | `header.pb-section` — hero, 3 text stages | 0–9009 | 9009 | scroll-driven (ScrollTrigger scrub, trigger idx 0) |
| 1 | `section.py-section` — "we activate nerves." + media + 3 text blocks | 9009–14538 | 5529 | scroll-driven reveals (Batch/Fade) |
| 2 | `section.py-section` — "we stimulate memory." + white card (marquee, awards) | 14538–18862 | 4324 | scroll reveals + time-driven marquee + count-up |
| 3 | `section.pt-section.pb-[80vh]` — "we excite neurons." + services accordion | 18862–22708 | 3846 | scroll reveals + click accordion |
| 4 | `footer.mt-120.overflow-clip` — CTA, links, giant wordmark | 22793–23486 | 693 | scroll-driven (green gradient + arm model) |

## Container system
- `.container`: max-w none, full width, `l:px-cont`; hero uses `pl-[20.8333vw] pr-[4.1666vw]` (= 400px / 80px at 1920).
- Spacing utility numbers = design px at 1920, i.e. `calc(N / 19.2 * 1vw)`.
- `py-section` ≈ large vertical rhythm (~240 design px).

## Dependencies
- GL canvas needs section refs as ScrollTrigger triggers (indices 0–4 map to header/sections/footer).
- Reel overlay is opened from hero button (and paused Lenis).
- Weather (nav) + time (right rail, footer) are live data.
- Loader gates entrance animations (h1 SplitText, sidebar reveals, nav blur).

## Build order
1. Foundation: fonts, globals.css tokens/utilities, Lenis+GSAP provider.
2. Chrome: Noise, Nav (+weather), Sidebar, right rail.
3. Hero + GL background (coupled: trigger index 0).
4. Sections 1–3, Footer (agents, disjoint files).
5. Reel overlay + Loader.
6. Assembly in page.tsx, QA.
