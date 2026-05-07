# ADR 0020 — Obsidian recolor (mint retired) — v0.12

- **Date:** 2026-05-06
- **Status:** Accepted
- **Deciders:** Lumen working group + the user (brand owner)
- **Amends:** [ADR 0018 — v0.11 Premium Psychology recolor (Obsidian Mint)](./0018-premium-psychology-recolor.md) — the v0.11 obsidian-mint canvas (faint G+2 channel undertone, anchored at `#171A18`) is retired in favor of a neutral obsidian canvas (R = G = B at every dark stop, anchored at `#0D0D0D`).
- **Preserves verbatim:** [ADR 0005 — Warp green is the only accent](./0005-warp-green-as-only-accent.md) — single-accent rule unchanged. Spring Green `#00FA8A` (the v0.11 accent) is the v0.12 accent. The recolor moves only the dark canvas; the accent didn't move.

## Context

v0.11 introduced "Obsidian Mint" — a brand canvas anchored at `#171A18` with a faint G+2 channel undertone over the R and B channels. The intent (per ADR 0018, §"What gets recolored"): make the canvas read "cohesive against the spring-green accent without competing." The mechanism: a 2-RGB-unit green offset, small enough to read as "neutral dark" in isolation but large enough to live in the same hue family as the accent.

In practice, the cohesion read as competition. User feedback on the v0.11.16 dashboard (the SaaS page at `/saas`) flagged the canvas as "weird green":

> "Instead of this weird green background, I want the BG surface colors to be more darker, something like #0D0D0D. And then you can modify other colors based on this dark color. Everything should look coherent. Follow the tokenized system that we have built."

Three signals in the feedback:

1. **The canvas reads as a hue, not as a neutral dark.** The user perceived the green tilt despite its small RGB footprint. This is the Bezold-Brücke shift in operation: color appearance shifts with luminance, and a 2-RGB-unit tilt that reads near-neutral at canvas lightness (~9.7% L) reads visibly minty at raised lightness (~13% L). The v0.11.11 retune scaled the tilt from G+5/+4 down to G+3 to address this asymmetry on raised + popover surfaces, but the canvas itself still carried the tilt.
2. **The user-set new anchor is `#0D0D0D`.** A true near-black, R = G = B, ~5.1% L. Significantly darker than v0.11's `#171A18` (9.7% L) — the recolor is also a *deepening* of the canvas, not just a hue strip.
3. **"Modify other colors based on this dark color. Everything should look coherent."** The recolor is to be system-wide, with the ramp re-tuned around the new anchor. Not a one-off override on `/saas`.

## Decision

**Lumen v0.12: Obsidian recolor — mint retired.**

### What gets recolored

| Layer | v0.11 (Obsidian Mint) | v0.12 (Obsidian) |
|---|---|---|
| Canvas anchor (brand.800) | `#171A18` (G+2 tilt) | `#0D0D0D` (neutral) |
| Raised (brand.700) | `#1B1E1C` (G+3 tilt) | `#151515` (neutral) |
| Popover (brand.600) | `#232624` (G+3 tilt) | `#1F1F1F` (neutral) |
| Sunken (brand.900) | `#0E110F` (G+1 tilt) | `#080808` (neutral) |
| Void (brand.950) | `#060807` (G+2 tilt) | `#050505` (neutral) |
| Mid-rail / borders (brand.500) | `#4A4D4B` (G+3 tilt) | `#404040` (neutral) |
| Secondary text on dark (brand.400) | `#6E7270` (G+4 tilt) | `#6B6B6B` (neutral) |
| Tertiary text on dark (brand.300) | `#9DA09F` (G+3 tilt) | `#9A9A9A` (neutral) |
| Mid-tone (brand.200) | `#C8C9C8` (G+1 tilt) | `#C8C8C8` (neutral) |
| Light anchor (brand.100) | `#E6E6E6` (user-fixed) | `#E6E6E6` (unchanged) |
| Cream-leaning paper (brand.50) | `#F4F5F4` (G+1 tilt) | `#F4F4F4` (neutral) |
| Accent ramp | Spring Green | unchanged |
| Status ramp | refined red / warning / info | unchanged |
| Cream / neutral mid-stops | residual G+1 drift | neutralized |
| Mood id | `obsidian-mint` | `obsidian` (with localStorage migration) |
| Mood label | "Obsidian Mint" | "Obsidian" |

### Cascade

The token system is hierarchical: primitive `color.brand.{stop}` → semantic `color.surface.{role}` → component (via globals.css `--surface-*` variable). When primitive values change but paths stay the same, downstream consumers automatically inherit the new values. The recolor lives at exactly two anchor points, both updated atomically:

1. **DTCG primitive:** `design-system/01-tokens/primitives/color.tokens.json` — `color.brand.{50..950}` values + `color.alpha.ink.*` + `color.alpha.void.72`. Plus residual neutral.* G-drift cleanup.
2. **Runtime CSS:** `audit-dashboard/src/app/globals.css` — `--lumen-obsidian-{0..10}`, `--lumen-cream-{0..9}`, `--lumen-ink-aXX`, `--lumen-void-a72`. The runtime mirrors the DTCG primitive (as established in ADR 0001 and reaffirmed in v0.11.13).

Plus mood-id rename in `audit-dashboard/src/lib/moods.ts` + `mood-switcher.tsx` (with localStorage migration) + `layout.tsx` (data-mood attribute) + on-screen badges/footers.

Semantic tokens (`color.dark.tokens.json`, `color.light.tokens.json`) had description prose updated, but no token-value paths changed.

## Consequences

### Positive

- **The user-reported "weird green" is gone.** The canvas is now confidently neutral; the spring-green accent has the entire hue stage to itself; the cohesion the v0.11 tilt was trying to manufacture is now achieved by the deeper neutral ground letting the accent be the loudest hue in the frame.
- **The cascade-fix model proves itself again.** One primitive recolor + one runtime mirror flows through every surface, every component, every page, every mode. No call-site overrides; no per-page recoloring; no component re-tunings. Same shape as v0.11.15 / v0.11.16 / v0.11.17 (token-tier > component-tier > call-site-tier).
- **WCAG contrast tiers are preserved or improved.** The deeper canvas widens the gap to every fg color: text.primary 13.7 → 15.5+, text.secondary 6.4 → 6.9, text.tertiary 3.6 → 3.65 (still AA Large). No tier regressions.
- **The single-accent rule is reinforced, not weakened.** With a neutral canvas, the spring-green accent is the *only* hue in the frame. Every chromatic moment in a Lumen UI is the accent doing work. Anything else is a brand violation by construction.
- **Light/dark parity improves.** v0.11 had a tinted dark canvas + a near-neutral light canvas — the modes weren't visually parallel. v0.12 makes both neutral, so the only thing changing between them is value (light/dark), not hue. The system now reads as "the same brand in two values," not "two slightly different brands."
- **Side fix: the contrast checker is no longer testing v0.4 colors.** `scripts/check-contrast.mjs` had been hardcoded with v0.4-era navy/cream/lime values for nine releases — the green-check passed but didn't reflect what was shipping. v0.12 brings it in sync (and extends dark-mode coverage from 4 pairs to 7 pairs).

### Trade-offs accepted

- **The "warm-mint cohesion" rationale of ADR 0018 §"What gets recolored" is retired.** The argument was that a 2-RGB-unit green tilt would let the canvas read as part of the same hue family as the accent. v0.12 prefers "the canvas is mute; the accent does the talking" — a different design philosophy, more aligned with the brand identity riding on the accent itself.
- **The "obsidian-mint" name (a meaningful product-of-recolor in v0.11) is retired.** The mood is now just "obsidian." Some marketing collateral may need updating.
- **Light-mode appearance shifts very slightly.** The cream/neutral mid-stops had a residual +1 G drift that v0.12 strips for end-to-end neutrality. Per-channel shifts ≤2 RGB units; visually imperceptible at typical viewing distances; tokenically coherent with the dark recolor.

### Negative

- **Brand cohesion now relies entirely on the accent.** Pre-v0.12, the canvas itself carried a subtle hue cue that signaled "this is a Warp surface" even in moments where the accent wasn't visible. v0.12 removes that cue — a Lumen surface in a screenshot with no accent visible could be confused for any other neutral-dark dashboard. Mitigation: most Lumen surfaces DO have the accent visible (CTAs, status pills, focus rings, the radial aurora glow); the surfaces that don't are a small minority. The trade favours accent prominence over brand-without-accent recognition.
- **The "Obsidian Mint" mood id is a breaking rename.** Implemented as a backwards-compat migration in `mood-switcher.tsx`: any stored `obsidian-mint` localStorage value is mapped to `obsidian` on first load. Functionally seamless for end users; would matter if any external system reads `lumen-mood` from another tab's storage (it doesn't).
- **All v0.11 documentation that quotes specific dark hex values now references obsolete colors** unless the description was updated in v0.12. We updated the dark-mode contrast checker, the foundations page descriptions, the semantic token descriptions, the primitive token descriptions, and globals.css comments. Some platform guides (`design-system/03-platforms/*/README.md`) still quote `#171A18`; flagged as a follow-up cleanup pass for v0.12.x but not blocking on v0.12.0.

## Alternatives considered

### A. Keep the v0.11 obsidian-mint canvas; only address the user's screenshot at the call-site level

Override `--surface-page` to `#0D0D0D` on the SaaS page only. **Rejected** because:
- The user's "this weird green" applies to every dark Lumen surface, not just `/saas`. A call-site override would leave the rest of the system minty and split the brand identity in two.
- The user explicitly said "modify other colors based on this dark color. Everything should look coherent." Coherence requires the system-wide retune.

### B. Scale the G tilt smaller (G+2 → G+1 → G+0.5)

Less aggressive than retiring it entirely. **Rejected** because:
- The Bezold-Brücke shift means even a G+1 tilt reads visibly green at lighter stops (raised, popover). v0.11.11 already tried scaling — the user's complaint came AFTER that scaling pass.
- A "smaller mint" canvas is less confident than a fully neutral one. Half-measures here read as indecision.

### C. Move to a different chromatic tilt (e.g., cool-blue undertone)

A different hue family entirely. **Rejected** because:
- It just relocates the same problem to a different hue. The accent would compete with whatever-the-canvas-tilts-toward instead of with green.
- The user's stated intent is "more darker" + "BG surface colors" — a value/saturation request, not a hue swap.

### D. Pure black `#000000`

Even darker than `#0D0D0D`. **Rejected** because:
- True black is harsh on backlit screens. The 5%-luminance neutral at `#0D0D0D` keeps the surface readable while still being confidently dark.
- The user explicitly said "something like #0D0D0D" — they specified the value, not "as dark as possible."

### E. Keep the mood named "Obsidian Mint" with the new neutral canvas

The label is a brand-recognized term; the value can move while the name stays. **Rejected** because:
- "Mint" is a hue qualifier. With the hue retired, the qualifier is misleading.
- A mood named for a hue it no longer carries is the kind of legacy debt that compounds (next contributor adds a "v0.13 Frosted Mint" mood and the namespace gets confusing).
- Localized migration is one line in `mood-switcher.tsx`. Cheap to do, cleaner end-state.

### F. Retire the cream/neutral split entirely, since both ramps are now fully neutral

Collapse `--lumen-cream-N` and `--lumen-neutral-N` aliases into a single ramp. **Rejected for v0.12** because:
- ~50 references in globals.css use the cream alias. Renaming is its own change with its own blast radius.
- The deprecation policy (≥1 minor release before removal) means the cream alias stays through at least v0.12.x. Filed as a v0.13 candidate.

## Why this is the right anchor change

A brand canvas does one of three jobs:

1. **Be the neutral ground.** The canvas is mute; everything else (accent, status, content) does the talking.
2. **Reinforce the accent via hue family.** The canvas tilts toward the accent's hue; together they read as cohesive.
3. **Carry an independent voice.** The canvas IS a hue; the accent + canvas form a two-color identity.

v0.4–v0.10's "obsidian" canvas did (1). v0.11's "obsidian-mint" tried (2). The user's "weird green" reaction is data: (2) reads as competition rather than cohesion when the user's eye expects (1) on a near-black canvas. v0.12 returns to (1) but at a deeper anchor (`#0D0D0D` vs v0.10's `#0a0a0d`) — same architectural role for the canvas, more confidently dark.

The brand identity continues to ride on the accent. The accent is what makes a Warp surface recognizable. The canvas's job is to stay out of the way and let the accent be loud.

## Measurements (informational)

- Pre-v0.12 (v0.11.x obsidian-mint): canvas `#171A18` (~9.7% L, +2 G tilt). Spring-green-on-canvas chroma contrast: moderate (canvas carries some green; accent's green is "additional green").
- Post-v0.12 (neutral obsidian): canvas `#0D0D0D` (~5.1% L, neutral). Spring-green-on-canvas chroma contrast: maximal (canvas is fully neutral; accent's green is "the only green").
- Luminance contrast also improved: text.primary on canvas (#E6E6E6 on #171A18) was ~13.7:1; v0.12 (#E6E6E6 on #0D0D0D) is ~15.5:1. Same fg, deeper bg, bigger gap.
- Light mode: imperceptible visual shift (sub-2-RGB-unit per-channel changes); no contrast-tier regressions.

## Open questions (for v0.12.x or v0.13)

- **Should the contrast checker derive pairs from the actual built tokens?** The hardcoded list works but is high-maintenance; one missed token rename = silent green check on obsolete colors (the failure mode the v0.4 → v0.11 era taught us). A token-derived list would self-update with the brand. Out of scope for v0.12.0; tracked as a v0.12.x candidate.
- **Should `--lumen-cream-N` be retired now that the ramp is fully neutral?** The "cream" name carries the v0.4–v0.10 warm-cream history; in v0.12 the values are pure neutral. Renaming is a backwards-compat hazard (cream is consumed in ~50 globals.css references); deferring to v0.13.
- **Should the ADR 0018 mood label "Obsidian Mint" be archived in `_meta/audits/` for historical reference?** The brand visited the mint anchor for one minor release; archiving the audit material would be a useful artifact for any future "should we tilt the canvas again?" conversations. Out of scope; tracked.

## See also

- [v0.12.0 changelog entry](../../CHANGELOG.md#0120--2026-05-06--obsidian-mint-retired--brand-canvas-retuned-to-neutral-near-black-at-0d0d0d) — user-facing release notes
- [ADR 0018 — v0.11 Premium Psychology recolor (Obsidian Mint)](./0018-premium-psychology-recolor.md) — the brand-anchor decision this ADR amends
- [ADR 0005 — Warp green is the only accent](./0005-warp-green-as-only-accent.md) — single-accent rule (preserved verbatim through v0.12)
- [ADR 0001 — Token system architecture](./0001-token-system-architecture.md) — primitive → semantic → runtime cascade (the model that made this recolor a 2-anchor edit instead of a 100-call-site edit)
- [`design-system/01-tokens/primitives/color.tokens.json`](../../design-system/01-tokens/primitives/color.tokens.json) — the v0.12 brand ramp source-of-truth
