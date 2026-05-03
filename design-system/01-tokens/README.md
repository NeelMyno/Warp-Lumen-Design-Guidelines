# Tokens — Lumen

> **Critical for any LLM agent reading this:** Lumen has three layers of tokens. **Engineers and LLMs only consume the SEMANTIC layer.** Touching primitives directly is a violation enforced by lint. If you need a value that doesn't have a semantic alias, the answer is to add a semantic alias, not to import a primitive. When in doubt, use the matching `--surface-*` / `--text-*` / `--border-*` / `--space-*` / `--radius-*` / `--shadow-*` / `--motion-*` semantic.
>
> **v0.4 (Obsidian Lime)** retunes the dark canvas (no more navy), introduces glass surfaces, brutalist hairline frames, and a radial lime aurora as the ambient signature. The brand-green (`#4ade80`) is unchanged. See [`research/lumen-v04-direction.md`](../../research/lumen-v04-direction.md) for the full direction brief.

## Layers

```
primitives/        Raw values. Mode-agnostic. Hand-edited.
                   color.tokens.json, dimension.tokens.json,
                   typography.tokens.json, motion.tokens.json,
                   shadow.tokens.json, radius.tokens.json
                       │
                       ▼ (referenced by)
semantic/          Role-based. Mode-aware. Engineers/LLMs read FROM here.
                   color.light.tokens.json, color.dark.tokens.json,
                   color.hc-light.tokens.json, color.hc-dark.tokens.json,
                   space.tokens.json, type.tokens.json,
                   motion.tokens.json, radius.tokens.json
                       │
                       ▼ (referenced by)
components/        Component-bound. Optional — only when a component
                   has unusually-bound values that don't fit semantic.
                   button.tokens.json, card.tokens.json, input.tokens.json
```

## Format

All token files are [Design Tokens Community Group (DTCG) JSON format 2025.10](https://www.designtokens.org/tr/drafts/format/). Files use `.tokens.json`. Every token is `$value` + `$type` (+ optional `$description`, `$deprecated`, `$extensions`).

References use curly-brace syntax pointing to dot-paths:

```json
{ "$value": "{color.blue.500}" }
```

Composite types (`typography`, `shadow`, `border`, `gradient`, `transition`) bundle multiple sub-values into one token.

## Modes

`color.{mode}.tokens.json` files are **siblings**, not nested. The same key paths exist in each, with different `$value` references. Modes:

- `color.dark.tokens.json` — default dark (obsidian ramp — Lumen v0.4 default)
- `color.light.tokens.json` — default light (cream paper inverse)
- `color.hc-light.tokens.json` — high-contrast light (forced colors / WCAG AAA push)
- `color.hc-dark.tokens.json` — high-contrast dark

## Naming rules

Strict, consistent, predictable for LLMs. **Read these before editing.**

### Primitive layer
- Format: `<category>.<scale-or-name>.<step>`
- Examples: `color.blue.500`, `dimension.4`, `font.family.sans`, `motion.duration.180`
- No semantic meaning in the name. `color.green.400` does not say "use this for success."

### Semantic layer
- Format: `<category>.<role>.<modifier?>`
- Examples: `color.surface.default`, `color.text.subtle`, `space.stack.md`, `motion.transition.fast`
- Names must describe the role, not the value. **Never** `color.text.green-500`. Always `color.text.success`.
- Modes change `$value`, not key paths. `color.surface.default` is the same key in light and dark.

### Component layer
- Format: `<component>.<part>.<state?>.<property?>`
- Examples: `button.primary.background.rest`, `button.primary.background.hover`, `input.border.focus`
- Used only when semantic doesn't fit (e.g. `button.primary.background.rest` mixes color + accessibility logic that isn't worth a generic semantic).

## Lint rules (enforced in CI)

| Rule | What it catches |
|---|---|
| `no-primitive-in-component` | Component code references a `color.gray.*` or `dimension.*` primitive directly. Fix: use semantic alias. |
| `no-raw-color-in-component` | A hex / rgb / hsl literal appears in component code. Fix: add a semantic token. |
| `no-raw-dimension-in-component` | `padding: 13px` appears (not on the 4-base scale). Fix: use `space.*` semantic token. |
| `mode-key-parity` | A semantic token exists in `color.light` but not `color.dark`. Both modes must define every key. |
| `dtcg-strict` | `$value` and `$type` are present and well-formed; references resolve. |
| `wcag-contrast` | Any token pair declared as fg+bg in semantic must meet AA at the documented sizes. |
| `font-fallback-required` | Any `font.family.*` semantic must end with a generic family fallback. |

A failing token-lint blocks merge. Suppression requires an ADR in `_meta/decisions/`.

## Build outputs

`pnpm build` runs Style Dictionary v5 and writes:

```
_build/
├── css/tokens.css                   ← :root + [data-theme="dark"] CSS variables
├── tailwind/theme.css               ← Tailwind v4 @theme block
├── ts/tokens.ts                     ← TypeScript constants
├── ios/LumenTokens.swift            ← SwiftUI Color + Spacing extensions
├── android/colors.xml               ← Android resources
├── android/dimens.xml
├── compose/LumenTokens.kt           ← Jetpack Compose object
├── flutter/lumen_tokens.dart        ← Flutter class
├── liquid/css-variables.liquid      ← Shopify Liquid CSS snippet
└── json/tokens.flat.json            ← Universal flat JSON for any consumer
```

`_build/` is gitignored. CI publishes outputs to a `lumen-dist` repo (or CDN) so consumers pull built tokens without depending on the build chain.

## Quick reference for LLMs

If you are an AI coding agent and you need a token, here is the cheat sheet. Do not invent token names — use these.

### Surfaces (where things sit)
| Token | Use |
|---|---|
| `color.surface.page` | The canvas of a page |
| `color.surface.raised` | A card on the canvas |
| `color.surface.sunken` | An input bg, a row hover, a sidebar |
| `color.surface.popover` | A floating popover, dropdown, or menu surface |
| `color.surface.glass` | **v0.4** · floating shell — pair with `backdrop-filter: blur(20px) saturate(140%)` + a hairline border |
| `color.surface.overlay` | A translucent backdrop for sticky chrome |
| `color.surface.inverse` | Dark surface in light mode (or vice versa) for contrast moments |
| `color.surface.tint-accent` | **v0.4** · subtle lime tint for hover / selection backgrounds |

### Text
| Token | Use |
|---|---|
| `color.text.primary` | Body text and titles |
| `color.text.secondary` | Captions, descriptions, secondary metadata |
| `color.text.tertiary` | Hints, eyebrow labels, table column headers (≥18px or non-essential) |
| `color.text.disabled` | Disabled control text |
| `color.text.inverse` | Text on inverse surfaces |
| `color.text.accent` | Emphasis text matching the accent (use sparingly) |
| `color.text.link` | Hyperlinks (in Lumen this is `text.primary` with underline) |

### Borders
| Token | Use |
|---|---|
| `color.border.hairline` | **v0.4** · the canonical 1px hairline (cards, table rows) |
| `color.border.subtle` | A step softer — used on glass surfaces |
| `color.border.default` | Standard control border (inputs, buttons-secondary) |
| `color.border.strong` | Emphasis dividers, strong delineations |
| `color.border.frame` | **v0.4** · brutalist hairline frame around hero headlines |
| `color.border.accent` | **v0.4** · lime-tinted hairline for active states / hero CTAs |
| `color.border.focus` | Focus ring color (only used in `--shadow-focus`) |

### Action / accent
| Token | Use |
|---|---|
| `color.action.primary.bg` | The Warp green button background |
| `color.action.primary.fg` | Text on the green (near-black-green) |
| `color.action.primary.bg.hover` | Hover state |
| `color.action.primary.bg.press` | Pressed / active state |
| `color.action.primary.glow` | Optional outer glow under the button |

### Status
| Token | Use |
|---|---|
| `color.status.{success,warning,danger,info}.bg` | Badge / banner background |
| `color.status.{success,warning,danger,info}.fg` | Text on that bg |

### Spacing — semantic ladder
| Token | px | Use |
|---|---|---|
| `space.0` | 0 | No space |
| `space.1` | 4 | Tight inline gap (icon + text in a small button) |
| `space.2` | 8 | Default inline gap |
| `space.3` | 12 | Card internal padding (small) |
| `space.4` | 16 | Default card padding, body line-rhythm |
| `space.5` | 20 | Stack gap (paragraph rhythm) |
| `space.6` | 24 | Card section gap |
| `space.8` | 32 | Sub-section gap |
| `space.10` | 40 | Section gap (small) |
| `space.12` | 48 | Section gap (default) |
| `space.16` | 64 | Section gap (large) |
| `space.20` | 80 | Page section gap (marketing) |
| `space.24` | 96 | Hero spacing |
| `space.32` | 128 | Outer page padding (rare) |

### Radius (v0.4 retuned — slightly rounder against obsidian)
| Token | px | Use |
|---|---|---|
| `radius.xs` | 3 | Hairline accents |
| `radius.sm` | 6 | Small chips |
| `radius.md` | 8 | Inputs, buttons |
| `radius.lg` | 12 | Cards (default) |
| `radius.xl` | 16 | Cards (lifted) |
| `radius.2xl` | 20 | Glass surfaces |
| `radius.3xl` | 28 | Hero / marketing surfaces, modal sheets |
| `radius.4xl` | 36 | Brutalist hero frames |
| `radius.full` | 9999 | Pills, nav, primary CTAs, avatars, dots |

### Elevation
| Token | Use |
|---|---|
| `shadow.xs` | Subtle separation when border won't do |
| `shadow.sm` | Hover state on a card |
| `shadow.md` | Lifted card |
| `shadow.lg` | Popover, dropdown |
| `shadow.xl` | Modal, sheet |
| `shadow.2xl` | Floating action surface |
| `shadow.inset` | Inset feel for a pressed control |
| `shadow.focus` | The standard focus ring (not a real shadow, just the API surface) |
| `shadow.glass` | **v0.4** · inset highlight + soft drop for floating glass surfaces |
| `shadow.glow-accent` | **v0.4** · single-layer lime ambient under hero CTAs |
| `shadow.glow-accent-strong` | **v0.4** · 3-layer lime halo for the most prominent CTAs |

### v0.4 — aurora + voice
| Token | Use |
|---|---|
| `color.aurora.color` | The radial-glow rgba used by `.lumen-aurora` ambient lighting at hero |
| `color.aurora.core` | The hot-core rgba — slightly more saturated for inner edge of the radial gradient |
| `lumen-mono-cap` | (CSS utility) JetBrains Mono · uppercase · +0.16em tracking — the v0.4 system metadata voice |
| `lumen-frame-brutalist` | (CSS utility) 1px hairline frame around a single statement headline; no shadow |

### Motion
| Token | ms | Use |
|---|---|---|
| `motion.fast` | 120 | Hover / micro-feedback |
| `motion.base` | 180 | Default UI feedback |
| `motion.slow` | 260 | State changes |
| `motion.slower` | 400 | Page-level |
| `easing.standard` | curve | Default |
| `easing.decelerate` | curve | Entry / arriving |
| `easing.accelerate` | curve | Exit / leaving |
| `easing.emphasised` | curve | Reserved (slight overshoot) |

### Typography
| Token | px | Role |
|---|---|---|
| `type.display.xl` | 76 | Hero of marketing landing |
| `type.display.lg` | 49 | Section opener |
| `type.display.md` | 39 | Page title (marketing) |
| `type.heading.h1` | 31 | Page title (app) |
| `type.heading.h2` | 25 | Section header |
| `type.heading.h3` | 20 | Subsection |
| `type.body.lg` | 18 | Lead paragraph |
| `type.body.md` | 16 | Default body |
| `type.body.sm` | 14 | Secondary, table cells |
| `type.caption` | 13 | Metadata |
| `type.micro` | 12 | Eyebrow, badges |
| `type.label.sm` | 14 | UI labels (uppercase, widest tracking) |
| `type.code.inline` | 14 | Inline code |
| `type.code.block` | 13 | Code blocks |

## See also

- [System architecture research](../../research/system-architecture.md)
- [Lumen brief](../../research/lumen-brief.md)
- [Style Dictionary config](../../style-dictionary.config.ts)
