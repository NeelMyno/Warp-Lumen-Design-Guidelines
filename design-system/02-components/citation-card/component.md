---
name: CitationCard
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [AISuggestion, AIBadge, Link]
spec: ./component.json
last_updated: 2026-05-16
---

# CitationCard

> Source reference next to an AI-generated value. Index pill + source + excerpt + confidence.

## Accessibility

- Whole card becomes `<a>` when url set.
- `<blockquote>` around excerpt.
- Confidence renders inline AIBadge.

## Do

- Pair every AI value with ≥ 1 CitationCard.
- Lead with index.
- External link convention for outside URLs.

## Don't

- Don't render AI values without sources.
- Don't lime the whole card.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.
