---
name: Mesh
type: prompt-template
version: 0.13.0
last_updated: 2026-05-17
audience: [llm-agent, designer, engineer]
asset_type: mesh
aspect: 16:9
output: 2560×1440 (default) | 3840×2160 (4K)
mode: expressive
related:
  - ./style-anchor.md
  - ./hero-background.md
  - ./pattern.md
  - ../../doc/LUMEN-v0.13-MASTER-REFACTOR.md
  - ../01-tokens/primitives/mesh.tokens.json
---

# Mesh — Lumen v0.13

@import ./style-anchor.md

## Model pin
- Model: `gpt-image-2` (snapshot `gpt-image-2-2026-04-21`).
- Quality: `high`.
- Thinking mode: **ON** when generating all five named recipes from a single session — cross-frame consistency is the whole point.

## Subject

[FILL THIS SLOT — fill the SUBJECT slot of the style anchor with ONE of the five named mesh-recipe slots from Phase 1's `mesh.tokens.json`:]

| Recipe | Slot subject |
|---|---|
| `mesh.aurora-spring` | Dawn-warm aurora — Spring Green `#00FA8A` at 12% drifting upper-left, deep teal `#0F3B36` at 8% drifting lower-right, against obsidian. Volumetric fog, no hard edges. The mood is "first shift starting." |
| `mesh.aurora-cool` | Dusk-cool aurora — soft indigo `#1B1E3A` at 10% drifting upper-right, faint Spring Green `#00FA8A` at 6% in lower-left, against obsidian. Cooler temperature, slightly more atmospheric haze. The mood is "last truck of the day." |
| `mesh.dock-bay` | Industrial bay glow — warm Spring Green `#00FA8A` at 14% concentrated mid-frame (suggests an open dock door), surrounded by deeper obsidian fade, faint amber atmospheric tint `#3B2E10` at 4% in the outer ring. The mood is "active dock at 6am." |
| `mesh.lane-arc` | Trajectory atmosphere — Spring Green `#00FA8A` at 10% sweeping in a single diagonal arc from upper-left to lower-right, with deep teal `#0F3B36` haze in the corners. The arc IS the mesh's structure — atmospheric, not literal. The mood is "lane in motion." |
| `mesh.cross-dock` | Terminal floor glow — Spring Green `#00FA8A` at 8% in three columnar slots evenly spaced across the frame (suggests open bay doors), with darker bands between, against obsidian. The mood is "shift change at the terminal." |

The CLI accepts the recipe name as the `--subject` argument and resolves to the slot text above.

## Composition override

- **Aspect**: 16:9.
- **Output**: 2560×1440 (default; the CSS recipe consumes this as the visual reference). 3840×2160 (4K) for marketing imagery print-grade.
- **Generate all five recipes in one thinking-mode session** if extracting all five at once — the cross-recipe consistency is what makes the set feel like one design language.
- **No focal point**: meshes are atmospheric gradients, not compositions. Visual weight is distributed.

## Use case override

- **Visual reference**: the PNG is a screenshot of what the CSS mesh recipe should look like — used by engineers as the visual target when writing the CSS gradient.
- **PNG fallback**: for browsers without `backdrop-filter` (rare in 2026 but possible on old enterprise Windows), the CSS recipe falls back to the PNG.
- **Marketing imagery**: where the CSS recipe can't render (email, print, social card), the PNG ships in its place.
- **Audit baseline**: when re-baselining mesh recipes after a model snapshot lift, the diff against the prior PNG is the drift signal.

## Mode

**Expressive.** Meshes are by definition expressive — they exist to add atmospheric warmth to landing pages and marketing surfaces. Atmosphere at 10–14% (per the anchor's expressive ceiling). Grain at 8% (per the anchor default — meshes inherit grain unchanged from the anchor).

Meshes never ship to restrained surfaces. Operator dashboards, settings panels, data tables, and terminal-style command palettes get atmosphere at 4–6% via the dark.tokens.json defaults — they never consume a mesh recipe.

## Template-specific constraints

- **EXACTLY ONE named recipe per asset generation.** Do not blend two recipes (no "aurora-spring meets dock-bay" — that produces visual incoherence).
- **NO photoreal landscapes** — meshes are atmospheric gradients, not skies, not landscapes, not nebulae.
- **NO galaxy / nebula aesthetic.** The Lumen mesh is calm industrial atmosphere — instrument-panel mood, not space-render mood.
- **NO sharp gradient edges** — every transition is volumetric fog, no hard bands.
- **NO Spring Green saturation above 14%** anywhere in the frame. The accent stays under-stated even at the recipe's max.
- **NO second saturated color** unless explicitly named in the recipe subject (the `aurora-cool` indigo is named; do not invent purples elsewhere).

## Failure modes

1. **Output reads as a galaxy** (sharp star points, deep-space depth) → re-prompt: `industrial atmospheric gradient, NOT a galaxy. No stars, no nebula structure. Calm volumetric fog only.`
2. **Sharp gradient bands appear** (visible color stops) → re-prompt: `fully volumetric, no hard edges, no visible gradient stops. The transition is fog-soft across every pixel.`
3. **Second saturated color sneaks in** (purple/orange/pink) → re-prompt naming the unwanted color: `do not introduce purple/orange/pink. The recipe permits only obsidian background, Spring Green at the named opacity, and the named secondary color (deep teal | indigo | amber) at the named opacity.`
4. **Recipe drift between sessions** → regenerate all five in one thinking-mode session with explicit cross-recipe naming.

## The five recipes — provenance

These five recipe names are the Phase 1 mesh-token surface, frozen into `01-tokens/primitives/mesh.tokens.json` at the start of Phase 1. The PNGs generated from this template are the **visual baseline** for the CSS recipes — the CSS reproduces the visual in code; the PNG is the visual target.

When a recipe is added (or removed), the change lands in both `mesh.tokens.json` and `mesh.md` simultaneously, and the affected reference PNG is regenerated. Mesh drift is the most visible drift signal in the system — the eye catches it instantly across landing pages.

## Reference assets

`examples/gpt-image-2/mesh/canonical-subject.md` documents the five canonical subjects. The default reference set is all five recipes, generated as one thinking-mode session, stored as:

- `examples/gpt-image-2/mesh/aurora-spring.png`
- `examples/gpt-image-2/mesh/aurora-cool.png`
- `examples/gpt-image-2/mesh/dock-bay.png`
- `examples/gpt-image-2/mesh/lane-arc.png`
- `examples/gpt-image-2/mesh/cross-dock.png`
