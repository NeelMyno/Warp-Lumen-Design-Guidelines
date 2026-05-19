# USING-LUMEN.md — the comprehensive end-to-end guide

> **Single-source-of-truth document for everything Lumen.** If you read only one file in this repo, read this one. Built for AI coding agents (Claude Code, Cursor, Codex, Copilot, Devin, Warp Terminal AI) and the humans working alongside them. Comprehensive, vertically integrated, LLM-first. Status: v0.14.0 · 2026-05-19.

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
- [§5. Component catalog — all 98](#5-component-catalog--all-98)
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
Lumen v0.14.0 — Premium Psychology · Obsidian (mint retired) · R8b critical-CSS inlining for LCP round-trip elimination (ADR 0028) on top of v0.13.4 R8a Satoshi-subset (ADR 0027), v0.13.3 R7 pipeline-state + mobile-perf baseline (ADR 0026), v0.13.2 R6 LLM-docs SSoT (ADR 0025), v0.13.1 responsive safety net (ADR 0024), v0.13.0 LLM-docs lockstep (ADR 0023), v0.12.x primitive cascade
─────────────────────────────────────────────────────────────────────────
Brand
  Accent           #00FA8A  — Spring Green. Action / live / success only. Unchanged from v0.11.
  Dark canvas      #0D0D0D  — Neutral obsidian. R = G = B at every dark stop. (v0.12 — was #171A18 with G+2 undertone in v0.11.)
  Light anchor     #E6E6E6  — Neutral light. Also primary text on dark.
  Paper canvas     #FAFAFA  — Cool-neutral off-white. Light theme default.
  Accent foreground #07120D — Near-black on accent surface (14.7:1 AAA on spring green).

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

Defensive primitive contracts (v0.12.x — encode these when generating new code)
  Glow ladder      Primary CTA rest 16px a25 → hover 20px a28 → active 8px a20 (v0.12.2 hover dialed down)
  Card corner-clip <Card padding="none"> auto-clips edge-touching children to the rounded corner (v0.12.1 — ADR 0021)
  TabsList pill    overflow-hidden so active pill clips to parent rounded shape (v0.12.4 — sibling pattern at smaller scale)
  Floating UI      Combobox / Popover / Dropdown / Tooltip / Calendar portal to document.body via createPortal + position:fixed (v0.12.4)
  Focus rings      outline 2px lime-a64 + offset 1px PLUS soft box-shadow halo, never box-shadow alone (v0.12.4)
  Position math    Inline style.left / style.transform with native transition; never Tailwind translate-x-[Npx] (v0.12.3 — ADRs 0015/0016 cascade)
  Version SSoT     Every user-facing version label imports from @/lib/version; never hardcoded literals (v0.12.5 — closes v0.11.13 palette-footer drift)
  Accordion marker <summary class="lumen-summary"> suppresses the native browser disclosure triangle when composing your own end-of-summary chevron (v0.12.5)
  Icon hover       Interactive icon tiles hover to text-accent + border-accent (teaches "green at action" visually; v0.12.5)
  Peak-card hover  Peak-moment cards (pricing tiers, plan pickers) lift on hover via shadow-md + border-default + -translate-y-[1px]; highlighted gets soft accent glow (v0.12.5)

Status
  v0.12.0          Obsidian recolor — mint retired. Canvas neutral at #0D0D0D, R = G = B at every dark stop. Single-accent rule unchanged. (ADR 0020)
  v0.12.1          Card corner-clip contract — <Card padding="none"> auto-clips edge-touching children to the rounded shape. (ADR 0021)
  v0.12.2          Primary-button hover bloom dialed down. Rest unchanged at 0 0 16px lime-a25 (brand voice). Hover trims to 0 0 20px lime-a28. (ADR 0022)
  v0.12.3          PricingToggle thumb-escape fix. Tailwind v4 arbitrary-translate fragility retired on the last two callers (PricingToggle + SwipeAction) — position math now uses inline style.left + native transition, not translate-x-[Npx] arbitrary class. Cascade-fix to ADRs 0015/0016 (no new ADR — same pattern those ADRs already established).
  v0.12.4          Three primitive-layer fixes. (1) InlineTabs pill TabsList gains overflow-hidden — corner-clip pattern from ADR 0021 extended to smaller-control scale. (2) Combobox dropdown migrates from inline <div absolute> to createPortal(<div fixed>, document.body) with getBoundingClientRect tracking — escapes ancestor overflow contexts. (3) Global :focus-visible gains outline 2px lime-a64 + offset 1px on top of existing soft box-shadow halo — outline immune to ancestor overflow:hidden, closes the v0.12.1 ADR-0021 pagination-focus regression. The .lumen-btn-primary:focus-visible dual-ring is unaffected (declares outline:none and wins via specificity per ADR 0016). No new ADR by design — consequential follow-ups to ADRs 0007 + 0015/0016 + 0021.
  v0.12.5          Live-audit fix pack — five surgical fixes from a two-round visual audit against the deployed Vercel site. (1) New audit-dashboard/src/lib/version.ts hoists the user-facing version label to a single constant (LUMEN_VERSION + MAJOR_MINOR variants); every consumer (header pill, footer line, palette footer, foundations brand-voice samples, library / tool / foundations badges) reads from it; release script bumps lib/version.ts in lockstep with the root VERSION file; closes the v0.11.13 palette-footer drift the audit caught on round 2. (2) Iconography hover lifts icon glyph to text-accent + tile border to border-accent (teaches "green at action" visually). (3) Pricing card peak-end hover lift on landing — non-highlighted: shadow-md + border-default + -translate-y-[1px]; highlighted Operator: layered soft accent glow. (4) Landing FAQ disclosure caret migrates from Unicode ▾ to lucide ChevronDown; new globals.css .lumen-summary + summary.list-none rule suppresses native browser disclosure marker on every browser. (5) Privacy scrub — real-person names retired from 9 sites in 5 files (ai.tsx CommentThread, foundations Avatar demos, saas TopBar, commerce review fixture, library Avatar / AvatarGroup / Reaction-bar) — replaced with synthetic operator names (Avery Mercer / Kai Morgan). No new ADR — consequential follow-ups to ADRs 0007 + 0009 + 0018.
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
│   98 components, each with .md + .json + per-platform        │
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

**The skip-no-tiers rule.** A component must reference semantic tokens, never primitives. A platform must reference components + semantic tokens, never primitives. A consumer product pulls from the platform tier and never reaches into Lumen's source. This is the master→child contract that keeps the system coherent: change one foundation principle → tokens cascade → components cascade → platforms cascade → consumers cascade. Skip a tier and you create a sibling, not a child. The v0.12.x patch series shows the cascade pattern in action across five different cascade depths:

- **v0.12.0 — token band.** Retunes 11 brand-ramp primitive values + the runtime CSS ramp. Every component / platform / consumer that consumed `color.surface.{role}` automatically inherits the neutral canvas. ADR 0020 carries the rationale.
- **v0.12.1 — primitive band.** Adds one CSS class (`overflow-hidden`) to one Card primitive `padding="none"`. Every `<Card padding="none">` consumer is fixed without per-site overrides; the `/commerce` page even sheds its hand-added local workaround. ADR 0021 carries the contract.
- **v0.12.2 — token + layered-halo band.** Retunes one shadow token and one `@media hover` layered-halo block. Every `intent="primary"` button across the system inherits the quieter hover bloom — no per-CTA overrides. ADR 0022 carries the rationale.
- **v0.12.3 — consumer-component band.** Retires the Tailwind v4 arbitrary-translate idiom on the last two callers (PricingToggle in `commerce.tsx` + SwipeAction in `mobile.tsx`). Cascade-fix to ADRs 0015/0016 — same defensive-pattern reasoning that retired shadcn bridge utilities for buttons (`bg-primary` → `.lumen-btn-primary`) now retires arbitrary-translate utilities for toggle/swipe position math. The fix lives at the consumer-component level (not the primitive layer) because both callers are themselves consumer primitives — they don't compose a deeper "track + thumb" primitive that other components consume. The fragility was in the position-math idiom, not in a shared primitive layer; fixing both callers in-place retires the broken pattern with the smallest blast radius. No new ADR (the pattern is exactly the one ADRs 0015/0016 established).
- **v0.12.4 — primitive + globals band.** Three structural fixes at three different cascade depths in one commit: (a) one-line `overflow-hidden` addition to the InlineTabs pill `TabsList` (extends ADR 0021 corner-clip to smaller-control scale); (b) Combobox dropdown migrates from inline `<div absolute>` to `createPortal(<div fixed>, document.body)` with `getBoundingClientRect()` tracking — escapes every ancestor's overflow context (Showcase, `<Card padding="none">`, glass surfaces, scroll containers); (c) global `:focus-visible` rule extended with `outline 2px solid lime-a64; outline-offset: 1px;` on top of the existing soft box-shadow halo — outline paints outside the layout box and is structurally immune to ancestor `overflow: hidden`, so focus rings stay visible inside corner-clipped containers (closes the v0.12.1 ADR-0021 pagination-focus regression). The `.lumen-btn-primary:focus-visible` dual-ring is unaffected — declares `outline: none` and wins via CSS specificity. No new ADR (consequential follow-ups to ADRs 0007 + 0015/0016 + 0021).
- **v0.12.5 — five-band live-audit fix pack.** Surgical fixes at five different cascade depths in one commit, every fix earned by a two-round live visual audit against the deployed Vercel site (round 1 walks routes statically; round 2 triggers every overlay): (a) **infrastructure band** — new `audit-dashboard/src/lib/version.ts` exporting `LUMEN_VERSION` + `LUMEN_VERSION_MAJOR_MINOR` + `LUMEN_VERSION_MAJOR_MINOR_UPPER`; the runtime UI imports the constant from 7 sites (header pill, footer line, palette footer, foundations brand-voice samples, library / tool / foundations badges); the release script bumps `lib/version.ts` in lockstep with the root `VERSION` file; closes the v0.11.13 → v0.12.4 palette-footer drift the audit caught on round-2 ⌘K open; (b) **micro-interaction band** — iconography hover state (foundations §08) lifts icon glyph to `text-accent` + tile border to `border-accent` so the brand rule "green appears precisely at action" is taught visually; (c) **micro-interaction band** — pricing cards on landing gain peak-end hover lift (non-highlighted: `shadow-md` + `border-default` + `-translate-y-[1px]`; Operator: soft accent glow); the pricing decision is a peak moment per Premium Psychology principle 3, the cards now respond at the moment of decision; (d) **globals band** — landing FAQ disclosure caret migrates from Unicode `▾` to lucide `ChevronDown` for consistency with commerce + tool accordions; new `.lumen-summary` + `summary.list-none` rule in `globals.css` suppresses the native browser disclosure marker (`list-style: none` for modern browsers, `::-webkit-details-marker { display: none }` for pre-2022 webkit) — without it, browsers double up the native triangle with the lucide icon; (e) **fixtures band** — privacy scrub: `Daniel Sokolovsky` / `Neel Tengariya` retired from 9 sites in 5 files (`ai.tsx` CommentThread, `foundations` Avatar / AvatarGroup demos + caption sample, `saas` AvatarGroup, `commerce` review fixture, `library` Avatar / AvatarGroup / Reaction-bar) — replaced with synthetic operator names (`Avery Mercer`, `Kai Morgan`). No new ADR (consequential follow-ups to ADRs 0007 + 0009 + 0018 — the system is already disciplined enough that these fixes don't require new architectural ADRs).

(See [CHANGELOG](CHANGELOG.md) v0.12.0–v0.12.5 entries for the long form of each cascade. The pattern across all six bumps: a user / contributor / live-audit run points at a symptom; the system absorbs the fix at the right architectural depth so future consumers don't need to know the bug existed. v0.12.3 / v0.12.4 / v0.12.5 explicitly ship without ADRs because the underlying patterns — defensive primitives over Tailwind scanner fragility per ADRs 0015/0016, corner-clip contract per ADR 0021, two-file component contract per ADR 0007, single semver per ADR 0009, brand voice per ADR 0018 — are already established. The CHANGELOG entries carry the architectural notes those would-be ADRs would have held. The v0.12.5 entry in particular documents the "single-source-of-truth for renderable strings" pattern and the "custom-chevron suppresses native marker" pattern as new system contracts even without new ADRs.)

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
| [color.md](design-system/00-foundations/color.md) | The four-color floor — accent `#00FA8A`, dark `#0D0D0D` (v0.12 — neutral obsidian, mint retired), light `#E6E6E6`, paper `#FAFAFA`. Plus refined danger / warning. Single accent rule. | Before introducing any new color, surface, or token. |
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
2. **Reference, don't inline.** `var(--surface-canvas)` ✓ — `#0D0D0D` ✗. The lint enforces this.
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

When `color.accent.500` retunes (lime → spring green in v0.11), every link in the chain inherits automatically. The same cascade is what made v0.12.0 a one-edit retune: 11 primitive `color.brand.{stop}` values changed, and every dark surface token inherited the neutral obsidian canvas without a single semantic-alias edit. **Inlining a value at any link breaks inheritance** — that's the v0.12.2 CHANGELOG's entire story (shadow tokens had inlined `rgba(74,222,128,X)` lime instead of referencing `{color.alpha.accent.X}`, so the v0.11 brand recolor never reached them). v0.12.0 sequel: the contrast checker had been hardcoding v0.4 navy/cream/lime values for nine releases — green-checking obsolete pairs the system hadn't shipped since v0.11. Both cases: the inlined value broke the cascade. Both fixes: replace the inline with a token reference.

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

## 5. Component catalog — all 98

98 components in [`_registry/registry.json`](_registry/registry.json), each with `component.md` (human contract), `component.json` (machine contract validating against `_schema/component.schema.json`), and per-platform `examples/{platform}.{ext}` where authored. The shadcn registry sidecars in `_registry/` make every web component installable via `npx shadcn add <registry>/<name>`.

**Lineage:** 35 v0.1–v0.11 baseline (button-family + form-system + foundational primitives), 63 added in v0.12.6 primitive-coverage drop (closes the gap to Apple HIG / Material 3 / Polaris / Atlassian feature surface — Tabs, Breadcrumbs, Pagination, Stepper, DropdownMenu, Tooltip, Popover, Accordion, Divider, Link, Alert, Banner, Spinner, Progress, Skeleton, NotificationCenter, Snackbar, Avatar, Tag, List, CodeBlock, CopyButton, Kbd, Trend, Drawer, Sheet, Panel, Navbar, Sidebar, BottomNav, Toolbar, ActionSheet, PhoneFrame, StatusBar, SwipeAction, PullToRefresh, PermissionPrompt, CoachMark, Carousel, Timeline, Calendar, TreeView, Kanban, DataGrid, Chart, Sparkline, KpiCard, AIPromptInput, AISuggestion, AIBadge, CitationCard, ChatBubble, CommentThread, ReactionBar, PresenceIndicator, Slider, ColorPicker, SearchField, PricingCard, TestimonialCard, LogoCloud, InventoryStatus, CartDrawer). Note: v0.13.1 closed the *content-doc parity gap* for the original v0.1 baseline button-family (5 new `component.md` files + 7 new `examples/primary.tsx` files); no new contracts.

See [`COMPONENT-INDEX.md`](COMPONENT-INDEX.md) for the auto-generated full enumeration with one-line purpose per component. The catalog below organizes by category and includes the short summary from each `component.json`.

**Organized by category:**

### Signature primitives (Warp-specific) (8)
| Component | Purpose |
|---|---|
| [badge](design-system/02-components/badge/component.md) | A small pill that labels status, category, or count. |
| [copy-button](design-system/02-components/copy-button/component.md) | Compact icon-button that writes a value to the clipboard and flashes a confirmation. |
| [icon-button](design-system/02-components/icon-button/component.md) | A square Button containing only an icon. |
| [kbd](design-system/02-components/kbd/component.md) | Inline keyboard-key cue. |
| [live-dot](design-system/02-components/live-dot/component.md) | An 8px green dot with a 2px pulsing ring. |
| [rate-ticker](design-system/02-components/rate-ticker/component.md) | Horizontal marquee of freight lane rates. |
| [stat](design-system/02-components/stat/component.md) | A big bold number with a small uppercase tracked unit and optional delta + sparkline. |
| [trend](design-system/02-components/trend/component.md) | Numeric delta indicator. |

### Buttons + actions (7)
| Component | Purpose |
|---|---|
| [button](design-system/02-components/button/component.md) | Primary action affordance. |
| [button-group](design-system/02-components/button-group/component.md) | A row of joined buttons that share a single rounded outline. |
| [command-palette-button](design-system/02-components/command-palette-button/component.md) | Search-styled trigger that opens the global command palette. |
| [fab](design-system/02-components/fab/component.md) | Floating Action Button — round, fixed-position primary action. |
| [segmented](design-system/02-components/segmented/component.md) | 2–4 mutually exclusive options on one row. |
| [split-button](design-system/02-components/split-button/component.md) | Primary action + dropdown caret in a single joined affordance. |
| [toggle](design-system/02-components/toggle/component.md) | A switch for binary on/off settings. |

### Inputs + forms (v0.6 forms layer + v0.7 deferred completion) (21)
| Component | Purpose |
|---|---|
| [checkbox](design-system/02-components/checkbox/component.md) | Independent boolean. |
| [color-picker](design-system/02-components/color-picker/component.md) | Color selection control. |
| [combobox](design-system/02-components/combobox/component.md) | Searchable single-choice dropdown. |
| [date-picker](design-system/02-components/date-picker/component.md) | Read-only field-shell trigger with leading calendar glyph; click opens a portaled calendar popover. |
| [field](design-system/02-components/field/component.md) | Composition wrapper for a single form control. |
| [file-dropzone](design-system/02-components/file-dropzone/component.md) | Drag-and-drop file input. |
| [form](design-system/02-components/form/component.md) | Semantic form wrapper with dual-mode validation. |
| [input](design-system/02-components/input/component.md) | Single-line text input. |
| [number-input](design-system/02-components/number-input/component.md) | Stepper-flanked numeric input. |
| [otp-input](design-system/02-components/otp-input/component.md) | One-time passcode entry. |
| [password-input](design-system/02-components/password-input/component.md) | Password entry with Show / Hide toggle in the trailing slot. |
| [radio-group](design-system/02-components/radio-group/component.md) | Mutually exclusive single choice from 2+ options. |
| [range-slider](design-system/02-components/range-slider/component.md) | Single-handle or dual-handle bar slider. |
| [search-field](design-system/02-components/search-field/component.md) | Specialized Input variant for search. |
| [select](design-system/02-components/select/component.md) | Single-choice dropdown from a known list of options. |
| [slider](design-system/02-components/slider/component.md) | Single-value range control. |
| [switch](design-system/02-components/switch/component.md) | Binary toggle for an immediate-effect setting. |
| [tags-input](design-system/02-components/tags-input/component.md) | Wrapping chip-row tag entry. |
| [textarea](design-system/02-components/textarea/component.md) | Multi-line text input. |
| [time-picker](design-system/02-components/time-picker/component.md) | Hours/minutes input + am/pm pill toggle on one row inside a field shell. |
| [validation-message](design-system/02-components/validation-message/component.md) | Inline or summary validation message. |

### Feedback + messaging (9)
| Component | Purpose |
|---|---|
| [alert](design-system/02-components/alert/component.md) | Inline, in-flow status block. |
| [banner](design-system/02-components/banner/component.md) | Page-level system state strip. |
| [empty-state](design-system/02-components/empty-state/component.md) | Type-led message for empty collections. |
| [progress](design-system/02-components/progress/component.md) | Two shapes — linear (default; 4 px tall stroke with optional label / value cluster) and circular (a ring; i... |
| [skeleton](design-system/02-components/skeleton/component.md) | Layout-preserving placeholder painted while content loads. |
| [snackbar](design-system/02-components/snackbar/component.md) | Transient, viewport-anchored message with a single trailing action. |
| [spinner](design-system/02-components/spinner/component.md) | Pure CSS rotating-arc loading indicator. |
| [tag](design-system/02-components/tag/component.md) | Compact, often-closable chip for categorizing or filtering. |
| [toast](design-system/02-components/toast/component.md) | A short non-blocking message anchored to a viewport corner. |

### Display + data (14)
| Component | Purpose |
|---|---|
| [avatar](design-system/02-components/avatar/component.md) | User / actor identity image with deterministic name-hashed fallback colors and initials when no image is pr... |
| [calendar](design-system/02-components/calendar/component.md) | Standalone calendar surface. |
| [carousel](design-system/02-components/carousel/component.md) | Horizontally paginated content scroller. |
| [chart](design-system/02-components/chart/component.md) | Generic chart wrapper that consumes Lumen's CHART_PALETTE and chart-token surface (axes, grid, legend, tool... |
| [citation-card](design-system/02-components/citation-card/component.md) | Source reference rendered next to an AI-generated value. |
| [code-block](design-system/02-components/code-block/component.md) | Mono-typeface code display with optional language label, line numbers, copy button, and token highlight. |
| [data-grid](design-system/02-components/data-grid/component.md) | Power-user tabular surface built on Table. |
| [kanban](design-system/02-components/kanban/component.md) | Horizontal board of vertically-stacked KanbanColumns containing KanbanCards. |
| [kpi-card](design-system/02-components/kpi-card/component.md) | A single-metric card. |
| [list](design-system/02-components/list/component.md) | Vertical sequence primitive — semantic <ul>/<ol> with Lumen chrome. |
| [presence-indicator](design-system/02-components/presence-indicator/component.md) | Live state for one or more users on a surface. |
| [sparkline](design-system/02-components/sparkline/component.md) | Inline micro-chart for a single time series. |
| [timeline](design-system/02-components/timeline/component.md) | Chronological sequence of events. |
| [tree-view](design-system/02-components/tree-view/component.md) | Hierarchical node list. |

### Containers + surfaces (10)
| Component | Purpose |
|---|---|
| [card](design-system/02-components/card/component.md) | A bounded surface with a hairline border and optional subtle shadow. |
| [dialog](design-system/02-components/dialog/component.md) | A modal interrupt for confirmation, focused decision, or short-form input. |
| [divider](design-system/02-components/divider/component.md) | Hairline rule that separates content. |
| [drawer](design-system/02-components/drawer/component.md) | Side-anchored panel that slides over the page. |
| [link](design-system/02-components/link/component.md) | Inline text link. |
| [panel](design-system/02-components/panel/component.md) | In-flow collapsible content container. |
| [popover](design-system/02-components/popover/component.md) | Floating panel anchored to a trigger. |
| [sheet](design-system/02-components/sheet/component.md) | Mobile-flavor bottom-anchored modal with optional detents (half / large / full). |
| [table](design-system/02-components/table/component.md) | Operator-density data table. |
| [tooltip](design-system/02-components/tooltip/component.md) | A small, dismissible-on-hover, portaled bubble that names a control or clarifies a value. |

### Navigation (12)
| Component | Purpose |
|---|---|
| [accordion](design-system/02-components/accordion/component.md) | Disclosure list. |
| [action-sheet](design-system/02-components/action-sheet/component.md) | Mobile-only choice sheet. |
| [bottom-nav](design-system/02-components/bottom-nav/component.md) | Mobile-only primary navigation rail anchored to the bottom of the viewport. |
| [breadcrumbs](design-system/02-components/breadcrumbs/component.md) | Where am I, how did I get here, and how do I step back. |
| [dropdown-menu](design-system/02-components/dropdown-menu/component.md) | Reveal a portaled menu of actions or routes from a trigger. |
| [navbar](design-system/02-components/navbar/component.md) | Top app bar — the single highest-level navigation chrome. |
| [notification-center](design-system/02-components/notification-center/component.md) | Inbox of system + user notifications. |
| [pagination](design-system/02-components/pagination/component.md) | Move between fixed-size pages of a list, table, or feed. |
| [sidebar](design-system/02-components/sidebar/component.md) | Vertical primary navigation rail. |
| [stepper](design-system/02-components/stepper/component.md) | Linear multi-step progress affordance for an ordered flow. |
| [tabs](design-system/02-components/tabs/component.md) | Switch between sibling views inside the same destination. |
| [toolbar](design-system/02-components/toolbar/component.md) | A grouped row of interactive controls — buttons, toggle buttons, dropdowns, dividers — sharing a single tab... |

### Mobile-specific (6)
| Component | Purpose |
|---|---|
| [coach-mark](design-system/02-components/coach-mark/component.md) | Onboarding tooltip with a backdrop spotlight (dark scrim with a cut-out around the anchor element). |
| [permission-prompt](design-system/02-components/permission-prompt/component.md) | Pre-prompt that explains WHY the app needs a system permission BEFORE triggering the OS-native dialog. |
| [phone-frame](design-system/02-components/phone-frame/component.md) | Decorative chrome that mocks a phone shell for marketing / showcase / docs. |
| [pull-to-refresh](design-system/02-components/pull-to-refresh/component.md) | Mobile-only refresh-on-pull gesture wrapper. |
| [status-bar](design-system/02-components/status-bar/component.md) | Decorative mobile-platform status-bar row. |
| [swipe-action](design-system/02-components/swipe-action/component.md) | Mobile-only row wrapper that exposes trailing (and optionally leading) actions on horizontal swipe. |

### AI + collaboration (6)
| Component | Purpose |
|---|---|
| [ai-badge](design-system/02-components/ai-badge/component.md) | Inline 'AI generated' / 'AI summary' / 'AI confidence' label. |
| [ai-prompt-input](design-system/02-components/ai-prompt-input/component.md) | AI prompt composer. |
| [ai-suggestion](design-system/02-components/ai-suggestion/component.md) | Inline AI proposal card. |
| [chat-bubble](design-system/02-components/chat-bubble/component.md) | Chat message row. |
| [comment-thread](design-system/02-components/comment-thread/component.md) | Threaded discussion attached to an entity (a row, an annotation marker, a document range). |
| [reaction-bar](design-system/02-components/reaction-bar/component.md) | Emoji reaction row attached to a Comment / ChatBubble / annotation marker. |

### Commerce + marketing (5)
| Component | Purpose |
|---|---|
| [cart-drawer](design-system/02-components/cart-drawer/component.md) | Commerce-flavor Drawer pre-composed as the side cart. |
| [inventory-status](design-system/02-components/inventory-status/component.md) | Stock state chip for ecommerce / fulfillment surfaces. |
| [logo-cloud](design-system/02-components/logo-cloud/component.md) | Social-proof strip of partner / customer logos. |
| [pricing-card](design-system/02-components/pricing-card/component.md) | Single tier on a pricing page. |
| [testimonial-card](design-system/02-components/testimonial-card/component.md) | Customer quote card. |

### Component-composition rules (the constants every consumer must respect)

1. **Every form input goes inside a `<Field>`.** Never render `<Input>` bare. Field paints the label, the help text, the error/success state, and the focus halo on the wrapper, not on the inner control.
2. **Every focusable element ships visible focus.** The `:focus-visible` rule in `globals.css` paints a 2 px spring-green outline + soft box-shadow halo on every interactive surface by default. Don't override it. (Outline + box-shadow per v0.12.4 — outline is structurally immune to ancestor `overflow: hidden`.)
3. **Spring-green-bg surfaces use `.lumen-btn-primary` (or the dual-ring focus shadow), not `bg-primary`.** Tailwind v4's content scanner has been observed to drop the shadcn bridge utilities, leaving white-on-spring-green text (~1.4:1 — WCAG fail). Use the v0.9 `.lumen-btn-*` family or direct `bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)]` instead.
4. **`Stat`, `LiveDot`, and `RateTicker` are Warp-signature primitives.** They carry the operator-console mood. Don't hide them inside generic Card layouts — let them be the visual anchor.
5. **`prefers-reduced-motion: reduce` is honored on every animated component.** If you add a new animation, you add the reduced-motion fallback in the same PR.
6. **Radix-rooted primitives need explicit `aria-label` / `aria-labelledby` if the visible label is a sibling rather than a `<label htmlFor>`.** (v0.13.1) HTML's implicit-label association does NOT propagate the accessible name to a `<button role="switch">` or `<button role="checkbox">` because Radix overrides the host element role. The Lumen `Switch` + `Checkbox` primitives now accept `aria-label` / `aria-labelledby` props for sibling-label patterns (e.g. the `SwitchRow` on `/library`).

---

## 6. Platform consumption — all 9

Lumen ships to 9 platforms. Each platform has a substantive consumption guide in `design-system/03-platforms/{platform}/README.md`. This section is the index + quick-start; the full guides have setup, theming, tokens-table, component-table, code samples, and platform-specific quirks.

| Platform | Stack | Quick install | Guide |
|---|---|---|---|
| **Web** | Next.js 16 + Tailwind v4 + shadcn/ui (Radix primitives) | `pnpm dlx shadcn@latest add <cdn>/lumen/v0.14.0/registry/{name}.json` | [web-react/](design-system/03-platforms/web-react/README.md) |
| **React Native** | Expo SDK 53+ + NativeWind | npm package + `<LumenProvider>` | [react-native/](design-system/03-platforms/react-native/README.md) |
| **iOS native** | SwiftUI + Swift Package | `from: "0.11.13"` | [ios-native/](design-system/03-platforms/ios-native/README.md) |
| **Android native** | Jetpack Compose + Material 3 base | `dev.warp:lumen-compose:0.11.13` | [android-native/](design-system/03-platforms/android-native/README.md) |
| **macOS desktop** | SwiftUI + AppKit interop | Same Swift Package as iOS, macOS-specific examples | [desktop-mac/](design-system/03-platforms/desktop-mac/README.md) |
| **Windows desktop** | WinUI 3 + XAML | Token XAML resource dictionary | [desktop-windows/](design-system/03-platforms/desktop-windows/README.md) |
| **Shopify** | Liquid + Theme Editor settings | Section/snippet partials + token CSS | [shopify-liquid/](design-system/03-platforms/shopify-liquid/README.md) |
| **BigCommerce** | Stencil theme + Handlebars | Stencil module + token SCSS | [bigcommerce-stencil/](design-system/03-platforms/bigcommerce-stencil/README.md) |
| **WooCommerce** | WordPress theme/plugin | PHP enqueue + token CSS | [woo-wordpress/](design-system/03-platforms/woo-wordpress/README.md) |

**No watches, no TV.** Per the original brief, Lumen explicitly does not target watchOS, tvOS, or Android TV — the visual contract (1.25 modular type scale, dense table rows, hairline borders) doesn't translate to those form factors and would need a different system.

**Theme switching.** Every platform supports `data-theme="light"` / `data-theme="dark"` (web), `LumenTheme.dark` / `.light` (Swift), `MaterialTheme.lumen.dark()` / `.light()` (Compose), or the platform-equivalent. Default is dark mode (the neutral obsidian canvas at `#0D0D0D` is the brand stage; the Obsidian Mint tilt was retired in v0.12 per ADR 0020).

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

`_meta/decisions/` holds 23 Architecture Decision Records (ADRs), each capturing the why behind a load-bearing decision:

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
| 0018 | v0.11 Premium Psychology recolor — spring green + obsidian mint (amended by 0020) |
| 0019 | Sparkline fluid + StatGrid divider symmetry v0.11.17 |
| 0020 | v0.12 Obsidian recolor — mint retired (neutral `#0D0D0D` canvas, R = G = B at every dark stop) |
| 0021 | v0.12.1 Card corner-clip contract — `padding="none"` auto-clips edge-touching children to the rounded shape |
| 0022 | v0.12.2 Hover-glow ladder retune — primary-button hover bloom dialed down at the token + layered-halo level |

**ADR-less patches (v0.12.3 + v0.12.4) — patterns documented in CHANGELOG, not in a new ADR by design.** Both ship as consequential follow-ups to existing ADRs (0007 + 0015/0016 + 0021):

| Cycle | Pattern | Anchor | Where the architectural notes live |
|---|---|---|---|
| v0.12.3 | Inline `style.left` retires Tailwind arbitrary-translate on toggle/swipe primitives | Cascade-fix to ADRs 0015/0016 (defensive primitives over Tailwind v4 scanner fragility) | [CHANGELOG v0.12.3 entry](CHANGELOG.md) |
| v0.12.4 | InlineTabs pill `overflow-hidden` extends ADR 0021 corner-clip pattern | Sibling pattern at smaller-control scale to ADR 0021 | [CHANGELOG v0.12.4 entry](CHANGELOG.md) |
| v0.12.4 | Combobox dropdown migrates to `createPortal` + `position: fixed` | Closes the v0.12.1 trade-off where ADR 0021's `overflow-hidden` clipped non-portaled descendants | [CHANGELOG v0.12.4 entry](CHANGELOG.md) |
| v0.12.4 | Global `:focus-visible` gains `outline + offset` on top of soft box-shadow halo | Closes the v0.12.1 ADR-0021 pagination-focus regression at the structural layer | [CHANGELOG v0.12.4 entry](CHANGELOG.md) |

When you propose a breaking change (token rename, schema break, brand-value shift), open a new ADR. When you propose a cascade-fix that the existing ADRs already cover the pattern for, write a CHANGELOG entry that names the pattern + the anchor ADR, no new ADR needed (per v0.12.3 + v0.12.4 precedent).

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

1. **`AGENTS.md`** — universal hard rules (14 rules — 9 v0.1 baseline + 1 button-accent contrast contract from v0.9 + 3 v0.12.4 structural rules + 2 v0.12.5 documentation-rendering rules). Always start here.
2. **Tool-specific addenda** — Claude reads `CLAUDE.md`. Cursor follows `.cursor/rules/lumen.mdc`. Copilot follows `.github/copilot-instructions.md`. Warp Terminal follows `.warp/lumen.mdc`.
3. **`llms.txt`** — discovery index pointing at every relevant file.
4. **This file (`USING-LUMEN.md`)** — comprehensive end-to-end manual when you need the unified narrative.
5. **`design-system/00-foundations/{topic}.md`** — when you need the deep "why" of a foundation principle.
6. **`design-system/02-components/{name}/component.json`** — when you need the exact API of a component.
7. **`audit-dashboard/src/...`** — when you need a working code example.
8. **`_meta/prompts/{workflow}.md`** — when you're starting a recognized workflow (new component, token update, accessibility pass, platform port, audit-dashboard tab).

### Hard rules (memorize these — they cannot be relaxed; canonical list lives in AGENTS.md)

1. **Never invent tokens.** If you need a value not in `01-tokens/semantic/`, the answer is to add a semantic alias (with a PR + ADR), not to hardcode or reach into primitives.
2. **Always reference SEMANTIC tokens, never primitives.** `color.surface.page` ✓ — `color.warm.50` ✗.
3. **Every `component.json` validates against the schema.** Missing required fields fail the build.
4. **Every component ships `component.json` first, code second.** The JSON is what other LLMs and the MCP server read.
5. **WCAG 2.2 AA is the floor.** Visible focus, contrast, keyboard reachability, accessible name. AAA where free.
6. **Use the platform-appropriate code template** from `02-components/{name}/examples/`. Don't invent new patterns when one exists.
7. **Spring Green plays exactly one role: action / live / success.** Never decorative, never as a second accent.
8. **Honor `prefers-reduced-motion`** in everything that animates.
9. **Never render white or near-white text on the spring-green accent surface.** Use `.lumen-btn-primary` (or direct `bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)]`), not the shadcn `bg-primary` bridge utilities (the Tailwind v4 content scanner has been observed to drop those classes, leaving white-on-accent at ~1.4:1).
10. **Floating UI portals to `document.body`** (v0.12.4). Combobox / Select / DropdownMenu / Popover / Tooltip / Calendar dropdowns must escape ancestor overflow contexts via `createPortal` (or Radix Portal). Inline `<div absolute>` panels look correct in isolation but get clipped by Showcase frames, by `<Card padding="none">`, by glass surfaces, by scroll containers. The portal pattern: `createPortal(<div style={{ position: 'fixed', top, left, width, zIndex }} />, document.body)` with `getBoundingClientRect()` re-tracked on scroll (capture phase) + resize. Outside-click dismiss must exempt the portaled list. **Why this rule:** the system contract is "any new floating panel works correctly inside any consumer surface — including ones with `overflow: hidden`." Don't bet on the consumer never embedding it inside an overflow-clipped ancestor.
11. **Focus rings ride `outline + box-shadow`, never box-shadow alone** (v0.12.4 — closes the v0.12.1 ADR-0021 pagination-focus regression). Box-shadow paints into the element's own painting context which respects ancestor `overflow: hidden`; a box-shadow-only focus ring on a button inside `<Card padding="none">` is partially clipped. The global rule paints both — `outline: 2px solid var(--lumen-lime-a64); outline-offset: 1px;` PLUS the existing soft `box-shadow: var(--shadow-focus)` glow halo. Outline is painted outside the layout box and is structurally immune to ancestor overflow. The `.lumen-btn-primary:focus-visible` dual-ring is unaffected — it declares `outline: none` and overrides via specificity. **When authoring any new `:focus-visible` rule, include `outline` for structural visibility, then layer `box-shadow` for the brand halo.**
12. **Position math via inline `style`, not Tailwind arbitrary classes** (v0.12.3 cascade-fix to ADRs 0015/0016). Tailwind v4's content scanner has been observed to drop arbitrary `translate-x-[Npx]` / `top-[Npx]` / `left-[Npx]` utilities (intermittent — `getComputedStyle` reports `none` despite the className carrying the utility). For thumb / swipe / handle / popover anchor position math, use inline `style={{ left: N }}` (or `style={{ transform: 'translateX(...)' }}`) with a native `transition` declaration. Inline style is scanner-independent. The defensive `.lumen-btn-*` and `.lumen-field` class families per ADRs 0015/0016 remain canonical for component STYLING; rule 12 is specifically about position MATH on toggles, switches, swipe rows, calendar nav, etc.

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

### Structural anti-patterns (v0.12.x — earned the hard way)

- ❌ **Rendering a floating panel as inline `<div absolute>`** instead of `createPortal(<div fixed>, document.body)`. (See AGENTS.md hard rule #10.) Combobox / Select / DropdownMenu / Popover / Tooltip / Calendar dropdowns get clipped by ancestor `overflow: hidden` (Showcase frames, `<Card padding="none">`, glass surfaces, scroll containers). v0.12.4 retired this on the Combobox primitive — the last hand-rolled offender — by migrating to `createPortal` with `getBoundingClientRect()` tracking. Don't reintroduce inline-absolute panels in new floating UI.
- ❌ **Writing a `:focus-visible` rule with `box-shadow` only.** (See AGENTS.md hard rule #11.) Box-shadow paints into the element's own painting context and is clipped by ancestor `overflow: hidden`. v0.12.4 added `outline + offset` to the global rule on top of the existing soft box-shadow halo so focus rings stay visible inside corner-clipped containers. The `.lumen-btn-primary:focus-visible` dual-ring is exempt (declares `outline: none` and wins via specificity by design — preserves ADR 0016's brand visual). Don't write a new `:focus-visible` rule that omits the outline.
- ❌ **Tailwind arbitrary `translate-x-[Npx]` for thumb / handle / swipe / popover-anchor position math.** (See AGENTS.md hard rule #12.) Tailwind v4's content scanner has been observed to drop arbitrary-translate utilities (intermittent, scanner-dependent — `getComputedStyle` reports `none` despite the className carrying it). Use inline `style.left` (or `style.transform`) with a native `transition` declaration. v0.12.3 retired this on PricingToggle + SwipeAction — the last two callers — as a cascade-fix to ADRs 0015/0016. Don't reintroduce arbitrary-translate position math in new toggle / swipe / handle primitives.
- ❌ **Rounded container with square-cornered children + `overflow: visible`.** Card primitive `padding="none"` composes `overflow-hidden` per ADR 0021; InlineTabs pill `TabsList` composes `overflow-hidden` per v0.12.4. Any new rounded container hosting children with their own backgrounds and smaller-radius corners needs the same clip — otherwise the child's square corners poke a visible nub past the parent's rounded edge.
- ❌ **Hardcoded version literal in a runtime-rendered string** instead of importing from `@/lib/version`. (See AGENTS.md hard rule #13.) The v0.11.13 → v0.12.4 audit caught the command-palette footer three minor versions stale because it had been hardcoded as `<span>Lumen v0.11.13</span>` from the day it shipped. v0.12.5 routed every consumer (header pill, footer line, palette footer, foundations brand-voice samples, library / tool / foundations badges) through the new `lib/version.ts` constants. Import; don't hardcode. Exemptions are limited to prose descriptions of historical versions, ADR titles / filenames, and CSS / TSX comments — those are immutable history annotations, not renderable strings.
- ❌ **`<details>`/`<summary>` accordion that composes a custom chevron icon without `lumen-summary` (or `list-none`) on the summary.** (See AGENTS.md hard rule #14.) The native browser-default disclosure triangle (▶/▼ in webkit, ▾/▸ in firefox) STILL renders before the summary's text content. With a custom lucide chevron at the END of the summary, you get two arrows competing for affordance — one of them off the brand stroke ladder. v0.12.5 added the `globals.css` rule that suppresses both via `list-style: none` (modern browsers) + `::-webkit-details-marker { display: none }` (pre-2022 webkit fallback). Apply the class on every accordion summary that composes a custom icon.
- ❌ **Real-person names in fixtures, demos, or examples.** Use synthetic operator names (`Avery Mercer`, `Kai Morgan`, `Jordan Kim`-style); carrier names are safe (Sterling LTL, ODFL, Saia, FedEx Freight, ABF — public B2B identities, not customer data). The v0.12.5 audit retired `Daniel Sokolovsky` / `Neel Tengariya` from 9 sites in 5 files because they map to real contacts in the user's vault. Never reintroduce.

### Documentation anti-patterns

- ❌ **Updating a token without updating the foundation doc that cites it.** The v0.4 → v0.11 lime → spring-green transition left stale "lime" mentions in elevation.md until v0.12.2 caught them. Documentation drift compounds.
- ❌ **New ADR without a CHANGELOG entry.** Both must land together.
- ❌ **Inlining a primitive value in a semantic token.** Even at the source-of-truth tier, semantic must reference primitive. Inlining a primitive's value rather than its path is the master-child break that v0.12.2 closed.

### Process anti-patterns

- ❌ **Force-pushing to main.** Never. (See `safety.md` global rule.)
- ❌ **Skipping the validate gate.** `pnpm validate` runs the JSON / schema / contrast checks. If it fails, the PR doesn't merge.
- ❌ **Skipping `pnpm lint` on a token or component PR.** Six rules; takes seconds; catches most leaks.

---

## 12. Quick-reference appendix

### Brand anchors (memorize)

| Anchor | Hex | Role |
|---|---|---|
| Spring Green | `#00FA8A` | Accent — action / live / success only (unchanged from v0.11) |
| Obsidian | `#0D0D0D` | Dark canvas (default theme) — neutral near-black, R = G = B at every dark stop (v0.12 — was `#171A18` Obsidian Mint in v0.11; mint retired per ADR 0020) |
| Light anchor | `#E6E6E6` | Light mode subtle / sunken; primary text on dark canvas |
| Paper canvas | `#FAFAFA` | Light mode page canvas |
| Accent foreground | `#07120D` | Near-black on accent surfaces (14.7:1 AAA on spring green) |

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

### Component count by category (v0.13.1)

| Category | Count |
|---|---|
| Signature primitives (badge, copy-button, icon-button, kbd, live-dot, rate-ticker, stat, trend) | 8 |
| Buttons + actions (button, button-group, command-palette-button, fab, segmented, split-button, toggle) | 7 |
| Inputs + forms (checkbox, color-picker, combobox, date-picker, field, file-dropzone, form, input, number-input, otp-input, password-input, radio-group, range-slider, search-field, select, slider, switch, tags-input, textarea, time-picker, validation-message) | 21 |
| Feedback + messaging (alert, banner, empty-state, progress, skeleton, snackbar, spinner, tag, toast) | 9 |
| Display + data (avatar, calendar, carousel, chart, citation-card, code-block, data-grid, kanban, kpi-card, list, presence-indicator, sparkline, timeline, tree-view) | 14 |
| Containers + surfaces (card, dialog, divider, drawer, link, panel, popover, sheet, table, tooltip) | 10 |
| Navigation (accordion, action-sheet, bottom-nav, breadcrumbs, dropdown-menu, navbar, notification-center, pagination, sidebar, stepper, tabs, toolbar) | 12 |
| Mobile-specific (coach-mark, permission-prompt, phone-frame, pull-to-refresh, status-bar, swipe-action) | 6 |
| AI + collaboration (ai-badge, ai-prompt-input, ai-suggestion, chat-bubble, comment-thread, reaction-bar) | 6 |
| Commerce + marketing (cart-drawer, inventory-status, logo-cloud, pricing-card, testimonial-card) | 5 |
| **Total** | **98** |

### Files at the repo root (for orientation)

```
README.md                  ← human front door
USING-LUMEN.md             ← THIS FILE — comprehensive end-to-end manual
AGENTS.md                  ← universal agent rules (14 hard rules)
CLAUDE.md                  ← Claude-specific addenda
CONTRIBUTING.md            ← human contributor guide
CHANGELOG.md               ← Keep-a-Changelog
VERSION                    ← 0.14.0
llms.txt                   ← LLM discovery index (14-rule playbook at the bottom)
llms-full.txt              ← inlined version (single fetch for agents)
package.json               ← build/validate/lint/registry/release scripts
style-dictionary.config.ts ← token build pipeline
audit-dashboard/src/lib/version.ts  ← v0.12.5+ runtime version constant (the SSoT)
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

Lumen is **one disciplined accent (Spring Green) on a calm neutral-obsidian canvas**, with **aggressive hierarchy** and **engineered first impressions**, built as a **vertically integrated three-layer token chain** that holds 887 tokens across 32 source files and feeds 98 components across 9 platform consumption guides. Reference semantic tokens, never primitives. When you change the master, the children must inherit. The v0.12.x → v0.13.1 patch series proved the cascade pattern at eight bands in a row — token (v0.12.0), primitive (v0.12.1, v0.12.4), token + layered-halo (v0.12.2), consumer-component (v0.12.3, v0.12.8, v0.12.9), globals (v0.12.4 focus-ring outline backstop, v0.13.1 responsive safety net), infrastructure + fixtures (v0.12.5 SSoT version constant + iconography hover + privacy scrubs), primitive-coverage expansion (v0.12.6 — 63 new contracts), build-script meta-contract (v0.13.0 LLM-docs version lockstep, ADR 0023), and root-layer overflow safety (v0.13.1 — ADR 0024) — every cascade-fix retired the per-consumer workaround, every cycle pushed defensive contracts deeper into the system. v0.13.1 also codifies the meta-rule the audit-cycle ladder taught: *a carried blocker is a tooling hypothesis, not a fact* — re-test the tooling before each round.

### The ten v0.12.x defensive primitive contracts (encode these when generating new code)

| # | Pattern | Anchor | What to write | What to never write |
|---|---|---|---|---|
| 1 | **Spring-green accent surface** | ADR 0016 / 0018 | `.lumen-btn-primary` (or `bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)]`) | `bg-primary text-primary-foreground` (Tailwind v4 scanner drops it) |
| 2 | **Card padding=none + edge-touching child** | ADR 0021 (v0.12.1) | `<Card padding="none">` (auto-clips) | `<Card padding="none" className="overflow-hidden">` (redundant; primitive owns it) |
| 3 | **Primary-button hover** | ADR 0022 (v0.12.2) | The system token `--shadow-button-glow-hover` | Custom `box-shadow` overrides "to make it brighter" |
| 4 | **Toggle / swipe / handle position math** | v0.12.3 (cascade-fix to ADRs 0015/0016) | `style={{ left: open ? 22 : 2 }}` + `transition: left 120ms cubic-bezier(0.2, 0, 0, 1)` | `className="translate-x-[22px]"` arbitrary class (Tailwind v4 scanner drops it intermittently) |
| 5 | **Floating UI (popover / dropdown / autocomplete)** | v0.12.4 | `createPortal(<div style={{ position: 'fixed', top, left, width, zIndex }} />, document.body)` + `getBoundingClientRect()` tracking | Inline `<div absolute>` (clipped by ancestor `overflow: hidden`) |
| 6 | **`:focus-visible` rule** | v0.12.4 | `outline: 2px solid var(--lumen-lime-a64); outline-offset: 1px; box-shadow: var(--shadow-focus);` | `box-shadow: var(--shadow-focus);` alone (clipped by ancestor `overflow: hidden`) |
| 7 | **Version label** | v0.12.5 (cascade-fix to ADR 0009) | `import { LUMEN_VERSION } from "@/lib/version"; <span>Lumen {LUMEN_VERSION}</span>` | `<span>Lumen v0.12.5</span>` hardcoded (drifts cross-file — the v0.11.13 → v0.12.4 audit caught it three minor versions stale) |
| 8 | **Custom-chevron accordion `<summary>`** | v0.12.5 | `<summary class="lumen-summary">{q}<ChevronDown size={14} className="group-open:rotate-180" /></summary>` | Bare `<summary>` (browser shows native triangle PLUS your chevron — two arrows compete) |
| 9 | **Interactive icon tile hover** | v0.12.5 (foundations §Color "Accent in context") | `hover:bg-[var(--surface-tint-accent)] hover:text-[color:var(--text-accent)] hover:border-[var(--border-accent)]` (3-property hover) | `hover:bg-tint-accent` alone (only background tints — the brand rule "green at action" is buried in prose, not felt) |
| 10 | **Peak-moment card hover** (pricing tier, plan picker, decision tile) | v0.12.5 | non-highlighted: `hover:shadow-[var(--shadow-md)] hover:border-[var(--border-default)] hover:-translate-y-[1px]`; highlighted: layer `var(--shadow-glow-accent)` | Static peak-moment card (the model knows the card exists but doesn't know it's a peak moment — Premium Psychology principle 3 violation) |

---

**End of USING-LUMEN.md.**

> If something in this document is wrong, this document is wrong — file a PR. If something in this document conflicts with `AGENTS.md` or `CLAUDE.md`, those files win.
> Last reviewed against actual repo state: 2026-05-19 (v0.14.0).
