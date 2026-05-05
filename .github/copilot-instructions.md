# GitHub Copilot — Lumen Design System

> Mirror of [AGENTS.md](../AGENTS.md), formatted for Copilot's instructions discovery. AGENTS.md is the source of truth — read it for the full 9 hard rules, setup commands, deprecation policy, trust levels, and conflict resolution. This file is the Copilot-tailored short form.

## Project context

Lumen is Warp's design system. It contains design tokens (DTCG JSON), component contracts (Markdown + JSON sidecars), and platform consumption guides for web (Next.js + Tailwind v4 + shadcn), React Native, native iOS / Android, native desktop, and three e-commerce platforms (Shopify, BigCommerce, WooCommerce). No shipped product code — consumers pull Lumen via shadcn registry / Swift Package / Compose module.

## v0.11 — Premium Psychology recolor (current)

The visual system is **Premium Psychology**. Brand anchors:

- Spring Green `#00FA8A` — single accent, one role only: action / live / success
- Obsidian Mint `#171A18` — dark canvas
- `#E6E6E6` — light anchor / primary text on dark
- `#FAFAFA` — paper / light surface

Single typeface: **Satoshi** covers UI, display, body, numerics, code, and editorial. v0.11 grew principles from 5 to 7 and added three foundations: `hierarchy.md`, `first-impression.md`, `micro-interactions.md`. Brand contract is [ADR 0018](../_meta/decisions/0018-premium-psychology-recolor.md). Current build: v0.11.13.

## Hard rules

1. **Never invent tokens.** No raw hex, px, or font stacks in component code. To add a value, ship a semantic alias with a PR + ADR — never import a primitive directly.
2. **Always reference SEMANTIC tokens, never primitives.** `color.surface.default`, NOT `color.warm.50`. `space.4`, NOT `dimension.4`. Lint enforces this.
3. **Tokens are CSS variables in web** (`var(--color-surface-page)`), Swift constants in iOS, Kotlin objects in Android. Never raw hex in product code.
4. **Every component contract validates against `/design-system/02-components/_schema/component.schema.json`.** Every component ships `component.json` before any code template — that's what Copilot, LLMs, and the MCP server read.
5. **WCAG 2.2 AA is the floor.** Visible focus, ≥ 4.5:1 text contrast (≥ 3:1 large text), keyboard reachability, accessible name on every interactive element.
6. **Honor `prefers-reduced-motion`** for all animations. Failing this fails CI.
7. **Spring Green accent (`color.accent.500` = `#00FA8A`) plays exactly ONE role**: action / live / success. Never decorative, never a second accent, never on non-action chrome.
8. **Never render white or near-white text on the spring green accent.** Accent foreground is bound to `color.accent.fg` (`#07120D`, ~14.7:1 AAA); white on spring green is ≈1.4:1 — a WCAG fail. Specifically:
   - Do NOT use shadcn token-bridge utilities in product code (`bg-primary` / `text-primary-foreground`, `bg-card` / `text-card-foreground`, `bg-popover` / `text-popover-foreground`, etc.). Tailwind v4's content scanner has been observed to drop those classes, leaving the element to inherit near-white.
   - DO use the `.lumen-btn-*` defensive class family (`.lumen-btn-primary`, `.lumen-btn-secondary`, `.lumen-btn-ghost`, etc.) declared in `audit-dashboard/src/app/globals.css`.
   - DO use direct semantic refs for one-offs: `bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)]` (audit-dashboard) or `bg-[var(--color-action-primary-bg-rest)] text-[var(--color-action-primary-fg)]` (canonical action-surface bridge).
   - Lint rule `lint:no-white-on-accent` enforces both halves.
9. **Use the platform-appropriate code template** from `02-components/{name}/examples/`. Do not invent new patterns when one exists.

## Quick token reference

```
Surfaces: color.surface.{page,raised,sunken,overlay,inverse}
Text:     color.text.{primary,secondary,tertiary,disabled,inverse,accent}
Borders:  color.border.{subtle,default,strong,focus}
Action:   color.action.{primary,secondary,tertiary,danger}.{bg,fg,border}
Accent:   color.accent.{500,fg}        ← single-role, action/live/success only
Status:   color.status.{success,warning,danger,info}.{bg,fg}
Spacing:  space.{0..32}
Radius:   radius.{control.md, card.default, card.lifted, card.hero, pill, full}
Motion:   motion.transition.{fast,base,slow,page}
Type:     type.{display,heading,body,caption,micro,label,code}.{...}   ← all Satoshi
```

## Code style

- TypeScript strict, no `any`.
- React: function components, hooks. No class components.
- Tailwind v4 only. Theme via `@theme` in CSS — no `tailwind.config.ts`. Reference tokens via `var(--color-...)` or Lumen-mapped utilities; never raw hex.
- iOS: SwiftUI for new code. Android: Jetpack Compose.
- Token references in code: `var(--color-surface-page)`, NOT `#fafaf7`.
- File naming: kebab-case folders (`live-dot/`), PascalCase component names in code (`LiveDot`).

## Copilot-specific guidance

- When generating Tailwind classes, prefer the Lumen-mapped utility (`bg-page`, `text-fg`) or an arbitrary semantic ref (`bg-[var(--color-surface-page)]`). Never `bg-warm-50`, `bg-[#00FA8A]`, or `text-white` over an accent surface.
- For CTA buttons: emit `.lumen-btn-primary` / `.lumen-btn-secondary` / `.lumen-btn-ghost`, not `bg-primary text-primary-foreground` (rule 8).
- Run UI copy through `design-system/04-content/ui-writing-style.md` and avoid the banned phrases in `design-system/04-content/microcopy.md`.

## When in doubt

1. Read the closest `component.md` AND `component.json` together in `design-system/02-components/`.
2. Check `_meta/decisions/` for an ADR on the topic.
3. Look at `audit-dashboard/src/` — the live reference implementation that exercises every token, primitive, and component pattern.
4. Search `research/` for the underlying evidence.
5. Surface the question — don't guess.
