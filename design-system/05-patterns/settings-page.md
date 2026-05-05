# settings-page — the operator config pattern

> Settings, preferences, account, billing — the surfaces a user opens to change how the product behaves, then leaves. Quiet, dense, scannable. The opposite of a marketing page in every dimension that matters: density, hierarchy, emphasis, motion. A settings page is **read fast, edit precisely, exit cleanly** — and Lumen's settings pattern is engineered for exactly that loop.

## 1. The shape

```
SettingsShell
  ├── Sidebar (220–240px, sticky, cozy density 36px)
  │     ├── lumen-eyebrow "Workspace"
  │     ├── Button.ghost.sm  → "General"          (aria-current="page", left-stripe accent)
  │     ├── Button.ghost.sm  → "Members"
  │     ├── Button.ghost.sm  → "Billing"
  │     ├── lumen-eyebrow "Account"
  │     ├── Button.ghost.sm  → "Profile"
  │     ├── Button.ghost.sm  → "Notifications"
  │     ├── Button.ghost.sm  → "Security"
  │     └── Button.ghost.sm  → "API tokens"
  │
  └── Main (page padding 24px, scrolls)
        └── for each settings group:
              ├── SectionHeader
              │     ├── lumen-eyebrow                  (e.g. "WORKSPACE")
              │     ├── heading.h3                     (e.g. "General")
              │     └── body.sm in text-secondary      (1-line description)
              │
              ├── Form
              │     └── for each fieldset:
              │           ├── (optional) fieldset legend in label.md
              │           └── for each setting:
              │                 └── Field
              │                       ├── Label
              │                       ├── (Switch | Select | Input | Textarea | Combobox | RadioGroup)
              │                       └── help / error
              │
              ├── (per-section) Button.primary.sm  →  "Save changes"
              │     OR
              │     auto-save indicator + Toast on commit
              │
              └── Divider (border-hairline)

  (footer band, last group)
        └── DangerZone
              ├── lumen-eyebrow "DANGER"
              ├── heading.h4 "Delete workspace"
              ├── body.sm in text-secondary (consequence sentence)
              └── Button.danger-soft.md  → opens Dialog with TypeToConfirm
```

The sidebar is the surface's spine — it groups settings into 5–10 sections, each section becomes an anchor target in `Main`. Long settings pages scroll vertically; the sidebar tracks scroll position and updates `aria-current` on the active section. Don't tab-route — anchor-route. Operators want one URL, one scrollback, deep-linkable settings.

## 2. Density mode

**Cozy (36px field-height, `size.control.cozy`).** Settings is the canonical home of cozy density — Plaid Dashboard, Linear's settings, Notion's preferences all converge here. Comfortable (40px) wastes vertical real estate on a surface the user opens monthly to find one toggle; compact (32px) reads as too dense for one-off interaction with high-stakes fields (billing, security, member roles).

The cozy sweet spot — `<Form density="cozy">` on the form root, propagating `data-density="cozy"` to every nested `.lumen-field`. Sidebar nav items also render at 36px to match.

| Rhythm | Pixel | Token |
|---|---|---|
| Sidebar nav-item height | 36 | `size.control.cozy` |
| Sidebar item-to-item | 4 | `space.1` |
| Sidebar group-to-group | 16 | `space.4` |
| Section break (group-to-group) | 32 | `space.section.sm` |
| Fieldset-to-fieldset within a group | 32 | `space.field.gap.fieldset` |
| Field-to-field within a fieldset | 16 | `space.field.gap.field` |
| Label-to-control | 4 | `space.field.gap.label` |
| Control-to-help/error | 4 | `space.field.gap.help` |
| Page padding | 24 | `space.page.md` |

**Why cozy and not compact:** settings touches consequential fields (delete workspace, change billing email, rotate API token). Compact 32px crowds the click target and erodes the sense of "I am about to commit a real change." Cozy keeps 36px controls — above the WCAG 2.5.5 24×24 target floor, generous for a desktop precision-pointer surface, tight enough to scan a page of 30 fields without scroll fatigue.

## 3. Tokens for wrappers

```
SettingsShell outer:           grid-cols-[240px_1fr], gap-0
  Sidebar:                     w-[220px] lg:w-[240px], sticky top-0, h-screen
                               border-r border-hairline, bg-surface-raised
                               p-3 (space.3 = 12px)
  Main:                        p-page-md (space.page.md = 24px)
                               max-w-[800px] (the reading column)

Main interior (vertical rhythm):
  Section-to-section gap:      space.section.sm (32px)
  Section padding:             0 (the SectionHeader + Form provide their own)

Section interior:
  SectionHeader → Form gap:    space.stack.lg (24px)
  Form padding:                0
  Fieldset-to-fieldset:        space.field.gap.fieldset (32px)
  Field-to-field:              space.field.gap.field (16px)
  Field internals:
    Label-to-control:          space.field.gap.label (4px)
    Control-to-help:           space.field.gap.help (4px)

Save row (per-section):
  Top-margin:                  space.stack.lg (24px)
  Right-aligned:               flex justify-end

DangerZone footer:
  Top-margin from prior group: space.section.md (48px)
  Border:                      border-t border-hairline
  Padding-top:                 space.section.sm (32px)
```

Page width caps at **800px** (`size.container.narrow + slack`). Wider than that and the eye over-saccades on a row of `Label .......... Control`. Narrower and the description column gets squeezed. 800px is the documented sweet spot for a single-column form (Baymard, NN/g).

## 4. Component recipe

| Role | Component + variant | Notes |
|---|---|---|
| Sidebar group label | `lumen-eyebrow` | 12px uppercase tracked, `text-tertiary`. Don't use `heading.h6` — too loud for nav scaffolding. |
| Sidebar nav-item | `Button` `intent="ghost"` `size="sm"` | The active item gets `aria-current="page"` plus a 2px left-border accent stripe + `text-primary` (vs `text-secondary` for inactive). Don't use `intent="primary"` or full-fill — sidebar items are ambient, not actions. |
| SectionHeader eyebrow | `lumen-eyebrow` | Pairs with the sidebar group it belongs to. |
| SectionHeader title | `heading.h3` (20px) | The h2 of the page is the page title; section titles are h3. |
| SectionHeader description | `body.sm` in `text-secondary` | One line, max two. If it's longer than two lines, the section is doing too much. |
| Field wrapper | `Field` | **Always.** Never `<Switch>` bare — even a binary toggle gets its label, optional description, optional error in the Field shell. |
| Binary setting | `Switch` | "Enable two-factor auth", "Email me weekly digests". On = the affirmative state. Default unchecked unless the affirmative is the documented baseline. |
| Short choice list | `Select` | "Time zone", "Date format", "Default currency" when ≤ 50 options. |
| Searchable / long list | `Combobox` | "Default currency" if all 180+ ISO codes, "Default carrier" against an indexed catalog, "Owner" against the team roster. |
| 2–6 mutually exclusive | `RadioGroup` | "Theme: System / Light / Dark". Visible as a row of options, not a popover — operators want to see the trade-off. |
| Free text | `Input` (single-line) / `Textarea` (multi-line) | Profile name, billing email, custom invoice memo. |
| Number with unit | `NumberInput` with trailing-slot addon | "Session timeout: [60] [MIN]". Unit chip in `[data-slot="addon"]`. |
| Save (per-section) | `Button` `intent="primary"` `size="sm"` | Right-aligned, sits 24px below the last field of the group. Hidden until the section is dirty (RHF `formState.isDirty`). |
| Save (auto) | `LiveDot` + `Toast` | When auto-saving, show a `LiveDot` with `label="Saved"` in the section header bar; on every commit fire a `Toast` `intent="success"` "Saved" with 1500ms TTL. |
| Cancel | `Button` `intent="tertiary"` `size="sm"` | Reset the section's RHF state to the original values. Renders only when dirty. |
| Destructive | `Button` `intent="danger-soft"` `size="md"` | "Delete workspace", "Revoke all API tokens". Opens a `Dialog` with `TypeToConfirm` — operators must type the workspace name to commit. Never one-click destructive. |
| Group divider | `Divider` (1px, `border-hairline`) | Between every settings group. Don't use color, don't use shadow, don't use background tint to separate sections — hairlines do the work. |

**Save behavior — pick one per surface, never mix.**

- **Per-section save** is the default. Each settings group renders its own `Save changes` button, right-aligned at the bottom of the group's form. It only appears when the section is dirty. Click → POST → toast "Saved" or inline success state. Other sections keep their own state. This is what GitHub, Linear, Notion, Stripe, and Vercel converge on for high-stakes settings.
- **Auto-save** is the alternative for low-stakes settings (notification preferences, theme, default view). On every blur, debounce 600ms, POST, fire a toast. Show a `LiveDot` with `label="Saved"` in the section header to reassure that the silent commit happened. Never silent-commit without a confirmation surface — operators trust what they can verify.

Pick one model and apply it consistently across the whole settings surface. A settings page that auto-saves notification preferences but per-section-saves billing is a confusing surface; the user can't predict whether their click matters.

## 5. Anti-patterns

- **Marketing density on settings.** A 96px section rhythm + 56px controls reads "marketing landing page" not "settings panel." Settings is cozy — `space.section.sm` (32px), `size.control.cozy` (36px). If a settings page feels like it's breathing, it's wrong.
- **Switch without a label.** A switch with only an icon is a riddle. `Field` is the contract — every Switch wraps in a Field and every Field has a visible Label. The Switch ships without an aria-label by default; the Field's Label is the accessible name.
- **Save button at the top of the page.** Settings are scrolled. The save sits at the bottom of the form (or the bottom of the section, for per-section save) — exactly where the eye lands when the user is finished editing. A top-mounted save means scroll down → edit → scroll up → save → scroll down to verify, which is hostile.
- **Modal-everything.** Settings are inline edits, not modal flows. Don't open a Dialog to change a Switch. The only modal in a settings surface is the destructive-action confirmation (`Dialog` + `TypeToConfirm`) — and even that is one of three or four modals, not the default interaction.
- **Auto-save without a confirmation surface.** A silent commit erodes trust. Operators want to know their click reached the server. Auto-save → `Toast` `intent="success"` "Saved" + a `LiveDot` indicator. If the network fails, fire `Toast` `intent="danger"` "Could not save — try again" with a Retry action.
- **Color-coded section backgrounds.** "Danger zone" with a red background, "info" with a blue tint, "billing" with a yellow stripe — the system's vocabulary is a hairline + an eyebrow + a heading. Surfaces don't tint. The danger zone gets the same hairline treatment as every other section; what marks it dangerous is the `Button` `intent="danger-soft"` and the `Dialog` confirmation, not a colored card. (See `principles.md` §3 — single-accent rule. Spring Green plays one role; danger red is reserved for `intent="danger"` chrome and `text-error` validation messages, never for surface tint.)
- **Disabled-only validation feedback.** A grayed-out save button with no message tells the user nothing about why. If a field is invalid, surface a `ValidationMessage` below the field with the specific reason. Disabled-as-error is documented as hostile across every form research source ([Smashing](https://www.smashingmagazine.com/2022/09/inline-validation-web-forms-ux/), [NN/g](https://www.nngroup.com/articles/required-fields/)).
- **Long-tail settings without grouping.** A page with 47 toggles and no `SectionHeader` separators is a search problem dressed as a UI. Group into 5–10 logical sections (Workspace / Members / Billing / Profile / Notifications / Security / API / Integrations). Operators find what they want via the sidebar, not via Cmd+F.
- **Two-column field layout for unrelated settings.** Two-column is for related triplets (city + state + ZIP). Settings are conceptually independent — render them in a single full-width column. Eye-tracking shows F-pattern fails on multi-column forms (Baymard).
- **Mixing per-section save with auto-save in the same surface.** Predictability beats local optimization. Pick one model. Document the choice in the page's component file or in a comment.

## 6. Working reference

The closest analog in the audit dashboard is `audit-dashboard/src/app/library/client.tsx` — the Library page is a long-scroll grouped layout with the same sidebar + main + section-divider rhythm a settings page wants. The 25-section structure (`SECTIONS` const, lines 90–116) demonstrates the anchor-routed sidebar pattern; each `<Section eyebrow="..." title="..." description="...">` block is the SectionHeader recipe at scale.

For Switch / Select / RadioGroup compositions inside `Field` shells, see `audit-dashboard/src/app/foundations/page.tsx` — every form primitive is exercised with its label, helper, error, and success states.

A dedicated `audit-dashboard/src/app/settings/` route is a candidate for a future tab — it would showcase per-section save, auto-save with toast, and the `DangerZone` + `TypeToConfirm` flow as a reference implementation. Track in the patterns roadmap.

**Cross-references:**

- [`density.md`](../00-foundations/density.md) §2 — cozy density tier rationale and Plaid/Linear convergence.
- [`forms-and-inputs.md`](../00-foundations/forms-and-inputs.md) §Sizing scale, §Density modes — the cozy field-shell wiring.
- [`buttons.md`](../00-foundations/buttons.md) §Intents — `ghost`, `tertiary`, `danger-soft` and when to reach for each.
- [`hierarchy.md`](../00-foundations/hierarchy.md) — the 1.5–2× weight gap between section title and section description.
- [`principles.md`](../00-foundations/principles.md) §3 — single-accent rule (no color-tinted "danger zone" backgrounds).
