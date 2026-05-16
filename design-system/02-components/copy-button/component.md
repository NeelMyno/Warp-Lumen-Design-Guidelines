---
name: CopyButton
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [CodeBlock, IconButton, Tooltip]
spec: ./component.json
last_updated: 2026-05-16
---

# CopyButton

> Compact icon-button that writes to the clipboard and flashes a confirmation.

## When to use

- Next to API keys, secret tokens, wallet addresses.
- Inside CodeBlock headers.
- Next to user-IDs, share-link inputs.

## When NOT to use

- "Share" — use a Share affordance.
- "Download" — use Download.
- Multi-line rich-content copy — copy a button alone is fine, but pair with a Snackbar for confirmation.

## Variants

| Variant | Use |
|---|---|
| `ghost` | Minimal icon-only — default in CodeBlock |
| `pill` | label + icon ("Copy API key") |
| `inline` | leading icon row wrapping a value |

## Accessibility

- Ghost requires `aria-label`.
- Success announces via `aria-live="polite"`.
- Resets after 1.6 s.

## Do

- Pair ghost with Tooltip.
- Auto-reset.
- Always have a value.

## Don't

- Don't lime the success state.
- Don't combine ghost with separate label.
- Don't use for non-copy actions.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.
