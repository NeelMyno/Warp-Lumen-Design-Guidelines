---
name: lumen-schema-display
description: REST endpoint visualization: HTTP method badge, path, params, request / response schema. For API explorer / agent tool-spec rendering. Mirrors Vercel AI Elements `SchemaDisplay`. Install with `npx ai-elements@latest add schema-display`. Status: stable.
---

# Lumen SchemaDisplay

REST endpoint visualization: HTTP method badge, path, params, request / response schema. For API explorer / agent tool-spec rendering.

## Use when

- Rendering an OpenAPI / Lumen MCP tool spec in a UI surface.
- Agent surface that shows the user 'this tool is about to call this endpoint with these params.'
- Developer-facing docs page rendering REST endpoints inline.

## NEVER

- NEVER hardcode a single HTTP method color. The method badge maps to Lumen tokens (GET = secondary, POST = accent, PUT = amber, DELETE = lumen-red, PATCH = amber).
- NEVER render unsanitized schema descriptions — they may come from upstream OpenAPI specs that vary in safety.
- NEVER nest SchemaDisplay inside Tool's Input — that's redundant; SchemaDisplay IS the tool spec view.

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

1. `SchemaDisplay` — Root compact display.
2. `SchemaDisplayMethod` — HTTP method badge.
3. `SchemaDisplayPath` — Path + params.
4. `SchemaDisplayBody` — Collapsible schema viewer.

## API

Props: `method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'`, `path: string`, `params?: ParamSpec[]`, `requestSchema?: JSONSchema`, `responseSchema?: JSONSchema`. Renders compact pill + path + collapsible schema viewer.

## Modes

- Restrained (default): solid surfaces, hairline definition.
- Expressive: same component behavior; ambient atmosphere lives on the page chrome around the component.

## Accessibility

- ARIA semantics from Radix / Vercel AI Elements primitives.
- Keyboard navigation: Tab cycles, Space / Enter activates.
- `prefers-reduced-motion` and `prefers-reduced-transparency` honored.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add schema-display
import { SchemaDisplay } from "@/components/ai-elements/schema-display";

export function Example() {
  return <SchemaDisplay />;
}
```

## Related

- Tool (SchemaDisplay can render a Tool's spec)
- CodeBlock (schema body)
- Artifact (SchemaDisplay can appear inside Artifact for type='schema')
