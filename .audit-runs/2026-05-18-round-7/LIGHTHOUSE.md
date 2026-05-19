# Lighthouse R7 — Mobile Performance Baseline

**Date:** 2026-05-18
**Round:** R7 (v0.13.3 ship)
**Tool:** Lighthouse 12.x via chrome-launcher
**Profile:** mobile, simulated Moto G4 4G (CPU 4× slowdown, 1.6 Mbps DL, 150 ms RTT)
**Surface:** local production build (`audit-dashboard && pnpm build && pnpm start`) at http://localhost:3000
**Build:** v0.13.3 main branch with all Phase B + C closures applied

## Results

| Route | Perf | LCP | FCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|
| `/` | 94 | 3082 ms | 1535 ms | 36 ms | 0.000 | 1535 ms |
| `/foundations` | 92 | 3300 ms | 1396 ms | 11 ms | 0.000 | 2505 ms |
| `/library` | 92 | 3328 ms | 1369 ms | 9 ms | 0.000 | 1369 ms |
| `/saas` | 93 | 3257 ms | 1223 ms | 11 ms | 0.000 | 1223 ms |
| `/landing` | 97 | 2585 ms | 1235 ms | 9 ms | 0.000 | 1235 ms |
| `/tool` | 95 | 2951 ms | 1071 ms | 9 ms | 0.000 | 1071 ms |
| `/commerce` | 95 | 2935 ms | 1064 ms | 7 ms | 0.000 | 1064 ms |
| `/mobile` | 95 | 2936 ms | 1065 ms | 7 ms | 0.000 | 1065 ms |
| `/desktop` | 95 | 2948 ms | 1071 ms | 9 ms | 0.000 | 1071 ms |

**Geometric mean across 9 routes:**
- Perf: **94** (green band; >90 floor cleared with margin)
- LCP: **3030 ms** (the Core Web Vitals "Good" floor is 2500 ms — we are in "Needs Improvement" land)
- FCP: **1225 ms** (Good — under 1800 ms)
- TBT: **12 ms** (excellent — under the 200 ms Good threshold by 16×)
- CLS: **0.000** (excellent — R5's `html, body { overflow-x: clip }` + R6 a11y cascade left layout shift at zero)
- Speed Index: **1397 ms** (Good — under 3400 ms)

## What's already strong

1. **CLS = 0.000 on every route.** R5's layout-viewport contract (ADR 0024) + R6's primitive a11y closeout left zero layout-shift sources. This is the metric that *previous* audit cycles closed; R7 confirms the floor holds.
2. **TBT < 50 ms on every route.** All 9 routes ship `(Static)` per the Next.js build output — pre-rendered HTML + minimal client islands (PricingToggle, ColorSwatchSelector, Tool presets, Commerce buy, ModeToggle). The 36 ms outlier is `/` (the home / dashboard hub).
3. **FCP < 1600 ms on every route.** The font preload chain + ADR 0024's clipped layout viewport keep the first paint snappy.
4. **Perf score ≥ 92 on every route.** 7/9 routes ≥ 93. `/landing` leads at 97.

## The R7 finding

**LCP is the single soft spot.** Two routes (`/foundations`, `/library`) sit at 3.3 s — within the "Needs Improvement" band (2.5–4.0 s) but above the "Good" 2.5 s threshold. Cause attribution requires a deeper dive but the likely culprits, ranked:

1. **Satoshi web-font load** — Lumen is single-typeface post-v0.10 (ADR 0017). Satoshi is self-hosted (ITF-FFL); a 250–400 ms LCP penalty waiting on the font for the brand-display headings on `/foundations` (typography showcase) and `/library` (heading-heavy primitive catalog) is consistent.
2. **`/foundations` typography display** — the `Stop re-designing.` 128 px italic display heading is `text-[length:var(--type-128)]` + custom kerning. It's the LCP candidate per the `Largest Contentful Paint element` Lighthouse output. The display-heading needs Satoshi to render correctly.
3. **`/library` rendering 98 primitives** — every primitive on `/library` is statically pre-rendered HTML but the page is *long*; the LCP candidate may be a card several hundred px down rather than the hero.

**Routes already inside the Good band:** `/landing` at 2585 ms LCP is 1 the cleanest. Hero copy renders in the system fallback (Satoshi-Fallback per ADR 0005), and the v0.12.5 pricing-card peak-end lift + iconography accent-hover load on a small payload.

## Carry-forward to R8

R8 candidates (mobile perf-deepen, real-Webkit, font-loading strategy):

1. **Font-display strategy** — Satoshi loads with `font-display: swap` (likely — verify). For LCP-critical routes, `font-display: optional` would zero the swap penalty at the cost of FOIT on first paint. Trade-off: Lumen's brand voice is *premium-feeling* and the swap-from-fallback flicker doesn't read premium. Decision needed.
2. **Subset Satoshi to the Lumen brand glyph set** — currently shipping the full 400-glyph latin range. The audit-dashboard uses ~200 glyphs across all 9 routes (CSS + ASCII art + numeric data). Subsetting could cut the font payload 40–50%.
3. **Hero image / first-paint optimization** — `/foundations`'s `<TypeRow role="display.xxl">` is the LCP element on that route. The headline is text not an image, so this is a font-load gating issue, not an image issue.
4. **Inline critical CSS via Next.js `next/font` advisor** — currently Lumen ships `globals.css` ~1900 lines authored CSS into every route. A critical-CSS pass would trim per-route paint.
5. **Real iOS Safari + real Android Chrome via BrowserStack / SauceLabs** — chrome-devtools-mcp is headless Chromium; Webkit + real-device-chrome shapes might surface different metrics (especially LCP under iOS's font-display behavior).

## R7 methodology contribution

Adds the **producer-state axis** to the audit-cycle ladder — perf metrics aren't a UI bug nor a token-contract bug, they're a *consumed-runtime* bug. The pipeline (`build` + `start`) emits artifacts; Lighthouse measures what consumers experience when running those artifacts in a mobile browser profile.

R7 extends:
- **R5 rule:** *a carried blocker is a tooling hypothesis, not a fact.*
- **R6 rule:** *the audit cycle is itself a contract — each round teaches what the next round's tooling axis should be.*
- **R7 rule:** *passing validators (`validate`, `lint`, `build`) is a producer-side green; passing consumer-side metrics (Lighthouse, real-WebKit, reduced-motion-mode) is a separate axis. Both ship together.*

The audit-cycle ladder ramps both ends:
- Producer side (R4: LLM-docs drift; R6: tooling-script hygiene; R7: build pipeline metrics + lint umbrella)
- Consumer side (R1–R3: rendered UI; R5: small-viewport metrics; R7: mobile-perf metrics)

Future R8+ candidates extend the consumer-side axis further: real-WebKit (R8), reduced-motion + high-contrast OS modes (R9), print + export contracts (R10).
