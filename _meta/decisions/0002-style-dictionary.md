# ADR 0002 — Use Style Dictionary v5 as the build pipeline

- **Date:** 2026-05-02
- **Status:** Accepted
- **Deciders:** Lumen working group

## Context

Tokens in DTCG JSON need to compile to ~9 platform outputs (CSS, Tailwind v4 `@theme`, TypeScript, iOS Swift, Android XML + Compose Kotlin, Flutter Dart, Shopify Liquid CSS, flat JSON). Building this from scratch would take a quarter; using a maintained tool means we ship in a week.

Candidates:
- **Style Dictionary v5** (Amazon, ESM-first, browser-compatible, native DTCG).
- Specify (token aggregator).
- Theo (Salesforce, archived).
- Custom build script.

## Decision

Use **Style Dictionary v5.4+**.

Config lives at `/style-dictionary.config.ts`. Build outputs land in `/_build/` (gitignored). CI runs `pnpm build` and publishes built outputs to a separate `lumen-dist` repo (or CDN) for consumers.

## Consequences

**Positive:**
- Predefined formats for every target except Shopify Liquid (which we hack via the `css/variables` format with a `.liquid` extension).
- Active maintenance — v5.4 shipped March 2025; ongoing releases.
- ESM-first, TypeScript config support.
- Used by Primer, Atlassian, Penpot, Tokens Studio — proven at scale.
- The `@tokens-studio/sd-transforms` preprocessor handles Tokens Studio quirks for free.

**Negative:**
- v5 is a major rewrite from v4 — some plugin patterns from older blog posts are stale. Mitigation: stick to current docs.
- WinUI XAML output requires a small custom format (~30 lines of TS). Acceptable.
- Composite tokens (typography, shadow) require explicit transforms in some target groups. Acceptable.

**Tradeoffs not chosen:**
- A custom build script would be faster initially but slower to maintain over time.
- Specify would lock us into their cloud product.

## References

- [Style Dictionary v5](https://styledictionary.com/)
- [@tokens-studio/sd-transforms](https://github.com/tokens-studio/sd-transforms)
- `/style-dictionary.config.ts` — the config itself
- `/research/system-architecture.md` — full evaluation
