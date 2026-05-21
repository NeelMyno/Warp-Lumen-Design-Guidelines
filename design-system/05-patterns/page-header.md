---
title: Page header
type: pattern
version: 0.15.0
status: stable
since: 0.15.0
last_updated: 2026-05-20
applies_to: [web-react, react-native, ios-native, android-native]
related: [empty-state-flow, hierarchy, defensive-classes]
---

# Page header

> Title + optional tagline + one optional primary CTA. The contract enforces "one primary action per view" — when an `EmptyState` below owns the page's primary CTA, the header CTA hides.

## When to use

- Every operator-console page that has a primary content area below the dashboard chrome.
- Marketing surfaces that need a clear hero entry — though `PageHeader` is operator-flavored; landing-page heroes use a different pattern (see `marketing-landing.md`).

## When NOT to use

- Inside a dialog / modal / drawer — use the surface's own title slot.
- For section-level headers within a page — use `<h2>` + `<p>` directly, or the `Section` primitive at `audit-dashboard/src/components/dashboard-shell.tsx`.
- For nested route headers in a multi-pane layout — use the pane's own title.

## Why this pattern exists

The TMS consumer audit (chat 36-A, May 20 2026) surfaced three recurring failure modes in consumer page-header composition:

1. **Competing CTAs.** A page-header CTA AND an empty-state CTA both appeared on first visit (Autopilot, Recurring). Two primary greens for the same task. The user's eye couldn't decide.
2. **Marketing-style multi-line taglines on a daily-use app.** Every page shipped a 2–3-line tagline. Repeat-visit users read it as dead weight on every load.
3. **Inconsistent placement.** Some pages had the CTA top-right, others top-left, others inline-with-title, others below the tagline.

`PageHeader` codifies one canonical shape and bakes the "one primary action per view" + "tagline cap" + "repeat-visit ergonomics" rules into the contract.

## Anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│ Carriers                                          [Add carrier] │  ← lumen-page-header
│ Add carriers, manage rates, and track performance over time.    │  ← lumen-page-header-tagline (≤80ch)
├─────────────────────────────────────────────────────────────────┤  ← hairline divider
│                                                                 │
│                       page content here                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

When the page content is empty AND an `EmptyState` below owns the primary action, the header CTA hides:

```
┌─────────────────────────────────────────────────────────────────┐
│ Carriers                                                        │  ← lumen-page-header data-cta-suppressed="true"
│ Add carriers, manage rates, and track performance over time.    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│              [ icon ]                                           │
│                                                                 │
│              No carriers yet                                    │  ← lumen-empty-state (owns the CTA below)
│              Add your first carrier to start                    │
│              quoting and tracking shipments.                    │
│                                                                 │
│              [ Add carrier ]                                    │  ← single CTA, owned by empty state
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

When the user has visited the page enough times to know what it does (`data-onboarding="false"`), the tagline drops to give returning users their information density back:

```
┌─────────────────────────────────────────────────────────────────┐
│ Carriers                                          [Add carrier] │  ← lumen-page-header data-onboarding="false"
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                       table of carriers                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Canonical implementation

```tsx
type PageHeaderProps = {
  title: string;
  tagline?: string;                            // max 80ch; drops on data-onboarding="false"
  primaryAction?: { label: string; onClick: () => void };  // hides on data-cta-suppressed="true"
  ctaSuppressed?: boolean;                     // true when an EmptyState below owns the action
  isFirstVisit?: boolean;                      // for the data-onboarding signal
};

export function PageHeader({
  title,
  tagline,
  primaryAction,
  ctaSuppressed = false,
  isFirstVisit = true,
}: PageHeaderProps) {
  return (
    <header
      className="lumen-page-header"
      data-cta-suppressed={ctaSuppressed ? "true" : undefined}
      data-onboarding={isFirstVisit ? "true" : "false"}
    >
      <div className="lumen-page-header-content">
        <h1 className="lumen-page-header-title">{title}</h1>
        {tagline && (
          <p className="lumen-page-header-tagline">{tagline}</p>
        )}
      </div>
      {primaryAction && (
        <div className="lumen-page-header-actions">
          <button
            type="button"
            className="lumen-btn lumen-btn-primary lumen-btn-md"
            onClick={primaryAction.onClick}
          >
            {primaryAction.label}
          </button>
        </div>
      )}
    </header>
  );
}
```

## Composition with EmptyState

The canonical pattern for a list page:

```tsx
function CarriersPage() {
  const { data: carriers = [], isLoading } = useCarriers();
  const { isFirstVisit } = useOnboardingState("carriers");
  const isEmpty = !isLoading && carriers.length === 0;

  return (
    <main>
      <PageHeader
        title="Carriers"
        tagline="Add carriers, manage rates, and track performance over time."
        primaryAction={{ label: "Add carrier", onClick: openAddCarrierDrawer }}
        ctaSuppressed={isEmpty}
        isFirstVisit={isFirstVisit}
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

The `ctaSuppressed={isEmpty}` flag is the contract: when the empty state owns the CTA, the header CTA hides. This pattern is enforced by the `[data-cta-suppressed="true"] .lumen-page-header-actions { display: none }` rule in `globals.css`.

## Tagline copy rules

The tagline is short — max 80 chars — and:
- Names what the page IS (a noun-led "the bank-account spine for your freight" pattern), not what the user should DO (the CTA carries the verb).
- Avoids marketing voice ("Power your operations with…").
- Avoids redundant restatement of the page title.
- Drops entirely for repeat-visit users via `data-onboarding="false"`.

For a daily-use operator console, the tagline is **first-visit-only signal**. After onboarding it adds noise. The default in this primitive is `isFirstVisit = true`; consumer apps wire it to their own onboarding-state mechanism.

## Accessibility

- Root is `<header>` — the implicit landmark role.
- Title is `<h1>` — one per page; if the page already has an `<h1>` elsewhere (e.g., in a hero card), demote `PageHeader` to `<h2>` via a `level` prop (out of scope for this initial contract — open for v0.16).
- The primary action is a real `<button>` with a verb-led label per `voice-and-tone.md` § Buttons.

## Anti-patterns

| Don't | Why |
|---|---|
| Two top-right CTAs side-by-side | Two primary actions = no primary action. Move secondary to a `…` overflow menu or a subordinate context (Right pane / Drawer). |
| Page-header CTA + empty-state CTA both visible | Competing greens for the same task. `data-cta-suppressed="true"` is the fix. |
| Tagline >80 characters | The tagline is a scan-line, not a paragraph. If detail is needed, move it to an info-tooltip on the title or to a doc link below the table. |
| Tagline on every page-load forever | Repeat-visit users read it as noise. `data-onboarding="false"` retires it after the first session per page. |
| Inline `bg-[var(--color-accent-500)] text-[var(--color-text-on-accent,white)]` on the CTA | The TMS bug class — `.lumen-btn-primary` is the defensive equivalent. See `defensive-classes.md`. |

## Related

- [empty-state-flow.md](./empty-state-flow.md) — the empty-state pattern (which receives the CTA when `PageHeader` suppresses)
- [hierarchy.md](../00-foundations/hierarchy.md) — one primary action per view, the three-tier hierarchy rule
- [defensive-classes.md](../00-foundations/defensive-classes.md) — `.lumen-page-header` + `.lumen-btn-primary` + `.lumen-empty-state` enumerated
- [voice-and-tone.md](../00-foundations/voice-and-tone.md) — button-label voice (verb-led, specific, not generic)
- [ui-writing-style.md](../04-content/ui-writing-style.md) — tagline copy rules
