# empty-state-flow — full-page empty states

> Distinct from inline empty states (`04-content/empty-states.md` — message catalog) and the EmptyState component (`02-components/empty-state/`). This pattern is the **full-page** empty state — when an entire route loads with nothing to show. Examples: an empty inbox, a brand-new dashboard before first data, a search with zero results, a freshly invited collaborator before any shared docs.

## 1. The shape

```
EmptyStateFlow (full route, centered vertically, marketing-on-canvas)
  ├── (Optional) Hero glyph (custom SVG; ≤ 96 px tall; on brand)
  │     · NOT a stock illustration — Lumen uses simple geometric shapes
  │     · spring-green accent ONLY where the geometry has an "action point"
  │
  ├── Heading h2 — past tense or future tense
  │     ("No bookings yet" / "Start your first booking")
  │
  ├── Supporting body.md (text-secondary, max-w-[48ch])
  │     · 1–2 sentences
  │     · Explains the state OR primes the next action
  │     · Never apologizes — empty is a starting line, not a failure
  │
  ├── Primary CTA (Button.primary.lg)
  │     ("Create your first booking" / "Invite a collaborator")
  │
  ├── (Optional) Secondary action — text link
  │     ("Browse templates" / "See an example")
  │
  └── (Optional) Footer help
        · Eyebrow caption pointing to docs / help / sample data
        · text-tertiary, body.sm
```

**Variants — same shell, different intent:**

- **First-run empty** (zero data, ever). Heading is future-tense action ("Start your first booking"). Strong primary CTA. Secondary action is the "see an example" / "load sample data" affordance.
- **Filtered empty** (data exists but the current filter returns 0 results). Heading is "No matches" / "Nothing matches these filters". Primary CTA is "Clear filters" (not "Create new" — the user is searching, not creating). Secondary action: adjust filters.
- **Permission empty** (data exists but the current user has no access). Heading is "Nothing shared with you yet" / "Waiting for an invitation". Primary CTA: "Request access" or "View my account". This is a soft-permission state — distinct from the 403/forbidden error which is full-page error pattern.
- **Time-based empty** (recurring report, no data for the current window). Heading "Nothing this week" / "No activity for this period". Primary CTA: change date range. Often combined with KeyValue showing previous-window's data for context.
- **Search empty** (user typed a query, no results). Heading "We didn't find anything for 'X'". Primary CTA "Clear search". Secondary: "Search all", "Try a synonym". Often shows suggestions.

## 2. Density mode

**Cozy + marketing-breathing.** The page should NOT feel like the user broke something. It's an invitation. Generous vertical centering, calm canvas, the CTA carries the entire visual weight.

| Region | Density | Rationale |
|---|---|---|
| Outer layout | Marketing (96 px top breathing) | Calm canvas, intentional |
| Inner card / content | Cozy | Tight vertical rhythm so the eye flows from heading → CTA |
| Heading → Supporting gap | `space.element.md` (12 px) | Tight pairing |
| Supporting → Primary CTA gap | `space.element.lg` (24 px) | Visual pause before action |

## 3. Tokens for wrappers

| Slot | Token |
|---|---|
| EmptyStateFlow outer padding | `space.page.marketing` (96 px) top, `space.section.marketing` (48 px) bottom |
| Card max-width | `60ch` for reading width |
| CTA size | Cozy-lg (48 px) |
| Hero glyph color | `color.text.tertiary` for the background geometry; `color.text.accent` for the action point |

## 4. Component recipe

| Slot | Component | Variants |
|---|---|---|
| Hero glyph | (Custom inline SVG) | 96 × 96 max; ONE accent stroke; rest in `--text-tertiary` |
| Heading | `h2.text-display-sm` | bold, primary text, balanced text-wrap |
| Supporting | `p.text-body-md.text-secondary` | max-w-[48ch] |
| Primary CTA | `<Button intent="primary" size="lg">` | Action-led, verb-led label |
| Secondary action | `<Link>` | text-accent on hover |
| Eyebrow help | `.lumen-eyebrow` | `text-tertiary`, all-caps mono |

## 5. Anti-patterns

- **Apologetic empty.** "Sorry, no data!" — never. Empty is not a failure; it's a starting condition. Heading uses neutral or future-tense voice.
- **Stock illustrations from undraw.co / Storyset.** Lumen brand is operator-direct, not whimsical. Stock illustrations break the brand voice + don't match the typography/color system.
- **No CTA.** A full-page empty state without a next action is a dead end. Always offer at least one verb-led link or button.
- **Multiple primary CTAs.** ONE primary action. Secondary actions defer (text links, ghost buttons).
- **Hiding the data shape.** If the page WILL show a list / grid / table, the empty state shouldn't be a mystery shape — show the container's bounds (a faded outline of the table header, or a placeholder row) so the user understands what will fill the space when they act.
- **Loading-spinner mistaken for empty.** Don't render the empty state while data is still fetching. Render a Skeleton during fetch; render the empty state only after the fetch confirms 0 results.

## 6. Working reference

`audit-dashboard/src/components/primitives/display.tsx` `EmptyState` component is the inline pattern (a small card-internal empty zone). The full-page pattern is composed at the consumer's route level — Lumen's audit-dashboard has not yet shipped a dedicated empty-route example. Carried to v0.14.1 candidate (audit-dashboard `/empty` demo route).

## 7. Cross-references

- [`../02-components/empty-state/component.md`](../02-components/empty-state/component.md) — the inline EmptyState component (card-internal)
- [`../04-content/empty-states.md`](../04-content/empty-states.md) — message catalog for empty states across surfaces
- [`./error-pages.md`](./error-pages.md) — sibling pattern (full-page error vs full-page empty have similar centered-card shape but different intent)
- [`./auth-flow.md`](./auth-flow.md) — sibling pattern (centered card on calm canvas)
- [`../00-foundations/voice-and-tone.md`](../00-foundations/voice-and-tone.md) — the "never apologize" rule
- [`../00-foundations/first-impression.md`](../00-foundations/first-impression.md) — the 50ms halo applies to empty states too: brand chrome + intentional layout signal "the system is alive"
