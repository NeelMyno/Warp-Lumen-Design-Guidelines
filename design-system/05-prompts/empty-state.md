---
name: Empty State
type: prompt-template
version: 0.13.0
last_updated: 2026-05-17
audience: [llm-agent, designer, engineer]
asset_type: empty-state
aspect: 1:1 or 4:3
output: 1024×1024 (default) | 800×600 (compact)
mode: restrained
related:
  - ./style-anchor.md
  - ./abstract-shape.md
  - ./illustration.md
  - ../../doc/LUMEN-v0.13-MASTER-REFACTOR.md
  - ../00-foundations/voice-and-tone.md
---

# Empty state — Lumen v0.13

@import ./style-anchor.md

## Model pin
- Model: `gpt-image-2` (snapshot `gpt-image-2-2026-04-21`).
- Quality: `high`.
- Thinking mode: **OFF**. Single frame, single mood.

## Subject

[FILL THIS SLOT — fill the SUBJECT slot of the style anchor with template-specific content like:]

> A minimalist illustration suggesting absence with intent — a single freight pallet awaiting load, an empty dock bay with light streaming in, a quiet cross-dock floor at the start of the shift, a paused lane indicator on a faintly-traced route map, a single empty container with door open. Strong negative space. The composition is anticipatory, not melancholy — Lumen empty states suggest "ready for input" not "nothing here."

Subject options (one per empty-state surface):

| Surface | Subject |
|---|---|
| Shipments list (empty) | single freight pallet on a clean dock, awaiting load, light from the upper-left |
| Quotes list (empty) | empty quote sheet on a quiet desk surface, hairline grid, no figures |
| Lanes list (empty) | paused lane indicator on a faintly-traced route map, single Spring Green dot at the origin |
| Drivers list (empty) | empty driver-roster card grid, hairline cells, no headshots |
| Search no-results | single magnifier-glyph silhouette over a faint cross-dock floor lattice, no match indicator |
| Notifications empty | empty alert bell silhouette in hairline, single Spring Green dot pulsing-still beside it |
| Inbox / Tasks empty | empty in-tray on a clean desk surface, single envelope outline, no figures |
| Reports empty | single chart axis with no data, hairline, awaiting the first data point |
| Recent activity empty | single timeline rail receding into fog, no events marked yet |
| Saved filters empty | single bookmark glyph silhouette over a faint route lattice |

## Composition override

- **Aspect**: 1:1 square (1024×1024) or 4:3 (800×600).
  - In-page empty state: 1024×1024.
  - Compact empty state inside a card: 800×600.
- **Negative space**: **at least 60% of the frame is empty obsidian + atmospheric fog.** The subject occupies the lower-third (anchored to the ground line) or rule-of-thirds intersection.
- **Single focal anchor**: one pallet, one chart axis, one bookmark — singular subject, not a cluster.
- **Light direction**: warm light from upper-left (suggests morning, start-of-shift, "the day has just begun"). Never overhead glare, never harsh shadow.

## Use case override

- Dashboard widgets with no data yet (`<EmptyState />` component prop `image`).
- Search results with zero matches.
- New user before their first action (onboarding empty surface).
- Filter combinations that match nothing.
- Archive views before anything is archived.
- Reports before the first datapoint lands.

The component sits above an empty-state body — headline + helper copy + CTA. The image is the mood; the copy is the action.

## Mode

**Restrained.** Atmosphere at 4–6% (the lower end of the anchor range). No mesh. Grain at 8%. The empty state must feel quiet, not festive — the warmth comes from light direction, not from atmospheric saturation.

## Template-specific constraints

- **MOOD: anticipatory, not melancholy.** This is the most important constraint in this template.
  - **Anticipatory** = "the day is about to start," "the dock is ready for the first truck," "the system is awake and waiting."
  - **Melancholy** = "the day is over," "the dock is abandoned," "there's no one left." This is wrong for Lumen.
- **NO frowning faces, NO sad postures, NO drooping silhouettes** — even if there are no figures, the mood should not read as defeat.
- **NO clutter** — empty states are about absence; show absence with intent, not aftermath.
- **NO end-of-day fade-to-black** — use morning light, never sunset.
- **NO message-in-bottle aesthetic** — Lumen empty states do not feel poetic; they feel professional and ready.
- **Spring Green accent allowed at the focal anchor** — the single dot beside the empty bell, the start-of-route marker on the paused lane indicator. Always exactly one accent, never zero.
- **MUST pair with anticipatory copy from `voice-and-tone.md` empty-state templates** ("No tasks today. New quote starts a lane." NOT "Nothing here yet.").

## Failure modes

1. **Reads as melancholy** (low-angle dramatic light, soft shadows over a forgotten pallet) → re-prompt: `morning light from upper-left, anticipatory mood. The scene is the start of the shift, NOT the end. Lift the light angle and brighten the focal anchor.`
2. **Too much detail** — the pallet has labels, the dock has equipment, the desk has clutter → re-prompt: `minimalist. Single focal anchor on clean obsidian. Strip detail until only the subject remains.`
3. **Multiple focal anchors** (two pallets, several bookmarks) → re-prompt: `exactly one focal element. Absence with intent — one anchor, lots of negative space.`
4. **Spring Green accent appears in wrong location** (background atmosphere) → re-prompt: `accent ONLY at the focal anchor (the single dot beside the bell, the start-of-route marker). Background has zero accent — it is pure obsidian + atmospheric fog.`

## Voice-and-tone pairing

Empty-state copy ships from [`00-foundations/voice-and-tone.md`](../00-foundations/voice-and-tone.md) §"Empty states." Reference: "No tasks today. New quote starts a lane." — declarative, anticipatory, naming the next action without prompting.

## Reference asset

`examples/gpt-image-2/empty-state/canonical-subject.md` documents the exact subject text the reference PNG was generated from. The default reference is "single freight pallet awaiting load, anticipatory mood."
