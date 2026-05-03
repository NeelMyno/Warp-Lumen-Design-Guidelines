# Tokens — Lumen

> **Critical for any LLM agent reading this:** Lumen has three layers of tokens. **Engineers and LLMs only consume the SEMANTIC layer.** Touching primitives directly is a violation enforced by lint. If you need a value that doesn't have a semantic alias, the answer is to add a semantic alias, not to import a primitive. When in doubt, use the matching `--surface-*` / `--text-*` / `--border-*` / `--space-*` / `--radius-*` / `--shadow-*` / `--motion-*` semantic.

## Layers

```
primitives/        Raw values. Mode-agnostic. Hand-edited.
                   color.tokens.json, dimension.tokens.json,
                   typography.tokens.json, motion.tokens.json,
                   elevation.tokens.json, radius.tokens.json
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

- `color.light.tokens.json` — default light
- `color.dark.tokens.json` — default dark (Warp navy ladder)
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
| `color.surface.overlay` | A floating popover or sticky header (translucent) |
| `color.surface.inverse` | Dark surface in light mode (or vice versa) for contrast moments |

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
| `color.border.subtle` | The default hairline (cards, table rows) |
| `color.border.default` | Standard control border (inputs, buttons-secondary) |
| `color.border.strong` | Emphasis dividers, strong delineations |
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

### Radius
| Token | px | Use |
|---|---|---|
| `radius.xs` | 2 | Hairline accents |
| `radius.sm` | 4 | Small chips |
| `radius.md` | 6 | Inputs, buttons |
| `radius.lg` | 10 | Cards (default) |
| `radius.xl` | 14 | Cards (lifted) |
| `radius.2xl` | 20 | Hero surfaces |
| `radius.3xl` | 28 | Marketing surfaces, modal sheets |
| `radius.full` | 9999 | Pills, dots, avatars |

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
