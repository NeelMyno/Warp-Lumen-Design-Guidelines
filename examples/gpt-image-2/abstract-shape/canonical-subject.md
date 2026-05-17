---
template: abstract-shape
slug: freight-container-cross-section
model: gpt-image-2-2026-04-21
quality: high
thinking_mode: false
aspect: 1:1
output_resolution: 1600×1600
output_file: freight-container-cross-section.png
version: 0.13.0
last_baselined: pending-operator-generation
---

# Canonical subject — abstract-shape

## Subject (paste into `--subject`)

```
freight container cross-section rendered as semi-transparent layered glass — isometric, hairline 1px white edges at 6% opacity, three depth layers, single Spring Green accent on the topmost layer
```

## Generation command

```bash
pnpm prompts abstract-shape \
  --subject "freight container cross-section rendered as semi-transparent layered glass — isometric, hairline 1px white edges at 6% opacity, three depth layers, single Spring Green accent on the topmost layer" \
  > /tmp/abstract-shape-prompt.md
```

## Why this subject

Tests three constraints simultaneously:
1. **Semi-transparent layered glass** — verifies the model renders frosted-glass surfaces without falling into glassmorphism (no rainbow refractions, no neon edges).
2. **Hairline 1px white at 6% opacity** — verifies the model respects the very-low-opacity discipline (Lumen hairlines whisper, never shout).
3. **Single Spring Green accent on the topmost layer** — verifies the single-accent rule (one focal moment, not distributed across the three layers).

The container cross-section is chosen because it suggests freight infrastructure without depicting it — the geometry is implied (rectangular planes, isometric perspective), not literal (no cargo, no labels, no ports of any specific carrier).

## Diff-against-baseline notes

- [ ] Three layered planes visible, isometric perspective
- [ ] Hairline edges at ~6% opacity (whisper, not shout)
- [ ] Exactly ONE Spring Green accent moment
- [ ] No photoreal container render
- [ ] No labels, no carrier marks, no ISO container code
- [ ] No depth-of-field bokeh
- [ ] Reads as geometry, not as a literal object

## Source

- Template: [`design-system/05-prompts/abstract-shape.md`](../../../design-system/05-prompts/abstract-shape.md)
- Anchor: [`design-system/05-prompts/style-anchor.md`](../../../design-system/05-prompts/style-anchor.md)
