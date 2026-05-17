---
name: lumen-commit
description: Commit / change card showing what the agent modified: title, diff summary, file count, revert affordance. Mirrors Vercel AI Elements `Commit`. Install with `npx ai-elements@latest add commit`. Status: stable.
---

# Lumen Commit

Commit / change card showing what the agent modified: title, diff summary, file count, revert affordance.

## Use when

- Agent modified files / records / state — show the user what changed before they merge.
- Multi-step plan where each Task produces a Commit.
- Audit trail surface — historical commits the agent has made.

## NEVER

- NEVER auto-merge a Commit. The user clicks merge; the agent does not assume.
- NEVER omit the revert affordance. Every Commit must be reversible.
- NEVER apply Spring Green to a Commit card by default. Accent appears on merge action only.

## Tokens consumed

- color.surface.canvas
- color.surface.raised
- color.text.primary
- color.text.secondary
- color.text.accent
- color.border.hairline
- color.border.frame
- space.3, space.4, space.6
- radius.md, radius.lg
- motion.duration.fast, motion.duration.base
- motion.easing.standard

## Anatomy

1. `Commit` — Root card.
2. `CommitHeader` — Title + line summary.
3. `CommitMeta` — File count + +/- counts.
4. `CommitActions` — Merge + Revert buttons.

## API

Props: `title: string`, `summary: string` (one-sentence description), `fileCount: number`, `linesAdded?: number`, `linesRemoved?: number`, `onMerge?: () => void`, `onRevert?: () => void`.

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add commit
import { Commit } from "@/components/ai-elements/commit";

export function Example() {
  return <Commit />;
}
```

## Related

- Task (produces Commit)
- Agent (Agent's history is a list of Commits)
- Card (Phase 2 primitive)
- Confirmation (Merge often gates through Confirmation)
