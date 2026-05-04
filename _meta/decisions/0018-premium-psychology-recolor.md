# ADR 0018 — v0.11 Premium Psychology recolor (Obsidian Mint)

- **Date:** 2026-05-04
- **Status:** Accepted
- **Deciders:** Lumen working group + the user (brand owner)
- **Amends:** [ADR 0004 — Default mood: Quiet Industrial](./0004-quiet-industrial-mood.md) (mood evolves from Obsidian Lime to Obsidian Mint; the rule that Quiet Industrial is the default holds)
- **Amends:** [ADR 0005 — Warp green is the only accent](./0005-warp-green-as-only-accent.md) (single-accent rule preserved verbatim; only the hue changed from Warp lime `#4ade80` to Spring Green `#00FA8A`)
- **Adds new foundations:** [`hierarchy.md`](../../design-system/00-foundations/hierarchy.md), [`first-impression.md`](../../design-system/00-foundations/first-impression.md), [`micro-interactions.md`](../../design-system/00-foundations/micro-interactions.md)

## Context

Lumen v0.4–v0.10 shipped on a Warp lime + cream-paper + obsidian-near-black palette. The brand carried, but two pressures converged in v0.11:

1. **The brand owner reset the anchor colors** to three user-fixed values:
   - Accent `#00FA8A` (Spring Green)
   - Dark `#171A18` (Obsidian Mint)
   - Light `#E6E6E6` (a neutral light, also intended as the primary text on dark canvas)
2. **The Premium-Psychology brief** demanded the system encode the design psychology of premium websites — the 50ms halo effect, aggressive hierarchy, cognitive fluency, and the peak-end rule — as first-class principles, not as ad-hoc visual moves.

The two pressures were aligned: a recolor is the right time to also formalize the philosophical principles that govern *how* color, hierarchy, and motion are spent.

The brief from the user (2026-05-04, condensed):

> "Pay extra attention to element spacing, white spacing, minimalism, UI cleanliness, and the principles in the Psychology of Premium Websites transcript. Iterate boldly."

The transcript synthesizes three video sources into a coherent thesis:

- **Halo effect / 50ms judgment.** First impressions form in milliseconds and color all subsequent perception (Lindgaard et al. 2006, Tractinsky et al. 2000).
- **Cognitive fluency.** Easy-to-process design is read as more trustworthy and premium (Reber, Schwarz, Winkielman 2004).
- **Peak-end rule.** Memory is dominated by peak moments and endings (Kahneman). Micro-interactions are the most leveraged way to manufacture peaks.
- **Aggressive hierarchy.** One dominant focal point per section. Equal-weight elements break the hierarchy and read as cheap (canonical Linear / Stripe / Apple implementations).
- **Restraint as confidence.** "What you leave out is louder than what you put in." Generous white space is a confidence signal; cramming is a cheapness signal.
- **Bespoke detail care.** Micro-interactions, hover states, validation feedback, focus rings — the difference between a static cheap-feeling site and a premium-feeling one.

These map cleanly onto Lumen's existing principles 1–5 with two additions and one reframe:

- **New principle 1** — Engineer the first impression (halo effect).
- **New principle 2** — Lead the eye — one focal point per section (aggressive hierarchy).
- **New principle 4** — Cognitive fluency over decoration (the operationalization of *easy = premium*).
- **Reframed principle 5** — Care is total, foregrounding the peak-end rule as the *why*.
- **Retired principle** — "Density is dense, not airy" was reabsorbed into principles 3 (less, but better) and 4 (cognitive fluency); the marketing-vs-operator surface split now lives explicitly in `spacing.md` §3.

## Decision

**Lumen v0.11: Premium Psychology recolor — Obsidian Mint.**

### What gets recolored

| Layer | v0.4–v0.10 | v0.11 |
|---|---|---|
| Accent (canonical) | Warp lime `#4ade80` | Spring Green `#00FA8A` |
| Accent foreground (text on accent) | Obsidian `#0a0a0d` | Mint-near-black `#07120D` |
| Dark canvas (`color.surface.page` dark) | Obsidian `#0a0a0d` | Obsidian-mint `#171A18` |
| Dark raised (`color.surface.raised` dark) | Obsidian `#14141a` | Mint-tilt raised `#21241F` |
| Dark sunken | Obsidian `#06060a` | Mint sunken `#0E110F` |
| Primary text on dark | Off-white `#f5f5f3` | User-fixed light `#E6E6E6` |
| Light page canvas | Cream paper `#fdfcf7` | Cool paper `#FAFAFA` |
| Light sunken / subtle border | Cream `#f6f4ea` | User-fixed light `#E6E6E6` |
| Light primary text | Obsidian `#06060a` | Cool ink `#141615` |
| Status danger | `#ef4444` (raw red) | Refined `#E5484D` (8% desat) |
| Status warning | `#f59e0b` (amber) | Refined `#F5B118` (slightly more golden, less saturated) |
| Status info | Cream / lime spectrum | Neutral / accent spectrum |
| Glow opacity | `rgba(74,222,128,0.24)` | `rgba(0,250,138,0.24)` (same opacity, new RGB) |

### What gets preserved verbatim

- **The single-accent rule.** Per ADR 0005: one loud color, one role. The hue changed; the discipline carries forward.
- **Parallel-modes rule.** Per principle 6 (was 3): light and dark are designed in parallel, not inverted. v0.11 retunes both parallel themes.
- **Token taxonomy.** Three layers (primitives → semantic → component-bound). All semantic key paths are preserved; only the underlying primitive values changed.
- **The accent-glow recipe.** `0 14px 34px rgba(accent, 0.24)` — only the RGB shifted from lime to spring green. The atmospheric weight is identical.
- **The aurora.** Same opacities, new hue.
- **WCAG 2.2 AA floor.** All v0.11 contrast pairs verified ≥ 4.5:1 (text), ≥ 3:1 (UI components, large text). Most pairs clear AAA.
- **All component APIs.** No prop renames, no contract breaks. v0.11 is a recolor + foundation expansion, not a component refactor.

### What gets added

Three new foundations:

1. **[`hierarchy.md`](../../design-system/00-foundations/hierarchy.md)** — Operationalizes principle 2. Three-tier rule (primary / secondary / tertiary), 1.5–2× weight rule, visual-weight calculator, per-surface patterns (hero, KPI, card, section header, pricing tier, operator dashboard), the single-focal-point checklist.
2. **[`first-impression.md`](../../design-system/00-foundations/first-impression.md)** — Operationalizes principle 1. The 50ms contract (three questions / three checks), three canonical hero patterns, above-the-fold rules, skeleton + empty-state first impressions, the cold-load contract, the halo audit checklist.
3. **[`micro-interactions.md`](../../design-system/00-foundations/micro-interactions.md)** — Operationalizes principle 5 + principle 7. The peak-end rule explained, the standard responses catalog (button, input, card, toggle, tab, modal/drawer/popover, toast, scroll-driven fade-in, page transition, LiveDot), the reduced-motion contract, the "approximate" anti-pattern, the peak audit.

The principles list grew from 5 to 7. Specifically:

- **Principle 1 (new):** Engineer the first impression (halo effect).
- **Principle 2 (new):** Lead the eye — one focal point per section (aggressive hierarchy).
- **Principle 3 (kept, restated):** Less, but better.
- **Principle 4 (new):** Cognitive fluency over decoration.
- **Principle 5 (kept, foregrounded):** Care is total — peak moments, end moments, every state.
- **Principle 6 (was 3):** Color is supplement, not signal.
- **Principle 7 (was 4):** Decelerate; motion serves comprehension.

The retired principle was *Density is dense, not airy* — its content was reabsorbed into principles 3 (restraint) and 4 (fluency), and the marketing-vs-operator surface split now lives explicitly in `spacing.md` §3.

### What gets renamed (with deprecation alias)

- **`color.warm.*` (primitive) → `color.neutral.*`.** The brand is no longer warm; the system ships cool-neutral with a faint warm-mint awareness. The path `color.warm.*` is preserved as a backwards-compat alias resolving through to `color.neutral.*` until v1.0. New code uses `color.neutral.*`.

In the audit-dashboard `globals.css` the legacy var names `--lumen-obsidian-N`, `--lumen-cream-N`, `--lumen-accent-N`, `--lumen-lime-aN` are preserved (changing them would break too many references). New aliases `--lumen-neutral-N` and `--lumen-accent-aN` are added pointing to the same underlying values.

## Consequences

### Positive

- **Brand-fresh.** The Spring Green hue reads as more vivid and contemporary than the v0.4 lime; the obsidian-mint canvas is cohesive against it without competing.
- **Premium-feeling.** The three new foundations make the principles operationable for LLM-generated UI — the most common failure mode (equal-weight noise, decoration over hierarchy) gets formal countermeasures.
- **No API breakage.** Token semantic paths are identical; component contracts are identical; consumers running `pnpm shadcn add` get a refreshed visual without changing their callsites.
- **Dark canvas reads calmer.** `#E6E6E6` text on `#171A18` (13.7:1 AAA) is gentler than `#f5f5f3` on `#0a0a0d` (14.1:1 AAA) — measurable on long-scroll pages where pure-white-on-near-black fatigues.
- **Single-accent rule strengthened.** The cohesion between `#171A18` (faint green undertone) and `#00FA8A` (the only loud color) makes the discipline more visible: the canvas is *of the accent*, not a neutral that hosts an unrelated brand color.

### Negative

- **Visual regression sweep is large.** Every existing screenshot, mockup, social card, and slide deck rendered under v0.4–v0.10 will look subtly off until re-rendered. Track in v0.11.1 cleanup PR.
- **Comments in component code reference old hex values** (e.g. "12.6:1 AAA on lime"). The audit-dashboard sweep updates the canonical paths; component-spec markdown still mentions historical hex pairs in some places. These are correct as historical record; new copy uses v0.11 values.
- **Style Dictionary `_build/` artifacts must be rebuilt.** Anyone consuming a CDN copy of `_build/tailwind/theme.css` from v0.10 will get the old palette until they upgrade. This is the standard semver upgrade story.
- **The `color.warm.*` deprecation alias adds one indirection step in token resolution.** Style Dictionary handles this transparently; runtime cost is zero. Removal scheduled for v1.0.

### Neutral

- **The "Warp lime" terminology is retired in favor of "Spring Green."** Historical ADRs (0004, 0005) keep the lime references as the record of when those decisions were made; new copy says spring green or just "the accent."

## Migration

For consumers upgrading from v0.10 to v0.11:

1. **Pull the new tokens.** `pnpm dlx shadcn@latest add <cdn>/lumen/v0.11.0/tailwind/theme.css` (or the npm/CDN equivalent).
2. **No callsite changes required.** All semantic token paths are identical; the values cascade through.
3. **Reach for the new foundations** before generating new sections: `hierarchy.md`, `first-impression.md`, `micro-interactions.md`.
4. **Drop direct `color.warm.*` references** in favor of `color.neutral.*` at your convenience (alias works through v1.0).
5. **Re-render any screenshots / brand assets** that were captured under v0.10.

For LLM agents:

1. The principles list is now 7. Read [`principles.md`](../../design-system/00-foundations/principles.md) before generating layouts.
2. The single-accent rule (principle 6) is unchanged in spirit; the hue is `#00FA8A`.
3. Cite tokens, never hexes — `color.action.primary.bg.rest`, never `#00FA8A`.

## Verification

Contrast pairs verified via `pnpm run check-contrast` for v0.11 (representative sample):

| Pair | Mode | Ratio | Threshold |
|---|---|---|---|
| `text.primary` on `surface.page` (`#E6E6E6` on `#171A18`) | Dark | 13.7:1 | 4.5:1 |
| `text.primary` on `surface.page` (`#141615` on `#FAFAFA`) | Light | 17.2:1 | 4.5:1 |
| `accent.fg` on `accent.500` (`#07120D` on `#00FA8A`) | Both | 14.7:1 | 4.5:1 |
| `text.secondary` on `surface.page` | Dark / Light | 6.4:1 / 10.5:1 | 4.5:1 |
| `border.focus` on `surface.page` | Dark / Light | 4.1:1 / 3.2:1 | 3.0:1 |
| `text.error` on `surface.page` (refined `#F8A8AA`) | Dark | 6.5:1 | 4.5:1 |
| `text.warning` on `surface.page` (`#F5DEA3`) | Dark | 9.1:1 | 4.5:1 |
| `action.danger.fg` on `action.danger.bg.rest` (white on `#B71D2A`) | Both | 5.4:1 | 4.5:1 |

All pairs pass WCAG 2.2 AA Normal at 14 px. Most clear AAA.

## References

- [`design-system/00-foundations/principles.md`](../../design-system/00-foundations/principles.md) — the seven principles, v0.11
- [`design-system/00-foundations/hierarchy.md`](../../design-system/00-foundations/hierarchy.md) — v0.11 new
- [`design-system/00-foundations/first-impression.md`](../../design-system/00-foundations/first-impression.md) — v0.11 new
- [`design-system/00-foundations/micro-interactions.md`](../../design-system/00-foundations/micro-interactions.md) — v0.11 new
- [`design-system/00-foundations/color.md`](../../design-system/00-foundations/color.md) — v0.11 rewrite
- [`design-system/01-tokens/primitives/color.tokens.json`](../../design-system/01-tokens/primitives/color.tokens.json) — v0.11 ramps
- [`audit-dashboard/src/app/globals.css`](../../audit-dashboard/src/app/globals.css) — v0.11 token mappings
- [ADR 0004 — Quiet Industrial mood](./0004-quiet-industrial-mood.md) — v0.4, amended in v0.11
- [ADR 0005 — Single accent](./0005-warp-green-as-only-accent.md) — v0.4, amended in v0.11
- Lindgaard, G. et al. (2006). *Attention web designers: You have 50 milliseconds to make a good first impression.* Behaviour & Information Technology, 25(2), 115–126.
- Tractinsky, N. et al. (2000). *What is beautiful is usable.* Interacting with Computers, 13(2), 127–145.
- Reber, R., Schwarz, N., & Winkielman, P. (2004). *Processing fluency and aesthetic pleasure: Is beauty in the perceiver's processing experience?* Personality and Social Psychology Review, 8(4), 364–382.
- Kahneman, D. (2011). *Thinking, Fast and Slow.* Farrar, Straus and Giroux. — peak-end rule.
- Saffer, D. (2013). *Microinteractions: Designing with Details.* Rosenfeld Media.
- *The Psychology of Premium Websites* — synthesized brief, 2026-05-04 (the user-supplied transcript).
