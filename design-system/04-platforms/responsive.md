---
name: Responsive web (container queries + breakpoints)
type: platform-guide
platform: responsive
runtime: Container queries · Tailwind v4 · same Phase 2 component graph
lumen_version: 0.13.0
last_updated: 2026-05-17
status: stable
related: [./web.md, ./ios.md, ../00-foundations/modes.md]
---

# Responsive web — Lumen v0.13 platform guide

> Same Phase 2 React components, different viewport rules. Container queries on every Lumen layout primitive. Five named breakpoints. Component-level adaptation (DataTable collapses to card list, Sidebar collapses to drawer, CommandPalette stays full-screen on phone). Nothing about the token graph changes — the visual contract holds across viewports.

## 1. What this platform is

Responsive web is **mobile-web access to the same Warp products that run as native iOS / Android apps** — but without the install step. Use cases:

- **A dispatcher on a phone** who got a tracking link in a text and needs the shipment status in 5 seconds. Mobile-web tracking page, no app install.
- **A carrier sales rep on their tablet** doing field sales calls. Tablet-optimized Lumen surfaces — same product, different viewport.
- **An ops manager on a dashboard wallboard** — 32" 4K screen mounted on the cross-dock wall, full Lumen UI scaled up.
- **A driver on a low-end Android web browser** when the Driver app fails to install (cheap Android device, restricted enterprise policy).
- **Embedded iframes** on partner sites, where the host viewport varies wildly.

## 2. Token mapping table

All Lumen tokens carry verbatim — this is web. The translation here is **layout adaptation rules**, not new tokens. The breakpoint set:

| Name | Token | Min width | Use case |
|---|---|---|---|
| Phone | `--breakpoint-phone` | 0px | Driver glances, customer tracking. Single-column. |
| Tablet | `--breakpoint-tablet` | 640px | Carrier rep at a desk, tablet sales aide. Two-column or simplified two-column. |
| Laptop | `--breakpoint-laptop` | 1024px | Dispatcher laptop, broker daily-driver. Three-column dashboard. |
| Desktop | `--breakpoint-desktop` | 1440px | Power-user multi-monitor. Side panels expand, density up. |
| Wide | `--breakpoint-wide` | 1920px | Wallboard / 4K dashboard. Cross-dock command center. Scale chrome up; density stays. |

### Container query primitives

Lumen's layout primitives expose container queries so child components adapt to **their container's width**, not the viewport. This is critical when a Lumen card lives inside a 320px Shopify sidebar AND inside a 1024px tool view — the card adapts to its actual container, not the assumed viewport.

```css
.lumen-card {
    container-type: inline-size;
    container-name: lumen-card;
}

@container lumen-card (min-width: 320px) {
    .lumen-card__title { font-size: var(--type-18); }
}

@container lumen-card (min-width: 480px) {
    .lumen-card__title { font-size: var(--type-22); }
}
```

Component-level container queries are the **preferred** mechanism. Viewport media queries are the fallback when a component needs to know the viewport (e.g., the Sidebar collapsing to a Drawer is a viewport-level decision, not a container-level one).

## 3. Identity budget

**Lumen claim: 100% of the rendering surface** — same as native web. The browser owns address bar, system back button, OS keyboard chrome, scroll indicators. The 100% is the document content area.

On phone viewports specifically, the browser chrome (URL bar, navigation arrows, share button) claims ~10% of the screen on first paint, then collapses on scroll. Lumen's safe-area handling honors `env(safe-area-inset-*)` so content doesn't slide under browser chrome:

```css
.lumen-app-shell {
    padding-top: max(var(--space-4), env(safe-area-inset-top));
    padding-bottom: max(var(--space-4), env(safe-area-inset-bottom));
    padding-left: max(var(--space-4), env(safe-area-inset-left));
    padding-right: max(var(--space-4), env(safe-area-inset-right));
}
```

## 4. Glass / blur translation

Same as web. `backdrop-filter` works on every modern mobile browser (Safari iOS 9+, Chrome Android 76+, Firefox Android 103+). The Phase 1 lumen-scoping.css carries:
- `@supports not (backdrop-filter)` fallback (rare in 2026)
- `@media (prefers-reduced-transparency: reduce)` fallback (honors the user's OS preference, which mobile Safari and Chrome relay)

### Mobile-web-specific caveat

On phone viewports, glass surfaces over a busy scrolling backdrop create perceived chrome heaviness on cheap devices. Lumen scopes glass to **above the fold, max two surfaces at a time** on phone viewports — typically the top-nav and one floating popover. Inside a dense scrolling list (shipment timeline cards), all rows are solid `surface.raised`.

## 5. Motion translation

Same as web. The Phase 0 motion ladder is viewport-agnostic.

### Phone-viewport considerations

- **Reduced animation on cheap hardware:** when the device is low-end (detected via `navigator.deviceMemory < 4` or `navigator.hardwareConcurrency < 4`), drop secondary animations (sparkline draw-in, hero atmosphere drift). Keep primary state transitions (page navigation, popover open).
- **Touch-and-hold gesture handling:** the RateTicker pauses on long-press (touch) instead of mouseover. Standard CSS `:active` doesn't fire for long-press; use a JS gesture handler.
- **Pull-to-refresh integration:** when a Lumen surface contains a scrollable region, hook into the platform pull-to-refresh signal (Safari iOS exposes `Document.scrollTop < 0` + touchmove). Surface the Lumen spinner during the pull.

## 6. Typography translation

Same as web. Satoshi loads via `@font-face`. The interesting question is **sizing on small viewports.**

### Type scale at phone breakpoint

Lumen's body-md (14px) reads comfortably on phones at 100% browser zoom. The 11px `.lumen-label` cap reads at the visibility threshold — that's intentional (operator-density). But for **consumer-facing** mobile surfaces (the customer tracking page on phones), bump labels to 12px to clear the consumer-readability bar:

```css
:root {
    --type-11-consumer: 12px;  /* Tracking page, public surfaces */
}

@media (max-width: 640px) {
    .lumen-consumer-label {
        font-size: var(--type-11-consumer);
    }
}
```

Operator surfaces (Driver app web, Dispatcher web) keep the 11px label — operators expect density.

### Dynamic text scale

Mobile Safari and Chrome Mobile honor the user's OS-level text scale via `font-size: 100%` on `:root`. Lumen body sizes scale with it. The `.lumen-mono` and `.lumen-label` styles use relative `em`-based tracking so they scale consistently.

## 7. Specific don'ts (Responsive Lumen Law)

- **Don't ship fixed-width breakpoints in a Lumen component.** Components use container queries. Viewport media queries live at the layout / page level only.
- **Don't ship a different visual contract per breakpoint.** Same tokens, same visual language, density adapts. A button looks like a Lumen button at 320px and at 1920px — different label-length perhaps, but same intent surface.
- **Don't hide critical actions on phone viewports.** Operators on the field need every action available. Use overflow menus, swipe gestures, full-screen modals — but never `display: none` a primary CTA.
- **Don't force `prefers-color-scheme: light` overrides per breakpoint.** Lumen is dark-canvas default at every viewport. The user's OS preference is honored uniformly.
- **Don't ship `touch-action: pan-y` blanket on dashboards.** Native scrolling and Lumen-internal pan gestures (swipe-to-archive on a row) need to coexist. Scope `touch-action` per-element.
- **Don't ship the LiveDot pulse on the customer-facing tracking page on phones at < 50% battery.** Use the Battery Status API (where available) and pause non-essential motion to extend the user's session.
- **Don't bind to viewport units (`100vw`, `100vh`) in components.** Use container query units (`100cqi`, `100cqb`) so the component is portable across surface contexts (modal vs sheet vs sidebar embed).

## 8. Reference snippets

### DataTable → card-list collapse below laptop breakpoint

```tsx
"use client";
import { DataTable, CardList } from "@lumen/...";

export default function ShipmentList({ rows }) {
    return (
        <>
            <div className="hidden lg:block">  {/* lg = 1024px */}
                <DataTable rows={rows} />
            </div>
            <div className="block lg:hidden">
                <CardList rows={rows} />
            </div>
        </>
    );
}
```

The Phase 2 DataTable component honors a `compactMode` prop that auto-flips behavior; the snippet above is the explicit-control pattern for surfaces that want the swap at a different breakpoint.

### Sidebar → Drawer collapse below laptop breakpoint

```tsx
import { useViewport } from "@lumen/hooks";
import { Sidebar, Drawer } from "@lumen/...";

export default function AppShell({ children }) {
    const isLaptop = useViewport({ min: "laptop" });  // ≥ 1024px

    return isLaptop ? (
        <div className="flex">
            <Sidebar>
                <NavItems />
            </Sidebar>
            <main className="flex-1">{children}</main>
        </div>
    ) : (
        <div>
            <Drawer trigger={<MenuButton />}>
                <NavItems />
            </Drawer>
            <main>{children}</main>
        </div>
    );
}
```

### Container-query-driven card

```tsx
import { Card, Stat } from "@lumen/...";

export default function MetricCard({ value, label }) {
    return (
        <Card className="@container">
            <div className="@xs:text-base @md:text-2xl @lg:text-4xl">
                <Stat value={value} label={label} />
            </div>
        </Card>
    );
}
```

The Tailwind v4 `@container` syntax (with named containers in `@theme`) maps to Lumen's container query primitives.

### Safe-area-aware app shell

```tsx
export default function LumenAppShell({ children }) {
    return (
        <div
            className="min-h-dvh bg-[var(--surface-canvas)]"
            style={{
                paddingTop: 'max(var(--space-4), env(safe-area-inset-top))',
                paddingBottom: 'max(var(--space-4), env(safe-area-inset-bottom))',
                paddingLeft: 'max(var(--space-4), env(safe-area-inset-left))',
                paddingRight: 'max(var(--space-4), env(safe-area-inset-right))',
            }}
        >
            {children}
        </div>
    );
}
```

`min-h-dvh` (dynamic viewport height, Tailwind v4 utility) handles the iOS Safari URL-bar-collapse case.

**No separate reference app ships for responsive** — the Phase 2 Storybook stories cover viewport variation via the Storybook viewport addon. The audit-dashboard at `audit-dashboard/` exercises every responsive collapse pattern across `/saas`, `/landing`, `/tool`, `/commerce`, `/mobile`, `/desktop` surface routes.

## Related

- [`./web.md`](./web.md) — the base web platform; responsive lives on top.
- [`./ios.md`](./ios.md) — native iOS is the alternative when the user installs.
- [`../00-foundations/modes.md`](../00-foundations/modes.md) — mode scope works at every breakpoint.
