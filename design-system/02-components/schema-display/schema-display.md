---
name: SchemaDisplay
type: component
tier: T5
family: Content
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: SchemaDisplay
install: npx ai-elements@latest add schema-display
related:
  - ./schema-display.skill.md
  - ../artifact/artifact.md
---

# SchemaDisplay

REST endpoint visualization: HTTP method badge, path, params, request / response schema. For API explorer / agent tool-spec rendering.

## Use when

- Rendering an OpenAPI / Lumen MCP tool spec in a UI surface.
- Agent surface that shows the user 'this tool is about to call this endpoint with these params.'
- Developer-facing docs page rendering REST endpoints inline.

## API

Props: `method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'`, `path: string`, `params?: ParamSpec[]`, `requestSchema?: JSONSchema`, `responseSchema?: JSONSchema`. Renders compact pill + path + collapsible schema viewer.

## Anatomy

| Sub-component | Role |
|---|---|
| `SchemaDisplay` | Root compact display. |
| `SchemaDisplayMethod` | HTTP method badge. |
| `SchemaDisplayPath` | Path + params. |
| `SchemaDisplayBody` | Collapsible schema viewer. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- Tool (SchemaDisplay can render a Tool's spec)
- CodeBlock (schema body)
- Artifact (SchemaDisplay can appear inside Artifact for type='schema')

## Install

```bash
npx ai-elements@latest add schema-display
```
