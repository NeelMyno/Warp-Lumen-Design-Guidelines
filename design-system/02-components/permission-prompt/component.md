---
name: PermissionPrompt
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Dialog, Banner, CoachMark]
spec: ./component.json
last_updated: 2026-05-16
---

# PermissionPrompt

> Pre-prompt explaining WHY the app needs a system permission, BEFORE triggering the OS-native dialog.

## When to use

- Camera / microphone / location / notifications / contacts / photos / motion / tracking transparency / biometric / bluetooth.
- Anywhere the native deny-rate would be reduced by context.

## When NOT to use

- A user who has explicitly opted in (no pre-prompt loop).
- A permission that's purely optional with no user-side benefit.

## Anatomy

1. Scrim (`surface.scrim`).
2. Card (`surface.raised`, `radius.card.hero`).
3. Leading glyph (kind-paired).
4. Title (consequence-led).
5. Description (1-2 lines, value-led).
6. Two buttons: Not now (tertiary) + Continue (primary).

## Accessibility

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby`.
- Focus trap, primary initial focus.
- Escape = secondary (acknowledge denial).

## Do

- Lead title with consequence.
- Pair with kind-glyph.
- Render at the moment of benefit, not first launch.

## Don't

- Don't trigger system prompt without pre-prompt.
- Don't paint Not now in danger red.
- Don't say "Allow" / "Deny" verbatim.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.
