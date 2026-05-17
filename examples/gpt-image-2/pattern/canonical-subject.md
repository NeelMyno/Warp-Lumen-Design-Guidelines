---
template: pattern
slug: seamless-hairline-lane-grid
model: gpt-image-2-2026-04-21
quality: high
thinking_mode: true
aspect: 1:1
output_resolution: 512×512
output_file: seamless-hairline-lane-grid.png
version: 0.13.0
last_baselined: pending-operator-generation
---

# Canonical subject — pattern

## Subject (paste into `--subject`)

```
seamless hairline lane grid, 512×512, tileable — 32×32 cells, 1px white lines at 6% opacity, dark obsidian background (#0D0D0D), uniform density, no focal point, no accent moment, edges match left↔right and top↔bottom for repeat tiling
```

## Generation command

```bash
pnpm prompts pattern \
  --subject "seamless hairline lane grid, 512×512, tileable — 32×32 cells, 1px white lines at 6% opacity, dark obsidian background (#0D0D0D), uniform density, no focal point, no accent moment, edges match left↔right and top↔bottom for repeat tiling" \
  > /tmp/pattern-prompt.md
```

## Why this subject

Tests the hardest constraint in this template: **seamless tiling**. Tile patterns that fail are visually obvious — a seam shows the moment you mentally repeat the asset 2×2. This subject explicitly names the tile constraint at the subject level (not just in the template's constraints section) to give the model two reinforcement passes.

The 32×32 cell grid is dense enough to read as pattern, sparse enough to disappear into chrome at 50% size. The 1px / 6% opacity discipline keeps it from competing with foreground content.

## Diff-against-baseline notes

- [ ] **Seamless tiling**: mentally place the tile in a 2×2 grid — no visible seam at any edge
- [ ] Hairline weight: lines are 1px at 6% opacity (whisper)
- [ ] Uniform density across the frame (no focal point)
- [ ] Dark obsidian background mandatory (#0D0D0D bake)
- [ ] Zero Spring Green accent
- [ ] No photoreal texture
- [ ] No 3D depth, no drop shadows
- [ ] Reads as background chrome, not as foreground texture at 50% size

## Tile verification (recommended)

After saving the PNG:

```bash
# ImageMagick (if installed):
convert seamless-hairline-lane-grid.png \
  -duplicate 1 +append \
  -duplicate 1 -append \
  /tmp/tile-2x2-preview.png
open /tmp/tile-2x2-preview.png
```

If a seam appears at the join, regenerate with stronger edge-match guidance and ask for "explicit edge symmetry" in the prompt.

## Source

- Template: [`design-system/05-prompts/pattern.md`](../../../design-system/05-prompts/pattern.md)
- Anchor: [`design-system/05-prompts/style-anchor.md`](../../../design-system/05-prompts/style-anchor.md)
