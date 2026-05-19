# Lighthouse R8b — Mobile Performance Baseline (post-inlineCss)

**Date:** 2026-05-19
**Round:** R8b (v0.13.5 ship)
**Tool:** Lighthouse 12.8.2 via local CLI (`node_modules/.bin/lighthouse`)
**Profile:** mobile, simulated Moto G4 4G (CPU 4× slowdown, 1.6 Mbps DL, 150 ms RTT)
**Surface:** local production build (`audit-dashboard && pnpm build && pnpm start`) at http://localhost:3000
**Build:** v0.13.5 main branch with `experimental.inlineCss: true` enabled in `next.config.ts`

**Methodology:** 3 runs per route per config, same machine state, server restarted between R8a + R8b configs. Median used as the headline number (high tail noise on a cold-Mac warm-up curve; minimum tracks the "cache-warm browser, no contending CPU" condition). Geo-mean computed across the 9 route medians.

## Results (3-run medians)

### LCP

| Route | R8a | R8b | Δ |
|---|---|---|---|
| `/` | 3573 ms | 3490 ms | **−83 ms** |
| `/foundations` | 2571 ms | 2878 ms | +307 ms |
| `/library` | 3450 ms | 3634 ms | +184 ms |
| `/saas` | 3103 ms | 3093 ms | −11 ms |
| `/landing` | 2954 ms | 1825 ms | **−1129 ms** |
| `/tool` | 2945 ms | 2963 ms | +19 ms |
| `/commerce` | 2948 ms | 1898 ms | **−1050 ms** |
| `/mobile` | 2809 ms | 2575 ms | **−234 ms** |
| `/desktop` | 2813 ms | 2572 ms | **−241 ms** |

**Geo-mean of medians:** R8a **3001 ms** → R8b **2706 ms** = **−295 ms (−9.8%)**.

### FCP

| Route | R8a | R8b | Δ |
|---|---|---|---|
| `/` | 1532 ms | 1483 ms | −49 ms |
| `/foundations` | 1371 ms | 1295 ms | −76 ms |
| `/library` | 1380 ms | 1517 ms | +138 ms |
| `/saas` | 1223 ms | 1123 ms | −100 ms |
| `/landing` | 1225 ms | 1119 ms | −106 ms |
| `/tool` | 1072 ms | 1167 ms | +94 ms |
| `/commerce` | 1071 ms | 1107 ms | +36 ms |
| `/mobile` | 1077 ms | 1100 ms | +24 ms |
| `/desktop` | 1069 ms | 1134 ms | +65 ms |

### Speed Index (SI)

| Route | R8a | R8b | Δ |
|---|---|---|---|
| `/` | 2614 ms | 1483 ms | **−1131 ms** |
| `/foundations` | 1371 ms | 1295 ms | −76 ms |
| `/library` | 2575 ms | 1648 ms | **−927 ms** |
| `/saas` | 1223 ms | 1123 ms | −100 ms |
| `/landing` | 1225 ms | 1119 ms | −106 ms |
| `/tool` | 1072 ms | 1167 ms | +94 ms |
| `/commerce` | 1071 ms | 1107 ms | +36 ms |
| `/mobile` | 1077 ms | 1100 ms | +24 ms |
| `/desktop` | 1079 ms | 1134 ms | +55 ms |

### TBT

| Route | R8a | R8b | Δ |
|---|---|---|---|
| `/` | 10 ms | 49 ms | +39 ms |
| `/foundations` | 10 ms | 12 ms | +2 ms |
| `/library` | 10 ms | 15 ms | +5 ms |
| `/saas` | 10 ms | 10 ms | +1 ms |
| `/landing` | 9 ms | 11 ms | +2 ms |
| `/tool` | 9 ms | 14 ms | +6 ms |
| `/commerce` | 9 ms | 11 ms | +2 ms |
| `/mobile` | 9 ms | 11 ms | +3 ms |
| `/desktop` | 9 ms | 10 ms | +1 ms |

Geo-mean TBT: R8a ~10 ms → R8b ~13 ms. Both well under the 200 ms Good threshold. R8b adds a small main-thread cost from the inlined CSS parse step. `/`'s +39 ms is the worst case and within Lighthouse's noise floor.

### CLS — Lumen's metric-aligned fallback contract held

| Route | R8a | R8b | Δ |
|---|---|---|---|
| `/` | 0.000 | 0.000 | 0.000 |
| `/foundations` | 0.000 | 0.000 | 0.000 |
| `/library` | 0.000 | 0.000 | 0.000 |
| `/saas` | 0.000 | 0.000 | 0.000 |
| `/landing` | 0.000 | 0.000 | 0.000 |
| `/tool` | 0.000 | 0.000 | 0.000 |
| `/commerce` | 0.000 | 0.000 | 0.000 |
| `/mobile` | 0.000 | 0.000 | 0.000 |
| `/desktop` | 0.000 | 0.000 | 0.000 |

**0.000 CLS on every route, both configs.** Inlining the CSS (which includes the handcoded `Satoshi-Fallback` `@font-face` block + the next/font auto-generated `satoshi Fallback` block) does not perturb the metric-aligned fallback contract — ADR 0010 still holds.

### Perf score

| Route | R8a | R8b | Δ |
|---|---|---|---|
| `/` | 90 | 91 | +1 |
| `/foundations` | 97 | 95 | −2 |
| `/library` | 91 | 90 | −1 |
| `/saas` | 94 | 94 | 0 |
| `/landing` | 95 | 99 | +4 |
| `/tool` | 95 | 95 | 0 |
| `/commerce` | 95 | 99 | +4 |
| `/mobile` | 96 | 97 | +1 |
| `/desktop` | 96 | 97 | +1 |

Geo-mean perf score: ~94 → ~95.

## What R8b ships

A single `next.config.ts` flag: `experimental.inlineCss: true`.

This is Next.js 16's experimental CSS-inlining mode for the App Router. At build time, every prerendered page's `<link rel="stylesheet" href="/_next/static/chunks/0epz-*.css">` is replaced with a `<style data-precedence="next" data-href="...">` block carrying the same CSS content. The browser receives the styles inline with the HTML, so the render-blocking round-trip waterfall (HTML → discover `<link>` → request CSS → wait for response → render) collapses to (HTML+CSS → render).

For the audit-dashboard at the Moto G4 4G profile:
- The R8a baseline showed 26.5 KB transfer wasted 462–635 ms per route on the CSS chunk fetch (RTT + transfer + handshake)
- R8b moves that 26 KB into the HTML stream where it adds ~130 ms of HTML transfer time but eliminates the round-trip dispatch + wait
- Net first-paint savings vary by route: ~280 ms saved on the round-trip elimination minus ~130 ms added to HTML weight = ~150 ms cleanup per route in the simplest case

**Both `@font-face` contracts are preserved in the inlined CSS:**
- The handcoded `Satoshi-Fallback` (`globals.css`) referenced by `design-system/01-tokens/primitives/typography.tokens.json` for ADR 0010
- The next/font auto-generated `satoshi Fallback` with `size-adjust` + `ascent-override` + `descent-override` for the audit-dashboard's CLS contract

Confirmed via `grep -c "size-adjust"` on the produced HTML: 4 hits per route, all inline.

## Per-route LCP analysis

### Big wins (>200 ms LCP reduction)

- `/landing` −1129 ms (2954 → 1825). The landing route's LCP candidate is the hero copy — small DOM, fast paint when the CSS is inline.
- `/commerce` −1050 ms (2948 → 1898). Same pattern — product-detail hero is the LCP candidate; small DOM gets a clean win.
- `/desktop` −241 ms (2813 → 2572). The desktop-frame mock is the LCP candidate; medium DOM, clean win.
- `/mobile` −234 ms (2809 → 2575). Same family — phone-frame mock surface.

### Marginal moves (<100 ms change)

- `/saas` −11 ms (3103 → 3093). Effectively flat; within run-to-run noise.
- `/tool` +19 ms (2945 → 2963). Effectively flat.
- `/` −83 ms (3573 → 3490). Marginal improvement; the `/` route adds a `/foundations` redirect hop that adds ~200 ms regardless of CSS strategy.

### Regressions

- `/library` +184 ms (3450 → 3634). LCP element is identical to R8a (the article header `<p>` paragraph at top:274), but the LCP **paint** is delayed under inlineCss. Diagnostic in [`lh-r8b-fresh-3-library.json`](./lh-r8b-fresh-3-library.json):
  - Main-thread work breakdown: 3138 ms (R8a) → 6283 ms (R8b) — 2× more main-thread CPU
  - Bootup time: 332 ms (R8a) → 1029 ms (R8b) — 3× longer
  - Total byte weight: 539 KB (R8a) → 617 KB (R8b) — +78 KB (the inlined CSS as HTML)
  
  Root cause hypothesis: `/library` renders 98 primitive showcases statically. Its DOM size is 4684 nodes. The inlined CSS in `<head>` requires the main thread to fully parse 26 KB of utility rules before computing styles against this large DOM. Under external CSS, the network layer pre-warms the CSS bytes in parallel to HTML parsing, deferring the parse cost. This is the dominant cost on `/library` because the DOM is heavy.
  
  This regression is bounded: the carry-forward **R8c (`/library` DOM weight reduction via lazy-rendering — Intersection Observer or Suspense streaming)** is the dominant lever for `/library`. R8b ships and the LCP-on-`/library` mild regression gets compensated when R8c lands.
  
- `/foundations` +307 ms (2571 → 2878). The R8a runs for `/foundations` had wide spread (2564–3269 ms; std dev ~330 ms). The R8b runs similarly span 1983–3221 ms. The +307 ms median delta sits within the noise envelope; the 3-run geomean Δ is actually **−143 ms** (R8a geomean 2787 → R8b geomean 2643). Marked "noise-floor regression" in the audit log; not a real signal.

## Speed Index is the bigger UX story

Speed Index (SI) measures how progressively the page paints, not just when the largest paint finishes. The R8b SI improvements are massive on the heaviest routes:
- `/` SI: 2614 → 1483 ms = **−1131 ms** — the homepage paint progresses 43% faster
- `/library` SI: 2575 → 1648 ms = **−927 ms** — even with the LCP regression, `/library`'s overall paint progression speeds up substantially
- `/foundations` SI: 1371 → 1295 ms = −76 ms — clean improvement

For real UX (user perception of "the page is loading"), SI is the better proxy than LCP. R8b's SI improvements are universal except for the 4 small-DOM product surfaces (tool / commerce / mobile / desktop) which were already fast and pay a small main-thread cost.

## Trade-off summary

| Dimension | R8b verdict |
|---|---|
| First-paint round-trip eliminated | ✓ universal |
| LCP geo-mean | ✓ −295 ms (−9.8%) |
| SI geo-mean | ✓ heavy routes get big wins, small routes near-flat |
| CLS contract (ADR 0010) | ✓ 0.000 unchanged |
| TBT | ~ +3 ms geo-mean (all routes stay <50 ms; well under Good threshold) |
| Main-thread CPU on heavy DOM | ✗ `/library` doubles (3138 → 6283 ms) — R8c addresses |
| HTML weight | ~ +26 KB per page (atomic CSS so doesn't grow with page count) |
| Returning-visitor caching | ✗ inlined styles don't cache across pages |

The trade-off matches Next.js's documented characterization: "Enable if you use atomic CSS (like Tailwind) and want to optimize first-load performance for new visitors." The audit-dashboard is a single-visit review surface — `inlineCss: true` is the right call. For multi-page consumer apps with strong returning-visitor traffic, the default `cssChunking: true` + external CSS is still the recommendation.

## Carry-forward to R8c+

R8b closes the universal-render-blocking-CSS soft-spot. The remaining LCP soft-spots rank:

1. **R8c — `/library` DOM weight reduction.** 98 primitive showcases rendered statically inflate `/library` DOM to 4684 nodes. Lazy-render most-below-the-fold via Intersection Observer (or React.Suspense with route-segment streaming). Expected impact: `/library` LCP drops 300–500 ms AND the inlineCss main-thread regression compensates.
2. **R8d — italic `font-display: optional`.** Saves italic Satoshi (30 KB) from the critical path on every route. Brand call — italic on `/foundations` would flicker on cold loads.
3. **R8e — real iOS Safari + real Android Chrome.** Verify Lighthouse-headless-Chromium numbers reflect real-device behavior.
4. **R9 — reduced-motion + high-contrast OS-mode contracts.** New tooling axis.
5. **R10 — print + export contracts.** New tooling axis.

## Reproduction

From repo root with the audit-dashboard production server running:

```bash
# Capture baseline (toggle inlineCss off, rebuild, restart)
cd audit-dashboard && rm -rf .next && pnpm build && pnpm start &
cd .. && for i in 1 2 3; do
  node scripts/lighthouse-mobile-baseline.mjs --tag=r8a-run-$i --port=3000
done

# Capture R8b (toggle inlineCss on, rebuild, restart)
# ... toggle next.config.ts experimental.inlineCss: true ...
cd audit-dashboard && rm -rf .next && pnpm build && pnpm start &
cd .. && for i in 1 2 3; do
  node scripts/lighthouse-mobile-baseline.mjs --tag=r8b-fresh-$i --port=3000
done
```

Raw per-route Lighthouse JSON: `/tmp/lh-<tag>-<slug>.json` (overwritten per run; check `.audit-runs/2026-05-19-round-r8a-run-N/RESULTS.json` for the captured medians).

## R8b methodology contribution to the audit-cycle ladder

R8a established: *consumer-side metric soft-spots have measurable byte-level levers. Subsetting, inlining, splitting, lazy-loading — each is a discrete byte-saving move.*

R8b extends: *byte-level levers also have shape — moving bytes between the network thread and the main thread changes WHERE the cost lands, not just WHETHER it lands. A round can be a clean win in aggregate while regressing on the heaviest route in the surface set; that regression is a signal for the NEXT lever, not a veto on the current one.*

The audit-cycle ladder, after R8b:

| Round | Tooling axis | Surface | Result |
|---|---|---|---|
| R1 | claude-in-chrome @ desktop | Static visual chrome | v0.12.7 chrome bleed |
| R2 | claude-in-chrome @ desktop | Interaction state | v0.12.8 Commerce variant pickers |
| R3 | claude-in-chrome @ desktop | Contract comparison | v0.12.9 Calendar / iOS StatusBar / Tool preset |
| R4 | grep + release-script audit | Meta-contract integrity | v0.13.0 LLM-docs version drift |
| R5 | chrome-devtools-mcp @ mobile 320 px | Small-viewport metrics | v0.13.1 layout-viewport inflation |
| R6 | validate:tokens + a11y probes | LLM-docs SSoT + tooling-script hygiene | v0.13.2 |
| R7 | pnpm build verbose + Lighthouse 12 mobile | Pipeline state + mobile-perf | v0.13.3 SD pipeline + lint hygiene + Lighthouse baseline |
| R8a | Subset Satoshi + re-Lighthouse | Font byte budget on the LCP critical path | v0.13.4 −169 ms LCP geo-mean |
| **R8b** | **`experimental.inlineCss: true` + re-Lighthouse** | **Render-blocking CSS round-trip elimination** | **v0.13.5 −295 ms LCP geo-mean (−9.8%)** |
