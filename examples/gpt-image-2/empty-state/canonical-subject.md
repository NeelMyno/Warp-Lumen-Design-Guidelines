---
template: empty-state
slug: single-freight-pallet-awaiting-load
model: gpt-image-2-2026-04-21
quality: high
thinking_mode: false
aspect: 1:1
output_resolution: 1024×1024
output_file: single-freight-pallet-awaiting-load.png
version: 0.13.0
last_baselined: pending-operator-generation
---

# Canonical subject — empty-state

## Subject (paste into `--subject`)

```
single freight pallet awaiting load on a clean dock, anticipatory mood — morning light from upper-left, 60%+ negative space, hairline dock-edge definition, single Spring Green dot on the loading dispatcher's ready-indicator at the upper-right corner
```

## Generation command

```bash
pnpm prompts empty-state \
  --subject "single freight pallet awaiting load on a clean dock, anticipatory mood — morning light from upper-left, 60%+ negative space, hairline dock-edge definition, single Spring Green dot on the loading dispatcher's ready-indicator at the upper-right corner" \
  > /tmp/empty-state-prompt.md
```

## Why this subject

The **anticipatory vs. melancholy** distinction is the most failure-prone constraint in this template. This subject explicitly names:
- "morning light from upper-left" (anticipatory framing — start-of-day, not end)
- "ready-indicator" (functional UI element suggesting "waiting for input", not absence)
- "Spring Green dot" (the system is awake; the dock is hot, just empty)

If the model produces a moody twilight scene with a forgotten pallet under low-angle dramatic light, the failure is identifiable in one glance — and the re-prompt is "morning light from upper-left, anticipatory mood, NOT end-of-day."

## Diff-against-baseline notes

- [ ] **Mood is anticipatory, not melancholy** (most important check — eyeball test)
- [ ] Morning light from upper-left
- [ ] At least 60% of the frame is negative space (clean obsidian + light atmospheric fog)
- [ ] Exactly ONE focal anchor (the pallet)
- [ ] Single Spring Green dot at a functional location
- [ ] No frowning faces, no sad postures, no clutter
- [ ] Hairline dock-edge definition (not photoreal)
- [ ] Pairs cleanly with anticipatory copy ("No tasks today. New quote starts a lane.")

## Source

- Template: [`design-system/05-prompts/empty-state.md`](../../../design-system/05-prompts/empty-state.md)
- Anchor: [`design-system/05-prompts/style-anchor.md`](../../../design-system/05-prompts/style-anchor.md)
- Voice pairing: [`design-system/00-foundations/voice-and-tone.md`](../../../design-system/00-foundations/voice-and-tone.md) §"Empty states"
