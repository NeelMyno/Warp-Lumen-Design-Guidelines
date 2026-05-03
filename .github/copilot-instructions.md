# GitHub Copilot — Lumen Design System

> Mirror of [AGENTS.md](../AGENTS.md), formatted for Copilot's instructions discovery. The full source-of-truth lives in AGENTS.md.

## Project context

Lumen is Warp's design system. It contains design tokens (DTCG JSON), component contracts (Markdown + JSON), and platform consumption guides for web (Next.js + Tailwind v4 + shadcn), React Native, native iOS/Android, native desktop, and three e-commerce platforms (Shopify, BigCommerce, WooCommerce).

The visual mood is **Quiet Industrial**: paper-warm white in light mode, Warp's actual navy ladder (`#131c2a → #1a2332 → #222d3e`) in dark, one disciplined Warp lime green accent (`#4ade80`) used only for action / live / success.

## Hard rules

1. **Use semantic Lumen tokens.** Never primitives. Never hardcoded hex/px in component code.
2. **Tokens are CSS variables in web** (`var(--color-surface-page)`), Swift constants in iOS, Kotlin objects in Android.
3. **WCAG 2.2 AA** is the floor. Visible focus, contrast, keyboard reachability, accessible name on every interactive element.
4. **Warp green plays one role**: action / live / success. Never decorative.
5. **Component contracts (`component.json`) validate against** `/design-system/02-components/_schema/component.schema.json`.
6. **Honor `prefers-reduced-motion`** for all animations.

## Quick token reference

```
Surfaces: color.surface.{page,raised,sunken,overlay,inverse}
Text:     color.text.{primary,secondary,tertiary,disabled,inverse,accent}
Borders:  color.border.{subtle,default,strong,focus}
Action:   color.action.{primary,secondary,tertiary,danger}.{bg,fg,border}
Status:   color.status.{success,warning,danger,info}.{bg,fg}
Spacing:  space.{0..32}
Radius:   radius.{control.md, card.default, card.lifted, card.hero, pill, full}
Motion:   motion.transition.{fast,base,slow,page}
Type:     type.{display,heading,body,caption,micro,label,code}.{...}
```

## Code style

- TypeScript strict, no `any`.
- React: function components, hooks.
- Tailwind v4 only (`@theme inline { ... }` in CSS, no `tailwind.config.ts`).
- Token references via CSS variables for web (`var(--color-...)`); never raw hex.
- File naming: kebab-case folders, PascalCase component names in code.

## When in doubt

1. Read the closest `component.md` in `design-system/02-components/`.
2. Check `_meta/decisions/` for ADRs.
3. Look at `audit-dashboard/src/` for working examples of every primitive.
