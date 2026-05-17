---
name: Web (Next.js + React + Tailwind v4)
type: platform-guide
platform: web
runtime: Next.js 16+ · React 19+ · Tailwind v4 · shadcn registry `@lumen/*`
lumen_version: 0.13.0
last_updated: 2026-05-17
status: stable
related: [./responsive.md, ./extension.md, ./shopify.md]
mcp_install: "npx shadcn add @lumen/lumen-base"
---

# Web — Lumen v0.13 platform guide

> The reference platform. Phase 2 shipped the `@lumen/*` shadcn registry — 48 v0.13 components + 4 foundation registries + 69 legacy v0.12.6 sidecars = 121 items at [`registry.json`](../../registry.json). Web is where Lumen's contract is canonical; every other platform translates from this surface.

## 1. What this platform is

Web is **everything that runs in Chromium / WebKit / Gecko** — the audit dashboard, the customer-facing tracking page, the Shopify embedded admin app's content area, the storefront tracking iframe, the Electron desktop renderer, the carrier-portal browser extension content scripts. ~80% of Warp's product surface area lives here.

Specific Warp products on web:
- **Operator SaaS dashboard** — the dispatcher, broker, ops manager daily-driver.
- **Customer-facing tracking page** — public, embed-friendly.
- **Audit dashboard / library / foundations** — Lumen's own canonical reference site at [`warp-lumen-design-guidelines.vercel.app`](https://warp-lumen-design-guidelines.vercel.app).
- **Quote builder** (lane → rate flow) — landing → form → result.
- **Marketing site** — the Warp.dev homepage and product pages. Expressive mode.
- **AI surfaces** — the chat-with-your-shipments embed, Conversation / Reasoning / Tool primitives (Phase 5).

## 2. Token mapping table

Web is the reference — tokens map 1:1 to CSS variables. Generated output: [`dist/css/lumen.css`](../../dist/css/lumen.css), [`dist/css/lumen.dark.css`](../../dist/css/lumen.dark.css), [`dist/css/lumen.expressive.css`](../../dist/css/lumen.expressive.css), [`dist/tailwind/lumen.preset.ts`](../../dist/tailwind/lumen.preset.ts), [`dist/tailwind/lumen.css`](../../dist/tailwind/lumen.css).

### Consumption

There are three install paths, in order of recommendation:

**1. Single-payload via the shadcn `registry:base` (Phase 2 deliverable, easiest):**

```bash
npx shadcn@latest add @lumen/lumen-base
```

Installs everything — tokens CSS, Satoshi font, ModeScope primitive, cn() utility, Tailwind preset — in one command. The killer-feature distribution.

**2. Per-component:**

```bash
npx shadcn@latest add @lumen/button
npx shadcn@latest add @lumen/data-table
npx shadcn@latest add @lumen/shipment-timeline
```

Each component's `registryDependencies` resolves into transitive installs (a Button install pulls `@lumen/utils`, `@lumen/tokens`).

**3. Tokens-only:**

```bash
npx shadcn@latest add @lumen/tokens
```

When the consumer wants the visual contract but is bringing their own component library.

### Variable surface

Every Lumen token surfaces as a CSS variable on `:root` (in restrained mode) and on `[data-mode="expressive"]` (in expressive mode):

| Category | Examples |
|---|---|
| Color — surface | `--surface-canvas`, `--surface-raised`, `--surface-sunken`, `--surface-popover`, `--surface-glass`, `--surface-tint-accent` |
| Color — text | `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-accent`, `--text-placeholder` |
| Color — border | `--border-hairline`, `--border-default`, `--border-strong`, `--border-frame`, `--border-accent`, `--border-focus`, `--border-error` |
| Color — action | `--color-action-primary-bg-rest`, `--color-action-primary-fg`, `--color-action-danger-bg-rest`, `--color-action-ai-bg-rest`, `--color-action-glass-bg-rest` |
| Spacing | `--space-1` through `--space-16`, plus exceptions `--space-1_5`, `--size-control-cozy` |
| Radius | `--radius-xs`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-2xl`, `--radius-3xl`, `--radius-4xl`, `--radius-full` |
| Elevation | `--shadow-sm`, `--shadow-md`, `--shadow-popover`, `--shadow-modal`, `--shadow-focus`, `--shadow-glow-accent`, `--shadow-input-focus` |
| Motion | `--motion-duration-instant/micro/fast/base/slow/slower`, `--motion-easing-decelerate/accelerate/emphasized/bounce/material-standard/linear` |
| Typography | `--type-11` through `--type-49`, `--font-sans`, `--leading-tight/normal/loose`, `--tracking-tight/normal/loose` |
| Glass | `--glass-blur`, `--glass-saturate`, `--surface-glass-fallback` (expressive layer) |
| Mesh / noise / gradient | Expressive layer only — `--mesh-aurora-spring`, etc. |

### Tailwind v4 integration

```ts
// tailwind.config.ts
import { lumenPreset } from "@lumen/tokens/tailwind";

export default {
    presets: [lumenPreset],
    content: ["./src/**/*.{ts,tsx}"],
};
```

The preset maps every CSS variable to a Tailwind utility class:

```html
<div class="bg-[var(--surface-raised)] text-[color:var(--text-primary)] rounded-[var(--radius-md)]">
    <!-- equivalent to: bg-surface-raised text-text-primary rounded-md -->
</div>
```

Hard rule 9 — don't use the `bg-primary` / `text-primary-foreground` token-bridge utilities; they get dropped by Tailwind v4's content scanner intermittently. Use direct CSS variable references or the `.lumen-*` class family from `dist/css/lumen.css`.

## 3. Identity budget

**Lumen claim: 100% of the rendering surface.** The browser owns address bar, tab strip, system back, OS keyboard chrome. The 100% is everything inside the document body.

Inside an iframe embed (e.g., the storefront tracking page embedded on a merchant's site), Lumen claims 100% of the iframe content. The parent page lives outside Lumen's surface.

## 4. Glass / blur translation

`backdrop-filter` works in every modern browser. Phase 1's lumen-scoping.css handles the `@supports not (backdrop-filter)` fallback and the `@media (prefers-reduced-transparency: reduce)` fallback. Hard rule 16 — glass only on floating shells (popover, sheet, command palette, hero device frame, nav). Never on dense data surfaces.

Surface variants:

| Lumen role | CSS |
|---|---|
| `surface.popover` | `background: var(--surface-popover); backdrop-filter: blur(15px) saturate(140%)` |
| `surface.glass` (default) | `background: var(--surface-glass); backdrop-filter: blur(20px) saturate(140%)` |
| `surface.glass-strong` | `background: var(--surface-glass-strong); backdrop-filter: blur(28px) saturate(160%)` |

All three include the `-webkit-backdrop-filter` prefix per AGENTS.md hard rule.

## 5. Motion translation

The reference. Phase 0 motion tokens emit as CSS:

```css
:root {
    --motion-duration-instant: 0ms;
    --motion-duration-micro: 80ms;
    --motion-duration-fast: 140ms;
    --motion-duration-base: 200ms;
    --motion-duration-slow: 320ms;
    --motion-duration-slower: 480ms;

    --motion-easing-decelerate: cubic-bezier(0.2, 0, 0, 1);
    --motion-easing-accelerate: cubic-bezier(0.4, 0, 1, 1);
    --motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);
    --motion-easing-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
    --motion-easing-material-standard: cubic-bezier(0.4, 0, 0.2, 1);
    --motion-easing-linear: linear;
}
```

Springs in CSS aren't first-class; they fall back to `--motion-easing-decelerate`. JS consumers (Framer Motion, React-Spring) read the spring tokens directly from the JSON dump at [`dist/json/tokens.json`](../../dist/json/tokens.json):

```ts
import { motion } from "framer-motion";

const lumenSpring = { type: "spring", stiffness: 280, damping: 28, mass: 1 };

<motion.div animate={{ x: 100 }} transition={lumenSpring} />
```

Reduce-motion: Phase 1 lumen-scoping.css declares `@media (prefers-reduced-motion: reduce)` blocks that nullify the LiveDot pulse, RateTicker marquee, and aurora-fade. All component animations honor it.

## 6. Typography translation

Satoshi loads via `@font-face` in [`dist/css/lumen.css`](../../dist/css/lumen.css). The self-hosted woff2 lives in `audit-dashboard/src/fonts/` (private repo per ITF-FFL); consumers install via `@lumen/font-satoshi` (registry:lib).

OpenType features ship as utility classes:

```css
.lumen-mono { font-feature-settings: 'tnum' 1, 'lnum' 1, 'zero' 1, 'calt' 0; }
.lumen-label { font-feature-settings: 'tnum' 1; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }
```

CLS guard: `Satoshi-Fallback` metric-aligned face is declared via `@font-face` with `size-adjust: 121%` so the swap-in is invisible. See [`audit-dashboard/src/app/globals.css`](../../audit-dashboard/src/app/globals.css) — that block becomes part of the consumer's `@lumen/tokens` install.

## 7. Specific don'ts (Web Lumen Law)

- **Don't use the `bg-primary` / `text-primary-foreground` token-bridge utilities.** Hard rule 9 — Tailwind v4 content scanner drops them. Use direct CSS variable references or `.lumen-*` classes.
- **Don't apply `backdrop-filter` to `<tr>`, `<td>`, `<table>`, `<canvas>`, or any dense data surface.** Hard rule 16.
- **Don't render floating popovers as inline `<div absolute>`.** Hard rule 10 — portal to `document.body` via `createPortal` + `position: fixed` + `getBoundingClientRect()` re-tracked on scroll.
- **Don't use `outline: none` without replacing it with `box-shadow: var(--shadow-focus)`.** Hard rule 11 — focus visibility is non-negotiable; the dual-ring contract is `outline` + `box-shadow`.
- **Don't write Tailwind arbitrary translate utilities for position math.** Hard rule 12 — Tailwind v4's scanner drops `translate-x-[Npx]` arbitraries on toggle thumbs / swipe rows. Use inline `style.left` + native CSS transition.
- **Don't hardcode `'v0.13.0'` as a string literal.** Hard rule 13 — import from [`audit-dashboard/src/lib/version.ts`](../../audit-dashboard/src/lib/version.ts).
- **Don't ship Lumen icons via `<i class="lumen-icon">` font-icon patterns.** Use lucide-react React components or bundled SVG `<svg>` inlines. SVG is the only canonical icon format.
- **Don't paint Spring Green on non-action chrome.** Hard rule 7 — accent is action / live / success only.

## 8. Reference snippets

The canonical Phase 2 component graph is the reference. Every component under [`design-system/02-components/<name>/<name>.tsx`](../../design-system/02-components/) is a fully token-driven implementation. Examples:

### Primary button

See [`02-components/button/button.tsx`](../../design-system/02-components/button/button.tsx). Composed from Radix Slot + class-variance-authority + the `.lumen-btn-*` class family from `@lumen/tokens`.

```tsx
import { Button } from "@lumen/button";

<Button intent="primary" size="md">Book shipment</Button>
```

### Stat

See [`02-components/stat/stat.tsx`](../../design-system/02-components/stat/stat.tsx). Tier 3 Lumen signature; preserved v0.12.4 behavior verbatim.

```tsx
import { Stat } from "@lumen/stat";

<Stat value="98.2%" label="ON-TIME DELIVERY" polarity="good-up" />
```

### Glass popover

See [`02-components/popover/popover.tsx`](../../design-system/02-components/popover/popover.tsx). Built on Radix Popover, portaled per hard rule 10.

```tsx
import { Popover, PopoverTrigger, PopoverContent } from "@lumen/popover";

<Popover>
    <PopoverTrigger asChild>
        <Button intent="ghost">Open</Button>
    </PopoverTrigger>
    <PopoverContent className="lumen-glass-strong">
        {/* glass content */}
    </PopoverContent>
</Popover>
```

The reference web app is [`audit-dashboard/`](../../audit-dashboard/) — Next.js 16+ + Tailwind v4 + the full Phase 2 component graph exercised across seven surface routes (library / saas / landing / tool / commerce / mobile / desktop).

## Related

- [`./responsive.md`](./responsive.md) — viewport adaptation rules.
- [`./extension.md`](./extension.md) — same web runtime, shadow-DOM scoping.
- [`./shopify.md`](./shopify.md) — same web runtime, Polaris constraints.
- [`./windows.md`](./windows.md) — Electron renderer uses this same web bundle.
- [`../02-components/`](../02-components/) — the Phase 2 component graph.
- [`../../dist/`](../../dist/) — built artifacts every consumer installs.
