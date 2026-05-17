---
name: Loader
type: component
tier: T5
family: Shared
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: Loader
install: npx ai-elements@latest add loader
related:
  - ./loader.skill.md
  - ../loader-ai/loader-ai.md
  - ../spinner/component.md
  - ../message-response/message-response.md
aliases:
  - loader-ai
---

# Loader

Lumen-branded loading indicator for AI surfaces. Reuses the v0.12.4 Spinner primitive with AI-surface-specific affordances: streaming-aware sizing, suggestion-strip-adjacent placement, and three intensity levels (`subtle`, `default`, `pulse`).

This is the canonical Vercel-AI-Elements-named entry per AGENTS.md hard rule 19. The earlier `loader-ai/` folder remains as a deprecated alias for v0.13.0 backward-compat; v0.14 retires it.

## Use when

- An AI surface is waiting for the first token of a streaming response (use `pulse` intensity).
- A long-running tool call is executing (use `default`).
- Reasoning blocks are being recomputed mid-stream (use `subtle`).

## API

```ts
interface LoaderProps {
  intensity?: "subtle" | "default" | "pulse";  // default = "default"
  size?: "sm" | "md" | "lg";                   // default = "md"
  label?: string;                              // sr-only label; default = "Loading"
  className?: string;
}
```

## Anatomy

| Sub-component | Role |
|---|---|
| `Loader` | Root element. SVG spinner from Lumen Spinner primitive. |

## Modes

- **Restrained**: solid spring tint at 24% opacity.
- **Expressive**: same component; the surrounding canvas may render glow if positioned inside a `data-mode="expressive"` block.

## Accessibility

- `role="status"` + `aria-live="polite"` so screen readers announce "loading" without interrupting active narration.
- `label` prop drives the `aria-label` (sr-only). Default: `"Loading"`.
- `prefers-reduced-motion`: spinner replaces rotation with a static pulse via opacity.

## Related

- [Spinner](../spinner/component.md) (the underlying primitive; Loader composes Spinner with AI affordances)
- [loader-ai](../loader-ai/loader-ai.md) (v0.13.0 alias; canonical name is `loader`)
- [MessageResponse](../message-response/message-response.md) (where Loader appears mid-stream)

## Install

```bash
npx ai-elements@latest add loader
```
