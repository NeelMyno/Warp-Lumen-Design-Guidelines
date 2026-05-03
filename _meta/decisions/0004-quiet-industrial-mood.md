# ADR 0004 — Default mood: Quiet Industrial

- **Date:** 2026-05-02
- **Status:** Accepted
- **Deciders:** Lumen working group

## Context

The user briefed Lumen with two directions in apparent tension:
- "Apple, Jony Ive, Dieter Rams: clean, minimal, polished."
- The system serves Warp, whose actual brand reads as a freight Bloomberg terminal: dense, dark, monospace, lime-green-accented.

Inspiration research surfaced four candidate moods:
1. **Quiet Industrial** — Rams-inflected, Linear-modern, hairlines, instrument-panel.
2. **Soft Luminous Minimal** — Apple-leaning, off-white, warm gradients, 6 desaturated categories.
3. **Mono-Type Editorial** — type-led, ink + paper, signal red used sparingly.
4. **Premium Glass Operations** — iOS-leaning, vibrancy, branded blue.

## Decision

**Quiet Industrial is the default mood.** The other three remain documented and exposed in the audit dashboard's mood switcher for case-by-case use:
- Soft Luminous as an option for editorial/blog surfaces.
- Premium Glass as a candidate for the mobile operator app.
- Mono-Type Editorial for any future "manifesto" / brand essay surfaces.

## Consequences

**Positive:**
- Honors all three lineages cleanly: Rams's "less but better" → hairline-and-monochrome surface; Ive's "care is total" → single accent + obsessive tabular numerics; Apple HIG's "clarity, deference, depth" → chrome that recedes so shipments lead.
- Honors Warp's actual brand: the dark mode IS the navy ladder Warp ships today.
- Most longevity-safe of the four moods. Looks right in 2031.
- Satoshi as a primary face fits naturally — geometric calm with humanist warmth.

**Negative:**
- Less photographic warmth than Soft Luminous. Acceptable — Warp doesn't ship photography in production.
- Less attention-grabbing than Premium Glass for marketing. Acceptable — Warp's marketing is data-led, not gloss-led.

**Tradeoffs not chosen:**
- Soft Luminous risks reading as a 2025 Stripe pastiche.
- Mono-Type Editorial risks feeling cold to non-design-literate operators.
- Premium Glass risks aging with iOS trend cycles.

## References

- `/research/inspiration-brief.md` § "Visual moods for Warp"
- `/research/lumen-brief.md` § D-001
- `/audit-dashboard/src/lib/moods.ts` — implementation
