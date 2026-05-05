# USING-LUMEN.md — the comprehensive end-to-end guide

> **Single-source-of-truth document for everything Lumen.** If you read only one file in this repo, read this one. Built for AI coding agents (Claude Code, Cursor, Codex, Copilot, Devin, Warp Terminal AI) and the humans working alongside them. Comprehensive, vertically integrated, LLM-first. Status: v0.11.13 · 2026-05-05.

> [!note]
> **Repo orientation.** AGENTS.md is the universal hard-rules file (read first if you're an agent). CLAUDE.md is the Claude-specific addendum. README.md is the human-facing front door. **This file is the comprehensive end-to-end manual** — every system tier, every consumption surface, every governance rule, every compositional pattern, every anti-pattern, in one document. When this file conflicts with another, this file is wrong (raise an issue). When AGENTS.md or CLAUDE.md conflict with this file, those files win — they are normative; this file is the unified narrative.

---

## 0. How to read this document

**For AI agents:**
1. Read §1 (the system at a glance) to load the brand, tokens, and visual contract into working memory.
2. Skim §3 (foundations index) to know which deeper foundation to fetch when the user asks a foundation-level question.
3. Skim §4 (token chain) to understand the three-layer architecture you must respect.
4. Skim §5 (component catalog) to know what exists before generating a new primitive.
5. Skim §11 (anti-patterns) to know what NOT to do.
6. Re-read §10 (LLM contract) before writing any code.
7. Refer back to specific sections as work demands.

**For humans:**
1. Read §1 to confirm the visual mood matches the system you remember.
2. Read §2 to confirm the architectural model.
3. Use the table of contents below to jump to whatever's relevant.
4. Read §11 (anti-patterns) before reviewing any PR.

**Voice convention.** This document uses lowercase summaries with em-dashes — direct, technical, opinionated. Token paths in `code`. WCAG numbers as `4.5:1`. Hex values in title case (`#00FA8A`, not `#00fa8a`). Match this voice in any contributions.

---

## Table of contents

- [§1. The system at a glance](#1-the-system-at-a-glance)
- [§2. Architectural model — five tiers](#2-architectural-model--five-tiers)
- [§3. Foundations — the 14 unchangeables](#3-foundations--the-14-unchangeables)
- [§4. The token system — primitives → semantic → component](#4-the-token-system--primitives--semantic--component)
- [§5. Component catalog — all 35](#5-component-catalog--all-35)
- [§6. Platform consumption — all 9](#6-platform-consumption--all-9)
- [§7. Composition patterns — how to build with what's here](#7-composition-patterns--how-to-build-with-whats-here)
- [§8. Content rules — words, images, motion, icons](#8-content-rules--words-images-motion-icons)
- [§9. Build pipeline + governance](#9-build-pipeline--governance)
- [§10. The LLM contract — for AI coding agents](#10-the-llm-contract--for-ai-coding-agents)
- [§11. Anti-patterns — never do these](#11-anti-patterns--never-do-these)
- [§12. Quick-reference appendix](#12-quick-reference-appendix)

---

## 1. The system at a glance

```
Lumen v0.11.13 — Premium Psychology · Obsidian Mint
─────────────────────────────────────────────────────────────────────────
Brand
  Accent           #00FA8A  — Spring Green. Action / live / success only.
  Dark canvas      #171A18  — Obsidian Mint. Faint green undertone (G+2).
  Light anchor     #E6E6E6  — Neutral light. Also primary text on dark.
  Paper canvas     #FAFAFA  — Cool-neutral off-white. Light theme default.
  Accent foreground #07120D — Near-black mint on accent surface (14.7:1 AAA).

Typography
  Family           Satoshi (single typeface across UI / display / body / numerics / code / editorial)
  Scale            1.25 (Major Third) on 16px base, 11px → 128px floor-to-ceiling
  Default          Dark mode

Hierarchy
  Aggressive       One focal point per section. 1.5–2× weight gap to support tier.
  First impression Engineered for 50ms halo. Three questions answered (what / who / why).
  Micro-interactions Peak-end rule. Hover / focus / validation / success — short, decelerating.

Density
  Marketing        96px hero rhythm, breathes
  Operator         24px section rhythm, dense
  Both are first-class. Choose by surface, not by aesthetic preference.

Motion
  Default duration 120ms hover, 180ms base, 260ms slow, 400ms slower
  Default easing   cubic-bezier(0.2, 0, 0, 1) — decelerate, no bounce
  Reduced-motion   Honored everywhere. Animations replace; don't disappear.

Distribution
  Web              shadcn registry · npx shadcn add <registry>/<name>
  iOS              Swift Package · LumenTokens, LumenComponents
  Android          Compose · dev.warp:lumen-compose
  E-commerce       Shopify Liquid · BigCommerce Stencil · WooCommerce
  Native desktop   macOS / Windows
  Mobile RN        Expo + NativeWind

Tokens
  Format           DTCG JSON (W3C Design Tokens Community Group, format module 2025.10)
  Pipeline         Style Dictionary v5 → 9 platform outputs
  Count            887 tokens across 32 source files, 100% of references resolve

Components
  Count            35 in design-system/02-components/
  Contract         component.md (humans) + component.json (machines) + per-platform examples
  Validates        against design-system/02-components/_schema/component.schema.json

Status
  v0.11.13         DTCG inheritance audit pass · master→child token chain rewired
  License          Internal to Warp. Satoshi font is ITF-FFL (do not redistribute publicly).
```

**The two non-negotiables.**

1. **Spring Green plays exactly one role: action, live, or success.** Never decorative, never as a second accent, never on non-action chrome. Adding a second loud color is a brand violation. (See [ADR 0005](_meta/decisions/0005-warp-green-as-only-accent.md) and [ADR 0018](_meta/decisions/0018-premium-psychology-recolor.md).)

2. **WCAG 2.2 AA is the hard floor on every interactive surface.** Every focusable element ships visible focus, ≥ 4.5:1 normal text contrast, ≥ 3:1 large text contrast, keyboard reachability, accessible name. AAA where it doesn't add cost. (See [accessibility.md](design-system/00-foundations/accessibility.md).)

---

## 2. Architectural model — five tiers

Lumen is built as five concentric tiers. Each tier consumes only from the tier inside it; nothing skips a tier.

```
┌─────────────────────────────────────────────────────────────┐
│ Tier 5 — CONSUMER PRODUCTS                                  │
│   Warp's Next.js apps, iOS app, Shopify themes,             │
│   marketing sites, internal dashboards, etc.                │
│   ↑ pulls components + tokens via registry / SPM / npm      │
├─────────────────────────────────────────────────────────────┤
│ Tier 4 — PLATFORMS  (design-system/03-platforms/)           │
│   Per-platform consumption guides + adapter code            │
│   web-react · react-native · ios-native · android-native    │
│   desktop-mac · desktop-windows · shopify-liquid            │
│   bigcommerce-stencil · woo-wordpress                       │
│   ↑ consumes components + tokens                            │
├─────────────────────────────────────────────────────────────┤
│ Tier 3 — COMPONENTS  (design-system/02-components/)         │
│   35 components, each with .md + .json + per-platform        │
│   examples. Components consume only SEMANTIC tokens.         │
│   ↑ consumes semantic tokens (and component-bound tokens)    │
├─────────────────────────────────────────────────────────────┤
│ Tier 2 — TOKENS  (design-system/01-tokens/)                  │
│   Three sub-tiers: primitives → semantic → component         │
│   DTCG JSON. Style Dictionary builds 9 platform outputs.    │
│   ↑ tokens carry the design intent into machines             │
├─────────────────────────────────────────────────────────────┤
│ Tier 1 — FOUNDATIONS  (design-system/00-foundations/)        │
│   14 docs. Principles, color, typography, spacing, motion,  │
│   elevation, hierarchy, first impression, micro-interactions,│
│   accessibility, density, buttons, forms-and-inputs,         │
│   voice-and-tone. The "why" behind every token.              │
│   ↑ foundations are the human-readable design intent         │
└─────────────────────────────────────────────────────────────┘
```

**The skip-no-tiers rule.** A component must reference semantic tokens, never primitives. A platform must reference components + semantic tokens, never primitives. A consumer product pulls from the platform tier and never reaches into Lumen's source. This is the master→child contract that keeps the system coherent: change one foundation principle → tokens cascade → components cascade → platforms cascade → consumers cascade. Skip a tier and you create a sibling, not a child. (See [v0.11.13 CHANGELOG entry](CHANGELOG.md) for the most recent case where this was enforced.)

**What lives where.**

| Need | Path |
|---|---|
| Why a decision was made | `research/` (brand DNA, brief, inspiration) and `_meta/decisions/` (ADRs 0001–0018) |
| The visual / interaction principle | `design-system/00-foundations/{topic}.md` |
| The machine-readable token | `design-system/01-tokens/{primitives,semantic,components}/{name}.tokens.json` |
| The component contract | `design-system/02-components/{name}/component.json` (machine) + `component.md` (human) |
| A working code example | `design-system/02-components/{name}/examples/{platform}.{ext}` OR `audit-dashboard/src/...` |
| The platform consumption guide | `design-system/03-platforms/{platform}/README.md` |
| Image / motion / microcopy rules | `design-system/04-content/{topic}.md` |
| Reusable LLM workflow | `_meta/prompts/{workflow}.md` |
| Term disambiguation | `_meta/glossary.json` |
| Build script | `scripts/{name}.mjs` |
| Reference implementation | `audit-dashboard/` (Next.js 16, every primitive across 8 templates) |

---

## 3. Foundations — the 14 unchangeables

Each foundation is a substantive Markdown doc (10–25KB). When you need the deep "why" or the comprehensive recipe, open the file. This section is a navigator + one-line summary per foundation.

| Foundation | One-line summary | When to open |
|---|---|---|
| [principles.md](design-system/00-foundations/principles.md) | The seven operating principles (v0.11 grew from 5 to 7 to encode 50ms halo, cognitive fluency, peak-end rule). | Before designing any new surface or reviewing any PR. |
| [hierarchy.md](design-system/00-foundations/hierarchy.md) | Aggressive hierarchy — one focal point per section, 1.5–2× weight gap to the support tier. The most-violated principle in LLM-generated UI; this is the cure. | Before building any page, section, or list of equally-weighted items. |
| [first-impression.md](design-system/00-foundations/first-impression.md) | The 50ms halo contract. Three questions answered (what/who/why), three checks passed (branded chrome, single focal point, no layout shift). | Before designing any landing surface, hero, or first-screen experience. |
| [micro-interactions.md](design-system/00-foundations/micro-interactions.md) | Peak-end rule. Catalog of moments: hover, focus, validation, success. Spend motion budget on functional moments. | Before designing any state change. |
| [color.md](design-system/00-foundations/color.md) | The four-color floor — accent `#00FA8A`, dark `#171A18`, light `#E6E6E6`, paper `#FAFAFA`. Plus refined danger / warning. Single accent rule. | Before introducing any new color, surface, or token. |
| [typography.md](design-system/00-foundations/typography.md) | Satoshi-only single-typeface system. 1.25 modular scale on 16px base. Six role groups (display, heading, body, label, data, editorial). | Before using a font, choosing a size, or adding a new type preset. |
| [spacing.md](design-system/00-foundations/spacing.md) | 4-pt base / 8-pt soft grid. Marketing breathes (96px section), operator stays dense (24px section). | Before placing any padding, margin, or gap. |
| [elevation.md](design-system/00-foundations/elevation.md) | Hairline borders do most of the work; shadows reserved for floating UI. Two-stop composite shadows. The accent-glow is Warp's signature. | Before applying any shadow or border-elevation pattern. |
| [motion-language.md](design-system/00-foundations/motion-language.md) | Decelerate-not-bounce. 120/180/260/400ms duration ladder. Standard easing 95% of the time. Honor `prefers-reduced-motion`. | Before adding any animation, transition, or motion-driven state change. |
| [accessibility.md](design-system/00-foundations/accessibility.md) | WCAG 2.2 AA hard floor. Visible focus, contrast ratios, keyboard reachability, accessible names. Lint enforces. | Before shipping any interactive element. |
| [density.md](design-system/00-foundations/density.md) | Marketing-vs-operator split. Both are first-class density modes; pick by surface intent, not aesthetic preference. | Before building a dashboard (operator) or a marketing page (marketing). |
| [buttons.md](design-system/00-foundations/buttons.md) | Comprehensive button language — 5 sizes × 5 intents × 5 surfaces × 3 shapes × full state matrix. The single biggest behavioral surface in the system. | Before placing any button, CTA, or pressable element. |
| [forms-and-inputs.md](design-system/00-foundations/forms-and-inputs.md) | The v0.6 field-shell architecture. `.lumen-field` wrapper paints focus / error / success rings; the inner `<input>` never paints its own. Validation timing rules. | Before placing any input, select, textarea, or form group. |
| [voice-and-tone.md](design-system/00-foundations/voice-and-tone.md) | Operator-direct, lowercase summaries, numerate. Banned phrases (no "Houston, we have a problem"; no "Oops!"; no "Great choice!"). | Before writing any UI copy. |

**The 7 v0.11 principles (memorize these — every PR is reviewed against them):**

1. **Breathing room over decoration.** Whitespace is a primary design element. Hairline borders + breathing room beat gradients + shadows.
2. **One focal point per section.** Aggressive hierarchy. The eye should land on one thing per visible region; everything else supports it. (v0.11 — encodes the 1.5–2× weight gap rule from `hierarchy.md`.)
3. **Single disciplined accent.** Spring Green plays one role: action / live / success. Never decorative, never as a second accent.
4. **Decelerate, don't bounce.** Motion enters with deceleration (cubic-bezier(0.2, 0, 0, 1)), exits with acceleration. No spring-overshoot for UI feedback.
5. **First-impression engineered.** v0.11 — 50ms halo contract. Three questions answered (what is this, who is it for, why now), three checks passed (branded chrome, single focal point, no layout shift).
6. **Cognitive fluency over cleverness.** v0.11 — the easier a surface is to process, the more trustworthy it feels (Reber & Schwarz 2006 / Alter & Oppenheimer 2009). Predictability + restraint > novelty + flourish.
7. **Peak-end rule.** v0.11 — people remember the moments of delight + the last moment of an interaction, not the average. Spend the motion / micro-interaction budget on functional peaks (success states, validation moments, completion confirmations), not on idle decoration.

---

## 4. The token system — primitives → semantic → component

Lumen tokens are DTCG JSON in three sub-tiers. Engineers and LLMs **consume only the semantic tier** in product code. The primitive tier is for the system's own internal references; the component tier is for component-bound values that compose primitives + semantics.

```
01-tokens/
├── primitives/           ← raw atoms (color hex, dimension px, motion ms)
│   ├── color.tokens.json       (~150 tokens — brand, accent, neutral, status, alphas, absolutes)
│   ├── dimension.tokens.json   (~45 tokens — 4-pt scale 0→64 + sub-grid stops)
│   ├── radius.tokens.json      (~9 tokens — xs→4xl + full)
│   ├── shadow.tokens.json      (~9 tokens — xs→2xl + inset + accent-glow)
│   ├── motion.tokens.json      (~10 tokens — durations + easings)
│   └── typography.tokens.json  (~80 tokens — families, weights, sizes, leading, tracking)
│
├── semantic/             ← role-based aliases (engineers consume these)
│   ├── color.dark.tokens.json     (~120 tokens — surface, text, border, action, status, aurora)
│   ├── color.light.tokens.json    (~120 tokens — mode parity)
│   ├── space.tokens.json          (~60 tokens — stack, inline, inset, section, page, table)
│   ├── radius.tokens.json         (~9 tokens — control, card, popover, pill, circle)
│   ├── shadow.tokens.json         (~15 tokens — card, lifted, popover, menu, modal, focus, button glow ladder, input shadows)
│   ├── motion.tokens.json         (~6 tokens — transition presets composing duration + easing)
│   └── type.tokens.json           (~50 tokens — display, heading, body, label, data, editorial, eyebrow, code)
│
└── components/           ← component-bound (composes semantic + primitive)
    └── {component}.tokens.json   (35 files — button, input, card, ...)
```

**Three rules for every token consumer:**

1. **Reference semantic, not primitive.** `color.surface.page` ✓ — `color.brand.800` ✗. The lint enforces this.
2. **Reference, don't inline.** `var(--surface-canvas)` ✓ — `#171A18` ✗. The lint enforces this.
3. **If the value you need isn't in semantic, add a semantic alias** (with a PR + ADR for breaking changes), don't add the primitive directly.

**Example chain — tracing a single value end to end:**

```
Layer        Path                                         Resolved value           Description
─────────────────────────────────────────────────────────────────────────────────────────────────
Primitive    color.accent.500                             #00FA8A                  Brand spring green
   ↑ referenced by
Semantic     color.action.primary.bg.rest                 {color.accent.500}       Primary CTA fill
   ↑ referenced by
Component    button.intent.primary.background.rest        {color.action.primary.bg.rest}
   ↑ referenced by
Runtime CSS  --color-action-primary-bg-rest               var(--lumen-accent-4)
   ↑ referenced by
Runtime util .lumen-btn-primary { background-color: ... }
   ↑ referenced by
Consumer     <Button intent="primary">Ship freight</Button>
```

When `color.accent.500` retunes (lime → spring green in v0.11), every link in the chain inherits automatically. **Inlining a value at any link breaks inheritance** — that's the v0.11.13 CHANGELOG's entire story (shadow tokens had inlined `rgba(74,222,128,X)` lime instead of referencing `{color.alpha.accent.X}`, so the v0.11 brand recolor never reached them).

**Built outputs.** `pnpm build` runs Style Dictionary v5 to produce nine platform-specific output formats in `_build/` (gitignored, served via CDN at consumer time):

| Platform | Output | Format |
|---|---|---|
| Web | `_build/css/tokens.css` | Plain CSS custom properties |
| Web (Tailwind v4) | `_build/tailwind/theme.css` | `@theme inline { ... }` |
| TypeScript | `_build/ts/tokens.ts` | ES6 const declarations |
| iOS | `_build/ios/LumenTokens.swift` | Swift class with static properties |
| Android | `_build/android/{colors,dimens}.xml` | XML resources |
| Compose | `_build/compose/LumenTokens.kt` | Kotlin object |
| Flutter | `_build/flutter/lumen_tokens.dart` | Dart class |
| Liquid | `_build/liquid/tokens.liquid` | Shopify theme variables |
| Generic JSON | `_build/json/tokens.flat.json` | Single flat dict for any consumer |

---

## 5. Component catalog — all 35

35 components, each with `component.md` (human contract), `component.json` (machine contract validating against `_schema/component.schema.json`), and per-platform `examples/{platform}.{ext}`. The shadcn registry sidecars in `_registry/` make every web component installable via `npx shadcn add <registry>/<name>`.

**Organized by category:**

### Foundations
| Component | Purpose | When to use |
|---|---|---|
| [badge](design-system/02-components/badge/component.md) | Tonal pill (status / count / category) | Status labels, counts, category tags |
| [icon-button](design-system/02-components/icon-button/component.md) | Square button, icon-only | Toolbars, table-row actions, dense controls |
| [live-dot](design-system/02-components/live-dot/component.md) | Pulsing 8px spring-green dot | Live state indicator (real-time data, presence) |
| [stat](design-system/02-components/stat/component.md) | Big tabular number + delta + sparkline | KPI cards, dashboard hero numbers |
| [rate-ticker](design-system/02-components/rate-ticker/component.md) | Scrolling lane/rate row | Live data ticker (logistics rates, prices) |

### Buttons + actions
| Component | Purpose | When to use |
|---|---|---|
| [button](design-system/02-components/button/component.md) | The primary action surface — 5 sizes × 5 intents × 5 surfaces × 3 shapes | Any pressable text + icon affordance |
| [button-group](design-system/02-components/button-group/component.md) | Connected button set (segmented control's parent) | Toolbar groups, mutually exclusive choices when >2 |
| [split-button](design-system/02-components/split-button/component.md) | Primary + chevron menu | "Save" + "Save as draft / Save and exit" |
| [fab](design-system/02-components/fab/component.md) | Floating action button | Mobile primary action, opt-in for desktop |
| [command-palette-button](design-system/02-components/command-palette-button/component.md) | Header trigger for ⌘K palette | Top-bar surfaces |
| [toggle](design-system/02-components/toggle/component.md) | Pressed/unpressed binary state | Sticky toolbar states (bold, italic, sidebar visibility) |
| [segmented](design-system/02-components/segmented/component.md) | 2–4 mutually exclusive options | View switchers (day/week/month, list/grid) |

### Inputs (the v0.6 forms layer + v0.7 deferred completion)
| Component | Purpose | When to use |
|---|---|---|
| [input](design-system/02-components/input/component.md) | Text input wrapped in `.lumen-field` shell | Single-line text |
| [textarea](design-system/02-components/textarea/component.md) | Multi-line `.lumen-field` | Notes, descriptions, message body |
| [number-input](design-system/02-components/number-input/component.md) | Numeric input with stepper | Quantity, price |
| [password-input](design-system/02-components/password-input/component.md) | Input with show/hide eye | Auth forms |
| [otp-input](design-system/02-components/otp-input/component.md) | 4–8 segmented digit cells | Verification codes |
| [select](design-system/02-components/select/component.md) | Native-feeling popover select | Single choice from short list |
| [combobox](design-system/02-components/combobox/component.md) | Searchable / async select | Long lists, async-loaded options |
| [tags-input](design-system/02-components/tags-input/component.md) | Chip input for multi-value | Tags, recipients, multi-select |
| [date-picker](design-system/02-components/date-picker/component.md) | Calendar + input | Single date |
| [time-picker](design-system/02-components/time-picker/component.md) | Hour/minute spinner or inline | Time of day |
| [range-slider](design-system/02-components/range-slider/component.md) | Single + dual-handle range | Price/distance/timestamp range |
| [file-dropzone](design-system/02-components/file-dropzone/component.md) | Drag-and-drop file upload | File uploads, attachment surfaces |
| [checkbox](design-system/02-components/checkbox/component.md) | Boolean + indeterminate | Multi-select lists, opt-in toggles |
| [radio-group](design-system/02-components/radio-group/component.md) | Mutually exclusive choice set | 2–6 visible options, mutually exclusive |
| [switch](design-system/02-components/switch/component.md) | iOS-style on/off | Settings, system-state toggles |
| [field](design-system/02-components/field/component.md) | The label + control + help/error wrapper | Wrap every form input. The compositional unit. |
| [validation-message](design-system/02-components/validation-message/component.md) | Error / warning / success line | Below the field control on invalid state |
| [form](design-system/02-components/form/component.md) | RHF binding wrapper | Multi-field forms with React Hook Form |

### Containers + surfaces
| Component | Purpose | When to use |
|---|---|---|
| [card](design-system/02-components/card/component.md) | Hairline-bordered surface + 5 elevations | Group of related content (KPI, article, item) |
| [dialog](design-system/02-components/dialog/component.md) | Modal sheet, scrim, focus trap | Confirmations, focused tasks |
| [empty-state](design-system/02-components/empty-state/component.md) | Icon + heading + description + primary action | Zero-state of a list/table/dashboard |
| [table](design-system/02-components/table/component.md) | Dense data table | Rows of records, dashboards |
| [toast](design-system/02-components/toast/component.md) | Corner notification | Async success / failure / info |

### Component-composition rules (the constants every consumer must respect)

1. **Every form input goes inside a `<Field>`.** Never render `<Input>` bare. Field paints the label, the help text, the error/success state, and the focus halo on the wrapper, not on the inner control.
2. **Every focusable element ships visible focus.** The `:focus-visible` rule in `globals.css` paints a 3px spring-green ring at 32% alpha on every interactive surface by default. Don't override it.
3. **Spring-green-bg surfaces use `.lumen-btn-primary` (or the dual-ring focus shadow), not `bg-primary`.** Tailwind v4's content scanner has been observed to drop the shadcn bridge utilities, leaving white-on-spring-green text (~1.4:1 — WCAG fail). Use the v0.9 `.lumen-btn-*` family or direct `bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)]` instead.
4. **`Stat`, `LiveDot`, and `RateTicker` are Warp-signature primitives.** They carry the operator-console mood. Don't hide them inside generic Card layouts — let them be the visual anchor.
5. **`prefers-reduced-motion: reduce` is honored on every animated component.** If you add a new animation, you add the reduced-motion fallback in the same PR.

---

## 6. Platform consumption — all 9

Lumen ships to 9 platforms. Each platform has a substantive consumption guide in `design-system/03-platforms/{platform}/README.md`. This section is the index + quick-start; the full guides have setup, theming, tokens-table, component-table, code samples, and platform-specific quirks.

| Platform | Stack | Quick install | Guide |
|---|---|---|---|
| **Web** | Next.js 16 + Tailwind v4 + shadcn/ui (Radix primitives) | `pnpm dlx shadcn@latest add <cdn>/lumen/v0.11.13/registry/{name}.json` | [web-react/](design-system/03-platforms/web-react/README.md) |
| **React Native** | Expo SDK 53+ + NativeWind | npm package + `<LumenProvider>` | [react-native/](design-system/03-platforms/react-native/README.md) |
| **iOS native** | SwiftUI + Swift Package | `from: "0.11.13"` | [ios-native/](design-system/03-platforms/ios-native/README.md) |
| **Android native** | Jetpack Compose + Material 3 base | `dev.warp:lumen-compose:0.11.13` | [android-native/](design-system/03-platforms/android-native/README.md) |
| **macOS desktop** | SwiftUI + AppKit interop | Same Swift Package as iOS, macOS-specific examples | [desktop-mac/](design-system/03-platforms/desktop-mac/README.md) |
| **Windows desktop** | WinUI 3 + XAML | Token XAML resource dictionary | [desktop-windows/](design-system/03-platforms/desktop-windows/README.md) |
| **Shopify** | Liquid + Theme Editor settings | Section/snippet partials + token CSS | [shopify-liquid/](design-system/03-platforms/shopify-liquid/README.md) |
| **BigCommerce** | Stencil theme + Handlebars | Stencil module + token SCSS | [bigcommerce-stencil/](design-system/03-platforms/bigcommerce-stencil/README.md) |
| **WooCommerce** | WordPress theme/plugin | PHP enqueue + token CSS | [woo-wordpress/](design-system/03-platforms/woo-wordpress/README.md) |

**No watches, no TV.** Per the original brief, Lumen explicitly does not target watchOS, tvOS, or Android TV — the visual contract (1.25 modular type scale, dense table rows, hairline borders) doesn't translate to those form factors and would need a different system.

**Theme switching.** Every platform supports `data-theme="light"` / `data-theme="dark"` (web), `LumenTheme.dark` / `.light` (Swift), `MaterialTheme.lumen.dark()` / `.light()` (Compose), or the platform-equivalent. Default is dark mode (the obsidian-mint canvas is the brand stage).

**The audit dashboard is the canonical web reference.** When in doubt about how to compose a component on web, look at `audit-dashboard/src/` first — every primitive is exercised across 8 templates (foundations, landing, saas, tool, ecommerce, mobile, desktop, library).

---

## 7. Composition patterns — how to build with what's here

Components are atoms; patterns are how you compose them into recognizable UI shapes. Lumen ships a compact pattern library in `design-system/05-patterns/` (see [its README](design-system/05-patterns/README.md) for the full catalog). This section is the index + the most-asked-for patterns.

### Marketing landing page

```
HeroSection
  ├── EyebrowText           → type.eyebrow.sans, text-tertiary
  ├── DisplayHeading        → type.display.xl or .2xl, text-balance, max-3-lines
  ├── LeadParagraph         → type.lead, text-secondary, max-2-lines
  ├── CTAGroup
  │   ├── Button.primary.lg  → "Book a demo"
  │   └── Button.outline.lg  → "Read docs"
  └── HeroVisual             → product screenshot OR live data block (LiveDot + RateTicker)

TrustStrip
  └── customer-logos in monoline, 4-6 visible, scroll-on-mobile

StatBand
  └── 3-4 Stat (size=xl) with sparkData and polarity

FeaturesGrid
  └── 3-column Card grid with icon + heading + 2-line description

Pricing
  └── 3 PricingCard, middle = primary intent

FAQ
  └── Disclosure list (native <details> styled) — keep ≤ 8

CTA band
  └── full-width band, primary CTA + supporting line

Footer
  └── 4-column nav + legal + version chip
```

**First-impression checks** (from `first-impression.md`): the hero must answer what/who/why in 50ms, ship a single focal point, and have no layout shift. Run the cold-load test: open in private browsing, hard-refresh, screenshot at 50ms — does the brand register?

### SaaS operator dashboard

```
DashboardShell
  ├── Sidebar              → ~240px fixed, dense nav (Settings + section groups)
  ├── Header               → search (CommandPaletteButton), user menu, mood/theme switch
  └── Main
      ├── PageHeader       → eyebrow + title + meta badge + actions
      ├── KpiRow           → 4 Stat cards in equal grid, each with sparkData
      ├── PrimaryTable     → Table with hairline rows, lumen-stat-card hover
      ├── SidePanel        → ProgressRing + supporting Stats + recent activity
      └── EmptyState       → icon + heading + description + primary action (when zero data)
```

**Density:** operator. Section rhythm = 24px (`space.section.dense`). Page padding = 24px. Table rows = 32–40px. Don't reach for marketing density on a dashboard.

### Settings page

```
SettingsShell
  ├── Sidebar             → grouped section nav (cozy density, 36px control height)
  └── Main
      └── for each settings group:
          ├── SectionHeader  → eyebrow + title + 1-line description
          ├── Form
          │   └── for each setting:
          │       └── Field (Label + Switch | Select | Input | Textarea | Combobox)
          └── divider (border-hairline)
```

**Density:** cozy (36px control height). Settings is a quiet page; field-gap-field is 16px, fieldset-gap is 32px (per `space.field.*`).

### Mobile primary surface

```
MobileShell (iOS or Android frame)
  ├── StatusBar
  ├── NavBar               → backButton + title + actions
  ├── ScrollContainer
  │   ├── HeroCard or StatRow or List
  │   └── ...content...
  └── TabBar (iOS) or BottomNav (Android)
       ↑ uses platform-native chrome but Lumen tokens

Mobile gestures: swipe-to-delete on lists, pull-to-refresh on data, long-press on items.
See design-system/04-content/motion.md §Mobile gestures for the full catalog + reduced-motion fallbacks.
```

### E-commerce product page

```
ProductPage
  ├── Breadcrumb
  ├── ProductGallery       → main image + thumbnails, pinch-to-zoom on mobile
  ├── BuyPanel
  │   ├── ProductTitle     → type.heading.h1
  │   ├── PriceBlock       → Stat (size=xl) for the price
  │   ├── RatingSummary    → stars + count, links to reviews
  │   ├── VariantPicker    → Segmented (color) + Select (size)
  │   ├── QuantityInput    → NumberInput
  │   └── BuyButton        → Button.primary.lg with loading state on submit
  ├── ProductDescription   → prose body
  ├── Specs                → Table or definition list
  ├── ReviewsSection       → ratings histogram (Bar chart with sentiment tint), review list
  └── RelatedGrid          → ProductCard grid (3–4 columns desktop, 2 mobile)
```

### Web tool / utility

Single-canvas pattern (see `audit-dashboard/src/app/tool/page.tsx`):

```
ToolFrame
  ├── TitleBar             → app name + LiveDot (auto-saving) + actions
  └── 3-column grid
      ├── LeftPanel        → presets / inputs
      ├── CenterCanvas     → the work area (calculator output, builder, simulator)
      └── RightPanel       → controls / settings / context
```

### Authentication (sign in / sign up / reset)

```
AuthLayout
  ├── BrandMark            → centered, marketing density
  └── AuthCard             → 360px max-width
      ├── Heading          → "Sign in to Warp"
      ├── Form
      │   ├── Field.email
      │   ├── Field.password (PasswordInput)
      │   ├── Button.primary.lg (full-width)
      │   └── secondary link ("Forgot password?")
      └── ProviderButtons  → SSO + magic link options below a divider
```

OTP flow uses the `OtpInput` component; password reset uses the same `Field.email` shell with state-driven message.

---

## 8. Content rules — words, images, motion, icons

`design-system/04-content/` holds eight rule documents covering everything that's not a token, a component, or a foundation principle.

| Rule doc | What it governs | When to read |
|---|---|---|
| [imagery.md](design-system/04-content/imagery.md) | Photography policy (no stock; product screenshots first; documentary second), image dimensions, dark/light treatment | Before adding a hero image, OG image, or marketing illustration |
| [illustration.md](design-system/04-content/illustration.md) | The Lumen monoline rules (1.5px stroke, single color, rounded ends, 24px grid, no perspective, no characters) | Before drawing or commissioning any illustration |
| [iconography.md](design-system/04-content/iconography.md) | The ~40 system icons + 17 logistics icons. 24×24 grid, 1.5px stroke, rounded line caps. | Before reaching for an emoji, an SVG icon, or an icon library |
| [motion.md](design-system/04-content/motion.md) | Animation recipes by surface (page transitions, list enter/exit, validation, success), the catalog of mobile gestures (swipe, pull, long-press, pinch, drag-reorder), reduced-motion defenses | Before adding any animation or gesture |
| [microcopy.md](design-system/04-content/microcopy.md) | Banned phrases, button labels, error messages, empty-state copy, toast wording, number formatting | Before writing any UI string |
| [error-messages.md](design-system/04-content/error-messages.md) | Pattern catalog by error class (network, validation, authz, domain, file, catastrophic). Tone = operator-direct, never apologetic. | Before writing any error message |
| [empty-states.md](design-system/04-content/empty-states.md) | The four empty-state classes (first-use, filtered-empty, error, loading) + ~17 worked examples | Before designing any zero-state |
| [ui-writing-style.md](design-system/04-content/ui-writing-style.md) | Number formatting, verb tense, voice patterns, capitalization rules | Before any extended UI prose |

**The voice in one sentence:** operator-direct, lowercase summaries with em-dashes, numerate, never apologetic. Read it back to yourself — if it sounds like a customer-success email template, rewrite. If it sounds like a competent ops engineer narrating what just happened, ship.

**The visual content philosophy in one sentence:** no stock photography, no AI-generated images, no character mascots, no isometric scenes — product screenshots first, documentary photography second, monoline diagrams for abstract concepts.

---

## 9. Build pipeline + governance

### Build commands (humans + CI)

```bash
pnpm install                # install dev dependencies
pnpm build                  # Style Dictionary v5 → _build/{css,tailwind,ts,ios,android,compose,flutter,liquid,json}/
pnpm validate               # JSON schemas + DTCG aliases + WCAG contrast
pnpm registry               # rebuild _registry/*.json from component sources
pnpm lint                   # 6 lint rules (no-primitives, no-arbitrary-typography, no-arbitrary-form-values, no-off-grid-spacing, no-white-on-accent, button-conventions)
pnpm format                 # prettier on .md + .json + .ts at root and design-system/
pnpm cls                    # Lighthouse CLS measurement
pnpm release                # version bump + tag + changelog gate
cd audit-dashboard && pnpm dev    # http://localhost:3000 — visual reference
```

### Validate (the gate)

`pnpm validate` runs three sub-validators that gate every PR:

1. **`scripts/validate-tokens.mjs`** — reads every DTCG file, walks every `{path.to.token}` reference, confirms it resolves. Reports the count of declared tokens + the count of resolved references. Currently: 887 tokens declared, all resolve.
2. **`ajv validate`** — every `component.json` validates against `_schema/component.schema.json`. A missing required field fails the build.
3. **`scripts/check-contrast.mjs`** — WCAG contrast check on every documented foreground/background pair. Light + dark mode. Currently: every documented pair passes 4.5:1 (or 3:1 for large text).

### Lint (the safety net)

Six lint rules in `scripts/lint-*.mjs`:

| Rule | What it catches |
|---|---|
| `lint:no-primitives` | Hardcoded hex / rgba / pixel values in component code (with allowlist for marketing illustration) |
| `lint:no-arbitrary-typography` | Tailwind arbitrary `text-[N]px` / `tracking-[Nem]` / `leading-[N]` instead of the bundled `text-body-md` etc. utility |
| `lint:no-arbitrary-form-values` | Hand-rolled form CSS instead of the `.lumen-field` shell |
| `lint:no-off-grid-spacing` | Tailwind `py-2.5` etc. that doesn't snap to the 4-pt grid (allow with `// lumen-lint-allow: off-grid` comment if intentional) |
| `lint:no-white-on-accent` | `text-white` adjacent to `bg-primary` / `--lumen-accent` (the WCAG-fail pattern that broke v0.9 buttons) |
| `lint:button-conventions` | Ensures buttons use `<Button>` primitive, not bare `<button>` with hand-rolled classes |

### Governance — ADRs

`_meta/decisions/` holds 18 Architecture Decision Records (ADRs), each capturing the why behind a load-bearing decision:

| ADR | Decision |
|---|---|
| 0001 | Use DTCG JSON as the token source format |
| 0002 | Style Dictionary v5 as the build pipeline |
| 0003 | shadcn registry as the web distribution mechanism |
| 0004 | Quiet Industrial as the system mood |
| 0005 | Warp green (now spring green) as the only accent |
| 0006 | Satoshi + JetBrains Mono pairing (later superseded by 0017) |
| 0007 | Two-file component contract (.md + .json) |
| 0008 | LLM contract layered (llms.txt + AGENTS.md + tool-mirrors) |
| 0009 | Versioning — semver, system-wide |
| 0010 | Typography v0.5 — modular scale, leading curve |
| 0011 | Forms and inputs v0.6 — `.lumen-field` shell |
| 0012 | Distribution surface v0.7 — registry-served |
| 0013 | Form / RHF binding v0.7 |
| 0014 | Spacing rebuild v0.8 — operator vs marketing tiers |
| 0015 | shadcn token bridge — direct refs over the bridge utility |
| 0016 | Button rebuild v0.9 — 5×5×5×3 matrix |
| 0017 | Satoshi-only typography v0.10 — single typeface |
| 0018 | v0.11 Premium Psychology recolor — spring green + obsidian mint |

When you propose a breaking change (token rename, schema break, brand-value shift), open a new ADR.

### Deprecation policy

- Mark a token deprecated by setting `"$deprecated": "Replaced by {new.token.path} in vX.Y.Z. Will be removed in v1.0.0."` on the token.
- Mark a component deprecated by setting `"deprecated": true` + `"deprecationNotice": "..."` + `"removedIn": "1.0.0"` in `component.json`.
- A deprecation lives ≥ 1 minor release before removal.
- Removal happens in the next major.

### Versioning

Semver, system-wide:

- **Patch** (`0.11.X`): bug fixes, doc updates, lint fixes, value tuning that doesn't change tokens.
- **Minor** (`0.X.0`): new tokens, new components, new platform guides, new principles. v0.11 added the Premium Psychology recolor + 3 new foundations.
- **Major** (`X.0.0`): token rename / removal, schema break, breaking component API change. v1.0.0 is reserved for "API surface frozen for external consumers."

### CHANGELOG

Keep-a-Changelog format. Every PR adds an entry under one of: Added / Changed / Deprecated / Removed / Fixed / Security. The latest entry (top of file) describes the current released or unreleased state. Each entry includes architectural notes — the "why" behind the change.

---

## 10. The LLM contract — for AI coding agents

This section is what an AI coding agent should treat as a normative contract when working in or with this repo.

### Discovery — read in this order

1. **`AGENTS.md`** — universal hard rules (9 rules). Always start here.
2. **Tool-specific addenda** — Claude reads `CLAUDE.md`. Cursor follows `.cursor/rules/lumen.mdc`. Copilot follows `.github/copilot-instructions.md`. Warp Terminal follows `.warp/lumen.mdc`.
3. **`llms.txt`** — discovery index pointing at every relevant file.
4. **This file (`USING-LUMEN.md`)** — comprehensive end-to-end manual when you need the unified narrative.
5. **`design-system/00-foundations/{topic}.md`** — when you need the deep "why" of a foundation principle.
6. **`design-system/02-components/{name}/component.json`** — when you need the exact API of a component.
7. **`audit-dashboard/src/...`** — when you need a working code example.
8. **`_meta/prompts/{workflow}.md`** — when you're starting a recognized workflow (new component, token update, accessibility pass, platform port, audit-dashboard tab).

### Hard rules (memorize these — they cannot be relaxed)

1. **Never invent tokens.** If you need a value not in `01-tokens/semantic/`, the answer is to add a semantic alias (with a PR + ADR), not to hardcode or reach into primitives.
2. **Always reference SEMANTIC tokens, never primitives.** `color.surface.page` ✓ — `color.warm.50` ✗.
3. **Every `component.json` validates against the schema.** Missing required fields fail the build.
4. **Every component ships `component.json` first, code second.** The JSON is what other LLMs and the MCP server read.
5. **WCAG 2.2 AA is the floor.** Visible focus, contrast, keyboard reachability, accessible name. AAA where free.
6. **Use the platform-appropriate code template** from `02-components/{name}/examples/`. Don't invent new patterns when one exists.
7. **Spring Green plays exactly one role: action / live / success.** Never decorative, never as a second accent.
8. **Honor `prefers-reduced-motion`** in everything that animates.
9. **Never render white or near-white text on the spring-green accent surface.** Use `.lumen-btn-primary` (or direct `bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)]`), not the shadcn `bg-primary` bridge utilities (the Tailwind v4 content scanner has been observed to drop those classes, leaving white-on-accent at ~1.4:1).

### When generating code

- **Web:** Tailwind v4 only. Theme via `@theme inline { ... }` in `_build/tailwind/theme.css`. Token references via `var(--surface-page)` or via Lumen utility classes (`.lumen-eyebrow`, `.lumen-btn-primary`, `.lumen-field`). Never hand-roll a hex.
- **iOS:** SwiftUI. `LumenColor.surface.page` not `Color(hex: "#171A18")`. `LumenSpacing.s4` not `16`.
- **Android:** Jetpack Compose. `LumenTokens.Color.surface.page` not `0xFF171A18`. `LumenTokens.Spacing.s4` not `16.dp`.
- **TypeScript:** Import from `@warp/lumen-tokens` (the `_build/ts/tokens.ts` published as a package). Reference by token path.

### When proposing a change

Three trust levels guide what you can ship without a human:

| Level | Action | Examples |
|---|---|---|
| AUTOMERGE | Cosmetic, low-risk | Typo fixes in MD, dead-link fixes, missing alt text on SVGs |
| DRAFT-PR | Reviewable | New components matching the schema, new platform examples, new prompt fragments, token additions (no removals) |
| HUMAN-REVIEW | Always reviewed | Token rename or removal, schema changes, breaking changes to `component.json`, anything that bumps major version, license-affecting changes |

When in doubt, draft a PR rather than autocommit. Surface the question rather than guess.

### When the user is in chat (Claude AI)

- Stay in your role (planner / topic expert / researcher) — produce the prompt or plan the user can hand to Claude Code, don't pretend to execute.
- Cite sources from the vault when you reference past decisions.
- Capture every "Product Edge" learning point per global instructions.

### When the user is in Claude Code

- Execute. Don't stall on planning unless the user explicitly asks for plan mode.
- Run validators (`pnpm validate`, `pnpm lint`) after token / component changes.
- Use parallel agents for independent work; never do sequentially what can be done in parallel.

---

## 11. Anti-patterns — never do these

This is the "avoid these or break the system" list. Everything here is enforceable by lint or by reviewer rejection.

### Color anti-patterns

- ❌ **Adding a second loud color.** Spring Green is the one accent. No purple secondary, no orange tertiary. (See ADR 0005 + 0018.)
- ❌ **Using Spring Green as decorative.** It signals action / live / success. Don't use it for a marketing gradient, a section header underline, or a non-action chrome element.
- ❌ **White text on spring-green surface.** ~1.4:1 contrast. Use `color.accent.fg` (`#07120D`, 14.7:1 AAA) or the `.lumen-btn-primary` class which composes statically.
- ❌ **Hardcoded hex.** Always reference a CSS var or token. Lint catches most cases; reviewers catch the rest.
- ❌ **Reaching into primitives from product code.** `color.brand.800` ✗ — `color.surface.page` ✓.

### Typography anti-patterns

- ❌ **Adding a second typeface.** Satoshi is the only typeface. JetBrains Mono, Source Serif 4, and Inter were retired in v0.10. Numeric / code / editorial moments use Satoshi's OpenType feature flags (`tnum`, `lnum`, `zero`, `calt`, `liga`, `case`, `ss01-04`).
- ❌ **Arbitrary type tokens.** `text-[15px]` ✗. Use `text-body-sm` or whichever bundled preset fits. Lint catches.
- ❌ **Light weight 300.** Deprecated in v0.5 — operator-confident voice doesn't suit thin.

### Spacing + layout anti-patterns

- ❌ **Off-grid Tailwind half-steps.** `py-2.5` ✗ unless intentionally documented with `// lumen-lint-allow: off-grid`. Round to 4 / 8.
- ❌ **Reaching for `dimension.*` in component code.** Use `space.4` (semantic), not `dimension.4` (primitive).
- ❌ **Marketing density on operator surfaces.** A dashboard with 96px section rhythm reads as "marketing site" not as "operator console." Use `space.section.dense` (24px) on dashboards.

### Motion anti-patterns

- ❌ **Bounce.** Lumen decelerates. Spring overshoot is reserved for exceptional moments (and only with `motion.easing.spring-soft`, never as a default).
- ❌ **Animation that doesn't honor `prefers-reduced-motion`.** Lint will flag; CI will block.
- ❌ **Decorative animation.** Spend the motion budget on functional moments (validation, success, peak-end).
- ❌ **Long durations.** Default duration ladder is 120 / 180 / 260 / 400ms. Anything > 400ms needs a reason in the PR description.

### Form anti-patterns

- ❌ **Bare `<input>` outside `<Field>`.** The field shell paints the focus halo, the help text, the error/success state. Don't reinvent these on every input.
- ❌ **Painting the focus ring on the inner control.** The wrapper paints; the inner control suppresses its own.
- ❌ **Validating on every keystroke.** Validate on blur (default), or on submit. Validating on each keystroke produces error noise during typing and is hostile.

### Component anti-patterns

- ❌ **Generating a new component when one exists.** Search `02-components/` first. If a similar primitive exists, extend it (new variant) rather than fork.
- ❌ **Skipping `component.json` and writing only the `.tsx`.** The JSON is what other LLMs read; without it, your component is invisible to the system.
- ❌ **Using shadcn bridge utilities (`bg-primary`, `text-primary-foreground`) on accent surfaces.** Use `.lumen-btn-*` family or direct semantic refs. (See AGENTS.md hard rule #9.)

### Documentation anti-patterns

- ❌ **Updating a token without updating the foundation doc that cites it.** The v0.4 → v0.11 lime → spring-green transition left stale "lime" mentions in elevation.md until v0.11.13 caught them. Documentation drift compounds.
- ❌ **New ADR without a CHANGELOG entry.** Both must land together.
- ❌ **Inlining a primitive value in a semantic token.** Even at the source-of-truth tier, semantic must reference primitive. Inlining a primitive's value rather than its path is the master-child break that v0.11.13 closed.

### Process anti-patterns

- ❌ **Force-pushing to main.** Never. (See `safety.md` global rule.)
- ❌ **Skipping the validate gate.** `pnpm validate` runs the JSON / schema / contrast checks. If it fails, the PR doesn't merge.
- ❌ **Skipping `pnpm lint` on a token or component PR.** Six rules; takes seconds; catches most leaks.

---

## 12. Quick-reference appendix

### Brand anchors (memorize)

| Anchor | Hex | Role |
|---|---|---|
| Spring Green | `#00FA8A` | Accent — action / live / success only |
| Obsidian Mint | `#171A18` | Dark canvas (default theme) |
| Light anchor | `#E6E6E6` | Light mode subtle / sunken; primary text on dark canvas |
| Paper canvas | `#FAFAFA` | Light mode page canvas |
| Accent foreground | `#07120D` | Near-black mint on accent surfaces (14.7:1 AAA) |

### Status palette

| Token | Value | Use |
|---|---|---|
| `color.status.danger.500` | `#E5484D` | Refined red — destructive actions, errors |
| `color.status.warning.500` | `#F5B118` | Refined amber — warnings, caution |
| Success | `{color.accent.500}` | Spring Green — success rides the accent ramp (single-accent rule) |
| Info | Cool-neutral spectrum | No second-loud color; info is neutral |

### Type ramp (Satoshi at sizes; full presets in `01-tokens/semantic/type.tokens.json`)

| Tier | Sizes | Use |
|---|---|---|
| Display | 28 / 39 / 49 / 76 / 96 / 128px | Marketing impact — landing hero, section opener |
| Heading | h1 31 / h2 25 / h3 20 / h4 17 / h5 15 / h6 13 | App structure |
| Body | xs 13 / sm 14 / md 16 / lg 18 | Paragraph + UI prose |
| Label | sm 13 / md 14 / lg 16 | Buttons, tabs, form labels |
| Data | sm 14 / md 16 / lg 20 | Tabular numerics with `tnum` + `lnum` |
| Metric | sm 20 / md 31 / lg 49 / xl 61 | Big-number KPIs (Stat) |
| Eyebrow | 12px (uppercase, tracked) | Section eyebrows + system metadata |

### Spacing (4-pt base)

| Token | Pixel | Use |
|---|---|---|
| `space.1` | 4 | Hairline gap |
| `space.2` | 8 | Inline icon-to-label |
| `space.3` | 12 | Compact button padding |
| `space.4` | 16 | Default element padding |
| `space.6` | 24 | Card padding md |
| `space.8` | 32 | Section break (sm) |
| `space.12` | 48 | Default section band |
| `space.16` | 64 | Marketing section |
| `space.24` | 96 | Hero section (Vercel-style) |

### Motion (decelerate, no bounce)

| Token | ms | Use |
|---|---|---|
| `motion.duration.instant` | 0 | Press feedback |
| `motion.duration.fast` | 120 | Hover, micro-feedback |
| `motion.duration.base` | 180 | Default UI feedback |
| `motion.duration.slow` | 260 | State changes, panel slides |
| `motion.duration.slower` | 400 | Page transitions |
| `motion.easing.standard` | `cubic-bezier(0.2, 0, 0, 1)` | 95% of motion |
| `motion.easing.decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Entry — thing arriving |
| `motion.easing.accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | Exit — thing leaving |

### Radius (optical, off-grid)

| Token | Pixel | Use |
|---|---|---|
| `radius.sm` | 6 | Chips, kbd |
| `radius.md` | 8 | Buttons, inputs (default) |
| `radius.lg` | 12 | Cards (default) |
| `radius.xl` | 16 | Lifted cards, navigation panels |
| `radius.2xl` | 20 | Hero surfaces |
| `radius.3xl` | 28 | Marketing surfaces, modal sheets |
| `radius.4xl` | 36 | Brutalist hero frames, mobile bezels |
| `radius.full` | 9999 | Pills, dots, avatars |

### Control heights

| Token | Pixel | Use |
|---|---|---|
| `size.control.xs` | 24 | Table-row inline action, chip-close (desktop only) |
| `size.control.sm` | 32 | Compact button (operator default) |
| `size.control.cozy` | 36 | Settings panel sweet spot |
| `size.control.md` | 40 | Default control (Lumen Button default) |
| `size.control.touch` | 44 | Apple HIG touch floor |
| `size.control.lg` | 48 | Large CTA, mobile primary |
| `size.control.xl` | 56 | Hero pill CTA |

### Container widths

| Token | Pixel | Use |
|---|---|---|
| `size.container.narrow` | 720 | Reading column |
| `size.container.default` | 1100 | Primary marketing + dashboard width |
| `size.container.wide` | 1200 | Wide hero blocks |
| `size.container.max` | 1440 | Audit dashboard maximum |
| `size.container.ultra` | 1920 | 32" ops monitor (operator-only) |

### Component count by category

| Category | Count |
|---|---|
| Foundations (badge, icon-button, live-dot, stat, rate-ticker) | 5 |
| Buttons + actions (button, button-group, split-button, fab, toggle, segmented, command-palette-button) | 7 |
| Inputs (input, textarea, number-input, password-input, otp-input, select, combobox, tags-input, date-picker, time-picker, range-slider, file-dropzone, checkbox, radio-group, switch, field, validation-message, form) | 18 |
| Containers + surfaces (card, dialog, empty-state, table, toast) | 5 |
| **Total** | **35** |

### Files at the repo root (for orientation)

```
README.md                  ← human front door
USING-LUMEN.md             ← THIS FILE — comprehensive end-to-end manual
AGENTS.md                  ← universal agent rules
CLAUDE.md                  ← Claude-specific addenda
CONTRIBUTING.md            ← human contributor guide
CHANGELOG.md               ← Keep-a-Changelog
VERSION                    ← 0.11.13
llms.txt                   ← LLM discovery index
package.json               ← build/validate/lint/registry/release scripts
style-dictionary.config.ts ← token build pipeline
```

### Frequently-asked-for token paths (the cheat sheet)

```
SURFACES        color.surface.page / .raised / .sunken / .popover / .glass
TEXT            color.text.primary / .secondary / .tertiary / .accent / .error / .warning
BORDERS         color.border.hairline / .subtle / .default / .strong / .focus / .accent
ACTION          color.action.{primary|secondary|outline|ghost|danger|danger-soft|ai|success|selected|glass}.{bg.rest|.hover|.press, fg, border}
STATUS          color.status.{success|warning|danger|info}.{bg, fg}
SPACE           space.{0,1,2,3,4,5,6,8,10,12,16,20,24,32,40,48,64} / space.stack.{xs,sm,md,lg,xl} / space.inline.{xs,sm,md,lg} / space.inset.{xs,sm,md,lg,xl,2xl} / space.section.{dense,sm,md,lg,xl,hero}
RADIUS          radius.control.{sm,md,lg} / radius.card.{default,lifted,hero,marketing} / radius.pill / radius.popover
SHADOW          shadow.card / .lifted / .popover / .modal / .toast / .focus / .button.glow.{rest,hover,active} / .accent-glow
MOTION          motion.duration.{instant,fast,base,slow,slower} / motion.easing.{standard,decelerate,accelerate,emphasised}
TYPE            type.display.{sm,md,lg,xl,2xl,hero} / type.heading.{h1,h2,h3,h4,h5,h6} / type.body.{xs,sm,md,lg,tabular} / type.label.{sm,md,lg} / type.data.{sm,md,lg} / type.metric.{sm,md,lg,xl} / type.eyebrow.{sans,mono} / type.caption / type.micro / type.kbd
```

### The mental model in three sentences

Lumen is **one disciplined accent (Spring Green) on a calm canvas (Obsidian Mint)**, with **aggressive hierarchy** and **engineered first impressions**, built as a **vertically integrated three-layer token chain** that holds 887 tokens across 32 source files and feeds 35 components across 9 platform consumption guides. Reference semantic tokens, never primitives. When you change the master, the children must inherit.

---

**End of USING-LUMEN.md.**

> If something in this document is wrong, this document is wrong — file a PR. If something in this document conflicts with `AGENTS.md` or `CLAUDE.md`, those files win.
> Last reviewed against actual repo state: 2026-05-05 (v0.11.13).
