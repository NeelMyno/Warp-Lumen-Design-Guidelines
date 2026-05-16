---
name: DropdownMenu
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Select, Combobox, Popover, Toolbar]
spec: ./component.json
last_updated: 2026-05-16
---

# DropdownMenu

> Reveal a portaled menu of actions or routes from a trigger. Three triggers — click (default), hover (top nav), context (right-click). Items invoke immediately on activation.

## When to use

- **Kebab / overflow** — a row's secondary actions ("Rename", "Move to…", "Delete").
- **Account / workspace switcher** — top-right user identity menu.
- **Navbar dropdown** — top-level destinations that fan out (Resources → Docs / Changelog / Status).
- **Context menu** — right-click on a row / canvas object / cell.

## When NOT to use

- A selectable value with persistence — use **Select** or **Combobox**.
- Multi-select — use **Combobox** or a **Popover** anchored to a `CheckboxGroup`.
- A modal interrupt — use **Dialog**.
- A floating help-text bubble — use **Tooltip**.

## Anatomy

1. **Trigger** — Button, IconButton, anchor, or any focusable element.
2. **Content** — `role="menu"`, **portaled to `document.body`** (mandatory per AGENTS.md hard rule 10).
3. **Item** — `role="menuitem"`, optional leading icon, optional trailing shortcut (Kbd) or chevron (for submenus).
4. **CheckboxItem** — `role="menuitemcheckbox"`, leading Check on `checked=true`.
5. **RadioGroup / RadioItem** — `role="menuitemradio"`.
6. **Divider** — `role="separator"`. Hairline border, 4 px margin top/bottom.
7. **Label** — `role="group"` parent, `aria-label` on the group, label row in `type.micro` + `text.tertiary`.
8. **SubMenu** — opens on ArrowRight or hover; portaled separately; positions to the right of the parent item.

## States

- **Rest** — `text.primary`, no chrome.
- **Hover / focus** — `action.ghost.bg.hover` (or `danger-soft.bg.hover` for danger items).
- **Active (mouse down)** — slightly deeper hover.
- **Disabled** — `text.tertiary`, `aria-disabled="true"`, no chrome on hover.
- **Danger** — `text.error`, danger-soft hover.

## Accessibility

- Trigger: `aria-haspopup="menu"`, `aria-expanded`.
- Menu: `role="menu"`, `aria-labelledby={triggerId}` (when titled) or `aria-label`.
- Items: `role="menuitem"` (or `menuitemcheckbox` / `menuitemradio`).
- Type-ahead: typing the first character of an item jumps focus to it (3-character window).
- Returns focus to trigger on close.

## Do

- Lead items with verbs: "Delete account", "Move to…", "Open in new tab".
- Group with dividers when there are ≥ 4 items.
- Right-align keyboard shortcuts via Kbd.
- Use `text.error` + `danger-soft.bg.hover` for destructive items.
- Portal to `document.body`. Re-track on scroll + resize. (Hard rule 10.)

## Don't

- Don't pack 12+ items into one menu — group or submenu.
- Don't render the menu inline as a positioned div — it will clip under `Card padding="none"`.
- Don't put persistent-value controls inside (use Select).
- Don't open submenus on hover only — they must also open on ArrowRight and tap.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release. Portaled by default. Click / hover / context triggers.
