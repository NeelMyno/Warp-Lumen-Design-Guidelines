---
name: lumen-mode-scope
description: Use when wrapping a landing / marketing / AI surface / onboarding / empty-state / hero panel in expressive mode, or when explicitly marking a section as restrained. Returns a single-element React container with `data-mode` set so descendants resolve mode-aware Lumen semantic tokens (surface.hero, surface.canvas-ambient, surface.atmosphere, motion.atmosphere) without any per-component branching.
---

# Lumen ModeScope

A 30-line React primitive that sets `data-mode="restrained" | "expressive"` on a container. The single source-of-truth for switching Lumen modes. Mode is a scope attribute, NEVER a per-component prop.

## Use when

- Wrapping a landing page / marketing surface in expressive mode for the atmospheric hero treatment.
- Wrapping an AI chat / agent / generation panel in expressive mode for the alive feel.
- Wrapping an onboarding flow / empty state / hero device frame in expressive mode for the narrative moment.
- Explicitly marking a region as restrained when the surrounding context is expressive (rare — almost always restrained is the page default).

## NEVER

- NEVER nest a ModeScope of opposite mode inside another ModeScope. Mode-mixing on the same page invites contrast bugs.
- NEVER pass `mode` as a prop to any individual component. Mode is a scope attribute. Components do NOT branch on mode.
- NEVER apply `data-mode` directly to a primitive element. Always use ModeScope.
- NEVER use expressive mode on a data table / row / cell / chart axis / any operator-density surface.
- NEVER assume mode controls layout. Mode rebinds ONLY surface / atmosphere / motion tokens.

## Tokens consumed

- `surface.canvas` — page background. Stays solid obsidian across modes.
- `surface.hero` — restrained: solid obsidian; expressive: mesh.aurora-spring.
- `surface.canvas-ambient` — restrained: solid obsidian; expressive: gradient.canvas-ambient.
- `surface.atmosphere` — restrained: transparent; expressive: color.alpha.accent.12 overlay.
- `motion.atmosphere` — restrained: none; expressive: mesh-drift 24s ease-in-out infinite alternate.

## Anatomy

1. A single HTML element (default `<div>`, optionally `<section>` / `<main>` / `<article>` via the `as` prop).
2. `data-mode` attribute pinned to `"restrained"` or `"expressive"`.
3. Children pass through unchanged.

## API

```ts
type LumenMode = "restrained" | "expressive";

interface ModeScopeProps {
  mode?: LumenMode;            // default "restrained"
  as?: "div" | "section" | "main" | "article";  // default "div"
  className?: string;
  children: ReactNode;
}
```

## Modes

ModeScope IS the mode switch. It does not respond to mode — it sets mode.

## Accessibility

- The `data-mode` attribute is for CSS variable scoping. It carries no semantic meaning for assistive tech.
- Mesh + grain + aurora animations gate on `prefers-reduced-motion` via @media in `dist/css/lumen.scoping.css`.
- Glass blur + atmospheric overlays gate on `prefers-reduced-transparency` via @media in the same file.

## Code (canonical)

```tsx
// 02-components/mode-scope/examples/primary.tsx
import type { ReactNode } from "react";

export type LumenMode = "restrained" | "expressive";

export interface ModeScopeProps {
  mode?: LumenMode;
  as?: "div" | "section" | "main" | "article";
  className?: string;
  children: ReactNode;
}

export function ModeScope({
  mode = "restrained",
  as: Component = "div",
  className,
  children,
}: ModeScopeProps) {
  return (
    <Component data-mode={mode} className={className}>
      {children}
    </Component>
  );
}
```

## Related

- `00-foundations/modes.md` — restrained × expressive routing table, scope-attribute contract, fallback rules.
- `01-tokens/modes/restrained.tokens.json` — restrained mode rebind set.
- `01-tokens/modes/expressive.tokens.json` — expressive mode rebind set.
- `doc/LUMEN-v0.13-MASTER-REFACTOR.md` §2 constraint 1 (dual-mode, scope attribute), §5 architecture, §7 Phase 1.
