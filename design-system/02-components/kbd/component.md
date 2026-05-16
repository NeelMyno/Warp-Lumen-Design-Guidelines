---
name: Kbd
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Tooltip, DropdownMenu]
spec: ./component.json
last_updated: 2026-05-16
---

# Kbd

> Inline keyboard-key cue. Platform-aware glyphs.

## When to use

- Tooltip "Save ⌘S".
- DropdownMenu item right-rail.
- Onboarding help text.
- Keyboard shortcut cheat sheet.

## When NOT to use

- Inline code — `<code>` or CodeBlock.
- Action label — Button.
- Form field — Input.

## Anatomy

`<span>` wrapper carries SR-friendly `aria-label` ("Command K"). Each token is a `<kbd>` joined by hairline `+`.

## Platform glyphs

| Mac | Win/Linux |
|---|---|
| ⌘ | Ctrl |
| ⌥ | Alt |
| ⇧ | Shift |
| ⌃ | Ctrl |

## Accessibility

- `<kbd>` for SR semantics.
- `aria-label` on wrapper uses spelled-out names.

## Do

- Pair with verb: "Save ⌘S".
- Use sm size by default.

## Don't

- Don't use for code — that's `<code>`.
- Don't paint in lime.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.
