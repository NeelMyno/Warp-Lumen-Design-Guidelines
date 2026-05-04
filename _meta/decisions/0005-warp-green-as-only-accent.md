# ADR 0005 — The accent is the system's only loud color

- **Date:** 2026-05-02 (original — Warp lime `#4ade80`)
- **Status:** Accepted (amended 2026-05-04)
- **Deciders:** Lumen working group
- **Amended by:** [ADR 0018 — v0.11 Premium Psychology recolor](./0018-premium-psychology-recolor.md) — accent hue changed from Warp lime `#4ade80` to Spring Green `#00FA8A`. The single-accent rule is preserved verbatim; only the hue changed.

> [!note]
> **v0.11 amendment.** The accent value is now `#00FA8A` (Spring Green). Everywhere this ADR mentions `#4ade80` or "Warp lime green," substitute `#00FA8A` or "Spring Green" for the current state. The original lime references are preserved as the historical record of *why* the discipline was adopted in v0.4. The discipline itself — one loud color, one role, no decoration — is unchanged.

## Context

Warp's production CSS uses **#4ade80** (declared `--warp-accent`) **788 times** — vastly more than any other color. The green plays exactly one role: action / live / success. CTA buttons literally use `background: #4ade80; color: #071109; box-shadow: 0 14px 34px rgba(74,222,128,0.24)` — a green-glow under the button is the brand's signature gesture.

The question for Lumen: do we adopt this discipline (one loud color, one role) or expand the palette for "design system flexibility"?

## Decision

**Warp lime green (`color.accent.500` = #4ade80) is the only loud color in Lumen, and it plays exactly one role**: action / live / success.

Operationally:
- Used for: primary CTAs, the LiveDot, success badges, "tracking" indicators, the brand's signature green-glow shadow.
- Never used for: marketing decoration, gradient sweeps, non-action chrome, hover feedback on non-action elements, charts, illustrations (except when the illustration is showing a "live" state).

## Consequences

**Positive:**
- The system stays recognizable as Warp's. Diluting the green dilutes the brand.
- Restraint is the system's superpower — when the green appears, it MEANS something.
- Status palette can stay muted and Apple-style: pair color with label/shape, never color alone.
- Cross-platform discipline: same role on iOS, Android, web, desktop, e-commerce.

**Negative:**
- Less flexibility for "playful" surfaces. Acceptable — Lumen is not a playful system.
- Marketing teams may want a second hero color. Mitigation: documented alternate moods (Soft Luminous has 6 desaturated categories) for those surfaces.
- Charting is constrained to monochrome + one accent. Mitigation: chart palette uses shape, line style, and labels for differentiation, not color.

**Tradeoffs not chosen:**
- A "primary + secondary accent" system would feel more flexible but would dilute the brand recognition that Warp's green provides today.
- A category-color system (per-warehouse, per-customer) would create visual noise in dense operator surfaces.

## Enforcement

Lint rule `no-decorative-accent` flags any use of `color.accent.*` outside of:
- Component code in `02-components/{button,live-dot,badge,toast,stat,rate-ticker}/`.
- Status semantic tokens (`color.status.success.*`).
- The signature `shadow.accent-glow` token.

Suppression requires an ADR.

## References

- `/research/warp-brand-dna.md` § "The green family (the brand's only loud color)"
- `/research/lumen-brief.md` § D-002
- `/design-system/01-tokens/primitives/color.tokens.json` § `color.accent.*`
