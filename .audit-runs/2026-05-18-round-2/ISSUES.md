# Lumen v0.12.8 — Round 2 Live Audit
**Date:** 2026-05-18 (round 2)
**Browser:** Edge on Personal Mac (via Claude in Chrome extension)
**Dev server:** http://localhost:3100
**Viewport:** 1440 × 900
**Routes covered (DEEP this round):** /foundations · /library · /landing · /tool · /commerce · /saas · /mobile · /desktop
**Theme tests:** Dark mode + Light mode walk of every route
**Method:** Click every interactive primitive, hover key items, open every overlay, type into inputs, expand every accordion, navigate via TOC, test command palette ⌘K, attempt resize.

---

## What round 2 added that round 1 missed

Round 1 focused on visual / scroll bleed. Round 2 focused on **interaction** — every clickable, hoverable, expandable primitive plus a full light-mode walk.

| Surface | Round 1 coverage | Round 2 coverage |
|---|---|---|
| Foundations | scroll walk + chrome-bleed | TOC anchor links + theme toggle |
| Library | scroll walk + chrome-bleed | Combobox / Calendar / Select / accordion / tooltip / dialog showcases |
| Landing | scroll walk + chrome-bleed | FAQ accordion expand + theme toggle + pricing card states |
| Tool | scroll walk + chrome-bleed | (visual only — no new bugs surfaced) |
| Commerce | scroll walk + chrome-bleed | **Color + size variant pickers** + cart-button + accordion |
| SaaS | scroll walk + chrome-bleed | Side-nav + tabs + filters |
| Mobile / Desktop | scroll walk + chrome-bleed | Phone-frame + window-frame visual fidelity in light mode |

---

## Issues found

### R2-COM-001 — `[FIXED v0.12.8]` Color + Size variant pickers were hardcoded showcase mockups
**Severity:** Medium — undermines the PDP polish (these are peak-decision moments per Premium Psychology principle 3).
**Where:** [audit-dashboard/src/app/commerce/page.tsx](audit-dashboard/src/app/commerce/page.tsx) `Buy()` function (formerly inline, now extracted).
**Symptom:** Clicking any color swatch (Storm Navy / Ranger Tan / Slate) produced no visual feedback — the ring stayed on Olive Drab and the "Color · Olive Drab" label never updated. Same for the size grid: clicking S / L / XL / XXL didn't move the bordered "selected" button away from M. The page rendered like a working product detail but failed the first click.
**Root cause:** The Buy function rendered swatch selection via `i === 0 ? selected-shadow : unselected-shadow` and size selection via `s === "M" ? selected : unselected`. There was no `useState`, no `onClick`, no controlled variant. The whole component was a static showcase mockup.
**Fix landed:**
- Created [audit-dashboard/src/app/commerce/buy.client.tsx](audit-dashboard/src/app/commerce/buy.client.tsx) — small client island with real `useState<string>` for color + size, click handlers wired to setters, `aria-pressed` reflecting state, and visible focus rings via `focus-visible:shadow-[var(--shadow-focus)]`.
- The label now reads `Color · {currentColor}` and tracks the selection. The swatch ring moves on every click. The size border tracks the chosen size.
- Reused the same hex / size constants from the original code. Visual character unchanged in rest state. Only the interaction added.
- `commerce/page.tsx` stays a server component (preserves `metadata.title = "Commerce · Lumen"`); the client island is a 130-line file imported from the server page. Cleanest possible isolation.
**Verified:** clicked all 4 colors → label + ring track. Clicked XS, XXL → size border moves. Keyboard tab + Enter also works (button semantics intact).

### R2-LIB-NATIVE-SELECT — `[NOT A BUG — by design]` Lumen `Select` is a native HTML `<select>`
Audit-time confusion: synthetic `.click()` and computer-tool clicks on the Select trigger didn't open a Radix-style listbox in the DOM.
**Root cause:** [audit-dashboard/src/components/primitives/inputs.tsx](audit-dashboard/src/components/primitives/inputs.tsx) line 136 — the `Select` primitive wraps a native `<select>` element styled with `.lumen-field`. The OS-level dropdown opens on real user mouse-down (not synthesizable from JS), and the panel paints outside the DOM (no `[role="listbox"]` to query). The companion `Combobox` (line 192) is the custom portaled variant for autocomplete; that one DID open and filter correctly on click + type.
**Action:** none.

### R2-LIB-TOOLBAR-KEBAB — `[NOT A BUG — by design]` "⋯" toolbar button is a static showcase
The kebab "⋯" Button in the Toolbar showcase ([client.tsx:358](audit-dashboard/src/app/library/client.tsx#L358)) has no `onClick` handler. It's there to demonstrate the *shape* of a "more actions" affordance in a toolbar — not to be a working DropdownMenu trigger. The MenuList showcase ([client.tsx:265](audit-dashboard/src/app/library/client.tsx#L265)) renders the menu open inline as a static visual demo of the items shape.
**Action:** none.

### R2-LIB-TOOLTIP-EDGE — `[NOT A BUG — Radix viewport clamp]` Tooltip clamps to viewport edge
On `/library` the Tooltip on the "Hover me" button appears flush against `x=0` because the trigger sits near the left edge and the tooltip is wider than the trigger. Radix's collision detection clamps the tooltip to stay inside the viewport. Correct WCAG 1.4.13 behavior (the tooltip stays fully visible / dismissible / hoverable).
**Action:** none.

### R2-LM-1 — `[NOT A BUG — intentional contrast adjustment]` Spring Green darkens in light mode
The accent `--lumen-accent-4` in light mode resolves to a darker green (forest-leaning) to maintain text contrast against `--surface-page` (white). The system-wide token contract is doing its job — same hex never serves both modes for accent text.
**Action:** none. (Brand integrity preserved: the same Spring Green hex `#00FA8A` is still the canonical dark-mode accent; light-mode is the contrast-corrected partner.)

### R2-LM-2 — `[NOT A BUG — intentional]` Light-mode toggle thumb uses `--text-on-accent`
The `[data-state="checked"]::before` rule on `.lumen-switch` sets the thumb to `var(--text-on-accent)`, which is the text color that reads on top of the accent ramp — black/dark in both modes. In light mode the thumb reads dark on the green-track ON state; in dark mode it reads the same. Visible in both, brand-coherent in both.
**Action:** none.

### R2-RESPONSIVE — `[BLOCKED — limitation of resize_window MCP]` Could not verify <768px viewport
The Claude in Chrome `resize_window` tool resizes the outer browser window but doesn't propagate the new dimensions to `window.innerWidth` / the rendering viewport. So `md:` / `sm:` / mobile breakpoints couldn't be exercised live. The responsive utility classes are present in source ([landing/page.tsx](audit-dashboard/src/app/landing/page.tsx) uses `md:text-display-lg` / `md:grid-cols-*`; [dashboard-shell.tsx](audit-dashboard/src/components/dashboard-shell.tsx) uses `sm:flex-row` / `sm:items-center`). Manual phone-emulator testing would be the next step.
**Action:** none in this round. Flag for next audit pass when device emulation is wired.

---

## Light-mode walkthrough — every route verified

| Route | Light-mode verdict | Notes |
|---|---|---|
| `/foundations` | ✓ clean | Spring Green darkens correctly; architectural grid stays subtle |
| `/landing` | ✓ clean | Inverse "Get started" band now flips to dark (works in both modes) |
| `/library` | ✓ clean | All form primitives readable; toggle thumb stays visible in both states |
| `/tool` | ✓ clean | Quote Builder + Live Preview surface render correctly |
| `/commerce` | ✓ clean | Promo bar flips to dark in light mode (works in both modes); Foundry storefront chrome consistent |
| `/saas` | ✓ clean | KPI sparklines and status pills correctly tinted |
| `/mobile` | ✓ clean | Phone frames render with their internal dark-app content (intentional showcase choice) |
| `/desktop` | ✓ clean | macOS Tahoe + Windows 11 frames render correctly in both modes |

All routes confirmed to render correctly under `data-theme="light"` — no contrast failures, no broken tokens, no muddy backdrops.

---

## What round 2 deliberately did NOT change

- **Native Select / kebab-button mockups / inline MenuList showcase** — by-design static demos of *shape*, not interactivity. Real consumer apps wire the Radix DropdownMenu primitive against these contracts.
- **MoodSwitcher** — hidden until `MOODS.length > 1`. Currently just `"obsidian"`. Future-proofed for the next palette.
- **Tooltip viewport-clamp** — Radix collision detection working correctly.

---

## Verified working (no fix needed)

- Foundations TOC anchor links navigate + scroll correctly
- Theme toggle persists in localStorage + propagates to `documentElement.dataset.theme`
- Command palette ⌘K opens, filters, navigates between routes
- Combobox autocomplete dropdown opens, filters on type, escapes to close
- Calendar popover renders with month nav arrows + selected day
- FAQ accordion expands with chevron rotation (lucide ChevronDown, no native disclosure marker)
- All status pills (Live / On time / Pickup / At risk / Late / Delivered) render in correct tones
- KPI sparklines render with green/red trend coloring
- Stepper renders numbered circles with completed-state checkmarks
- Pagination renders selected page with bordered button
