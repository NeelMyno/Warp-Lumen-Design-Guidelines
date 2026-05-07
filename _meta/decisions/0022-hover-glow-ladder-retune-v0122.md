# ADR 0022 — Hover-glow ladder retune — v0.12.2

- **Date:** 2026-05-06
- **Status:** Accepted
- **Deciders:** Lumen working group + the user (brand owner)
- **Related:**
  - [ADR 0016 — Button rebuild v0.9](./0016-button-rebuild-v09.md) — established the three-state glow ladder (rest 16/0.25 → hover 24/0.4 → active 8/0.2) for `intent="primary"`. v0.12.2 retunes the *hover* state. Rest and active are unchanged.
  - [ADR 0018 — v0.11 Premium Psychology recolor](./0018-premium-psychology-recolor.md) — commits to the rest-state halo as the always-present brand voice ("the canvas earns the accent"). v0.12.2 honors this commitment by leaving rest untouched.
- **Preserves verbatim:** [ADR 0005 — Single-accent rule](./0005-warp-green-as-only-accent.md) — Spring Green plays exactly one role (action / live / success). The dial-down moves the *quantity* of glow on hover, not the role.

## Context

The Lumen primary-button glow ladder ([ADR 0016](./0016-button-rebuild-v09.md), v0.9) ships a three-state ambient glow: rest, hover, active. The values pre-v0.12.2 were:

| State | Token | Resolved |
|---|---|---|
| rest | `--shadow-button-glow-rest` | `0 0 16px var(--lumen-lime-a25)` |
| hover | `--shadow-button-glow-hover` | `0 0 24px var(--lumen-lime-a40)` |
| active | `--shadow-button-glow-active` | `0 0 8px var(--lumen-lime-a20)` |

On top of the basic `:hover`, an `@media (hover: hover) and (prefers-reduced-motion: no-preference)` block layered TWO additional glow layers onto `.lumen-btn-primary:hover`:

```css
.lumen-btn-primary:hover {
  box-shadow:
    var(--shadow-button-glow-hover),       /* 24 px / a40 — the token above */
    0 0 24px var(--lumen-lime-a20),        /* "lit boost" middle layer */
    0 0 48px var(--lumen-lime-a10);        /* wide "bloom" outer layer */
}
```

A parallel block with denser values handled `.lumen-glow-cta:hover` (hero CTAs only — landing-page money buttons that opt in via the `glow={true}` prop or the `lumen-glow-cta` class).

User screenshot 2026-05-06 of the `/library` LoginCard "Send magic link" button on hover showed the layered halo blooming **~40 px past the button on every side** — read as "little too much." The bloom came from a three-layer halo recipe stacked on `.lumen-btn-primary:hover` that was *system-dialed-up*, not button-specific. Every primary CTA across the system carried the same recipe (`/saas` "+ New shipment", `/landing` "Get started", every other `intent="primary"` button) — the user just happened to spot it on the LoginCard, which is the surface where the button is most isolated from competing chrome (a centered card on a quiet canvas, no surrounding signals to absorb the bloom).

Three signals in the feedback:

1. **The bloom was the system, not the button.** Every consumer of `.lumen-btn-primary:hover` carried the same three-layer halo. Fixing per-consumer would have required `className="..."` overrides on every primary CTA — exactly the local-workaround anti-pattern that ADR 0021 (committed earlier the same day) just retired for the Card corner-clip.
2. **Rest and active didn't read as bloom.** The user's word was "hover effect" specifically. Rest is `0 0 16px lime-a25` — half the blur and 60% the alpha of pre-v0.12.2 hover; visually it reads as "always-on brand halo," not as a glow event. Active is `0 0 8px lime-a20` — already the tightest in the ladder; press feedback shouldn't expand. Only hover over-spent.
3. **The brand commitment to rest-state glow is non-negotiable.** [ADR 0018](./0018-premium-psychology-recolor.md) commits to the rest-state halo as the always-present brand signal — the spring-green accent is *always* slightly lit against the obsidian canvas, not just when you're about to click it. That's the "the canvas earns the accent" pact, and removing rest glow would be a brand-voice change, not a UX dial-down.

## Decision

**Lumen v0.12.2: dial down the primary-button hover bloom at the token + layered-halo level. Rest and active stay put.**

### What gets retuned

| Layer | Pre-v0.12.2 | v0.12.2 | Δ |
|---|---|---|---|
| `--shadow-button-glow-rest` | `0 0 16px lime-a25` | `0 0 16px lime-a25` | unchanged (brand voice per ADR 0018) |
| `--shadow-button-glow-hover` (token) | `0 0 24px lime-a40` | `0 0 20px lime-a28` | blur −17%, alpha −30% |
| `--shadow-button-glow-active` | `0 0 8px lime-a20` | `0 0 8px lime-a20` | unchanged (already tight) |
| Layered hover middle layer (`@media hover`) | `0 0 24px lime-a20` | `0 0 20px lime-a14` | blur −17%, alpha −30%; the "lit boost" softens |
| Layered hover outer layer (`@media hover`) | `0 0 48px lime-a10` | `0 0 32px lime-a08` | blur −33%, alpha −20%; the wide "bloom" pulls in 16 px and softens |
| `.lumen-glow-cta:hover` middle layer | `0 0 32px lime-a28` | `0 0 28px lime-a18` | blur −13%, alpha −36%; hero CTA in lockstep |
| `.lumen-glow-cta:hover` outer layer | `0 0 64px lime-a14` | `0 0 48px lime-a10` | blur −25%, alpha −29%; hero CTA in lockstep |

The token rename is intentional: changing the *resolved value* of `--shadow-button-glow-hover` cascades into BOTH the basic `:hover` rule (line 2567 in globals.css) AND the first layer of the layered halo (line 2905). One token edit, both call sites updated.

The hero CTA (`.lumen-glow-cta`) trims in lockstep so the standard-vs-hero hierarchy stays intact: hero still reads ~1.5× the standard primary in both spread and density (28 / 48 px hero vs 20 / 32 px standard), just both quieter than v0.12.1.

### Cascade

The fix lives at exactly two anchor points, both in `audit-dashboard/src/app/globals.css`:

1. **Token band** (lines 265–267) — `--shadow-button-glow-hover` retunes. `--shadow-button-glow-rest` and `--shadow-button-glow-active` are unchanged. The header docstring on the glow ladder gains a `v0.12.2 — bloom intensity dialed down` paragraph that captures the user-screenshot context, names the offending site (LoginCard "Send magic link" on /library), enumerates the two bands of change (token + layered halo), and explicitly calls out which states stayed put and why (rest is brand voice; hover was the bloom).
2. **Layered halo band** (`@media (hover: hover) and (prefers-reduced-motion: no-preference)` block, lines 2902–2914) — the middle and outer layers retune for both `.lumen-btn-primary:hover` and `.lumen-btn-primary.lumen-glow-cta:hover`. Comment block reproduces the user-screenshot context.

Cascade hits every primary CTA across the system:

- `/library` LoginCard "Send magic link" — the user-flagged surface. Halo trims from ~40 px spread to ~25 px.
- `/saas` "+ New shipment" — the dashboard primary. Reads confident, no longer blooms into adjacent chrome.
- `/landing` "Get started" — hero CTA. Still hero-tier presence (~1.5× standard primary), just quieter.
- Every other `intent="primary"` button across `/foundations`, `/library`, `/commerce`, `/mobile`, `/desktop`, `/tool` — same recipe, same trim.

## Consequences

### Positive

- **The user-reported "little too much" is closed.** Verified via Chrome MCP screenshot pair (`/library` LoginCard "Send magic link" before / after); the halo reads at ~25 px instead of ~40 px and feels controlled rather than blossoming.
- **One token edit + one layered-halo edit cascades to every primary CTA.** No per-consumer overrides, no `className` workarounds, no migration step for downstream products that consume the `.lumen-btn-*` class family.
- **Rest-state brand voice is preserved.** ADR 0018's commitment to the always-on halo is honored. The brand identity reads identically at rest before and after v0.12.2; only the hover *event* dials down.
- **Hierarchy between standard primary and hero CTA is preserved.** Hero CTA still ~1.5× the standard primary in spread + density. Marketing pages still get hero-tier presence on Get-started; operator pages get controlled primary halos.
- **The dial-down is calibrated, not uniform.** The middle layer dropped 30% in alpha; the outer layer dropped 20% in alpha *and* 33% in blur. At 48 px blur the alpha integral is wider; cutting blur there is a bigger perceptual win than cutting alpha alone. Per-layer reasoning (Weber-Fechner: perceptual intensity scales with the logarithm of physical intensity) beats uniform percentages.
- **"lit on hover" affordance is preserved.** The hover halo is still clearly more present than rest (verified by visual inspection: rest 16 px / a25 → hover 20 px / a28 + layered 20 px / a14 + 32 px / a08). Users still get a hover-state signal; it just doesn't visually overpower the surrounding chrome.

### Negative

- **The hierarchy between hover and active is now subtler.** Pre-v0.12.2 the hover halo was 1.5× the rest blur and 1.6× the alpha; now it's 1.25× and 1.12×. Active (8 px / a20) reads as a clear tightening from hover (20 px / a28). The hover→active transition stays legible. If a future audit finds active reads as "no different from hover" on certain canvases, file a follow-up to either (a) tighten active further or (b) widen the rest→hover gap. v0.12.2 keeps active untouched on the principle of "the user pointed at hover specifically; don't dial down what wasn't reported."
- **Consumers that customized the layered halo via `:where(.lumen-btn-primary):hover` overrides at consumer level will see their overrides win over the v0.12.2 retune.** Two mitigations: (1) the lint rule `lint:no-primitives` already discourages this kind of override at consumer level — the system contract is to retune at the primitive layer; (2) a consumer who genuinely wants a louder halo can opt into `.lumen-glow-cta` via the `glow={true}` prop on Button (hero-tier halo, intentional).
- **Designers may want a single-knob "intensity" prop on Button.** Punted. The brand voice is one-glow-ladder-for-the-system; per-button intensity would let consumers dial up the halo on every primary, defeating the system tuning. v0.12.2 keeps the lever at the primitive.

### Side-benefit: the dial-down validates the cascade pattern (again)

This is the second cascade-fix in 24 hours (v0.12.1 was the Card corner-clip). Pattern across both:

| Cycle | User-reported site | Root cause | Fix layer | Cascade |
|---|---|---|---|---|
| v0.12.1 | `/saas` Pagination "Next" stair-step | Card with rounded corners + `overflow: visible` + square child = visible nub | Card primitive (`PAD["none"]`) | 3 known consumers, every future `<Card padding="none">` |
| v0.12.2 | `/library` LoginCard "Send magic link" 40 px bloom | Three-layer halo recipe in CSS, system-dialed-up not button-specific | Token + layered-halo block in globals.css | Every `intent="primary"` button across the system |

Both cycles: user pointed at one surface, structural cause was system-wide, fix at the primitive / token / globals layer cascaded. That's the v0.x design-system maturation pattern working as intended.

## Open questions

- **Should the dial-down extend to `intent="ai"`?** AI uses a different shadow recipe (`--shadow-button-ai-shimmer`, an animated 1 px border glow rather than a multi-layer halo). It doesn't carry the bloom the user reported. Not retuned in v0.12.2. If a follow-up audit finds the AI shimmer over-intense at hover, file a v0.12.x patch for the shimmer specifically.
- **Should the rest-state halo eventually retune too?** Punted. ADR 0018 commits to it; v0.12.2 honors that commitment. If a future brand-voice retune wants to dial rest down, it should be a v0.13 minor (visual identity change) not a patch.
- **Should we add `--shadow-button-glow-hover-soft` and `--shadow-button-glow-hover-loud` tier tokens for opt-in intensity?** Filed for consideration. Two-tier hover (alongside `lumen-glow-cta` for the loudest tier) would give designers a "soft" knob for tight contexts (e.g., a primary inside a popover or sheet where the halo competes with the surface). v0.12.2 keeps single-tier for now; the dial-down covers the user-flagged scenario without adding a tier.

## References

- User screenshot 2026-05-06 — `/library` LoginCard "Send magic link" hover halo blooming ~40 px past the button.
- Verification: Chrome MCP screenshot pairs at `/library` LoginCard, `/saas` "+ New shipment", `/landing` "Get started" — before / after the v0.12.2 edit. All three trim visibly while preserving the lit affordance and the hero-vs-standard hierarchy.
- [Buttons foundation](../../design-system/00-foundations/buttons.md) § "Glow ladder — primary intent only (v0.12.2 retune)".
- [Button component.md](../../design-system/02-components/button/component.md) § "Primary-button glow ladder (v0.12.2 retune)".
- [Button component.json](../../design-system/02-components/button/component.json) — changelog entry under v0.12.2.
- v0.12.2 commit: [`cfae642`](https://github.com/NeelMyno/Warp-Lumen-Design-Guidelines/commit/cfae642) — `fix(v0.12.2): primary-button hover bloom dialed down`.
- Weber-Fechner law (perceptual intensity ∝ log physical intensity) — the rationale behind non-uniform per-layer cuts.
