---
name: Abstract Shape
type: prompt-template
version: 0.13.0
last_updated: 2026-05-17
audience: [llm-agent, designer, engineer]
asset_type: abstract-shape
aspect: 1:1
output: 1600×1600
mode: restrained
related:
  - ./style-anchor.md
  - ./illustration.md
  - ./empty-state.md
  - ../../doc/LUMEN-v0.13-MASTER-REFACTOR.md
---

# Abstract shape — Lumen v0.13

@import ./style-anchor.md

## Model pin
- Model: `gpt-image-2` (snapshot `gpt-image-2-2026-04-21`).
- Quality: `high`.
- Thinking mode: **OFF**. Single shape, single frame.

## Subject

[FILL THIS SLOT — fill the SUBJECT slot of the style anchor with template-specific content like:]

> An abstract geometric shape — a freight container cross-section, a lane arc, a network node cluster, a pallet stack isometric, a dock bay grid — rendered as semi-transparent layered glass with subtle edge highlights. The shape suggests freight infrastructure without being literal. Hairline 1px white edges at 6–8% opacity define the geometry; the body of the shape carries faint volumetric depth.

The subject names a single freight-domain anchor:
- `freight container cross-section` — layered rectangular planes, isometric, suggests cargo capacity.
- `lane arc` — single curved trajectory from origin to destination, hairline weight, atmospheric perspective.
- `network node cluster` — 5–9 hairline-connected nodes, one of them pulsing Spring Green.
- `pallet stack isometric` — three layers of pallets, axonometric, no figures.
- `dock bay grid` — top-down dock-bay layout, hairline cells, one cell highlighted Spring Green.
- `cross-dock floor` — receding floor plane with column anchors and faint cross-traffic trails.

## Composition override

- **Aspect**: 1:1 square.
- **Output**: 1600×1600 (per master doc §9 "square illustration").
- **Focal placement**: shape centered, occupying 60–75% of the frame. The surrounding 12.5% margin on each side carries the anchor's atmospheric fog.
- **Single accent moment**: one Spring Green highlight on the focal element — the active dock bay, the destination node, the topmost pallet. Never more than one accent moment.

## Use case override

- Empty states for loading screens (above the loader, before the content arrives).
- Secondary hero illustrations on inner pages (feature pages, settings landing, profile setup).
- Loading screens during a multi-second compute step.
- Diagram covers for engineering / architecture docs that ship inside the design system.

## Mode

**Restrained** (default). Atmosphere at 4–6% opacity (the lower end of the anchor's 8–12% range). Drop the mesh entirely. Keep grain at 8%.

If the host surface is expressive (landing-page feature card), boost atmosphere to 10–12% and allow one of the mesh recipes from `mesh.md` (default: `lane-arc` or `dock-bay`).

## Template-specific constraints

- **NO photoreal humans** — abstract means geometric, not literal.
- **NO complete vehicles, NO complete buildings** — Lumen suggests freight infrastructure, never illustrates it photorealistically.
- **NO neon glow** — accent is a steady Spring Green tint, not a glow halo.
- **NO chromatic aberration** — hairlines are clean white at 6% opacity, never colored.
- **NO depth-of-field bokeh** — atmospheric perspective comes from opacity fall-off, not lens blur.
- **MUST suggest, never depict.** The container cross-section is layered planes, not a realistic ISO-container render. The lane arc is one curve and one accent moment, not a map.

## Failure modes

1. **Output reads as a literal render** (a fully-detailed ISO container, a photorealistic warehouse) → re-prompt: `render as semi-transparent layered glass planes with hairline edges, NOT as a literal photorealistic render. Suggest geometry, do not illustrate it.`
2. **Multiple accent moments** appear (two pallets highlighted Spring Green, three nodes pulsing) → re-prompt: `ONE focal accent moment only. The remaining shape is hairline white at 6% opacity. Spring Green appears exactly once.`
3. **Frame is too busy** (every cell of the dock grid is detailed) → re-prompt: `the grid is hairline only; cells are empty negative space. One cell carries the accent. The rest is geometry without content.`
4. **Shape feels static-symmetric** → re-prompt with a directional cue: `axonometric from upper-left; the shape recedes into the lower-right.`

## Reference asset

`examples/gpt-image-2/abstract-shape/canonical-subject.md` documents the exact subject text the reference PNG was generated from.
