# PHASE 1 — Expressive Mode Primitives

Execute master doc §7.Phase-1. Master doc is your single source of truth; this prompt adds execution-level detail only.

## What this phase ships

The expressive-mode token sets (glass, mesh, noise, gradient), the mode-scope mechanism that rebinds semantic tokens via `data-mode` attribute, and a single landing-hero proof-of-concept that validates the mechanism end to end. After this phase, every component built in Phase 2 inherits dual-mode behavior automatically without any per-component branching.

## Technical pins

| Tool | Version | Why |
|---|---|---|
| React | `^19.0.0` | Already pinned by Lumen v0.12.4 stack |
| Next.js | `^15.0.0` | Already pinned; needed for the landing-hero proof-of-concept |
| Lighthouse CI | `^0.14.0` | Phase 1 gate runner |

## Work to do

### Group A — Expressive primitives (write all four in parallel)

Create these files in `01-tokens/primitives/`. Each one is DTCG 2025.10 format. Each is **expressive-mode only** — restrained mode never references these primitives directly.

**`glass.tokens.json`** — Four named glass recipes, each as a composite under `$extensions.lumen.glass`:

- `glass.subtle` — blur 12px, saturate 120%, alpha 0.4, hairline border at `border.hairline`. Use for inline glass moments (tag chips, inline pills).
- `glass.default` — blur 20px, saturate 140%, alpha 0.5, hairline. Default popover/sheet glass per foundations page.
- `glass.strong` — blur 28px, saturate 160%, alpha 0.6, hairline. Modal and full-screen sheet.
- `glass.tinted-accent` — blur 20px, saturate 140%, alpha 0.5, base `{color.spring.500}` at 8% mix, hairline at `border.accent`. The lime-tinted floating shell.

Each entry has an explicit `fallback` aliased to a solid surface for `@supports not (backdrop-filter)` and `prefers-reduced-transparency: reduce`.

**`mesh.tokens.json`** — Five named mesh recipes. Each is a composite `$type: "gradient"` with multiple radial-gradient stops, suitable for direct paste into a CSS `background:` declaration. Freight-domain naming:

- `mesh.aurora-spring` — Three radial blobs: deep teal at 30% 20%, spring-green at 70% 60%, deep indigo at 20% 80%. Each blob at 8–12% opacity max over obsidian. The default landing hero atmosphere.
- `mesh.aurora-cool` — Same three-blob structure, cool indigo + slate + faint spring accent. For AI surfaces (slightly cooler temperature than aurora-spring).
- `mesh.dock-bay` — Two large soft blobs simulating a top-down cross-dock floor — warmer cool tone at 30% 30%, dimmer spring accent at 70% 70%. For shipment-related onboarding.
- `mesh.lane-arc` — A diagonal sweep from upper-left to lower-right, simulating a long-haul route arc on a map. Spring accent emerges at the midpoint. For empty states on routing surfaces.
- `mesh.cross-dock` — A grid-tinted ambient simulating a cross-dock pallet layout — four soft tinted regions in a 2×2 pattern. For dashboard hero panels that need atmosphere without losing operator-density feel.

Each recipe carries `$extensions.lumen.atmosphere` with `intensity` (4–14%, defaulting to 10%) so the same mesh can be used at lower intensity on restrained-mode surfaces that want a hint of atmosphere without going full expressive.

**`noise.tokens.json`** — Three grain variants. Each is an SVG `feTurbulence` data URI, encoded inline:

- `noise.subtle` — `baseFrequency 0.65`, `numOctaves 3`, `stitchTiles stitch`, at 6% opacity. Defeats gradient banding without being visible.
- `noise.default` — Same SVG parameters, 8% opacity. The default landing-page grain.
- `noise.strong` — Same SVG, 12% opacity. For hero moments that lean into the tactile mood.

`$value` is the full `data:image/svg+xml;base64,...` string. `numOctaves` above 4 is performance waste with no visual gain — do not exceed 3 in the SVG. Animate gradient hue or stop positions, never the feTurbulence filter itself.

**`gradient.tokens.json`** — Ambient gradient atmospheres for surfaces that want a hint of expressive without a full mesh:

- `gradient.canvas-ambient` — Very subtle radial from obsidian.9 at center to obsidian.10 at edges, suggesting a faint lit-from-within feel.
- `gradient.hero-scrim` — Vertical fade from `surface.glass` at top to transparent at 40% — for text overlay on a mesh background.
- `gradient.card-edge` — Diagonal hairline gradient for card edges in expressive mode, lifting them subtly.

### Group B — Mode rebind sets

Create `01-tokens/modes/`:

**`restrained.tokens.json`** — Rebinds every semantic token that varies between modes to its restrained-mode value. Most surface tokens already resolve to restrained values in their `01-tokens/semantic/` definitions, so this file mostly re-aliases for clarity:
- `surface.canvas → {color.obsidian.10}` (solid)
- `surface.hero → {color.obsidian.10}` (solid, flat per master doc; restrained heroes are calm)
- `surface.canvas-ambient → {color.obsidian.10}` (no gradient)
- `motion.atmosphere → none` (no animated mesh on restrained surfaces)

**`expressive.tokens.json`** — Rebinds the same semantic tokens to expressive-mode values:
- `surface.canvas → {color.obsidian.10}` (still solid; mesh goes on hero/atmosphere, not page canvas)
- `surface.hero → {mesh.aurora-spring}` (full mesh recipe)
- `surface.canvas-ambient → {gradient.canvas-ambient}` (subtle radial)
- `motion.atmosphere → animate(mesh-drift, 24s, ease-in-out, infinite, alternate)` — slow gradient-stop drift, not a true mesh re-render

Both files load conditionally via the CSS variable scoping in Group D below. Neither file overrides primitives; both only rebind semantic-layer tokens.

### Group C — The `ModeScope` component

Create `02-components/mode-scope/`. This is a tiny primitive — about 30 lines of TSX — that does one thing: sets `data-mode` on a div container.

```tsx
// 02-components/mode-scope/mode-scope.tsx
import { ReactNode } from "react";

export type LumenMode = "restrained" | "expressive";

export interface ModeScopeProps {
  mode?: LumenMode;
  children: ReactNode;
  as?: "div" | "section" | "main" | "article";
  className?: string;
}

export function ModeScope({
  mode = "restrained",
  children,
  as: Component = "div",
  className,
}: ModeScopeProps) {
  return (
    <Component data-mode={mode} className={className}>
      {children}
    </Component>
  );
}
```

Add a `mode-scope.skill.md` per the SKILL.md template referenced in master doc §8.3. Key NEVER rules to surface in the SKILL.md:

- NEVER nest a `ModeScope` of opposite mode inside another `ModeScope` (mode-mixing on the same page invites contrast bugs).
- NEVER pass `mode` as a prop to any individual component; mode is a scope attribute, not a component variant.
- NEVER apply `data-mode` directly to a primitive element; use `ModeScope` so the attribute is paired with the right React semantics.

Add `mode-scope.tsx` to `registry.json` items list (it ships as `@lumen/mode-scope`). Generate `mode-scope.registry.json` per master doc §8.6 template.

### Group D — CSS variable scoping

In `dist/css/lumen.css` (regenerated by `pnpm run tokens`), the structure is:

```css
:root {
  /* primitives — always loaded */
  --color-spring-500: #00FA8A;
  --color-obsidian-10: #0D0D0D;
  /* …all primitives… */
}

:root,
[data-mode="restrained"] {
  /* restrained-mode semantic rebinds — default */
  --surface-canvas: var(--color-obsidian-10);
  --surface-hero: var(--color-obsidian-10);
  --surface-canvas-ambient: var(--color-obsidian-10);
  --motion-atmosphere: none;
  /* …all restrained semantic tokens… */
}

[data-mode="expressive"] {
  /* expressive-mode rebinds — opt-in via ModeScope */
  --surface-hero: /* mesh.aurora-spring resolved */;
  --surface-canvas-ambient: /* gradient.canvas-ambient resolved */;
  --motion-atmosphere: mesh-drift 24s ease-in-out infinite alternate;
}

@media (prefers-reduced-transparency: reduce) {
  [data-mode="expressive"] {
    --surface-hero: var(--color-obsidian-10);
    --motion-atmosphere: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-mode="expressive"] {
    --motion-atmosphere: none;
  }
}

@supports not (backdrop-filter: blur(1px)) {
  /* solid-surface fallbacks for all glass tokens */
}
```

The Style Dictionary v5 config in `tools/style-dictionary.config.ts` produces this structure via a custom formatter — write the formatter as part of this phase.

### Group E — The landing-hero proof-of-concept

Create `examples/landing-hero/`. Next.js 15 app router page. The hero demonstrates the mode mechanism end-to-end by rendering the **same component tree** in both modes via a toggle.

Page structure:

```tsx
// examples/landing-hero/page.tsx
"use client";
import { useState } from "react";
import { ModeScope, type LumenMode } from "@/components/mode-scope";
import { LandingHero } from "./landing-hero";

export default function LandingHeroExample() {
  const [mode, setMode] = useState<LumenMode>("expressive");
  return (
    <main>
      <button onClick={() => setMode(m => m === "restrained" ? "expressive" : "restrained")}>
        Toggle mode: {mode}
      </button>
      <ModeScope mode={mode}>
        <LandingHero />
      </ModeScope>
    </main>
  );
}
```

`LandingHero` itself is mode-agnostic. It consumes only semantic tokens — `surface.hero`, `surface.canvas-ambient`, `text.primary`, `text.accent`, `border.frame`. It renders:
- Hero panel with `background: var(--surface-hero)` (which resolves to mesh in expressive, flat obsidian in restrained)
- A brutalist hairline frame around a headline ("Operations as **instruments**.")
- One italic accent word in `text.accent` (Spring Green)
- A mono-uppercase tracked label ("SYSTEM V0.13 · LIVE")
- A primary CTA button with `shadow.glow-accent`
- A noise overlay via `noise.default` (visible only in expressive mode, faded out in restrained via a `[data-mode="restrained"] .noise-overlay { opacity: 0 }` rule)

The exact same JSX. The toggle proves the mode rebind works. Take a screenshot of both modes for the phase report.

## Decisions you will likely make unilaterally

- Whether to use CSS `@property` registrations for the mesh gradient variables so they animate smoothly. Default: yes for the four animated mesh stops. Use `@property --mesh-stop-1` declarations at the top of `dist/css/lumen.css`.
- How to animate `mesh-drift`. Default: animate gradient stop positions, not hue, not feTurbulence. Two keyframes drifting positions by 8–12%, 24s loop, ease-in-out, alternate.
- Whether to ship the landing-hero example as a standalone Next.js app in `examples/landing-hero/` or as a Storybook story. Default: standalone Next.js page for the Lighthouse gate. Storybook story comes in Phase 2.
- Whether `mesh.cross-dock` belongs in this phase or Phase 2 with the dashboard components. Default: ship in this phase since the token is a primitive; consumption comes in Phase 2.

## Verification gates for Phase 1

| Gate | Pass condition |
|---|---|
| Token build | `pnpm run tokens` exits 0 with expressive tokens included |
| Mode toggle | The landing-hero example renders visually distinct output in restrained vs expressive modes |
| Reduced transparency | DevTools "Emulate prefers-reduced-transparency: reduce" collapses glass to ≥85% alpha and drops mesh from `surface.hero` |
| Reduced motion | DevTools "Emulate prefers-reduced-motion: reduce" stops mesh drift and collapses transitions to `0ms` |
| `@supports` fallback | Disabling `backdrop-filter` in DevTools falls back to solid `surface.glass.fallback` value |
| Lighthouse Performance | ≥ 90 on emulated Pixel 6a Slow 4G against the landing-hero page in expressive mode |
| CLS | < 0.1 on the landing-hero page |
| LCP | < 2.5s on the landing-hero page |
| Contrast in expressive | `tools/audit-contrast.ts` reports 100% pass on body text and large UI rendered over `surface.hero` in expressive mode (this is the cliff condition — if any text fails, raise `surface.hero`'s effective lightness via a tint layer or reject the mesh recipe) |
| Self-critique | All 15 questions in master doc §10.1 answered "no" in the phase report |

## Stop condition

Phase report into `design-system/06-claude-code-briefings/phase-1-report.md` per master doc §10.3. Commit message: `feat(lumen): phase 1 — expressive mode primitives and mode-scope mechanism`. **Halt**. Wait for the Phase 2 prompt.
