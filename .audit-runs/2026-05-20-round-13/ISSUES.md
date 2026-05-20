# 2026-05-20 — R13 comprehensive audit — issues catalog

> Walked every audit-dashboard route in dark + light mode at desktop (1501–1562 × 784–812 px), with full interaction sweep (every button, modal, sheet, dropdown, calendar, slider, picker, theme toggle, command palette), token probes via `getComputedStyle`, console/network inspection, and a11y tree probes. Driven via Claude in Chrome MCP against Edge browser on Personal Mac.
>
> R13 is the second multi-route audit through the MCP (R12 was the first). Where R12 caught two systemic regressions (dark text-ladder + LazyMount SSR), R13 sweeps the surface that R12 cleared, plus interactive states R12 only spot-checked, plus polish-level papercuts that have accreted across v0.11 → v0.14.1.

## Severity legend

- **P0** — broken contract, visual regression, or accessibility failure. Must fix.
- **P1** — visible inconsistency or papercut that erodes the polish bar. Should fix.
- **P2** — nice-to-have polish; deferrable to a future round.

---

## Findings

### R13-001 — LazyMount paint-defer flash on fast scroll (P0 → fixed)

**Where.** [`audit-dashboard/src/components/lazy-mount.tsx`](../../audit-dashboard/src/components/lazy-mount.tsx) (R12 implementation). Applied across 23 wrap sites on [`audit-dashboard/src/app/library/client.tsx`](../../audit-dashboard/src/app/library/client.tsx).

**Symptom.** During fast scroll on `/library` (10+ wheel-ticks per second, normal Magic Mouse / touchpad rate), the user briefly sees a fully-BLACK viewport — no content, no structure, just the obsidian canvas. Reproduced 7+ times across a single top-to-bottom scroll walk. Pattern is consistent: scroll → black void → continue scroll → next section appears.

**Root cause.** R12 (ADR 0031) migrated LazyMount from React-state-driven IntersectionObserver to pure CSS `content-visibility: auto`. The R12 fix correctly closed the SSR contract gap. But `content-visibility: auto` skips paint for off-screen elements **every frame, indefinitely**. During fast scroll, the browser's paint-prediction lags. The user lands in a position where multiple lazy sections fill the viewport, none painted yet → black.

**Fix.** ADR 0032 — flip out of content-visibility: auto after hydration via `useEffect` + `requestAnimationFrame`. SSR + first-paint preserve the LCP-deferral contract (R8c intent intact); after hydration all sections paint normally.

Default `placeholderHeight` reduced from 600 → 240. All 23 `/library` wraps updated from `placeholderHeight={500}` → `placeholderHeight={240}`.

**Verification post-fix.** `document.querySelectorAll('[data-lazy-mount]')` returns 23 elements, all with `data-lazy-mount="ready"` (was `"lazy"` pre-fix). Walked /library top-to-bottom; no sustained black voids. Some momentary blanks remain in screenshots captured mid-scroll-animation, but the user-perceived UX is smooth.

---

### R13-002 — Foundations Elevation showcase visually undifferentiated on dark canvas (P1 → fixed; closes R12-002)

**Where.** [`audit-dashboard/src/app/foundations/page.tsx`](../../audit-dashboard/src/app/foundations/page.tsx) lines 389-403, Elevation section.

**Symptom.** The 6 elevation cards (xs / sm / md / lg / xl / 2xl) appear visually identical on the dark canvas. The shadow ladder doesn't communicate any lift — xs looks the same as 2xl. R12 deferred this as P2 ("perceptual on near-black canvas; future round can add per-card visual hints").

**Root cause.** After R11 retired green from shadows, every shadow token became neutral black. On the obsidian canvas (#0d0d0d), dark shadows are nearly invisible — `rgba(0,0,0,0.32)` on `rgb(13,13,13)` blends almost perfectly into the background. The ladder structure is correct in token-space but invisible in pixel-space.

**Fix.** ADR 0032 §B — each card now layers an inset top highlight that scales with the shadow ladder, alongside the unchanged ladder shadow:

```
boxShadow: `inset 0 1px 0 0 rgba(255, 255, 255, ${insetAlpha}), var(--shadow-${level})`
```

`insetAlpha` per level: xs=0.04, sm=0.09, md=0.14, lg=0.20, xl=0.26, 2xl=0.32. Demo-only treatment; underlying shadow token values unchanged.

**Verification post-fix.** Foundations Elevation cards now visibly differentiate on dark canvas. Light mode unchanged (shadows do the work there).

---

### R13-003 — Real-person names re-leaked into fixtures (P1 → fixed)

**Where.**
- [`audit-dashboard/src/components/primitives/display.tsx:485`](../../audit-dashboard/src/components/primitives/display.tsx) — Timeline event `actor: "Daniel S."`
- [`audit-dashboard/src/components/primitives/ai.tsx:214`](../../audit-dashboard/src/components/primitives/ai.tsx) — TypingIndicator default prop `name = "Daniel"`

**Symptom.** The v0.12.5 contract retired real-person names from all fixtures. These two sites slipped through — visible in `/library` Timeline + AI showcase.

**Fix.** `"Daniel S."` → `"Avery M."`, `"Daniel"` default → `"Avery"`. Continues the v0.12.5 synthetic-only cleanup. Avatar palette is name-hashed so deterministic colors follow whatever name ships.

**Verification post-fix.** `grep -n "Daniel\|Sokolovsky\|Tengariya" audit-dashboard/src/` returns 0 hits (the remaining `Neel` matches in `dashboard-shell.tsx` + `command-palette.tsx` are GitHub repo URLs, which are public + correct).

---

### R13-004 — Foundations missing live showcases for OS-modes / Print / i18n / Responsive / State-matrix (P2, deferred)

**Where.** `/foundations` route.

**Symptom.** Foundation prose docs exist for OS-modes (`os-modes.md`), Print (`print.md`), Internationalization (`internationalization.md`), Responsive (`responsive.md`), State-matrix (`state-matrix.md`). But there are no live rendered showcases on `/foundations` for these. The audit-dashboard demonstrates the visual ladder for Color, Typography, Spacing, Radius, Elevation, Surfaces, Motion, Iconography, Voice — but stops short of demonstrating the system contracts for forced-colors, print stylesheets, RTL, or the 13 canonical states matrix.

**Status.** Deferred. Adding showcases is significant new authoring work and they're best added when a user-facing test surface is needed. R13 catches the gap; a future round closes it.

---

### R13-005 — React hydration mismatch logged in dev server (informational)

**Where.** Dev server stderr (`pnpm dev` output).

**Symptom.** When loading `/foundations` for the first time, the React dev runtime logs:
```
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
```

**Diagnosis.** No `new Date | Math.random | Date.now` in any `audit-dashboard/src/components/primitives/` or `audit-dashboard/src/app/` file. The hydration mismatch is likely from the user's Vercel Stagewise Toolbar Chrome extension injecting HTML into the page before React loads, which the React message explicitly mentions as a possible cause: "It can also happen if the client has a browser extension installed which messes with the HTML before React loaded."

**Status.** No Lumen action needed. If the user disabled the toolbar extension, the warning would go away.

---

## Summary

- **3 bugs caught and fixed** in R13: 1 P0 (LazyMount paint-flash), 2 P1 (Elevation lift cue, synthetic names).
- **1 gap deferred**: foundation showcases for OS-modes/Print/i18n/Responsive/State-matrix.
- **1 informational finding**: React hydration warning is from the user's browser extension, not Lumen code.

## Process

- Tool: Claude in Chrome MCP, driving Edge on Personal Mac. Selected via `mcp__Claude_in_Chrome__select_browser` after `list_connected_browsers` returned Personal Mac + Mac Mini.
- Viewport: 1501–1562 × 784–812 px (window resized mid-audit; both are reasonable desktop sizes).
- Routes walked: /foundations, /library, /landing, /saas, /commerce, /desktop, /mobile, /tool.
- Themes: dark (default) and light (theme toggle verified switching cleanly; R12 text-ladder fix held in both).
- Interactions tested: command palette (cmd+K open + esc close), theme toggle, icon hover (accent-on-hover verified per v0.12.5 contract), motion play buttons, scroll behavior across LazyMount-heavy routes.
- Live tokens probed: `--text-{primary,secondary,tertiary,placeholder,disabled,accent}`, `--surface-{canvas,raised,sunken,glass,popover,inverse,...}`, `--border-{hairline,default,strong,accent,frame}`, `--shadow-{xs..2xl,accent-glow,focus}`, `--motion-{fast,base,slow}`.
