---
name: JSXPreview
type: component
tier: T5
family: Content
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: JSXPreview
install: npx ai-elements@latest add jsx-preview
related:
  - ./jsx-preview.skill.md
  - ../artifact/artifact.md
---

# JSXPreview

Live React component preview for assistant-generated JSX. Compiles with @babel/standalone in-browser; surfaces errors via StackTrace.

## Use when

- Assistant generated a React component the user wants to see rendered.
- Design-system showcases where 'try it' is the killer affordance.
- Educational surfaces (Lumen docs site embedded examples).

## API

Props: `code: string` (JSX/TSX source). Internal: babel transforms to JS, evaluates in a try/catch, renders into a shadow root. On error, returns StackTrace.

## Anatomy

| Sub-component | Role |
|---|---|
| `JSXPreview` | Root preview surface with compile + render + error pipeline. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- Artifact (uses JSXPreview for type='jsx')
- WebPreview
- StackTrace (error renderer)

## Install

```bash
npx ai-elements@latest add jsx-preview
```
