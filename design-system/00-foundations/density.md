---
name: Density
type: foundation
version: 1.0.0
last_updated: 2026-05-03
audience: [designer, engineer, llm-agent]
related:
  - ./principles.md
  - ./spacing.md
  - ./typography.md
  - ./forms-and-inputs.md
  - ./accessibility.md
  - ../01-tokens/primitives/dimension.tokens.json
  - ../01-tokens/semantic/space.tokens.json
---

# Lumen Density

> Lumen is dense. Per [`principles.md`](./principles.md) §5: "Density is dense, not airy. Whitespace lives inside sections, not between them." Lumen ships **two density modes** — `comfortable` (default, marketing + non-data) and `compact` (operator surfaces, data-dense). The mode is visual, not semantic — a screen reader sees no difference.

This is the canonical reference. Density behavior on form fields lives in [`forms-and-inputs.md`](./forms-and-inputs.md) §Density modes. Spacing primitives are in [`spacing.md`](./spacing.md).

---

## 1. Why density matters for Warp

Warp's substance is **freight Bloomberg terminal**: long single-column scrolls, dense tables of lane rates, FAQ accordions, ETAs aligned in tabular columns. An operator looking at 200 shipments at 9 AM does not want a 64 px row. They want 32 px rows, tight cells, scannable margin, and a scrollbar that earns its keep.

Per [`research/lumen-brief.md`](../../research/lumen-brief.md) D-007:

> Dense over airy. Long single-column pages with 12+ sections are acceptable as long as each section is typographically composed. Tables: compact 32 px rows, regular 40 px, cozy 48 px — operator-density for shipments.

Density is what separates Lumen from a marketing-system look-alike. Without it, the brand reads as "another minimal SaaS system."

---

## 2. Three modes — `comfortable`, `cozy` (v0.8), and `compact`

v0.8 ratifies `cozy` as the third density tier between comfortable and compact. Cozy was de facto in use across 19+ sites in the v0.7 dashboard (`h-9` = 36 px); v0.8 promotes it to a first-class token (`size.control.cozy = 36 px`) + `dimension.9` primitive + `data-density="cozy"` attribute hook.

| Mode | Default for | Trigger | Field height | Card padding |
|---|---|---|---|---|
| **`comfortable`** (default) | Marketing landing, blog, editorial, first-time-user flows | Default — no opt-in needed | 40 px (`size.control.md`) | 24 px (`space.inset.xl`) |
| **`cozy`** (v0.8) | Settings panels, profile pages, in-between data surfaces | `<Form density="cozy">`, `data-density="cozy"` on container | 36 px (`size.control.cozy`) | 20 px |
| **`compact`** | Operator dashboards, data tables, dense forms | `<Form density="compact">`, `data-density="compact"` on container | 32 px (`size.control.sm`) | 16 px (`space.inset.lg`) |

### Form density mode

Per [`forms-and-inputs.md`](./forms-and-inputs.md) §Density modes:

> `Form` accepts `density="compact" | "comfortable"`. The mode is set as `data-density="compact"` on the form root; nested `.lumen-field` shells without an explicit `data-size` adopt 32 px height + reduced padding.

The mechanism is data-attribute scoping. The compact mode does not change typography — it changes control height, padding, and the gap rhythm via `field.gap.*` token overrides at the data-density scope.

> [!note]
> Mode is **inherited by nesting**. A compact `<Form>` propagates compact to every `.lumen-field` inside it. A child can opt out by setting `data-size="md"` explicitly.

---

## 3. Convergence — what peer systems ship

Lumen's two-mode model converges with the data-app standard. Linear, Plaid Dashboard, Notion, Asana, and Airtable all ship 2-3 density modes. Per [CHANGELOG v0.6](../../CHANGELOG.md):

> Density modes. `<Form density="compact">` sets `data-density="compact"` on the form root; nested `.lumen-field` shells without an explicit `data-size` adopt 32 px height + reduced padding. **Linear/Plaid/Notion convergence pattern.**

**v0.8 update:** Lumen now ships three modes. `cozy` (36 px field-height) lands between comfortable and compact for the in-between case — settings panels, profile pages, in-app dashboards that aren't full operator surfaces. Linear and Plaid both ship a similar middle tier (Linear's "default" between condensed and spacious; Plaid's "regular" between dense and comfortable).

---

## 4. Per-component density behavior

Density propagates through the form layer. Other components have their own size variant axes that may or may not subscribe to density.

### Button — does NOT subscribe to density

`Button` has explicit size variants (`sm` 32 / `md` 40 / `lg` 48 / `xl` 56 px). Density does not change Button — the call site picks a size based on rank, not page density. A primary CTA in a compact dashboard is still `lg` for emphasis.

| Variant | Height | Token |
|---|---|---|
| `sm` | 32 px | `size.control.sm` |
| `md` (default) | 40 px | `size.control.md` |
| `lg` | 48 px | `size.control.lg` |
| `xl` | 56 px | (added v0.4 for hero pill CTAs) |

### Field / Input / Textarea / Select — subscribes to density

Per [`forms-and-inputs.md`](./forms-and-inputs.md) §Sizing scale:

| Variant | Height | Body type |
|---|---|---|
| `sm` | 32 px | `body.sm` (13 px) |
| `md` (default) | 40 px | `body.md` (14 px) |
| `lg` | 48 px | `body.lg` (15 px) |

Compact mode auto-bumps to `sm` where size isn't explicit. Inputs without `data-size="md"` inside a `data-density="compact"` container render at 32 px.

### Table — has its own density axis

Per [`research/lumen-brief.md`](../../research/lumen-brief.md) D-007:

| Row height | Use |
|---|---|
| 32 px | **Compact (default).** Operator shipment tables. |
| 40 px | Regular. Reports, dashboards with mixed content. |
| 48 px | Cozy / spacious. Marketing tables, low-density UIs. |

Tables default to **compact**, even outside an explicit `compact` form context. This is intentional — operator tables are the canonical Warp surface.

### Card — subscribes to density

| Mode | Padding | Token |
|---|---|---|
| Comfortable (default) | 24–32 px | `space.6` / `space.8` |
| Compact | 12–16 px | `space.3` / `space.4` |
| Hero | 40 px | `space.10` |

Cards in operator dashboards default to compact padding. Cards in marketing default to comfortable.

### Other components

- **Badge** — single size axis (`sm` / `md` / `lg`); does not subscribe to density.
- **LiveDot / RateTicker** — fixed brand-signature dimensions; do not subscribe to density.
- **Toast** — fixed; does not subscribe to density. The toast is a system message, not page chrome.
- **Dialog** — single size axis (`sm` / `md` / `lg`); does not subscribe to density.

---

## 5. When to use each mode

### Comfortable — the default

Use comfortable for:
- Marketing landing pages, blog, press, legal.
- First-time-user flows (signup, onboarding, KYC). Cognitive load is high; whitespace helps.
- Forms with high-stakes input (billing, address, payment).
- Settings pages a user touches monthly, not hourly.
- Any surface where a non-operator audience is the target.

### Compact — the operator default

Use compact for:
- Shipments table, lane builder, quote builder — the daily operator workflow.
- Dense reporting dashboards with multiple stat cards per row.
- Power-user forms (bulk-edit modals, filter sidebars).
- Audit dashboards, KPI grids, RateTicker-adjacent surfaces.
- Any surface where the user opens it ≥ daily and reads it in scan mode.

### When mixing density is OK — and when it isn't

> [!warning]
> **Don't mix densities within one form.** A form is a coherent unit. A `compact` Field next to a `comfortable` Field reads as a layout bug, not a feature.
>
> **Don't use compact for first-time-user flows.** New users need the cognitive room. Compact assumes scanning velocity. Reserve for repeat operators.

It IS OK to:
- Embed a `compact` shipments table inside a `comfortable` marketing-style admin shell.
- Switch density per page (the operator dashboard is compact; the same product's settings page is comfortable).
- Mix a `compact` filter sidebar with a `compact` results table — both subscribe to operator density consistently.

---

## 6. Touch target compatibility

> [!warning]
> Per [`accessibility.md`](./accessibility.md) hard floor: 44 × 44 px minimum on mobile (Apple HIG) / 48 × 48 dp on Android (Material 3). WCAG 2.5.8 AA threshold is 24 × 24 px.

**Compact mode (32 px) is below the 44 × 44 px touch floor.** Compact mode is therefore **desktop-only**. Mobile clients MUST auto-bump compact controls to at least `lg` (48 px) regardless of the page-level density.

The mechanism: mobile-aware components ignore `data-density="compact"` when a `pointer: coarse` media query matches. The audit dashboard demos this in `audit-dashboard/src/components/primitives/inputs.tsx` — Field components honor compact only on hover-capable pointer devices.

---

## 7. ARIA implications — none

Density is a **visual** concern. A screen reader reads a compact table the same as a comfortable table. ARIA roles, names, descriptions, and live-region semantics do not change with density.

The `data-density` attribute is **not exposed to assistive tech**. It is a CSS hook only.

This is intentional. An operator on a screen reader who has trained their workflow on a compact dashboard does not want the screen reader to announce "compact mode" — they want the same cell content, the same row count, the same column order.

---

## 8. Density and the type scale

Density does **not** change type sizes. Per [`typography.md`](./typography.md) §6, the body floor is 12 px (compact 11 px reserved for `kbd` and `overline` only). A compact field still renders its value at `body.sm` (13 px) or `body.md` (14 px) — the same presets the comfortable field uses.

What changes is **leading on data tables only**: compact tables can opt into the `compact-table 1.18` leading from [`typography.md`](./typography.md) §4 for tighter row rhythm. The default `body 1.50` leading is preserved everywhere else.

> [!note]
> This is deliberate. Reducing type size to fit more rows would push the body floor below 12 px and fail the WCAG comfort floor. Lumen instead reduces row height by trimming top/bottom padding, not type size.

---

## 9. The third mode — `cozy` (v0.8 — shipped)

A `cozy` 36 px field-height tier between comfortable (40) and compact (32) shipped in v0.8 after appearing 19+ times in the v0.7 dashboard as a de facto fourth tier. The convergence Lumen joined:

| System | Modes | Cozy step? |
|---|---|---|
| Linear | 2 (comfortable / compact) | No |
| **Plaid Dashboard** | **3 (comfortable / cozy / compact)** | **Yes — 36 px field** |
| Notion | 2 (default / compact) | No |
| **Asana** | **3 (comfortable / default / compact)** | **Yes** |
| Airtable | 4 (extra-tall / tall / medium / short) | Multiple |
| **Lumen v0.8** | **3 (comfortable / cozy / compact)** | **Yes — 36 px field** |

**Trigger:** `<Form density="cozy">` or `data-density="cozy"` on any container. Same propagation pattern as `compact` — nested `.lumen-field` shells inherit unless they declare `data-size` explicitly.

**When to use cozy.** Settings panels, profile pages, in-app dashboards (`/account`, `/settings`, `/team`) where compact reads as too dense for one-off interaction but comfortable wastes vertical space on repeat-user surfaces. Linear and Plaid both ship the same middle tier for the same reason.

---

## 10. Implementation hooks

| Hook | Location | Purpose |
|---|---|---|
| `<Form density="comfortable" \| "cozy" \| "compact">` | `02-components/form/` | Sets `data-density` on form root. |
| `data-density="cozy" \| "compact"` | Any container | CSS attribute selector for nested density propagation. v0.8 added cozy. |
| `data-size="sm" \| "cozy" \| "md" \| "touch" \| "lg" \| "xl"` | Field shell | Explicit per-control size override; wins over inherited density. v0.8 added cozy/xl. |
| `space.*` semantic tokens | [`semantic/space.tokens.json`](../01-tokens/semantic/space.tokens.json) | Density compositions reach for these, never primitives. |
| `size.control.{sm,cozy,md,touch,lg,xl}` | [`primitives/dimension.tokens.json`](../01-tokens/primitives/dimension.tokens.json) | Control heights — compact uses `sm`, cozy uses `cozy` (36), comfortable uses `md`. v0.8 added cozy + xl. |

---

## 11. Don'ts

- **Don't mix densities within one form.** A coherent unit reads as broken when control heights vary.
- **Don't use compact for first-time-user flows.** New users need cognitive room.
- **Don't use compact (32 px) on mobile.** Below the 44 × 44 px touch floor. Mobile auto-bumps.
- **Don't reduce type size to fit more rows.** Trim row padding instead — the 12 px body floor is non-negotiable.
- **Don't propagate compact through marketing pages.** Marketing is comfortable by default.
- **Don't expose `data-density` to assistive tech.** Density is visual; ARIA is unchanged.
- **Don't add a third mode in product code.** Cozy is tracked for v0.7. Adding it now creates drift.

---

## References

- [`principles.md`](./principles.md) — §5 (density is dense, not airy)
- [`spacing.md`](./spacing.md) — `size.control.*`, `space.*` ladder, 4-grid
- [`forms-and-inputs.md`](./forms-and-inputs.md) — §Sizing scale, §Density modes
- [`typography.md`](./typography.md) — `body.*` floor (12 px), `compact-table 1.18` leading
- [`accessibility.md`](./accessibility.md) — 44 × 44 px touch floor, WCAG 2.5.8
- [`01-tokens/primitives/dimension.tokens.json`](../01-tokens/primitives/dimension.tokens.json) — `size.control.{sm,md,lg,touch}`
- [`01-tokens/semantic/space.tokens.json`](../01-tokens/semantic/space.tokens.json) — `space.*` ladder
- [`research/lumen-brief.md`](../../research/lumen-brief.md) — D-007 (content density)
- [`CHANGELOG.md`](../../CHANGELOG.md) — v0.6 (Form density mode, Linear/Plaid/Notion convergence)
- Peer systems: Linear, Plaid Dashboard, Notion, Asana, Airtable density patterns
