---
template: hero-background
slug: route-arc-over-dim-lane-map
model: gpt-image-2-2026-04-21
quality: high
thinking_mode: false
aspect: 16:9
output_resolution: 2560×1440
output_file: route-arc-over-dim-lane-map.png
version: 0.13.0
last_baselined: pending-operator-generation
---

# Canonical subject — hero-background

## Subject (paste into `--subject`)

```
three soft blurred orbs in spring-green and indigo over obsidian, central negative space — anchored by a faint route arc traversing a dim freight lane map at 6% opacity in the deep background
```

## Generation command

```bash
pnpm prompts hero-background \
  --subject "three soft blurred orbs in spring-green and indigo over obsidian, central negative space — anchored by a faint route arc traversing a dim freight lane map at 6% opacity in the deep background" \
  > /tmp/hero-background-prompt.md

# Then either paste /tmp/hero-background-prompt.md into ChatGPT, OR run:
pnpm prompts:generate-references --template hero-background
```

## Why this subject

The canonical subject combines two test signals:
1. **Three orbs + central negative space** — verifies the anchor's atmospheric defaults render correctly (Spring Green at 8–12%, volumetric fog, no hard edges) AND that the model leaves the central focal area quiet for headline overlay.
2. **Faint route arc in the deep background** — verifies the freight-domain anchor sneaks through atmospherically without becoming literal (no labeled cities, no actual map of any real route).

If a regenerated PNG no longer satisfies both signals, the visual baseline has drifted and we re-baseline (or rollback the change that caused the drift).

## Diff-against-baseline notes

When regenerating, place the new PNG side-by-side with the prior version and check:

- [ ] Spring Green accent is at or below 12% opacity (no neon glow)
- [ ] Indigo orb is present but reads as cool atmospheric depth (not a second brand color)
- [ ] Central 60% × 40% region is empty negative space
- [ ] Faint route arc visible in the deep background but not literal
- [ ] No headline text baked into the image
- [ ] No logos, no second saturated color, no neon glow beyond the accent
- [ ] Asset reads at 50% scale on a marketing email AND at 200% on a 4K landing page

If any check fails, log the failure mode in the next phase report and decide whether to lift the pin or rework the subject.

## Source

- Template: [`design-system/05-prompts/hero-background.md`](../../../design-system/05-prompts/hero-background.md)
- Anchor: [`design-system/05-prompts/style-anchor.md`](../../../design-system/05-prompts/style-anchor.md)
