---
name: lumen-toast
description: Use to surface transient feedback after async actions — `toast.success('Saved')`, `toast.error('Couldn't save')`, `toast('Lane added')`. Mount `<Toaster />` once near the app root; call `toast` from anywhere. Honors prefers-reduced-motion; uses --pill-{tone}-* tokens for the six health states.
---

# Lumen Toaster

Transient feedback overlay. Lumen-themed wrapper around Sonner — the production-grade toast library with stack management, progress, swipe-to-dismiss, ARIA live regions. Six health states map to pill tonal tokens (neutral / success / warning / danger / info / accent).

## Use when

- After an async action — Save, Send, Book — confirms completion or failure.
- Background-event surfaces — 'Lane added to your saved views', 'New rate received'.
- Replace alert() calls (which lock the main thread + are inaccessible).

## NEVER

- NEVER use toast for blocking modal-style content — that's <Modal>.
- NEVER stack 5+ simultaneous toasts — set `visibleToasts={3}` on Toaster.
- NEVER use toast for essential information that must be acted on — Banner is persistent.

## Tokens consumed

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

## Anatomy

1. Toaster — global mount (once near app root)
2. toast(message, options) — programmatic API
3. Stacked toasts — animate in from bottom-right by default

## API

- `<Toaster position="bottom-right" richColors />` — mount once.
- `toast('msg')` — neutral.
- `toast.success('msg')` — success.
- `toast.error('msg')` — danger.
- `toast.warning('msg')` — warning.
- `toast.info('msg')` — info.
- `toast.loading('msg')` — spinner + neutral.

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- Sonner sets role=status (polite) for default + success, role=alert (assertive) for error/danger.
- Honors prefers-reduced-motion (no slide-in animation).
- Pause-on-hover is default; toasts won't auto-dismiss while the user is interacting.

## Code (canonical)

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

## Related

- Banner
- Snackbar
- NotificationCenter
- ValidationMessage
