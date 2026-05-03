---
name: Color
type: foundation
version: 1.0.0
last_updated: 2026-05-03
audience: [designer, engineer, llm-agent]
related:
  - ./principles.md
  - ./typography.md
  - ./accessibility.md
  - ./forms-and-inputs.md
  - ./elevation.md
  - ../01-tokens/primitives/color.tokens.json
  - ../01-tokens/semantic/color.light.tokens.json
  - ../01-tokens/semantic/color.dark.tokens.json
  - ../../_meta/decisions/0004-quiet-industrial-mood.md
  - ../../_meta/decisions/0005-warp-green-as-only-accent.md
---

# Lumen Color

> Color in Lumen is a contract, not a palette. There is one loud color (`color.accent.500` = `#4ade80`) and it plays one role. Everything else is paper, ink, and hairline. Status meaning never lives only in hue. Light and dark are designed in parallel, not "dark = light inverted."

This is the canonical reference. Primitive ramps live in [`01-tokens/primitives/color.tokens.json`](../01-tokens/primitives/color.tokens.json). Semantic aliases live in [`01-tokens/semantic/color.light.tokens.json`](../01-tokens/semantic/color.light.tokens.json) and [`01-tokens/semantic/color.dark.tokens.json`](../01-tokens/semantic/color.dark.tokens.json). The mood reasoning is in [ADR 0004](../../_meta/decisions/0004-quiet-industrial-mood.md). The lime-discipline reasoning is in [ADR 0005](../../_meta/decisions/0005-warp-green-as-only-accent.md).

---

## 1. Mood model

Lumen ships **four documented moods**, exposed in the audit dashboard's mood switcher. **Quiet Industrial** (Rams + Apple discipline rendered on Warp's actual material) is the default per [ADR 0004](../../_meta/decisions/0004-quiet-industrial-mood.md). The v0.4 release evolved this into the obsidian-lime expression — same discipline, sharper canvas.

| Mood | Default surface | Use |
|---|---|---|
| **Quiet Industrial** (default) | Cream paper light, obsidian dark | Operator dashboards, marketing, all default surfaces |
| **Soft Luminous** | Off-white, warm gradients, 6 desaturated categories | Editorial / blog / press surfaces |
| **Mono Editorial** | Ink + paper, signal red sparingly | Future "manifesto" / brand essay surfaces |
| **Premium Glass** | iOS-vibrancy, branded blue option | Mobile operator app candidate |

**The default mood does not change the accent.** Lime stays lime in all four moods. What changes is canvas warmth, secondary surface count, and how heavily glass / vibrancy is leaned on.

> [!note]
> Per [ADR 0004](../../_meta/decisions/0004-quiet-industrial-mood.md), the other three moods are **not eliminated**. They remain available as variant moods for specific surfaces. The accent rule (lime, one role) holds in every mood.

---

## 2. Three-layer architecture

Lumen color follows the system-wide token taxonomy: **primitives → semantic → component-bound**. Per [AGENTS.md](../../AGENTS.md) hard rule #2, engineers and LLMs **never** consume primitives directly.

### Primitive ladders (mode-agnostic)

Defined in [`primitives/color.tokens.json`](../01-tokens/primitives/color.tokens.json). Five ramps:

| Ramp | Path | Role |
|---|---|---|
| **Obsidian** | `color.brand.50–900` | Dark canvas ladder. Warm-leaning near-black; replaces the pre-v0.4 navy. |
| **Cream** | `color.warm.50–900` | Paper-warm neutrals. Light-mode canvas + warm tints on dark. |
| **Lime** | `color.accent.50–900` | The only loud color. `400` and `500` both anchor `#4ade80`. |
| **Status** | `color.status.{success,warning,danger,info}.{50,500,700,900}` | Status palette — paired with glyph, never color-alone. |
| **Alpha** | `color.alpha.{ink,paper,accent,danger,warning}.*` | Translucent overlays for scrims, halos, glass tint. |

### Semantic roles (mode-aware)

Defined in [`semantic/color.light.tokens.json`](../01-tokens/semantic/color.light.tokens.json) and [`semantic/color.dark.tokens.json`](../01-tokens/semantic/color.dark.tokens.json). Same key paths in both files; values diverge per mode. Roles:

| Role family | Examples | Purpose |
|---|---|---|
| **Surface** | `color.surface.page`, `color.surface.raised`, `color.surface.sunken`, `color.surface.popover`, `color.surface.glass`, `color.surface.overlay`, `color.surface.scrim`, `color.surface.inverse`, `color.surface.tint-accent`, `color.surface.input.{rest,hover,focus,readOnly,disabled}` | Background paint per surface tier |
| **Text** | `color.text.primary`, `color.text.secondary`, `color.text.tertiary`, `color.text.placeholder`, `color.text.disabled`, `color.text.inverse`, `color.text.accent`, `color.text.{error,success,warning}`, `color.text.link` | Foreground type per role |
| **Border** | `color.border.hairline`, `color.border.subtle`, `color.border.default`, `color.border.strong`, `color.border.frame`, `color.border.accent`, `color.border.focus`, `color.border.{error,success,warning,disabled}` | Stroke per surface separation tier |
| **Action** | `color.action.{primary,secondary,tertiary,danger}.bg.{rest,hover,press}`, `.fg`, `.border`, `.glow` | Button / interactive chrome |
| **Status** | `color.status.{success,warning,danger,info}.{bg,fg}` | Status badge / inline indicator |
| **Aurora** | `color.aurora.{color,core}` | Radial lime ambient glow — brand signature lighting gesture |

### Component-bound (only when needed)

Per-component tokens in `01-tokens/components/`. Used only when a semantic role doesn't fit cleanly. Example: `field.tokens.json` declares input-shell shadows and per-state foreground roles that don't generalize beyond inputs.

---

## 3. Light and dark — parallel, not inverted

> [!warning]
> Per [`principles.md`](./principles.md) §3: "Dark and light modes are designed in parallel, not 'dark = light inverted.'" Inverting a light theme produces washed grays and blown-out lime. Lumen ships two themes, each tuned for its canvas.

### Light mode — paper-warm white

| Surface | Token | Value | Notes |
|---|---|---|---|
| Page canvas | `color.surface.page` | `{color.warm.50}` = `#fdfcf7` | Cream paper. Not pure white. |
| Raised | `color.surface.raised` | `#ffffff` | Cards, panels. Pops above paper. |
| Sunken | `color.surface.sunken` | `{color.warm.100}` = `#f6f4ea` | Inputs, table-row hover, sidebar. |
| Popover | `color.surface.popover` | `#ffffff` | Floating popover surface. |
| Glass | `color.surface.glass` | `rgba(255,255,255,0.72)` | Pair with `backdrop-filter: blur(20px) saturate(140%)` |

Primary text is `color.text.primary` = `{color.brand.900}` = `#06060a` on cream paper. Contrast 14.6:1.

### Dark mode — obsidian (warm near-black, never navy)

| Surface | Token | Value | Notes |
|---|---|---|---|
| Page canvas | `color.surface.page` | `{color.brand.800}` = `#0a0a0d` | Obsidian canvas. |
| Raised | `color.surface.raised` | `{color.brand.700}` = `#14141a` | Cards, panels. |
| Sunken | `color.surface.sunken` | `{color.brand.900}` = `#06060a` | Scrim base, deep wells. |
| Popover | `color.surface.popover` | `{color.brand.600}` = `#1d1d24` | Floating popover surface. |
| Glass | `color.surface.glass` | `rgba(20,20,26,0.62)` | Pair with `backdrop-filter: blur(20px) saturate(140%)` |

Primary text is `color.text.primary` = `#f5f5f3` on obsidian. Contrast 14.1:1.

The brand ramp is **warm-leaning near-black**, not navy. Per [CHANGELOG v0.4](../../CHANGELOG.md), the pre-v0.4 navy ladder (`#131c2a → #1a2332 → #222d3e`) was retired in favor of obsidian. The dark-mode silhouette is the canvas the lime is designed against.

### Mode parity contract

The semantic key paths in `color.light.tokens.json` and `color.dark.tokens.json` are **identical**. A consumer asking for `color.surface.raised` resolves correctly in either mode without conditional logic. New tokens added to one file MUST be added to the other in the same PR.

---

## 4. The Warp lime — single-role discipline

Per [AGENTS.md](../../AGENTS.md) hard rule #7 and [ADR 0005](../../_meta/decisions/0005-warp-green-as-only-accent.md):

> The Warp lime green (`color.accent.500` = `#4ade80`) plays exactly ONE role: action / live / success. Never decorative. Never as a second accent. Never on non-action chrome. Adding a second loud color to the system is a brand violation.

The value `#4ade80` is **verbatim from Warp's production CSS** — used 788 times under the variable `--warp-accent`. Do not soften it without an ADR.

### Where lime appears

- **Primary CTAs** — `color.action.primary.bg.rest` = `{color.accent.500}`. Hover `{color.accent.600}` = `#34c977`. Press `{color.accent.700}` = `#22c55e`. (All three values verified from Warp production CSS.)
- **`LiveDot`** — the 8 px green dot with 2 px pulsing ring. Per [`motion-language.md`](./motion-language.md) §5, this is the system's one signature recurring animation.
- **Success status** — `color.status.success.fg` resolves through the lime ramp on dark mode (`{color.accent.300}` = `#82f5a3`).
- **Accent text** — `color.text.accent` for inline accent emphasis. Light mode uses `{color.accent.800}` = `#16a34a` for AA contrast on cream (4.7:1). Dark mode uses `{color.accent.300}` = `#82f5a3` for laser-lime on obsidian.
- **Focus ring** — `color.border.focus` = `{color.accent.500}` (light) / `{color.accent.400}` (dark). Always paired with `shadow.focus`.
- **Brand signature glow** — `shadow.accent-glow` (see §5).
- **One italic word per page** — the `display-italic-accent` typography preset renders in lime per [`typography.md`](./typography.md) §7.

### Where lime never appears

- Marketing decoration, gradient sweeps, hover feedback on non-action chrome.
- Charts (use shape + line style + label, never color alone — see §7).
- Illustrations, except when showing a "live" state.
- Two CTAs side-by-side in primary lime. One primary; the rest are secondary or tertiary.

### The accent ramp

| Token | Value | Use |
|---|---|---|
| `color.accent.50` | `#effff2` | Tint backgrounds (rare). |
| `color.accent.300` | `#82f5a3` | Laser-lime on dark — text emphasis on obsidian. |
| `color.accent.400` | `#4ade80` | Brand value — Warp `--warp-accent`. Same as 500. |
| `color.accent.500` | `#4ade80` | Brand value (canonical step). Used 788× in Warp CSS. |
| `color.accent.600` | `#34c977` | Primary CTA hover state. From Warp CSS. |
| `color.accent.700` | `#22c55e` | Primary CTA press state. Warp `--warp-success`. |
| `color.accent.800` | `#16a34a` | Accent text on light surfaces. AA-safe at 4.7:1 on white. |
| `color.accent.fg` | `#06120a` | Near-black-green text on accent CTA backgrounds. From Warp `--color-warp-green-dark`. |

> [!warning]
> The lint rule `no-decorative-accent` (per [ADR 0005](../../_meta/decisions/0005-warp-green-as-only-accent.md) §Enforcement) flags any use of `color.accent.*` outside `02-components/{button,live-dot,badge,toast,stat,rate-ticker}/`, status semantic tokens, or `shadow.accent-glow`. Suppression requires an ADR.

---

## 5. The accent glow — signature CTA shadow

The primary-CTA green-glow is Lumen's most recognizable lighting gesture. Defined verbatim from Warp production CSS:

```
shadow.accent-glow = 0 14px 34px rgba(74,222,128,0.24)
```

Token path: `shadow.accent-glow` in [`primitives/elevation.tokens.json`](../01-tokens/primitives/elevation.tokens.json) and re-exposed semantically as `shadow.accent-glow` in [`semantic/shadow.tokens.json`](../01-tokens/semantic/shadow.tokens.json).

**When to apply.** Optional outer glow under a primary CTA on hero / above-the-fold surfaces. Apply via the `glow` boolean on `Button` (added in v0.4). Do not apply to secondary or tertiary buttons.

**Why this opacity.** `0.24` is the Warp production value. `color.alpha.accent.24` exposes the same opacity for any surface that needs the green-glow tint without committing to the full shadow recipe.

See [`elevation.md`](./elevation.md) §3 for the full shadow ladder and the lit-edge / aurora siblings.

---

## 6. Status palette — color is supplement, not signal

Per [`principles.md`](./principles.md) §3: status meaning never lives only in hue. Every status indicator pairs color with a label, glyph, or shape. Color-blind operators read Lumen by construction.

### The four status hues

| Status | Primitive 500 | Light bg / fg | Dark bg / fg | Glyph |
|---|---|---|---|---|
| **Success** | `#22c55e` | `#ecfdf3` / `#166534` | `#11281c` / `#82f5a3` (lime ramp) | ✓ check or `LiveDot` |
| **Warning** | `#f59e0b` | `#fef6e1` / `#6b4a08` | `#2e2310` / `#f3d8a4` | ⚠ triangle |
| **Danger** | `#ef4444` | `#fde9e7` / `#7a1f1c` | `#2c130f` / `#f4c0bb` | ✕ or alert circle |
| **Info** | `#908668` (warm cream) | `#fdfcf7` / `#16a34a` | accent.alpha.12 / `#82f5a3` | ⓘ info circle |

> [!note]
> Per [CHANGELOG v0.4](../../CHANGELOG.md), info dropped sky-blue (`#38bdf8`) in v0.4 to honor the no-second-loud-color rule. Info now rides the warm-cream + lime spectrum instead.

### Per-role tokens

Each status hue exposes a `bg` (50 / 900 alpha) and `fg` (700 / lime-ramp) pair via `color.status.{success,warning,danger,info}.{bg,fg}`. v0.6 added text + border + halo roles for inline form states:

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

### Documented contrast pairs

These pairs are pre-validated. Use them by default; if you mix, validate via `pnpm run check-contrast`.

| Pair | Light mode | Dark mode | Threshold |
|---|---|---|---|
| `color.text.primary` on `color.surface.page` | 14.6:1 | 14.1:1 | 4.5:1 |
| `color.text.secondary` on `color.surface.page` | 7.4:1 | 6.8:1 | 4.5:1 |
| `color.text.tertiary` on `color.surface.page` | 4.6:1 (≥18px only) | 4.5:1 (≥18px only) | 3.0:1 |
| `color.text.primary` on `color.surface.raised` | 14.6:1 | 14.0:1 | 4.5:1 |
| `color.action.primary.fg` on `color.action.primary.bg.rest` | 11.2:1 | 11.2:1 | 4.5:1 |
| `color.status.success.fg` on `color.status.success.bg` | 6.7:1 | 8.4:1 | 4.5:1 |
| `color.status.warning.fg` on `color.status.warning.bg` | 7.1:1 | 9.2:1 | 4.5:1 |
| `color.status.danger.fg` on `color.status.danger.bg` | 7.4:1 | 9.0:1 | 4.5:1 |
| `color.status.info.fg` on `color.status.info.bg` | 7.0:1 | 7.6:1 | 4.5:1 |
| `color.border.focus` on `color.surface.page` | 3.4:1 | 3.6:1 | 3.0:1 |

> [!warning]
> `color.text.tertiary` is below 4.5:1 for sub-18px text. Use it only for ≥18px or for non-essential hint copy. For sub-18px secondary text, reach for `color.text.secondary`.

### When to push to AAA (7:1)

Per [`accessibility.md`](./accessibility.md) §When to raise the bar:
- Pages in the operator's daily workflow (shipments table, quote builder).
- Pages with destructive actions (delete, cancel, refund).
- Pages that handle money (checkout, billing, settlement).

---

## 8. Brand mood adaptation

The default mood is Quiet Industrial. The four documented moods modulate the canvas, not the rules. What changes:

| Concern | Quiet Industrial (default) | Soft Luminous | Mono Editorial | Premium Glass |
|---|---|---|---|---|
| Light surface | Cream paper `#fdfcf7` | Off-white, gradients | Pure paper white | iOS-vibrancy off-white |
| Dark surface | Obsidian `#0a0a0d` | n/a (light-only) | Pure ink black | iOS-vibrancy charcoal |
| Surface count | Page / raised / sunken / popover | + 6 desaturated category surfaces | Page / paper-only | + glass / vibrancy layers |
| Aurora glow | Radial lime, default on | Off | Off | Optional |
| Glass / `backdrop-filter` | Sparing — used for floating chrome only | Off | Off | Heavy — iOS-native default |
| Accent calibration | `#4ade80` verbatim | `#4ade80` verbatim | `#4ade80` verbatim, used even more sparingly | `#4ade80` verbatim |

> [!warning]
> The accent rule is **immutable across all moods**. Lime is `#4ade80`, plays one role, never decorates. Per [ADR 0005](../../_meta/decisions/0005-warp-green-as-only-accent.md): "Diluting the green dilutes the brand."

---

## 9. Aurora — the radial lime glow

The aurora is the v0.4 brand-signature lighting gesture: a radial lime ambient glow rendered as a fixed/absolute pseudo-element behind hero content. Pair with `backdrop-filter: blur` for atmosphere.

| Token | Light mode | Dark mode | Use |
|---|---|---|---|
| `color.aurora.color` | `{color.alpha.accent.24}` | `{color.alpha.accent.32}` | Outer falloff |
| `color.aurora.core` | `{color.alpha.accent.40}` | `{color.alpha.accent.64}` | Hot core |

Light mode is softer (cream paper carries less contrast headroom). Dark mode is the hero canvas; the aurora can run hotter without blowing out.

The `.lumen-aurora` utility in `audit-dashboard/src/app/globals.css` honors `prefers-reduced-motion` and degrades to a static gradient when the user opts out.

---

## 10. Don'ts

These are not stylistic preferences. They are violations of the system's contracts.

- **Don't add a second loud color.** Per [ADR 0005](../../_meta/decisions/0005-warp-green-as-only-accent.md), this is a brand violation. The lint rule `no-decorative-accent` and a deliberate "no-second-loud-accent" review gate enforce this.
- **Don't decorate with lime.** Marketing gradients, hover feedback on non-action chrome, decorative dividers, "fun" lime moments all dilute the action / live / success contract.
- **Don't use color as the sole signal of meaning.** Per [`principles.md`](./principles.md) §3 and [`accessibility.md`](./accessibility.md) §Color-blind. Always pair with glyph, label, or shape.
- **Don't invert the light theme to make a dark theme.** Both modes are designed in parallel. Inversion produces washed grays and blown-out lime.
- **Don't reach into primitives from product code.** Per [AGENTS.md](../../AGENTS.md) hard rule #2. `color.warm.50` is a primitive; `color.surface.page` is the semantic alias. Lint enforces.
- **Don't soften `#4ade80`.** It's verbatim from Warp production CSS. Per [ADR 0005](../../_meta/decisions/0005-warp-green-as-only-accent.md), softening requires an ADR.
- **Don't use sky-blue for info.** Dropped in v0.4 — info now rides the warm-cream + lime spectrum.
- **Don't paint a navy dark mode.** Dropped in v0.4 — the dark canvas is obsidian (warm near-black).
- **Don't stack decorative gradients.** Per [`principles.md`](./principles.md) §1: "No decorative gradients."

---

## References

- [`principles.md`](./principles.md) — §1 (less, but better), §3 (color is supplement, not signal)
- [`accessibility.md`](./accessibility.md) — WCAG contrast pairs, color-blind rules
- [`elevation.md`](./elevation.md) — accent glow, aurora glow, lit edge
- [`typography.md`](./typography.md) — `text-accent`, `display-italic-accent` preset
- [`forms-and-inputs.md`](./forms-and-inputs.md) — input state colors (error / success / warning / disabled)
- [`01-tokens/primitives/color.tokens.json`](../01-tokens/primitives/color.tokens.json) — five primitive ramps
- [`01-tokens/semantic/color.light.tokens.json`](../01-tokens/semantic/color.light.tokens.json) — light-mode semantic roles
- [`01-tokens/semantic/color.dark.tokens.json`](../01-tokens/semantic/color.dark.tokens.json) — dark-mode semantic roles
- [`scripts/check-contrast.mjs`](../../scripts/check-contrast.mjs) — WCAG validator, CI-enforced
- [ADR 0004 — Default mood: Quiet Industrial](../../_meta/decisions/0004-quiet-industrial-mood.md)
- [ADR 0005 — Warp lime green is the system's only loud accent](../../_meta/decisions/0005-warp-green-as-only-accent.md)
- [`research/lumen-brief.md`](../../research/lumen-brief.md) — D-002 (color decision)
- [`research/warp-brand-dna.md`](../../research/warp-brand-dna.md) — observed color system
- [`CHANGELOG.md`](../../CHANGELOG.md) — v0.4 (Obsidian Lime), v0.6 (text/border/halo state tokens)
