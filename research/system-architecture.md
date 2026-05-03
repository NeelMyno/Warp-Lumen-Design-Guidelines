---
title: LLM-First Design System Architecture
date: 2026-05-02
type: research
tags: [research, architecture, design-system, tokens, llm]
sources_count: 22
status: draft
---

# Architecture for Lumen — Warp's LLM-First Design System

## TL;DR

- **Token source-of-truth:** DTCG-format JSON (`.tokens.json`), one file per layer (primitives → semantic → component) per mode (light, dark, hc-light, hc-dark). DTCG is now stable enough — Style Dictionary v5.4 (March 2025) supports DTCG v2025.10 natively, and Primer/Penpot/Tokens Studio all ship in this format.
- **Build pipeline:** Style Dictionary v5 (`config.ts`, ESM, browser-compatible) → outputs CSS variables, Tailwind v4 `@theme` block, TypeScript constants, iOS Swift class, Android XML + Compose Kotlin object, Flutter Dart class, and Shopify Liquid CSS snippet. One source, eight outputs.
- **Two-track docs per component:** `component.md` (human prose, MDX-compatible, with rich frontmatter) sitting next to `component.json` (machine contract: props schema, variants enum, a11y rules, do/don't, code snippets per platform). LLMs read the JSON; humans skim the MD; the MD references the JSON via wikilink-style anchors.
- **LLM contract surfaces, layered:** `/llms.txt` (root index), `/AGENTS.md` (cross-tool agent rules — universal), `/CLAUDE.md` (Claude-specific overrides), `/.cursor/rules/`, `/.warp/lumen.mdc`, plus a `registry.json` at root that follows shadcn's spec so the shadcn CLI and shadcn MCP server can consume Lumen out-of-the-box.
- **Cross-platform component packages, not a monorepo of code:** the `design-system/` repo holds tokens, docs, and contracts only. Each platform (web, RN, iOS, Android, desktop, Liquid) consumes Lumen as a copy-paste registry (shadcn-style) — no published npm package, no version-lock-in. Code lives next to docs as templates.
- **Versioning:** semver on the whole system (`v1.4.2`), Keep-a-Changelog format, deprecations announced one minor ahead with a `$deprecated` field on tokens and a `deprecated: true` field in component JSON. Calver was rejected — semver maps cleanly to "did this break my consumer's code?"
- **Top-level structure:** `design-system/` keeps the four-bucket layout you already have (foundations, tokens, components, platforms, content), plus new `_meta/` (LLM contracts), `_build/` (Style Dictionary outputs, gitignored), and `_registry/` (shadcn-compatible JSON sidecars).

## Token format & build pipeline

### Format: DTCG (Design Tokens Community Group)

Use **DTCG JSON** as the canonical format. The current draft is **Format Module 2025.10** (preview draft April 2026). The format has converged enough that GitHub Primer, Penpot, Tokens Studio, and Style Dictionary v5 all ship interop. Source files use the `.tokens.json` extension and `application/design-tokens+json` MIME type.

Core shape — every token is `$value` + `$type` (+ optional `$description`, `$deprecated`, `$extensions`):

```json
{
  "color": {
    "$type": "color",
    "blue": {
      "500": {
        "$value": { "colorSpace": "oklch", "components": [0.62, 0.18, 245], "alpha": 1 },
        "$description": "Primary brand blue. Use only via semantic aliases."
      }
    }
  }
}
```

References use curly-brace syntax: `"$value": "{color.blue.500}"`. Composite types (`typography`, `shadow`, `border`, `gradient`, `transition`, `strokeStyle`) bundle multiple sub-values.

**Why not custom JSON?** Three reasons: (1) Style Dictionary v5 has first-class DTCG support already wired up; (2) Figma's Tokens Studio plugin ingests/exports DTCG natively, so designers can round-trip; (3) future tooling (validators, Figma variables sync, registry indexers) is all converging on DTCG — anything custom is a rewrite waiting to happen.

### Three layers of tokens

This is the modern consensus (Primer, Material 3, Atlassian) — three distinct layers, each its own file:

1. **Primitives** (`tokens/primitives/*.tokens.json`) — raw, mode-agnostic. `color.blue.500`, `dimension.4`, `font.family.sans`. Designers reference these only via the next layer.
2. **Semantic** (`tokens/semantic/*.tokens.json`) — role-based, mode-aware. `color.surface.default`, `color.text.subtle`, `space.stack.md`. These reference primitives. **Engineers and LLMs only ever consume semantic tokens.** This is the contract surface.
3. **Component** (`tokens/components/*.tokens.json`) — opt-in, only when a component has unusually-bound values that don't fit semantic. `button.primary.background.rest`, `button.primary.background.hover`. Reference semantic, never primitives.

Modes are sibling files: `tokens/semantic/color.light.tokens.json`, `color.dark.tokens.json`, `color.hc-light.tokens.json`, `color.hc-dark.tokens.json`. Same key paths in each, different `$value` references.

### Build: Style Dictionary v5

Style Dictionary v5.4.0 (March 2025) is actively maintained, ESM-first, browser-compatible, and supports DTCG v2025.10 with structured color formats (sRGB, OKLCH, OKLab, P3, LCH, etc.). Config is TypeScript:

```ts
// design-system/style-dictionary.config.ts
import { register } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';

export default {
  source: ['tokens/**/*.tokens.json'],
  preprocessors: ['tokens-studio'],
  platforms: {
    css:        { transformGroup: 'css',          buildPath: '_build/css/',     files: [{ destination: 'tokens.css',         format: 'css/variables' }] },
    tailwind:   { transformGroup: 'css',          buildPath: '_build/tailwind/', files: [{ destination: 'theme.css',          format: 'css/variables', options: { selector: '@theme' } }] },
    ts:         { transformGroup: 'js',           buildPath: '_build/ts/',      files: [{ destination: 'tokens.ts',          format: 'typescript/es6-declarations' }] },
    'ios-swift':{ transformGroup: 'ios-swift',    buildPath: '_build/ios/',     files: [{ destination: 'LumenTokens.swift',  format: 'ios-swift/class.swift', className: 'LumenTokens' }] },
    'android':  { transformGroup: 'android',      buildPath: '_build/android/', files: [
                    { destination: 'colors.xml',        format: 'android/colors' },
                    { destination: 'dimens.xml',        format: 'android/dimens' },
                  ]},
    compose:    { transformGroup: 'compose',      buildPath: '_build/compose/', files: [{ destination: 'LumenTokens.kt',    format: 'compose/object', className: 'LumenTokens', packageName: 'design.warp.lumen' }] },
    flutter:    { transformGroup: 'flutter',      buildPath: '_build/flutter/', files: [{ destination: 'lumen_tokens.dart', format: 'flutter/class.dart', className: 'LumenTokens' }] },
    liquid:     { transformGroup: 'css',          buildPath: '_build/liquid/',  files: [{ destination: 'css-variables.liquid', format: 'css/variables' }] },
    json:       { transformGroup: 'js',           buildPath: '_build/json/',    files: [{ destination: 'tokens.flat.json',   format: 'json/flat' }] }
  }
};
```

`_build/` is gitignored. CI runs `npx style-dictionary build` and publishes outputs to a CDN (or commits them to a separate `lumen-dist` repo) so platform consumers can pull them without depending on the build chain.

## Repo file structure

```
Warp-Lumen-Design-Guidelines/
├── README.md                         # Human entry point. Links to llms.txt for agents.
├── llms.txt                          # ROOT — LLM index. Title, summary, file links to key docs.
├── llms-full.txt                     # Expanded version with inlined critical context.
├── AGENTS.md                         # Cross-tool agent rules (Cursor, Copilot, Claude, Codex, Devin).
├── CLAUDE.md                         # Claude-specific addenda (skill triggers, vault context).
├── CHANGELOG.md                      # Keep-a-Changelog format, semver-tagged.
├── VERSION                           # Plain-text current version, e.g. "1.4.2".
├── package.json                      # Just dev deps: style-dictionary, lint scripts. Not published.
├── style-dictionary.config.ts        # The build config above.
├── .cursor/
│   └── rules/
│       └── lumen.mdc                 # Cursor-specific rules (mirrors AGENTS.md).
├── .warp/
│   └── lumen.mdc                     # Warp-terminal-specific rules.
├── .github/
│   ├── copilot-instructions.md       # GitHub Copilot rules (mirrors AGENTS.md).
│   └── workflows/
│       ├── build.yml                 # Style Dictionary build on push.
│       ├── validate.yml              # JSON schema + DTCG lint.
│       └── changelog.yml             # Auto-prepend to CHANGELOG on tagged release.
│
├── design-system/                    # === THE ACTUAL SYSTEM ===
│   ├── 00-foundations/               # Brand voice, principles, accessibility commitments. MD only.
│   │   ├── principles.md
│   │   ├── voice-and-tone.md
│   │   ├── accessibility.md          # WCAG 2.2 AA target, contrast rules, focus order.
│   │   └── motion-language.md
│   │
│   ├── 01-tokens/                    # SOURCE tokens (DTCG JSON). Hand-edited.
│   │   ├── primitives/
│   │   │   ├── color.tokens.json     # Raw OKLCH ramps. Mode-agnostic.
│   │   │   ├── dimension.tokens.json # Spacing/sizing scale (4-base, OR 8-base — pick one).
│   │   │   ├── typography.tokens.json# Font families, weights, sizes (raw scale).
│   │   │   ├── motion.tokens.json    # Durations, cubic-beziers.
│   │   │   ├── shadow.tokens.json    # Shadow primitives (renamed from elevation.tokens.json in v0.7).
│   │   │   └── radius.tokens.json
│   │   ├── semantic/
│   │   │   ├── color.light.tokens.json
│   │   │   ├── color.dark.tokens.json
│   │   │   ├── color.hc-light.tokens.json
│   │   │   ├── color.hc-dark.tokens.json
│   │   │   ├── space.tokens.json     # space.stack.sm, space.inline.md, etc.
│   │   │   ├── type.tokens.json      # type.body.md, type.heading.lg.
│   │   │   ├── motion.tokens.json    # motion.transition.fast.
│   │   │   └── radius.tokens.json    # radius.control.sm.
│   │   ├── components/               # Optional component-bound tokens.
│   │   │   ├── button.tokens.json
│   │   │   ├── card.tokens.json
│   │   │   └── input.tokens.json
│   │   └── README.md                 # Token taxonomy & naming rules. CRITICAL for LLMs.
│   │
│   ├── 02-components/                # Per-component spec + machine contract + code templates.
│   │   ├── _schema/
│   │   │   ├── component.schema.json # JSON schema all component.json files validate against.
│   │   │   └── frontmatter.schema.json # YAML frontmatter schema for component.md.
│   │   ├── button/
│   │   │   ├── component.md          # Human-readable spec. Frontmatter + sections.
│   │   │   ├── component.json        # Machine contract. Props, variants, a11y, do/don't.
│   │   │   ├── examples/
│   │   │   │   ├── primary.tsx       # Copy-paste-ready React.
│   │   │   │   ├── primary.swift     # SwiftUI.
│   │   │   │   ├── primary.kt        # Compose.
│   │   │   │   └── primary.liquid    # Shopify section.
│   │   │   └── anatomy.svg           # Optional. Labeled SVG for human readers.
│   │   ├── input/
│   │   ├── card/
│   │   ├── dialog/
│   │   └── README.md                 # Component index. Auto-generated from component.json files.
│   │
│   ├── 03-platforms/                 # Platform-specific guidance (HOW to consume tokens).
│   │   ├── web-react/
│   │   │   ├── README.md             # Setup: Tailwind v4 + shadcn flow.
│   │   │   ├── components.json       # shadcn config pointed at /_registry/.
│   │   │   └── theme.css             # Symlinked from _build/tailwind/theme.css.
│   │   ├── react-native/
│   │   │   ├── README.md             # NativeWind + react-native-reusables setup.
│   │   │   └── tailwind.config.js
│   │   ├── ios-native/
│   │   │   ├── README.md             # SwiftUI consumption of LumenTokens.swift.
│   │   │   └── examples/
│   │   ├── android-native/
│   │   │   ├── README.md             # Compose consumption of LumenTokens.kt.
│   │   │   └── examples/
│   │   ├── desktop-mac/              # AppKit / SwiftUI for macOS.
│   │   │   └── README.md
│   │   ├── desktop-windows/          # WinUI / WPF.
│   │   │   └── README.md
│   │   ├── shopify-liquid/
│   │   │   ├── README.md             # css-variables.liquid snippet usage.
│   │   │   └── snippets/
│   │   ├── bigcommerce-stencil/
│   │   │   └── README.md
│   │   └── woo-wordpress/
│   │       └── README.md
│   │
│   └── 04-content/                   # Content design rules.
│       ├── error-messages.md
│       ├── microcopy.md
│       └── ui-writing-style.md
│
├── _registry/                        # === SHADCN-COMPATIBLE REGISTRY ===
│   ├── registry.json                 # Index of all components, follows shadcn schema.
│   ├── button.json                   # registry-item.json per shadcn spec.
│   ├── input.json
│   ├── card.json
│   └── dialog.json
│
├── _meta/                            # === LLM-ONLY METADATA ===
│   ├── glossary.json                 # Term → canonical definition. For agent disambiguation.
│   ├── decisions/                    # ADRs. Why we chose OKLCH, why semver, etc.
│   │   ├── 0001-dtcg-format.md
│   │   ├── 0002-style-dictionary.md
│   │   └── 0003-shadcn-registry.md
│   └── prompts/                      # Reusable prompt fragments for agent workflows.
│       ├── new-component.md          # "When asked to create a new component, follow these steps..."
│       ├── token-update.md
│       └── platform-port.md
│
└── _build/                           # === GITIGNORED. Generated by Style Dictionary. ===
    ├── css/tokens.css
    ├── tailwind/theme.css
    ├── ts/tokens.ts
    ├── ios/LumenTokens.swift
    ├── android/colors.xml
    ├── android/dimens.xml
    ├── compose/LumenTokens.kt
    ├── flutter/lumen_tokens.dart
    ├── liquid/css-variables.liquid
    └── json/tokens.flat.json
```

**Note on the existing `design-system/` skeleton:** you already have `00-foundations`, `01-tokens`, `02-components`, `03-platforms`, `04-content`. Keep all five. The additions are siblings (`_registry/`, `_meta/`, `_build/`) and the contract files at root.

## LLM contract surfaces

Layered approach — each file does one job. Agents look at the most-specific file they recognize and fall back to the more-generic ones.

### `/llms.txt` — root index

Per the llmstxt.org spec (Jeremy Howard, Sept 2024). H1 + blockquote + curated link list. **The single most important file for any LLM-driven discovery.**

```markdown
# Lumen — Warp's Design System

> Lumen is Warp's vertically-integrated UI design system spanning web (Next.js + Tailwind v4 + shadcn), React Native, native iOS/Android, native desktop, and e-commerce themes (Shopify, BigCommerce, Woo). Tokens are DTCG JSON; build pipeline is Style Dictionary v5; component contracts follow the shadcn registry spec.

Read these in order if you are an AI coding agent:

## Core
- [AGENTS.md](/AGENTS.md): Universal agent rules. Read this first.
- [Token taxonomy](/design-system/01-tokens/README.md): How primitive/semantic/component tokens are organized and named.
- [Component schema](/design-system/02-components/_schema/component.schema.json): JSON schema for every component contract.
- [Registry index](/_registry/registry.json): All components, shadcn-compatible.

## Foundations
- [Principles](/design-system/00-foundations/principles.md)
- [Accessibility](/design-system/00-foundations/accessibility.md): WCAG 2.2 AA. Non-negotiable.

## Components (machine-readable)
- [Button](/_registry/button.json)
- [Input](/_registry/input.json)
- [Card](/_registry/card.json)

## Platforms
- [Web (Next.js + Tailwind v4 + shadcn)](/design-system/03-platforms/web-react/README.md)
- [React Native (NativeWind + react-native-reusables)](/design-system/03-platforms/react-native/README.md)
- [iOS native (SwiftUI)](/design-system/03-platforms/ios-native/README.md)
- [Android native (Compose)](/design-system/03-platforms/android-native/README.md)
- [Shopify Liquid](/design-system/03-platforms/shopify-liquid/README.md)

## Optional
- [Decisions / ADRs](/_meta/decisions/)
- [Prompt fragments](/_meta/prompts/)
- [Changelog](/CHANGELOG.md)
```

### `/llms-full.txt` — inlined version

Same structure, but with the contents of the linked files concatenated under each entry. For agents that only do one fetch.

### `/AGENTS.md` — cross-tool agent rules

Per the agents.md spec (stewarded by the Linux Foundation's Agentic AI Foundation). 25+ tools recognize this file. **This is the universal contract.**

```markdown
# AGENTS.md — Lumen Design System

## What this repo is
Lumen is the source of truth for Warp's UI. It contains design tokens (DTCG JSON), component contracts (JSON + Markdown), and platform consumption guides. It does NOT contain shipped product code.

## Hard rules
1. Never invent tokens. If you need a value not in `01-tokens/semantic/`, ask the user or open a token-request issue. Do not hardcode hex values, pixel sizes, or font stacks anywhere in component code.
2. Always reference SEMANTIC tokens, never primitives. `color.surface.default`, not `color.gray.50`.
3. Every component you generate MUST validate against `/design-system/02-components/_schema/component.schema.json`.
4. Every component MUST include a `component.json` machine contract before any code template.
5. Accessibility is WCAG 2.2 AA. Every interactive element needs visible focus, ≥4.5:1 text contrast, keyboard reachability, and an accessible name.
6. Use the platform-appropriate code template from `02-components/{name}/examples/`. Do not invent a new pattern.

## Setup commands
- Install dev deps: `pnpm install`
- Build tokens: `pnpm build` (runs Style Dictionary, outputs to `_build/`)
- Validate: `pnpm validate` (JSON schemas + DTCG lint)
- Generate registry: `pnpm registry` (rewrites `_registry/*.json` from component sources)

## Where things live
- Tokens (source): `design-system/01-tokens/`
- Tokens (built outputs): `_build/` (gitignored — read from CDN or `lumen-dist` repo)
- Component contracts: `design-system/02-components/{name}/component.json`
- Platform guides: `design-system/03-platforms/{platform}/README.md`
- shadcn registry: `_registry/registry.json` and `_registry/{name}.json`

## Code style
- TypeScript strict, no `any`.
- React: function components, hooks, no class components.
- Tailwind v4 only — no v3 config files. Theme lives in `_build/tailwind/theme.css` via `@theme`.
- iOS: SwiftUI for new code. AppKit only for macOS-specific desktop.
- Android: Jetpack Compose. No XML layouts for new components.

## Changelog & PR conventions
- Conventional Commits.
- Token changes: `feat(tokens):`, `fix(tokens):`, `chore(tokens):` — minor/patch decided by deprecation rules below.
- Component changes: `feat(button):`, `fix(button):`.
- Add a changelog entry under the matching Keep-a-Changelog category (Added/Changed/Deprecated/Removed/Fixed/Security) in CHANGELOG.md.

## Deprecation policy
- Mark tokens deprecated by setting `"$deprecated": "Replaced by {new.token.path} in v1.5.0. Will be removed in v2.0.0."` on the token.
- Mark components deprecated by setting `"deprecated": true` and `"deprecationNotice": "..."` in component.json.
- A deprecation lives ≥1 minor release before removal.

## Trust levels (for autonomous agents)
- AUTOMERGE: typo fixes in MD, dead-link fixes, missing alt text on SVGs.
- DRAFT-PR: new components matching the schema, new platform examples, token additions.
- HUMAN-REVIEW: token rename or removal, schema changes, breaking changes to `component.json`, anything that bumps major version.
```

### `/CLAUDE.md` — Claude-specific addenda

Short. Just things that differ from AGENTS.md for Claude (skill invocations, MCP server hints, vault hooks if Warp uses Obsidian).

```markdown
# CLAUDE.md — Lumen-specific overrides for Claude

Read AGENTS.md first. Everything there applies. Additions below:

- When generating components, use the `ui-styling` skill if available (Tailwind/shadcn/Radix expertise).
- When the user asks "what does X look like", run a 3-tool parallel: read the component.json, read the component.md, read the matching example file.
- Cite token paths with backticks: `color.surface.default`, never copy raw values into prose.
```

### `/.cursor/rules/lumen.mdc` and `/.warp/lumen.mdc`

Mirror AGENTS.md content. Cursor and Warp don't yet read AGENTS.md natively in all flows — give them their own copies. Keep these auto-generated from AGENTS.md by a script so they don't drift.

### `/_registry/registry.json` — shadcn-compatible

Per the [shadcn registry spec](https://ui.shadcn.com/docs/registry/registry-json). Required fields: `$schema`, `name`, `homepage`, `items[]`. Each item is a `registry-item.json` reference.

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "lumen",
  "homepage": "https://lumen.warp.dev",
  "items": [
    {
      "$schema": "https://ui.shadcn.com/schema/registry-item.json",
      "name": "button",
      "type": "registry:ui",
      "title": "Button",
      "description": "Primary, secondary, and tertiary button. Supports icons, loading state, and async actions.",
      "dependencies": ["@radix-ui/react-slot"],
      "registryDependencies": [],
      "files": [
        { "path": "design-system/02-components/button/examples/primary.tsx", "type": "registry:ui", "target": "components/ui/button.tsx" }
      ],
      "cssVars": {
        "light": { "button-primary-bg": "var(--color-action-primary)" },
        "dark":  { "button-primary-bg": "var(--color-action-primary)" }
      },
      "meta": {
        "lumenVersion": "1.4.2",
        "platforms": ["web-react", "react-native"],
        "specPath": "design-system/02-components/button/component.json"
      }
    }
  ]
}
```

This makes the entire system installable via `npx shadcn add @lumen/button` from any consumer repo, and queryable via the shadcn MCP server.

## Component documentation conventions

Every component lives in `design-system/02-components/{name}/` and contains BOTH a markdown spec AND a JSON contract. They serve different audiences but **must stay in sync** (CI script validates this).

### `component.md` — human-readable, MDX-compatible

Mandatory frontmatter, mandatory sections in canonical order:

```markdown
---
name: Button
type: component
status: stable                       # stable | beta | experimental | deprecated
version: 1.4.2
since: 1.0.0
deprecated: false
platforms: [web-react, react-native, ios-native, android-native, shopify-liquid]
a11y_level: WCAG-2.2-AA
related: [IconButton, Link, Toggle]
spec: ./component.json
last_updated: 2026-05-02
---

# Button

> A button triggers an action. It's the primary way users commit to a decision in a flow.

## When to use
- Submitting a form.
- Confirming a destructive action (use `intent="danger"`).
- Triggering a navigation that mutates state.

## When NOT to use
- For pure navigation between pages — use `Link` instead.
- For binary on/off state — use `Toggle`.
- For low-emphasis tertiary actions inside dense tables — use `IconButton` with a tooltip.

## Anatomy
1. Container
2. Leading icon (optional)
3. Label (required, ≥1 char)
4. Trailing icon (optional)
5. Loading spinner (renders in place of leading icon when `loading=true`)

![Anatomy diagram](./anatomy.svg)

## Variants
- `intent`: `primary` | `secondary` | `tertiary` | `danger`
- `size`: `sm` | `md` | `lg`
- `width`: `auto` | `full`

## States
Rest, hover, focus-visible, active, disabled, loading.

## Accessibility
- Renders as `<button type="button">` by default. Use `as="a"` only when navigating.
- Visible focus ring uses `--color-focus-ring`. Do not remove.
- Disabled state has `aria-disabled="true"` and `pointer-events: none`. Loading state announces via `aria-busy="true"`.
- Minimum touch target 44×44px on mobile, regardless of `size`.

## Do
- Use one primary button per view.
- Lead with a verb in the label: "Save changes", "Delete account".
- Pair `danger` intent with a confirmation dialog.

## Don't
- Don't stack three primary buttons in a row.
- Don't use sentence case ("Save Your Changes") — use sentence case ("Save your changes").
- Don't disable a button without explaining why.

## Code

See platform-specific examples in `./examples/`. Machine-readable props are in [./component.json](./component.json).

## Changelog
- 1.4.2: Added `loading` prop with spinner.
- 1.2.0: Renamed `kind` prop to `intent`. `kind` deprecated, removed in 2.0.0.
```

### `component.json` — machine contract

This is what LLMs and the MCP server consume. Validates against `_schema/component.schema.json`.

```json
{
  "$schema": "../_schema/component.schema.json",
  "name": "Button",
  "version": "1.4.2",
  "status": "stable",
  "deprecated": false,
  "summary": "A button triggers an action.",
  "props": {
    "intent": {
      "type": "enum",
      "values": ["primary", "secondary", "tertiary", "danger"],
      "default": "secondary",
      "description": "Visual emphasis. Use 'primary' for the single most important action in a view."
    },
    "size": {
      "type": "enum",
      "values": ["sm", "md", "lg"],
      "default": "md"
    },
    "width": {
      "type": "enum",
      "values": ["auto", "full"],
      "default": "auto"
    },
    "leadingIcon": { "type": "icon", "optional": true },
    "trailingIcon": { "type": "icon", "optional": true },
    "loading": { "type": "boolean", "default": false, "description": "Replaces leading icon with spinner. Disables onClick." },
    "disabled": { "type": "boolean", "default": false },
    "onClick": { "type": "handler", "optional": false }
  },
  "tokens": {
    "consumed": [
      "color.action.primary.bg",
      "color.action.primary.fg",
      "color.action.primary.bg.hover",
      "color.focus.ring",
      "space.inline.sm",
      "radius.control.md",
      "type.body.md",
      "motion.transition.fast"
    ]
  },
  "a11y": {
    "role": "button",
    "keyboard": ["Enter activates", "Space activates", "Tab moves focus"],
    "minTouchTarget": "44x44",
    "wcag": ["2.4.7 Focus Visible", "2.5.5 Target Size", "1.4.3 Contrast"],
    "rules": [
      "Visible focus ring required. Do not remove.",
      "Disabled state must use aria-disabled, not disabled attribute, when used inside a form.",
      "Loading state must set aria-busy=true."
    ]
  },
  "rules": {
    "do": [
      "Use one primary button per view.",
      "Lead with a verb in the label."
    ],
    "dont": [
      "Don't stack three primary buttons in a row.",
      "Don't disable a button without explaining why.",
      "Don't use this for pure navigation — use Link."
    ]
  },
  "examples": {
    "web-react": "./examples/primary.tsx",
    "react-native": "./examples/primary.rn.tsx",
    "ios-native": "./examples/primary.swift",
    "android-native": "./examples/primary.kt",
    "shopify-liquid": "./examples/primary.liquid"
  },
  "related": ["IconButton", "Link", "Toggle"],
  "changelog": [
    { "version": "1.4.2", "type": "Added", "note": "loading prop" },
    { "version": "1.2.0", "type": "Deprecated", "note": "kind prop renamed to intent" }
  ]
}
```

**Why two files?** Diana Wolosin (Indeed) benchmarked this in 2026: JSON metadata cuts agent token consumption ~80% vs Markdown. Markdown is what LLMs train on most fluently for prose, but for structured data (props, enums, a11y rules), JSON's explicit keys eliminate ambiguity. So: prose stays MD, contract stays JSON, both are kept in sync by CI.

## Cross-platform token translation

One DTCG source → eight outputs. Style Dictionary v5 has predefined formats for every target except Shopify Liquid (use `css/variables` and add the `.liquid` extension; Shopify processes Liquid in `.css.liquid` files).

| Target platform | Source | Output | Style Dictionary format | Consumer pattern |
|---|---|---|---|---|
| Web CSS variables | DTCG | `_build/css/tokens.css` | `css/variables` | `<link>` or `@import` in app stylesheet |
| Tailwind v4 `@theme` | DTCG | `_build/tailwind/theme.css` | `css/variables` (custom selector `@theme`) | `@import "./theme.css"` in app's main CSS |
| TypeScript constants | DTCG | `_build/ts/tokens.ts` | `typescript/es6-declarations` | `import { tokens } from '@lumen/tokens'` |
| iOS Swift class | DTCG | `_build/ios/LumenTokens.swift` | `ios-swift/class.swift` | Dropped into Swift Package or Xcode project |
| Android XML | DTCG | `_build/android/colors.xml`, `dimens.xml` | `android/colors`, `android/dimens` | Copied into `res/values/` |
| Android Compose | DTCG | `_build/compose/LumenTokens.kt` | `compose/object` | Imported as Kotlin object |
| Flutter Dart | DTCG | `_build/flutter/lumen_tokens.dart` | `flutter/class.dart` | Imported as Dart class |
| Shopify Liquid CSS | DTCG | `_build/liquid/css-variables.liquid` | `css/variables` | Renamed to `css-variables.liquid`, included in `theme.liquid` `<head>` |
| Flat JSON (any) | DTCG | `_build/json/tokens.flat.json` | `json/flat` | Universal fallback for tools that don't know DTCG |

For dark mode and accessibility variants: Style Dictionary v5 supports multiple themes via separate config blocks or the `@tokens-studio/sd-transforms` preprocessor. Each mode produces its own selector:

```css
/* _build/tailwind/theme.css */
@theme {
  --color-surface: oklch(0.99 0 0);   /* light */
}
.dark {
  --color-surface: oklch(0.18 0 0);   /* dark */
}
.hc-light {
  --color-surface: #ffffff;            /* high-contrast light */
}
```

For React Native: Style Dictionary outputs a TypeScript module that NativeWind consumes via `tailwind.config.js`. NativeCN and react-native-reusables (founded-labs) both follow this pattern in 2026.

For native desktop (Mac/Windows): Mac uses the iOS Swift output directly via shared Swift Package. Windows uses a generated WinUI XAML resource dictionary — not a Style Dictionary built-in, so add a custom format (~30 lines of TS). For now, the JSON flat output + a small WinUI consumer script is enough.

## Lessons from best-in-class systems

1. **From Primer (GitHub):** Three-layer token taxonomy (primitive → semantic → component) and the rule "**never use raw values, only semantic tokens**" enforced via lint. Their `DESIGN_TOKENS_GUIDE.md` uses RFC 2119 (MUST/SHOULD/NEVER) keywords — copy this verbatim. Tokens are JSON5 source, Style Dictionary build, multi-mode (light/dark/high-contrast/tritanopia/colorblind). Their package is `@primer/primitives` v11.7.1 (April 2026).

2. **From Material 3 / Atlassian:** Components documented with consistent **canonical section order** (Anatomy, Variants, States, Accessibility, Do, Don't, Code, Related). The order matters — LLMs do better with predictable structure than with rich-but-variable layouts. Bake this into a JSON schema and validate every `component.md` frontmatter on CI.

3. **From Carbon (IBM):** Tabbed structure (Usage / Style / Code / Accessibility) per component. We collapse this into the single `component.md` + `component.json` pattern (LLMs don't have tabs; humans get them via the eventual docs site rendering MD). But the **separation of concerns** is the lesson — don't mix style guidance into prop docs.

4. **From Google Stitch's DESIGN.md (March 2026):** Combined YAML frontmatter (machine tokens) + Markdown prose (rationale) in one file is elegant for foundations, but it scales poorly for full components with deep prop schemas. **Use DESIGN.md ONLY for the brand/foundation file** (`design-system/00-foundations/design.md`) — use JSON sidecar for components. The Apache-licensed `@google/design.md` CLI (`lint`, `diff`, `export to Tailwind/DTCG`) is worth adopting for foundation linting.

5. **From shadcn:** Copy-paste over npm install. **Don't publish Lumen as an npm package.** Publish it as a shadcn-compatible registry. Consumer teams run `npx shadcn add @lumen/button`, get the code in their repo, can modify freely. This is the fastest-growing distribution model in 2026 because it removes version-lock pain and AI agents understand it natively.

## Versioning, changelog, deprecation

**Versioning: semver** (`MAJOR.MINOR.PATCH`). Calver was rejected — semver communicates breakage clearly to consumers. Apply at the **whole-system level**, not per component. (Component-level semver was Sparkbox/Lerna's old pattern; in 2026 the consensus has shifted back to single-version because design systems are tightly coupled by tokens.)

| Change | Bump | Example |
|---|---|---|
| MAJOR | Token removed, prop removed, component removed, breaking schema change | `color.brand.500` deleted; `Button.kind` removed |
| MINOR | New token, new prop, new component, deprecation announced | New `Toaster` component; new `loading` prop on Button |
| PATCH | Bug fix, doc fix, accessibility fix that doesn't change API | Fix focus ring color; fix Compose token name |

**Changelog: Keep-a-Changelog** in `CHANGELOG.md`. Sections: Added, Changed, Deprecated, Removed, Fixed, Security. Append on every PR. Auto-promote `## [Unreleased]` to a versioned heading on tagged release via `.github/workflows/changelog.yml`.

**Deprecation policy (one-minor-release rule):**
1. Mark token deprecated in source: `"$deprecated": "Use {color.surface.default} instead. Removed in v2.0.0."` Style Dictionary v5 surfaces this in build output as a warning.
2. Mark component prop deprecated in `component.json`: `"deprecated": true, "deprecationNotice": "...", "removedIn": "2.0.0"`.
3. Add a `## [Deprecated]` entry to CHANGELOG.md.
4. Wait at least one MINOR release before removing.
5. Remove in next MAJOR.

**Schema changes:** Bumping the `_schema/component.schema.json` is always at least MINOR (adds optional field) or MAJOR (adds required field, removes field, changes type). Never PATCH.

**For a small in-house team:** don't try to ship every two weeks. Aim for a MINOR every 4–6 weeks, MAJOR once a year, PATCH as needed. The discipline that matters is the deprecation grace period — never break consumers without warning.

## Sources

★ = primary spec / authoritative source

1. ★ [W3C Design Tokens Format Module 2025.10 (preview draft, April 2026)](https://www.designtokens.org/tr/drafts/format/) — DTCG JSON format, types, references, composite tokens.
2. ★ [llmstxt.org — /llms.txt specification](https://llmstxt.org) — Jeremy Howard, September 2024. The root index file format.
3. ★ [agents.md — AGENTS.md specification](https://agents.md) — Linux Foundation Agentic AI Foundation. Cross-tool agent rules. 25+ tool support.
4. ★ [shadcn registry-item.json schema](https://ui.shadcn.com/docs/registry/registry-item-json) — Required fields, type taxonomy (registry:ui, registry:component, registry:block, etc.), full example.
5. ★ [shadcn MCP Server documentation](https://ui.shadcn.com/docs/mcp) — Browse / search / install components via MCP. Registry URL pattern `https://acme.com/r/{name}.json`.
6. ★ [Style Dictionary v5 — predefined formats reference](https://styledictionary.com/reference/hooks/formats/predefined/) — Full list of CSS, SCSS, JS, TS, iOS Swift, Android, Compose, Flutter formats.
7. ★ [Style Dictionary v5.4.0 release notes (March 2025)](https://github.com/style-dictionary/style-dictionary/releases) — DTCG v2025.10 dimension support, OKLCH/OKLab/P3/LCH transformers. Actively maintained.
8. ★ [Tailwind CSS v4 — Theme variables documentation](https://tailwindcss.com/docs/theme) — `@theme` directive, namespace mapping (--color-*, --spacing-*, --radius-*), CSS-only config.
9. ★ [GitHub Primer Primitives — DESIGN_TOKENS_GUIDE.md](https://github.com/primer/primitives/blob/main/DESIGN_TOKENS_GUIDE.md) — Three-layer taxonomy, RFC 2119 enforcement, shorthand token rules.
10. ★ [GitHub Primer Primitives repo](https://github.com/primer/primitives) — JSON5 source, Style Dictionary build, multi-mode (light/dark/high-contrast/tritanopia), v11.7.1 April 2026.
11. ★ [DESIGN.md specification — designmd.app](https://designmd.app/en/what-is-design-md) — Google Stitch, March 2026. YAML frontmatter + MD prose. Apache 2.0. `@google/design.md` CLI.
12. [Into Design Systems — Design Systems MCP: The Complete Guide (2026)](https://www.intodesignsystems.com/design-systems-mcp) — Tool surface for a design-system MCP, JSON metadata pattern, always-on vs on-demand foundations.
13. [Into Design Systems — Your Design System Is Not Ready for AI Agents](https://www.intodesignsystems.com/blog/design-system-not-ready-for-ai-agents) — JSON cuts agent token cost 80%; Diana Wolosin / Indeed pipeline; trust-level frameworks.
14. [Mavik Labs — Design Tokens That Scale in 2026 (Tailwind v4 + CSS Variables)](https://www.maviklabs.com/blog/design-tokens-tailwind-v4-2026/) — `@theme` vs `:root`, runtime mode swapping.
15. [Tailwind CSS v4 launch post](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first config, theme variables.
16. [react-native-reusables (founded-labs) on GitHub](https://github.com/founded-labs/react-native-reusables) — shadcn-style components for React Native via NativeWind.
17. [NativeCN](https://www.nativecn.xyz/) — React Native shadcn analog, MIT, NativeWind-based.
18. [Shopify Slate — Styles with Liquid](https://shopify.github.io/slate/docs/styles-with-liquid) — `.css.liquid` pattern for Shopify-side CSS variable injection.
19. [Semantic Versioning 2.0.0](https://semver.org) — Canonical semver spec.
20. [zeroheight — A Guide to Maintaining an Effective Changelog for a Design System](https://help.zeroheight.com/hc/en-us/articles/36441157817243-A-Guide-to-Maintaining-an-Effective-Changelog-for-a-Design-System) — Keep-a-Changelog applied to design systems.
21. [Nathan Curtis (EightShapes) — Versioning Design Systems](https://medium.com/eightshapes-llc/versioning-design-systems-48cceb5ace4d) — Single-version vs per-component, deprecation discipline.
22. [Tokens Studio — Style Dictionary V4 release plans](https://tokens.studio/blog/style-dictionary-v4-plan) — DTCG-first direction for Style Dictionary's evolution.

## Method

Sourced primary specs (DTCG 2025.10, llmstxt.org, agents.md, shadcn registry, Style Dictionary v5, Tailwind v4 `@theme`) directly from each project's official documentation, then cross-referenced against established design systems (Primer, Material 3, Carbon, Atlassian, Geist) and 2026 practitioner accounts (Indeed/Diana Wolosin's MCP work, Google Stitch's DESIGN.md). Recommendations privilege current standards over speculative ones, and prefer the simplest concrete option that meets the user's full platform spread without over-engineering for a small in-house team.
