---
name: WebPreview
type: component
tier: T5
family: Content
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: WebPreview
install: npx ai-elements@latest add web-preview
related:
  - ./web-preview.skill.md
  - ../artifact/artifact.md
---

# WebPreview

Iframe with safety wrapper for HTML / web previews. Sandbox attribute defaults to safe; CSP-friendly.

## Use when

- Rendering assistant-generated HTML for preview.
- Showing a Vercel preview URL inside an Artifact.
- Embedding a tool output that's a hosted web page.

## API

Props: `srcDoc?: string` (inline HTML) OR `src?: string` (external URL). `sandbox?: string` (default safe). `onLoad?`, `onError?` callbacks. Loading state during initial fetch.

## Anatomy

| Sub-component | Role |
|---|---|
| `WebPreview` | Root iframe wrapper with safety + loading state. |

## Modes

- **Restrained** (default): solid surfaces, hairline definition, no mesh.
- **Expressive**: same component behavior. Mode rebinds AMBIENT atmosphere on the page chrome, not on this component itself.

## Accessibility

- Built on Radix / Vercel AI Elements primitives with sensible ARIA defaults.
- Keyboard navigation: Tab cycles focusable controls; Space / Enter activates.
- `prefers-reduced-motion`: any animations degrade gracefully.
- Screen reader: ARIA semantics follow the role of the wrapping Message / Conversation.

## Related

- Artifact (uses WebPreview for type='html')
- JSXPreview
- Sandbox

## Install

```bash
npx ai-elements@latest add web-preview
```
