# Changelog

All notable changes to **Lumen** (Warp's design system) are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). See [ADR 0009](./_meta/decisions/0009-versioning-semver-system-wide.md) for the versioning policy.

## [Unreleased]

_Nothing yet. Open a PR with an entry under one of: Added, Changed, Deprecated, Removed, Fixed, Security._

---

## [0.4.0] — 2026-05-02 — Obsidian Lime

A clean break from the navy + lime mood. Anchor references: SuperDesign · Glassmorphism Style and SuperDesign · Neon Velocity Countdown. The brand-green stays — everything else is rebuilt around an obsidian canvas, generous whitespace, glass surfaces, and a radial lime ambient glow as the brand's signature lighting gesture.

### Changed

- **Default mood is now `obsidian-lime`** (replaces `quiet-industrial`). `lib/moods.ts` and `[data-mood]` updated accordingly.
- **Default theme is now `dark`** (the obsidian canvas is the brand stage). Light mode is the cream-paper inverse and remains a first-class citizen.
- **Color primitives retuned** in `01-tokens/primitives/color.tokens.json`:
  - `color.brand.*` retuned to the **obsidian** ramp — warm-leaning near-black, never navy.
  - `color.warm.*` retuned to the **cream** ramp — warm paper for light mode.
  - `color.accent.*` keeps `#4ade80` at 400/500 (brand value unchanged); ramp top brightened so the lime reads "laser" against obsidian.
  - `color.status.info.*` shifts off sky-blue to a warm cream tone — no second loud color, no navy partnership.
  - `color.alpha.accent.40` and `.64` added for ambient-glow stops.
- **Semantic dark/light tokens** (`color.dark.tokens.json`, `color.light.tokens.json`) updated to match: new `surface.glass`, `surface.tint-accent`, `border.hairline`, `border.frame`, `border.accent`, `aurora.color`, `aurora.core` keys.
- **Audit dashboard** (`audit-dashboard/src/`):
  - `globals.css` rewritten — drops the navy ramp; introduces obsidian, cream, lime alphas, glass utilities, architectural grid, radial aurora, brutalist frame, mono uppercase tracked label.
  - `dashboard-shell.tsx` rebuilt with a glass pill nav, a fixed architectural grid behind the canvas, and the radial aurora over hero content.
  - `tab-nav.tsx` rebuilt as glass-pill chips with lime hairline + tint on active.
  - `theme-toggle.tsx` defaults to dark.
  - `foundations/page.tsx` rebuilt — brutalist-frame hero, `voice` section, glass + glow + grid surfaces, 13 navigable sections with a sticky right-rail TOC.
  - `landing/page.tsx` hero refreshed: italic lime accent on "builders.", pill XL CTAs with `glow`, architectural grid + aurora canvas.
  - `library/client.tsx` hero badge bumped to v0.4.0.
- **Primitives**:
  - `Card` — added `glass` and `glow` elevations, added `hero` padding, default radius bumped to `radius-xl`.
  - `Button` — added `xl` size (h-14 pill), `glow` boolean for hero halo, `pill` boolean for radius-full override.
  - `Tooltip` — surface upgraded to `lumen-glass-strong`.
  - Avatar / Charts / Display / Feedback / AI / Inputs / Mobile / Commerce / Templates — every direct primitive reference (`lumen-navy-*`, `lumen-sky-*`, `lumen-gray-*`) replaced with the v0.4 vocabulary (`lumen-obsidian-*`, `lumen-cream-*`).
- **Radius scale** — slightly rounder: `xs=3 sm=6 md=8 lg=12 xl=16 2xl=20 3xl=28 4xl=36 full=∞`. The 8-point soft grid is unchanged; only the optical radius dial moved.
- **Type scale** — display ceiling pushed to 84 / 96 / 112 / 128 px to support brutalist hero treatments. Existing scale steps unchanged below 76 px.
- **Motion tokens** — added `--motion-aurora-fade-in` (1200ms) and `--motion-glow-pulse` (2400ms) for the new ambient signatures. Existing eases unchanged. `prefers-reduced-motion` honoured throughout.

### Added

- **Direction brief** — `research/lumen-v04-direction.md` documenting the references, the v0.4 axioms, and the cascade plan.
- **`.lumen-glass`, `.lumen-glass-strong`** utilities — glass surfaces with backdrop-filter for floating shells.
- **`.lumen-aurora`** utility — fixed radial-lime ambient glow with reduced-motion fallback.
- **`.lumen-grid-architectural`** utility — whisper-faint 64px lattice for canvas texture.
- **`.lumen-frame-brutalist`** utility — hairline frame around statement headlines, no shadow.
- **`.lumen-mono-cap`** utility — JetBrains Mono · uppercase · +0.16em tracking. The v0.4 system-metadata voice.
- **`.lumen-dot-pulse`** utility — replaces ad-hoc pulse styles; signature loop for live-status dots.

### Removed

- **`color.brand` namespace as "Warp navy"** — same JSON path, but values are now obsidian. Token consumers using semantic aliases (`color.surface.page`, `color.border.default`, etc.) need no changes.
- **`lumen-navy-*`** CSS primitives — gone. Replaced with `lumen-obsidian-*`.
- **`lumen-sky-*`** CSS primitives — gone. v0.4 doesn't use a sky-blue family. Components that referenced sky now use cream or accent.
- **`lumen-gray-*`** CSS primitives — gone. Replaced with `lumen-cream-*` (warm paper neutrals are the v0.4 'gray' family).
- **Mood: Quiet Industrial** — superseded. Mood-switcher hides itself when `MOODS.length <= 1`.

### Notes

- The v0.3 `95fdd3d` 8-point soft grid migration carries forward intact — every structural pixel still snaps to 8s with 4-pixel halves and 2-pixel quarters as exceptions.
- Component spec docs in `02-components/{name}/component.md` still describe v0.3 sizing and v0.3 token vocabulary in places — bringing those to full v0.4 parity is the obvious next wave.
- No localhost dev server (kernel watchdog crashes documented through v0.1–v0.3). View on Vercel only.

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
