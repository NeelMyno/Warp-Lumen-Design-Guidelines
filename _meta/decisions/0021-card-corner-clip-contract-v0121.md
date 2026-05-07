# ADR 0021 — Card corner-clip contract — v0.12.1

- **Date:** 2026-05-06
- **Status:** Accepted
- **Deciders:** Lumen working group + the user (brand owner)
- **Related:** [ADR 0007 — Two-file component contract](./0007-two-file-component-contract.md) — the Card primitive's contract is the layer this fix lives at. Component / consumer code never re-implements the rounded-edge clip; the primitive owns it.

## Context

The Lumen `<Card>` primitive supports seven padding tiers (`none`, `xs`, `sm`, `md`, `lg`, `xl`, `hero`). Six of them inset the card's children with `p-N` so children float in the middle of the card; one — `padding="none"` — exists exactly so consumers can host children that touch the card's edges (table headers, table footers, pagination rows, full-bleed media surfaces, list rows).

Pre-v0.12.1, the Card primitive set `border-radius: var(--radius-xl)` (16 px rounded corners) but left `overflow: visible`. When a child of `<Card padding="none">` carried its own background and square corners — for example, a pagination footer with `bg-[var(--surface-raised)]` + `border-t border-[var(--border-hairline)]` — the child's rectangle painted past the card's curved interior and poked a visible square nub out from behind the rounded card border. The card's border traced the curve; the child's bg traced the square corner of its content rect. Where they disagreed, you saw a step.

User screenshot 2026-05-06 of the `/saas` Pagination footer caught the artifact. The "Next" button (rightmost child of the pagination row, last DOM child of the Card) showed the bottom-right corner stair-stepping past the card's rounded edge. The same artifact existed at the top-right of the Shipments header row, on every `<Card padding="none">` instance across the system, and (already worked-around-locally) on the commerce-page related-product cards where the contributor had hand-added `className="overflow-hidden"` to suppress the same bug at the product-image edge.

Three signals in the issue:

1. **The bug was systemic, not button-specific.** Three known consumers had the same pattern with three different shapes: `/saas` Pagination footer, `/foundations` Satoshi typeface rows, `/commerce` related-product image cards. The bug manifested differently per consumer (a step nub on saas, a hairline tear on foundations, a square edge on commerce) but the root cause was identical.
2. **The local workaround was already in the codebase.** `/commerce` had `className="overflow-hidden"` hand-added on every `<Card padding="none">` in the related-products grid. The next contributor to use `<Card padding="none">` would have to discover and re-apply this workaround. That's exactly the local-override anti-pattern the v0.10.1 alignment contract retired for slot padding.
3. **`padding="none"` is the only tier where this can happen.** All other padding tiers inset children by ≥ 8 px; the card's `radius-xl` curves through ~5 px of corner real estate from the outside. An 8 px inset clears the curve in the worst case. Only `padding="none"` lets a square-cornered child structurally meet the curved card edge.

## Decision

**Lumen v0.12.1: Card corner-clip contract — `padding="none"` composes `overflow-hidden`.**

### What gets clipped

| Layer | Behaviour |
|---|---|
| `<Card padding="none">` | Composes `overflow-hidden`. Edge-touching direct children are clipped to the card's rounded shape. Equivalent to manually adding `className="overflow-hidden"` on every consumer site. |
| `<Card padding="xs">` ... `<Card padding="hero">` | Unchanged. Their `p-N` insets float children off the curved edge entirely; clipping unnecessarily would create the risk of suppressing focus rings or hover halos on interactive children that legitimately want to escape the card padding rect. |
| Radix-portaled popovers, dropdowns, tooltips inside any Card | Unaffected by the clip. Radix Portal renders content into `document.body` (or a configured portal target), not into the trigger's DOM subtree. The Card's `overflow-hidden` only clips elements rendered *inside* the Card's box. |

### Cascade

The fix lives at exactly one anchor point:

- **Card primitive:** `audit-dashboard/src/components/primitives/card.tsx` — `PAD["none"]` retunes from `"py-0 [&>*]:px-0"` to `"overflow-hidden py-0 [&>*]:px-0"`. The `[&>*]:px-0` zeroing for direct-child horizontal padding is unchanged; only the `overflow-hidden` is added.

Cascade hits:

- `/saas` Shipments card (`<Card padding="none">` hosting header row + table + pagination footer) — top-right + bottom-right corners now clip cleanly.
- `/foundations` Satoshi typeface card (`<Card padding="none">` hosting `<ul className="lumen-row-divider">` with three `<PairRow>` children) — top + bottom corners clean.
- `/commerce` related-product cards — the manual `className="overflow-hidden"` override on `audit-dashboard/src/app/commerce/page.tsx:99` is now redundant. Removed in the same commit.

### Bundled changes

While in the `inputs.tsx` neighborhood for the related "navigation chrome" cleanup line that the v0.11.15 commit started:

- **`DatePickerCalendar` month-nav glyphs** swapped from literal `‹` / `›` text characters (the only remaining literal arrow glyphs in the system per grep) to `<ChevronLeft size={12} />` / `<ChevronRight size={12} />` icon components. Buttons gained `inline-flex items-center justify-center` so the icons center inside the 28 × 28 hit target. Same affordance, system-consistent stroke weight, AA pass at the icon size.

This is bundled because it's the same line of work (navigation chrome, the v0.11.15 cleanup direction), it's a one-file patch that lives next door, and it avoids a second commit that would touch the same file with the same line of reasoning. The triangle glyphs `▲ ▼` in charts/stats/rate-ticker are out of scope — those are data-trend indicators, not navigation chrome, and the marquee scale + tnum context wants the literal glyph rather than a stroked icon.

## Consequences

### Positive

- **One primitive-layer fix retires three known consumer-site workarounds.** The `/commerce` `className="overflow-hidden"` is removed; the `/saas` and `/foundations` artifacts vanish without consumer-side edits. Any future `<Card padding="none">` consumer is correct-by-default.
- **The fix is scoped narrowly.** Only `padding="none"` composes the clip; other tiers stay open so focus rings, hover halos, and floating chrome on interactive children inside padded cards continue to work. The trade-off "clip vs let things escape" is resolved per-tier.
- **Radix Portal compatibility is preserved.** Popovers, dropdowns, tooltips inside any Card still work. The clip is structural, not a portal disabler.
- **The contract is documentable.** The Card `component.md` now ships a "Corner-clip contract" section + before/after diagram; `component.json` rules.dont includes "Don't manually add `className='overflow-hidden'` on `<Card padding="none">` — the primitive already composes it." The next contributor can find this without spelunking the CSS.

### Negative

- **One scenario the clip suppresses by construction.** If a consumer wants a child of `<Card padding="none">` to render a focus ring or hover halo that *visually escapes* the rounded card edge (e.g., a 2 px dual-ring on a primary button positioned at the card's bottom edge), the ring will be clipped at the card boundary. Three mitigations: (1) the ring is *typically* on a child that's inset from the card edge, not flush with it (the card's hairline border + 1 px button border keep them ≥ 2 px apart); (2) buttons inside `<Card padding="none">` are extremely rare in practice (the tier is for tables, full-bleed media, list rows — interactive primaries usually live in padded cards); (3) consumers who genuinely need the escape can override `style={{ overflow: 'visible' }}` on the Card and accept the corner-clip artifact.
- **Documentation surface grew.** Two new `do/dont` rules in the Card contract ("don't manually add overflow-hidden" + "don't add overflow-hidden to other padding tiers expecting the same behaviour"). Net positive (less ambiguity), but it's text the next contributor must read.

### Side-benefit: the contract self-documents the cascade pattern

This is the third major v0.x bug fixed at the primitive layer that retires consumer-side workarounds:

- **v0.8.1 (ADR 0015)** — shadcn token-bridge fragility. Per-button `bg-primary` overrides retired in favour of `.lumen-btn-*` defensive classes.
- **v0.10.1** — Card slot-padding misalignment. Per-Card `[&_[data-slot=card-N]]:px-X` retired in favour of the SLOT_PX_ZERO triple at the wrapper.
- **v0.12.1** — `<Card padding="none">` corner-clip. Per-consumer `className="overflow-hidden"` retired in favour of the PAD["none"] composition.

The pattern across all three: the system caught itself shipping local workarounds; each cycle the primitive contract grew to absorb them; the consumer surface stayed thin. That's the v0.x design-system maturation working as intended.

## Open questions

- **Should the `overflow-hidden` clip extend to `padding="xs"` and `padding="sm"` for consistency?** Punted. The 8 px inset on `xs` (`p-2`) clears the 5 px corner curve — but only by 3 px, and a 2 px focus ring at the card's bottom-right could conceivably visually graze the curve. If a consumer reports the artifact on `padding="xs"`, file a follow-up and consider extending. v0.12.1 keeps the clip scoped to `padding="none"` because that's where the user-reported bug lives.
- **Should the clip be configurable via a separate `clipChildren` boolean prop?** Punted. The current `padding` enum implicitly carries the clip semantic ("padding=none means children touch the edges, so we clip them"); separating the two would be more explicit but more API surface. If a consumer writes a future need for `padding="md" clipChildren={true}` (children inset AND clipped), file a follow-up.
- **Should consumer products still hand-add `className="overflow-hidden"` on `<Card padding="none">` for defensive belt-and-braces?** No. The primitive owns the contract; redundant overrides bloat the diff and the next contributor has to wonder whether the override is load-bearing. v0.12.1 explicitly retires the redundant override on `/commerce` to set the precedent.

## References

- User screenshot 2026-05-06 — `/saas` Pagination "Next" button bottom-right corner showing the stair-step artifact.
- Verification: Chrome MCP screenshot pair (before/after the JS-injected `style.overflow = 'hidden'` test, then after the primitive edit).
- Cascade verification: `/foundations` Satoshi typeface card top + bottom corners, `/commerce` related-product cards top + bottom corners — all clean post-fix.
- [Card component.md](../../design-system/02-components/card/component.md) — the corner-clip contract section.
- [Card component.json](../../design-system/02-components/card/component.json) — `props.padding.description` calls out the v0.12.1 behaviour.
- v0.12.1 commit: [`d749458`](https://github.com/NeelMyno/Warp-Lumen-Design-Guidelines/commit/d749458) — `fix(v0.12.1): Card corner-clip contract`.
