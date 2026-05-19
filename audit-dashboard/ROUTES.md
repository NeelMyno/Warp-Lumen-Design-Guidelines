# Audit dashboard routes

> **One-stop route index for humans and LLM agents.** Every route in `audit-dashboard/src/app/` documented with its purpose, target audience, primitives demonstrated, and the design system contracts it exercises. **Generated v0.13.1; lives next to [`README.md`](README.md).**

## Why this exists

The audit dashboard is the canonical Lumen reference implementation. But "the dashboard" is 9 distinct routes, each demonstrating a different surface mood, density tier, and primitive set. Without a route index an LLM agent or new contributor either (a) opens routes one by one to figure out what each is for, or (b) misses a route entirely. This index fixes both.

## Conventions

- Every route lives under `src/app/{name}/page.tsx` or `src/app/{name}/page.tsx` + `client.tsx` (for routes with interactive client state that has to opt into a client island).
- Every route is rendered inside the global [`layout.tsx`](src/app/layout.tsx), which mounts the persistent header pill, footer, theme toggle, and mood switcher.
- Every route honors the runtime `data-theme="dark"|"light"` attribute on `<html>` and the `data-mood="..."` attribute the mood switcher writes.

## Routes (9)

### `/` — Index

| | |
|---|---|
| **File** | [`src/app/page.tsx`](src/app/page.tsx) |
| **Purpose** | Marketing landing for the dashboard itself. Lightweight hero pointing visitors to the foundations + library + template routes. |
| **Audience** | First-time visitors. |
| **Primitives** | `Button`, `LiveDot`, `Badge`, links. |
| **Density tier** | Marketing (96 px hero rhythm). |

### `/foundations`

| | |
|---|---|
| **File** | [`src/app/foundations/page.tsx`](src/app/foundations/page.tsx) |
| **Purpose** | The system's first principles — color ramps (12 stops + alpha primitives), typography (display / heading / body / label / data / metric / eyebrow), spacing (4-pt base + the v0.8 1.5/7/9/11/14 sub-grid), elevation (5 shadow tiers), motion (4 durations × 4 easings), micro-interactions (hover / focus / validation / success), density modes (marketing / operator / cozy / compact). |
| **Audience** | Anyone learning the system — designers, engineers, LLM agents on first pass. |
| **Primitives** | Almost all of them. This is the system's longest route. Color: `SwatchRamp`, `ColorPicker`. Type: `TypeRow`. Spacing: live spacing-ladder examples. Motion: `MotionDemo`. Tabs: `InlineTabs` (`pill` + `underline` variants). Iconography: lucide tile grid with `text-accent` hover lift. |
| **Density tier** | Mixed — marketing-spaced for hero, operator-dense for ramps. |
| **Notable** | The display typography "Stop re-designing." caption pushes intrinsic min-content past device viewport at 320 px — protected by ADR 0024's `overflow-x: clip` safety net + `TypeRow`'s defensive `minmax(0,1fr) min-w-0 overflow-hidden`. |

### `/library`

| | |
|---|---|
| **File** | [`src/app/library/page.tsx`](src/app/library/page.tsx) + [`client.tsx`](src/app/library/client.tsx) (interactive showcase state) |
| **Purpose** | The component gallery. Every Lumen primitive demonstrated in at least one default state plus its variants where applicable. The canonical "is this how a Lumen X is supposed to look?" reference. |
| **Audience** | Designers comparing options · engineers verifying composition · LLM agents picking a primitive for a task. |
| **Primitives** | All 98 components in the registry. Showcased in `Showcase` frames with hairline borders and per-component captions. The `SwitchRow` pattern (v0.13.1 a11y fix — `aria-labelledby` wires the sibling-label `<span>` to the Radix `<button role="switch">`). |
| **Density tier** | Operator (24 px section rhythm). |
| **Notable** | The library page is the largest route by surface area. Some showcase frames have intrinsic min-content > device viewport at 320 px — also protected by ADR 0024's root safety net. Showcase frames compose `overflow-hidden` per ADR 0021 — floating panels MUST portal to `document.body` (per AGENTS.md hard rule 10) or they get clipped. |

### `/landing`

| | |
|---|---|
| **File** | [`src/app/landing/page.tsx`](src/app/landing/page.tsx) |
| **Purpose** | Marketing template — hero, three-question hero (what / who / why), three-tier pricing, testimonial logos, FAQ accordions. |
| **Audience** | Marketers / contractors composing marketing pages. |
| **Primitives** | `Button` (`xl` size), `PricingCard` (with v0.12.5 peak-end lift), `LogoCloud`, `TestimonialCard`, `Accordion` (with `lumen-summary` marker contract per v0.12.5), `ChevronDown` (lucide — replaces unicode `▾`). |
| **Density tier** | Marketing (96 px hero rhythm, 1024-wide container). |
| **Notable** | Section 12 of USING-LUMEN.md — "first impressions" — was authored against this route's hero. The pricing tier "Operator" carries the layered accent glow per v0.12.5 micro-interaction band. |

### `/saas`

| | |
|---|---|
| **File** | [`src/app/saas/page.tsx`](src/app/saas/page.tsx) |
| **Purpose** | SaaS app template — sidebar primary nav, top toolbar with ⌘K palette trigger, dashboard with KPI cards + table + sparklines + sidebar drawer. |
| **Audience** | Engineers composing operator-facing SaaS surfaces. |
| **Primitives** | `Sidebar`, `Navbar`, `CommandPaletteButton`, `KpiCard`, `Stat`, `Sparkline`, `Table`, `DataGrid`, `Tabs`, `Drawer`, `AvatarGroup` (with v0.12.5 privacy-scrub synthetic names). |
| **Density tier** | Operator (24 px section rhythm, 1100-wide max). |
| **Notable** | The `BulkActionBar` here flips to the inverse pattern (`bg-[var(--surface-inverse)]` → bright white in dark mode) by design — this matches Gmail / GitHub / Linear bulk-action conventions; R4 documented this as not-a-bug. |

### `/tool`

| | |
|---|---|
| **File** | [`src/app/tool/page.tsx`](src/app/tool/page.tsx) + [`presets.client.tsx`](src/app/tool/presets.client.tsx) (interactive preset list client island, v0.12.9 fix) |
| **Purpose** | Operator tool template — dense workflow builder. Left preset rail, center canvas, right inspector. Models the Warp TMS builder surface. |
| **Audience** | Engineers composing dense operator tools (TMS, logistics command center, ops dashboards). |
| **Primitives** | `Pill`, `Segmented`, `Stepper`, `Combobox` (portaled per v0.12.4 / AGENTS hard rule 10), `KpiCard`, `Stat`, `Drawer`, `Sheet`, `Toolbar`, `SplitButton`. |
| **Density tier** | Operator (compact tier at 32 px). |
| **Notable** | The preset list was extracted to a client island in v0.12.9 because the initial render had a hardcoded active preset with no `useState` — clicks didn't move the active accent. See CHANGELOG v0.12.9 R3-003. |

### `/commerce`

| | |
|---|---|
| **File** | [`src/app/commerce/page.tsx`](src/app/commerce/page.tsx) + [`buy.client.tsx`](src/app/commerce/buy.client.tsx) (color + size pickers, v0.12.8 fix) |
| **Purpose** | E-commerce template — PDP with variant pickers (color + size), trust strip, cart drawer, checkout progress, review section, related products. |
| **Audience** | Engineers composing Shopify / BigCommerce / WooCommerce themes. |
| **Primitives** | `PricingCard`, `Stars`, `RatingBlock`, `ColorSwatchSelector` (with v0.13.1 AA-pass "Brick" color), `SizeSelector`, `CartDrawer`, `CheckoutProgress`, `ComparisonTable`, `TrustStrip`, `InventoryStatus`, `Klarna` / `Afterpay` / `ApplePay` / `GooglePay` / `ShopPay` / `PayPal` payment chips. |
| **Density tier** | Marketing-leaning (24 px section + breathing hero) — commerce occupies the middle ground. |
| **Notable** | The Buy panel (color + size pickers) is a client island per v0.12.8 R2-001 — the initial render had no `useState` for selection, clicks failed. ProductGallery thumbs ship the `role="tab"` + `aria-label` pattern per v0.13.1 R5-009. |

### `/mobile`

| | |
|---|---|
| **File** | [`src/app/mobile/page.tsx`](src/app/mobile/page.tsx) |
| **Purpose** | iOS-flavored mobile mockup. Three `PhoneFrame`s side-by-side showing inbox, message thread, and settings. Status bar, bottom nav, swipe actions, action sheet, permission prompt, coach mark, pull-to-refresh, face-ID prompt. |
| **Audience** | Mobile engineers building React Native / native iOS / native Android UI that consumes Lumen. |
| **Primitives** | `PhoneFrame`, `StatusBar` (v0.12.9 — carrier defaults to undefined, dynamic-island blob no longer truncates "Verizon"), `BottomNav`, `ActionSheet`, `MobileListItem`, `SwipeAction`, `PullToRefresh`, `PermissionPrompt`, `FaceIDPrompt`, `CoachMark`, `BottomSheet`, `KeyboardAccessoryBar`. |
| **Density tier** | Mobile (touch target floor 44 px, `space.11`). |
| **Notable** | The mobile-inbox search header gained `aria-label` per v0.13.1 R5-010. |

### `/desktop`

| | |
|---|---|
| **File** | [`src/app/desktop/page.tsx`](src/app/desktop/page.tsx) |
| **Purpose** | Native desktop mockup — macOS window chrome (traffic-light dots, sidebar, toolbar). Models the future Lumen desktop adapter for SwiftUI / WinUI. |
| **Audience** | Native desktop engineers building macOS / Windows surfaces that consume Lumen tokens. |
| **Primitives** | Window frame, traffic-light dots, native-style sidebar + toolbar (re-skinned `Sidebar` + `Toolbar`). |
| **Density tier** | Operator. |
| **Notable** | The desktop-mac and desktop-windows platform guides in `design-system/03-platforms/` reference this route as the canonical visual reference. |

## Per-route audit log cross-reference

| Audit round | Route | Primary finding | Fix |
|---|---|---|---|
| R1 (v0.12.7) | `/saas`, `/tool` | Sticky-header chrome bleed under primary CTAs | `lumen-glass-strong` + `saturate(110%)` on header |
| R2 (v0.12.8) | `/commerce` | PDP color + size pickers fail on first click | Extract `buy.client.tsx` with real `useState` |
| R3 (v0.12.9) | `/foundations` (calendar), `/mobile` (status bar), `/tool` (preset list) | Hardcoded calendar offsets · iOS carrier truncation · hardcoded active preset | Dynamic calendar · drop carrier default · extract `presets.client.tsx` |
| R4 (v0.13.0) | All 8 routes (desktop 1500×812) | LLM-docs version drift (most surface bugs already closed by R1-R3) | ADR 0023 LLM-docs version lockstep |
| R5 (v0.13.1) | All 8 routes (mobile 320 / 375) | Layout-viewport inflation; 10 a11y findings; R4-deferred coverage gap | ADR 0024 `overflow-x: clip` + Switch/Checkbox `aria-label` + 12 new content files |
| R6 (v0.13.2) | All 8 routes (audit + LLM-docs sweep) | Documentation SSoT gaps (no COMPONENT-INDEX / TOKEN-INDEX / ROUTES; release.mjs missed package.json + README Status; 35-vs-98 catalog drift across USING-LUMEN.md) | This pass. |

> **Audit-cycle ladder.** R1 static @ desktop → R2 interaction @ desktop → R3 contract-comparison @ desktop → R4 meta-contract integrity @ desktop → R5 small-viewport metrics @ mobile → R6 LLM-docs SSoT + tooling-script hygiene. Each round ramps the tooling along with the surface coverage; a carried blocker is a tooling hypothesis, not a fact.
