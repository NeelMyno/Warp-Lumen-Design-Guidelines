---
template: marketing-card
slug: real-time-tracking-dashboard-hint
model: gpt-image-2-2026-04-21
quality: high
thinking_mode: false
aspect: 1.91:1
output_resolution: 1200×630
output_file: real-time-tracking-dashboard-hint.png
version: 0.13.0
last_baselined: pending-operator-generation
---

# Canonical subject — marketing-card

## Subject (paste into `--subject`)

```
real-time tracking — Lumen dashboard surface hint with ambient atmosphere: partial route-arc fragment with a single Spring Green dot mid-trajectory anchored at the lower-third, dispatcher-console glow behind, mesh atmosphere (lane-arc recipe) upper-right, clean negative space upper-left for headline overlay, synthetic shipment ID (WRP-9824) visible as faint mono-cap metadata
```

## Generation command

```bash
pnpm prompts marketing-card \
  --subject "real-time tracking — Lumen dashboard surface hint with ambient atmosphere: partial route-arc fragment with a single Spring Green dot mid-trajectory anchored at the lower-third, dispatcher-console glow behind, mesh atmosphere (lane-arc recipe) upper-right, clean negative space upper-left for headline overlay, synthetic shipment ID (WRP-9824) visible as faint mono-cap metadata" \
  > /tmp/marketing-card-prompt.md
```

## Why this subject

Tests four marketing-card-specific constraints:
1. **Partial fragment, not full dashboard** — the route-arc fragment + one dot is the "hint" depth permitted by this template (vs. hero-background which permits zero UI).
2. **Synthetic data only** — the shipment ID `WRP-9824` is a placeholder, not a real customer or carrier reference.
3. **Headline space upper-left** — verifies the model leaves negative space where live HTML headline overlays.
4. **Survives thumbnail crop** — at 200×105 social-preview size, the route arc + Spring Green dot must still read as "tracking moment."

This subject is the "real-time tracking" entry from the phase 4 prompt's canonical-subjects table.

## Diff-against-baseline notes

- [ ] **Partial UI fragment only** — not a full dashboard render
- [ ] Spring Green dot anchored at a specific point on the route arc (one accent moment)
- [ ] `WRP-9824` placeholder visible OR no shipment ID at all — no real customer/carrier name
- [ ] Upper-left clear of visual weight (headline overlay space)
- [ ] `lane-arc` mesh recipe visible in the upper-right atmosphere
- [ ] Reads at 200×105 social-preview crop (mentally test)
- [ ] OG aspect (1.91:1) — verify by running `pnpm prompts:generate-references --template marketing-card`
- [ ] No logos, no real customer or carrier names
- [ ] No baked headline text

## Variants worth shipping

Beyond the canonical, the template is designed for these production variants (operator regenerates as needed per launch):

- `instant-rates-stat-card-hint.png` (1200×630) — for the "rates" OG card
- `cross-dock-automation-bay-grid.png` (1200×630) — for the "automation" OG card
- `lane-optimization-three-arcs.png` (1200×630) — for the "optimization" OG card
- `terminal-first-booking-cli-fragment.png` (1200×630) — for the "CLI" OG card
- `ai-dispatch-reasoning-thread-fragment.png` (1200×630) — for the "AI" OG card
- `*-feature-block.png` (2560×1440) — each capability as a 16:9 landing-page feature block

## Source

- Template: [`design-system/05-prompts/marketing-card.md`](../../../design-system/05-prompts/marketing-card.md)
- Anchor: [`design-system/05-prompts/style-anchor.md`](../../../design-system/05-prompts/style-anchor.md)
