---
name: CodeBlock
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Kbd, CopyButton]
spec: ./component.json
last_updated: 2026-05-16
---

# CodeBlock

> Mono-typeface code display. Language label, line numbers, line highlight, copy button.

## When to use

- API examples in docs.
- Snippet display in tutorials.
- Terminal output.
- Configuration examples.

## When NOT to use

- Inline single tokens — `<code>` or **Kbd**.
- Diff display — use a Diff component.
- Editable code — use a code editor (Monaco / CodeMirror).

## Anatomy

1. **Header** — language / filename label + Copy button.
2. **Body** — `<pre><code>` with mono-typeface, optional line numbers, optional highlight stripes.

## States

- **Default** — `surface.sunken` body, hairline border.
- **Hover** — copy button reveals.
- **Copied** — copy button flashes to CheckCircle + sr-only "Copied".
- **Scroll** — when maxHeight is exceeded.

## Accessibility

- `role="region"`, `aria-label`.
- `<pre><code>` body preserves SR semantics.
- Copy button announces success via `aria-live="polite"`.

## Do

- Always include CopyButton.
- Don't auto-wrap code.
- Highlight max 1/3 of block.

## Don't

- Don't strip copy button.
- Don't custom-color tokens outside Shiki / Prism theme.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.
