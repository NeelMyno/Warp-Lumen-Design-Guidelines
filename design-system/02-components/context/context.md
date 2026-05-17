---
name: Context
type: component
tier: T5
family: Agent
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: Context
install: npx ai-elements@latest add context
related:
  - ./context.skill.md
  - ../context-window/context-window.md
  - ../stat/stat.md
  - ../progress/component.md
aliases:
  - context-window
---

# Context

Token usage / context window display. Stat-style composition showing how much of the model's context budget is consumed, with a progress meter and a tracked-out label.

This is the canonical Vercel-AI-Elements-named entry per AGENTS.md hard rule 19. The earlier `context-window/` folder remains as a deprecated alias for v0.13.0 backward-compat; v0.14 retires it.

Per master doc §7.Phase-5: "Context window display (token usage bar) — `Stat` + progress meter composition."

## Use when

- Inside a Conversation header: show `12.4K / 200K tokens` with a 6% progress bar so the operator can pace the conversation.
- Inside the Agent surface: warn when context is over 80% with a warning-tinted bar (`status.warning.500`).
- Inside settings/debug: surface per-model context budgets.

## API

```ts
interface ContextProps {
  used: number;           // tokens used
  total: number;          // model's context window
  unit?: string;          // default = "tokens"
  showLabel?: boolean;    // default = true
  warningThreshold?: number;  // 0..1, default 0.8 (80%)
  className?: string;
}
```

## Anatomy

| Sub-component | Role |
|---|---|
| `Context` | Root container. Composed of Stat (used/total numeric) + Progress bar + sr-only label. |

## State visuals

- `<warningThreshold`: progress in `color.accent.500`.
- `>=warningThreshold`: progress in `color.status.warning.500`.
- `>= 1.0`: progress in `color.status.danger.500` + saturated icon.

## Modes

- **Restrained** (default): solid surface, hairline border, neutral progress track.
- **Expressive**: same component; ambient atmosphere lives on the page chrome.

## Accessibility

- `role="progressbar"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax`.
- `aria-label` includes the percentage ("Context window 6% used, 12,400 of 200,000 tokens").
- `prefers-reduced-motion`: progress fill animates with opacity rather than width transition.

## Related

- [Stat](../stat/stat.md) (the underlying numeric primitive)
- [Progress](../progress/component.md) (the underlying bar)
- [context-window](../context-window/context-window.md) (v0.13.0 alias; canonical name is `context`)
- [Agent](../agent/agent.md) (sibling lifecycle indicator)

## Install

```bash
npx ai-elements@latest add context
```
