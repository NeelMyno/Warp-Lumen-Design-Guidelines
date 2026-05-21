---
name: EmptyState
type: component
status: stable
version: 0.15.0
since: 0.1.0
deprecated: false
platforms: [web-react, react-native, ios-native, android-native]
a11y_level: WCAG-2.2-AA
related: [Card, Button, PageHeader]
spec: ./component.json
last_updated: 2026-05-20
---

# EmptyState

> A composed message that appears when a collection has no items yet. Type-led, never illustration-led. One headline, one supporting line, one primary action. When this owns the page's primary CTA, the PageHeader CTA hides.

## When to use

- A list / table / dashboard with zero items ("No active shipments yet").
- A search result with zero matches ("No carriers match 'reefer'").
- A first-run onboarding moment ("There are no quotes here. Quote a lane.").
- A filter combination that has no matches ("No invoices marked 'overdue' in the selected range").

## When NOT to use

- **An error state** — use `Banner status="danger"` or `ErrorBoundary`. EmptyState is for valid-but-empty data, not for "we couldn't load it."
- **A loading state** — use `Skeleton` or `Spinner`. EmptyState is for "we successfully loaded zero things," not "we don't know yet."
- **A page that should NEVER be empty** — a system bug requires a fix, not a polished empty state.
- **A modal / dialog** — the modal's own content area handles its empty case; don't nest EmptyState inside.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                       [ icon ]                              │  ← 40×40 framed slot, optional
│                                                             │
│                  No active shipments yet                    │  ← .lumen-empty-state-headline
│              Quote a lane to see it appear here.            │  ← .lumen-empty-state-supporting (max 60ch)
│                                                             │
│                      [ Quote a lane ]                       │  ← .lumen-empty-state-actions (one primary)
│                                                             │
└─────────────────────────────────────────────────────────────┘
  dashed border (default tone), 240px min-height
```

Variants:
- `tone="subtle"` swaps the dashed border for a solid hairline (use inside a Card that's already framed).
- `align="start"` left-aligns content (use in a side-pane / sidebar empty state).
- `compact={true}` removes the icon + reduces padding (use inline within a row / cell).

## Why this primitive exists

The TMS consumer audit (chat 36-A, May 20 2026) caught five different empty-state visuals shipped across one operator console: Cost / Orders / Autopilot / Recurring / Accounting each invented their own — ranging from "dim single-line paragraph in a Surface card" to "dashed-border card with title + 3-line body + orphan CTA." Visual drift hurt trust more than the missing data did.

USING-LUMEN.md cataloged 98 components but Lumen v0.14 shipped EmptyState as a 56-line prose contract with NO defensive-class implementation. Authors fell back to hand-rolled empty states. v0.15 R16 closes this:
- `.lumen-empty-state` defensive class in `globals.css` (the consumer-friendly composition).
- Full contract beefed up below (the primitive-friendly composition).
- Wired into the `PageHeader` "one primary action per view" contract via `data-cta-suppressed`.

## Contract

```ts
type EmptyStateProps = {
  /** Optional 24×24 lucide icon. Renders inside a 40×40 framed circle. Aria-hidden. */
  icon?: ReactNode;

  /** REQUIRED. Single-line headline. Max 40 chars; longer text wraps but loses scannability.
   *  Voice: "No X yet" / "No X match Y" / "Quote a lane to see X" — never "Oops" / "Uh-oh." */
  headline: string;

  /** Optional supporting line. Max 60ch (line will wrap inside the constraint). Two lines max.
   *  Voice: explain WHY it's empty + how to fix it. */
  supporting?: string;

  /** Optional one primary action. The label must lead with a verb (Quote, Add, Import, Create).
   *  When set, the page's PageHeader CTA should also set data-cta-suppressed="true" to honor
   *  the "one primary action per view" rule. */
  primaryAction?: { label: string; onClick: () => void } | { label: string; href: string };

  /** Optional tertiary text link. Subordinate to the primary action. Avoid two equal-weight actions. */
  tertiaryLink?: { label: string; href: string };

  /** "default" = dashed border (free-standing on a page); "subtle" = solid hairline (inside a Card). */
  tone?: "default" | "subtle";

  /** "center" = center-aligned (canonical); "start" = left-aligned (use in side-panes). */
  align?: "center" | "start";

  /** "false" = standard padding (default); "true" = compact padding for inline-row use. */
  compact?: boolean;
};
```

## States

| State | Behavior |
|---|---|
| Default | Renders as described in §Anatomy. |
| With icon | The framed 40×40 icon slot sits above the headline. |
| Without icon | The slot is omitted; the headline becomes the visual anchor. |
| With primary action | The action sits below the supporting line, in a dedicated `.lumen-empty-state-actions` flex row. |
| Without primary action | The empty state is descriptive-only — the action lives in the PageHeader above. |
| `tone="subtle"` | Border swaps to a solid hairline (no dashed pattern). |
| `align="start"` | Content left-aligns; padding stays the same. |
| `compact={true}` | Icon slot is suppressed; padding shrinks to fit a single row. |

## Accessibility

- Wraps in `<div role="region">` with `aria-labelledby` pointing to the headline element's `id`.
- The icon is decorative — `aria-hidden="true"`.
- The primary action's label carries the meaning ("Quote a lane", not "Click here").
- WCAG: 1.3.1 Info and Relationships (region landmark); 2.4.6 Headings and Labels (descriptive headline); 4.1.2 Name, Role, Value (button label).

## The "one primary action per view" contract

When `EmptyState` carries a `primaryAction`, the page's `PageHeader` should set `data-cta-suppressed="true"` so the header CTA hides. Two competing greens for the same task is the failure mode (TMS consumer chat 36-A item #9). Wire at the consumer level:

```tsx
function CarriersPage() {
  const { data: carriers = [], isLoading } = useCarriers();
  const isEmpty = !isLoading && carriers.length === 0;

  return (
    <main>
      <PageHeader
        title="Carriers"
        tagline="Add carriers, manage rates, and track performance over time."
        primaryAction={{ label: "Add carrier", onClick: openAddCarrierDrawer }}
        ctaSuppressed={isEmpty}
      />

      {isEmpty ? (
        <EmptyState
          icon={<TruckIcon />}
          headline="No carriers yet"
          supporting="Add your first carrier to start quoting and tracking shipments."
          primaryAction={{ label: "Add carrier", onClick: openAddCarrierDrawer }}
        />
      ) : (
        <CarriersTable carriers={carriers} />
      )}
    </main>
  );
}
```

See [`design-system/05-patterns/page-header.md`](../../05-patterns/page-header.md) for the full pattern.

## Defensive-class shorthand

For consumer apps that don't want to import the full primitive, the `.lumen-empty-state` defensive class composes the same visual without the React/TypeScript dependency:

```html
<div class="lumen-empty-state" role="region" aria-labelledby="empty-headline">
  <span aria-hidden class="lumen-empty-state-icon">
    <!-- 24×24 lucide icon -->
  </span>
  <h2 id="empty-headline" class="lumen-empty-state-headline">No active shipments yet</h2>
  <p class="lumen-empty-state-supporting">
    Quote a lane to see it appear here.
  </p>
  <div class="lumen-empty-state-actions">
    <button class="lumen-btn lumen-btn-primary lumen-btn-md">Quote a lane</button>
  </div>
</div>
```

See [`design-system/00-foundations/defensive-classes.md`](../../00-foundations/defensive-classes.md) for the full family.

## Do

- Two lines max — headline + one supporting line.
- Lead the action with a verb. "Quote a lane" > "Get started".
- Use the same icon language as the rest of the system — 1.5px stroke, 24px lucide grid.
- Honor the "one primary action per view" rule — when this owns the CTA, the PageHeader CTA hides.
- Use `tone="subtle"` when nested inside a Card that's already framed.

## Don't

- Don't illustrate the empty state — no character "looking sad," no smiley-face SVG.
- Don't say "Oops" or "Uh-oh." (See [microcopy.md "Banned phrases"](../../04-content/microcopy.md#banned-phrases).)
- Don't put two actions of equal weight. One primary + optional tertiary link.
- Don't use EmptyState for an error state — that's `Banner status="danger"` / `ErrorBoundary`.
- Don't use EmptyState for a loading state — that's `Skeleton` / `Spinner`.
- Don't reach for inline Tailwind arbitrary classes on the CTA button. Use `.lumen-btn-primary`.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.15.0** — Contract beefed up from prose-only to full spec (props / states / a11y / "one primary action per view" / defensive-class shorthand). Added `tone`, `align`, `compact`, `tertiaryLink` props. Aligned with `.lumen-empty-state` defensive class in `globals.css`. Tied to PageHeader's `data-cta-suppressed` contract.
- **0.1.0** — Initial release.
