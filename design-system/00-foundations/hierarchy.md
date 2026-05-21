---
name: Hierarchy
type: foundation
version: 1.0.0
last_updated: 2026-05-04
audience: [designer, engineer, llm-agent]
related:
  - ./principles.md
  - ./typography.md
  - ./spacing.md
  - ./first-impression.md
  - ./color.md
---

# Lumen Hierarchy

> Premium UIs do not let the user choose where to look. They make the choice for the user. **Aggressive hierarchy** means decisively unequal visual weight: one dominant focal point per section, everything else in support. If five things scream at the same volume, the user hears nothing.

This foundation operationalizes [`principles.md`](./principles.md) §2 ("Lead the eye — one focal point per section"). It is mandatory reading before generating any new section, page, or component layout.

> [!note]
> v0.11 — new foundation, written in response to the Premium-Psychology brief. The "aggressive hierarchy" framing is canonical across Linear, Stripe, Apple — premium products converge on the same rule because the alternative (equal-weight noise) reliably reads as cheap.

---

## 1. The three-tier rule

Every page, every section, every card, every email gets resolved into three tiers. If you can't name the tier of an element, the element does not belong on the surface.

| Tier | Purpose | Visual weight | How many per section |
|---|---|---|---|
| **Primary** | The one thing the user came for | Loudest. Display type, accent, full color contrast, generous size. | **Exactly one.** |
| **Secondary** | Context that supports the primary | Quiet. Body type, secondary text color, smaller scale. | 0 to ~5. |
| **Tertiary** | Escape hatches, hints, system metadata | Whisper. Eyebrow type, tertiary text color, smallest scale. | 0 to ~3. |

**The 1.5–2× rule.** The primary element is at least **1.5–2× the visual weight** of the next tier. If your hero headline is 48 px, your subhead is at most 24 px. If your KPI is 64 px tabular, your label is 12 px uppercase tracked. Equal-weight elements break the hierarchy and read as cheap.

> [!warning]
> "Aggressive" does not mean "shouty." It means *decisively unequal*. A 14 px secondary label next to a 48 px primary number is aggressive hierarchy. A 36 px headline next to a 32 px subhead is **noise**.

---

## 2. Visual-weight calculator

Visual weight is a function of five inputs. To make one element dominant, dial up some of these — to make others recede, dial these down.

| Lever | Loud | Quiet |
|---|---|---|
| **Type scale** | Display 48–96 px | Body 14–16 px, eyebrow 12 px |
| **Type weight** | Bold (700) or Black (900) | Medium (500) or Regular (400) |
| **Color contrast** | `text.primary` (17:1+) on canvas | `text.tertiary` (3.6–5.4:1) |
| **Position** | Above the fold, top-left of section, isolated | Below the fold, bottom-right, in a row |
| **White space** | 96 px breathing room around it (`space.section.hero`) | 8–16 px gap to neighbors |

Stack three or more loud levers on the primary tier; stack three or more quiet levers on the support tiers. **Don't compromise the primary** — half-loud / half-quiet reads as indecision.

---

## 3. The "what should I look at first" test

Before shipping any section, ask:

1. **If I close my eyes for a second and re-open them, what jumps out first?**
2. **Is that the thing the user actually came for?**

If the answer to #1 is "nothing in particular" or "three things tied", you have an equal-weight problem. If the answer to #1 isn't the answer to #2, you have a mismatched-priority problem.

**Fix #1** by amplifying the primary tier (bigger, bolder, more isolation). **Fix #2** by removing or down-tiering whatever is currently dominant.

---

## 4. Per-surface patterns

### Hero (above the fold)

- One **headline** (display preset, 56–96 px, weight 600–700).
- One **subhead** (body lead preset, 18–22 px, weight 400, `text.secondary`).
- One **primary CTA** (Spring Green pill with `accent-glow`).
- Optional one **secondary CTA** (ghost or outline; never lime).
- Optional one **trust strip** (mono uppercase 11 px, opacity 60%) below the fold.

The hero is the highest-leverage surface in the system — see [`first-impression.md`](./first-impression.md).

### KPI / Stat block

- One **value** (display tabular, 48–64 px, weight 700).
- One **label** (eyebrow micro, 11 px uppercase tracked, `text.tertiary`).
- Optional one **trend** (small inline delta with arrow + tabular figure, `text.secondary`).

The number always wins. The label is whisper-tier.

### Card

- One **title** (heading preset, 18–24 px, weight 600).
- One **description** (body, 14–16 px, `text.secondary`).
- Optional **leading icon** (sized smaller than the title — 16–20 px).
- One **call-to-action** (link or ghost button, never lime unless the card is the primary action of the page).

Don't compete the icon with the title. Don't compete the CTA with the title.

### Section header

- One **eyebrow label** (12 px uppercase tracked, `text.tertiary`).
- One **section headline** (heading preset, 32–48 px, weight 600).
- Optional one **section subhead** (body lead, 18–22 px, `text.secondary`, capped at 65 ch).

Eyebrow + headline + subhead is the only legal combination. Don't add a card around it. Don't add a divider above it. Don't add an icon next to it.

### Pricing tier card

- One **plan name** (heading sm, 14 px uppercase or sentence-case).
- One **price** (display tabular, 48–64 px). The price is the focal point.
- One **CTA** (only the recommended tier ships in lime; others are ghost or outline).
- Bullet list of features (body, 14 px, `text.secondary`, with leading checkmark glyphs).

The recommended tier is amplified by an extra outline frame or a subtle lime hairline — *one* signal, not three.

### Operator dashboard section

- Eyebrow (12 px uppercase) + heading (20 px). No subhead.
- Dense table or KPI grid below.
- One row of secondary actions (ghost / outline) right-aligned.
- No hero, no marketing motion. Operator surfaces are dense — see [`spacing.md`](./spacing.md) §3.

---

## 5. Anti-patterns (these read as cheap)

These layouts read as cheap regardless of how technically polished they are:

- **The wall of cards.** A grid of 6 identical cards with no visual hierarchy between them. Pick one to amplify (size, accent, position) so the eye lands somewhere.
- **The competing CTAs.** Two primary lime buttons side by side. Per [ADR 0005](../../_meta/decisions/0005-warp-green-as-only-accent.md) and principle 6: one primary, others are ghost/outline.
- **The same-size headlines.** Section H2 at 36 px, sub-section H3 at 32 px — the user's eye can't tell which is which.
- **The decorative card.** A card containing one heading, no actions, no real content. Cards are containers for *content*, not for visual breaks.
- **Five trust badges of equal size.** Pick one to lead, render the rest as a quiet grid.
- **The stuffed section.** Eyebrow + heading + subhead + paragraph + 4 features + 2 CTAs + image. If you have eight things, you have no focal point. Cut to the *one*.
- **The over-iconified label.** "🚀 Fast" in a section headline. Icons can support a label; they cannot be the label.
- **The decorative gradient.** Per principle 3: no decorative gradients. The aurora is an *atmosphere*, not a hierarchy gesture.

---

## 6. Building hierarchy with type, before reaching for chrome

Per principle 3 ("less, but better"): always reach for typographic hierarchy before structural hierarchy.

| Need to separate | First try | Reach for second | Reach for last |
|---|---|---|---|
| Two paragraphs in a section | Stack space (`space.stack.md`) | Eyebrow label above each | Hairline divider |
| Two sections of a page | Section break (`space.section.md` or `lg`) | Heading + subhead | Card wrapper |
| Primary vs supporting CTA | Type weight + color (lime vs ghost) | Position (lead vs trail) | Size difference |
| Active vs inactive nav | Color contrast + weight + accent underline | Accent-tinted background | Card |
| Live vs dormant data | `LiveDot` pulse + lime tabular figure | Lime border accent | Color-shifted card bg |

**Cards are the last resort.** A card communicates "this content is contained" — it does not communicate hierarchy. If the type can do the work, let it.

---

## 7. The single-focal-point checklist

Before any section ships, walk through:

- [ ] I can name the **one** primary tier element of this section in a single sentence.
- [ ] The primary is at least 1.5–2× the visual weight of the next tier.
- [ ] No two elements at the same tier are competing for visual dominance.
- [ ] White space supports the hierarchy — the primary element has more room around it than the supporting ones.
- [ ] If I cover the primary with my hand, the section still makes sense (secondary/tertiary tiers are coherent on their own).
- [ ] If I cover the secondary tier, the primary is still legible and supported by the tertiary.
- [ ] I can explain to a stranger in 5 seconds what the section is for.

If any of these fail, the hierarchy needs work before the section ships.

---

## 8. One primary action per view (v0.15 R16)

The single-focal-point rule from §1 extends to interactive primary actions: **a view can show at most one primary CTA at a time.** Two greens for the same task makes the user's eye stall on "which one?"

### The contract

| Situation | Behavior |
|---|---|
| Page has data + a header CTA + no empty state | Header CTA is the primary action. |
| Page is empty + an `EmptyState` owns the CTA | Header CTA HIDES (`data-cta-suppressed="true"` on `.lumen-page-header`). EmptyState owns the action. |
| Page has data + needs a secondary action | Header CTA stays primary. Secondary moves to a `…` overflow menu, a Drawer "Open settings" link, or an inline action on the data row. |

The mechanism is the `.lumen-page-header[data-cta-suppressed="true"] .lumen-page-header-actions { display: none }` rule in `globals.css`. Wire `ctaSuppressed={items.length === 0}` at the consumer-app level. See [`page-header.md`](../05-patterns/page-header.md) for the canonical implementation + [`defensive-classes.md`](./defensive-classes.md) for the contrast contract on the CTA itself.

### Section headers — tagline cap

The page-header tagline carries at most **one line, max 80 characters**. The tagline is a scan-line, not a paragraph. If detail is needed, the choices are:

1. Move it to an info-tooltip on the title.
2. Move it to a contextual doc-link below the table / above the empty state.
3. Drop it entirely (most operator-console rows don't need a tagline at all).

For repeat-visit apps (operator consoles, daily-use tools, internal dashboards), set `data-onboarding="false"` on `.lumen-page-header` after the first session — the tagline drops entirely. First-visit users get the orienting copy; returning users get their information density back. See [ui-writing-style.md](../04-content/ui-writing-style.md).

### Why this matters

The TMS consumer audit (chat 36-A) caught this failure mode three times in one cycle:
- Autopilot + Recurring both shipped a top-right "New rule" CTA AND a dashed empty-state card with its own CTA. Two competing greens, no obvious primary.
- Section-header descriptions stretched to 2–3 lines of marketing copy on every page. Repeat-visit operators read it as noise on every load.
- The empty-state "primary" CTA appeared alongside an orphan top-right CTA — the user couldn't tell which was authoritative.

The `PageHeader` + `EmptyState` defensive classes coordinate via `data-cta-suppressed` to make the contract structural, not author-vigilant. AGENTS.md hard rule 25 codifies this; the lint enforces it indirectly (via the defensive-class shape).

---

## 8. Cross-references

- [`principles.md`](./principles.md) §2 — *Lead the eye — one focal point per section*
- [`typography.md`](./typography.md) — type scale, weight, presets that build hierarchy
- [`spacing.md`](./spacing.md) §3 — section spacing for marketing-vs-operator surfaces
- [`first-impression.md`](./first-impression.md) — hero anatomy and above-the-fold rules
- [`color.md`](./color.md) §1 — the four-color floor (hierarchy is built with restraint, not added hues)
- [`02-components/card/component.md`](../02-components/card/component.md) — when card chrome supports hierarchy
- Linear (linear.app), Stripe (stripe.com), Apple (apple.com) — canonical implementations
- Nielsen Norman Group — F-pattern eye-tracking research
