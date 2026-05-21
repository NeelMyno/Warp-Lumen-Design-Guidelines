# COMPONENT-INDEX.md

> **Auto-generated for Lumen v0.15.0** (2026-05-21). Run `node scripts/build-component-index.mjs` to regenerate. Source of truth: the `design-system/02-components/*/component.json` files. **Never hand-edit this file** — drift is caught by the next regeneration.

Lumen ships **98 components** in the [`_registry/registry.json`](_registry/registry.json) shadcn catalog. Each component has `component.md` (human contract), `component.json` (machine contract validating against [`_schema/component.schema.json`](design-system/02-components/_schema/component.schema.json)), and per-platform `examples/{platform}.{ext}` where authored.

## Quick install

```bash
pnpm dlx shadcn@latest add <cdn>/lumen/v0.15.0/registry/{name}.json
```

## How to read this index

- **Component** — kebab-case name, links to `component.md` for prose contract.
- **Purpose** — first sentence of `component.json`'s `summary` field.
- **Version** — version the contract last stabilised at.
- **Status** — `stable` / `alpha` / `beta` / `deprecated`.
- **Examples** — platform code examples present in the `examples/` directory.

## Signature primitives (Warp-specific) (8)

| Component | Purpose | Version | Status | Examples |
|---|---|---|---|---|
| [`badge`](design-system/02-components/badge/component.md) | A small pill that labels status, category, or count. | 0.2.0 | stable | primary.tsx |
| [`copy-button`](design-system/02-components/copy-button/component.md) | Compact icon-button that writes a value to the clipboard and flashes a confirmation. | 0.12.6 | stable | primary.tsx |
| [`icon-button`](design-system/02-components/icon-button/component.md) | A square Button containing only an icon. | 0.9.0 | stable | primary.tsx |
| [`kbd`](design-system/02-components/kbd/component.md) | Inline keyboard-key cue. | 0.12.6 | stable | primary.tsx |
| [`live-dot`](design-system/02-components/live-dot/component.md) | An 8px green dot with a 2px pulsing ring. | 0.1.0 | stable | primary.tsx |
| [`rate-ticker`](design-system/02-components/rate-ticker/component.md) | Horizontal marquee of freight lane rates. | 0.1.0 | stable | primary.tsx |
| [`stat`](design-system/02-components/stat/component.md) | A big bold number with a small uppercase tracked unit and optional delta + sparkline. | 0.2.0 | stable | primary.tsx |
| [`trend`](design-system/02-components/trend/component.md) | Numeric delta indicator. | 0.12.6 | stable | primary.tsx |

## Buttons + actions (7)

| Component | Purpose | Version | Status | Examples |
|---|---|---|---|---|
| [`button`](design-system/02-components/button/component.md) | Primary action affordance. | 0.12.2 | stable | compose.kt, primary.tsx, react-native.tsx, swiftui.swift |
| [`button-group`](design-system/02-components/button-group/component.md) | A row of joined buttons that share a single rounded outline. | 0.9.0 | beta | primary.tsx |
| [`command-palette-button`](design-system/02-components/command-palette-button/component.md) | Search-styled trigger that opens the global command palette. | 0.9.0 | beta | primary.tsx |
| [`fab`](design-system/02-components/fab/component.md) | Floating Action Button — round, fixed-position primary action. | 0.9.0 | beta | primary.tsx |
| [`segmented`](design-system/02-components/segmented/component.md) | 2–4 mutually exclusive options on one row. | 0.7.0 | beta | web-react.tsx |
| [`split-button`](design-system/02-components/split-button/component.md) | Primary action + dropdown caret in a single joined affordance. | 0.9.0 | beta | primary.tsx |
| [`toggle`](design-system/02-components/toggle/component.md) | A switch for binary on/off settings. | 0.1.0 | stable | primary.tsx |

## Inputs + forms (21)

| Component | Purpose | Version | Status | Examples |
|---|---|---|---|---|
| [`checkbox`](design-system/02-components/checkbox/component.md) | Independent boolean. | 0.6.0 | stable | primary.tsx |
| [`color-picker`](design-system/02-components/color-picker/component.md) | Color selection control. | 0.12.6 | beta | primary.tsx |
| [`combobox`](design-system/02-components/combobox/component.md) | Searchable single-choice dropdown. | 0.12.4 | beta | web-react.tsx |
| [`date-picker`](design-system/02-components/date-picker/component.md) | Read-only field-shell trigger with leading calendar glyph; click opens a portaled calendar popover. | 0.7.0 | beta | web-react.tsx |
| [`field`](design-system/02-components/field/component.md) | Composition wrapper for a single form control. | 0.6.0 | stable | compose.kt, primary.tsx, react-native.tsx, swiftui.swift |
| [`file-dropzone`](design-system/02-components/file-dropzone/component.md) | Drag-and-drop file input. | 0.7.0 | beta | web-react.tsx |
| [`form`](design-system/02-components/form/component.md) | Semantic form wrapper with dual-mode validation. | 0.7.0 | stable | web-react-rhf.tsx |
| [`input`](design-system/02-components/input/component.md) | Single-line text input. | 0.6.0 | stable | primary.tsx |
| [`number-input`](design-system/02-components/number-input/component.md) | Stepper-flanked numeric input. | 0.7.0 | beta | web-react.tsx |
| [`otp-input`](design-system/02-components/otp-input/component.md) | One-time passcode entry. | 0.7.0 | beta | web-react.tsx |
| [`password-input`](design-system/02-components/password-input/component.md) | Password entry with Show / Hide toggle in the trailing slot. | 0.7.0 | beta | web-react.tsx |
| [`radio-group`](design-system/02-components/radio-group/component.md) | Mutually exclusive single choice from 2+ options. | 0.6.0 | stable | primary.tsx |
| [`range-slider`](design-system/02-components/range-slider/component.md) | Single-handle or dual-handle bar slider. | 0.7.0 | beta | web-react.tsx |
| [`search-field`](design-system/02-components/search-field/component.md) | Specialized Input variant for search. | 0.12.6 | stable | primary.tsx |
| [`select`](design-system/02-components/select/component.md) | Single-choice dropdown from a known list of options. | 0.6.0 | stable | primary.tsx |
| [`slider`](design-system/02-components/slider/component.md) | Single-value range control. | 0.12.6 | stable | primary.tsx |
| [`switch`](design-system/02-components/switch/component.md) | Binary toggle for an immediate-effect setting. | 0.6.0 | stable | primary.tsx |
| [`tags-input`](design-system/02-components/tags-input/component.md) | Wrapping chip-row tag entry. | 0.7.0 | beta | web-react.tsx |
| [`textarea`](design-system/02-components/textarea/component.md) | Multi-line text input. | 0.6.0 | stable | primary.tsx |
| [`time-picker`](design-system/02-components/time-picker/component.md) | Hours/minutes input + am/pm pill toggle on one row inside a field shell. | 0.7.0 | beta | web-react.tsx |
| [`validation-message`](design-system/02-components/validation-message/component.md) | Inline or summary validation message. | 0.6.0 | stable | primary.tsx |

## Feedback + messaging (9)

| Component | Purpose | Version | Status | Examples |
|---|---|---|---|---|
| [`alert`](design-system/02-components/alert/component.md) | Inline, in-flow status block. | 0.12.6 | stable | primary.tsx |
| [`banner`](design-system/02-components/banner/component.md) | Page-level system state strip. | 0.12.6 | stable | primary.tsx |
| [`empty-state`](design-system/02-components/empty-state/component.md) | Type-led message for empty collections. | 0.15.0 | stable | primary.tsx |
| [`progress`](design-system/02-components/progress/component.md) | Two shapes — linear (default; 4 px tall stroke with optional label / value cluster) and circular (a ring; ideal for upload completion or small inline indicators). | 0.12.6 | stable | primary.tsx |
| [`skeleton`](design-system/02-components/skeleton/component.md) | Layout-preserving placeholder painted while content loads. | 0.12.6 | stable | primary.tsx |
| [`snackbar`](design-system/02-components/snackbar/component.md) | Transient, viewport-anchored message with a single trailing action. | 0.12.6 | stable | primary.tsx |
| [`spinner`](design-system/02-components/spinner/component.md) | Pure CSS rotating-arc loading indicator. | 0.12.6 | stable | primary.tsx |
| [`tag`](design-system/02-components/tag/component.md) | Compact, often-closable chip for categorizing or filtering. | 0.12.6 | stable | primary.tsx |
| [`toast`](design-system/02-components/toast/component.md) | A short non-blocking message anchored to a viewport corner. | 0.1.0 | beta | primary.tsx |

## Display + data (14)

| Component | Purpose | Version | Status | Examples |
|---|---|---|---|---|
| [`avatar`](design-system/02-components/avatar/component.md) | User / actor identity image with deterministic name-hashed fallback colors and initials when no image is present. | 0.12.6 | stable | primary.tsx |
| [`calendar`](design-system/02-components/calendar/component.md) | Standalone calendar surface. | 0.12.6 | beta | primary.tsx |
| [`carousel`](design-system/02-components/carousel/component.md) | Horizontally paginated content scroller. | 0.12.6 | stable | primary.tsx |
| [`chart`](design-system/02-components/chart/component.md) | Generic chart wrapper that consumes Lumen's CHART_PALETTE and chart-token surface (axes, grid, legend, tooltip). | 0.12.6 | stable | primary.tsx |
| [`citation-card`](design-system/02-components/citation-card/component.md) | Source reference rendered next to an AI-generated value. | 0.12.6 | stable | primary.tsx |
| [`code-block`](design-system/02-components/code-block/component.md) | Mono-typeface code display with optional language label, line numbers, copy button, and token highlight. | 0.12.6 | stable | primary.tsx |
| [`data-grid`](design-system/02-components/data-grid/component.md) | Power-user tabular surface built on Table. | 0.12.6 | beta | primary.tsx |
| [`kanban`](design-system/02-components/kanban/component.md) | Horizontal board of vertically-stacked KanbanColumns containing KanbanCards. | 0.12.6 | beta | primary.tsx |
| [`kpi-card`](design-system/02-components/kpi-card/component.md) | A single-metric card. | 0.12.6 | stable | primary.tsx |
| [`list`](design-system/02-components/list/component.md) | Vertical sequence primitive — semantic <ul>/<ol> with Lumen chrome. | 0.12.6 | stable | primary.tsx |
| [`presence-indicator`](design-system/02-components/presence-indicator/component.md) | Live state for one or more users on a surface. | 0.12.6 | stable | primary.tsx |
| [`sparkline`](design-system/02-components/sparkline/component.md) | Inline micro-chart for a single time series. | 0.12.6 | stable | primary.tsx |
| [`timeline`](design-system/02-components/timeline/component.md) | Chronological sequence of events. | 0.12.6 | stable | primary.tsx |
| [`tree-view`](design-system/02-components/tree-view/component.md) | Hierarchical node list. | 0.12.6 | beta | primary.tsx |

## Containers + surfaces (10)

| Component | Purpose | Version | Status | Examples |
|---|---|---|---|---|
| [`card`](design-system/02-components/card/component.md) | A bounded surface with a hairline border and optional subtle shadow. | 0.12.4 | stable | compose.kt, primary.tsx, react-native.tsx, swiftui.swift |
| [`dialog`](design-system/02-components/dialog/component.md) | A modal interrupt for confirmation, focused decision, or short-form input. | 0.1.0 | beta | primary.tsx |
| [`divider`](design-system/02-components/divider/component.md) | Hairline rule that separates content. | 0.12.6 | stable | primary.tsx |
| [`drawer`](design-system/02-components/drawer/component.md) | Side-anchored panel that slides over the page. | 0.12.6 | stable | primary.tsx |
| [`link`](design-system/02-components/link/component.md) | Inline text link. | 0.12.6 | stable | primary.tsx |
| [`panel`](design-system/02-components/panel/component.md) | In-flow collapsible content container. | 0.12.6 | stable | primary.tsx |
| [`popover`](design-system/02-components/popover/component.md) | Floating panel anchored to a trigger. | 0.12.6 | stable | primary.tsx |
| [`sheet`](design-system/02-components/sheet/component.md) | Mobile-flavor bottom-anchored modal with optional detents (half / large / full). | 0.12.6 | stable | primary.tsx |
| [`table`](design-system/02-components/table/component.md) | Operator-density data table. | 0.1.0 | stable | primary.tsx |
| [`tooltip`](design-system/02-components/tooltip/component.md) | A small, dismissible-on-hover, portaled bubble that names a control or clarifies a value. | 0.12.6 | stable | primary.tsx |

## Navigation (12)

| Component | Purpose | Version | Status | Examples |
|---|---|---|---|---|
| [`accordion`](design-system/02-components/accordion/component.md) | Disclosure list. | 0.12.6 | stable | primary.tsx |
| [`action-sheet`](design-system/02-components/action-sheet/component.md) | Mobile-only choice sheet. | 0.12.6 | stable | primary.tsx |
| [`bottom-nav`](design-system/02-components/bottom-nav/component.md) | Mobile-only primary navigation rail anchored to the bottom of the viewport. | 0.12.6 | stable | primary.tsx |
| [`breadcrumbs`](design-system/02-components/breadcrumbs/component.md) | Where am I, how did I get here, and how do I step back. | 0.12.6 | stable | primary.tsx |
| [`dropdown-menu`](design-system/02-components/dropdown-menu/component.md) | Reveal a portaled menu of actions or routes from a trigger. | 0.12.6 | stable | primary.tsx |
| [`navbar`](design-system/02-components/navbar/component.md) | Top app bar — the single highest-level navigation chrome. | 0.12.6 | stable | primary.tsx |
| [`notification-center`](design-system/02-components/notification-center/component.md) | Inbox of system + user notifications. | 0.12.6 | beta | primary.tsx |
| [`pagination`](design-system/02-components/pagination/component.md) | Move between fixed-size pages of a list, table, or feed. | 0.12.6 | stable | primary.tsx |
| [`sidebar`](design-system/02-components/sidebar/component.md) | Vertical primary navigation rail. | 0.12.6 | stable | primary.tsx |
| [`stepper`](design-system/02-components/stepper/component.md) | Linear multi-step progress affordance for an ordered flow. | 0.12.6 | stable | primary.tsx |
| [`tabs`](design-system/02-components/tabs/component.md) | Switch between sibling views inside the same destination. | 0.12.6 | stable | primary.tsx |
| [`toolbar`](design-system/02-components/toolbar/component.md) | A grouped row of interactive controls — buttons, toggle buttons, dropdowns, dividers — sharing a single tab stop. | 0.12.6 | stable | primary.tsx |

## Mobile-specific (6)

| Component | Purpose | Version | Status | Examples |
|---|---|---|---|---|
| [`coach-mark`](design-system/02-components/coach-mark/component.md) | Onboarding tooltip with a backdrop spotlight (dark scrim with a cut-out around the anchor element). | 0.12.6 | stable | primary.tsx |
| [`permission-prompt`](design-system/02-components/permission-prompt/component.md) | Pre-prompt that explains WHY the app needs a system permission BEFORE triggering the OS-native dialog. | 0.12.6 | stable | primary.tsx |
| [`phone-frame`](design-system/02-components/phone-frame/component.md) | Decorative chrome that mocks a phone shell for marketing / showcase / docs. | 0.12.6 | stable | primary.tsx |
| [`pull-to-refresh`](design-system/02-components/pull-to-refresh/component.md) | Mobile-only refresh-on-pull gesture wrapper. | 0.12.6 | stable | primary.tsx |
| [`status-bar`](design-system/02-components/status-bar/component.md) | Decorative mobile-platform status-bar row. | 0.12.6 | stable | primary.tsx |
| [`swipe-action`](design-system/02-components/swipe-action/component.md) | Mobile-only row wrapper that exposes trailing (and optionally leading) actions on horizontal swipe. | 0.12.6 | stable | primary.tsx |

## AI + collaboration (6)

| Component | Purpose | Version | Status | Examples |
|---|---|---|---|---|
| [`ai-badge`](design-system/02-components/ai-badge/component.md) | Inline 'AI generated' / 'AI summary' / 'AI confidence' label. | 0.12.6 | stable | primary.tsx |
| [`ai-prompt-input`](design-system/02-components/ai-prompt-input/component.md) | AI prompt composer. | 0.12.6 | stable | primary.tsx |
| [`ai-suggestion`](design-system/02-components/ai-suggestion/component.md) | Inline AI proposal card. | 0.12.6 | stable | primary.tsx |
| [`chat-bubble`](design-system/02-components/chat-bubble/component.md) | Chat message row. | 0.12.6 | stable | primary.tsx |
| [`comment-thread`](design-system/02-components/comment-thread/component.md) | Threaded discussion attached to an entity (a row, an annotation marker, a document range). | 0.12.6 | stable | primary.tsx |
| [`reaction-bar`](design-system/02-components/reaction-bar/component.md) | Emoji reaction row attached to a Comment / ChatBubble / annotation marker. | 0.12.6 | stable | primary.tsx |

## Commerce + marketing (5)

| Component | Purpose | Version | Status | Examples |
|---|---|---|---|---|
| [`cart-drawer`](design-system/02-components/cart-drawer/component.md) | Commerce-flavor Drawer pre-composed as the side cart. | 0.12.6 | stable | primary.tsx |
| [`inventory-status`](design-system/02-components/inventory-status/component.md) | Stock state chip for ecommerce / fulfillment surfaces. | 0.12.6 | stable | primary.tsx |
| [`logo-cloud`](design-system/02-components/logo-cloud/component.md) | Social-proof strip of partner / customer logos. | 0.12.6 | stable | primary.tsx |
| [`pricing-card`](design-system/02-components/pricing-card/component.md) | Single tier on a pricing page. | 0.12.6 | stable | primary.tsx |
| [`testimonial-card`](design-system/02-components/testimonial-card/component.md) | Customer quote card. | 0.12.6 | stable | primary.tsx |

---

> **Update this file by re-running `node scripts/build-component-index.mjs`** — do not hand-edit. Drift will be caught by the next regeneration.

Generated 2026-05-21 from VERSION = 0.15.0.
