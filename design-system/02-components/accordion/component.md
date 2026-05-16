---
name: Accordion
type: component
status: stable
version: 0.12.6
since: 0.12.6
deprecated: false
platforms: [web-react, react-native]
a11y_level: WCAG-2.2-AA
related: [Tabs, Card, List]
spec: ./component.json
last_updated: 2026-05-16
---

# Accordion

> Disclosure list. Each row is a `<details>`/`<summary>` with a Lumen chevron at the END (per AGENTS.md hard rule 14 — native marker suppressed via `.lumen-summary`).

## When to use

- **FAQ** sections — single mode.
- Settings disclosure groups — multiple mode.
- Sub-navigation that expands sections — single, non-collapsible.
- Long-form docs with skippable sub-topics.

## When NOT to use

- Top-level navigation — use **Navbar** or **Sidebar**.
- Sibling views of the same record — use **Tabs**.
- Lists that should always be visible — just render them.

## Anatomy

1. **Accordion root** — controls `type` (single / multiple), `value`, `onValueChange`.
2. **AccordionItem** — `<details>` or Radix `<Accordion.Item>`.
3. **AccordionTrigger** — `<summary>` with `class="lumen-summary"` (hard rule 14). Includes label + end-positioned lucide ChevronDown.
4. **AccordionContent** — the disclosed region. Animates height on open.

## Variants

| Variant | Chrome | Use |
|---|---|---|
| `plain` | Hairline border between rows | FAQ pattern (default) |
| `card` | Each item is a Card surface | Settings groups, billing |
| `ghost` | No chrome — only the chevron rotates | Sub-navigation |

## States

- **Closed** — chevron at 0°.
- **Hover** — `text.primary` + ghost.bg.hover on summary.
- **Focus** — visible focus ring (outline + shadow per hard rule 11).
- **Open** — chevron rotated 180° via `group-open:rotate-180`.

## Accessibility

- Native `<details>`/`<summary>` ships keyboard + SR semantics for free.
- **AGENTS.md hard rule 14**: every summary that paints a custom chevron gets `class="lumen-summary"` (or the Tailwind `list-none` utility). This suppresses the native disclosure triangle on Chrome / Safari / Firefox / pre-2022 webkit.
- Height animation collapses to instant under `prefers-reduced-motion`.
- Single mode + non-collapsible: at least one row stays open.

## Do

- Lead summary with the question or topic noun.
- Use single mode for FAQ; multiple for settings.
- Pair with `summary { list-style: none }` via the `.lumen-summary` class.
- Animate height with the `grid-template-rows: 0fr → 1fr` pattern (no measured-height jank).

## Don't

- Don't forget `.lumen-summary` — native triangle doubles up with your chevron (rule 14).
- Don't paint the chevron in lime.
- Don't combine with Tabs on the same surface.
- Don't hide critical info in a closed row on first load.

## Code

- [Web React](./examples/primary.tsx)

## Changelog

- **0.12.6** — Initial release. `.lumen-summary` marker suppression per hard rule 14.
