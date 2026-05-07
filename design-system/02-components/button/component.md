---
name: Button
type: component
status: stable
version: 0.12.2
since: 0.1.0
deprecated: false
platforms: [web-react, react-native, ios-native, android-native, shopify-liquid]
a11y_level: WCAG-2.2-AA
related: [IconButton, Link, Toggle, ButtonGroup, SplitButton, FAB, CommandPaletteButton]
spec: ./component.json
last_updated: 2026-05-06
---

# Button

> A button triggers an action. It's the primary way users commit to a decision in a flow. The Spring Green primary button is the system's most distinctive surface — used sparingly and always for the most important action in a view. Five sizes × eight intents × three shapes. v0.12.2 dialed the primary-hover glow ladder down: rest unchanged at the brand-defining `0 0 16px lime-a25`, hover trims to `0 0 20px lime-a28` plus quieter mid/outer halo layers.

## When to use

- Submitting a form ("Get rates", "Book now", "Send magic link").
- Confirming a destructive action (use `intent="danger"`, paired with a confirmation dialog).
- Triggering an action that mutates state ("Cancel order", "Re-route").
- Surfacing an AI-driven primary action ("Improve", "Summarize", "Quote with AI") — use `intent="ai"` for the tonal-lime + sparkle treatment.

## When NOT to use

- For pure navigation between pages — use `Link` instead.
- For binary on/off state — use `Toggle`.
- For low-emphasis tertiary actions inside dense tables — use `IconButton` with a tooltip.
- For floating overlays where the button must read against arbitrary canvases — use `intent="glass"` (translucent + backdrop blur).

## Anatomy

1. Container — rectangle with `radius.control.md` (rect, default), `radius.full` (pill), or square + radius.full (round)
2. Leading icon (optional, gap = `button.gap.{size}`)
3. Label (required, ≥ 1 character, sentence case, verb-led)
4. Trailing icon (optional)
5. Loading spinner (replaces leading icon when `loading=true`; preserves color)
6. Success checkmark (transient — replaces leading icon for 1.6 s when `success=true` flips, then auto-clears)
7. Focus ring (`shadow.focus`, always visible on `:focus-visible`, dual-ring on accent surfaces — Atlassian 2024 fix per WCAG 2.4.13)

## Variants — the 5 × 8 × 3 matrix

| Prop | Values | Default | Notes |
|---|---|---|---|
| `intent` | `primary` / `secondary` / `tertiary` / `ghost` / `outline` / `danger` / `danger-soft` / `ai` / `glass` / `link` | `secondary` | One primary CTA per view. `tertiary` is an alias of `ghost` (kept for backwards compat through v1.0). `danger-soft` is destructive-in-tight-contexts (table-row delete). `ai` is tonal lime + sparkle for AI-driven primaries. `glass` is for floating overlays only. |
| `size` | `xs` / `sm` / `md` / `lg` / `xl` | `md` | xs 24 / sm 32 / md 40 (default) / lg 48 / xl 56 px. Mobile primaries use `lg` minimum to clear the 44 px touch floor. `xs` is desktop-only (table-row inline, chip-close). |
| `shape` | `rect` / `pill` / `round` | `rect` | `rect` (default) — operator chrome. `pill` (full radius + 50% extra horizontal padding) — hero / AI / marketing CTAs. `round` (square dimensions + full radius) — icon-only contexts; use the formal `IconButton` primitive instead. |
| `leadingIcon` | icon | — | 12 px on xs/sm, 14 px on md, 16 px on lg, 20 px on xl. Replaced by spinner during `loading`, by checkmark during `success`. |
| `trailingIcon` | icon | — | Use sparingly. ChevronDown for dropdown triggers; ArrowRight for advance flows. |
| `fullWidth` | boolean | `false` | `w-full`. Common in modal footers and mobile CTAs. |
| `loading` | boolean | `false` | Replaces leading icon with spinner; sets `aria-busy=true`; suppresses click. Visually distinct from disabled (color preserved). |
| `success` | boolean | `false` | v0.9 — Transient. When flipped to `true`, the button shows a checkmark + tonal-lime surface for 1.6 s, then auto-clears. Pair with a live-region announcement. |
| `pressed` | boolean | `false` | v0.9 — `aria-pressed=true`. Renders the lime-tinted selected surface. For ToggleButton / segmented option / split-button menu trigger. |
| `disabled` | boolean | `false` | Sets `aria-disabled=true` (not the disabled attribute) inside forms so the button stays in tab order. Loading auto-disables. |
| `glow` | boolean | `false` | Legacy v0.4 — layers `.lumen-glow-cta` on top of the standard primary glow ladder for hero CTAs (landing-page primaries, AI primary). |
| `pill` | boolean | `false` | Legacy v0.4 — alias of `shape='pill'`. Kept for backwards compat; new code uses `shape`. |

## States — the eight-state ladder

| State | Visual rule | A11y |
|---|---|---|
| **rest** | Tokens per intent × surface. Primary ships the always-on glow at `0 0 16px lime-a25`. | — |
| **hover** | `bg.hover` (`-8%` on solid intents, `+tint` on ghost/tertiary). 120 ms decelerate. **v0.12.2 — primary-hover glow trimmed.** See "Primary-button glow ladder" below. | — |
| **focus-visible** | Single 3 px lime ring on neutral surfaces; **dual ring** on lime/primary surface (Atlassian 2024 fix; WCAG 2.4.13). Always visible; never `outline: none` without replacement. | — |
| **active / press** | `bg.press` + `filter: brightness(0.92)` + glow ladder shrink. **No transform** (no translate, no scale). Instant change on press; restore on release. | — |
| **selected** | `aria-pressed=true` → tonal lime + lime hairline border (`.lumen-btn-selected`). | aria-pressed |
| **disabled** | opacity 0.4, `pointer-events: none`, cursor not-allowed. | aria-disabled (in forms) / disabled (outside forms) |
| **loading** | Spinner replaces leading icon. Color preserved. Click suppressed. Distinct from disabled. | aria-busy=true |
| **success** | v0.9 — Brief 1.6 s. Checkmark replaces leading icon, surface flips to tonal lime. Live-region announce. | aria-live="polite" |

## Primary-button glow ladder (v0.12.2 retune)

The primary intent ships a three-state ambient glow that signals "this is the primary CTA" even at rest. The rest-state halo is the brand voice (per [ADR 0018](../../../_meta/decisions/0018-premium-psychology-recolor.md)) — the canvas always slightly lit by the spring-green accent, not just when you're about to click. v0.12.2 dialed the *hover* down because user feedback flagged the layered hover halo as "little too much" — the bloom spread ~40 px past the button on every side. Rest and active stayed put.

| State | v0.11.x → v0.12.0 | v0.12.2 (current) | Rationale |
|---|---|---|---|
| rest | `0 0 16px lime-a25` | `0 0 16px lime-a25` (unchanged) | Brand voice — the always-on "lit" signal. ADR 0018 commits to this; the canvas earns the accent's halo presence. |
| hover (token) | `0 0 24px lime-a40` | `0 0 20px lime-a28` | Blur −17%, alpha −30%. Cascades into base `:hover` AND the first layer of the layered halo. |
| hover (layered halo, mid) | `0 0 24px lime-a20` | `0 0 20px lime-a14` | The "lit boost" middle layer softens. |
| hover (layered halo, outer) | `0 0 48px lime-a10` | `0 0 32px lime-a08` | The wide "bloom" outer layer pulls in 16 px and softens 20% in density. Biggest perceptual win — at 48 px blur the alpha integral is wider, so cutting blur there is the dominant dial-down. |
| active | `0 0 8px lime-a20` | `0 0 8px lime-a20` (unchanged) | Press feedback — already tight, no change needed. |
| `.lumen-glow-cta:hover` (hero CTA only) | mid `0 0 32px lime-a28`, outer `0 0 64px lime-a14` | mid `0 0 28px lime-a18`, outer `0 0 48px lime-a10` | Trimmed in lockstep so hero still reads ~1.5× standard primary. The hierarchy stays intact. |

See [ADR 0022](../../../_meta/decisions/0022-hover-glow-ladder-retune-v0122.md) for the full rationale, the user screenshot that motivated the retune, and the Weber-Fechner reasoning behind the non-uniform per-layer cuts.

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

## Accessibility

- Renders as `<button type="button">` by default. Use `as="a"` only when navigating.
- Visible focus ring uses `--shadow-focus`. Do not remove or replace.
- Disabled state uses `aria-disabled="true"` (and `pointer-events: none`) instead of the `disabled` attribute when inside a form, so screen readers can still announce the label.
- Loading state sets `aria-busy="true"` and suppresses pointer events.
- Success state announces via `aria-live="polite"` when used as confirmation feedback.
- Pressed state (`aria-pressed`) is for toggle / segmented behavior — do NOT use it for momentary buttons.
- Minimum touch target 44 × 44 px on mobile, regardless of `size`. Web defaults to 40 px (`md`); mobile templates must bump to `lg` minimum.
- Label must contain at least one visible character. Icon-only buttons must use `<IconButton>` with a required `aria-label`.

WCAG validated:
- 1.4.3 Contrast (Minimum) — accent fg/bg pair is 14.7:1 (AAA on spring green).
- 1.4.11 Non-text Contrast — focus ring + dual ring on accent surfaces.
- 2.4.7 Focus Visible — focus ring always present.
- 2.4.13 Focus Appearance — dual-ring on lime accent surface (Atlassian 2024 pattern).
- 2.5.5 Target Size (Enhanced) — 44 × 44 minimum on mobile.

## Do

- Use one primary button per view.
- Lead with a verb in the label: "Save changes", "Get rates", "Delete account". Numerate when possible: "Add 3 lanes" not "Add lanes".
- Pair `danger` intent with a confirmation dialog (or HoldToConfirm — deferred v0.9.x).
- Pair `loading` with optimistic feedback elsewhere if the operation takes >2 s. Use a progress bar in the page if the action takes >5 s.
- Use `success` for short-lived confirmation feedback ("Saved", "Sent", "Quoted"). Pair with a live-region announcement.
- Use `intent="ai"` for AI-driven primary actions. Pair with a sparkle leading icon.
- Use `shape="pill"` for hero / marketing CTAs and the AI primary. Operator pages stay `shape="rect"` for density.
- Use `intent="danger-soft"` for destructive actions in tight contexts (table-row delete, settings) where solid red over-emphasizes.

## Don't

- Don't stack three primary buttons in a row. (Stack: 1 primary + 1–2 secondary.)
- Don't use Title Case ("Save Your Changes"). Use sentence case ("Save your changes").
- Don't disable a button without explaining why nearby (helper text, tooltip).
- Don't put icons on both sides of a short label. Pick one.
- Don't use `intent="primary"` for a destructive action. That's `intent="danger"`.
- Don't render white or near-white text on the Spring Green accent surface. The accent foreground is bound to `color.action.primary.fg` (`#07120D`, 14.7:1 AAA on `#00FA8A`). White on spring green is ~1.4:1 — a WCAG AA fail. Lint rule `lint:no-white-on-accent` enforces this. (See [AGENTS.md](../../../AGENTS.md) hard rule #9.)
- Don't use the shadcn token-bridge utilities (`bg-primary text-primary-foreground` etc.) in product code. They're unreliable in Tailwind v4 ([ADR 0015](../../../_meta/decisions/0015-shadcn-token-bridge-direct-refs-v081.md)). Use the `.lumen-btn-*` defensive classes or direct semantic refs.
- Don't translate or scale the button on press. Press feedback is `filter: brightness(0.92)` + glow ladder shrink. Decelerate, don't bounce.
- Don't override `--shadow-button-glow-hover` in product code expecting to "make it brighter" — the v0.12.2 retune is the system-tuned value. If you genuinely need more presence, use `glow={true}` to layer `.lumen-glow-cta` on top (hero CTAs only).
- Don't use `intent="ai"` for non-AI actions. The sparkle + tonal lime is reserved for AI affordances; over-using it dilutes the signal.

## Code

See platform-specific examples in `./examples/`. The machine contract is `./component.json`.

- Web (Next.js / React + Tailwind v4): [`./examples/primary.tsx`](./examples/primary.tsx)
- React Native (NativeWind): `./examples/primary.rn.tsx`
- iOS (SwiftUI): `./examples/primary.swift`
- Android (Compose): `./examples/primary.kt`
- Shopify Liquid: `./examples/primary.liquid`

## Changelog

- **0.12.2** — Primary-button hover bloom dialed down at the token + layered-halo level. `--shadow-button-glow-hover` retuned `0 0 24px lime-a40` → `0 0 20px lime-a28` (cascades into base `:hover` and the first layer of the layered halo). Layered halo middle layer trimmed `0 0 24px lime-a20` → `0 0 20px lime-a14`; wide outer layer (the user-reported "bloom edge") trimmed `0 0 48px lime-a10` → `0 0 32px lime-a08`. `.lumen-glow-cta:hover` (hero CTAs) trimmed in lockstep so standard-vs-hero hierarchy stays intact. Rest, active, focus, dual-ring, and every alpha primitive unchanged. User screenshot 2026-05-06 of /library LoginCard "Send magic link" caught the bloom (~40 px past the button on every side). See ADR 0022.
- **0.12.0** — Canvas neutralized. The Button surface tokens (action.primary.bg, action.primary.fg) are unchanged; the dark canvas behind primary buttons retunes from `#171A18` (obsidian-mint) to `#0D0D0D` (neutral obsidian). Spring-green accent has the hue stage to itself (the canvas no longer carries a faint green tilt). See ADR 0020.
- **0.11.0** — Primary surface re-anchored from Warp lime `#4ade80` to Spring Green `#00FA8A`. Accent.fg retuned `#0a0a0d` → `#07120D` for 14.7:1 AAA on the new hue. Glow ladder RGB shifted (74,222,128) → (0,250,138). Danger bg refined: status.danger.500 `#ef4444` → `#E5484D`; CTA bg.rest = status.danger.700 (`#B71D2A`) for AA Normal. No API surface change. See ADR 0018.
- **0.9.0** — Eight intents (added ghost, outline, danger-soft, ai, glass; tertiary kept as alias of ghost). Five sizes (added xs=24 for table inline). Three shapes (rect/pill/round). Three-state glow ladder for primary (rest 16/0.25 → hover 24/0.4 → active 8/0.2 — later retuned in v0.12.2). Dual-ring focus indicator on lime accent surfaces (Atlassian 2024 fix; WCAG 2.4.13). New props: shape, success (transient checkmark+verb), pressed (aria-pressed). Press feedback dropped translate-y; replaced with `filter: brightness(0.92)`. See ADR 0016.
- **0.9.0** — Implementation moved from cva inline-Tailwind utilities to `globals.css` `.lumen-btn-*` defensive classes. The cva button now composes class names (not Tailwind arbitrary values), guaranteeing dev/prod parity in Tailwind v4. See ADR 0016.
- **0.9.0 (Deprecated)** — `intent='tertiary'` is now an alias of `intent='ghost'`. Both work; ghost is the new canonical name. Tertiary will be removed in v1.0.
- **0.8.1** — Primary intent — pinned bg/fg to direct Lumen-token refs to bypass the shadcn bridge fragility in Tailwind v4. See ADR 0015.
- **0.8.0** — Heights re-bound to `size.control.*` semantic tokens. Padding migrated from raw px to `space.inset.squish.*` semantic refs (Curtis 2016 / Atlassian compositional pattern).
- **0.4.0** — Pill shape (via `pill` prop). Glow halo (`glow` prop) for hero CTAs. xl size (56 px hero). Accent.fg pinned to obsidian `#0a0a0d` for 12.6:1 AAA on lime (later retuned to `#07120D` in v0.11 for the spring-green retune).
- **0.1.0** — Initial. Four intents (primary, secondary, tertiary, danger), three sizes, loading state, full-width variant, leading/trailing icons.

## Related

- [Toggle](../toggle/component.md) — for binary state
- [IconButton](../icon-button/component.md) — for icon-only contexts (square shape, required aria-label)
- [ButtonGroup](../button-group/component.md) — joined non-exclusive button row
- [SplitButton](../split-button/component.md) — primary action + dropdown caret
- [FAB](../fab/component.md) — round, fixed-position bottom-end primary (mobile)
- [CommandPaletteButton](../command-palette-button/component.md) — search-styled global trigger (⌘K)
- [Badge](../badge/component.md) — for non-interactive status
- [Buttons foundation](../../00-foundations/buttons.md) — the comprehensive button language
- [Voice and tone § microcopy](../../00-foundations/voice-and-tone.md#microcopy-templates) — button copy rules
