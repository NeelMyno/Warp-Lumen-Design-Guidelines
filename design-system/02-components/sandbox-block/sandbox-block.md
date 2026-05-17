---
name: Sandbox
type: component
tier: T5
family: Content
version: 0.13.0
last_updated: 2026-05-17
status: experimental
phase: 5
vercel_ai_elements: Sandbox
install: npx ai-elements@latest add sandbox
related:
  - ./sandbox-block.skill.md
  - ../artifact/artifact.md
---

# Sandbox

Collapsible container with status indicator + tabbed nav between code / output / terminal. For E2B / similar sandbox integrations.

## Use when

- Assistant runs code in a remote sandbox (E2B, Modal, Vercel Sandbox) — surface needs to show source + result side-by-side.
- Multi-step plans where each step has executable code + observable output.
- Educational flows: 'here's the code, here's the output, here's the terminal log.'

## API

STUB. Tabbed: { Code | Output | Terminal }. Status indicator: idle | running | success | error. Children slot for each tab's renderer (CodeBlock for Code; arbitrary for Output; Terminal for Terminal).

## Anatomy

| Sub-component | Role |
|---|---|
| `Sandbox` | Root tabbed container with status header. |
| `SandboxTabs` | Tab control. |
| `SandboxCode` | Code tab body. |
| `SandboxOutput` | Output tab body. |
| `SandboxTerminal` | Terminal tab body. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- Tool (Sandbox is often a Tool output)
- CodeBlock
- Terminal
- Confirmation (gate sandbox execution)

## Install

```bash
npx ai-elements@latest add sandbox
```
