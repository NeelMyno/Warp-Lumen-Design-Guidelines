---
name: Micro-interactions
type: foundation
version: 1.0.0
last_updated: 2026-05-04
audience: [designer, engineer, llm-agent]
related:
  - ./principles.md
  - ./motion-language.md
  - ./accessibility.md
  - ./buttons.md
  - ./forms-and-inputs.md
---

# Lumen Micro-interactions

> Cheap UIs are static. Premium UIs feel alive. The difference is **micro-interactions**: small, deliberate, decelerating responses to user action — the button that answers a hover, the field that confirms a valid input, the toast that arrives from where it belongs. These tiny moments add up to a feeling of craftsmanship the user can't always articulate but always notices.

This foundation operationalizes [`principles.md`](./principles.md) §5 ("Care is total — every state ships") and §7 ("Decelerate; motion serves comprehension"). It catalogs the moments where Lumen invests motion budget — and where it doesn't.

> [!note]
> v0.11 — new foundation. Built on Daniel Kahneman's *peak-end rule* (people remember peaks and endings, not averages) and Dan Saffer's *Microinteractions* (Rosenfeld 2013). Combined with Lumen's existing motion-language doctrine ([`motion-language.md`](./motion-language.md)) into one operational catalog.

---

## 1. The peak-end rule (why micro-interactions matter)

People do not remember an experience as the average of every moment. They remember **the most intense points (peaks)** and **how it ended**. Micro-interactions are the highest-density way to manufacture small positive peaks throughout a session.

- A satisfying button click (lift + color shift) is a peak.
- A form field that turns lime when validated is a peak.
- A toast that arrives smoothly from the bottom-right is a peak.
- A page that finishes loading without layout shift is a *quiet* peak — the absence of jank.

**Static interfaces have no peaks.** They feel flat, lifeless, cheap. Premium interfaces are full of small, decelerating moments of feedback that signal: *the maker cared about this*.

---

## 2. The micro-interaction budget

Motion is a **budget**, not a fixed cost. Spend it on functional moments; don't spend it on decoration.

| Spend | Save |
|---|---|
| Hover and press states on every interactive element | Decorative scroll-driven parallax |
| Form-field validation feedback | Auto-playing background loops |
| Toast / drawer / modal entrances | Confetti, celebrations, "fun" moments |
| Loading skeleton shimmer | Page-level slide transitions on web |
| Live-data pulse (`LiveDot`) | Equal-weight animations on every section |
| Focus ring fade-in | "Wow" moments for their own sake |

Spending budget on decoration is exhausting; spending it on feedback is invisible — the user just feels the system *responding*.

---

## 3. The standard responses

Every interactive element ships with a standard response set. No exceptions.

### Button (primary, secondary, ghost, outline, etc.)

| State | Visual change | Duration | Easing |
|---|---|---|---|
| **Rest** | Surface paint at rest | — | — |
| **Hover** | Background `-6→-12%` lightness, accent-glow `+33%` opacity (primary only) | `120ms` | `easing.standard` |
| **Press** | Background `-12→-18%` lightness, glow shrinks to `-50%` opacity | `0ms` (instant) | — |
| **Release** | Restore to hover state | `120ms` | `easing.standard` |
| **Focus** | 2 px focus ring at `border.focus` + 4 px halo at `accent.alpha.32` | `180ms` | `easing.standard` |
| **Loading** | Spinner replaces leading icon, label fades to 70% | `180ms` (fade), spin is `motion.slow` linear infinite | `easing.standard` |
| **Success** | Tonal `action.success` paint + check leading icon for 1.6 s | `260ms` (in/out) | `easing.decelerate` |

See [`buttons.md`](./buttons.md) for the full state machine + the `glow` boolean that gates the accent-glow halo.

### Input / textarea / select

| State | Visual change | Duration | Easing |
|---|---|---|---|
| **Rest** | Sunken surface, default border hairline | — | — |
| **Hover** | Border `subtle → default` step | `120ms` | `easing.standard` |
| **Focus** | Border swaps to `border.focus` + halo `shadow.input.focus`, surface lifts to `surface.input.focus` (paper-white in light mode) | `180ms` | `easing.standard` |
| **Valid** | Border swaps to `border.success` (lime) + check glyph fades in to the right | `260ms` (border), `180ms` (glyph) | `easing.decelerate` |
| **Error** | Border swaps to `border.error` + halo `shadow.input.error` + error message slides down 4 px and fades in | `180ms` (border), `260ms` (message) | `easing.decelerate` |
| **Disabled** | Surface drops to `surface.input.disabled`, border to `border.disabled`, cursor `not-allowed` | `0ms` (instant) | — |

The validation glyph and error message are **peak moments** — they confirm the user did the right thing or tell them what to fix. Treat them with intention.

### Card (interactive)

| State | Visual change | Duration | Easing |
|---|---|---|---|
| **Rest** | Hairline border, no shadow | — | — |
| **Hover** | Border lifts to `border.default` + 1 px translate-y up + accent-tinted background `surface.tint-accent` | `180ms` | `easing.standard` |
| **Press** | Translate-y returns to 0 + background lightens slightly | `120ms` | `easing.standard` |
| **Focus-within** | 2 px focus ring (only when child is focused) | `180ms` | `easing.standard` |

Hover is a **gentle lift**, not a flying card. The translate is exactly 1 px — enough that the eye registers a response, not enough to feel cartoonish.

### Toggle / Switch

| State | Visual change | Duration | Easing |
|---|---|---|---|
| **Off → On** | Track color crossfades, thumb slides right, lime tint sweeps the active track | `260ms` | `easing.decelerate` |
| **On → Off** | Reverse, but `motion.base` (180 ms) — exit is faster than entry | `180ms` | `easing.accelerate` |

Symmetric in/out reads slow. Asymmetric (decelerate-in, accelerate-out) reads premium — the system feels confident in the action it just confirmed.

### Tab switch

| State | Visual change | Duration | Easing |
|---|---|---|---|
| **Tab swap** | Underline glides between tabs (or static jump on mobile) | `260ms` | `easing.standard` |
| **Content swap** | Cross-fade only — no slide on web | `120ms` | `easing.standard` |

Sliding tab content on web makes long pages feel disorienting. Cross-fade only.

### Modal / Drawer / Popover

| Container | Enter | Exit | Choreography |
|---|---|---|---|
| Modal | Scale `0.96 → 1` + fade | Scale `1 → 0.96` + fade | Backdrop fades in parallel — same duration, same easing, simultaneous start. |
| Drawer | Slide from anchored edge | Slide back to anchored edge | Backdrop fades in parallel. |
| Popover | Scale `0.96 → 1` + fade | Scale `1 → 0.96` + fade | Anchored to its trigger; appears from the trigger's direction. |

The "appearing from where it makes sense" rule is from [`motion-language.md`](./motion-language.md) §Principles. Slide-from-anywhere is disorienting; slide-from-the-anchor is comprehension.

### Toast

| State | Visual change | Duration | Easing |
|---|---|---|---|
| **Enter** | Slide from anchor (typically bottom-right) + fade | `260ms` | `easing.decelerate` |
| **Auto-dismiss countdown** | Subtle progress bar at the bottom, animated linearly | 6 s success / 8 s info / sticky for errors | linear |
| **Exit** | Fade only — no slide | `180ms` | `easing.accelerate` |

Don't slide a toast back when it dismisses; the slide-in already communicated direction. The fade-out is a quieter "I'm done" gesture.

### Scroll-driven fade-in

When a section enters the viewport for the first time, fade-in subtly. **Once. Never again.**

- Trigger: section is 25% in the viewport.
- Animation: `opacity 0 → 1` + `translate-y 12px → 0`.
- Duration: `260ms` with `easing.decelerate`.
- Stagger: child elements stagger by 30 ms, total never exceeds `motion.slow + 30ms × items` (per [`motion-language.md`](./motion-language.md) §Choreography).
- Honor `prefers-reduced-motion`: snap into place, no transform.
- Only on first entry — re-scrolling the same section does NOT replay the animation.

This is the canonical "premium scroll" gesture. It guides the eye into each new focal point. It is **not** a parallax stunt.

### Page transition (web)

- Default: snap. No transition.
- Optional: cross-fade `motion.slower` (400 ms) `easing.standard` for marketing-flow pages.
- **Never slide a whole page on web.** Slides are mobile-OS-native only.

### LiveDot (the one signature loop)

The pulsing 8 px Spring-Green dot with the 2 px ring expanding to ~19 px and fading. **3-second cycle, infinite, ease-out.** The system's only continuous animation. Used to mark *live* state (live data, live agent, live person, live shipment).

Per [`motion-language.md`](./motion-language.md) §The signature loop — verbatim recipe.

---

## 4. The reduced-motion contract

When `prefers-reduced-motion: reduce` is set, every micro-interaction collapses to the **end state with no transition**.

- Hover/focus state changes: instant.
- Validation messages: appear with no slide; just opacity.
- Toasts: appear and disappear without slide.
- Modals: appear without scale; opacity-only.
- Scroll fade-ins: snap.
- LiveDot: dot stays solid; ring is removed.
- RateTicker: stops scrolling; rates render statically.
- Page transitions: snap.

**Reduced motion is real motion, not "subtle motion."** A user who opts out gets the system without any animation. The functional information (focus state, validation, live data) is still conveyed — just not via motion.

---

## 5. The "approximate" anti-pattern

Premium UIs feel premium because every moment was *intended*. Approximate hover states, approximate spacing, approximate timing — these compound across a session into a feeling of carelessness.

- **Don't ship a hover that "feels about right."** Specify the exact color, the exact duration, the exact easing.
- **Don't ship a press that has no response.** Even a 0 ms color flip is a response — the brain registers it as "the system felt my click."
- **Don't ship an input that doesn't confirm focus.** A focus state with no visible change is a hole — the user can't tell if their click landed.
- **Don't ship a toast that just appears.** Every toast slides in from somewhere — that's how the user knows where it came from.
- **Don't ship a button that doesn't respond to hover.** A static button on a marketing page reads as a static image. The hover is what proves it's interactive.

If a state change has no animation budget, it gets an *instant* (0 ms) flip — never *no* flip.

---

## 6. The peak audit

Once a feature is built, walk through and identify its peaks. Strong UIs have many; weak UIs have few.

For each user action in the flow, ask:
- Does the system respond visibly? (peak)
- Does the success of the action feel acknowledged? (peak)
- Does the end of the flow leave the user with a clear next action? (peak / strong end)

If a key action has no peak — no animation, no acknowledgment, no state change — the user will not remember it. Add a peak. (Don't add five; one is enough.)

---

## 7. What's NOT a micro-interaction

These are decoration, not micro-interactions. Lumen does not ship them.

- **Confetti on success.** Use a tonal lime button + check icon for 1.6 s. The action confirmed itself.
- **Bouncing elements.** Per principle 7: decelerate, don't bounce. The `LiveDot` pulse is the only continuous gesture.
- **Animated section dividers.** Sections separate by typography and white space; they don't animate.
- **Hover-triggered audio.** Lumen ships zero audio.
- **Scroll-jacked sections.** The user owns the scroll; the system responds to it but never overrides it.
- **Mouse-trail effects.** Cursor follows are decoration.
- **Particle systems behind the hero.** The aurora is *atmosphere*; particle systems are decoration.

---

## 8. Cross-references

- [`principles.md`](./principles.md) §5 (care is total) and §7 (decelerate)
- [`motion-language.md`](./motion-language.md) — duration & easing tokens, choreography, reduced-motion contract
- [`buttons.md`](./buttons.md) — full button state machine + glow ladder
- [`forms-and-inputs.md`](./forms-and-inputs.md) — input state machine, error/success/warning halos
- [`accessibility.md`](./accessibility.md) — focus state requirements, reduced-motion contract
- [`02-components/live-dot/component.md`](../02-components/live-dot/component.md) — the one signature loop
- Daniel Kahneman, *Thinking, Fast and Slow* — peak-end rule
- Dan Saffer, *Microinteractions: Designing with Details* (Rosenfeld 2013)
- Apple HIG — feedback principles
