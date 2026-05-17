---
name: Pattern
type: prompt-template
version: 0.13.0
last_updated: 2026-05-17
audience: [llm-agent, designer, engineer]
asset_type: pattern
aspect: 1:1
output: 512×512 (tile)
mode: restrained
related:
  - ./style-anchor.md
  - ./hero-background.md
  - ./mesh.md
  - ../../doc/LUMEN-v0.13-MASTER-REFACTOR.md
---

# Pattern — Lumen v0.13

@import ./style-anchor.md

## Model pin
- Model: `gpt-image-2` (snapshot `gpt-image-2-2026-04-21`).
- Quality: `high`.
- Thinking mode: **ON** — tile patterns benefit from cross-edge coherence. If gpt-image-2 supports a seamless-tile mode, request it explicitly.

## Subject

[FILL THIS SLOT — fill the SUBJECT slot of the style anchor with template-specific content like:]

> A seamless tile pattern at 512×512 that repeats — a hairline lane grid, a faint pallet topology, a cross-dock floor lattice, a network node mesh, a freight container facet array, a route-arc lattice, a dock-bay column grid — rendered at 4–8% accent saturation max, dark obsidian background mandatory. The pattern is industrial Swiss-grid: precise, hairline-defined, calmly repetitive. No focal point — every cell is equally important; the eye doesn't anchor anywhere.

Subject options:
- **Hairline lane grid**: 32×32 cell lattice, lines at 1px white at 6% opacity.
- **Pallet topology**: square-pallet cells arranged in offset rows, hairline-bordered.
- **Cross-dock floor lattice**: long-rectangle bays with column anchors, axonometric.
- **Network node mesh**: dots at lattice intersections, hairline connections between adjacent nodes only.
- **Container facet array**: rectangular cells with hairline interior cross-bracing (suggests container side panels).
- **Route-arc lattice**: faint curved arcs at lattice cells, all arcs in the same direction.
- **Dock-bay column grid**: vertical columns at regular intervals, hairline horizontals connecting.

## Composition override

- **Aspect**: 1:1 square.
- **Output**: 512×512 (tile size; CSS `background-repeat: repeat` consumes it directly).
- **Seamless tiling**: the right edge MUST match the left edge; the top edge MUST match the bottom edge. Generate with explicit tile-edge guidance.
- **No focal point**: pattern density is uniform across the frame; no quadrant carries more weight than another.

## Use case override

- Background tiles on dashboard cards (subtle, never competes with content).
- Divider treatments on landing-page section breaks.
- Hairline overlay textures on hero backgrounds (over a solid obsidian fill).
- Login screen background.
- Email signature footer texture.

## Mode

**Restrained.** Atmosphere at 0% (the anchor's atmospheric fog is disabled for patterns — patterns are deterministic geometry, not atmospheric). Grain at 4–6%. Mesh disabled. No accent moment unless the consumer surface explicitly requires one — patterns are chrome, not focal.

If the consumer surface is expressive (landing-page hero overlay), the pattern stays restrained; the expressive atmosphere comes from layered atmosphere over the pattern, not from the pattern itself.

## Template-specific constraints

- **MUST tile cleanly with no visible seam.** Verify by mentally tiling the output 2×2 — if the edges show, regenerate with explicit seamless-tile guidance.
- **NO focal point.** Patterns are background chrome; they MUST NOT compete with foreground content.
- **4–8% accent saturation MAX.** If the pattern carries any Spring Green at all, it's at the lowest end of perceivability — the accent reads only as a faint tonal warmth.
- **NO photoreal textures** — no fabric weave, no wood grain, no concrete. Pattern is geometric only.
- **NO 3D depth, NO drop shadows on cells** — pattern is flat, hairline-defined, Swiss-grid discipline.
- **NO randomness in cell content.** Every cell is the same primitive (a lane segment, a pallet, a node). Variation is in scale or rotation, not in shape.
- **Dark obsidian background mandatory.** Patterns ship as PNGs with `#0D0D0D` background bake. The consumer CSS may overlay a different surface, but the source pattern is dark.

## Failure modes

1. **Visible seam at tile edge** when mentally tiled 2×2 → re-prompt: `seamless tile, edge-matched. The right edge MUST be the mirror-continuation of the left edge; same for top/bottom. Verify by imagining the tile repeated 2x2 — no seams should appear.`
2. **Pattern has a focal point** (one cell larger, one accent stronger) → re-prompt: `every cell is equally weighted. No focal point. No accent variation. Uniform density across the frame.`
3. **Cells carry photoreal texture** (concrete, metal, fabric) → re-prompt: `geometric only. No texture, no material, no surface render. Hairline outlines and negative space.`
4. **Pattern too dense** (visual noise at 50% size) → re-prompt: `reduce cell count by half. The pattern should read as restrained background chrome, not as foreground texture.`

## Reference asset

`examples/gpt-image-2/pattern/canonical-subject.md` documents the exact subject text the reference PNG was generated from. The default reference is "seamless hairline lane grid, 512×512, tileable".

## Tile verification recipe

Quick way to verify a generated pattern tiles cleanly:

```bash
# After saving the generated PNG as pattern.png, build a 2x2 tile preview:
convert pattern.png -append -duplicate 1 +append /tmp/tile-preview.png
# Or in CSS:
# <div style="width: 1024px; height: 1024px;
#   background: url(pattern.png) repeat;
#   background-color: #0D0D0D;"></div>
```

If you see a seam where the tiles meet, regenerate with stronger edge-match guidance.
