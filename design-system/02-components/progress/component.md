---
name: Progress
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Spinner, Skeleton, Stepper]
spec: ./component.json
last_updated: 2026-05-16
---

# Progress

> Determinate or indeterminate value indicator. Linear (default) and circular shapes. Brand-stroke accent by default; status tones for color-coded contexts.

## When to use

- File upload / download.
- Multi-step background task with a known total.
- AI generation with an estimated duration.
- A loading state past 5 s.

## When NOT to use

- < 5 s indeterminate — **Spinner**.
- Initial page load — **Skeleton**.
- Multi-step linear flow with named steps — **Stepper**.

## Shapes

- **linear** — 4 px stroke with optional label/value cluster.
- **circular** — ring (4 sizes: 20 / 32 / 48 / 72 px).

## Tones

| Tone | Use |
|---|---|
| `accent` | Default — brand-stroke. |
| `neutral` | Inside a colored banner so the bar doesn't compete. |
| `success` | "Restored to 100%". |
| `warning` | Quota approaching. |
| `danger` | Quota exceeded. |

## Accessibility

- `role="progressbar"`, `aria-valuenow`, `aria-valuemin=0`, `aria-valuemax`.
- Omit `aria-valuenow` for indeterminate.
- `aria-label` describes what's loading.
- Indeterminate sweep pauses under `prefers-reduced-motion`.

## Do

- Always label what's loading.
- Animate from current → next, never reset to 0 on retry.
- Estimate when possible — indeterminate is the last resort.

## Don't

- Don't stack two progress bars for one task.
- Don't paint track + bar in different families.
- Don't Progress for < 1 s ops.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release.
