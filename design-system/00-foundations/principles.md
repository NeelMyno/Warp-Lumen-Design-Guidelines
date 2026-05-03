---
name: Principles
type: foundation
version: 1.0.0
last_updated: 2026-05-02
audience: [designer, engineer, llm-agent]
related: [./voice-and-tone.md, ./accessibility.md, ./motion-language.md]
---

# Lumen Principles

> Five operating principles for everything Lumen ships. Every component, every token, every doc obeys these. When in conflict with each other, the order below resolves the conflict (1 wins over 5).

## 1. Less, but better

Restraint is a constraint, not a style. Cut until removing one more thing breaks meaning.

- One primary action per view. One disciplined accent in the entire system.
- No second loud color. No decorative gradients. No glassmorphism stacks.
- If a hairline separates two surfaces sufficiently, do not add a shadow.
- If type does the hierarchy, do not add a card.
- If the data carries the page, do not add an illustration.

**Source:** Dieter Rams, "Less, but better." Used as a constraint, not a slogan.

## 2. Care is total or it is performance

The empty state, the error toast, the disabled button, the focus ring, the 404 page, the print stylesheet, and the marquee dashboard get the same attention.

- Every component spec must describe rest, hover, focus-visible, active, disabled, loading, AND empty/error states.
- Every interactive element has a visible focus state and meets WCAG 2.2 AA contrast.
- Every example file is copy-paste-ready, not pseudocode.
- The unseen (token names, code architecture, doc structure) carries the same weight as the seen.

**Source:** Jony Ive, paraphrased.

## 3. Color is supplement, not signal

Status meaning never lives only in hue. Pair color with a label or shape so the system is color-blind-safe by construction.

- Status badges always have a leading dot or icon AND a label.
- Charts use shape (line style, marker shape) plus color, not color alone.
- The accent green is reserved for action / live / success — it does not appear as decoration.
- Dark and light modes are designed in parallel, not "dark = light inverted."

**Source:** Apple Human Interface Guidelines.

## 4. Decelerate, don't bounce

Motion serves comprehension. It tells the user where something came from or where it is going.

- Default easing is `cubic-bezier(0.2, 0, 0, 1)` — ease-out.
- UI feedback (button, hover, focus) is `≤ 180ms`.
- State changes (panel open, drawer slide) are `260ms`.
- Page transitions are subtle cross-fades, never slides on web.
- The `LiveDot` pulse is the one signature recurring animation. Everything else is short and ends.
- `prefers-reduced-motion: reduce` is honored everywhere — no exceptions.

**Source:** Apple HIG + Warp's own `trackPulse` keyframe.

## 5. Density is dense, not airy

Warp's substance is freight Bloomberg terminal. Long single-column scrolls, tabular numerics, FAQ accordions. Whitespace lives *inside* sections, not between them.

- A page can have 12+ sections if each is typographically composed.
- Tables default to compact (32px rows). Operators read fast; scrollbars are not failure.
- Numbers use tabular monospace. Money, weights, ETAs, IDs all align in columns.
- Content widths: 1100px primary, 1200px wide hero, 720px / 60ch reading column.
- The calm comes from typographic discipline and 1px hairlines, not from emptiness.

**Source:** Warp brand DNA, observed from production.

## How to apply these (for LLM agents)

When generating any UI for Lumen:
1. Start by removing — generate the screen, then take three things away.
2. Use only semantic tokens (`color.surface.default`, never `color.brand.500`).
3. Verify focus-visible, contrast, keyboard reachability before claiming complete.
4. Default to no animation. Add motion only to communicate where something came from or went.
5. Default to dense. Add whitespace inside the section that needs to breathe; never add it just to "look clean."

## What to avoid

These appear nowhere in Lumen:
- Glassmorphism stacks, neumorphism, brutalism-as-style.
- Heavy drop shadows on cards, "soft UI" pillows.
- Mascot characters, isometric scenes, AI-sparkle gradients.
- Stock photography of any kind in product UI.
- Color used as the sole signal of meaning.
- Bouncing or springy motion (one signature pulse exception).
- A second loud accent color competing with the green.

## Related

- [Voice and tone](./voice-and-tone.md)
- [Accessibility](./accessibility.md)
- [Motion language](./motion-language.md)
- [Lumen brief](../../research/lumen-brief.md) — why these principles
