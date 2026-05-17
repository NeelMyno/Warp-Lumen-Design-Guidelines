---
name: Toaster
category: feedback
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - surface.popover
  - border.default
  - text.primary
  - text.tertiary
  - shadow.popover
  - radius.lg
  - pill.success.bg
  - pill.success.fg
  - pill.warn.bg
  - pill.warn.fg
  - pill.danger.bg
  - pill.danger.fg
  - pill.info.bg
  - pill.info.fg
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["Banner", "Snackbar", "NotificationCenter", "ValidationMessage"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/toast"
---

# Toaster

Transient feedback overlay. Lumen-themed wrapper around Sonner — the production-grade toast library with stack management, progress, swipe-to-dismiss, ARIA live regions. Six health states map to pill tonal tokens (neutral / success / warning / danger / info / accent).

## When to use

- After an async action — Save, Send, Book — confirms completion or failure.
- Background-event surfaces — 'Lane added to your saved views', 'New rate received'.
- Replace alert() calls (which lock the main thread + are inaccessible).

## Anatomy

1. Toaster — global mount (once near app root)
2. toast(message, options) — programmatic API
3. Stacked toasts — animate in from bottom-right by default

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- Sonner sets role=status (polite) for default + success, role=alert (assertive) for error/danger.
- Honors prefers-reduced-motion (no slide-in animation).
- Pause-on-hover is default; toasts won't auto-dismiss while the user is interacting.

## Tokens consumed

- `surface.popover`
- `border.default`
- `text.primary`
- `text.tertiary`
- `shadow.popover`
- `radius.lg`
- `pill.success.bg`
- `pill.success.fg`
- `pill.warn.bg`
- `pill.warn.fg`
- `pill.danger.bg`
- `pill.danger.fg`
- `pill.info.bg`
- `pill.info.fg`

## Do

- Mount once near app root.
- Use semantic methods (toast.success, toast.error).
- Pair toast.loading with toast.success / toast.error on settle.

## Don't

- Don't use for blocking content.
- Don't stack 5+ toasts.
- Don't reach for native alert().

## Related

- Banner
- Snackbar
- NotificationCenter
- ValidationMessage

## Code

```tsx
import { Toaster, toast } from "@/components/ui/toast";

export function App() {
  return (
    <>
      <Toaster />
      <button onClick={() => toast.success("Lane saved")}>Save</button>
    </>
  );
}
```
