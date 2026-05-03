---
name: Motion (content)
type: content
version: 1.0.0
last_updated: 2026-05-02
related: [../00-foundations/motion-language.md]
---

# Motion (content companion)

> The principles are in `00-foundations/motion-language.md`. This file is the practical companion: choreography patterns, timing examples, and the recipes for the live-data primitives.

## Quick reference recipes

### Button hover
- `transition: background 120ms cubic-bezier(0.2, 0, 0, 1);`
- No transform, no scale. Just background color swap.

### Card hover (interactive)
```css
.card-interactive {
  transition: box-shadow 180ms var(--easing-standard),
              transform 180ms var(--easing-standard);
}
.card-interactive:hover {
  box-shadow: var(--shadow-lifted);
  transform: translateY(-1px);
}
```

### Drawer open (right-anchored)
```css
.drawer {
  transform: translateX(100%);
  transition: transform 260ms var(--easing-standard);
}
.drawer[data-state="open"] {
  transform: translateX(0);
}
```

### Modal open
```css
.modal {
  opacity: 0;
  transform: scale(0.96);
  transition: opacity 260ms var(--easing-decelerate),
              transform 260ms var(--easing-decelerate);
}
.modal[data-state="open"] {
  opacity: 1;
  transform: scale(1);
}
```

### Toast enter (bottom-right)
```css
.toast {
  opacity: 0;
  transform: translateX(20px);
  transition: opacity 260ms var(--easing-decelerate),
              transform 260ms var(--easing-decelerate);
}
.toast[data-state="open"] {
  opacity: 1;
  transform: translateX(0);
}
.toast[data-state="closed"] {
  opacity: 0;
  transition: opacity 180ms var(--easing-accelerate);
}
```

### Tab content cross-fade
```css
.tab-panel {
  opacity: 0;
  transition: opacity 120ms var(--easing-standard);
}
.tab-panel[data-state="active"] {
  opacity: 1;
}
```

### Page transitions
- Web: snap (no transition) by default.
- Optional cross-fade for marketing flows: 400 ms `easing-standard`.
- Never slide on web.

### List item entry (staggered)
```css
.list-item {
  opacity: 0;
  transform: translateY(8px);
  animation: list-enter 260ms var(--easing-decelerate) forwards;
}
.list-item:nth-child(1) { animation-delay: 0ms;  }
.list-item:nth-child(2) { animation-delay: 30ms; }
.list-item:nth-child(3) { animation-delay: 60ms; }
.list-item:nth-child(4) { animation-delay: 90ms; }
.list-item:nth-child(5) { animation-delay: 120ms; }
@keyframes list-enter {
  to { opacity: 1; transform: translateY(0); }
}
```

Stagger never exceeds `260 ms + 30 ms × 5 = 410 ms` total, so a 5-item list completes in under 0.5 s.

## Live-data primitives — full timing

### `LiveDot`
```css
@keyframes lumen-live-pulse {
  0%   { transform: scale(1);   opacity: 0.7; }
  100% { transform: scale(2.4); opacity: 0;   }
}
.lumen-live-pulse {
  animation: lumen-live-pulse 3s var(--easing-decelerate) infinite;
}
@media (prefers-reduced-motion: reduce) {
  .lumen-live-pulse { animation: none; }
}
```

### `RateTicker`
```css
@keyframes lumen-rate-ticker {
  0%   { transform: translateX(0);    }
  100% { transform: translateX(-50%); }
}
.lumen-rate-ticker-track {
  animation: lumen-rate-ticker 60s linear infinite;
  width: max-content;
}
@media (prefers-reduced-motion: reduce) {
  .lumen-rate-ticker-track { animation: none; }
}
```

### `Spinner` (loading state inside Button[loading])
```css
@keyframes lumen-spinner {
  to { transform: rotate(360deg); }
}
.lumen-spinner {
  animation: lumen-spinner 1s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .lumen-spinner { animation-duration: 0s; opacity: 0.5; }
}
```

The Spinner is the one OTHER allowed looping animation. It's permitted because it's communicating "work is in progress" — meaningful, not decorative.

## What never animates

- Text appearing (it just is).
- Numbers ticking up (use a static value, refresh on data change).
- Fade-in on initial page load (snap to visible).
- Color of the brand mark (the green is the green).
- Anything to celebrate completion (no checkmark expanding 3× and shrinking).

## Choreography patterns

### Sequence: backdrop + modal
Both run simultaneously, same duration, same easing. Backdrop fades; modal scales-in + fades.

### Sequence: list filtered down to subset
- Items leaving: fade out + collapse height (`260 ms accelerate`).
- Items remaining: shift to new position (`260 ms standard`).
- New items entering: fade in + expand height (`260 ms decelerate`), staggered 30 ms.
- All happens in parallel within ~ 350 ms.

### Sequence: data refreshing in a Stat
- Old value fades out (`120 ms accelerate`).
- New value fades in + slides 4 px from below (`180 ms decelerate`), starting 60 ms after old fade begins.
- Total: ~ 250 ms.

## Testing checklist

For every animation:
- [ ] Reduced motion disables it cleanly.
- [ ] No layout shift after animation completes.
- [ ] User can interact during animation.
- [ ] No animation runs longer than `motion.slower` (400 ms) outside the 3 explicit loops (LiveDot, RateTicker, Spinner).
- [ ] Animation tested on a low-end device (Android 8, 60 Hz screen).
