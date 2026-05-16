---
name: AIPromptInput
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [AISuggestion, AIBadge, Button, Textarea, Combobox]
spec: ./component.json
last_updated: 2026-05-16
---

# AIPromptInput

> AI prompt composer. Model selector + auto-grow textarea + AI-shimmer send.

## Anatomy

1. Attachments rail (above textarea).
2. Model selector (leading).
3. Textarea (auto-grow to maxRows).
4. Slash commands (when '/').
5. Token counter.
6. Send button (intent='ai', sparkles leading, AI shimmer).

## Accessibility

- `<form aria-label="AI prompt">`.
- Streaming output gets `aria-live="polite"` — NOT the input.
- Stop button replaces Send during loading.

## Do

- Cmd/Ctrl+Enter to submit; plain Enter = newline.
- Sparkles glyph + AI shimmer on send.
- Token counter at ≥ 75% of limit.

## Don't

- Don't auto-submit on Enter.
- Don't shimmer when disabled.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.
