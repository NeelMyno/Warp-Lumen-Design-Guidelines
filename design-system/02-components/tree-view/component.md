---
name: TreeView
type: component
status: beta
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [List, Sidebar]
spec: ./component.json
last_updated: 2026-05-16
---

# TreeView

> Hierarchical node list. File tree, nav tree, org chart.

## Accessibility

- `role="tree"`, `role="treeitem"`, `role="group"`.
- `aria-expanded`, `aria-level`, `aria-setsize`, `aria-posinset`.
- Keyboard: Arrow keys walk, Enter activates.

## Do

- Leading lucide icon per node.
- Padding-left indent.
- Virtualize past 1000 rows.

## Don't

- Don't use for flat lists.
- Don't lime-fill selected row.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release (beta).
