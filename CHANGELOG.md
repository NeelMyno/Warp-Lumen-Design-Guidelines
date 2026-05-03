# Changelog

All notable changes to **Lumen** (Warp's design system) are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [ADR 0009](./_meta/decisions/0009-versioning-semver-system-wide.md) for the versioning policy.

## [Unreleased]

_Nothing yet. Open a PR with an entry under one of: Added, Changed, Deprecated, Removed, Fixed, Security._

---

## [0.1.0] — 2026-05-02

The initial Lumen drop. Audit baseline.

### Added

- **Brand & inspiration brief** — `/research/lumen-brief.md` synthesizing four research streams (Warp brand DNA, Apple/Ive/Rams inspiration, Satoshi typography, system architecture).
- **Visual mood: Quiet Industrial** as default. Three alternates documented (`soft-luminous`, `mono-editorial`, `premium-glass`) and exposed in the audit dashboard's mood switcher.
- **Color tokens** — Warp's actual navy ladder for dark mode, paper-warm white for light mode, Warp lime green (`#4ade80`) as the only loud accent. Three layers (primitives, semantic, component-bound) in DTCG JSON.
- **Typography tokens** — Satoshi (UI/display) + JetBrains Mono (numerics) on a 1.25 modular scale. Editorial pair: Source Serif 4. Plan B: Inter.
- **Spacing, radius, motion, elevation tokens** — full DTCG primitive + semantic ladders.
- **Components (12)** with both `component.md` (human spec) and `component.json` (machine contract):
  - **Button** — primary/secondary/tertiary/danger, three sizes, loading state, full Web React example.
  - **Input** — single-line text input with mono variant for codes/IDs.
  - **Card** — bounded surface with hairline border + subtle shadow.
  - **Badge** — status/category/count pill with mandatory leading dot for status variants.
  - **Stat** ⚡ Warp signature — big bold tabular number + small mono unit + optional delta.
  - **LiveDot** ⚡ Warp signature — 8 px green dot with 2 px pulsing ring (3 s loop).
  - **RateTicker** ⚡ Warp signature — horizontal marquee of freight lane rates.
  - **Table** — operator-density data table with hairline rows, sticky header, tabular numerics.
  - **Dialog** (beta) — modal interrupt for confirmation / focused decision / short form.
  - **Toast** (beta) — non-blocking corner message, sticky for errors.
  - **EmptyState** — type-led, never illustrated, two-line template.
  - **Toggle** — switch for binary on/off settings.
- **Component schema** at `design-system/02-components/_schema/component.schema.json` — every `component.json` validates against it.
- **Foundations docs (4)** — principles, voice & tone, accessibility (WCAG 2.2 AA hard floor), motion language.
- **Content docs (8)** — imagery, illustration, iconography, motion (recipes), UI writing style, microcopy library, error messages, empty states.
- **Platform consumption guides (9)** — web (Next.js + Tailwind v4 + shadcn), React Native, iOS native (SwiftUI), Android native (Compose), macOS desktop, Windows desktop (WinUI 3), Shopify Liquid, BigCommerce Stencil, WooCommerce / WordPress.
- **LLM contract surfaces** — `llms.txt`, `llms-full.txt`, `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/lumen.mdc`, `.warp/lumen.mdc`, `.github/copilot-instructions.md`.
- **shadcn-compatible registry** at `_registry/registry.json` + per-component sidecars for all 12 components.
- **Style Dictionary v5 build pipeline** at `style-dictionary.config.ts` with 9 platform outputs (CSS, Tailwind, TS, iOS Swift, Android XML, Compose Kotlin, Flutter, Liquid, flat JSON).
- **Build & validation scripts** — `pnpm build`, `pnpm validate`, `pnpm registry`, `pnpm lint`, `pnpm release`.
- **\_meta**:
  - `glossary.json` — 30 term disambiguations for AI agents.
  - 9 ADRs covering DTCG, Style Dictionary, shadcn registry, Quiet Industrial mood, single-accent rule, Satoshi pairing, two-file component contract, layered LLM contract, semver-system-wide.
  - 5 reusable prompt fragments — new-component, token-update, platform-port, audit-dashboard-tab, accessibility-pass.
- **Audit dashboard** at `/audit-dashboard/` — Next.js 16 + Tailwind v4 + Satoshi self-hosted. Seven template tabs (Foundations, SaaS, Landing, Tool, E-commerce, Mobile, Native Desktop). Mood switcher and dark/light theme toggle.

### Notes

- Satoshi is shipped under ITF-FFL (free for personal + commercial use, must self-host, must NOT redistribute the font files in a public repo). License action item: have legal pull the canonical text from `https://www.fontshare.com/licenses/itf-ffl` and archive a PDF copy with the build.
- The accent green `#4ade80` is verbatim from Warp's production CSS (used 788 times). Do not soften without an ADR.
- The audit dashboard's `globals.css` is a placeholder. Once Style Dictionary outputs `_build/tailwind/theme.css`, replace the dashboard's tokens with the built file.
