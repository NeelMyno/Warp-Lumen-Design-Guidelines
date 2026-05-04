---
name: Motion language
type: foundation
version: 1.1.0
last_updated: 2026-05-04
audience: [designer, engineer, llm-agent]
related:
  - ./principles.md
  - ./micro-interactions.md
  - ../01-tokens/primitives/motion.tokens.json
---

# Motion language

> Motion serves comprehension. It tells the user where something came from or where it is going. It is short, decelerating, and respects `prefers-reduced-motion` everywhere. **Subtle motion is alive; gimmicky motion is exhausting.**

> [!note]
> v0.11 — small edits to align with the [Premium Psychology principles](./principles.md) §5 (peak-end rule) and the new [`micro-interactions.md`](./micro-interactions.md) catalog. The duration / easing tokens and the signature LiveDot loop are unchanged. Cross-references to `micro-interactions.md` were added; that doc is the operational *what to animate*; this doc is the *how to time it.*

## Principles

1. **Decelerate, don't bounce.** Default easing is `ease-out`. No springs, no overshoot. The one signature exception is the `LiveDot` pulse.
2. **Short.** UI feedback ≤ 180 ms. State transitions ≤ 260 ms. Page transitions ≤ 320 ms. Anything longer must justify itself.
3. **Continuous through space.** When something appears, it appears from where it makes sense (a panel slides in from the side it's anchored to). Cross-fade only when there is no spatial relationship.
4. **One signature loop.** The pulsing Spring-Green `LiveDot` is the recurring motion that signals "this is live." Nothing else loops.
5. **Reduced motion is real motion.** When the user opts out, the system goes still — not "subtle." Crossfade is replaced with snap; pulse is replaced with steady; marquee is replaced with static.
6. **Spend on peaks, save on decoration.** Per principle 5 (care is total) + the peak-end rule: micro-interactions on hover, focus, validation, and success are the moments people remember. Decorative parallax, scroll-jacked sections, and "wow" animations spend the budget on nothing. See [`micro-interactions.md`](./micro-interactions.md) for the catalog.

## Tokens

### Duration

| Token | Value | Use |
|---|---|---|
| `motion.instant` | 0 ms | Never animated; reserved for instant snaps. |
| `motion.fast` | 120 ms | Hover color swaps, micro-feedback (button press color). |
| `motion.base` | 180 ms | Default for all UI feedback. Buttons, inputs, focus rings. |
| `motion.slow` | 260 ms | State changes (panel open, drawer slide, popover appear). |
| `motion.slower` | 400 ms | Page-level transitions, large surface enter/exit. |

### Easing

| Token | Curve | Use |
|---|---|---|
| `easing.standard` | `cubic-bezier(0.2, 0, 0, 1)` | The default. Use this 95% of the time. |
| `easing.emphasised` | `cubic-bezier(0.2, 0, 0, 1.2)` | Reserved for the entry side of large state changes (drawer opens). Slight overshoot. Use sparingly. |
| `easing.decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Entry side: thing arriving. |
| `easing.accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | Exit side: thing leaving. Pair with decelerate for symmetric in/out. |

### The signature loop

```css
@keyframes lumen-live-pulse {
  0%   { transform: scale(1);   opacity: 0.7; }
  100% { transform: scale(2.4); opacity: 0;   }
}

.lumen-live-pulse {
  animation: lumen-live-pulse 3s var(--easing-decelerate) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .lumen-live-pulse { animation: none; }
}
```

## Patterns

### Buttons
- Background color swap on hover: `motion.fast` + `easing.standard`.
- Press: instant color change (no transition on `:active`), restore on release: `motion.fast`.
- Loading: spinner replaces leading icon; spinner rotation is `motion.slow` linear infinite (the only other looping animation, allowed because it's communicating "work in progress").

### Inputs
- Border color swap on focus: `motion.fast` + `easing.standard`.
- Validation message reveals: `motion.base` + `easing.decelerate`. Slide down 4px + fade in.

### Cards (interactive)
- Background swap on hover: `motion.fast`.
- Elevation lift (only when card is genuinely lifting): `motion.base`. Apply `box-shadow` and `transform: translateY(-1px)` together.

### Drawers, modals, popovers
- Drawer (side-anchored): `motion.slow` + `easing.standard`. Slide from edge, no overshoot.
- Modal (centered): `motion.slow` + `easing.decelerate`. Scale 0.96 → 1 + fade. Backdrop fades simultaneously.
- Popover (anchored): `motion.fast` + `easing.standard`. Scale 0.96 → 1 + fade.
- Exit: same duration, `easing.accelerate`.

### Toasts
- Enter: slide from anchor edge (typically bottom-right), `motion.slow` + `easing.decelerate`.
- Exit: fade only (no slide), `motion.base` + `easing.accelerate`.
- Auto-dismiss timer: 6 s success, 8 s info, sticky for errors.

### Tab transitions (within a page)
- Cross-fade content area: `motion.fast` + `easing.standard`. No slide.
- Active-tab underline glides between tabs: `motion.slow` + `easing.standard`. (Optional; static jump is also acceptable.)

### Page transitions (web)
- Default: snap. No transition.
- Optional cross-fade for marketing flows: `motion.slower` + `easing.standard`.
- Never slide a whole page on web. Slides are mobile-OS-native only.

### Mobile (iOS)
- Use `UIView.animate` defaults; honor `UIAccessibility.isReduceMotionEnabled`.
- Sheet presentation: system default.
- Tab switch: cross-fade, system default.

### Mobile (Android)
- Use Material 3 motion tokens (Material's `MotionScheme`).
- Container transform between list and detail: standard.
- Honor `Settings.Global.ANIMATOR_DURATION_SCALE`.

## Choreography rules

When multiple things move:

1. **Stagger when explaining sequence.** If a list of 5 cards loads, stagger their entry by 30 ms each. Total never exceeds `motion.slow + 30ms × items`.
2. **Synchronize when explaining unity.** If a backdrop fades and a modal scales in, run them on the same duration with the same easing, starting at the same moment.
3. **Order is meaning.** What enters first is what the user should look at first. Marquee headline before supporting copy. Stat value before unit.
4. **No more than two concurrent animations.** A third is overload.

## Reduced motion

When `prefers-reduced-motion: reduce`:
- All durations collapse to `0.01ms` via the global `*` rule (already in `globals.css`).
- The `LiveDot` ring stops pulsing; the dot remains.
- The `RateTicker` marquee stops scrolling; the rates display statically.
- All scale/translate enter animations are replaced with snap.
- All page transitions are snap.
- `aria-live` regions still announce — the reduction is visual, not semantic.

## Testing

Every animation:
- Must work with reduced motion enabled (no broken layouts, no functional regressions).
- Must complete within its declared duration; no `animation-fill-mode` games.
- Must have an end state visible if interrupted.
- Must not block input. The user can click during an animation.

## When NOT to use motion

- To celebrate. (No confetti, no checkmarks growing 3× and shrinking.)
- To get attention without a functional reason.
- To soften an error.
- For decoration on a static landing page.
- On any page targeting cognitively impaired users beyond the system minimum.

## When motion is mandatory

- Showing where a thing came from when it enters (a popover from its trigger, a drawer from its edge).
- Communicating ongoing work (loading spinner, marquee).
- Confirming a system action (button press color shift, toggle slide).
- Indicating live state (the `LiveDot` pulse).

## Related

- [Principles](./principles.md) — principle 7 (decelerate; motion serves comprehension) + principle 5 (peak-end care)
- [Micro-interactions](./micro-interactions.md) — v0.11 — the catalog of moments to design (hover, focus, validation, success)
- [Accessibility](./accessibility.md) — reduced motion section
- [Motion tokens](../01-tokens/primitives/motion.tokens.json)
- [LiveDot component](../02-components/live-dot/component.md)
- [RateTicker component](../02-components/rate-ticker/component.md)
