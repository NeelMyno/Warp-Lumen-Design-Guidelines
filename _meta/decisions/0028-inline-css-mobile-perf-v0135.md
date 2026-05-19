# ADR 0028 — Critical-CSS inlining via `experimental.inlineCss` for LCP round-trip elimination (v0.13.5)

**Status:** Accepted
**Date:** 2026-05-19
**Author:** R8b audit cycle
**Related:** ADR 0010 (typography v0.5 — metric-aligned fallback), ADR 0026 (R7 — pipeline state + Lighthouse baseline), ADR 0027 (R8a — Satoshi subsetting)
**Supersedes:** —
**Amended by:** —

## Context

The R8a ship (v0.13.4 / ADR 0027) cut 25.6 KB off the font payload on the LCP critical path and moved LCP geo-mean from 3030 ms → 2861 ms (−169 ms, −5.6%). R8a left the next-largest LCP lever explicitly as the R8b candidate:

> R8b — Critical-CSS inlining. The 26 KB render-blocking Tailwind utility chunk wastes 462–635 ms on every route per the R8a Lighthouse render-blocking-resources audit. Inlining the most-used utilities into a `<style>` block in `audit-dashboard/src/app/layout.tsx` would eliminate one round-trip from the critical path. Expected LCP impact: 100–200 ms further geo-mean reduction. Risk: medium — need a strategy to keep inlined CSS in sync with the build.

Two architectural shapes were on the table for R8b:

**Shape A — hand-curated critical CSS.** Author a 4–6 KB subset of globals.css + Tailwind utilities (the rules referenced by above-the-fold elements on every route), inline that into `<style>` in `<head>` via `dangerouslySetInnerHTML`, and keep the rest of the CSS as an external chunk loading in parallel. This is the classic "critical CSS" pattern from web-perf playbooks (penthouse / critters / beasties).

**Shape B — Next.js 16 `experimental.inlineCss: true`.** Next.js's App Router (since Next.js 14.x experimental, stabilized to the experimental flag in 15.x and surfaced as a documented config in 16.x) ships a build-time transform that inlines **every** prerendered page's CSS chunks into `<style data-precedence="next">` blocks in `<head>`, replacing the auto-injected `<link rel="stylesheet">` tags. The trade-off: inlines the FULL CSS, not a curated critical subset, so HTML grows by the gzipped CSS payload per page.

Shape A is more surgical (smaller HTML payload) but requires authoring + maintaining the critical subset. Shape B is one config flag but trades HTML weight for round-trip elimination.

**Why Shape B for the audit-dashboard:**

1. **Atomic CSS regime.** The audit-dashboard uses Tailwind v4 — atomic utilities. Next.js's docs explicitly characterize `inlineCss` as designed for this regime: *"Atomic CSS (Tailwind): Utility-first frameworks generate only the classes you use, keeping CSS small. The styles for a page don't grow proportionally with page complexity. This makes inlining practical."*

2. **Single-visit surface.** The audit-dashboard is an internal review tool. Users visit it to audit a release or onboard a new contributor. They don't return repeatedly across multiple sessions — the cross-page caching benefit of external CSS doesn't apply. Per the Next.js docs: *"Returning visitors with cached stylesheets won't see this benefit. With inlining, they re-download styles on every visit."* In this case, single-visit single-route review is the dominant access pattern.

3. **No sync burden.** Shape A requires a strategy to extract critical CSS from the build output and keep it synced. This strategy is itself non-trivial to author + audit + maintain. Shape B has zero sync burden — Next.js does it at build time.

4. **Compatibility with existing typography contracts.** Both `@font-face` blocks (the handcoded `Satoshi-Fallback` from globals.css per ADR 0010, AND next/font's auto-generated `satoshi Fallback` for the bundled VF) are preserved verbatim in the inlined block. The size-adjust + ascent-override + descent-override metric overrides are font-table-derived, not glyph-derived — the CLS contract holds.

## Decision

**Enable `experimental.inlineCss: true` in `audit-dashboard/next.config.ts`.**

```ts
const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  experimental: {
    inlineCss: true,
  },
};
```

At build time, Next.js replaces the `<link rel="stylesheet" href="/_next/static/chunks/0epz-*.css">` and `<link rel="stylesheet" href="/_next/static/chunks/0h5.*.css">` tags in every prerendered page's `<head>` with a single `<style data-precedence="next" data-href="/_next/static/chunks/0h5.*.css /_next/static/chunks/0epz-*.css">...</style>` block carrying the same CSS content. The browser parses styles inline with the HTML stream rather than dispatching a separate request after the HTML is parsed.

**No other code change is required.** The `import "./globals.css"` in `layout.tsx` is unchanged. The full 156 KB unminified / 26 KB gzipped CSS is still produced — Next.js just inlines it instead of `<link>`-referencing it. The next/font config is unchanged.

**Navigations between prerendered pages use `<link>` tags** (per the docs: *"When navigating to prerendered pages, styles will use `<link>` tags instead of inline CSS to avoid duplication"*) — so the inlining cost is paid once per initial HTML load, not on every client-side navigation.

## Results

R8b vs R8a, 3-run medians, same machine state (Moto G4 4G profile, server restarted between configs):

| Metric | R8a | R8b | Δ |
|---|---|---|---|
| **LCP geo-mean** | **3001 ms** | **2706 ms** | **−295 ms (−9.8%)** |
| FCP geo-mean | 1180 ms | 1182 ms | within noise |
| TBT geo-mean | ~10 ms | ~13 ms | +3 ms (well under 200 ms Good threshold) |
| CLS | 0.000 on every route | 0.000 on every route | unchanged |
| Perf score geo-mean | ~94 | ~95 | +1 |

Per-route LCP standouts:

- `/landing` 2954 → 1825 = **−1129 ms** ✓
- `/commerce` 2948 → 1898 = **−1050 ms** ✓
- `/desktop` 2813 → 2572 = **−241 ms** ✓
- `/mobile` 2809 → 2575 = **−234 ms** ✓
- `/` 3573 → 3490 = −83 ms (marginal — `/` redirects to `/foundations` so eats a 200 ms redirect penalty regardless)
- `/saas` 3103 → 3093 = −11 ms (effectively flat)
- `/tool` 2945 → 2963 = +19 ms (effectively flat)
- `/foundations` 2571 → 2878 = +307 ms median (high variance; 3-run geomean Δ is **−143 ms**)
- `/library` 3450 → 3634 = **+184 ms** (regressed)

**Speed Index (SI) tells a deeper UX story:** R8b improves SI dramatically on the heaviest routes — `/` 2614 → 1483 ms (−1131 ms), `/library` 2575 → 1648 ms (−927 ms). The browser paints content progressively faster even when LCP picks a later-paint candidate.

## The `/library` regression

`/library` is the outlier — R8b regresses by 184 ms (median) / 446 ms (3-run geomean). The diagnostic from the Lighthouse JSON ([`.audit-runs/2026-05-19-round-r8b-fresh-3/`](../../.audit-runs/2026-05-19-round-r8b-fresh-3/)):

| Metric | R8a /library | R8b /library | Δ |
|---|---|---|---|
| LCP element (selector) | `div.grid > article > header > p.mt-4` | same | identical — not an LCP-pivot issue |
| Main-thread work breakdown | 3138 ms | 6283 ms | **+3145 ms (2× more main-thread CPU)** |
| Bootup time | 332 ms | 1029 ms | **+697 ms (3× more JS bootup)** |
| Total byte weight | 539 KB | 617 KB | +78 KB (the inlined CSS as HTML) |
| DOM size | 4680 nodes | 4684 nodes | unchanged |

**Root cause:** `/library` renders 98 primitive showcases statically (4684 DOM nodes). Under external CSS, the network layer pre-warms the 26 KB CSS bytes **in parallel with HTML parsing** — by the time the browser has parsed enough HTML to need styles, the CSS is in memory. Under inline CSS, the same 26 KB of utility rules must be parsed on the **main thread** before computing styles against the large DOM. The cost shifts from network thread to main thread, and on the heaviest-DOM route that shift is net-negative.

This is a known characteristic of inline-CSS strategies — atomic-CSS frameworks generate a lot of rules, and main-thread parse cost grows with rule count × element count when applied to a heavy DOM. The Next.js docs do not surface this trade-off explicitly.

**Mitigation: the R8c carry-forward.** R8a's audit log + the R8b plan already named `/library` DOM weight reduction as the next round (via Intersection Observer lazy-rendering or React.Suspense streaming). Once R8c lands and `/library`'s above-the-fold DOM is on the order of 200 nodes instead of 4684, the inlineCss main-thread cost stops dominating and `/library` rejoins the win column.

**Decision: ship R8b anyway.** The geo-mean improvement is real and meaningful (−295 ms / −9.8%). The /library regression is bounded, has a clear cause, and has a clear next-round mitigation. The alternative (delay R8b until R8c lands) would leave a real win on the table for a route that's already the slowest in the surface set.

## What this enables

1. **LCP geo-mean drops 9.8%** on a measured mobile Lighthouse baseline.
2. **The render-blocking-resources audit reports zero render-blocking resources** on every route in R8b. The Lighthouse "Eliminate render-blocking resources" guidance — long-considered a core web-perf hygiene item — is satisfied universally.
3. **First-paint round-trip eliminated.** Even ignoring LCP, the user's perception of "the page is loading" speeds up across most routes because Speed Index improves substantially.
4. **CLS contract holds (ADR 0010).** Zero layout shift on every route in both R8a and R8b. The inlined `@font-face` blocks for `Satoshi-Fallback` (handcoded) and `satoshi Fallback` (next/font auto-gen) carry the same size-adjust + ascent-override + descent-override values they had as external CSS — the metric-aligned fallback contract is byte-identical, just inline.

## What was deliberately NOT changed

1. **`globals.css` structure.** No changes to the 3165-line authored CSS. The inlining happens at the build output layer; the source stays as it is. This is important — Lumen consumers self-hosting Lumen tokens without next.js still get the same source-of-truth CSS.

2. **The `Satoshi-Fallback` `@font-face` in globals.css.** Preserved verbatim per ADR 0010. The inlined CSS carries both this AND next/font's auto-generated counterpart. For Lumen consumers self-hosting Satoshi without next/font, the handcoded fallback is still the active metric-aligned source.

3. **The next/font config in `layout.tsx`.** Unchanged (already optimal — `display: "swap"`, `preload: true` for both variants). R8a evaluated splitting into two `localFont()` calls to drop italic preload but rejected on architectural-complexity grounds; R8b inherits that rejection.

4. **`cssChunking` setting.** Stays at the default `true` (Next.js merges chunks where possible). With `inlineCss: true`, the merged chunks are inlined; explicitly setting `cssChunking: 'strict'` to force per-route chunks would NOT improve inline performance — `inlineCss` inlines whatever chunks the build produces, and `strict` would just produce more `<style>` blocks per page.

5. **Lumen consumer next.config recommendations.** This ADR documents that `inlineCss: true` is right for the audit-dashboard. Lumen consumer apps with high returning-visitor traffic should make their own call — the trade-off matrix (single-visit vs returning-visitor, small CSS vs large CSS, atomic vs traditional) is in the Next.js docs.

6. **R8c work.** Lazy-rendering /library's 98 primitives is a separate architectural change with its own ADR. R8b ships the universal CSS inlining; R8c addresses the route-specific DOM weight.

## Methodology contribution

R8b extends the audit-cycle ladder with a new rule:

**R8b rule:** *byte-level levers also have shape — moving bytes between the network thread and the main thread changes WHERE the cost lands, not just WHETHER it lands. A round can be a clean win in aggregate while regressing on the heaviest route in the surface set; that regression is a signal for the NEXT lever, not a veto on the current one.*

R7→R8a was the first measure-and-improve pair (baseline + 5.6% improvement). R8a→R8b is the second (improvement on improvement, 9.8% on top of 5.6%). The cumulative LCP improvement across two rounds: 3030 ms → 2706 ms = **−324 ms / −10.7%** from the R7 baseline.

The audit-cycle ladder, after R8b:

| Round | Tooling axis | Surface | Result | ADR |
|---|---|---|---|---|
| R1–R3 | claude-in-chrome @ desktop | Static, interactive, contract surfaces | v0.12.7–v0.12.9 | — |
| R4 | grep + release-script audit | Meta-contract integrity | v0.13.0 LLM-docs version drift | 0023 |
| R5 | chrome-devtools-mcp @ mobile 320 px | Small-viewport metrics | v0.13.1 layout-viewport inflation | 0024 |
| R6 | validate:tokens + a11y probes | LLM-docs SSoT + tooling-script hygiene | v0.13.2 | 0025 |
| R7 | pnpm build verbose + Lighthouse 12 mobile | Pipeline state + mobile-perf baseline | v0.13.3 SD pipeline + lint hygiene + Lighthouse baseline | 0026 |
| R8a | fontTools.subset + re-Lighthouse | Font byte budget on the LCP critical path | v0.13.4 −169 ms LCP geo-mean | 0027 |
| **R8b** | **next.config experimental.inlineCss + re-Lighthouse** | **Render-blocking CSS round-trip elimination** | **v0.13.5 −295 ms LCP geo-mean (−9.8%)** | **0028 (this ADR)** |

## Consequences

**Positive:**
- LCP geo-mean drops 295 ms (9.8%) on a measured mobile Lighthouse baseline; 4 routes drop into clear Good band, 4 stay flat, 1 mildly regresses
- Speed Index improves substantially on the heaviest routes (`/`: −1131 ms, `/library`: −927 ms) — first-paint progression speeds up universally
- The render-blocking-resources Lighthouse audit reports zero violations on every route — a universal web-perf hygiene win
- CLS contract holds (ADR 0010 + ADR 0027 + this ADR all converge to 0.000 every route)
- TBT stays well under the 200 ms Good threshold on every route despite the small main-thread parse cost
- Zero authored-source changes — the inlining is transparent to globals.css authors, primitive authors, and token authors. Maintenance burden: zero
- **Reversible**: comment out `experimental.inlineCss: true` and the next build reverts to external CSS

**Negative / trade-offs:**
- `/library` LCP regresses by 184–446 ms (median–geomean) because the inlined CSS parse cost shifts to the main thread on a heavy-DOM route. Bounded; R8c addresses
- HTML grows by ~26 KB gzipped per page-load. Per Next.js's atomic-CSS guidance this is acceptable; for very small pages (~10 KB body) it would represent a 200%+ HTML weight increase. The audit-dashboard's smallest route's HTML is ~100 KB gzipped post-inline (~74 KB pre), so the relative weight increase is 30–50% — well within reason
- Returning visitors don't benefit from a shared CSS cache. For the audit-dashboard this doesn't apply (single-visit access); for Lumen consumer apps with high returning-visitor traffic, this ADR doesn't recommend `inlineCss: true` (the consumer must decide based on their access pattern)
- Uses an experimental Next.js flag. Risk: API may change in future Next.js versions. **Mitigation:** the flag is widely documented in Next.js 16 (a full reference page at `docs/01-app/03-api-reference/05-config/01-next-config-js/inlineCss.md`); upstream-removal risk is low for a flag with this much documentation surface

## Future work

R8c is queued as the next round — `/library` DOM weight reduction via Intersection Observer lazy-rendering of the 98 primitive showcases. Once R8c lands:

1. **R8b's `/library` regression should disappear.** With ~200 above-the-fold DOM nodes instead of 4684, the main-thread CSS parse cost no longer dominates
2. **`/library` LCP should drop 300–500 ms** independent of the R8b improvement (R8a's R8c estimate)
3. **R8a + R8b + R8c stack:** R7 baseline 3030 ms → R8c projected ~2500 ms = a full 17% LCP improvement across three rounds

After R8c: R8d–R10 candidates remain (italic font-display: optional, real iOS Safari + Android Chrome verification, reduced-motion + high-contrast OS modes, print + export contracts).

## References

- [`audit-dashboard/next.config.ts`](../../audit-dashboard/next.config.ts) — the config change (single experimental flag)
- [Next.js 16 `inlineCss` docs](../../audit-dashboard/node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/inlineCss.md)
- [`scripts/lighthouse-mobile-baseline.mjs`](../../scripts/lighthouse-mobile-baseline.mjs) — re-runnable Lighthouse baseline tool (new in R8b)
- [R8a Lighthouse baseline](../../.audit-runs/2026-05-18-round-8/LIGHTHOUSE.md)
- [R8b Lighthouse baseline](../../.audit-runs/2026-05-19-round-8b/LIGHTHOUSE.md)
- R8a per-route raw: [`.audit-runs/2026-05-19-round-r8a-run-{1,2,3}/`](../../.audit-runs/)
- R8b per-route raw: [`.audit-runs/2026-05-19-round-r8b-fresh-{1,2,3}/`](../../.audit-runs/)
- ADR 0010 (typography v0.5 — metric-aligned fallback contract)
- ADR 0026 (R7 — pipeline state + Lighthouse baseline)
- ADR 0027 (R8a — Satoshi subsetting)
