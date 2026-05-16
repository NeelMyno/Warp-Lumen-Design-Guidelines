---
name: AIBadge
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [AISuggestion, CitationCard, Spinner]
spec: ./component.json
last_updated: 2026-05-16
---

# AIBadge

> Inline "AI generated" / "summary" / "confidence" / "thinking" label.

## Kinds

`generated` / `summary` / `confidence` (with score) / `thinking` (with typing indicator + shimmer).

## Accessibility

- `aria-label` spells out meaning.
- Always adjacent to AI-derived content.

## Do

- Adjacent to content, not in remote header.
- `confidence` for LLM-extracted values.
- `thinking` replaces unlabeled Spinner during inference.

## Don't

- Don't render AI content without nearby badge.
- Don't lime / danger / warning confidence.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.
