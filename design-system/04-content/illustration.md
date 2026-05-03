---
name: Illustration
type: content
version: 1.0.0
last_updated: 2026-05-02
related: [./imagery.md, ./iconography.md]
---

# Illustration

> Lumen does not use illustrated characters, mascots, or scenes. When something needs visual explanation that a screenshot can't carry, we draw it the way an engineer would: monoline technical diagrams, in the same drawing language as the iconography.

## When illustration is allowed

- **System diagrams** — network topology, data flow, contract structure, integration map.
- **Spatial / geographic representations** — a US lane map, a warehouse floor plan, a port routing diagram.
- **Process diagrams** — booking flow, settlement flow, escalation tree.
- **Anatomy diagrams** — the parts of a Lumen component (used in `02-components/{name}/anatomy.svg`).

## When illustration is not allowed

- For decoration ("a friendly drawing of a truck waving").
- As a hero treatment in marketing (use a screenshot or documentary photo instead).
- To convey emotion ("a sad cloud" for an empty state).
- To represent abstract feelings ("a glowing brain for AI features").

## Drawing language

Every Lumen illustration follows these rules:

1. **Monoline.** Single 1.5 px stroke weight. No filled shapes (except small dots and arrowheads).
2. **Single color.** `text-primary` in light mode; `text-inverse` in dark mode. The accent green is permitted ONLY when the illustration is showing live state.
3. **Rounded ends.** `stroke-linecap: round`. `stroke-linejoin: round`.
4. **24 px grid alignment** at the icon scale; 8 px at the diagram scale.
5. **No perspective.** Flat top-down or flat side-on. Isometric is forbidden.
6. **No texture, no shading, no gradients** — except a very subtle ramp on long arrows showing data direction.
7. **No characters.** People appear only as silhouettes if absolutely required (pickup driver in a process diagram), and only as a 2 px stroke outline.

## Composition

- Generous whitespace inside the diagram.
- Labels in `type.body.sm` (14 px), aligned to the element they label.
- Connector lines pass behind labels with a 4 px white "knockout" so labels stay readable.
- Arrows: 1.5 px line + filled triangle head, sized 6 × 8 px.

## Annotation hierarchy

- Primary nodes: 1.5 px stroke, label `type.body.sm` semibold.
- Secondary nodes: 1.5 px stroke, label `type.body.sm` regular.
- Tertiary annotations (callouts, tooltips): `type.caption` muted, dotted leader line.

## Animation

Illustrations may animate when:
- Showing data flow (subtle leftward draw of an arrow on entry, ≤ 1 s).
- Showing state changes (a node fills with the accent green when "live").

Always honor `prefers-reduced-motion`.

## Tooling

- Built in Figma at 24 / 48 / 96 px artboard sizes.
- Exported as SVG, optimised with SVGO (preserve viewBox, strip metadata).
- Stored under `assets/illustrations/{name}/{light,dark}.svg`.

## Examples in this repo

- `design-system/02-components/{name}/anatomy.svg` — component anatomy diagrams (template; one per component).
- `assets/illustrations/network-topology.svg` — example system diagram (placeholder for now).

## What makes a Lumen illustration recognizable

- It looks like an engineer drew it on a whiteboard, then someone good cleaned it up.
- It teaches something about the system, not how the system feels.
- It's the same line weight, the same neutral, the same calm as the rest of the system.
