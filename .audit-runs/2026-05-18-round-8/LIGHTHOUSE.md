# Lighthouse R8a — Mobile Performance Baseline (post-subset Satoshi)

**Date:** 2026-05-18
**Round:** R8a (v0.13.4 ship)
**Tool:** Lighthouse 12.8.2 via local CLI (`node_modules/.bin/lighthouse`)
**Profile:** mobile, simulated Moto G4 4G (CPU 4× slowdown, 1.6 Mbps DL, 150 ms RTT)
**Surface:** local production build (`audit-dashboard && pnpm build && pnpm start`) at http://localhost:3000
**Build:** v0.13.4 main branch with R8a subset fonts applied

**Reproduction:** for each of the 9 routes, run:

```bash
node_modules/.bin/lighthouse http://localhost:3000${ROUTE} \
  --output=json --output-path=/tmp/lh-${slug}.json \
  --form-factor=mobile \
  --throttling.cpuSlowdownMultiplier=4 \
  --throttling.downloadThroughputKbps=1638.4 \
  --throttling.uploadThroughputKbps=675 \
  --throttling.rttMs=150 \
  --screenEmulation.mobile=true --screenEmulation.width=412 \
  --screenEmulation.height=823 --screenEmulation.deviceScaleFactor=1.75 \
  --only-categories=performance \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu" --quiet
```

The programmatic Lighthouse Node API (`import lighthouse from "lighthouse"`) breaks on Lighthouse 12.8.2 + Node 25 + puppeteer-core 24 with `this._page.target is not a function` — the puppeteer v24 default-protocol switch from CDP to webDriverBiDi. Use the bundled CLI directly.

## Results

| Route | Perf | LCP | FCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|
| `/` | 95 | 2899 ms | 1537 ms | 42 ms | 0.000 | 1537 ms |
| `/foundations` | 96 | 2728 ms | 1368 ms | 10 ms | 0.000 | 1368 ms |
| `/library` | 92 | 3241 ms | 1370 ms | 11 ms | 0.000 | 1370 ms |
| `/saas` | 94 | 3093 ms | 1219 ms | 8 ms | 0.000 | 1219 ms |
| `/landing` | 98 | 2419 ms | 1219 ms | 8 ms | 0.000 | 1219 ms |
| `/tool` | 95 | 2938 ms | 1066 ms | 7 ms | 0.000 | 1066 ms |
| `/commerce` | 95 | 2935 ms | 1064 ms | 7 ms | 0.000 | 1064 ms |
| `/mobile` | 96 | 2789 ms | 1067 ms | 7 ms | 0.000 | 1067 ms |
| `/desktop` | 96 | 2788 ms | 1065 ms | 8 ms | 0.000 | 1065 ms |

**Geometric mean across 9 routes:**
- Perf: **95** (R7: 94 — moves up one Lighthouse point)
- LCP: **2861 ms** (R7: 3030 ms — **−169 ms, −5.6%**)
- FCP: **1209 ms** (R7: 1225 ms — within noise floor)
- TBT: **12 ms** (R7: 12 ms — unchanged)
- CLS: **0.000** (R7: 0.000 — unchanged; Lumen's metric-aligned fallback contract holds)
- SI: **1209 ms** (R7: 1397 ms — −188 ms; faster first paint propagates to overall paint completion)

## R7 → R8 per-route LCP deltas

| Route | R7 LCP | R8 LCP | Δ | Band |
|---|---|---|---|---|
| `/foundations` | 3300 ms | 2728 ms | **−572 ms** | NI → NI (228 ms from Good) |
| `/` | 3082 ms | 2899 ms | **−183 ms** | NI → NI |
| `/landing` | 2585 ms | 2419 ms | **−166 ms** | Good → Good (cleaner) |
| `/desktop` | 2948 ms | 2788 ms | **−160 ms** | NI → NI |
| `/saas` | 3257 ms | 3093 ms | **−164 ms** | NI → NI |
| `/mobile` | 2936 ms | 2789 ms | **−147 ms** | NI → NI |
| `/library` | 3328 ms | 3241 ms | **−87 ms** | NI → NI |
| `/tool` | 2951 ms | 2938 ms | **−13 ms** | NI → NI |
| `/commerce` | 2935 ms | 2935 ms | **0 ms** | NI → NI |

**Geo-mean LCP improvement: −169 ms (−5.6%).** /foundations is the standout — its LCP candidate is the 110 px tall H1 brand-frame heading, which now paints in the metric-aligned fallback before the subset Satoshi (29 KB regular + 30 KB italic, down from 42 KB + 43 KB) reaches the device. The full subset details are at `scripts/subset-satoshi.mjs` and the byte-level diff is captured in `.audit-runs/_font-backups/`.

## What the R8a font subset achieves

**Bytes removed from the critical path:** 25,628 bytes (Regular: 12624, Italic: 13004 — both 30% smaller).
**Codepoints kept:** 230 (down from 431 in original Satoshi).
**Glyphs kept:** 303 (down from 504).
**OT features preserved:** every Lumen-referenced feature (kern, liga, calt, ss01-ss04, tnum, lnum, sinf, sups, frac, case, locl, salt, dnom, numr).
**Variable axes preserved:** wght 300–900 (Lumen's full weight ladder).

**Coverage policy (deliberate):**
- ASCII + Latin-1 supplement (every Western European accented letter — é à ñ ü ö ç…)
- General Punctuation (em dash, en dash, smart quotes, ellipsis, bullet)
- Currency Symbols (€ £ ¥ ₹ $…)
- Letterlike Symbols (© ® ™ ℗ ℠)
- Basic arrows (↑ ↓ ← → ↔)
- Used Math operators (− ∞ ≈ ≠ ≤ ≥)
- Geometric shapes Satoshi shipped (■ □ ▲ △ ◊ ○ ●)
- ✓ checkmark
-  Apple logo (PUA)

**Coverage gaps (intentional drops):**
- Latin Extended-A (Eastern European: Polish/Czech/Hungarian/Romanian/Turkish text falls through to system Arial)
- Latin Extended-B
- IPA Extensions
- Combining diacritics (Latin-1 covers precomposed forms; rare standalone combiners fall through)
- Greek (Ω, π — fall through, look fine in Arial)
- Box drawing chars (audit-dashboard's ASCII art already falls through; intent unchanged)

**Verification:** zero used-in-dashboard characters were dropped from Satoshi by the subset (`scripts/subset-satoshi.mjs` checks this against `audit-dashboard/.next/server/app/*.html` + `audit-dashboard/src/**`). Future demo authors who introduce a Czech or Polish word will see that text in Arial fallback — flagged but acceptable since the design system itself is English-rendered.

## What's still soft

**LCP is no longer the gating soft-spot** but it remains the only Needs-Improvement metric. 7 of 9 routes still sit above the 2500 ms Good threshold. The LCP breakdown for the worst route (`/library` at 3241 ms) shows:

- TTFB: ~485 ms (14%)
- Load Delay: 0 ms (assets are preloaded)
- Load Time: 0 ms (text-LCP, not image)
- **Render Delay: ~2756 ms (86%)** — paint pipeline gated by render-blocking CSS + DOM layout

**Render-blocking CSS profile (every route, identical):**
- `chunks/0epz-*.css` — 26489 bytes, wasted 462–635 ms across routes
- `chunks/0olikc40q2-*.css` — 979 bytes, wasted 162–194 ms

Reducing this further requires either (1) inlining critical CSS into `<head>` so the round-trip is eliminated, or (2) splitting the Tailwind utility chunk per-route (Next.js app router CSS chunking has improved but global utilities still co-locate). Both are R8b candidates.

## Carry-forward to R8b / R9

R8b candidates (consumer-side metrics — deepening R7's mobile-perf axis):

1. **Critical CSS inlining.** Move the most-used 4–6 KB of Tailwind utility CSS into a `<style>` block in `audit-dashboard/src/app/layout.tsx`. Eliminates one round-trip from the critical path on every route. Expected LCP impact: 100–200 ms further geo-mean reduction.
2. **CSS chunk splitting.** Investigate whether Next.js 16 lets us split the Tailwind utility chunk per-route so /library doesn't ship utilities only used by /commerce. Lower priority — modern Tailwind v4 + Turbopack already does some chunk-splitting.
3. **Reduce `/library` DOM weight.** /library renders 98 primitives statically. Most are below-the-fold. Lazy-rendering them via Intersection Observer (or React.Suspense with route-segment streaming) would let the LCP candidate paint without waiting for downstream paint completion.
4. **`/foundations` 128 px italic display heading.** The current LCP candidate IS the H1 brand-frame heading, NOT the 128 px italic — but the italic could still be moved to `font-display: optional` so its load doesn't block on slow connections. Trade-off: lose italic on first paint when network is hostile. Brand call.
5. **Real iOS Safari + real Android Chrome.** Headless Chromium under Lighthouse may differ from real-WebKit on LCP timing — different font-load timing, different LCP picker behavior.

R9 candidates (different tooling axis):

1. **Reduced-motion + high-contrast OS modes.** Audit `prefers-reduced-motion` and `prefers-contrast` matching across all motion + color tokens. Validates the design-system contract under OS-level a11y settings.
2. **Print + export contracts.** Verify the audit-dashboard prints cleanly. Style for export-to-PDF, export-to-image.
3. **Native pipeline render verification.** Generate Swift + Compose + Flutter platform outputs and visually verify they ship correct tokens.

## R8a methodology contribution

Extends the audit-cycle ladder's consumer-side axis:

- **R5 rule:** *a carried blocker is a tooling hypothesis, not a fact.*
- **R6 rule:** *the audit cycle is itself a contract — each round teaches what the next round's tooling axis should be.*
- **R7 rule:** *passing validators is a producer-side green; passing consumer-side metrics is a separate axis. Both ship together.*
- **R8a rule:** *consumer-side metric soft-spots have measurable byte-level levers. Subsetting, inlining, splitting, lazy-loading — each is a discrete byte-saving move. A round can pull multiple levers; ship the diff that's largest per unit-of-architectural-risk.*

The audit-cycle ladder, after R8a:

| Round | Tooling axis | Surface | Result |
|---|---|---|---|
| R1 | claude-in-chrome @ desktop | Static visual chrome | v0.12.7 chrome bleed |
| R2 | claude-in-chrome @ desktop | Interaction state | v0.12.8 Commerce variant pickers |
| R3 | claude-in-chrome @ desktop | Contract comparison | v0.12.9 Calendar / iOS StatusBar / Tool preset |
| R4 | grep + release-script audit | Meta-contract integrity | v0.13.0 LLM-docs version drift |
| R5 | chrome-devtools-mcp @ mobile 320 px | Small-viewport metrics | v0.13.1 layout-viewport inflation |
| R6 | validate:tokens + a11y probes | LLM-docs SSoT + tooling-script hygiene | v0.13.2 |
| R7 | pnpm build verbose + Lighthouse 12 mobile | Pipeline state + mobile-perf | v0.13.3 SD pipeline + lint hygiene + Lighthouse baseline |
| **R8a** | **Subset Satoshi + re-Lighthouse** | **Font byte budget on the LCP critical path** | **v0.13.4 −169 ms LCP geo-mean** |
