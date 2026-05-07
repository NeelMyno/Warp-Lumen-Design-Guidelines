---
name: Buttons
type: foundation
version: 0.12.2
last_updated: 2026-05-06
audience: [designer, engineer, llm-agent]
target: WCAG-2.2-AA
related: [./principles.md, ./color.md, ./typography.md, ./spacing.md, ./density.md, ./motion-language.md, ./accessibility.md, ./voice-and-tone.md, ../02-components/button/, ../02-components/icon-button/, ../02-components/button-group/, ../02-components/split-button/, ../02-components/command-palette-button/, ../02-components/fab/, ../../_meta/decisions/0015-shadcn-token-bridge-direct-refs-v081.md, ../../_meta/decisions/0016-button-rebuild-v09.md, ../../_meta/decisions/0018-premium-psychology-recolor.md, ../../_meta/decisions/0022-hover-glow-ladder-retune-v0122.md]
---

# Buttons

> Buttons are the most-touched component in any operator UI. Lumen's button language is **operator-readable, decelerate-not-bounce, and brutally consistent**: five sizes × eight intents × three shapes, single source of truth in CSS classes, dual-ring focus on accent surfaces, no transform on press, signature spring-green glow ladder on the primary action — and absolutely never white text on accent. v0.12.2 dialed the primary-hover bloom down (rest unchanged at the brand-defining `0 0 16px lime-a25`, hover trims to `0 0 20px lime-a28` per [ADR 0022](../../_meta/decisions/0022-hover-glow-ladder-retune-v0122.md)).

This is the canonical reference for the entire button family. Read it before you touch any button surface.

## Operating principles

1. **The primary CTA is sacred.** One per view. Lime fill, obsidian text, soft glow. Two primaries = no primary.
2. **No white text on lime.** AGENTS.md hard rule #9. Press → check the lint:no-white-on-accent script before opening a PR.
3. **Decelerate, don't bounce.** No transform/scale/translate on press. Press feedback = `filter: brightness(0.92)` + glow ladder shrink. Operator UI on a trackpad shouldn't jump.
4. **Density is dense.** xs (24) / sm (32) / md (40) / lg (48) / xl (56). Mobile primaries are lg minimum to clear the 44 px touch floor; desktop dense tables get xs–sm.
5. **Voice is the verb.** Labels are sentence-case verbs. "Save changes" not "OK". "Get rates" not "Calculate". "Re-route load" not "Re-route".
6. **Less but better.** Eight intents max. No discovery-tone, no warning-button, no info-button. The intents that exist all do exactly one thing.

## Anatomy

```
┌─────────────────────────────────────────┐
│  [icon]   Label                          │   ← height tier (xs/sm/md/lg/xl)
└─────────────────────────────────────────┘
   ↑      ↑                              ↑
   pad-x  gap                             pad-x

Pad-x ladder (squish: x > y):
  xs   8 / 0      sm  12 / 4      md  16 / 8
  lg  20 / 12     xl  32 / 16

Gap (icon-to-label):
  xs 4   sm 6   md 8   lg 8   xl 12

Icon size:
  xs 12   sm 12   md 14   lg 16   xl 20

Label type:
  xs type-12   sm type-13   md type-14   lg type-15   xl type-16
```

For pill shape, horizontal padding gets +50% (e.g. md pill = 24 px x). For round (icon-only square), padding is 0 and dimensions are square.

## Sizes

| Size | Height | Use | Touch-safe? |
|---|---|---|---|
| `xs` | **24 px** | Table-row inline action, chip-close, segment cell. Desktop-density only. | No (below 44 floor) |
| `sm` | **32 px** | Compact toolbar, dense forms, sidebar. Linear/Carbon operator floor. | No |
| `md` | **40 px** | Default — dialogs, forms, page-header actions. | No (close, with 4 px hit padding = 44) |
| `lg` | **48 px** | Mobile primary, modal CTA, full-width form submit. | Yes |
| `xl` | **56 px** | Hero pill, landing CTA, AI primary. | Yes |

The five tiers map onto v0.8's `size.control.{xs,sm,md,lg,xl}` semantic tokens. The `cozy` (36 px) and `touch` (44 px) tiers are not used by Button — they're for fields, segmented controls, and mobile chrome.

## Intents — eight roles

| Intent | When | Surface | Border | Glow |
|---|---|---|---|---|
| `primary` | The single most important action in a view (Save, Get rates, Book load). | Spring-green solid (`color.accent.500` = `#00FA8A`) | none | Three-state ladder (v0.12.2 retune): rest **16 px / a25** (brand voice — unchanged) → hover **20 px / a28** (was 24/a40 pre-v0.12.2) → active **8 px / a20** (unchanged). Layered hover halo on `@media (hover: hover)`: middle 20 px / a14 (was 24/a20), outer 32 px / a08 (was 48/a10). See [ADR 0022](../../_meta/decisions/0022-hover-glow-ladder-retune-v0122.md). |
| `secondary` | The second-most-important action; cancel-ish actions; toolbar buttons. | Raised surface | hairline | none |
| `outline` | Visually equal-height to primary but transparent. The "no-fill" alternative. The Glassmorphism ref's secondary. | transparent | hairline ink | none |
| `tertiary` | Alias of `ghost` — kept for backwards compat; will be removed v1.0. | transparent | none | none |
| `ghost` | Toolbar / table-row actions / nested controls. No chrome at rest, hover-only feedback. | transparent | none | none |
| `danger` | Destructive actions when confirmation is paired (modal, type-to-confirm, hold). | Red.600 solid (`#c92626`, AA Normal pass) | none | none |
| `danger-soft` | Destructive in tight contexts where solid red over-emphasizes (table-row delete, settings). Carbon's `danger-ghost`. | transparent | none | none |
| `ai` | AI-driven primaries: "Improve", "Summarize", "Suggest", "Quote with AI". Tonal lime + sparkle leading icon + idle 1 px shimmer (paused on hover/focus). | Tonal lime (alpha 12) | hairline lime | shimmer |
| `glass` | Floating overlay actions: toolbar pinned over a map, modal scrim toolbar. `backdrop-filter: blur(12px)`. NOT a default primary. | Translucent | hairline | none |
| `link` | Inline text-link styled as button (rare). | transparent | none | none |

**Brand constraint.** The spring-green accent plays exactly ONE role: action / live / success. AI uses the same accent in tonal form (lighter, lower alpha) so it reads as "AI-doing-an-action," not as a second accent. Adding any other loud color is a hard-rule #7 violation. (v0.11 retuned the accent from Warp lime `#4ade80` to spring green `#00FA8A`; the single-accent discipline is unchanged. The `--lumen-lime-aXX` alpha primitive names are preserved for backwards compatibility through v1.0; new code may reach for `--lumen-accent-aXX` aliases.)

## Shapes

| Shape | Visual | Use |
|---|---|---|
| `rect` (default) | Rounded rectangle, `radius.control.md` (~6 px). | Operator pages, dense forms, dialogs, toolbars. |
| `pill` | Full radius (9999 px), 50% extra horizontal padding. | Hero CTAs, landing primary, AI primary, marketing badges. |
| `round` | Square dimensions + full radius. | IconButton at certain sizes; FAB; status pings. |

Rect is the operator default. Pill is opt-in. Round is for icon-only contexts; the formal `IconButton` primitive sets it for you.

## States — full ladder

| State | Visual rule | A11y |
|---|---|---|
| **rest** | Tokens per intent × surface | — |
| **hover** | `bg.hover` (typically -8% on solid, +tint on ghost), 120 ms `ease-out` | — |
| **focus-visible** | Single 3 px lime ring on neutral surfaces; **dual ring** on lime/primary surface (Atlassian 2024 fix; WCAG 2.4.13). | Always visible; never `outline: none` without replacement |
| **active / press** | `bg.press` + `filter: brightness(0.92)` + glow ladder shrink. **No transform**. 0 ms (instant) | — |
| **selected** | `aria-pressed=true` → tonal lime + lime hairline border (`.lumen-btn-selected`) | aria-pressed |
| **disabled** | `opacity: 0.4`, `pointer-events: none`, cursor not-allowed | aria-disabled (in forms) / disabled (outside forms) |
| **loading** | Spinner replaces leading icon. Color preserved. Click suppressed. Distinct from disabled. | aria-busy=true |
| **success** | Brief 1.6 s — checkmark replaces leading icon, surface flips to tonal lime + verb-confirmed label ("Saved", "Booked", "Quoted"). Live-region announce. | aria-live="polite" |

**Loading vs disabled.** Loading keeps the button's color and changes the icon to a spinner; disabled drops the whole button to 40% opacity. Operators should never see them look identical — they communicate different things (the action is happening vs. the action is unavailable).

## Motion

```
hover-in:    bg-color    120 ms   cubic-bezier(0.2, 0, 0, 1)   (decelerate)
hover-out:   bg-color     80 ms   cubic-bezier(0.4, 0, 1, 1)   (accelerate)
press:       bg-color      0 ms   instant
focus-in:    box-shadow  120 ms   cubic-bezier(0.2, 0, 0, 1)
loading:     spinner     800 ms   linear infinite
success:     checkmark   240 ms   cubic-bezier(0.2, 0, 0, 1), holds 1600 ms, exits 80 ms
ai-shimmer:  border     1600 ms   ease-in-out infinite, paused on hover/focus
```

`prefers-reduced-motion: reduce` zeros every transition and pauses the AI shimmer. The resting glow on primary stays steady (it's a halo, not motion).

**No transforms on press.** No `translate-y(1px)`, no `scale(0.98)`, no Material-3 spring. Operator UI on a trackpad doesn't jump.

## Glow ladder — primary intent only (v0.12.2 retune)

The primary intent ships a three-state ambient glow that signals "this is the primary CTA" even at rest. Reserved exclusively for `intent="primary"` (and `intent="ai"` when configured). Other intents and surfaces ship zero glow at all states.

**The rest-state halo is the brand voice.** [ADR 0018](../../_meta/decisions/0018-premium-psychology-recolor.md) commits to it — the canvas always slightly lit by the spring-green accent, not just when you're about to click. Removing rest glow would be a brand-voice change, not a UX dial-down. v0.12.2 specifically dialed *hover* down (where the system over-spent per user feedback); rest and active stayed put.

| State | Token | Resolved value | Layered halo (on `@media (hover: hover) and (prefers-reduced-motion: no-preference)`) |
|---|---|---|---|
| rest | `--shadow-button-glow-rest` | `0 0 16px var(--lumen-lime-a25)` | — (single layer) |
| hover | `--shadow-button-glow-hover` | `0 0 20px var(--lumen-lime-a28)` (v0.12.2 — was `0 0 24px lime-a40`) | + middle layer `0 0 20px var(--lumen-lime-a14)` (was `0 0 24px lime-a20`) + outer layer `0 0 32px var(--lumen-lime-a08)` (was `0 0 48px lime-a10`) |
| active | `--shadow-button-glow-active` | `0 0 8px var(--lumen-lime-a20)` | — (single layer) |

For hero CTAs only (landing-page primaries), `.lumen-glow-cta` layers `--shadow-glow-accent-strong` on top of the standard ladder. v0.12.2 trimmed `.lumen-glow-cta:hover` in lockstep with the standard primary so the hierarchy stays intact: hero CTA still reads ~1.5× the standard primary in both spread and density, just both quieter than v0.12.1. Hero CTA layered hover halo: `0 0 28px lime-a18` (was `0 0 32px lime-a28`) + `0 0 48px lime-a10` (was `0 0 64px lime-a14`).

**Why the dial-down isn't a uniform percentage cut.** The middle layer dropped 30% in alpha (a20 → a14); the outer layer dropped 20% in alpha *and* 33% in blur (a10 → a08, 48 px → 32 px). At 48 px blur the alpha integral is wider, so cutting blur there is a bigger perceptual win than cutting alpha alone. The middle layer at 20-24 px blur reads as "edge lighting"; alpha cut is the right knob there. Per-layer reasoning beats uniform percentages. (Weber-Fechner: perceptual intensity scales with the *logarithm* of physical intensity.)

`prefers-reduced-motion: reduce` keeps the rest-state halo steady — it's a halo, not motion — but drops the rest → hover → active transition. Hover and active still apply their box-shadow values; only the easing is removed.

## Focus indicator — dual ring on lime

WCAG 2.4.13 requires a focus indicator that maintains 3:1 contrast against the surrounding surface. A single colored ring **fails** that floor when the button's background is the same color as the ring — exactly what happens when a lime focus ring lands on a lime primary button.

Lumen v0.9 ships an Atlassian-style **dual ring**:
- Inner 2 px ring matches the page canvas (`var(--surface-canvas)` — obsidian in dark, cream in light) — separates the button from the halo.
- Outer 2 px ring (4 px - 2 px inner = 2 px visible) is the lime accent at full saturation.

Result: the focus ring always maintains 3:1 contrast against the canvas, regardless of what the button's surface is.

```css
.lumen-btn-primary:focus-visible {
  box-shadow:
    0 0 0 2px var(--surface-canvas),
    0 0 0 4px var(--lumen-accent-4);
}
```

Other intents (secondary, ghost, danger, etc.) use the standard single 3 px lime ring at 32% alpha — fine on neutral surfaces.

## Composite components

| Component | When |
|---|---|
| `IconButton` | Square Button containing only an icon. Required `aria-label`. Five sizes. |
| `ButtonGroup` | Joined non-exclusive button row (Cut / Copy / Paste). For exclusive single-choice rows use `Segmented`. |
| `SplitButton` | Primary action + dropdown caret (Save / Save as draft / Save & continue). |
| `CommandPaletteButton` | Search-styled global trigger (⌘K). |
| `FAB` | Round, fixed-position bottom-end primary action (mobile). |
| `Toggle` | Pill-shaped on/off control (existing v0.6 component — distinct from a `pressed` Button). |
| `Segmented` | Exclusive single-choice row (existing v0.7 component). |

Deferred to v0.9.x:
- `HoldToConfirmButton` — destructive confirmation via 2 s mouse-hold + type-to-confirm fallback.
- `ToggleButton` — extend Button with `pressed` boolean (current v0.9 already supports `pressed`; standalone primitive is convenience).

## Voice

- **Sentence case, never Title Case.** "Save changes" not "Save Changes."
- **Verb-leading, numerate.** "Add 3 lanes" not "Add lanes." "Re-route load #4928" not "Re-route load."
- **Banned phrases:** "OK", "Submit", "Click here", "Learn more", "Continue" (without context), "Yes" / "No" (use the verb).
- **AI labels** can use sparkle prefix: "✨ Improve" — but only on `intent="ai"` buttons, not as decoration on primary buttons.
- **Mono-cap is a separate variant** (planned v0.9.x): `<Button variant="mono">EXPORT CSV</Button>` ships uppercase Geist Mono with 2 px tracking — reserved for data-context buttons (Export, Run Audit, Compile). Don't use mono-cap for routine ops.
- **Italic never appears on a button label.** Italic is reserved for hero display type (per v0.5 typography).

See [voice-and-tone.md](./voice-and-tone.md) § "Buttons" for the full banned-phrase list.

## Accessibility floor

| Requirement | Threshold | Lumen-internal rule |
|---|---|---|
| Contrast (label vs surface) | 4.5:1 (≥18 px = 3:1) | Primary 12.6:1 / Secondary inherits text-primary / Danger 5.2:1 / AI 4.7+:1 |
| Touch target | 44 × 44 pt mobile | sizes lg+xl on mobile primaries; xs/sm desktop-only |
| Focus visible | Always | dual-ring on primary; single-ring elsewhere |
| Keyboard | Enter + Space | Both activate; Tab/Shift+Tab navigate |
| Screen-reader name | Always | label text or aria-label (IconButton, FAB enforce) |
| State annotation | aria-* | aria-busy (loading), aria-disabled (disabled-in-forms), aria-pressed (selected), aria-haspopup (split-button menu trigger) |
| Reduced motion | Respected | All transitions zeroed; AI shimmer paused; success checkmark static |

## Implementation pattern (v0.9 onward)

The button system is implemented as **CSS classes** in `audit-dashboard/src/app/globals.css`, composed by the cva variants in `audit-dashboard/src/components/ui/button.tsx`. This is intentional and load-bearing.

```css
/* globals.css */
.lumen-btn         { /* base */ }
.lumen-btn-primary { background: var(--color-action-primary-bg-rest); ... }
.lumen-btn-md      { height: var(--size-control-md); ... }
.lumen-btn-pill    { border-radius: var(--radius-full); }
```

```ts
// ui/button.tsx
const buttonVariants = cva("lumen-btn", {
  variants: {
    intent: { primary: "lumen-btn-primary", ... },
    size: { md: "lumen-btn-md", ... },
    shape: { pill: "lumen-btn-pill", ... },
  },
});
```

**Why CSS classes, not Tailwind arbitrary-value utilities.** v0.8.1 (ADR 0015) found that Tailwind v4's content scanner intermittently drops the shadcn token-bridge utilities (`bg-primary`, `text-primary-foreground`) — leading to white-on-lime renders. The class-composition pattern is independent of Tailwind's content-scanning behavior; the classes are statically declared in CSS and always present in the bundle. v0.9 generalises the v0.8.1 fix to every Button surface.

**For consumers building outside the audit-dashboard.** Either:
1. Copy the `.lumen-btn-*` block from `globals.css` (ships as `_build/css/buttons.css` once Style Dictionary is wired — v0.9.x deferred).
2. Use `npx shadcn@latest add <registry>/button` to pull the canonical `examples/primary.tsx`, which ships the same CSS-class pattern.

## Lints that enforce these rules

- **`lint:no-white-on-accent`** ([scripts/lint-no-white-on-accent.mjs](../../scripts/lint-no-white-on-accent.mjs)) — bans white-text classes paired with lime backgrounds; bans the shadcn token-bridge utilities in product code. Wired into `pnpm lint` chain.
- **`lint:button-conventions`** ([scripts/lint-button-conventions.mjs](../../scripts/lint-button-conventions.mjs), v0.9 NEW) — flags icon-only `<button>`s without `aria-label`, generic verbs in labels ("OK", "Submit", "Yes"), Title Case labels, two-icons-on-one-button.
- **`lint:no-primitives`** — bans hardcoded hex / px in component code; forces semantic refs.
- **`lint:no-arbitrary-typography`** — forces named type presets, not `text-[var(--type-N)]`.
- **`lint:no-off-grid-spacing`** — bans Tailwind half-step utilities and inline off-grid px.

## When in conflict

- **Token contracts > prose docs.** If `button.tokens.json` says padding.md is `space.inset.squish.md`, and this doc says something different, the token wins.
- **AGENTS.md hard rules > everything.** Especially #4 (validate against schema), #7 (lime is the only accent), #9 (no white on lime).
- **ADR 0016 carries the v0.9 rationale.** When asking "why is the press feedback brightness instead of translate," the ADR has the answer.
- **The audit dashboard is the reference implementation.** When in doubt about how a pattern looks in production, look at `audit-dashboard/src/app/foundations/page.tsx` and `audit-dashboard/src/app/library/client.tsx`.

---

## Related

- [`02-components/button/component.json`](../02-components/button/component.json) — the contract this doc summarises
- [`02-components/icon-button/`](../02-components/icon-button/) · [`button-group/`](../02-components/button-group/) · [`split-button/`](../02-components/split-button/) · [`command-palette-button/`](../02-components/command-palette-button/) · [`fab/`](../02-components/fab/)
- [`_meta/decisions/0015-shadcn-token-bridge-direct-refs-v081.md`](../../_meta/decisions/0015-shadcn-token-bridge-direct-refs-v081.md) — the bridge fragility that motivated the CSS-class pattern
- [`_meta/decisions/0016-button-rebuild-v09.md`](../../_meta/decisions/0016-button-rebuild-v09.md) — full v0.9 audit + rationale
- [`accessibility.md`](./accessibility.md) § "Primary action contrast" — the no-white-on-lime rule
- [`color.md`](./color.md) — the obsidian / cream / accent ramp
- [`spacing.md`](./spacing.md) — `size.control.*` ladder
- [`motion-language.md`](./motion-language.md) — the deceleration / no-bounce principle
- [`voice-and-tone.md`](./voice-and-tone.md) § "Buttons" — banned phrases
- [`AGENTS.md`](../../AGENTS.md) hard rules #7 (lime as only accent), #9 (no white on lime)
