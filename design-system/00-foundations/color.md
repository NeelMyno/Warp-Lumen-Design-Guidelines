---
name: Color
type: foundation
version: 2.0.0
last_updated: 2026-05-04
audience: [designer, engineer, llm-agent]
related:
  - ./principles.md
  - ./typography.md
  - ./accessibility.md
  - ./forms-and-inputs.md
  - ./elevation.md
  - ./hierarchy.md
  - ./first-impression.md
  - ./micro-interactions.md
  - ../01-tokens/primitives/color.tokens.json
  - ../01-tokens/semantic/color.light.tokens.json
  - ../01-tokens/semantic/color.dark.tokens.json
  - ../../_meta/decisions/0004-quiet-industrial-mood.md
  - ../../_meta/decisions/0005-warp-green-as-only-accent.md
  - ../../_meta/decisions/0018-premium-psychology-recolor.md
---

# Lumen Color

> Color in Lumen is a contract, not a palette. There is one loud color (`color.accent.500` = `#00FA8A`), one ink (`color.brand.800` = `#171A18`), one paper (`color.neutral.50` = `#FAFAFA`), and a single neutral grayscale ladder anchored at `#E6E6E6`. Everything else is hairlines and atmosphere. Status meaning never lives only in hue. Light and dark are designed in parallel, not "dark = light inverted."

> [!note]
> **v0.11 — Premium Psychology recolor.** The accent shifted from Warp lime `#4ade80` to Spring Green `#00FA8A`. The dark canvas shifted from obsidian `#0a0a0d` to obsidian-mint `#171A18`. The cream paper canvas was retired in favor of cool-neutral paper `#FAFAFA` with `#E6E6E6` as the sunken / subtle-border anchor. The single-accent rule and the parallel-modes rule are preserved verbatim — only hues changed. See [ADR 0018](../../_meta/decisions/0018-premium-psychology-recolor.md).

This is the canonical reference. Primitive ramps live in [`01-tokens/primitives/color.tokens.json`](../01-tokens/primitives/color.tokens.json). Semantic aliases live in [`01-tokens/semantic/color.light.tokens.json`](../01-tokens/semantic/color.light.tokens.json) and [`01-tokens/semantic/color.dark.tokens.json`](../01-tokens/semantic/color.dark.tokens.json).

---

## 1. The four-color floor

Premium isn't ten colors used carefully. It's four colors used confidently. Lumen's entire visual system rises from four anchor values:

| Role | Token | Value | What it does |
|---|---|---|---|
| **Accent** | `color.accent.500` | `#00FA8A` | The single loud color. Action, live, success. Never decorates. |
| **Ink (dark canvas)** | `color.brand.800` | `#171A18` | The obsidian-mint canvas. Dark-mode page, inverse surfaces in light mode. |
| **Soft light (sunken / border)** | `color.neutral.200` | `#E6E6E6` | The user-fixed light value. Subtle borders, sunken surfaces, sidebar. |
| **Paper (light canvas)** | `color.neutral.50` | `#FAFAFA` | The light-mode page canvas. Clean off-white with a whisper of warmth. |

These four sit at the top of the cascade. Every other color in the system (ramps, alphas, status hues, semantic surfaces) is derived to harmonize with them. **Restraint is the brand.**

> [!tip]
> Per [`principles.md`](./principles.md) §2 and the premium-psychology brief: *what you leave out is louder than what you put in*. If you're tempted to add a fifth loud color, the answer is almost always "use hierarchy instead of a new hue."

---

## 2. Three-layer architecture

Lumen color follows the system-wide token taxonomy: **primitives → semantic → component-bound**. Per [AGENTS.md](../../AGENTS.md) hard rule #2, engineers and LLMs **never** consume primitives directly.

### Primitive ladders (mode-agnostic)

Defined in [`primitives/color.tokens.json`](../01-tokens/primitives/color.tokens.json). Five ramps:

| Ramp | Path | Role |
|---|---|---|
| **Obsidian-Mint** | `color.brand.50–950` | Dark-canvas ladder. Faint green undertone (G channel +2 over R) so it reads cohesive against the spring-green accent. Anchored at `brand.800` = `#171A18`. |
| **Neutral** | `color.neutral.50–900` | Cool-neutral grays. Light-mode canvas + neutral text on dark. Anchored at `neutral.200` = `#E6E6E6`. |
| **Spring Green** | `color.accent.50–900` + `accent.fg` | The only loud color. `500` is the brand value `#00FA8A`. |
| **Status** | `color.status.{success,warning,danger,info}.*` | Status palette — paired with glyph, never color-alone. Success rides Spring Green. |
| **Alpha** | `color.alpha.{ink,paper,accent,danger,warning}.*` | Translucent overlays for scrims, halos, glass tint. Ink alphas re-anchored to `#171A18`. Accent alphas re-anchored to `#00FA8A`. |

> [!note]
> **`color.warm.*` is deprecated as of v0.11.** It now resolves through to `color.neutral.*` for backwards compatibility. New code uses `color.neutral.*`. Removal is queued for v1.0.

### Semantic roles (mode-aware)

Defined in [`semantic/color.light.tokens.json`](../01-tokens/semantic/color.light.tokens.json) and [`semantic/color.dark.tokens.json`](../01-tokens/semantic/color.dark.tokens.json). Same key paths in both files; values diverge per mode.

| Role family | Examples | Purpose |
|---|---|---|
| **Surface** | `color.surface.page`, `color.surface.raised`, `color.surface.sunken`, `color.surface.popover`, `color.surface.glass`, `color.surface.overlay`, `color.surface.scrim`, `color.surface.inverse`, `color.surface.tint-accent`, `color.surface.input.{rest,hover,focus,readOnly,disabled}` | Background paint per surface tier |
| **Text** | `color.text.primary`, `color.text.secondary`, `color.text.tertiary`, `color.text.placeholder`, `color.text.disabled`, `color.text.inverse`, `color.text.accent`, `color.text.{error,success,warning}`, `color.text.link` | Foreground type per role |
| **Border** | `color.border.hairline`, `color.border.subtle`, `color.border.default`, `color.border.strong`, `color.border.frame`, `color.border.accent`, `color.border.focus`, `color.border.{error,success,warning,disabled}` | Stroke per surface separation tier |
| **Action** | `color.action.{primary,secondary,tertiary,ghost,outline,danger,danger-soft,ai,success,selected,glass}.bg.{rest,hover,press}`, `.fg`, `.border`, `.glow` | Button / interactive chrome |
| **Status** | `color.status.{success,warning,danger,info}.{bg,fg}` | Status badge / inline indicator |
| **Aurora** | `color.aurora.{color,core}` | Radial spring-green ambient glow — brand signature lighting gesture |

### Component-bound (only when needed)

Per-component tokens in `01-tokens/components/`. Used only when a semantic role doesn't fit cleanly. Example: `field.tokens.json` declares input-shell shadows and per-state foreground roles that don't generalize beyond inputs.

---

## 3. Light and dark — parallel, not inverted

> [!warning]
> Per [`principles.md`](./principles.md) §3: "Dark and light modes are designed in parallel, not 'dark = light inverted.'" Inverting a light theme produces washed grays and blown-out spring green. Lumen ships two themes, each tuned for its canvas.

### Light mode — paper-clean

| Surface | Token | Value | Notes |
|---|---|---|---|
| Page canvas | `color.surface.page` | `{color.neutral.50}` = `#FAFAFA` | Paper-clean off-white. Not pure white — pure white reads sterile under premium hierarchy. |
| Raised | `color.surface.raised` | `#FFFFFF` | Cards, panels. Pops above paper with a 1 px hairline. |
| Sunken | `color.surface.sunken` | `{color.neutral.200}` = `#E6E6E6` | Inputs, table-row hover, sidebar. The user-fixed light anchor. |
| Popover | `color.surface.popover` | `#FFFFFF` | Floating popover surface. |
| Glass | `color.surface.glass` | `rgba(255,255,255,0.72)` | Pair with `backdrop-filter: blur(20px) saturate(140%)` |

Primary text is `color.text.primary` = `{color.neutral.900}` = `#141615` on paper canvas. Contrast 17.2:1 — AAA.

### Dark mode — obsidian-mint

| Surface | Token | Value | Notes |
|---|---|---|---|
| Page canvas | `color.surface.page` | `{color.brand.800}` = `#171A18` | Obsidian-mint canvas. The user-fixed brand dark. |
| Raised | `color.surface.raised` | `{color.brand.700}` = `#21241F` | Cards, panels. Sits a hair above canvas with a faint warm-green tilt. |
| Sunken | `color.surface.sunken` | `{color.brand.900}` = `#0E110F` | Scrim base, deep wells. |
| Popover | `color.surface.popover` | `{color.brand.600}` = `#2E3230` | Floating popover surface. |
| Glass | `color.surface.glass` | `rgba(23,26,24,0.62)` | Pair with `backdrop-filter: blur(20px) saturate(140%)` |

Primary text is `color.text.primary` = `{color.brand.100}` = `#E6E6E6` on canvas. Contrast 13.7:1 — AAA. **Not pure white.** Per the premium-psychology brief: pure white on dark canvas is harsh and fatigues the eye on long-scroll pages. The user-fixed light value `#E6E6E6` is calmer, more readable, and pairs cohesively with the canvas (the same hue, gently lifted).

### Mode parity contract

The semantic key paths in `color.light.tokens.json` and `color.dark.tokens.json` are **identical**. A consumer asking for `color.surface.raised` resolves correctly in either mode without conditional logic. New tokens added to one file MUST be added to the other in the same PR.

---

## 4. The Spring Green — single-role discipline

Per [AGENTS.md](../../AGENTS.md) hard rule #7 and [ADR 0005](../../_meta/decisions/0005-warp-green-as-only-accent.md):

> The accent (`color.accent.500` = `#00FA8A`) plays exactly ONE role: action / live / success. Never decorative. Never as a second accent. Never on non-action chrome. Adding a second loud color to the system is a brand violation.

The value `#00FA8A` is the **user-fixed brand value**. Do not soften it without an ADR. The v0.4–v0.10 lime `#4ade80` was retired in v0.11; the discipline carries over verbatim.

### Where Spring Green appears

- **Primary CTAs** — `color.action.primary.bg.rest` = `{color.accent.500}`. Hover `{color.accent.600}` = `#00D675`. Press `{color.accent.700}` = `#00B062`.
- **`LiveDot`** — the 8 px spring-green dot with 2 px pulsing ring. Per [`motion-language.md`](./motion-language.md) §5, this is the system's one signature recurring animation.
- **Success status** — `color.status.success.fg` resolves through the accent ramp on dark mode (`{color.accent.300}` = `#4DFFA8`).
- **Accent text** — `color.text.accent` for inline accent emphasis. Light mode uses `{color.accent.800}` = `#008A4D` for AA contrast (4.6:1 on paper). Dark mode uses `{color.accent.300}` = `#4DFFA8` for laser-bright on obsidian-mint.
- **Focus ring** — `color.border.focus` = `{color.accent.500}` (light) / `{color.accent.400}` = `#1AFF93` (dark). Always paired with `shadow.focus`.
- **Brand signature glow** — `shadow.accent-glow` (see §5).
- **One italic word per page** — the `display-italic-accent` typography preset renders in spring green per [`typography.md`](./typography.md) §7.

### Where Spring Green never appears

- Marketing decoration, gradient sweeps, hover feedback on non-action chrome.
- Charts (use shape + line style + label, never color alone — see §7).
- Illustrations, except when showing a "live" state.
- Two CTAs side-by-side in primary green. One primary; the rest are secondary or tertiary.

### The accent ramp

| Token | Value | Use |
|---|---|---|
| `color.accent.50` | `#E2FFF1` | Tint backgrounds (rare). |
| `color.accent.300` | `#4DFFA8` | Laser-bright on dark — text emphasis on obsidian-mint. |
| `color.accent.400` | `#1AFF93` | Dark-mode focus ring, hover lift on obsidian. |
| `color.accent.500` | `#00FA8A` | Brand value — Spring Green. The canonical Lumen accent. |
| `color.accent.600` | `#00D675` | Primary CTA hover state. |
| `color.accent.700` | `#00B062` | Primary CTA press state. |
| `color.accent.800` | `#008A4D` | Accent text on light surfaces. AA-safe at 4.6:1 on paper. |
| `color.accent.900` | `#003820` | Dense reading copy in accent on light. AAA on paper. |
| `color.accent.fg` | `#07120D` | Near-black-mint text on accent CTA backgrounds. 14.7:1 AAA on `#00FA8A`. |

> [!warning]
> The lint rule `no-decorative-accent` (per [ADR 0005](../../_meta/decisions/0005-warp-green-as-only-accent.md) §Enforcement) flags any use of `color.accent.*` outside `02-components/{button,live-dot,badge,toast,stat,rate-ticker}/`, status semantic tokens, or `shadow.accent-glow`. Suppression requires an ADR.

---

## 5. The accent glow — signature CTA shadow

The primary-CTA green-glow is Lumen's most recognizable lighting gesture. Re-anchored to `#00FA8A` in v0.11 — same opacity, new hue:

```
shadow.accent-glow = 0 14px 34px rgba(0,250,138,0.24)
```

Token path: `shadow.accent-glow` in [`primitives/elevation.tokens.json`](../01-tokens/primitives/elevation.tokens.json) and re-exposed semantically as `shadow.accent-glow` in [`semantic/shadow.tokens.json`](../01-tokens/semantic/shadow.tokens.json).

**When to apply.** Optional outer glow under a primary CTA on hero / above-the-fold surfaces — the engineered first impression (see [`first-impression.md`](./first-impression.md)). Apply via the `glow` boolean on `Button`. Do not apply to secondary or tertiary buttons.

**Why this opacity.** `0.24` is the historical Warp value, preserved verbatim across the v0.11 hue shift. The accent atmosphere reads with the same atmospheric weight on the new hue.

See [`elevation.md`](./elevation.md) §3 for the full shadow ladder and the lit-edge / aurora siblings.

---

## 6. Status palette — color is supplement, not signal

Per [`principles.md`](./principles.md) §3: status meaning never lives only in hue. Every status indicator pairs color with a label, glyph, or shape. Color-blind operators read Lumen by construction.

### The four status hues (v0.11 refined)

| Status | Primitive 500 | Light bg / fg | Dark bg / fg | Glyph |
|---|---|---|---|---|
| **Success** | `#00FA8A` (accent) | `#E2FFF1` / `#008A4D` | `#003820` / `#4DFFA8` | ✓ check or `LiveDot` |
| **Warning** | `#F5B118` (refined) | `#FFF8E5` / `#7A5408` | `#2A1D04` / `#F5DEA3` | ⚠ triangle |
| **Danger** | `#E5484D` (refined) | `#FDECEB` / `#B71D2A` | `#260C0E` / `#F8A8AA` | ✕ or alert circle |
| **Info** | `#757775` (neutral) | `#E2FFF1` / `#008A4D` | accent.alpha.12 / `#4DFFA8` | ⓘ info circle |

> [!note]
> **v0.11 refinement.** Danger desaturated 8% from v0.10 `#ef4444` to `#E5484D` — feels less "alert" and more "considered." Warning shifted from `#f59e0b` to `#F5B118` — more golden, slightly less saturated. The point is to harmonize with the cooler obsidian-mint canvas without losing AA contrast.

### Per-role tokens

Each status hue exposes a `bg` (50 / 900 alpha) and `fg` (700 / accent-ramp) pair via `color.status.{success,warning,danger,info}.{bg,fg}`. v0.6 added text + border + halo roles for inline form states:

- **Text** — `color.text.{error,success,warning}` for inline copy.
- **Border** — `color.border.{error,success,warning}` for input strokes.
- **Halo** — `shadow.input.{error,success}` for focus halos. Halo opacity matches `color.alpha.{accent,danger}.32`.

### Status-as-supplement rules

1. **Badges** ship with `leadingDot` by default for status variants (per `02-components/badge/`).
2. **Charts** use line style + marker shape + color, not color alone (per [`accessibility.md`](./accessibility.md) §Color-blind).
3. **Diff colors** pair `+ / −` glyphs with the green / red.
4. **Errors** pair red border + red halo + red text + alert icon (per [`forms-and-inputs.md`](./forms-and-inputs.md) §States).
5. **Disabled** uses muted bg + dim border + cursor change, not color alone.

---

## 7. Contrast — WCAG 2.2 AA floor

Per [AGENTS.md](../../AGENTS.md) hard rule #5 and [`accessibility.md`](./accessibility.md), WCAG 2.2 Level AA is the hard floor. Validated by [`scripts/check-contrast.mjs`](../../scripts/check-contrast.mjs) in CI.

### Documented contrast pairs (v0.11 verified)

These pairs are pre-validated. Use them by default; if you mix, validate via `pnpm run check-contrast`.

| Pair | Light mode | Dark mode | Threshold |
|---|---|---|---|
| `color.text.primary` on `color.surface.page` | 17.2:1 | 13.7:1 | 4.5:1 |
| `color.text.secondary` on `color.surface.page` | 10.5:1 | 6.4:1 | 4.5:1 |
| `color.text.tertiary` on `color.surface.page` | 5.4:1 | 3.6:1 (≥18px only) | 3.0:1 |
| `color.text.primary` on `color.surface.raised` | 17.5:1 (#FFF) | 13.0:1 | 4.5:1 |
| `color.action.primary.fg` on `color.action.primary.bg.rest` | 14.7:1 | 14.7:1 | 4.5:1 |
| `color.status.success.fg` on `color.status.success.bg` | 6.8:1 | 9.2:1 | 4.5:1 |
| `color.status.warning.fg` on `color.status.warning.bg` | 7.4:1 | 9.6:1 | 4.5:1 |
| `color.status.danger.fg` on `color.status.danger.bg` | 7.6:1 | 8.9:1 | 4.5:1 |
| `color.status.info.fg` on `color.status.info.bg` | 6.5:1 | 9.2:1 | 4.5:1 |
| `color.border.focus` on `color.surface.page` | 3.2:1 | 4.1:1 | 3.0:1 |

> [!warning]
> `color.text.tertiary` on dark is below 4.5:1 for sub-18px text. Use it only for ≥18px or for non-essential hint copy. For sub-18px secondary text, reach for `color.text.secondary`.

### When to push to AAA (7:1)

Per [`accessibility.md`](./accessibility.md) §When to raise the bar:
- Pages in the operator's daily workflow (shipments table, quote builder).
- Pages with destructive actions (delete, cancel, refund).
- Pages that handle money (checkout, billing, settlement).

---

## 8. Brand mood adaptation

The default mood is **Quiet Industrial — Obsidian Mint** (the v0.11 evolution of v0.4 obsidian-lime). The four documented moods modulate the canvas, not the rules. What changes:

| Concern | Quiet Industrial — Obsidian Mint (default) | Soft Luminous | Mono Editorial | Premium Glass |
|---|---|---|---|---|
| Light surface | Paper-clean `#FAFAFA` | Off-white, gradients | Pure paper white | iOS-vibrancy off-white |
| Dark surface | Obsidian-mint `#171A18` | n/a (light-only) | Pure ink black | iOS-vibrancy charcoal |
| Surface count | Page / raised / sunken / popover | + 6 desaturated category surfaces | Page / paper-only | + glass / vibrancy layers |
| Aurora glow | Radial spring-green, default on | Off | Off | Optional |
| Glass / `backdrop-filter` | Sparing — used for floating chrome only | Off | Off | Heavy — iOS-native default |
| Accent | `#00FA8A` verbatim | `#00FA8A` verbatim | `#00FA8A` verbatim, used even more sparingly | `#00FA8A` verbatim |

> [!warning]
> The accent rule is **immutable across all moods**. Spring Green is `#00FA8A`, plays one role, never decorates. Per [ADR 0005](../../_meta/decisions/0005-warp-green-as-only-accent.md) carried into v0.11: "Diluting the green dilutes the brand."

---

## 9. Aurora — the radial spring-green glow

The aurora is the v0.4 brand-signature lighting gesture, re-anchored to spring green in v0.11: a radial accent ambient glow rendered as a fixed/absolute pseudo-element behind hero content. Pair with `backdrop-filter: blur` for atmosphere.

| Token | Light mode | Dark mode | Use |
|---|---|---|---|
| `color.aurora.color` | `{color.alpha.accent.24}` | `{color.alpha.accent.32}` | Outer falloff |
| `color.aurora.core` | `{color.alpha.accent.40}` | `{color.alpha.accent.64}` | Hot core |

Light mode is softer (paper canvas carries less contrast headroom). Dark mode is the hero canvas; the aurora can run hotter without blowing out.

The `.lumen-aurora` utility in `audit-dashboard/src/app/globals.css` honors `prefers-reduced-motion` and degrades to a static gradient when the user opts out.

---

## 10. Don'ts

These are not stylistic preferences. They are violations of the system's contracts.

- **Don't add a second loud color.** Per [ADR 0005](../../_meta/decisions/0005-warp-green-as-only-accent.md), this is a brand violation. The lint rule `no-decorative-accent` and a deliberate "no-second-loud-accent" review gate enforce this.
- **Don't decorate with spring green.** Marketing gradients, hover feedback on non-action chrome, decorative dividers, "fun" accent moments all dilute the action / live / success contract.
- **Don't use color as the sole signal of meaning.** Per [`principles.md`](./principles.md) §3 and [`accessibility.md`](./accessibility.md) §Color-blind. Always pair with glyph, label, or shape.
- **Don't invert the light theme to make a dark theme.** Both modes are designed in parallel. Inversion produces washed grays and blown-out spring green.
- **Don't reach into primitives from product code.** Per [AGENTS.md](../../AGENTS.md) hard rule #2. `color.neutral.50` is a primitive; `color.surface.page` is the semantic alias. Lint enforces.
- **Don't soften `#00FA8A`.** It's the user-fixed brand value. Per [ADR 0018](../../_meta/decisions/0018-premium-psychology-recolor.md), softening requires an ADR.
- **Don't paint pure white on the dark canvas for body text.** Use `color.text.primary` = `{color.brand.100}` = `#E6E6E6`. Pure white fatigues the eye and feels cheap on long-scroll pages — the opposite of the calm-confidence signal premium readers expect.
- **Don't use sky-blue for info.** Dropped in v0.4 — info now rides the neutral + accent spectrum.
- **Don't paint a navy dark mode.** Dropped in v0.4 — the dark canvas is obsidian-mint (warm-cool near-black).
- **Don't stack decorative gradients.** Per [`principles.md`](./principles.md) §1: "No decorative gradients."
- **Don't reach for `color.warm.*` in new code.** Deprecated in v0.11 — use `color.neutral.*`. The alias resolves correctly until v1.0 removal but new uses fail review.

---

## References

- [`principles.md`](./principles.md) — §1 (less, but better), §3 (color is supplement, not signal)
- [`hierarchy.md`](./hierarchy.md) — aggressive hierarchy / single focal point per section (v0.11 new)
- [`first-impression.md`](./first-impression.md) — the engineered 50ms (v0.11 new)
- [`micro-interactions.md`](./micro-interactions.md) — peak-end rule (v0.11 new)
- [`accessibility.md`](./accessibility.md) — WCAG contrast pairs, color-blind rules
- [`elevation.md`](./elevation.md) — accent glow, aurora glow, lit edge
- [`typography.md`](./typography.md) — `text-accent`, `display-italic-accent` preset
- [`forms-and-inputs.md`](./forms-and-inputs.md) — input state colors (error / success / warning / disabled)
- [`01-tokens/primitives/color.tokens.json`](../01-tokens/primitives/color.tokens.json) — five primitive ramps
- [`01-tokens/semantic/color.light.tokens.json`](../01-tokens/semantic/color.light.tokens.json) — light-mode semantic roles
- [`01-tokens/semantic/color.dark.tokens.json`](../01-tokens/semantic/color.dark.tokens.json) — dark-mode semantic roles
- [`scripts/check-contrast.mjs`](../../scripts/check-contrast.mjs) — WCAG validator, CI-enforced
- [ADR 0004 — Default mood: Quiet Industrial](../../_meta/decisions/0004-quiet-industrial-mood.md)
- [ADR 0005 — Warp green is the system's only loud accent](../../_meta/decisions/0005-warp-green-as-only-accent.md)
- [ADR 0018 — v0.11 Premium Psychology recolor](../../_meta/decisions/0018-premium-psychology-recolor.md)
- [`research/lumen-brief.md`](../../research/lumen-brief.md) — D-002 (color decision)
- [`CHANGELOG.md`](../../CHANGELOG.md) — v0.4 (Obsidian Lime), v0.11 (Premium Psychology)
