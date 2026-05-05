---
type: audit
created: 2026-05-04
last_updated: 2026-05-04
source: original
tags: [audit, micro-interactions, premium-psychology, v0.11]
audience: [designer, engineer]
---

# v0.11 Micro-interaction Audit — Live Production

> Live URL: https://warp-lumen-design-guidelines.vercel.app/
> Reference: [`micro-interactions.md`](../../design-system/00-foundations/micro-interactions.md), [`first-impression.md`](../../design-system/00-foundations/first-impression.md), [`hierarchy.md`](../../design-system/00-foundations/hierarchy.md), `The Psychology of Premium Websites` (Crawford 2026, Apr).

## Method

Audit was performed against the deployed Vercel build (not localhost). Browser MCP captured states; computed-styles inspection cross-referenced with the source. Per the user request: "as detailed, comprehensive and nit-picky as possible. Pixel perfect."

## Severity ladder

- **P0 — Trust-breaking.** Decorative elements that masquerade as functional. Single biggest premium-killer per Crawford ("rage clicks").
- **P1 — Halo-eroding.** Above-the-fold misses against the 50 ms contract.
- **P2 — Peak-misses.** Specific micro-interaction states that are missing or invisible.
- **P3 — Polish.** Sub-pixel inconsistencies and refinement opportunities.

---

## P0 — Trust-breaking

### P0-1. Global search is decorative-only

**Where:** `audit-dashboard/src/components/dashboard-shell.tsx:62-72`

The header `Search Lumen…` pill is a `<button>` with:
- ✅ visual chrome of a working searcher (icon, placeholder, ⌘K hint, hover transition)
- ❌ **no `onClick` handler**
- ❌ **no global ⌘K key listener anywhere in the codebase** (`grep "metaKey\|cmdK"` → 0 hits)
- aria-label says "Open spotlight" but no spotlight component exists

**Impact:** The single most-trafficked control in the app does nothing. Crawford's "rage click" signal — premium sites _never_ ship inert interactive elements. This is the audit's #1 fix.

**Fix:** Build a real CommandPalette and wire it to ⌘K + click.

### P0-2. Footer "github" link points to a real repo (verified) ✓ (no fix)

Sanity check — `https://github.com/NeelMyno/Warp-Lumen-Design-Guidelines` resolves. Good.

---

## P1 — Halo-eroding (50 ms contract)

### P1-1. Foundations hero CTA is under-amplified

**Where:** `audit-dashboard/src/app/foundations/page.tsx:91`

```tsx
<Button intent="primary" size="md" pill trailingIcon={<ArrowRight size={14} />}>
  Browse foundations
</Button>
```

Per `first-impression.md` §2 Pattern A: Hero primary CTAs ship as `size="lg"` with `glow` for the stronger halo (`.lumen-glow-cta` layered on top of the standard primary glow ladder). The current button is `size="md"` (40 px tall, the operator-density default) with no `glow` opt-in. The halo budget is the standard primary `0 0 16px rgba(0,250,138,0.25)` rest glow — present but understated against the brutalist frame above it.

**Fix:** Bump to `size="lg"` and add `glow`.

### P1-2. Landing hero CTA missing `glow` (×2)

**Where:** `audit-dashboard/src/app/landing/page.tsx:50` and `:222`

Both top-of-page primary CTAs (`Get started`) are `size="xl" pill` but neither passes `glow`. xl is correct for the landing surface; the hero halo isn't ladder-stacked. The headline "_The freight network for **builders**._" is brutalist 96–128 px — the CTA needs the hero halo to rise above that weight.

**Fix:** Add `glow` to both hero CTAs.

### P1-3. The Lumen mark (top-left) has no hover state

**Where:** `dashboard-shell.tsx:116-132`

The `LumenMark` component has a comment claiming "The ring picks up an inner glow on hover" but the rendered HTML has no `hover:` styles. The lime nucleus has a static `boxShadow: 0 0 8px var(--lumen-lime-a64)` and that's it.

**Impact:** A logo without a hover state reads as a graphic, not a navigation affordance. Per `micro-interactions.md` §5 ("don't ship a button that doesn't respond to hover").

**Fix:** Add hover lift on the nucleus glow + a subtle ring brighten on the parent link.

---

## P2 — Peak-misses

### P2-1. Tab nav inactive hover is sub-visible

**Where:** `tab-nav.tsx:32-39`

Inactive tabs go from `border-transparent` → `hover:border-[var(--border-subtle)]` plus a text color shift. `border-subtle` against the glass nav is a 4–5 % opacity hairline — barely perceptible. Per Saffer's Microinteractions and the Lumen `micro-interactions.md` Card spec: hovers should register as "the system felt my pointer."

**Fix:** Add a subtle `bg-[var(--surface-sunken)]` tint on hover so the affordance reads even when the user's eye isn't on the border.

### P2-2. Trusted-by logos contradict themselves

**Where:** `landing/page.tsx:73-77`

```tsx
<div ... className="... cursor-default ... hover:text-[var(--text-secondary)] ...">
  {c}
</div>
```

`cursor-default` + `hover:text-...` is contradictory: the cursor says "not interactive," the color shift says "interactive." Either commit to "this is a name, not a link" (drop the hover) or commit to "this is a customer story link" (keep the hover, drop the cursor-default + add an underline lift).

**Fix:** They're showcase logos, not links. Drop the hover. Render as confidence-tier static.

### P2-3. Scroll-reveal exists but lacks stagger control

**Where:** `globals.css:2771-2811` (existing); landing/page.tsx hero (added in this commit)

**Original audit finding** (revised): I missed the existing `.lumen-reveal` class in `globals.css` — Lumen v0.11.6 already ships scroll-driven fade-up via native CSS `animation-timeline: view()`. It works in Chrome 115+, falls back gracefully elsewhere, and honors `prefers-reduced-motion`. ✓

**What it CAN'T do:** per-child stagger delays. The CSS scroll-timeline runs each element on its own scroll position; siblings reveal in unison when they enter the viewport together. For a hero where you want eyebrow → headline → subhead → CTA → caption to land in sequence, you need imperative timing.

**Fix shipped:** new `<ScrollReveal>` component using IntersectionObserver + `setTimeout(delay)`. Renamed CSS class to `.lumen-reveal-stagger` (v0.11.13.1) to avoid colliding with the existing `.lumen-reveal` rule. Wired into the landing hero with 80 / 160 / 240 / 320 ms staggered children.

### P2-4. Search bar focus halo is ungated

**Where:** `dashboard-shell.tsx:62-72`

Tabbing the search button shows a 3 px lime halo (`--shadow-focus`). This is the input-focus halo, applied via the `lumen-btn-outline` rule. It works — but once the button becomes a real button-that-opens-a-dialog, focus styling should match the `lumen-btn` focus, which is already correct. No fix needed once palette is wired.

### P2-5. In-page demo search bars have ⌘K hints they shouldn't

**Where:** `saas/page.tsx:159-168`, `tool/page.tsx` (header), `commerce/page.tsx`

Each demo TopBar has a search button with ⌘K hint. This is fine for the showcase, BUT now that the global ⌘K opens the real palette, two things happen:
1. The user reads the hint as "press ⌘K here"
2. They press ⌘K and the global palette opens (correct, but unrelated to this demo bar)

**Decision:** Acceptable. The global palette IS the search experience the demo bars are showing. No fix needed. Document this in the screen comments.

### P2-6. Theme toggle hover hit area smaller than expected

**Where:** `theme-toggle.tsx:44`

The button is `h-control-cozy w-control-cozy` (32 × 32 by default). Lucide icon is 15 px stroke 1.5. Hover bg is `surface-tint-accent` — works but lands on a sub-cozy hit area surrounded by glass. Bumping to a true 40 × 40 hit area improves Fitts-targeting on macbook trackpads.

**Decision:** Defer. v0.11 explicitly chose `cozy` for the glass nav row to match the search-pill height. Document this in v0.12 if revisited.

---

## P3 — Polish

### P3-1. Split-button divider uses raw rgba

**Where:** `globals.css:2621-2622`

```css
border-inline-start: 1px solid rgba(0, 0, 0, 0.16);
```

Should reference `--border-hairline` or similar token to honor theme switching. Currently the divider is a fixed dark hairline that may read incorrectly in light mode on lime fills.

**Defer:** Low impact. Note for v0.12.

### P3-2. Cursor pointer on non-interactive table rows

**Where:** `saas/page.tsx:289`

The shipments table rows have `cursor-pointer` but no `onClick`. For a showcase that's a soft lie. The hover bg is fine; the cursor signals interactivity that doesn't exist.

**Defer or fix:** Drop `cursor-pointer` from the showcase rows. Tiny win.

---

## Inspirations alignment

User-provided references:

- **app.superdesign.dev/library/neon-velocity-countdown** — uses a single peak (animated countdown) as the hero focal point. Lumen's equivalent is the LiveDot pulse — already correct on landing/foundations heroes. ✓
- **app.superdesign.dev/library/glassmorphism-style** — heavy glass. Lumen already runs `lumen-glass` on the sticky nav. The search palette should also be `lumen-glass` with a strong backdrop blur.
- **Dribbble / Pinterest** — no specific link; treat as "general premium dark UI" inspiration. Cmd palette must feel weighty.

---

## Fixes shipped (v0.11.13 → v0.11.13.2)

1. **CommandPalette + ⌘K** — full implementation, glass-shell, fuzzy filter, keyboard nav, theme/route/anchor groups
2. **Hero CTA glow** — foundations + landing
3. **Tab nav inactive hover** — added bg tint
4. **Lumen mark hover** — nucleus glow lift on link hover
5. **Trusted-by logos** — drop conflicting hover
6. **ScrollReveal** — pure-CSS animation with per-instance `--reveal-delay`, wired into landing hero with 80/160/240/320 ms staggered children
7. **Audit doc** — this file

Skipped to v0.12: P3 polish items.

### v0.11.13 → v0.11.13.2 hotfix history

- **v0.11.13** initial commit
- **v0.11.13.1** renamed `.lumen-reveal` → `.lumen-reveal-stagger` after live verification surfaced a class collision with the existing CSS scroll-timeline implementation (globals.css:2771)
- **v0.11.13.2** dropped JS+IO+setTimeout in favor of pure CSS animation after live verification surfaced hidden-tab throttling that left reveals stuck at opacity:0 on background-tab loads. Robustness now matches the rest of the system: no JS, no hydration race, no visibility-state vulnerability.

---

## Verification

Live verification on https://warp-lumen-design-guidelines.vercel.app/ after each push:

✅ Trigger button: `[aria-label="Open command palette"]` — old `[aria-label="Open spotlight"]` removed
✅ ⌘K opens palette: 1 dialog mounts, 23 options across 4 groups (Go to / On this page / System / Links)
✅ Input auto-focused on open
✅ Fuzzy filter: typing "color" → 6 results, "Color" anchor at top match
✅ Foundations hero CTA: classes include `lumen-btn-lg lumen-btn-pill lumen-glow-cta`, height 48px, three-layer halo `0 0 0 1px / 0 8px 28px / 0 24px 72px` lime
✅ Landing hero CTA: classes include `lumen-btn-xl lumen-btn-pill lumen-glow-cta`, height 56px, strong glow ladder
✅ Trusted-by logos: no `hover:text-`, has `select-none`
✅ Tab nav inactive: includes `hover:bg-[var(--surface-sunken)]`
✅ Lumen mark hover CSS: `.lumen-mark-link:hover .lumen-mark-ring` rule deployed
✅ ScrollReveal: 5 staggered children on landing hero; CSS animation fires on mount with per-instance `--reveal-delay` 0/80/160/240/320 ms

Manual checks for the user (interactive, not testable from headless JS):

- [ ] Hover Browse foundations — visible halo lift
- [ ] Hover Library tab — visible bg tint appears
- [ ] Hover Lumen mark — ring brightens to lime, nucleus halo intensifies
- [ ] Press Enter on a route in palette — navigates
- [ ] Press Escape — palette closes
- [ ] Reload landing — hero children appear in stagger sequence
- [ ] `prefers-reduced-motion: reduce` — palette opens without scale, stagger snaps to end-state
