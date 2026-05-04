---
name: Principles
type: foundation
version: 2.0.0
last_updated: 2026-05-04
audience: [designer, engineer, llm-agent]
related:
  - ./voice-and-tone.md
  - ./accessibility.md
  - ./motion-language.md
  - ./hierarchy.md
  - ./first-impression.md
  - ./micro-interactions.md
---

# Lumen Principles

> Seven operating principles for everything Lumen ships. Every component, every token, every doc obeys these. When in conflict with each other, the order below resolves the conflict — **1 wins over 7**. Lumen is a *premium-feeling* system grounded in design psychology: visitors form an opinion in 50 ms, the brain rewards what's easy to process, and people remember peaks and endings. These principles encode that.

> [!note]
> **v0.11 — Premium Psychology rewrite.** Principles 1, 2, 4 are new. Principles 3, 5, 6, 7 are tightened restatements of v0.1's `Less but better`, `Care is total`, `Color is supplement`, `Decelerate don't bounce`. The v0.1 `Density is dense, not airy` principle was retired and reabsorbed into principle 3 (restraint) and principle 4 (cognitive fluency); the marketing-vs-operator surface split now lives explicitly in [`spacing.md`](./spacing.md) §3.

---

## 1. Engineer the first impression

A visitor decides whether your product feels professional in **50 milliseconds**. That snap judgment then colors every subsequent perception (the *halo effect*). The hero, above-the-fold, the first frame of the loading state, the empty dashboard a new user lands on — these are the highest-leverage surfaces in the system.

- The hero answers three questions before the user scrolls: *what does this do, who is it for, why does it matter.*
- One dominant focal point in the first viewport. No competing CTAs, no "five things at the same volume."
- Branded chrome (typography, accent, hairlines, accent-glow) reads in the first paint. Not on hover. Not after scroll.
- The skeleton loading state, the empty-data state, and the cold-start dashboard all ship with the same care as the populated screen.
- A premium first impression is *engineered*, not improvised — it earns the user's continued attention.

**Source:** Halo effect (Thorndike, 1920) applied to web UX (Lindgaard et al., 2006 — 50 ms attractiveness judgment). The Premium-Psychology brief, v0.11.

> See [`first-impression.md`](./first-impression.md) for the operational checklist (hero anatomy, halo guards, above-the-fold contract).

---

## 2. Lead the eye — one focal point per section

Premium UIs do not let the user choose where to look. They make the choice for the user. Every section has a **single dominant focal point**; everything else sits in the support tier so quietly the eye never has to negotiate.

- Per section: one headline, one number, one CTA, one image — pick exactly one to be loud.
- Five things screamed at the same volume = the user hears nothing. Equal weight is the loudest mistake.
- Hierarchy is built with **type scale, weight, color, position, white space** — in that order. Reach for a card or a divider only when typography has done all it can.
- "Aggressive" doesn't mean "shouty" — it means *decisively unequal*. The dominant element is at least 1.5–2× the visual weight of the next tier.
- Information lives in tiers: *primary (what the user came for)* → *secondary (context, supports the primary)* → *tertiary (escape hatches, hints)*. If you can't name the tier, the element doesn't belong on the page.

**Source:** F-pattern eye-tracking research (Nielsen Norman Group). Linear and Stripe as canonical implementations. The Premium-Psychology brief, v0.11.

> See [`hierarchy.md`](./hierarchy.md) for the tier system, the visual-weight calculator, and per-component hierarchy rules.

---

## 3. Less, but better

Restraint is a constraint, not a style. **What you leave out is louder than what you put in.** Cut until removing one more thing breaks meaning.

- One primary action per view. One disciplined accent in the entire system (`color.accent.500` = `#00FA8A`).
- No second loud color. No decorative gradients. No glassmorphism stacks. No mascots, no isometric scenes, no AI-sparkle decoration.
- If a hairline separates two surfaces sufficiently, do not add a shadow.
- If type does the hierarchy, do not add a card.
- If the data carries the page, do not add an illustration.
- Generous white space inside sections is **confidence**, not laziness. "Empty space is wasted space" is the cheap-feeling instinct; resist it.

**Source:** Dieter Rams, *Less, but better*. Reinforced by Apple, Hermès, Aesop, Bottega Veneta, Linear — luxury design *trusts* you will come to it; it does not chase.

---

## 4. Cognitive fluency over decoration

The brain rewards what's easy to process. **Things that are easy to read are perceived as more trustworthy, more professional, and more premium.** Hard-to-process design is read by the user as untrustworthy, regardless of how visually elaborate it is.

- Every section answers in 1–2 seconds: *what is this, why am I looking at it, what should I do.*
- Predictable navigation > clever navigation. Predictable layouts > novel layouts. The user's mental model is the brief.
- Numbers in tabular figures (`tnum`) so they align in columns. Money, weights, ETAs, IDs read as a grid, not a sentence.
- Reading copy capped at 60–75 ch. Body line-height 1.5–1.7. Headings track tighter (`-0.02em`).
- Don't make the user *think* about the chrome. The chrome should disappear into the content — that's the premium feeling.

**Source:** Cognitive fluency / processing fluency (Reber, Schwarz, Winkielman, 2004). Apple HIG. Stripe and Figma as canonical implementations of "complex products that feel simple."

---

## 5. Care is total or it is performance

The empty state, the error toast, the disabled button, the focus ring, the 404 page, the print stylesheet, the keyboard-navigation path, and the marquee dashboard get **the same attention** as the hero. People remember **peaks and endings** (the *peak-end rule*) — the small moments of polish are what make the system feel alive.

- Every component spec describes rest, hover, focus-visible, active, disabled, loading, AND empty/error states. Skipping any state ships a hole.
- Every interactive element has a visible focus state and meets WCAG 2.2 AA contrast.
- Hover, press, focus, success — these *micro-interactions* are not decoration; they are the difference between a static page and one that feels alive. They signal that the maker cared.
- Spacing is consistent. Buttons sit on a baseline. Icons align to their labels. If something looks "approximately placed," it reads as cheap.
- Every example file is copy-paste-ready, not pseudocode.
- The unseen (token names, code architecture, doc structure, lint coverage) carries the same weight as the seen.

**Source:** Peak-end rule (Daniel Kahneman). Jony Ive, paraphrased. The "100 small signals" model from the Premium-Psychology brief.

> See [`micro-interactions.md`](./micro-interactions.md) for the catalog of moments to design (button hover, form-field success, scroll fade-in, page-transition end).

---

## 6. Color is supplement, not signal

Status meaning never lives only in hue. Pair color with a label or shape so the system is color-blind-safe by construction.

- Status badges always have a leading dot or icon AND a label.
- Charts use shape (line style, marker shape) plus color, not color alone.
- The accent (Spring Green `#00FA8A`) is reserved for **action / live / success** — it does not appear as decoration.
- Dark and light modes are designed in parallel, not "dark = light inverted."
- Pure white text on dark canvas is harsh; Lumen uses `#E6E6E6` (the user-fixed brand light) instead — calmer for long-scroll reading.

**Source:** Apple Human Interface Guidelines. WCAG 2.2 §1.4.1 (Use of color). Lumen [ADR 0005](../../_meta/decisions/0005-warp-green-as-only-accent.md).

---

## 7. Decelerate; motion serves comprehension

Motion serves comprehension. It tells the user where something came from or where it is going. It is short, decelerating, and respects `prefers-reduced-motion` everywhere. **Subtle motion is alive; gimmicky motion is exhausting.**

- Default easing is `cubic-bezier(0.2, 0, 0, 1)` — ease-out.
- UI feedback (button, hover, focus) is `≤ 180ms`.
- State changes (panel open, drawer slide) are `260ms`.
- Page transitions are subtle cross-fades, never slides on web.
- The `LiveDot` pulse is the **one** signature recurring animation. Everything else is short and ends.
- Scroll-driven fade-ins guide the eye into the next focal point. They are not "spinning, bouncing, distracting." If the user notices the animation more than the content, it has failed.
- `prefers-reduced-motion: reduce` is honored everywhere — no exceptions. Reduced motion is real motion, not "subtle motion."

**Source:** Apple HIG. Disney's *12 principles of animation* applied to UI. The "subtle animation" rule from the Premium-Psychology brief.

---

## How to apply these (for LLM agents)

When generating any UI for Lumen:

1. **Start by removing.** Generate the screen, then take three things away. Then take one more.
2. **Pick the focal point first.** What is the *one* thing the user should look at? Build the section's hierarchy from there.
3. **Use semantic tokens only.** `color.surface.page`, never `color.brand.50`. `space.4`, never `dimension.4`.
4. **Verify focus-visible, contrast, keyboard reachability** before claiming complete.
5. **Default to no animation.** Add motion only to communicate where something came from or went, or to mark a peak moment (success confirmation, primary CTA hover).
6. **Default to dense on operator surfaces and breathable on marketing.** Both are calm — see [`spacing.md`](./spacing.md) §3.
7. **Ship every state.** The empty state, the error state, the loading state, the disabled state. If you can't render it as a component variant, you haven't shipped it.

---

## What to avoid

These appear nowhere in Lumen:

- **Equal-weight noise.** Five headlines screaming at the same size, three CTAs of the same color, sections with no obvious focal point.
- **Decoration disguised as feature.** Glassmorphism stacks for atmosphere, neumorphism for "soft UI", brutalism-as-style.
- **Heavy drop shadows on cards, "soft UI" pillows.**
- **Mascot characters, isometric scenes, AI-sparkle gradients.**
- **Stock photography of any kind in product UI.**
- **Color used as the sole signal of meaning.**
- **Bouncy, springy, attention-grabbing motion** (one signature pulse exception).
- **A second loud accent color competing with the spring green.**
- **Approximate spacing** — elements that look "kind of aligned" but aren't snapping to the grid.
- **Pure white body text on dark canvas.** Use `color.text.primary` = `#E6E6E6`.
- **Trend-chasing layouts** that look like every other AI-generated landing page (the same gradient, the same hero structure, the same animation pattern). Taste is intentional restraint.

---

## Related

- [Voice and tone](./voice-and-tone.md)
- [Accessibility](./accessibility.md)
- [Motion language](./motion-language.md)
- [Hierarchy](./hierarchy.md) — v0.11 new
- [First impression](./first-impression.md) — v0.11 new
- [Micro-interactions](./micro-interactions.md) — v0.11 new
- [Spacing](./spacing.md) — marketing-vs-operator surface split
- [Lumen brief](../../research/lumen-brief.md) — why these principles
- [ADR 0018 — v0.11 Premium Psychology recolor](../../_meta/decisions/0018-premium-psychology-recolor.md)
