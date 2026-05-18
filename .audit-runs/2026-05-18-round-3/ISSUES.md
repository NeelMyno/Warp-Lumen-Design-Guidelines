# Lumen v0.12.9 — Round 3 Comprehensive Live Audit
**Date:** 2026-05-18 (round 3)
**Browser:** Edge on Personal Mac (via Claude in Chrome extension)
**Dev server:** http://localhost:3100
**Viewport:** 1440 × 900 primary
**Predecessor rounds:** R1 (v0.12.7, sticky-nav chrome-bleed) + R2 (v0.12.8, interactive variant pickers)

## What R3 covered that R1 + R2 did not
- Calendar day-of-week alignment
- Modal layer (verify static showcases vs. real triggers)
- Data display: charts, tables, sparks, rate ticker, avatars
- Form pickers: date, time, OTP, tags, range slider, color picker
- Feedback layer: toast, snackbar, banner, empty state, skeleton
- AI surface
- Mobile + Desktop frame chrome
- Keyboard tab through every focusable
- Build + lint pass (catches lint warnings dev server hides)

## Round 3 findings — running log

### R3-FIND-01 · DatePickerCalendar day-of-week is off by one for May 2026
**File:** `audit-dashboard/src/components/primitives/inputs.tsx:706-757`
**Surface:** `/library` → Pickers · Date/Time → "Calendar (popover)"
**Symptom:** day "1" renders in the Thursday column. May 1, 2026 was actually a Friday. Every subsequent day is off by one too.
**Root cause:** `Array.from({ length: 35 }, (_, i) => i - 2)` hardcodes a 2-cell prefix. That worked for whatever month the showcase was authored for; May 2026 needs a 4-cell prefix because day 1 falls on Friday.
**Secondary defect:** `isToday = day === 12` — also stale. Today is 2026-05-18. So the "today" ring is on May 12 instead of May 18.
**Fix plan:** make `DatePickerCalendar` dynamic. Compute month, year, day-of-week offset, today, and selected (today + 1) at render time using `new Date()`. Expose optional `today` and `selected` props for callers that want pinned screenshots. Use 42 cells (6-row grid) to cover the worst-case 31-day-on-Sunday month.

### R3-FIND-02 · StatusBar carrier truncated by iOS dynamic island
**File:** `audit-dashboard/src/components/primitives/mobile.tsx:45-57` + `PhoneFrame:28-34`
**Surface:** `/library` → Mobile · native — every iOS `PhoneFrame` showcase
**Symptom:** "Verizon" carrier text reads as "...on" because the 112×28 px dynamic-island blob at the top center sits in the same visual layer as the status bar's right-anchored carrier+icons group. The blob occludes the carrier's left ~30 px.
**Root cause:** `StatusBar` defaults `carrier = "Verizon"`, and the iOS PhoneFrame's notch overlay competes with the right-side flex group. Modern iOS 17+ doesn't render the carrier name in the status bar at all — it lives in Control Center now — but our showcase still tries.
**Fix plan:** drop the default value from the `carrier` prop. When `carrier` is omitted (the case for every iOS showcase in `library/client.tsx`), nothing renders and the icons get a clean right-edge cluster behind/beside the notch. Android frame keeps its explicit `carrier="T-Mobile"` and shows it correctly because the Android punch-hole is tiny.

### R3-FIND-03 · Tool surface preset list is non-interactive (same class of bug as v0.12.8 Commerce variant pickers)
**File:** `audit-dashboard/src/app/tool/page.tsx:48-72`
**Surface:** `/tool` → Quote Builder → LEFT sidebar PRESETS
**Symptom:** clicking Refrigerated / Flatbed open-deck / Cross-dock express / Last-mile residential / International ocean does NOT move the active highlight from Standard LTL. The button gets a hover-state background change but the `bg-[var(--surface-tint-accent)]` accent stays glued to whichever item was authored with `active: true`.
**Root cause:** the preset list is rendered inline in a server component as a hardcoded array `[{name: "Standard LTL", active: true}, ...]`. No `useState`, no `onClick`. Same pattern as v0.12.8 commerce variant pickers: the visual showcase lies about being interactive on a peak surface (preset choice is the first interaction on the Tool surface — Premium Psychology principle 3, peak-end rule).
**Fix plan:** extract preset list to a client island `tool/presets.client.tsx`. Real `useState<string>` for the active preset name, `onClick` handler, `aria-current="page"` on the active item, `:focus-visible` ring. `page.tsx` stays a server component (metadata preserved).

---

## Verification — every fix verified live in Edge on macOS

| Fix | Verification |
| --- | --- |
| R3-FIND-01 (Calendar) | After fix: `/library` → Pickers · Date/Time shows `May 2026` with day **1 in Friday column** (x=1190, same column as 8 / 15 / 22 / 29); today=18 carries the ring; selected=19 carries the accent fill. JS confirms 31 visible numbered cells in correct Mon-start layout. |
| R3-FIND-02 (StatusBar) | After fix: every iOS `PhoneFrame` showcase on `/library → Mobile · native` renders status bar as `9:41 · [notch] · [signal][wifi][battery]` with no carrier text. Android `PhoneFrame` still shows `T-Mobile` correctly because the punch-hole is tiny and the prop is passed explicitly. |
| R3-FIND-03 (Tool presets) | After fix: clicking International ocean returns `bg: rgba(0, 250, 138, 0.14)` + `aria-current: "page"`; Standard LTL drops to `bg: rgba(0, 0, 0, 0)` + `aria-current: null`. Active accent moves with the click. |

## By-design (verified, deliberately not changed)

- **Pricing card hover lift** — initial JS introspection via `document.styleSheets[].cssRules` returned 0 hits for `hover:[arbitrary]` Tailwind utilities, looking like a project-wide drop. **Direct fetch of the compiled CSS file confirmed all 113 `hover:*` rules are present** — Tailwind v4 wraps utilities in `@layer` blocks which `document.styleSheets[].cssRules` doesn't enumerate flatly. The Operator card visibly glows on hover (`--shadow-glow-accent`); the Starter/Enterprise cards apply `translate: 0px -1px` via the modern `translate:` property (Tailwind v4) rather than the legacy `transform:`. Both work.
- **Modal-layer "showcases" on /library** — Send-quote dialog, Delete-carrier alert dialog, Filters drawer, "Why is this rate higher?" popover, cookie banner, Materials & care accordion — verified to be visual shape references rather than triggerable overlays. The interactive modal layer lives in the right places: portaled Combobox in Selection (works); FAQ on /landing (works); ⌘K command palette (works).
- **SaaS segmented "All / Active / Done"** — `aria-selected` and `data-state` both flip on click. The shipments table itself doesn't filter (rows are hardcoded), but the control responds to user input.
- **Switches on /tool Accessorials** — Radix-backed with `defaultChecked`. Clicking toggles correctly (aria-checked flips, visual state moves).
- **Showcase buttons that fire no action** — Get rates / Reset / Add cargo row / Book now / View JSON / Save preset / New shipment / Mark all read. These are surface visuals, not application logic.
- **/library Dropdown menu kebab `⋯`** — `Button` showcase, not a Radix DropdownMenu trigger. R2 verified this was by-design.
- **Calendar showcase navigation buttons** (`‹` / `›`) — chevron icons but no `onClick`. By design — the calendar is a static visual reference, not an interactive month-picker.
- **Mobile phone frame `9:41`** — the canonical Apple status-bar time, intentionally static across all iOS showcases.

## Blocked

- **Sub-768 px responsive sweep** — Claude in Chrome `resize_window` MCP still does not propagate viewport dims to `window.innerWidth` (same blocker as R2). Source-level `sm:` / `md:` utilities are present and look correct in the static HTML. Flagged for next pass when device emulation is wired in either chrome-devtools-mcp or a similar MCP that controls real viewport.
- **Keyboard tab focus visualization** — pressing Tab from the address bar didn't visibly land on a page focusable (browser focus model). Programmatic focus testing via `document.activeElement` would be more reliable than visual; deferred.

## Routes covered (DEEPER than R1 + R2)

`/foundations` → iconography accent-on-hover hover-state confirmed live; brutalist frame + voice samples render correctly.
`/library` → walked every section: Layout · Navigation · Buttons · Inputs · Selection · Pickers · Uploads · Data Display · Tables · Charts · KPI · Feedback · Modals · Notifications · Mobile · Commerce · Auth · AI · Editor · State · Templates · Trust · Marketing · Spec.
`/landing` → hero / carrier strip / pricing cards (Starter hover + Operator hover glow verified) / testimonial / FAQ.
`/tool` → preset list click test (now interactive); accessorial Switch click (works).
`/saas` → segmented tabs click test (works); KPI sparklines; activity feed; quote-a-lane form.
`/commerce` → Buy panel (R2's fix) still working; cart drawer toggle (visual); checkout stepper.
`/mobile` → phone frame status-bar carrier (StatusBar fix verified).
`/desktop` → macOS Tahoe + Windows 11 dual-frame showcase (no changes needed).
