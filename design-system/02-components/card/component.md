---
name: Card
type: component
status: stable
version: 0.12.4
since: 0.1.0
deprecated: false
platforms: [web-react, react-native, ios-native, android-native, shopify-liquid]
a11y_level: WCAG-2.2-AA
related: [CardHeader, Section, Surface, TabsList (InlineTabs pill)]
spec: ./component.json
last_updated: 2026-05-06
---

# Card

> A bounded surface with a hairline border and optional subtle shadow. Used for grouping related content. Default state uses border-only; reach for shadow only when the card is genuinely lifting (hover on interactive cards, popovers). v0.12.1 introduced the corner-clip contract — `padding="none"` automatically clips edge-touching children to the rounded shape. v0.12.4 closes the trade-off the corner-clip introduced for descendant focus rings — the global `:focus-visible` rule now pairs `outline` (structurally immune to ancestor `overflow: hidden`) with the existing soft `box-shadow` halo, so focus rings on Pagination buttons and other interactive descendants inside `<Card padding="none">` stay visible.

## When to use
- Grouping a related set of fields, stats, list items.
- A KPI tile with a `Stat` inside.
- A list row that needs its own boundary.
- Hosting a table with its own header / footer chrome (use `padding="none"`).
- Hosting a full-bleed media surface that runs to the card's edge (use `padding="none"`).

## When NOT to use
- Inline content blocks within a paragraph — use `<aside>` semantics or just type rhythm.
- Whole-page layout shells — those are `<main>` with padding, not a Card.
- Elements that should feel inline with the surface — use `Surface` with `padding=none`.

## Anatomy
1. Container (`surface.raised`, `border.subtle`, `radius.card.default`, `shadow.card`)
2. Optional `CardHeader` (title + description + action)
3. Body
4. Optional `CardFooter`

## Variants

| Prop | Values | Default | Notes |
|---|---|---|---|
| `padding` | `none` / `xs` / `sm` / `md` / `lg` / `xl` / `hero` | `md` | `none` = body controls its own padding (table, full-bleed media); `xs/sm/md/lg/xl` = `p-2 / p-3 / p-4 / p-6 / p-8`; `hero` = `p-10 md:p-12` for landing-page hero cards. |
| `elevation` | `flat` / `card` / `lifted` / `popover` / `glass` / `glow` | `card` | `flat` = no shadow + hairline; `card` = `shadow.sm` + hairline (default); `lifted` = `shadow.md` + hairline (interactive cards on hover); `popover` = `shadow.popover` + subtle border; `glass` = `lumen-glass` translucent + transparent border; `glow` = `shadow.glow.accent.strong` + accent border (hero, lit-edge moments). |
| `interactive` | boolean | `false` | Adds hover state and focus-visible. |
| `selected` | boolean | `false` | Adds 1 px accent border + accent-tint bg. |
| `as` | `div` / `article` / `section` / `button` / `a` | `div` | Render-as polymorphism. Interactive cards must use `button` (action) or `a` (navigation). |

## States
Rest, hover (interactive only), focus-visible (interactive only), selected.

## Corner-clip contract (v0.12.1 — `padding="none"` only)

When `padding="none"`, the Card composes `overflow-hidden` so edge-touching children are clipped to the rounded shape. This solves a class of artifacts where a child with its own background and square corners (table header row, pagination footer row, full-bleed product image, list-row dividers with explicit `bg-*`) paints past the curved interior and pokes a visible square nub out from behind the rounded card border.

```
┌─────────────────────────────┐         ┌─────────────────────────────┐
│  Header        (square bg)  │         │  Header        (square bg)  │
├─────────────────────────────┤         ├─────────────────────────────┤
│                             │         │                             │
│  Body                       │   →     │  Body                       │
│                             │         │                             │
├─────────────────────────────┤         ├─────────────────────────────┤
│  Footer        (square bg)  │         │  Footer        (square bg)  │
└─────────────────────────────┘         └─────────────────────────────┘
            ↓                                      ↓
   pre-v0.12.1 — square            v0.12.1 — overflow-hidden clips
   nub of footer poked past         children to the rounded shape;
   the rounded card corner          corners read clean
```

Other padding tiers (`xs / sm / md / lg / xl / hero`) **do not** compose `overflow-hidden`. Their `p-N` insets float children off the curved edge entirely, so there's no rendering reason to clip — and clipping unnecessarily would suppress focus rings or hover halos on interactive children that legitimately want to escape the card padding rect. The clip is scoped narrowly to the only tier where children structurally meet the curved card edge.

**Radix-portaled popovers, dropdowns, and tooltips render outside the Card subtree** (Radix uses `document.body` portals by default). They are unaffected by the clip — a `<DropdownMenu />` inside a `<Card padding="none">` still escapes the card. v0.12.4 brought the hand-rolled Combobox primitive in line with this: its dropdown migrated from inline `<div absolute>` to `createPortal(<div fixed>, document.body)` with `getBoundingClientRect()` tracking, so a `<Combobox />` inside `<Card padding="none">` now also escapes the clip. **Rule for any new floating UI:** portal to `document.body` from day one — never anchor a dropdown via `position: absolute` inside the trigger's DOM subtree.

**Focus rings on interactive descendants stay visible (v0.12.4 pattern + v0.14 R11 neutral colors).** Pre-v0.12.4 the global `:focus-visible` rule used `box-shadow: var(--shadow-focus)` only. Box-shadow paints into the element's own painting context which DOES respect ancestor `overflow: hidden` — so focus rings on Pagination buttons (or any other interactive descendant) inside `<Card padding="none">` were partially clipped, producing visible "underline + vertical bar" fragments at the card's bottom edge. v0.12.4 added `outline: 2px solid <color>; outline-offset: 1px;` to the global rule, with the existing box-shadow halo retained as a soft outer glow. **v0.14 R11 retuned the colors to neutral** ([ADR 0030](../../../_meta/decisions/0030-no-green-shadows-and-docs-code-sync-v014-r11.md)): outline is now `var(--border-frame)` (was `var(--lumen-lime-a64)`), halo is `var(--shadow-focus) = paper-alpha-08` (dark) / `ink-alpha-08` (light) (was `var(--lumen-lime-a32)`). Outline is painted outside the layout box and is structurally immune to ancestor overflow. Modern browsers (Chrome 94+, Firefox 88+, Safari 16.4+) follow `border-radius` for outline when `outline-style` is not `auto`. The `.lumen-btn-primary:focus-visible` dual-ring is unaffected — declares `outline: none` and wins via specificity (both inner separator + outer ring are neutral in R11). **Net effect:** the corner-clip contract is now strictly net-positive for the system — the visible artifacts go away, the trapped focus rings + hand-rolled popovers are resolved, the contract holds, and the focus indicator is WCAG 2.4.13-compliant via theme-aware neutral instead of brand-green.

**Sibling pattern at smaller-control scale (v0.12.4):** the InlineTabs `pill` variant `TabsList` composes `overflow-hidden` for the same reason — the active tab's `bg-raised` square corners (smaller `radius-md`) would otherwise poke past the parent's `radius-lg` curve at the bottom-left. The contract generalizes: any rounded container hosting children with their own backgrounds and smaller-radius corners needs `overflow-hidden` on the parent. The contract is "child clips to parent's rounded shape," not "child matches parent's radius."

See [ADR 0021](../../../_meta/decisions/0021-card-corner-clip-contract-v0121.md) for the full rationale + the user screenshot that motivated it. See [CHANGELOG v0.12.4 entry](../../../CHANGELOG.md) for the three primitive-layer fixes that closed the v0.12.1 trade-offs.

## Accessibility
- Non-interactive cards do not receive a `role`.
- Interactive cards render as `<button>` if they trigger an action, or `<a>` if they navigate. Never a `<div>` with `onClick`.
- Selection state announces via `aria-pressed` (button) or `aria-selected` (in a listbox).
- The corner-clip contract does not affect a11y. v0.12.4 closed the trade-off where the corner-clip's `overflow: hidden` partially clipped descendant `box-shadow` focus rings — the global `:focus-visible` rule now pairs `outline 2px solid var(--border-frame); outline-offset: 1px;` (structurally immune to ancestor overflow; R11-retuned from lime-a64 to neutral border-frame) with the soft box-shadow halo (also neutral — `var(--shadow-focus)`). Focus rings on Pagination buttons, inline links, and any other interactive descendants inside `<Card padding="none">` stay visible. The `.lumen-btn-primary:focus-visible` dual-ring is unaffected — declares `outline: none` and wins via specificity per ADR 0016; both rings neutral in R11.

## Do
- Default to no shadow, hairline border only (`elevation="card"`, the default).
- Pair with `CardHeader` when the card has a title.
- Use `padding="none"` when the body controls its own padding (e.g. table inside a card, full-bleed media).
- Use `elevation="lifted"` on hover for interactive cards; transition with `motion.transition.fast`.
- Use `elevation="glow"` for the rare hero-tier card that should announce itself with extra lift. **R11 note (v0.14):** the `glow` elevation no longer casts a spring-green halo — it composes the neutral `shadow.xl` elevation tier plus an atmospheric `--aurora-glow-color` `background-image: radial-gradient` (gradients are exempt from the no-green-in-shadows rule; only `box-shadow` colors were retired). See [ADR 0030](../../../_meta/decisions/0030-no-green-shadows-and-docs-code-sync-v014-r11.md).

## Don't
- Don't stack four shadows of increasing intensity for "depth." One shadow per card.
- Don't put a card inside a card inside a card. Two levels max.
- Don't add a heavy border for emphasis. Use `selected` or a status badge instead.
- Don't manually add `className="overflow-hidden"` on a `<Card padding="none">` — the primitive already composes it (v0.12.1).
- Don't add `overflow-hidden` to other padding tiers expecting the same behaviour — those tiers don't need it and may inadvertently suppress focus rings or hover halos.

## Code
- [Web React](./examples/primary.tsx)

## Changelog
- **0.14 R11** — Focus-ring colors retuned to neutral per [ADR 0030](../../../_meta/decisions/0030-no-green-shadows-and-docs-code-sync-v014-r11.md). The outline pattern v0.12.4 introduced is preserved; the colors that pattern paints are now `var(--border-frame)` (outline) + `var(--shadow-focus) = paper/ink-alpha-08` (halo), both theme-aware neutral. The `.lumen-btn-primary` dual-ring's outer ring is now `var(--border-frame)` (was `var(--lumen-accent-4)`). The `glow` Card elevation lost its lime box-shadow and now composes neutral `shadow.xl` + the aurora `radial-gradient` background.
- **0.12.4** — The corner-clip contract is now strictly net-positive for the system. The two trade-offs v0.12.1 left open both close in v0.12.4: (a) hand-rolled non-Radix popovers (Combobox dropdown) inside `<Card padding="none">` were clipped by the `overflow: hidden` — fixed by migrating Combobox to `createPortal(<div fixed>, document.body)` with `getBoundingClientRect()` tracking, so the dropdown escapes the card subtree exactly like Radix-portaled chrome already does; (b) `box-shadow`-based focus rings on interactive descendants (Pagination buttons) inside `<Card padding="none">` were partially clipped — fixed by adding `outline: 2px solid <color>; outline-offset: 1px;` to the global `:focus-visible` rule on top of the existing soft box-shadow halo (the `<color>` was `var(--lumen-lime-a64)` originally; **v0.14 R11 retuned it to `var(--border-frame)` neutral** per ADR 0030). Outline paints outside the layout box and is structurally immune to ancestor overflow. The `.lumen-btn-primary:focus-visible` dual-ring is unaffected (declares `outline: none` and wins via specificity per ADR 0016). No new ADR — these are consequential follow-ups to ADR 0021. See [CHANGELOG v0.12.4 entry](../../../CHANGELOG.md).
- **0.12.1** — Added the corner-clip contract: `padding="none"` now composes `overflow-hidden` so edge-touching children are clipped to the rounded shape. User screenshot 2026-05-06 of `/saas` Pagination "Next" button caught the artifact (square nub of pagination footer poking past the rounded card corner). Other padding tiers unchanged. See ADR 0021.
- **0.10.1** — Alignment contract. The shadcn `ui/card.tsx` ships its slots (CardHeader, CardContent, CardFooter) with their own `px-6`. Pre-v0.10.1 the Lumen wrapper added `[&_[data-slot=card-SLOT]]:px-N` in lockstep with the Card's outer `p-N`, so descendant-variant CSS specificity beat the inner slot's `px-0` and slot content sat inset by `p-N + px-N` while bare-text siblings sat at only `p-N` — visible as a 24-px misaligned column. Fix: outer Card owns inline padding via `p-N`; slots are zeroed via the SLOT_PX_ZERO triple. Slots and bare children both inset to the same `x = p-N`.
- **0.1.0** — Initial release.
