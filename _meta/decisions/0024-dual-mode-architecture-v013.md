# ADR 0024 — Dual-mode architecture (restrained + expressive)

- **Date:** 2026-05-16
- **Status:** Accepted
- **Deciders:** Lumen working group
- **Related rules:** [AGENTS.md hard rule 15](../../AGENTS.md), [hard rule 16](../../AGENTS.md)
- **Related ADRs:** [0004 — Quiet-industrial mood](./0004-quiet-industrial-mood.md), [0018 — Premium psychology recolor](./0018-premium-psychology-recolor.md)
- **Foundation MD:** [00-foundations/modes.md](../../design-system/00-foundations/modes.md)

## Context

Lumen v0.12.6 shipped a single visual mode — restrained, dense, operator-density — optimized for SaaS dashboards, tables, and settings. That mode is the right default for ~70% of Warp's product surfaces. But there are entire surface classes where the restrained mood is a mismatch:

- **Landing pages** — should feel ambient and expressive, not data-dense.
- **Marketing surfaces** — should foreground brand and atmosphere.
- **AI primitives** — Conversations, hero AI panels, and onboarding need warmth and depth.
- **Onboarding flows** — invite warmth; restrained mood feels clinical here.
- **Empty states** — atmosphere over data.
- **Hero panels** — single-message focus with deep, atmospheric backgrounds.

Pre-v0.13, this meant Warp products either (a) lived inside Lumen's restrained mood and felt clinical on marketing surfaces, or (b) escaped to ad-hoc per-page CSS overrides that introduced drift. The system's discipline ended at the surface that needed it most.

We considered three resolutions:
1. Build separate components per mode (`<RestrainedCard>`, `<ExpressiveCard>`).
2. Add a `mode` prop to every component.
3. Make mode a scope attribute on a container; components rebind via tokens.

Option 1 doubles the component surface; option 2 sprawls the prop API and makes every component branch on mode. Option 3 — a `data-mode` scope on a container that rebinds semantic tokens via CSS attribute selectors — keeps the component graph shared and lets entire pages flip mood with a single line.

## Decision

**Mode is a scope attribute on a container, never a per-component prop. `data-mode="restrained"` is the default; `data-mode="expressive"` is opt-in. Components do not branch on mode; semantic surface / atmosphere / motion tokens rebind under the scope.**

### Specific commitments (verbatim from AGENTS.md hard rule 15)

- `data-mode="restrained"` is the default for: SaaS dashboards, tables, settings, terminals, command palette, every dense operator surface.
- `data-mode="expressive"` is opt-in for: landing, marketing, AI surfaces, onboarding, empty states, hero panels.
- Components do not branch on mode; semantic tokens rebind under the scope.
- **NEVER** `<Card mode="expressive">`.
- **NEVER** nested mode scopes.
- The mode-scope element is `<ModeScope mode="...">` (React) or `<div data-mode="...">` (raw HTML).

### Rebound semantic surfaces (expressive mode)

Under `data-mode="expressive"`, these semantic tokens swap:

| Semantic token | Restrained value | Expressive value |
|---|---|---|
| `surface.hero` | `color.surface.canvas` (solid obsidian) | `mesh.aurora-spring` (mesh gradient over obsidian) |
| `surface.canvas-ambient` | `color.surface.canvas` | `gradient.canvas-ambient` (3% spring radial) |
| `surface.atmosphere` | (no atmosphere) | `mesh.aurora-spring` overlay at 8% |
| `motion.atmosphere` | (no animation) | `mesh-drift 24s ease-in-out infinite alternate` |

All other semantic tokens (`surface.canvas`, `surface.raised`, `text.primary`, etc.) keep their restrained value under both scopes. Brand DNA (Spring Green accent, Obsidian canvas, Satoshi typeface) is unchanged.

### Glass surfaces — additional rule

Per [AGENTS.md hard rule 16](../../AGENTS.md), `backdrop-filter` is reserved for floating shells (popover, sheet, command palette, hero device frame, nav). Glass surfaces are mode-aware (blur 8–15px restrained, up to 28px expressive) but NEVER appear on the page canvas, data table, table row, or table cell.

## Consequences

### Positive

- **Single component graph for both modes.** No `<ExpressiveCard>`. No `mode` prop. Components are mode-agnostic by construction.
- **Page-level mode flips are trivial.** `<ModeScope mode="expressive">` on a landing route wraps the entire page; every Lumen component inside inherits the rebound semantic tokens.
- **`prefers-reduced-transparency` + `prefers-reduced-motion` honored uniformly.** Mode-rebound tokens degrade gracefully via `@media` rules at `:root` plus per-component fallbacks.
- **Brand DNA preserved.** No second loud color, no second typeface, no abandonment of the obsidian canvas. Expressive is atmosphere ON TOP of the same brand foundation.
- **Operator surfaces stay dense.** Restrained-default means the SaaS dashboard, table, settings, and command palette never accidentally pick up mesh / glass / animated atmosphere.

### Negative

- **Contrast cliff on expressive surfaces.** Text over mesh-aurora-spring fails WCAG AA at the blob peak unless the blob alpha stays at 8% and text uses `text.primary`. Documented in [modes.md §7](../../design-system/00-foundations/modes.md). `audit-contrast.ts` enforces both modes.
- **Cognitive overhead for new contributors.** Every visual decision now requires answering "which mode is this surface?" The trade-off is: this question forces explicit thinking about identity vs. density, which is the right framing.
- **No third mode.** Restrained + expressive cover the surfaces we have today. A third mode (e.g., "playful onboarding") would need a new ADR and a new rebind set.

### Risks

- **Nested mode scope mistakes.** A contributor might nest `<ModeScope mode="restrained">` inside `<ModeScope mode="expressive">` to "restore" the dense look mid-page. The system supports it CSS-wise but the visual result is jarring (mesh on the outer canvas, solid obsidian on the inner card). `audit-mode.ts` and AGENTS.md rule 15 prohibit nested mode scopes.
- **Mid-stream mode flips.** Flipping mode while a user is reading would shift surfaces unpredictably. Mode SHOULD only be set at route boundaries.

## Alternatives considered

### A. Mode as per-component prop

Rejected — sprawls API, requires every component to branch internally, doubles test surface, makes ad-hoc per-component mode overrides too easy.

### B. Mode as runtime React context

Rejected — works only inside React. Mode-as-CSS-attribute is universal across React, Svelte, vanilla HTML, server-rendered Liquid, RSC, and even MDX inline-snippets.

### C. Build two parallel design systems (`@lumen-restrained`, `@lumen-expressive`)

Rejected — doubles maintenance, fractures the component graph, makes the install story confusing for vibe-coders.

## References

- [00-foundations/modes.md](../../design-system/00-foundations/modes.md) — the canonical routing rules
- [AGENTS.md §"Hard rules" 15 + 16](../../AGENTS.md)
- [Phase 1 report](../../design-system/06-claude-code-briefings/phase-1-report.md) — execution trace
- [ADR 0004 — Quiet-industrial mood](./0004-quiet-industrial-mood.md) — the v0.6 ancestor of restrained mode

---

## Related Notes
- [[ADR 0023 — DTCG 2025.10 lift]]
- [[ADR 0025 — Glass scope rule]]
- [[ADR 0026 — Phase 0 alias namespace]]
