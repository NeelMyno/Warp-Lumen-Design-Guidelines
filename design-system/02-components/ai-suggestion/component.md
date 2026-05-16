---
name: AISuggestion
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [AIPromptInput, AIBadge, CitationCard]
spec: ./component.json
last_updated: 2026-05-16
---

# AISuggestion

> Inline AI proposal card. Accent stroke + Sparkles + body + accept/reject.

## Accessibility

- `role="complementary"` / `role="note"`.
- 'AI suggestion' eyebrow + Sparkles glyph.
- Accept / Reject have explicit `aria-label`.

## Do

- Left-edge 2 px text.accent stroke.
- Sparkles + "AI suggestion" eyebrow.
- Accept = `intent="ai"`.

## Don't

- Don't auto-accept.
- Don't lime the entire card.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.
