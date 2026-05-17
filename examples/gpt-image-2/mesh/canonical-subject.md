---
template: mesh
slug: five-recipes
model: gpt-image-2-2026-04-21
quality: high
thinking_mode: true
aspect: 16:9
output_resolution: 2560×1440
output_files:
  - aurora-spring.png
  - aurora-cool.png
  - dock-bay.png
  - lane-arc.png
  - cross-dock.png
version: 0.13.0
last_baselined: pending-operator-generation
---

# Canonical subject — mesh (five recipes)

## Subjects (one per recipe)

| Recipe | Subject (paste into `--subject`) |
|---|---|
| `aurora-spring` | Dawn-warm aurora — Spring Green #00FA8A at 12% drifting upper-left, deep teal #0F3B36 at 8% drifting lower-right, against obsidian #0D0D0D. Volumetric fog, no hard edges. The mood is "first shift starting." |
| `aurora-cool` | Dusk-cool aurora — soft indigo #1B1E3A at 10% drifting upper-right, faint Spring Green #00FA8A at 6% in lower-left, against obsidian #0D0D0D. Cooler temperature, slightly more atmospheric haze. The mood is "last truck of the day." |
| `dock-bay` | Industrial bay glow — warm Spring Green #00FA8A at 14% concentrated mid-frame (suggests an open dock door), surrounded by deeper obsidian fade, faint amber atmospheric tint #3B2E10 at 4% in the outer ring. The mood is "active dock at 6am." |
| `lane-arc` | Trajectory atmosphere — Spring Green #00FA8A at 10% sweeping in a single diagonal arc from upper-left to lower-right, with deep teal #0F3B36 haze in the corners against obsidian. The arc IS the mesh's structure — atmospheric, not literal. The mood is "lane in motion." |
| `cross-dock` | Terminal floor glow — Spring Green #00FA8A at 8% in three columnar slots evenly spaced across the frame (suggests open bay doors), with darker bands between, against obsidian. The mood is "shift change at the terminal." |

## Generation command (RECOMMENDED — single thinking-mode session)

The five recipes MUST be generated in **one thinking-mode session** for cross-recipe consistency. The `generate-references.ts` script handles this by passing all five subjects to a single API call with thinking mode ON.

```bash
pnpm prompts:generate-references --template mesh
```

If generating manually via ChatGPT (thinking mode ON), open one conversation and request all five in sequence in the same thread. Do NOT generate them across separate sessions — the visual coherence as a set is the whole point of the mesh recipes.

## Why these five recipes

These are the **Phase 1 mesh-token surface** frozen into `design-system/01-tokens/primitives/mesh.tokens.json`. The PNGs are the visual baseline for the CSS recipes. The CSS reproduces the visual in code; the PNG is the visual target.

Recipe assignment guide (which feature surface uses which recipe):

| Recipe | Surface that consumes it |
|---|---|
| `aurora-spring` | new-feature heroes, onboarding step 1, marketing-card "new" features |
| `aurora-cool` | AI/dispatch surfaces, blog post heroes, dusk-narrative illustrations |
| `dock-bay` | terminal/cross-dock features, dock-management UI heroes |
| `lane-arc` | tracking/optimization features, route-visualization heroes |
| `cross-dock` | automation features, terminal-throughput surfaces |

## Diff-against-baseline notes (per recipe)

For EVERY recipe, check:

- [ ] Volumetric fog throughout, no hard gradient edges
- [ ] Spring Green saturation never above the recipe's named max
- [ ] No second saturated color beyond the recipe's named secondary (deep teal | indigo | amber)
- [ ] No galaxy / nebula aesthetic
- [ ] Mood matches the recipe's named mood
- [ ] Reads as atmospheric gradient, NOT as composition

Cross-recipe coherence check:

- [ ] Laid out side-by-side, the five recipes look like ONE design language (same atmosphere physics, same fog density, same hairline discipline)
- [ ] No recipe is visually OUT of family (e.g., one suddenly cyan, one suddenly warm-tinted across the whole frame)
- [ ] The Spring Green accent is recognizably the SAME green in every recipe (not a slightly different shade per recipe)

## Source

- Template: [`design-system/05-prompts/mesh.md`](../../../design-system/05-prompts/mesh.md)
- Anchor: [`design-system/05-prompts/style-anchor.md`](../../../design-system/05-prompts/style-anchor.md)
- Token source: [`design-system/01-tokens/primitives/mesh.tokens.json`](../../../design-system/01-tokens/primitives/mesh.tokens.json) (Phase 1)
