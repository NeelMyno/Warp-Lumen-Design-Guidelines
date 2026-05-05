# 05-patterns — composition patterns

> Components are atoms; patterns are how you compose them into recognizable UI shapes. This directory holds the canonical Lumen compositions for the surfaces Warp's team builds most often.

## Why patterns matter

Lumen's 35 components are intentionally small and composable. A `Button`, a `Field`, a `Stat`, a `Card` each do one thing. The interesting question isn't "what does Stat do?" — that's answered in [`02-components/stat/component.md`](../02-components/stat/component.md). The interesting question is "**when I'm building a SaaS dashboard, how do I compose Stat + Card + Table + EmptyState into a coherent surface that ships the v0.11 hierarchy + first-impression + density rules?**"

That's what these patterns answer. Each pattern doc is a recipe: which components to compose, in what shape, with which density mode, which tokens for the wrappers, and the anti-patterns to avoid. Read them as "the second-most-important file after the foundations" — they're how the foundations cash out into shipped UI.

## The pattern catalog

| Pattern | Surface category | Density | Use when building |
|---|---|---|---|
| [marketing-landing.md](./marketing-landing.md) | Marketing | breathes (96px section) | Landing page, product page, pricing page, about page |
| [saas-dashboard.md](./saas-dashboard.md) | Operator | dense (24px section) | Internal dashboard, ops console, customer-facing analytics |
| [settings-page.md](./settings-page.md) | Operator | cozy (36px control) | Settings, preferences, account, billing config |
| [mobile-primary.md](./mobile-primary.md) | Mobile | platform-native | Mobile app primary surface (iOS / Android / RN) |
| [ecommerce-product.md](./ecommerce-product.md) | E-commerce | breathes-but-dense | Product detail page (Shopify, Big, Woo) |
| [auth-flow.md](./auth-flow.md) | Operator | cozy | Sign in / sign up / password reset / OTP / SSO |
| [web-tool.md](./web-tool.md) | Operator | dense | Single-purpose utility — calculator, builder, simulator |

## How to use a pattern doc

Each pattern doc has the same six-section structure for predictability:

1. **The shape** — ASCII tree or component-tree diagram showing the composition.
2. **Density mode** — which density tier (marketing / operator / mobile-native / cozy) and the rationale.
3. **Tokens for wrappers** — which `space.section.*`, `space.page.*`, `space.inset.*` to pick for the outer containers.
4. **Component recipe** — which Lumen component for each role + which intent / surface / size variants.
5. **Anti-patterns** — the wrong-feeling compositions to avoid (these are the most common LLM-generated mistakes).
6. **Working reference** — the `audit-dashboard/src/...` file that implements this pattern end to end.

## When to add a new pattern

Add a new pattern doc when:

- You discover a recurring composition across 3+ Warp consumer projects.
- The composition involves enough cross-component coordination that "look at the components and figure it out" produces inconsistent results across builders.
- You can identify a clear density mode + tokens-for-wrappers recipe that isn't already captured.

Don't add a pattern for one-off compositions. The patterns directory should stay tight — 6–10 canonical surfaces, not 50 micro-recipes. If a surface is used once, it's a screen; if it's used 3+ times, it's a pattern.

## Cross-references

- [Foundations](../00-foundations/) — the principles + density + first-impression rules every pattern must respect.
- [Components](../02-components/) — the atoms each pattern composes.
- [Platforms](../03-platforms/) — the per-platform consumption notes (which patterns ship as Liquid sections, which ship as SwiftUI views, etc.).
- [Audit dashboard](../../audit-dashboard/) — the canonical web reference implementation. Every pattern in this directory is exercised at `audit-dashboard/src/app/{landing,saas,tool,ecommerce,mobile,desktop,library}/`.

## Pattern doc voice

Each pattern doc uses the Lumen voice (operator-direct, lowercase summaries with em-dashes, numerate). Token paths in `code`. ASCII trees for component composition. WCAG numbers as `4.5:1`. Match this voice when contributing.
