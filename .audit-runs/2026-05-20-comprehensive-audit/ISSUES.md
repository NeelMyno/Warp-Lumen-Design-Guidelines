# 2026-05-20 — Comprehensive audit (R12) — issues catalog

> Walked every route in dark + light mode at desktop + mobile, with interaction sweep, console + network inspection, and a11y probes. Driven via Claude in Chrome MCP against Edge browser on Personal Mac.

## Severity legend

- **P0** — broken contract, visual regression, or accessibility failure. Must fix.
- **P1** — visible inconsistency or papercut that erodes the polish bar. Should fix.
- **P2** — nice-to-have polish; deferrable to a future round.

---

## Issue R12-001 — `--text-tertiary` collapsed to `--text-secondary` in dark mode (P0)

**Where.** `audit-dashboard/src/app/globals.css` line 630.

**Symptom.** In dark mode, `--text-secondary` and `--text-tertiary` both resolve to `#9A9A9A` (obsidian-3). The text ladder collapses from 3 tiers to 2 — every UI that uses `text-tertiary` (eyebrow labels, hints, captions, table-row meta, "ON THIS PAGE" rail labels) reads at the same contrast as body secondary text, breaking the visual hierarchy.

**DTCG spec** (`design-system/01-tokens/semantic/color.dark.tokens.json`):
```
"text": {
  "secondary": { "$value": "{color.brand.300}", … }, // #9A9A9A — 6.9:1 AA Normal
  "tertiary":  { "$value": "{color.brand.400}", … }  // #6B6B6B — 3.65:1 AA Large
}
```

**Runtime** (globals.css 629–631):
```css
--text-secondary:  var(--lumen-obsidian-3); /* #9A9A9A */
--text-tertiary:   var(--lumen-obsidian-3); /* ← BUG: should be obsidian-4 #6B6B6B */
--text-placeholder: var(--lumen-obsidian-3); /* ← also wrong; placeholder aliases tertiary */
```

This is a direct docs↔code sync violation, which is the exact contract R11 codified.

**Cascade.** Once tertiary → obsidian-4, `--text-disabled` (currently obsidian-4) collides with the new tertiary. Need to either (a) move disabled to obsidian-5 (#404040, fails AA but is WCAG-exempt for disabled per 1.4.3 Note 3) and accept lower perceptibility, or (b) keep disabled at obsidian-4 and let the disabled state distinguish via bg + cursor + opacity rather than text-color alone.

**Primitive comments are stale.** `globals.css` lines 98–99 label obsidian-3 "tertiary" and obsidian-4 "secondary" — the OPPOSITE of the DTCG semantic mapping. The primitive comments need to be re-aligned.

**Proposed fix.** Match runtime to DTCG semantic spec:
```css
--text-tertiary:    var(--lumen-obsidian-4);  /* #6B6B6B — 3.65:1 AA Large */
--text-placeholder: var(--lumen-obsidian-4);
--text-disabled:    var(--lumen-obsidian-5);  /* #404040 — disabled is WCAG-exempt */
```
Update the primitive comments at lines 98–99 to match. Update `color.dark.tokens.json` `text.disabled` to `{color.brand.500}` if not already. Verify foundations Color showcase still tells the right story.

---

## Issue R12-002 — Elevation row visually undifferentiated on dark canvas (P2)

**Where.** `/foundations` Elevation section → 6-card ladder row (`shadow.xs / sm / md / lg / xl / 2xl`).

**Symptom.** On the obsidian canvas, the 6 shadow tokens cast shadows that are nearly indistinguishable from one another. The cards read as a flat row of identical cards rather than a ladder of elevation. R11 retired green halos correctly; the side-effect is that dark-mode elevation now relies entirely on subtle neutral box-shadows that the deep canvas absorbs.

**Why this isn't a token bug.** The shadow values are mathematically correct per the DTCG spec. The issue is perceptual: drop shadows against a near-black surface have very little visual contrast.

**Proposed fix.** Augment the foundations Elevation showcase (not the tokens) with a per-card hairline `border-strong` outline so the cards read as distinct surfaces, plus an inset highlight on the top edge to communicate the lift. Keeps the tokens canonical; sharpens the demo.

---

## Issue R12-003 — LazyMount renders empty placeholders on SSR + first paint (P0)

**Where.** `audit-dashboard/src/components/lazy-mount.tsx` line 87–130, used on `/library` (23 sections wrapped).

**Symptom.** The SSR HTML for `/library` returns only the above-the-fold content + 23 placeholder divs (8492px and below). The lazy sections — Navigation, Buttons & actions, Inputs & forms, Selection, Pickers, Uploads, Data Display, Tables, Charts, KPI, Feedback, Modals, Notifications, Mobile, Commerce, Auth, AI · Chat, Editor, State Matrix, Templates, Trust, Marketing, Spec — are NOT in the initial HTML. Verified via `curl http://localhost:3000/library | grep "Get rates\|Save draft\|All shipments\|Quote name"` → 0 matches.

**Code intent.** The component's doc comment at line 16–19 says:
> "The component is SSR-safe: when typeof IntersectionObserver is undefined (Node prerender), it short-circuits to mounted=true so the server output still contains the full DOM (needed for SEO, screen-reader pre-walk, and the audit-dashboard's 'everything searchable on a single page' contract)."

**Why this fails.** `useState(eager)` initializes to `false` (default `eager` value). On the server, `useEffect` never runs, so the IntersectionObserver fallback at line 101–104 never fires. Server outputs the placeholder div. The doc comment is aspirational.

**Real-world consequences.**

1. **Cmd+F broken.** A user landing on `/library` and searching for "Tags input" or "Color picker" finds nothing — those sections are unmounted until scrolled past.
2. **Screen-reader pre-walk broken.** A reader walking the page on landing announces only the above-the-fold content + 23 nameless `aria-hidden` placeholders.
3. **JS-disabled users see empty.** Without JavaScript, IntersectionObserver never fires → the lazy sections stay empty forever.
4. **Fast scroll shows black void.** When the user scrolls faster than `rootMargin=400px` provides buffer, the visible viewport lands inside a placeholder that has no skeleton, no shimmer, no content — just a black rectangle. Captured in screenshots at 8492 px / 9992 px / 11492 px scroll positions.

**Layout shift risk.** All placeholders are 500 px tall. When the actual section is taller (some are 1800+ px), mounting causes the document to grow by 1300+ px. The metrics say CLS=0.000, but that's because the IntersectionObserver mounts sections BEFORE they enter the viewport — the growth happens above the fold of the scroll position, not in-view. So CLS stays at 0 but the page jumps around outside the user's attention zone.

**Proposed fix.** Two-part:

1. **Make the placeholder visually communicative.** Add a subtle skeleton shimmer (matching the existing `--surface-skeleton-base` and `--surface-skeleton-shimmer` tokens from /foundations Skeleton showcase) inside the placeholder so a fast-scroll user sees "section loading" rather than a black void.

2. **Increase the `rootMargin` default from `400px` to `1000px`.** At normal scroll speeds (3–5 ticks per second × 100 px/tick = 300–500 px/sec), 400 px gives ~1 sec of warning. Power-scrollers (10-tick swipes) can outrun this. 1000 px gives ~2 sec of warning even at fast scroll.

3. **Update the lazy-mount.tsx doc comment** to drop the false SSR-safety claim and document the actual contract: "client-side performance optimization that defers below-the-fold sections until scrolled near, at the cost of SSR-rendered-DOM completeness."

4. **Set the heuristic in AGENTS.md hard rule 17 + the lazy-mount doc** that LazyMount should ONLY be used on routes where SEO + Cmd+F + screen-reader-prewalk aren't critical contracts. The audit-dashboard is internal-only, but consumer apps should evaluate before adopting.

---

## More issues to follow as audit continues
