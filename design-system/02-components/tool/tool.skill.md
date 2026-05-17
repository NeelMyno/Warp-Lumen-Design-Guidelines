---
name: lumen-tool
description: Tool-call rendering primitive. Header (tool name + status) + Input (call arguments) + Output (return value). Mirrors Vercel AI Elements `Tool`. Install with `npx ai-elements@latest add tool`. Status: stable.
---

# Lumen Tool

Tool-call rendering primitive. Header (tool name + status) + Input (call arguments) + Output (return value).

## Use when

- An assistant message includes a tool call (function call, MCP tool invocation, web search, code execution).
- Surface needs to show BOTH what the tool was asked to do (Input) and what it returned (Output).
- Pairs with Confirmation when the tool is destructive (write-side: book_shipment, send_email, delete_record).

## NEVER

- NEVER ship a Tool component without a Confirmation gate for destructive operations.
- NEVER mix Tool with MessageResponse rendering — Tool is structured data, Response is prose.
- NEVER auto-execute write-side tools. Approval comes through Confirmation first.
- NEVER hide the tool name. Even when collapsed, the header shows which tool ran.

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

1. `Tool` — Root container; consumes ToolUIPart.
2. `ToolHeader` — Name + status indicator (idle / running / success / error).
3. `ToolInput` — Call arguments slot. Auto-renders JSON OR accepts a freight-domain composite.
4. `ToolOutput` — Return value slot. Same flexibility as Input.

## API

Consumes AI SDK `ToolUIPart` / `DynamicToolUIPart`. ToolHeader shows the tool name + spinner/check/error status. ToolInput renders the call args (JSON pretty-printed or freight-domain composite). ToolOutput renders the return value (text, table, freight-component like ShipmentTimeline).

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add tool
import { Tool } from "@/components/ai-elements/tool";

export function Example() {
  return <Tool />;
}
```

## Related

- Confirmation (paired for destructive)
- Reasoning (often precedes)
- Message
- Sources (citation of tool output source)
- ShipmentTimeline / LaneCode (freight-domain output renderers)
