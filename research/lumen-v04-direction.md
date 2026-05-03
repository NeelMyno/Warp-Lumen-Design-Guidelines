---
title: Lumen v0.4 — Direction Brief ("Obsidian Lime")
date: 2026-05-02
type: research
tags: [research, direction, redesign, v0.4, obsidian, glassmorphism, neon, lime]
sources:
  - https://app.superdesign.dev/library/glassmorphism-style
  - https://app.superdesign.dev/library/neon-velocity-countdown
status: locked
---

# Lumen v0.4 — Obsidian Lime

A clean break from the navy + lime mood Lumen had been wearing through v0.1 → v0.3. The brand-green stays. Everything else is rebuilt against two anchor references: SuperDesign's **Glassmorphism Style** ("Obsidian & Lime") and **Neon Velocity Countdown** ("Laser Green & Navy Black", though visually it's near-black, not navy).

## What the user told me

> "Keep colors the same, but rest, we can modernize and even start from scratch. … Just keep 1 color the same, and that's green. Rest, we have the independency to change whatever styling we want. … I don't want a combination of green with weird navy blue, I want something that contrasts good and looks amazing, but the at the same time, not too sharp on the eyes. … Think like a UI designer, not a developer."

So:
- **Drop** navy, drop the Warp brand-DNA-driven palette mixing.
- **Keep** the brand green (`#4ade80` family) — no second loud color.
- **Aim for** generous breathing room, premium calm contrast, not eye-stabbing.
- **Inspire heavily** from glassmorphism + neon-velocity references.

## What I extracted from the references

### Glassmorphism Style — "Obsidian & Lime"
> *"A futuristic 'Obsidian & Lime' glassmorphism design system characterized by high contrast, blurred transparency, and tech-industrial typography. Bento-grid structure and floating layouts. Backdrop-blur effects, grain/noise overlays, 'floating shell' layout that gives the web interface a premium, app-like quality."*

Visual moves:
- Background: deep obsidian (~`#070708`–`#0a0a0c`, very subtle warm undertone, with a faint architectural grid at ≤4% opacity)
- Surfaces: glass cards (`backdrop-filter: blur(20–32px)`) tinted with a translucent dark, hairline borders at ~12% white
- Accent: laser lime (~`#c0ff3d`) as the only loud color — used for active states, primary CTAs, system-status pills, dot indicators, and as a **radial ambient glow** on hero
- Typography: heavy display sans (Space Grotesk in the ref) + technical mono (JetBrains Mono) + occasional **italic serif accent** for one signature word (e.g. "Speed")
- Mono labels in **uppercase, tracked-out**, often in lime, for system metadata ("AI-POWERED INTERFACE GENERATOR", "SYSTEM V2.4 LIVE")
- Top nav rendered as a **glass pill row**; CTA buttons are pill-shaped with crisp accent
- Brand mark: lime square mark + wordmark
- Floating "device shell" preview to demonstrate the system

### Neon Velocity Countdown — "Laser Green & Navy Black"
> *"A minimalist yet aggressive design system that blends brutalist structure (heavy borders, massive type) with futuristic glass effects. High contrast, uppercase technical labels, and immersive background glows."*

Visual moves:
- Background: the same near-black obsidian, with a **strong radial green glow** at the top — ambient lighting, not a hard shape
- **Brutalist hairline frame** wrapping the hero headline ("STOP RE-DESIGNING") — 1px white border at ~80% on the dark, breathing room of ~64–80px inside
- Massive uppercase display type filling the frame
- Mono uppercase for technical labels (`@ DIGITAL HQ / GLOBAL ACCESS`, `INVITES IN:`, `HOURS . MINS . SECS`)
- Big mono countdown numerals (e.g. `12.02.05`)
- Pill nav, lime "JOIN BETA" CTA at top right
- 5-section layout with bento grid spacing

### Convergence (the v0.4 axioms)
1. **Obsidian, never navy.** A near-black warm dark canvas. The "Navy Black" name in the second ref is descriptive copy; the actual hex reads as black-with-warmth.
2. **One loud color: lime green.** Same green family Warp already owns. Used on CTAs, status, dots, glow, hairlines (lime-tinted), and active state.
3. **Radial lime ambient glow** as the brand's signature lighting gesture.
4. **Massive type / tiny tracked labels.** A large hierarchy delta — display type at 80–160px, body at 14–17px, tracked uppercase mono labels at 11–12px.
5. **Glass surfaces** with backdrop-blur for floating cards and overlays.
6. **Brutalist hairline frames** as section anchors (1px borders, no shadow).
7. **Architectural grid** subtly visible behind the canvas (3–5% opacity).
8. **Mono-typed system metadata** — tracked uppercase, often lime, for status / stage / version labels.
9. **Bento layouts**, generous internal padding, lots of negative space.
10. **Pill controls** for nav and CTAs (radius-full).

## Lumen v0.4 — Direction

### Mood name
**Obsidian Lime** — replaces "Quiet Industrial" as the default mood.

### Color system

#### Drop
- `lumen-navy-*` — gone. The navy ramp evaporates.
- `lumen-sky-*` — gone (no second loud hue, no need for blue category color).

#### Keep, slightly retuned
- `lumen-accent-*` — unchanged anchor at `#4ade80` (Warp's brand value). Ramp gets a brighter `accent-3` ≈ `#a4f4a8` and a more saturated `accent-4` ≈ `#5cf08a` to read as "laser" against obsidian without leaving green.
- `lumen-red-*`, `lumen-amber-*` — kept for status, slightly desaturated.

#### New
- `lumen-obsidian-*` — 11-step warm near-black scale (0 = paper / mirror, 9 = void). Anchor stops:
  - `0`: `#f6f5f0` (cream paper, mirror of the dark canvas in light mode)
  - `1`: `#e9e8e1`
  - `2`: `#cdcbc1`
  - `3`: `#9c9a8f`
  - `4`: `#6c6a60`
  - `5`: `#3e3d36`
  - `6`: `#26261f` (raised glass card surface, dark mode)
  - `7`: `#181812` (raised surface)
  - `8`: `#0d0d09` (canvas)
  - `9`: `#070705` (void / underlay)

  Slightly warm (touch of green-yellow undertone) so it harmonizes with the lime instead of fighting it. **Not** navy. **Not** pure-cool gray.

- `lumen-cream-*` — 10-step warm cream scale for light-mode surfaces and cream-tinted accents in dark mode. Anchor stops:
  - `0`: `#fdfcf8` paper
  - `1`: `#f5f3ec` raised
  - `2`: `#ebe7da` glass-tint
  - `5`: `#9d9784`
  - `9`: `#1a1812`

- `lumen-fog-*` — desaturated cool gray for light-mode chrome (replaces the old warm gray for chrome where cream isn't right). 5 stops minimum.

- Lime alphas — new: `lumen-lime-glow-a40`, `lumen-lime-glow-a64`, `lumen-lime-glow-a80` for radial glow stacks.

### Typography

- **Sans (display + UI)** — Satoshi Variable. Already self-hosted, already brand-consistent. We push display sizes 25–50% larger than v0.3 for the brutalist scale.
- **Mono (technical metadata)** — JetBrains Mono. Already self-hosted via `next/font`.
- **Display italic accent** — Satoshi Italic at the "Speed"-word moment. We can add an optional `--font-italic-display` slot in tokens for a future swap to Source Serif 4 italic.

#### Type scale revision
- Display: bump headline scale to mirror the brutalist references (96–144px on desktop).
- Body: stay 14–16px (operator-readable).
- Caption / mono uppercase label: 11–12px tracked +0.06em → +0.12em for the wider spacings.
- Letter-spacing: tight (`-0.02em`) on display, tracked (+0.06em → +0.16em) on uppercase labels.

### Surfaces

- **Canvas** — `--surface-canvas` = obsidian-8 in dark, cream-0 in light, with optional architectural grid background overlay.
- **Raised** — `--surface-raised` = obsidian-7 in dark, cream-1 in light.
- **Glass** — `--surface-glass` = `rgba(obsidian-6 + ~70% alpha)` + `backdrop-filter: blur(24px) saturate(120%)`, hairline border at `lumen-paper-a12`. Used for floating cards, popovers, sheets, and the top nav.
- **Inverse** — flip for inline contrasting blocks.

### Elevation

- **Hairline** (default) — 1px border at low alpha. No shadow.
- **Card** — `shadow-card` = subtle 2-layer drop, never heavy.
- **Glass** — `shadow-glass` = blur + tint, not shadow.
- **Glow** — `shadow-glow-lime` = multi-layer radial green ambient (signature gesture for hero CTAs and status pulses).
- **Brutalist frame** — `.lumen-frame-brutalist` utility — 1px hairline at `text-primary`, no radius, generous padding, used to wrap a single statement headline.

### Motion

- Default ease-out, 200ms.
- 280–320ms for state changes (sheet, drawer, modal).
- New: **`lumen-glow-pulse`** — 2.4s ease-in-out infinite for the live-status dot.
- New: **`lumen-glow-radial-fade-in`** — radial green glow eases in over 600ms when a hero section enters.
- `prefers-reduced-motion` reduces glow pulse to a static state and disables ambient glow animation.

### Patterns

- **Architectural grid background** — utility `.lumen-grid-architectural` (1px lines at `lumen-paper-a04` on dark, `lumen-ink-a04` on light), 64px cell.
- **Pill nav** — top nav becomes a glass pill (`radius-full`, 4px internal padding, glass surface, hairline border).
- **Brutalist frame** — used on the foundations hero, library hero, and one section per template.
- **Mono uppercase status pills** — `[•] SYSTEM V0.4 LIVE` style — small mono tracked-out caps with a leading dot.
- **Radial glow on hero** — `.lumen-glow-aurora` utility, fixed at top center of canvas, 800px green-tinted radial gradient at 8% opacity max.

### Density / spacing

- Keep the 8pt grid (v0.3's foundation stays — it's structural and good).
- Increase default page padding by ~50%: `px-6 py-12 → px-8 py-16` (md), `py-16 → py-24` (lg).
- Section spacing: bump `mb-16 → mb-24` between major sections.
- Hero blocks: increase headline size; reduce supporting copy density to match.

### What NOT to do

- No bouncy springs, no decorative gradients beyond the lime-glow signature.
- No second loud color. The system breathes lime as the only siren.
- No skeuomorphic glass everywhere — glass is reserved for floating surfaces (nav pill, popovers, sheets, the device-shell preview). Cards on canvas stay flat with hairline border.
- No more navy anywhere. If a token references obsidian-9 it's because the canvas demanded it, not nostalgia.
- No glassmorphism as fashion — it's a tool for hierarchy, used sparingly.
- No "fancy because we can." Every glow, every blur, every uppercase tracked label is earning its keep.

## Cascade plan

1. **Tokens first** — `globals.css` rewrite: drop navy/sky, add obsidian/cream/fog, retune accent ramp, add glow / glass / grid utilities, bump radius scale (8 / 12 / 16 / 24 / 999 — full pill), bump display type, leave 8pt grid intact.
2. **Shell + nav** — pill-glass top nav, hairline page frame, ambient radial glow at hero.
3. **Foundations page** — full rebuild: principles → palette → typography (display / italic / mono) → surfaces (canvas / raised / glass) → elevation (hairline / card / glow) → grid → radius → motion → brutalist frame demo → glow demo. Keep the 8pt grid section but folded under "Spacing & grid".
4. **Primitives** — update Card (radius-up, glass option), Button (lime glow on hero variant, pill option), Badge (mono uppercase variant), Alert (no navy bg), Field (radius-up), Modal/Drawer (glass surface), Tooltip (glass + hairline), TabBar / TopNav (pill-glass), LiveDot (lime glow pulse), RateTicker (mono).
5. **Library page** — refresh hero to the new visual direction; keep the 25-section structure; restyle showcases.
6. **Templates (saas, landing, tool, ecommerce, mobile, desktop)** — restyle each so the new direction comes through. Keep their structural moves; replace navy → obsidian, refresh hero treatments.
7. **Design-system docs** — update `00-foundations/` (replace mood "quiet-industrial" default to "obsidian-lime"; update color, motion, voice docs); update `01-tokens/` JSON to the new palette; update `02-components/` specs to v0.4 vocabulary.
8. **Verify** — `tsc --noEmit`, eslint purity rules, commit, push, Vercel build green.

No localhost. View on Vercel only.
