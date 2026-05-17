---
name: Inspirations
type: foundation
version: 0.13.0
last_updated: 2026-05-16
audience: [designer, engineer, llm-agent]
related:
  - ./principles.md
  - ./voice-and-tone.md
  - ./modes.md
  - ../../doc/LUMEN-v0.13-MASTER-REFACTOR.md
---

# Lumen Inspirations — the named anchors

> Lumen's voice is the synthesis of three dark-mission-control references, Linear's "calmer interface for a product in motion," Vercel's agent-readable SKILL.md shape, and Nordhealth's `llms.txt` + AI Skills delivery pattern. This file names them so designers and LLM agents have the same touchstones.

---

## 1. The three dark-mission-control references (RonDesignLab on Dribbble)

These are the relevant references for Lumen's expressive surfaces. The Cargo TMS case (light-canvas, Urbanist) is NOT a reference for Lumen — it's a counter-example. Lumen is dark-canvas obsidian operator-density first.

### Navy Mobile — Truck Management Dashboard

`https://dribbble.com/RonDesignLab` — search the shot.

Mobile-first dark dashboard for fleet operations. Obsidian canvas, lime-tinted highlights (Lumen ports this to Spring Green), navy structural accents, hairline frames. The operator's primary surface is the live map; secondary surfaces are stacked stat tiles with strong typographic hierarchy. Lumen mirrors: the canvas, the hairline-first chrome, the stat tile composition, the "always-on" signature element (RonDesignLab uses a pulsing dot; Lumen ports this verbatim as LiveDot).

### BizSpeed TMS — Logistics Web Dashboard

Desktop logistics dashboard, dark obsidian, lime accent for the active route. Lane visualization (origin → destination arcs), shipment table with status pills, mini-charts for OTD trends. Lumen mirrors: the lane-arc visual gesture (becomes our `LaneArc` component), the operator-density table treatment, the inline mini-chart pattern in stat tiles.

### SpaceX App — Space Mission Control

Mission-control dark UI, instrument-panel mood. Glass shells on the floating chrome, hairline grids, mono-uppercase tracked metadata labels. Lumen mirrors: the mono-uppercase signature label voice (`SYSTEM V0.13 · LIVE`), the glass-only-on-floating-shells discipline, the instrument-panel restraint.

---

## 2. Linear — "a calmer interface for a product in motion"

`https://linear.app/now/behind-the-latest-design-refresh`

Linear's most recent design-refresh blog. The pull-quote is the architecture: *"a calmer interface for a product in motion."* Lumen's restrained mode shares this DNA — fewer pixels doing more work, motion budget spent on functional moments (state changes, validation, success) not on decoration.

Specific Linear patterns Lumen mirrors:
- **Hierarchy through weight + size, not colour.** Linear's UI is overwhelmingly grayscale; the accent appears only at action and state. Lumen's single-accent rule (Spring Green only) is the same discipline.
- **Hairline-first surface separation.** Cards are defined by a 1 px stroke, not a shadow. Lumen's `shadow.card = shadow.sm` (very subtle) preserves this — only floating UI gets real shadow.
- **Mono-spaced metadata.** Issue IDs, dates, timestamps in mono. Lumen's `mono-cap` tracked label is the freight-domain version.

---

## 3. Vercel `skill-remotion-geist` — the agent-readable SKILL.md format

`https://github.com/vercel-labs/skill-remotion-geist/blob/main/skills/create-remotion-geist/SKILL.md`

The canonical shape for an agent-readable design-system skill file. Lumen's per-component `<name>.skill.md` files copy this format verbatim (frontmatter with `name`, `description`; body with "Use when", "NEVER", "Tokens consumed", "Anatomy", "API", "Modes", "Accessibility", "Code", "Related"). Phase 2 lands these on every component.

What Vercel got right that Lumen copies:
- **One file = one agent decision.** The skill file is everything an agent needs to make ONE component correctly. Not a tutorial, not a reference, not a deep-dive. A decision aid.
- **Lead with "Use when" — the trigger.** Then "NEVER" — the guardrails. Then tokens, anatomy, API, code. The agent retrieves the trigger first; the trigger matches; the rest of the file is loaded.
- **Hard rules verbatim.** No paraphrase. Repeat the same constraints across every component so an agent reading one file learns the system's voice.

---

## 4. Nordhealth — `llms.txt` + AI Skills

`https://nordhealth.design/llms.txt` and `https://nordhealth.design/ai/skills/`

The canonical shape for design-system `llms.txt` + Agent Skills delivery. Lumen's root `llms.txt` (Phase 0) and per-component agent skills (Phase 2) copy the Nordhealth pattern.

What Nordhealth got right:
- **`llms.txt` is a 5–10K-token INDEX, not a dump.** Foundation, tokens, components, patterns, platforms each get one section; each section is a bullet list of MD/JSON paths. The agent retrieves the index, scans for relevance, fetches the specific file.
- **AI Skills live at a stable URL.** Each skill is a stable file an agent can fetch by name. No login, no cookies, no JS rendering.
- **The taxonomy mirrors the file tree.** What `00-foundations/`, `01-tokens/`, `02-components/` contain on disk = what the `llms.txt` index advertises.

---

## 5. What Lumen explicitly is NOT

These would feel like reasonable references but they're wrong for Lumen — call them out for the LLM that will inevitably reach for them.

| Reference | Why NOT |
|---|---|
| Material Design 3 expressive | Material's brand is colourful + reactive. Lumen's brand is restrained + single-accent. Borrow the easing tokens, not the colour philosophy. |
| Apple HIG glassmorphism / vibrancy | Lumen uses glass on FLOATING shells only. Apple paints glass on every chrome surface — that's an iOS contract Lumen doesn't share. |
| Bootstrap / Tailwind UI | Generic SaaS chrome. Lumen's freight-domain voice means lane codes, dock bays, OTD percentages — domain-specific composites that generic UI doesn't carry. |
| Carbon (IBM) | Carbon is closest in spirit (enterprise density, hairline-first) but Carbon's accent is blue. Lumen never reaches for blue. |
| Polaris (Shopify) | Polaris is for embedded Shopify surfaces — Lumen consumes Polaris contracts on Shopify embeds (≤ 15% of pixel surface) but does NOT generalize Polaris to other surfaces. |

---

## References

- [`principles.md`](./principles.md) — the 7 principles that synthesise these inspirations
- [`voice-and-tone.md`](./voice-and-tone.md) — the mono-uppercase signature, the italic accent word, the brutalist frame
- [`modes.md`](./modes.md) — restrained × expressive routing
- [`doc/LUMEN-v0.13-MASTER-REFACTOR.md`](../../doc/LUMEN-v0.13-MASTER-REFACTOR.md) — §1.5 named inspiration anchors
