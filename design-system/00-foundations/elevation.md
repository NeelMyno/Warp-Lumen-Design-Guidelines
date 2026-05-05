---
name: Elevation
type: foundation
version: 1.0.0
last_updated: 2026-05-03
audience: [designer, engineer, llm-agent]
related:
  - ./principles.md
  - ./color.md
  - ./forms-and-inputs.md
  - ./accessibility.md
  - ./motion-language.md
  - ../01-tokens/primitives/shadow.tokens.json
  - ../01-tokens/semantic/shadow.tokens.json
---

# Lumen Elevation

> Lumen has three depth-signal modalities: **hairline border**, **shadow**, and **lit edge**. Use the smallest one that does the job. Per [`principles.md`](./principles.md) §1: "If a hairline separates two surfaces sufficiently, do not add a shadow." Floating UI gets a shadow. Glass-pane surfaces get a lit edge. Primary CTAs get a green-glow signature. Everything else stays flat.

This is the canonical reference. Primitive shadow recipes are in [`01-tokens/primitives/elevation.tokens.json`](../01-tokens/primitives/elevation.tokens.json). Semantic surface-bound shadows are in [`01-tokens/semantic/shadow.tokens.json`](../01-tokens/semantic/shadow.tokens.json).

---

## 1. Three modalities — pick the smallest

| Modality | When to use | How |
|---|---|---|
| **Hairline border** | Two surfaces meet at the same plane (card on page, table cell on row). | 1 px border at `color.border.hairline` (~6% ink on light, ~6% paper on dark). No shadow. |
| **Shadow** | A surface genuinely floats off the page (popover, dropdown, modal, toast, lifted card). | Apply the appropriate semantic shadow token (`shadow.popover`, `shadow.modal`, `shadow.toast`, `shadow.lifted`). |
| **Lit edge** | A glass-pane / inset surface wants the reflection cue without committing to backdrop-filter. | `inset 0 1px 0 var(--lumen-paper-a06)` on dark mode. Used for `.lumen-field` inputs in v0.6. |

> [!note]
> Per [`principles.md`](./principles.md) §1: "If a hairline separates two surfaces sufficiently, do not add a shadow." Hairline first. Shadow second. Lit edge for the rare case the surface wants atmosphere without lift.

---

## 2. Hairline border preference

Lumen separates surfaces with **1 px hairlines** by default. Hairlines are cheap, sharp, theme-aware, and never compete with the lime accent for visual weight.

| Token | Light value | Dark value | Use |
|---|---|---|---|
| `color.border.hairline` | `{color.alpha.ink.06}` | `{color.alpha.paper.06}` | Default hairline. Cards, table rows, dividers. |
| `color.border.subtle` | `rgba(10,10,13,0.08)` | `rgba(255,255,255,0.08)` | Slightly stronger; for adjacent same-tier surfaces. |
| `color.border.default` | `{color.alpha.ink.12}` | `{color.alpha.paper.12}` | Standard control border (Input, Button secondary). |
| `color.border.strong` | `{color.alpha.ink.24}` | `rgba(255,255,255,0.24)` | Emphasis dividers, section breaks. |
| `color.border.frame` | `{color.alpha.ink.40}` | `{color.alpha.paper.40}` | Brutalist hairline frame (v0.4 — surrounds statement headlines). |

The brutalist frame (`color.border.frame`) is the v0.4 hairline-strong gesture. Per [CHANGELOG v0.4](../../CHANGELOG.md): `.lumen-frame-brutalist` is "a hairline frame around statement headlines, no shadow." A frame says "this matters" without lifting the surface off the canvas.

---

## 3. Shadow ladder

Defined in [`01-tokens/primitives/elevation.tokens.json`](../01-tokens/primitives/elevation.tokens.json). Six tiers plus inset, accent-glow, and v0.6 input shadows.

### Primitive tiers

| Token | Recipe (light mode) | Use |
|---|---|---|
| `shadow.xs` | `0 1px 1px rgba(14,18,25,0.04)` | Whisper-faint. Rarely used directly. |
| `shadow.sm` | Two-stop: 0 1px 2px @ 5% + 0 1px 3px @ 4% | Cards (default). Hairline + this tier is most cards. |
| `shadow.md` | Two-stop: 0 2px 4px @ 5% + 0 4px 12px @ 5% | Lifted card (interactive hover state). |
| `shadow.lg` | Two-stop: 0 4px 8px @ 5% + 0 12px 24px @ 6% | Popovers, dropdowns, menus, toasts. |
| `shadow.xl` | Two-stop: 0 8px 16px @ 6% + 0 24px 48px @ 8% | Modals — the floating-above-page modal-card recipe. |
| `shadow.2xl` | Two-stop: 0 16px 32px @ 6% + 0 40px 80px @ 10% | Heavy floating — large overlays, hero pop-ins. |
| `shadow.inset` | Inset 0 1px 1px @ 4% | Pressed-button feel; rarely needed at the surface tier. |
| `shadow.accent-glow` | `0 14px 34px rgba(0,250,138,0.24)` | **Warp signature green-glow under primary CTAs.** v0.11 — re-anchored to spring green; opacity preserved verbatim from the v0.4 lime era. v0.11.13 — token now references `{color.alpha.accent.24}` so any future accent retune cascades automatically. |

> [!note]
> Each tier is a **two-stop composite** (except `xs` and `inset`). The first stop is a tight, dark shadow that defines the edge; the second is a longer, softer shadow that gives the lift. Single-stop shadows look harsh; two-stop produces the natural-light feel that pairs with hairline borders.

### Semantic surface-bound aliases

Defined in [`01-tokens/semantic/shadow.tokens.json`](../01-tokens/semantic/shadow.tokens.json). Components reach for these — never primitives directly.

| Token | Resolves to | Use |
|---|---|---|
| `shadow.card` | `shadow.sm` | Default card shadow (paired with hairline border). |
| `shadow.lifted` | `shadow.md` | Card hover-lift (with `transform: translateY(-1px)`). |
| `shadow.popover` | `shadow.lg` | Floating popover surface. |
| `shadow.menu` | `shadow.lg` | Dropdown menu. |
| `shadow.modal` | `shadow.xl` | Modal dialog. |
| `shadow.toast` | `shadow.lg` | Corner toast. |
| `shadow.floating` | `shadow.2xl` | Heavy floating overlay. |
| `shadow.focus` | 3 px spring-green ring at 32% alpha | Focus ring around any focused control. v0.11 — ring is spring green (`#00FA8A` at 0.32), inheriting `{color.alpha.accent.32}`. |
| `shadow.accent-glow` | Verbatim Warp recipe | Optional outer glow under primary CTAs. |

### v0.6 input shadows

Per [CHANGELOG v0.6](../../CHANGELOG.md), inputs gained their own namespace under `shadow.input.*`. These compose on `.lumen-field` wrappers — never on the bare `<input>`.

| Token | Recipe | Use |
|---|---|---|
| `shadow.input.lit-edge` | `inset 0 1px 0 var(--lumen-paper-a06)` (dark mode only; no-op on light) | The lit top edge — the glass-pane reflection trick. See §5. |
| `shadow.input.focus` | `0 0 0 3px rgba(0,250,138,0.32)` | Focus halo on the wrapper. Same recipe as `shadow.focus`. v0.11.13 — references `{color.alpha.accent.32}`. |
| `shadow.input.error` | `0 0 0 3px rgba(229,72,77,0.32)` | Error halo. Painted on focus when `[data-invalid=true]`; replaces `shadow.input.focus`. v0.11.13 — references `{color.alpha.danger.32}` (refined `#E5484D`); was inlined at v0.10's `#ef4444`. |
| `shadow.input.success` | `0 0 0 3px rgba(0,250,138,0.32)` | Success halo. Reuses focus recipe; reserved for explicit post-validation success affordances. |

---

## 4. Surface ladder

Lumen's surfaces stack from canvas to overlay. Each tier picks one primary depth modality.

| Tier | Surface | Modality | Token |
|---|---|---|---|
| **Page** | The canvas | Flat. No shadow, no border. | `color.surface.page` |
| **Sunken** | Inputs, table-row hover | Inset (hairline) | `color.surface.sunken` + `color.border.hairline` |
| **Raised** | Cards, panels | Hairline + `shadow.card` | `color.surface.raised` + `shadow.card` |
| **Lifted** | Card hover state | `shadow.lifted` + `transform: translateY(-1px)` | `color.surface.raised` + `shadow.lifted` |
| **Popover** | Floating popover, dropdown | `shadow.popover` | `color.surface.popover` + `shadow.popover` |
| **Modal** | Centered modal dialog | `shadow.modal` + scrim | `color.surface.popover` + `shadow.modal` + `color.surface.scrim` |
| **Toast** | Corner notification | `shadow.toast` | `color.surface.popover` + `shadow.toast` |
| **Overlay** | Heavy floating chrome (mood/theme switcher) | `shadow.floating` | `color.surface.popover` + `shadow.floating` |
| **Glass** | Floating shell with backdrop-filter | Lit edge + glass surface | `color.surface.glass` + `backdrop-filter: blur(20px) saturate(140%)` |

The hairline border + `shadow.card` (= `shadow.sm`) is the **default card recipe**. Reach for `shadow.lifted` only when the card is genuinely lifting (hover, dragged, selected).

---

## 5. The lit edge — glass without committing

The lit-edge trick is a v0.6 borrowed-from-glassmorphism gesture. A 1 px white inset on the top edge of a dark-surface wrapper reads as a glass-pane reflection — same atmospheric cue glassmorphism gives, without the GPU cost of `backdrop-filter: blur`.

```css
box-shadow: inset 0 1px 0 var(--lumen-paper-a06);
```

`var(--lumen-paper-a06)` resolves to `rgba(255,255,255,0.06)`. On dark mode (the obsidian canvas), this paints a faint white glint at the top of the surface. On light mode, the equivalent ink-alpha would muddy the cream paper, so light-mode lit-edge is a no-op.

### Where lit edge applies

- **`.lumen-field`** inputs (v0.6) — the input shell renders with a subtle lit top edge so it reads as a slight pane above the page canvas.
- **Cards (optional)** — a card variant can apply `shadow.input.lit-edge` for the same atmospheric cue.
- **Glass surfaces** — `.lumen-glass` and `.lumen-glass-strong` utilities apply both the lit edge AND `backdrop-filter`.

> [!note]
> Per [CHANGELOG v0.6](../../CHANGELOG.md): "Lit-edge inset on dark mode steals the glassmorphism 'glass-pane reflection' trick." The trick is acknowledged as borrowed; the choice not to commit to full backdrop-filter is deliberate (see §8).

---

## 6. The accent glow — Warp's signature

The primary-CTA green-glow is Lumen's most recognizable lighting gesture. v0.11 — re-anchored to spring green:

```
shadow.accent-glow = 0 14px 34px rgba(0,250,138,0.24)
```

Token path: `shadow.accent-glow` (primitive) and `shadow.accent-glow` (semantic alias). v0.11.13 — both now reference `{color.alpha.accent.24}` directly so the colour cascades from the accent ramp; pre-v0.11.13 the colour was inlined as the v0.4 lime literal `rgba(74,222,128,0.24)`, creating a master-child drift between the brand recolor and the shadow source. Opacity `0.24` is preserved verbatim from the v0.4 lime era — it reads with the same atmospheric weight on the new hue. Y-offset `14px` and blur `34px` are the Warp values, **unchanged across versions**.

### When to apply

- Primary CTA on hero sections.
- Primary CTA above-the-fold on landing pages.
- The `Button` `glow` boolean (added v0.4) opts in.

### When NOT to apply

- Secondary or tertiary buttons. The glow signals "primary action." Diluting it dilutes the brand.
- Operator-dashboard surfaces below the fold. The glow is for marketing impact.
- Cards, modals, popovers. The glow is CTA-only.

The `Card` primitive's `glow` elevation (added v0.4) is a related-but-distinct treatment — a softer ambient lime glow on hero cards. It uses the aurora token (`color.aurora.color`), not `shadow.accent-glow`.

---

## 7. The focus shadow — lime ring

The focus ring is a single recipe across the system. Per [`accessibility.md`](./accessibility.md) §Hard floor:

```
shadow.focus = 0 0 0 3px rgba(0,250,138,0.32)
```

The recipe is:
- **3 px spread** — visible-focus minimum per WCAG 2.4.13.
- **0 px blur** — sharp ring, not a halo. Reads as a deliberate state, not ambient glow.
- **0 px offset** — sits flush against the control border.
- **`color.alpha.accent.32`** — 32% spring green (v0.11; was 32% lime pre-v0.11). Distinct enough on paper canvas and obsidian-mint alike.

Per the `:focus-visible` rule in `audit-dashboard/src/app/globals.css`, this shadow is painted on every focusable control by default. The `.lumen-field` wrapper (v0.6) overrides this — the wrapper paints the ring, and the inner `<input>` suppresses its own. See [`forms-and-inputs.md`](./forms-and-inputs.md) §Focus model.

> [!warning]
> Per [CHANGELOG v0.6](../../CHANGELOG.md): "`--shadow-focus` reconciled. Was `0 0 0 3.5px var(--lumen-lime-a40)` in CSS while `shadow.focus` token JSON declared `0 0 0 3px lime-a32`. Both now agree on `0 0 0 3px var(--lumen-lime-a32)`." The values are now consistent across web / iOS / Android / Liquid via Style Dictionary.

---

## 8. Dark mode considerations

> [!note]
> Per [`color.md`](./color.md) §3: "Dark and light modes are designed in parallel, not 'dark = light inverted.'" The same applies to elevation.

On dark mode (obsidian canvas):
- **Shadows are subtler.** A black-on-black shadow has nowhere to read against. `shadow.sm` and `shadow.md` use the same primitive recipe in both modes; the visual effect on dark is intentionally quieter.
- **Lit edge does the lifting.** The 1 px white inset on dark surfaces is what separates a card from the page when the shadow is barely visible.
- **Hairlines flip from ink-alpha to paper-alpha.** `color.alpha.ink.06` (light) becomes `color.alpha.paper.06` (dark). Same opacity step, opposite color.
- **The accent glow stays the same across modes.** `rgba(0,250,138,0.24)` reads identically on paper and obsidian-mint — spring green is a luminous color and carries its own visibility. (v0.11 retuned the hue from lime to spring green; the opacity and recipe are preserved verbatim.)
- **Focus ring stays the same across modes.** Spring green at 32% reads on both canvases.

The `audit-dashboard/src/app/globals.css` semantic shadow definitions make this concrete: `--shadow-card-dark` etc. are explicit overrides, not `1 - light`.

---

## 9. Performance — what's cheap, what's expensive

| Property | Cost | Notes |
|---|---|---|
| `border` | Free | Layout-time only. Unlimited. |
| `box-shadow` (single) | Cheap | GPU-accelerated. Multiple per surface OK. |
| `box-shadow` (multi-stop) | Cheap | Lumen's two-stop tiers are fine. |
| `inset` `box-shadow` | Cheap | Same cost as outer. The lit-edge is essentially free. |
| `backdrop-filter: blur` | **Expensive** | Triggers a render-tree readback. Avoid in dashboards. Use sparingly on marketing. |
| `filter: blur` | **Expensive** | Same cost as backdrop-filter. |

> [!warning]
> Per the v0.6 architecture decisions, `backdrop-filter` is **banned in operator dashboards**. The data-density of the shipments table + 10 popovers + a sticky header would compound to noticeable jank on mid-tier hardware. The lit-edge trick (§5) is the dashboard-safe substitute.

The `.lumen-glass` and `.lumen-glass-strong` utilities use `backdrop-filter` and are reserved for floating chrome (mood switcher pill, marketing hero). They are not a default surface treatment.

---

## 10. Don'ts

- **Don't add a shadow when a hairline does the job.** Per [`principles.md`](./principles.md) §1. Hairline first.
- **Don't ship neumorphism.** Per [`principles.md`](./principles.md) §What to avoid: "Heavy drop shadows on cards, 'soft UI' pillows." No double-inset, no extruded buttons, no soft-glow lift.
- **Don't ship glassmorphism stacks.** A glass card on a glass card on glass is haze. Use lit edge for the cue without the cost.
- **Don't apply `shadow.accent-glow` to secondary buttons.** It signals primary action. Diluting dilutes the brand.
- **Don't use `backdrop-filter` in operator dashboards.** Per §9. Performance regression on data-dense surfaces.
- **Don't reach for `shadow.2xl` for cards.** The `2xl` tier is for heavy floating overlays. A card with `shadow.2xl` looks broken.
- **Don't paint focus on the inner element of a `.lumen-field`.** The wrapper paints the ring. See [`forms-and-inputs.md`](./forms-and-inputs.md) §Focus model.
- **Don't invert shadow opacity on dark mode.** Same recipe, intentionally quieter. Lit edge fills the gap.
- **Don't soften `shadow.accent-glow`.** Verbatim from Warp production. Softening requires an ADR.

---

## References

- [`principles.md`](./principles.md) — §1 (less, but better — hairline before shadow), §What to avoid (no neumorphism, no glassmorphism stacks)
- [`color.md`](./color.md) — §3 (light + dark parity), §5 (accent glow), §9 (aurora)
- [`forms-and-inputs.md`](./forms-and-inputs.md) — §Focus model (single ring on shell), `shadow.input.*` recipes
- [`accessibility.md`](./accessibility.md) — visible focus requirement, WCAG 2.4.13
- [`motion-language.md`](./motion-language.md) — `box-shadow` transition timing, hover-lift recipe
- [`01-tokens/primitives/elevation.tokens.json`](../01-tokens/primitives/elevation.tokens.json) — primitive shadow ladder + accent-glow + inset
- [`01-tokens/semantic/shadow.tokens.json`](../01-tokens/semantic/shadow.tokens.json) — surface-bound aliases (card, popover, modal, toast) + focus + input.*
- [`CHANGELOG.md`](../../CHANGELOG.md) — v0.4 (accent glow shipped, frame brutalist, aurora), v0.6 (lit edge, input shadow namespace, focus reconciliation)
- [`research/lumen-brief.md`](../../research/lumen-brief.md) — D-004 (hairlines do separation work)
- [`research/warp-brand-dna.md`](../../research/warp-brand-dna.md) — observed accent-glow recipe
