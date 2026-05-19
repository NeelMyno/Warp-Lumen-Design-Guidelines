# ADR 0027 — Satoshi web-font subsetting for LCP critical-path bytes (v0.13.4)

**Status:** Accepted
**Date:** 2026-05-18
**Author:** R8a audit cycle
**Related:** ADR 0010 (typography v0.5), ADR 0017 (Satoshi-only typography v0.10), ADR 0026 (R7 pipeline state + Lighthouse baseline)
**Supersedes:** —
**Amended by:** —

## Context

The R7 ship (v0.13.3 / ADR 0026) captured the first mobile Lighthouse baseline. LCP emerged as the only Needs-Improvement metric:

- LCP geo-mean across 9 routes: **3030 ms** (the Core Web Vitals "Good" threshold is 2500 ms)
- LCP outliers: `/foundations` 3300 ms, `/library` 3328 ms
- Every other metric was Good or excellent — CLS 0.000, TBT 12 ms (16× under threshold), FCP 1225 ms, SI 1397 ms, Perf 94

R7 left "font-display strategy + Satoshi subsetting" explicitly as the R8a candidate. The R7 hypothesis was that Satoshi's woff2 payload was on the LCP critical path because:
1. Satoshi is self-hosted (per ADR 0017 — single-typeface contract since v0.10)
2. Both `Satoshi-Variable.woff2` (42 KB) and `Satoshi-VariableItalic.woff2` (44 KB) preload globally on every route
3. The LCP candidates on the worst routes (the brand-frame H1 on `/foundations`, the heading-heavy card lists on `/library`) need Satoshi to render at final metrics
4. Mobile 1.6 Mbps + 150 ms RTT throttling makes the 86 KB font payload take ~430 ms simulated transfer + connection overhead

R8a starts with a diagnostic pass: re-run Lighthouse with `--output=json` + extract the `largest-contentful-paint-element` selector, `network-requests`, `font-display`, `lcp-breakdown-insight`, and `render-blocking-resources` audits.

The diagnostic surprise: **font-display is fine** (zero violations), **preload is fine** (both fonts preload at High priority), **size-adjust is fine** (zero CLS — the metric-aligned fallback contract from ADR 0010 holds). The actual LCP breakdown for `/foundations` showed:

- TTFB: 484 ms (14%)
- Load Delay: 0 ms
- Load Time: 0 ms (text-LCP, no resource)
- **Render Delay: 2877 ms (86%)**

The 86% render-delay sits between FCP and LCP-element paint completion. Two parallel causes:
1. **Render-blocking CSS** — 26 KB Tailwind utility chunk + 1 KB next/font chunk, both `<link rel="stylesheet" data-precedence="next">`. Wasted 462–635 ms across routes.
2. **Font payload on the critical path** — even with `display: swap` and metric-aligned fallback (so paint isn't gated), the LCP picker may update when the real Satoshi swaps in. And bandwidth contention with the CSS chunks slows everything.

Font subsetting is the cheaper of these two levers: surgical, well-bounded, with no architectural risk. Critical-CSS inlining is the bigger lever but introduces architectural shape (which CSS to inline, how to keep it in sync with globals.css) and carries higher risk. R8a picks the cheaper lever; R8b inherits the harder one.

## Decision

**Subset both Satoshi VF woff2 files for the audit-dashboard's shipped surface area.** The codepoint keep set is:

```
ASCII (U+0020–U+007E)
+ Latin-1 supplement (U+00A0–U+00FF)    — Western European: é à ñ ü ö ç…
+ General Punctuation (U+2010–U+2027, U+2030–U+204F)
+ Currency Symbols (U+20A0–U+20CF)
+ Letterlike Symbols (U+2100–U+214F)    — © ® ™ ℗ ℠
+ Basic arrows (U+2190–U+2194)          — ↑ ↓ ← → ↔
+ Used Math (U+2212 U+221E U+2248 U+2260 U+2264 U+2265)  — − ∞ ≈ ≠ ≤ ≥
+ Geometric shapes Satoshi shipped (U+25A0–U+25CF)        — ■ □ ▲ △ ◊ ○ ●
+ U+2713 (✓)
+ U+F8FF ( Apple PUA)
```

**Codepoints in subset: 230** (down from 431). **Glyphs in subset: 303** (down from 504). **OT features preserved: every Lumen-referenced feature** — kern, liga, calt, ss01–ss04, tnum, lnum, sinf, sups, frac, case, locl, salt, dnom, numr. **Variable axes preserved: wght 300–900** (Lumen's full weight ladder).

The subsetting is performed by [`scripts/subset-satoshi.mjs`](../../scripts/subset-satoshi.mjs) which calls `python3 -m fontTools.subset` with `--layout-features=*` (all OT features kept) and `--flavor=woff2`. The script backs up the originals to `.audit-runs/_font-backups/` before overwrite. Re-running the script is idempotent — the codepoint set is declarative.

**Coverage gaps (intentional drops):**
- Latin Extended-A (Eastern European: Polish, Czech, Hungarian, Romanian, Turkish)
- Latin Extended-B (uncommon European variants)
- IPA Extensions
- Combining diacritics (Latin-1 precomposed forms cover the common chars)
- Greek (Ω, π — fall through to Arial; visually fine)
- Box drawing chars at U+2500-U+257F — audit-dashboard's ASCII art already uses these but they were never in Satoshi (the 8 geometric shapes Satoshi DID ship are at U+25A0–U+25CF and stay)

The gap is acceptable because:
1. The audit-dashboard demo content is English-rendered
2. Future demo authors who introduce non-English text will see it in Arial fallback — flagged but acceptable
3. Lumen consumers self-hosting Satoshi for their own products supply their own woff2 — the audit-dashboard's subset is for the audit-dashboard only

## Results

| Metric | R7 (v0.13.3) | R8a (v0.13.4) | Δ |
|---|---|---|---|
| Perf geo-mean | 94 | **95** | +1 |
| LCP geo-mean | 3030 ms | **2861 ms** | **−169 ms (−5.6%)** |
| FCP geo-mean | 1225 ms | 1209 ms | −16 ms |
| TBT geo-mean | 12 ms | 12 ms | 0 |
| CLS geo-mean | 0.000 | 0.000 | 0 |
| SI geo-mean | 1397 ms | 1209 ms | −188 ms |

**Per-route LCP standouts:**
- `/foundations`: 3300 → 2728 ms (**−572 ms**, drops out of Needs Improvement)
- `/`: 3082 → 2899 ms (−183 ms)
- `/landing`: 2585 → 2419 ms (Good → cleaner Good)
- 7 of 9 routes improved 100–200 ms; 1 route flat (`/commerce`), 1 nearly flat (`/tool`)

**Font byte budget:**
- Regular: 42,588 → 29,964 bytes (−12,624 bytes, −30%)
- Italic:  43,844 → 30,840 bytes (−13,004 bytes, −30%)
- **Total: 86,432 → 60,804 bytes (−25,628 bytes, −30%)**

At 1.6 Mbps simulated mobile, the saved bytes translate to ~125 ms transfer-time saved on the critical path. The 169 ms LCP improvement is larger than pure transfer would suggest — the bandwidth relief on the critical path lets the render-blocking CSS chunks finish slightly earlier too, compounding the win.

**CLS contract verification: zero layout shift on every route post-subset.** The metric-aligned `Satoshi-Fallback` (ADR 0010) holds. next/font's auto-computed metric overrides (size-adjust 109.35%, ascent 92.36%, descent 21.95%) are derived from the woff2's actual hhea/OS/2 tables — subsetting doesn't change those font-level metrics, only glyph data is removed.

## What was deliberately NOT changed

1. **next/font/local config in `audit-dashboard/src/app/layout.tsx`.** Already optimal — `display: "swap"`, `preload: true`, both regular + italic. Splitting into two `localFont()` calls to drop italic preload was considered but rejected: italic is small post-subset (30 KB), splitting introduces a separate font-family name + extra @font-face block (Next.js generates these per call), and the marginal LCP win wouldn't justify the architectural complexity. R8b can revisit.
2. **The handcoded `Satoshi-Fallback` @font-face block in globals.css.** This is shadowed by next/font's auto-generated `satoshi Fallback` in the audit-dashboard, but it's part of the design-system primitive contract (`design-system/01-tokens/primitives/typography.tokens.json` line 8 references it explicitly). Lumen consumers self-hosting Satoshi without next/font use this as the active metric-aligned fallback. Removing it would break the v0.5 / ADR 0010 typography contract.
3. **Critical-CSS inlining.** The 26 KB Tailwind utility chunk is the next-largest lever (~635 ms wasted on /foundations). Inlining requires architectural shape — which utilities to inline, how to keep them in sync with the build, what to do for routes that don't share the same critical set. Carried to R8b.
4. **Italic file `font-display: optional`.** Italic is rarely used (only on /foundations 128 px italic display heading and a handful of italic emphasis spans). Switching italic to `optional` would unblock its load from the critical path, but the brand cost (italic flicker on slow loads) needs a brand call. Carried to R8b as a brand decision point.
5. **CSS chunk splitting per-route.** Next.js 16 app router already chunks CSS to some degree. Investigating whether more granular chunking is achievable is a separate exploration. Carried.

## Methodology contribution

R8a extends the audit-cycle ladder's consumer-side axis with a new pattern:

**R8a rule:** *consumer-side metric soft-spots have measurable byte-level levers. Subsetting, inlining, splitting, lazy-loading — each is a discrete byte-saving move. A round can pull multiple levers; ship the diff that's largest per unit-of-architectural-risk.*

The audit-cycle ladder, after R8a:

| Round | Tooling axis | Surface | Result | ADR |
|---|---|---|---|---|
| R1 | claude-in-chrome @ desktop | Static visual chrome | v0.12.7 chrome bleed | — |
| R2 | claude-in-chrome @ desktop | Interaction state | v0.12.8 Commerce variant pickers | — |
| R3 | claude-in-chrome @ desktop | Contract comparison | v0.12.9 Calendar / iOS StatusBar / Tool preset | — |
| R4 | grep + release-script audit | Meta-contract integrity | v0.13.0 LLM-docs version drift | 0023 |
| R5 | chrome-devtools-mcp @ mobile 320 px | Small-viewport metrics | v0.13.1 layout-viewport inflation | 0024 |
| R6 | validate:tokens + a11y probes | LLM-docs SSoT + tooling-script hygiene | v0.13.2 | 0025 |
| R7 | pnpm build verbose + Lighthouse 12 mobile | Pipeline state + mobile-perf baseline | v0.13.3 SD pipeline + lint hygiene + Lighthouse baseline | 0026 |
| **R8a** | **fontTools.subset + re-Lighthouse** | **Font byte budget on the LCP critical path** | **v0.13.4 −169 ms LCP geo-mean** | **0027 (this ADR)** |

The producer-side / consumer-side ladder:
- **Producer side:** R4 (LLM-docs drift), R6 (tooling-script hygiene + a11y primitive cascade), R7 (build pipeline metrics + lint umbrella + pre-commit SSoT regen).
- **Consumer side:** R1–R3 (rendered UI), R5 (small-viewport metrics), R7 (mobile-perf metrics — first baseline), **R8a (mobile-perf optimization — first improvement)**.

The R7→R8a transition is the first concrete *measure-and-improve* pair in the ladder. Prior rounds shipped fixes; R7 shipped the first metric baseline; R8a shipped the first metric improvement against that baseline. The pattern — *baseline this round, optimize next round* — is now established.

## Consequences

**Positive:**
- LCP geo-mean drops 169 ms (5.6%) on a measured Lighthouse mobile baseline; one route moves out of "Needs Improvement"
- Font byte budget reduced 30% (25.6 KB total saved) — every consumer of the audit-dashboard benefits, not just LCP-critical paths
- The subset is **deterministic and re-runnable** — `scripts/subset-satoshi.mjs` has a declarative codepoint set; running it produces identical bytes given identical inputs
- Backups preserved in `.audit-runs/_font-backups/` — recovery from a bad subset is trivial
- All OT features Lumen references (ss01–ss04, tnum, lnum, etc.) are preserved — the typography contract (ADR 0010 + ADR 0017) is intact
- CLS contract (ADR 0010) holds — next/font's auto-computed metric overrides are font-table-derived, not glyph-derived

**Negative / trade-offs:**
- Lumen consumers who want broader Latin coverage (Polish, Czech, Hungarian, Turkish text) and use the audit-dashboard's bundled Satoshi will see those characters fall through to Arial. **Documented in this ADR + the R8 LIGHTHOUSE.md.** Consumers can re-run `scripts/subset-satoshi.mjs` with a different codepoint set, or supply their own woff2 entirely
- Future demo authors who introduce a French/German/Spanish word will be fine (Latin-1 covers it), but a Polish or Hungarian word would visibly fall to Arial. **Mitigation: demo content review at PR time + a CI step would catch this**
- The subset re-runs need pyftsubset (or fontTools) installed in the contributor environment. **Mitigation: `python3 -m fontTools.subset` ships with the `fonttools` pip package which is a transitive dev dep**; if not present, the script errors clearly

## Future work (R8b+ candidates)

The R8 carry-forward LCP soft-spot is no longer the font but the render-blocking CSS + DOM layout. R8b candidates rank by expected LCP impact ÷ architectural-risk:

1. **R8b — Critical-CSS inlining.** Inline the 4–6 KB most-used Tailwind utilities + tokens into a `<style>` block in `audit-dashboard/src/app/layout.tsx`. Eliminates one round-trip on every route. Expected LCP impact: 100–200 ms further geo-mean reduction. Risk: medium — need to keep the inlined set in sync with the build.
2. **R8c — `/library` DOM weight reduction.** Lazy-render the 98 primitive showcases via Intersection Observer (or React.Suspense with route-segment streaming) so the LCP candidate paints first. Expected LCP impact for `/library`: 300–500 ms. Risk: medium — needs careful streaming design.
3. **R8d — Italic font-display: optional.** Brand call. Saves italic from the critical path on every route (italic is only on /foundations and a handful of emphasis spans). Risk: low (technical) / medium (brand — italic flicker on slow loads).
4. **R8e — Real iOS Safari + real Android Chrome.** Verify that the headless Chromium LCP timing reflects real-device behavior. Tooling: BrowserStack or SauceLabs. Risk: low (different tooling); finding bugs may add work.
5. **R9 — Reduced-motion + high-contrast OS modes.** Audit the design-system contracts under OS-level a11y settings. Separate axis from R8a.
6. **R10 — Print + export contracts.** Verify the audit-dashboard prints cleanly + exports to PDF/image cleanly.

## References

- [`scripts/subset-satoshi.mjs`](../../scripts/subset-satoshi.mjs) — the subsetting runner
- [R7 Lighthouse baseline](../../.audit-runs/2026-05-18-round-7/LIGHTHOUSE.md)
- [R8a Lighthouse baseline](../../.audit-runs/2026-05-18-round-8/LIGHTHOUSE.md)
- [`.audit-runs/_font-backups/`](../../.audit-runs/_font-backups/) — pre-subset originals
- ADR 0010 (typography v0.5 — metric-aligned fallback contract)
- ADR 0017 (Satoshi-only typography v0.10 — single-typeface decision)
- ADR 0026 (R7 — pipeline state + Lighthouse baseline)
