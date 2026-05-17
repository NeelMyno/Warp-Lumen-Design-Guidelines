---
template: illustration
slug: long-haul-truck-at-dusk
model: gpt-image-2-2026-04-21
quality: high
thinking_mode: false
aspect: 16:9
output_resolution: 2560×1440
output_file: long-haul-truck-at-dusk.png
version: 0.13.0
last_baselined: pending-operator-generation
---

# Canonical subject — illustration

## Subject (paste into `--subject`)

```
long-haul truck silhouette on a highway at dusk, character-light, faint route arc trailing behind the cab — warm horizon glow, single Spring Green accent on the cab's marker light, no fleet branding, atmospheric perspective
```

## Generation command

```bash
pnpm prompts illustration \
  --subject "long-haul truck silhouette on a highway at dusk, character-light, faint route arc trailing behind the cab — warm horizon glow, single Spring Green accent on the cab's marker light, no fleet branding, atmospheric perspective" \
  > /tmp/illustration-prompt.md
```

## Why this subject

Tests four narrative constraints:
1. **Character-light** — verifies no human figure appears in the cab (silhouette = vehicle, not driver).
2. **No fleet branding** — verifies the truck body is unbranded (no carrier logo, no fleet livery, no decals).
3. **Single Spring Green accent on the marker light** — verifies the accent appears as functional UI-equivalent (a light, not decoration).
4. **Warm horizon glow without weather drama** — verifies the dusk atmosphere is "last truck of the day" working mood, NOT "lonely highway" melancholy.

This is also the illustration subject from the master doc's Phase 4 example list and the phase-4 prompt's canonical-subjects table.

## Diff-against-baseline notes

- [ ] Truck silhouette visible, no human figure in cab
- [ ] No fleet logo, no carrier branding
- [ ] One Spring Green accent moment on the marker light (or equivalent functional UI element)
- [ ] Warm horizon glow, not chromatic sunset palette
- [ ] No weather drama (no rain, no snow)
- [ ] Faint route arc trailing — atmospheric, not literal
- [ ] Scene reads as "poised, working" not "in motion" or "abandoned"
- [ ] Atmospheric perspective: foreground crisp, distance fades into fog

## Source

- Template: [`design-system/05-prompts/illustration.md`](../../../design-system/05-prompts/illustration.md)
- Anchor: [`design-system/05-prompts/style-anchor.md`](../../../design-system/05-prompts/style-anchor.md)
