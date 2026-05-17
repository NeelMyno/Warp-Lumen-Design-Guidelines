# ADR 0025 — Glass surfaces only on floating shells

- **Date:** 2026-05-16
- **Status:** Accepted
- **Deciders:** Lumen working group
- **Related rules:** [AGENTS.md hard rule 16](../../AGENTS.md), [hard rule 8](../../AGENTS.md)
- **Related ADRs:** [0024 — Dual-mode architecture](./0024-dual-mode-architecture-v013.md), [0021 — Card corner-clip contract](./0021-card-corner-clip-contract-v0121.md)
- **Foundation MD:** [00-foundations/modes.md §3](../../design-system/00-foundations/modes.md)

## Context

`backdrop-filter` (CSS) and its native equivalents (`.regularMaterial` / `.thickMaterial` on SwiftUI, `dev.chrisbanes:haze` on Compose, `NSVisualEffectView` on AppKit, `AcrylicBrush` on WinUI) are visually expressive but expensive in two senses:

1. **Contrast cliff.** Glass over a busy backdrop (dashboard chart, table row, mesh atmosphere) fails WCAG 2.2 AA `1.4.3 Contrast (Minimum)` because the effective text-to-background ratio drops below 4.5:1 wherever the backdrop has high-contrast detail. Body text on a 50% alpha glass over a chart is ≈2.8:1 in the worst case — accessibility fail.
2. **Performance cliff.** Compose's `Modifier.blur()` is API-31+ and blurs the element, not the backdrop. The `dev.chrisbanes:haze` library workaround requires `hazeSource` + `hazeEffect` paired with backdrop tracking — runtime cost is non-trivial on low-end Android (Pixel 3a class). Web `backdrop-filter` is GPU-accelerated but still costs ~3-7 ms per frame on mid-range mobile when the backdrop animates.

A v0.12.6 audit of the audit-dashboard found glass applied inconsistently: it appeared on data tables (visual noise + contrast fail), command palette (correct), card corners (cosmetic but performance-wasteful), and the page canvas (entirely wrong — there's nothing behind the page). Each instance compounded the contrast and performance debt.

We need a rule that's simple to remember, easy to lint, and visually correct.

## Decision

**`backdrop-filter` (and its native equivalents) are reserved for floating shells: popover, sheet, command palette, hero device frame, nav. Glass NEVER appears on the page canvas, data table, table row, table cell, or chart axis.**

### Specific commitments (verbatim from AGENTS.md hard rule 16)

- Glass goes on: popover, sheet, command palette, hero device frame, nav.
- **NEVER** on: page canvas, data table, table row, table cell, chart axis.
- Always paired with `-webkit-backdrop-filter` (Safari requires the prefix).
- Always `@supports not (backdrop-filter)` fallback to a solid `surface.{glass,glass-strong}` token value.
- Always `@media (prefers-reduced-transparency: reduce)` bumps the alpha to ≥ 0.85 AND drops `backdrop-filter`.
- Blur radius: 8–15px in restrained mode, up to 28px in expressive mode (hero shells).

### Per-platform translation

| Platform | Glass primitive | Reduce-transparency fallback |
|---|---|---|
| Web | `backdrop-filter: blur(20px) saturate(140%); -webkit-backdrop-filter: ...` | `surface.glass` solid (alpha 0.5) |
| iOS / SwiftUI | `.regularMaterial` (default), `.thickMaterial` (hero) | `Color(.systemBackground)` |
| Android / Compose | `Modifier.hazeEffect { blurEffect { blurRadius = 20.dp } }` (via `dev.chrisbanes:haze`) | Solid surface |
| macOS / AppKit | `NSVisualEffectView` (`material: .hudWindow`, `.popover`, etc.) | Solid `NSColor.windowBackgroundColor` |
| Windows / WinUI | `AcrylicBrush` | Solid `SystemControlBackgroundChromeMediumLowBrush` |
| Browser extension | Same as Web, scoped under shadow DOM | Same as Web |

## Consequences

### Positive

- **Contrast is recoverable.** Glass appears only over the page chrome (which Lumen controls) or over the canvas at the top of a sheet (where alpha 0.5 over `surface.canvas` keeps 4.5:1 text contrast for `text.primary`).
- **Performance is bounded.** Floating shells are short-lived and small-area. They're the natural surfaces for a heavy effect.
- **Reduced-transparency users are first-class.** The fallback path is documented per-platform; `audit-contrast.ts` validates the solid-surface path produces ≥ 4.5:1.
- **Linter-friendly.** A simple grep can flag `backdrop-filter:` outside the allowed surface classes.

### Negative

- **Designers lose a "depth" affordance for data surfaces.** Cards and tables can't use glass to feel "lifted." Lumen substitutes elevation (`shadow.md`, `shadow.lg`, `shadow.xl`) and hairline frame voice (`border.frame`).
- **Compose / Android needs the `dev.chrisbanes:haze` dependency** even for a few floating shells. Documented in [04-platforms/android.md](../../design-system/04-platforms/android.md).

### Risks

- **Drift via "but this card needs glass…"** Every quarter, a contributor will argue that a specific Card needs glass for visual depth. The answer is no — use `shadow.lg` + `border.frame` instead.
- **Backdrop-content mismatch.** If a popover opens over a `data-mode="expressive"` mesh atmosphere, the glass blur produces a chromatic streak. Acceptable — that's the visual contract of expressive mode. Restrained mode's popovers open over solid surfaces; no streak.

## Alternatives considered

### A. Glass everywhere (no rule)

Rejected — contrast cliff + performance debt + v0.12 audit evidence of regressions.

### B. Glass only on hero/marketing surfaces

Rejected — popovers and sheets are exactly where atmosphere should appear (floating affordances over arbitrary backdrops). Restricting to hero/marketing alone misses the affordance use case.

### C. Glass with mandatory alpha ≥ 0.85 (effectively tinted solid)

Rejected — at 85% alpha + blur, the visual ceases to be "glass" and becomes "tinted card." The whole point of glass is the depth-via-blur. The fallback path uses alpha 0.85 (when reduced-transparency fires); the primary path keeps alpha 0.5.

## References

- [00-foundations/modes.md §3 — Glass surfaces](../../design-system/00-foundations/modes.md)
- [AGENTS.md §"Hard rules" 16](../../AGENTS.md)
- [04-platforms/ios.md — Glass translation](../../design-system/04-platforms/ios.md)
- [04-platforms/android.md — Haze library](../../design-system/04-platforms/android.md)
- [WCAG 2.2 §1.4.3 Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum)

---

## Related Notes
- [[ADR 0024 — Dual-mode architecture]]
- [[ADR 0021 — Card corner-clip contract]]
