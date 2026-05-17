---
name: ModeScope
type: component
version: 0.1.0
last_updated: 2026-05-16
audience: [designer, engineer, llm-agent]
related:
  - ../../00-foundations/modes.md
  - ../../01-tokens/modes/restrained.tokens.json
  - ../../01-tokens/modes/expressive.tokens.json
  - ../../../doc/LUMEN-v0.13-MASTER-REFACTOR.md
---

# ModeScope

> v0.13 Phase 1. The single source-of-truth for switching Lumen modes. Sets `data-mode="restrained" | "expressive"` on a container; descendants resolve mode-aware semantic tokens (`surface.hero`, `surface.canvas-ambient`, `surface.atmosphere`, `motion.atmosphere`) accordingly. Components are mode-agnostic. NEVER a per-component prop. NEVER nested with opposite modes.

---

## When

- Wrapping a landing / marketing surface, an AI chat / agent / generation panel, an onboarding flow, an empty state, a hero panel.
- Any surface where the master doc Phase 1 routing table calls for expressive mode (see [modes.md](../../00-foundations/modes.md) §1).

## When NOT

- On a dashboard, table, settings panel, terminal, command palette, or any dense operator surface — those default to restrained without needing a ModeScope wrapper.
- Inside another ModeScope of opposite mode — undefined behavior, contrast bug surface.
- As a per-component prop replacement — components do not branch on mode.

## Anatomy

1. A single HTML element (default `<div>`, optionally `<section>` / `<main>` / `<article>`).
2. `data-mode` attribute set to either `"restrained"` or `"expressive"`.
3. Children render inside; the CSS scoping in `dist/css/lumen.scoping.css` resolves the mode-aware tokens for any descendant that consumes them.

## States

ModeScope has no states. It's a structural primitive. Its descendants render states.

## Accessibility

- The `data-mode` attribute is for CSS variable scoping. It carries no semantic meaning for assistive tech.
- Mesh + grain + aurora animations gate on `prefers-reduced-motion` via `@media` in `dist/css/lumen.scoping.css`.
- Glass blur + atmospheric overlays gate on `prefers-reduced-transparency` via `@media` in the same file.
- Color contrast on text rendered over `surface.hero` (mesh background) is validated by `tools/audit-contrast.ts` — expressive-mode body + large UI pairs must clear WCAG 2.2 AA.

## Do

- Wrap landing / marketing / AI / onboarding / empty-state / hero panels in `<ModeScope mode="expressive">`.
- Default to restrained — explicit `mode` prop optional; omitting it leaves descendants on restrained tokens.
- Use `as="section"` or `as="main"` for semantic HTML when wrapping a page-level region.
- Compose at the largest scope where mode applies — one ModeScope per page section, not per component.

## Don't

- **NEVER** nest a ModeScope of opposite mode inside another ModeScope. Mode-mixing on the same page invites contrast bugs and is undefined behavior.
- **NEVER** pass `mode` as a prop to any individual component. Mode is a scope attribute; components do not branch on mode.
- **NEVER** apply `data-mode` directly to a primitive element. Use ModeScope so the attribute is paired with the right React semantics and the CSS scoping has a known anchor.
- **NEVER** use expressive mode on a data table, row, cell, chart axis, or any surface where atmospheric overlay would reduce text contrast.
- **NEVER** assume mode controls layout — it does not. Mode only rebinds surface / atmosphere / motion tokens.

## Code

See [examples/primary.tsx](./examples/primary.tsx). The source is ~30 lines. The component is intentionally trivial — the work happens in the CSS scoping layer (`dist/css/lumen.scoping.css`) and the semantic token graph.

## Changelog

- **0.1.0** — Added. v0.13 Phase 1 initial release. The mode-switch primitive. The single source-of-truth for switching Lumen modes.
