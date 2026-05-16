---
name: Tabs
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Segmented, Navbar, Sidebar, DropdownMenu, BottomNav]
spec: ./component.json
last_updated: 2026-05-15
---

# Tabs

> Switch between sibling views inside the same destination. Pill, underline, and enclosed variants — one moving thumb at a time. Distinct from Segmented (form-row choice control) and Navbar tabs (top-level destinations).

## When to use

- Sibling views of one record — Overview / Activity / Settings of a single account.
- A view-mode switch where the surrounding chrome stays put — Table / Board / Calendar of the same dataset.
- Sub-navigation under a page header that doesn't change the URL of the page itself (or changes only a query param).

## When NOT to use

- **Page-level destinations** — use Navbar (top app bar) or Sidebar.
- **Single choice inside a form row** — use Segmented. Tabs always switches a panel; Segmented sets a value.
- **Multi-step linear flows** — use Stepper. The Stepper communicates progression and a fixed order; Tabs implies free reordering.
- **More than 7 sections** — collapse to a Sidebar list or a Select. Cognitive load past 7 chunks defeats the affordance.

## Anatomy

1. **Tabs root** — owns `value`, `onValueChange`, `orientation`.
2. **TabsList** — `role="tablist"`, the chrome track. Pill variant uses `surface.sunken`; underline uses `border.hairline`; enclosed uses `border.default` + bottom-open notch.
3. **TabsTrigger** (× N) — `role="tab"`, `aria-selected`, `aria-controls`. Roving tabindex.
4. **Thumb / underline** — the moving indicator. Position math is rendered via inline `style.left` / `style.width` (read from each trigger's `getBoundingClientRect()`) — per the v0.12.3 cascade-fix (AGENTS.md hard rule 12), never as Tailwind arbitrary `translate-x-[Npx]` classes.
5. **TabsPanel** (× N) — `role="tabpanel"`, `aria-labelledby`. Sibling of TabsList, not a child.

## Variants

| Variant | Track | Indicator | Use |
|---|---|---|---|
| `pill` | `surface.sunken` capsule with hairline border, radius.popover | Raised tile filled with `action.selected.bg` (~12% accent tint), text in `text.accent` | Default. Apple Sport-flavor. Pairs with KPI cards, dashboard regions, app body. |
| `underline` | Bottom-only hairline border (`color.border.hairline`) | 2 px `color.border.accent` underline that slides between triggers | Operator sub-nav. The single brand stroke. Compose under page headers. |
| `enclosed` | `color.border.default` rectangle, bottom-open above active panel | Notch into the rectangle — active trigger inherits `surface.raised` and sheds its bottom border | Admin / settings / docs nav. Most informational; least kinetic. |

## States

- **Default** — rest at `text.secondary`, no chrome on triggers.
- **Hover** — `text.primary` + (pill: `action.ghost.bg.hover` on trigger; underline: faint hairline; enclosed: no change).
- **Focus** — global `:focus-visible` ring (`outline: 2px solid lime-a64` + `shadow.focus`). Per AGENTS.md hard rule 11 — outline + box-shadow, never box-shadow alone.
- **Active** — pill: raised thumb + `text.accent`; underline: moving lime underline + `text.primary`; enclosed: notched-in `surface.raised` + `text.primary`.
- **Disabled** — `text.tertiary`, no hover, `cursor-not-allowed`, `aria-disabled=true`.
- **Loading** — same chrome as rest; the matching TabsPanel renders a Skeleton or Spinner inside its content area.

## Accessibility

- `role="tablist"` on the list, `role="tab"` on each trigger, `role="tabpanel"` on each panel.
- Roving tabindex: only the active trigger is `tabindex=0`; siblings are `tabindex=-1`.
- Horizontal Tabs use automatic activation by default (focus = activate). Vertical Tabs use manual activation (focus moves; Space / Enter activates) so a user navigating a vertical list isn't fired into a panel mid-scan.
- Each TabsTrigger sets `aria-selected` and `aria-controls={panelId}`. Each TabsPanel sets `aria-labelledby={triggerId}`.
- Honor `prefers-reduced-motion`: the pill thumb still moves under the active tab, but the 220 ms entry animation on first mount is skipped.

## Do

- Use a short noun or noun-phrase: "Overview", "Activity", "Members", "Audit log".
- Keep triggers parallel — same grammar, same word-count band.
- Persist the active tab in the URL (as a query param) for shareable links.
- Choose `density='compact'` only on info-dense operator dashboards; never on mobile.
- For overflow, prefer collapsing to a 'More' DropdownMenu over horizontal scroll on desktop. Mobile may scroll-clip.

## Don't

- Don't put a verb in a trigger — it reads as a button. Use Button or Toolbar.
- Don't paint the active trigger in solid lime fill (the accent fill is reserved for actions). Selection uses `action.selected.bg` (~12% lime tint) + `text.accent`.
- Don't stack two indicators (e.g. underline + raised pill) on the same Tabs.
- Don't switch the Tabs variant inside a single product surface — pick one for the surface and stay with it.
- Don't render TabsList without a TabsPanel sibling for each trigger; the empty `aria-controls` reference is a screen-reader smell.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release. Three variants, two densities, two overflow modes, inline-style thumb math per hard rule 12.
