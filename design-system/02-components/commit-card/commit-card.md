---
name: Commit
type: component
tier: T5
family: AgentTask
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: Commit
install: npx ai-elements@latest add commit
related:
  - ./commit-card.skill.md
  - ../agent-state/agent-state.md
---

# Commit

Commit / change card showing what the agent modified: title, diff summary, file count, revert affordance.

## Use when

- Agent modified files / records / state — show the user what changed before they merge.
- Multi-step plan where each Task produces a Commit.
- Audit trail surface — historical commits the agent has made.

## API

Props: `title: string`, `summary: string` (one-sentence description), `fileCount: number`, `linesAdded?: number`, `linesRemoved?: number`, `onMerge?: () => void`, `onRevert?: () => void`.

## Anatomy

| Sub-component | Role |
|---|---|
| `Commit` | Root card. |
| `CommitHeader` | Title + line summary. |
| `CommitMeta` | File count + +/- counts. |
| `CommitActions` | Merge + Revert buttons. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- Task (produces Commit)
- Agent (Agent's history is a list of Commits)
- Card (Phase 2 primitive)
- Confirmation (Merge often gates through Confirmation)

## Install

```bash
npx ai-elements@latest add commit
```
