# web-tool — the single-purpose utility pattern

> Calculator, builder, simulator, quote tool — surfaces where one user opens one app to do one job. Three columns, one canvas, immediate feedback. The freight industry calls this a "rate desk"; the SaaS world calls it an "internal tool"; Lumen calls it a `ToolFrame`. Operator density throughout. The LiveDot is the trust signal. Auto-save is the contract. The "View JSON" button is the operator's escape hatch.

## 1. The shape

```
ToolFrame (rounded-xl, hairline border, single elevation)
  ├── TitleBar (h-12, raised surface, hairline-bottom)
  │     ├── BrandMark (24px square, accent fill)
  │     ├── App title  (heading.h6 in text-primary)
  │     ├── Badge (version chip)
  │     ├── LiveDot label="Auto-quoting"      ← the trust signal
  │     └── Action cluster (right-aligned)
  │           ├── Button.tertiary.sm "View JSON"  (the escape hatch)
  │           ├── Button.secondary.sm "Save preset"
  │           └── Button.primary.sm "Get rates"
  │
  ├── 3-column grid  (260px | 1fr | 320px)
  │
  │     ├── LeftPanel  (raised surface, hairline-right)
  │     │     ├── lumen-eyebrow "Presets"
  │     │     ├── list of Button.tertiary (active = .lumen-btn-selected)
  │     │     ├── Button.tertiary "+ New preset"
  │     │     ├── (mt-auto)
  │     │     ├── lumen-eyebrow "Templates"
  │     │     └── helper paragraph (text-tertiary, micro)
  │     │
  │     ├── CenterCanvas  (page surface, scrolls)
  │     │     ├── Card (lane / origin / destination Fields)
  │     │     ├── Card (cargo rows + Add)
  │     │     ├── Card (accessorials Switch grid)
  │     │     ├── Auto-save indicator (LiveDot + "Auto-saving every 4s")
  │     │     └── Action row (Reset + Get rates)
  │     │
  │     └── RightPanel  (raised surface, hairline-left)
  │           ├── lumen-eyebrow "Live preview"
  │           ├── Button.tertiary.xs "Filter"
  │           ├── Best-value Card  (intent-accent border)
  │           │     ├── carrier identity row
  │           │     ├── Stat label="Total" value="$262"
  │           │     └── Button.primary.sm fullWidth "Book now"
  │           ├── (compact result Cards × N)
  │           ├── ProgressBar (X of N showing)
  │           └── helper line (text-tertiary, micro)
  │
  └── Footer keyboard-shortcut bar  (sunken surface, hairline-top, h-8)
        ├── kbd ⌘↵  "Quote"
        ├── kbd ⌘S  "Save preset"
        ├── kbd ⌘/  "Find"
        ├── kbd ?   "Help"
        └── (right-aligned) LiveDot "Connected · 12 ms p50"
```

Three panels, three roles: **input on the left, work in the middle, output on the right.** That's the F-pattern translated to tool UX — eye lands top-left (presets), reads across (canvas), lands top-right (output). The 260 / 320 split is asymmetric on purpose: the right panel carries denser data (carrier list, prices, transit times) and earns the extra 60px.

## 2. Density mode

**Operator (compact).** This is the canonical operator surface — a tool is opened daily, often hourly, by users who scan-read at velocity. `space.section.dense` (24px) within the panels, 32px row heights, hairline rhythm throughout. Forget marketing density — a tool with 96px section gaps is a tool that can't be used at speed.

The CenterCanvas can breathe slightly more depending on the tool's nature: a calculator wants tight rhythm (the user wants to see all inputs in one viewport); a builder might give the canvas more vertical room (the canvas itself is the work product). Default to compact; loosen the canvas locally only with documented reason.

| Region | Rhythm | Token |
|---|---|---|
| TitleBar height | 48 | `size.control.lg` |
| 3-column grid | 260 / 1fr / 320 | hand-set; documented in code |
| Panel padding | 12 | `space.inset.md` |
| Section break within panel | 24 | `space.section.dense` |
| Card-to-Card in canvas | 24 | `space.6` |
| Card padding (canvas) | 16–24 | `space.4` / `space.6` |
| Field-to-field within Card | 12 | `space.3` |
| Footer bar height | 32 | `size.control.xs` + 4 padding |
| Min height of grid region | 680 | hand-set; ensures comfortable canvas at viewport ≥ 768 |

**Don't subscribe the right panel to the canvas's density choice.** Even if the canvas breathes (large hero stat, generous chart), the right panel stays compact. Operators want the result list dense and scannable.

## 3. Tokens for wrappers

```
ToolFrame:
  rounded-xl                      (radius.xl = 16px — lifted-surface radius)
  border border-hairline
  shadow-md                       (shadow.card.lifted equivalent)
  bg-surface-page
  overflow-hidden                 (clip the rounded corners cleanly)

TitleBar:
  h-12                            (size.control.lg = 48px)
  flex items-center justify-between
  px-4                            (space.4 = 16px, comfortable for a header bar)
  border-b border-hairline
  bg-surface-raised               (a hair lifted from the page canvas)
  gap-inline-sm                   (space.2 = 8px between title elements)

Grid:
  grid-cols-[260px_1fr_320px]
  min-h-[680px]
  (no gap — panels are bordered, not gapped)

LeftPanel:
  border-r border-hairline
  bg-surface-raised
  p-3                             (space.inset.md = 12px)
  flex flex-col gap-1             (space.1 = 4px between preset rows)

CenterCanvas:
  bg-surface-page
  p-8                             (space.inset.xl-ish = 32px when the canvas can breathe)
                                  OR p-6 (24px) for compact tools
  flex flex-col gap-6             (space.6 = 24px between Cards)
  overflow-y-auto

RightPanel:
  border-l border-hairline
  bg-surface-raised
  p-4                             (space.4 = 16px — slightly more than left, results are denser)
  flex flex-col gap-3             (space.3 = 12px between result Cards)
  overflow-y-auto

Footer (keyboard bar):
  border-t border-hairline
  bg-surface-sunken               (subtly recessed — chrome, not content)
  px-4 py-2
  flex items-center gap-4
  lumen-mono text-micro
  text-tertiary
```

The **hairline-only rhythm** is the operator-tool signature. No gradient backgrounds. No drop shadows on individual panels. No accent backgrounds for emphasis. The whole frame has one outer shadow + one outer radius; everything inside is hairlines. This is the pattern that makes the tool feel like a precision instrument rather than a marketing demo.

## 4. Component recipe

| Role | Component + variant | Notes |
|---|---|---|
| TitleBar brand mark | `<div>` 24×24, `bg-accent`, `text-on-accent`, lumen-mono micro "W" | The brand-anchor in the top-left. Spring Green is allowed here — this is action chrome, not decoration. |
| TitleBar title | `heading.h6` (13px bold) in `text-primary` | App name. Don't use h2 or h3 — the tool's content is the focus, the title is scaffolding. |
| Version chip | `Badge` `status="neutral"` `size="sm"` | "v0.11.13 · beta" — operators want to see what they're using. |
| **LiveDot (the signature)** | `LiveDot label="Auto-quoting"` (or "Auto-saving") | **Always visible.** Pulses spring green. The "yes, this works" trust signal. Without it, operators don't know whether their inputs are being committed. |
| TitleBar action — escape hatch | `Button` `intent="tertiary"` `size="sm"` `leadingIcon={<Code/>}` "View JSON" | The operator's eject button. Surfaces the underlying state as raw JSON in a Dialog. Always ship this — operators want to see the data behind the UI. |
| TitleBar action — secondary | `Button` `intent="secondary"` `size="sm"` "Save preset" | The save-state action. Captures the current canvas state as a named preset. |
| TitleBar action — primary | `Button` `intent="primary"` `size="sm"` "Get rates" / "Compute" / "Run" | The main action. Same action available via ⌘↵ (documented in the footer bar). |
| LeftPanel preset list | `Button` `intent="tertiary"` `size="sm"` `fullWidth align="start"` | Active preset uses `.lumen-btn-selected` (`bg-surface-tint-accent` + `text-primary` + `font-semibold`). Inactive uses `text-secondary`. |
| LeftPanel new-preset | `Button` `intent="tertiary"` `size="sm"` `leadingIcon={<Plus/>}` "New preset" | Sticks to the bottom of the active list, before the templates band. |
| CenterCanvas section | `Card` `padding="lg"` + `CardHeader` | One Card per logical group ("Lane", "Cargo", "Accessorials"). CardHeader carries title + 1-line description. |
| CenterCanvas inputs | `Field` wrapping `Input` / `NumberInput` / `Select` / `Switch` | Always in `Field`. Mono variant for codes (ZIP, IATA, lane, dates). |
| CenterCanvas auto-save indicator | `LiveDot` + `lumen-mono` `text-micro` "Auto-saving every 4s" | Bottom of the canvas, left-aligned. Pairs with the TitleBar's LiveDot to reinforce the contract. |
| CenterCanvas action row | `Button` `intent="tertiary"` "Reset" + `Button` `intent="primary"` `size="md"` "Get rates" | Right-aligned. The same primary action as the TitleBar — operators reach for either, both work. |
| RightPanel best-value | `Card` `padding="md"` `elevation="lifted"` `className="!border-accent"` | One result is *the* result; promote it visually. Spring Green border (the only accent-borderable surface in the tool). Inside: identity row + `Stat` + `Button.primary` "Book now". |
| RightPanel result row | `Card` `padding="sm"` (compact) | Identity left, price right, mono-tabular price ("$285"), micro transit-time line. |
| RightPanel progress | `ProgressBar` `tone="accent"` `size="sm"` | "Showing X of N carriers" — gives operators a sense of what they're seeing vs. the total. |
| Footer kbd | `<kbd>` with `.lumen-kbd` class | Keyboard-shortcut documentation. ⌘↵ is the primary action; ⌘S saves preset; ⌘/ opens find; ? opens help. |
| Footer health LiveDot | `LiveDot` + `lumen-mono` "Connected · 12 ms p50" | The connection-quality indicator. Operators care about latency. |

**The auto-save contract:** debounce 4–6 seconds, POST silently, update the LiveDot label briefly to "Saved" (1500ms) then back to "Auto-quoting". Don't fire toasts on every save — too noisy in a tool that auto-saves continuously. Reserve toasts for explicit user actions ("Preset saved", "Preset deleted").

**The "View JSON" contract:** opens a `Dialog` with a `CodeBlock` showing the canvas state as pretty-printed JSON. Read-only. Includes a "Copy" button. Operators use this to debug their inputs, share state with teammates, paste into a curl command, or audit what the API will receive. Cheap to ship; load-bearing for trust.

## 5. Anti-patterns

- **Centering everything.** A tool isn't a marketing page. Centering the canvas in a single column (à la Stripe checkout) hides the controls and the output, forcing the operator to scroll. The 3-column shape gives controls + canvas + context simultaneously — the user sees inputs and outputs in one viewport, no scroll needed.
- **Hiding the LiveDot.** The LiveDot is the "yes, auto-saving works" trust signal. Without it, operators don't know whether their inputs are being committed; with it, they trust the surface to hold their state. Always show it. Never hide it behind a tooltip-on-hover. Pulsing-green near the title is the contract.
- **Modal for parameter changes.** Every time a parameter lives in a modal, the operator pays an open/close tax. Parameters live in the RightPanel (or LeftPanel for presets). Tweaking them shouldn't require opening a modal. Modals are for confirmations and one-off tasks (View JSON, Confirm-delete-preset).
- **No JSON / API view.** Operators are technical. They want to see the underlying data. Shipping a tool without a `View JSON` button forces them to open browser devtools and scrape the network tab — hostile. Cheap to ship: `Button.tertiary.sm + Code icon + Dialog + CodeBlock`. Load-bearing for trust + debugging.
- **Single-column on mobile without a clear primary action.** When the 3-column collapses to one column at narrow widths, the panels stack: LeftPanel → CenterCanvas → RightPanel. The primary action ("Get rates") must stay sticky at the bottom of the viewport so the operator can hit it without scrolling back to the canvas's action row. Use `position: sticky; bottom: 0` on a footer band that wraps the primary CTA.
- **Animation between parameter changes.** Operators want immediate feedback. Use `motion.duration.instant` (0ms) for parameter-driven recompute — no slide, no fade, no shimmer between the old result and the new. The result list updates in place. The peak-end rule (`micro-interactions.md`) saves the motion budget for explicit moments (Save success, Book confirmation), not for ambient state changes.
- **Marketing density in the panels.** A tool with 96px section gaps in the LeftPanel is a tool that wastes the operator's pixel budget. Compact density throughout — `space.section.dense` (24px) for section breaks, `size.control.sm` (32px) for buttons, `space.inset.md` (12px) for panel padding.
- **Replacing the LeftPanel preset list with a modal.** "Click to choose a preset → modal opens → pick → close → state updates" is a four-step interaction for what should be one click. The preset list is permanently visible; clicking a row swaps the canvas state immediately. No modal.
- **Save button without keyboard shortcut.** ⌘S → save preset, ⌘↵ → primary action, ⌘/ → focus search, ? → help. Document them in the footer bar. Operators learn keyboard shortcuts when the surface teaches them; a tool without keyboard shortcuts is a tool an operator outgrows.
- **Tinted backgrounds for emphasis.** The best-value result Card uses a Spring Green *border*, not a tinted background. Tinted backgrounds break the single-accent rule (`principles.md` §3) and signal "marketing" not "operator." A hairline-bordered surface with one accent-bordered Card is the operator-tool aesthetic.
- **Hidden RightPanel on first load.** The RightPanel is the output panel. Hiding it until the user clicks "Get rates" is a discovery problem — the operator doesn't know what's coming. Show the panel from the first frame, populate it with a `Skeleton` state, replace with results on submit. The shape stays predictable; the content fills in.
- **No loading state on submit.** When the operator hits "Get rates," the primary CTA must show a spinner + disable. Otherwise: double-submit, two API calls, two billing events. `Button.primary` with `loading={true}` swaps the label to "Getting rates…" and disables the button until the response lands.

## 6. Working reference

`audit-dashboard/src/app/tool/page.tsx` — the canonical implementation. The page is a freight Quote Builder; every recipe in this doc is exercised end-to-end:

- **TitleBar** with brand mark + version Badge + LiveDot + tertiary/secondary/primary action cluster (lines 29–45).
- **3-column grid** at `260px | 1fr | 320px` with `min-h-[680px]` (line 47).
- **LeftPanel** with eyebrow + preset list (active preset uses `bg-surface-tint-accent`) + new-preset button + templates helper band (lines 49–81).
- **CenterCanvas** with three Cards (Lane / Cargo / Accessorials), Field-shell inputs, Switch grid, auto-save LiveDot, action row (lines 84–131).
- **RightPanel** with the best-value Card (accent border) + compact result Cards + ProgressBar + helper line (lines 134–189).
- **Footer keyboard bar** with kbd shortcuts + connection LiveDot (lines 193–201).

Treat this file as the executable spec. When the recipe in this doc and the code in `tool/page.tsx` disagree, the code is the source of truth (and the doc gets a PR to match).

**Cross-references:**

- [`density.md`](../00-foundations/density.md) §5 — the operator density mode.
- [`hierarchy.md`](../00-foundations/hierarchy.md) — the 3-column F-pattern + the best-value-result promotion.
- [`micro-interactions.md`](../00-foundations/micro-interactions.md) §Validation, §Success — when to use motion (explicit submit) vs. when to suppress it (parameter change).
- [`02-components/live-dot/component.md`](../02-components/live-dot/component.md) — the LiveDot contract.
- [`02-components/stat/component.md`](../02-components/stat/component.md) — the big-number Stat used in the best-value result Card.
- [`buttons.md`](../00-foundations/buttons.md) §Intents — the tertiary/secondary/primary hierarchy in the TitleBar action cluster.
- [`principles.md`](../00-foundations/principles.md) §3 — single-accent rule (no tinted-background emphasis).
