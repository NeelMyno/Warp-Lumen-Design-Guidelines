---
name: Tool
type: component
tier: T5
family: AIInsight
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: Tool
install: npx ai-elements@latest add tool
related:
  - ./tool.skill.md
  - ../tool/tool.md
---

# Tool

Tool-call rendering primitive. Header (tool name + status) + Input (call arguments) + Output (return value).

## Use when

- An assistant message includes a tool call (function call, MCP tool invocation, web search, code execution).
- Surface needs to show BOTH what the tool was asked to do (Input) and what it returned (Output).
- Pairs with Confirmation when the tool is destructive (write-side: book_shipment, send_email, delete_record).

## API

Consumes AI SDK `ToolUIPart` / `DynamicToolUIPart`. ToolHeader shows the tool name + spinner/check/error status. ToolInput renders the call args (JSON pretty-printed or freight-domain composite). ToolOutput renders the return value (text, table, freight-component like ShipmentTimeline).

## Anatomy

| Sub-component | Role |
|---|---|
| `Tool` | Root container; consumes ToolUIPart. |
| `ToolHeader` | Name + status indicator (idle / running / success / error). |
| `ToolInput` | Call arguments slot. Auto-renders JSON OR accepts a freight-domain composite. |
| `ToolOutput` | Return value slot. Same flexibility as Input. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- Confirmation (paired for destructive)
- Reasoning (often precedes)
- Message
- Sources (citation of tool output source)
- ShipmentTimeline / LaneCode (freight-domain output renderers)

## Install

```bash
npx ai-elements@latest add tool
```
