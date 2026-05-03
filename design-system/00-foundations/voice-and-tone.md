---
name: Voice and tone
type: foundation
version: 1.0.0
last_updated: 2026-05-02
audience: [writer, designer, engineer, llm-agent]
related: [./principles.md, ../04-content/ui-writing-style.md]
---

# Voice and tone

> How Lumen sounds. Modeled on Warp's own marketing copy: declarative, matter-of-fact, numerate. Almost no adjectives. Reads like a senior operator, not a marketer.

## Voice attributes

| Attribute | We are | We are not |
|---|---|---|
| Cadence | Short. Fragmenting. | Run-on, breathless |
| Stance | Operator-confident | Fawning, salesy |
| Vocabulary | Concrete (lane, BOL, dock, pallet, ETA) | Abstract (synergy, journey, magic) |
| Adjectives | Sparse, earned | Dense, decorative |
| Numbers | Front and center | Hidden in prose |
| Apologies | When warranted, brief | Performative |
| Humor | Dry, when appropriate | Cute, ironic, winky |

## Voice signatures (verbatim from Warp marketing)

These set the bar for any new copy:

> "The open source freight network."
>
> "More shipments on the same routes. Lower cost per pallet. AI keeps it dropping."
>
> "Every shipment makes the network stronger for everyone."
>
> "Built by people who've lived every layer of freight."
>
> "No ornamental process. Engineers ship code that controls physical freight."
>
> "One command quotes. One books. JSON out, pipes in."
>
> "Ship freight without leaving your terminal."
>
> "Stop logging into 10 carrier portals every morning."
>
> "There is no implementation. You log in, get rates, book, track."

Notice: declarative, fragmenting, numerate. Heavy use of "no X. no Y. Z." cadence. Zero adjectives where a number would do.

## Tone shifts (situational)

The voice stays the same. The tone modulates with the moment.

| Moment | Tone | Example |
|---|---|---|
| Marketing hero | Confident, tight | "The freight network for builders." |
| Empty state | Helpful, not chirpy | "No tasks today. New quote starts a lane." |
| Loading state | Quiet, factual | "Quoting 14 carriers…" |
| Success | Brief, no celebration | "Booked. Tracking is live." |
| Warning | Direct, suggest action | "ETA slipped 4 hours. Re-route?" |
| Error | Plain, blame the system | "Quote failed. We are retrying." |
| Destructive confirmation | Slow down, repeat the noun | "Cancel order WRP-9824? This cannot be undone." |
| Onboarding | Skeptical of itself | "There is no setup. Log in and quote." |
| Legal / policy | Plain English first, jargon second | "We hold each carrier contract on your behalf." |

## Capitalization

- **Sentence case** for all UI labels, button text, headings, table headers, navigation. ("Save changes", not "Save Changes".)
- **ALL CAPS** is reserved for eyebrow labels at 12px with tracked spacing. Two cuts:
  - `eyebrow.sans` — 12px sans, 0.10em tracking. Section eyebrows above titles. `OPERATE`, `NETWORK`, `PRICING`.
  - `eyebrow.mono` — 12px mono, 0.16em tracking. **System metadata signature.** `[•] SYSTEM V0.5 LIVE`, `@ DIGITAL HQ / GLOBAL ACCESS`, `INVITES IN:`. Reserve for state, version, region, status — never for human-facing copy.
- **Title Case** is used only for proper nouns and product names (Lumen, Warp, Sterling LTL, Apple HIG).

## Italic — three rules

Satoshi ships true italics (separate Variable file, not slanted oblique). `font-synthesis: none` is set globally so the browser cannot fake italic from upright Regular.

1. **Italic = emphasis.** A single word or short phrase that genuinely shifts meaning. Never for "vibe."
2. **Italic = citation, foreign terms, ship names.** Book titles, untranslated phrases (`façon de parler`, `ad hoc`), carrier vessels.
3. **Italic ≠ system text.** Loading states ("Quoting…"), error toasts, status pills, button labels, table headers, eyebrows are all upright. Italic on a system message reads as editorial commentary, not system fact.

The `display.italic.accent` preset enables the brutalist "one italic word per hero" treatment (e.g., italicising _builders_ in "The freight network for builders."). Renders in `text-accent` (lime). At most one per page.

## Numbers

- **Always use tabular monospace for numbers in UI.** Reach for the `data.*` or `metric.*` semantic preset, or `body.tabular` for inline figure runs. These bake `font-variant-numeric: tabular-nums lining-nums slashed-zero` into the token. Never manually set `font-feature-settings: "tnum"` — it overrides `font-variant-numeric` and silently drops slashed zero.
- **Money:** `$262`, `$1,243.50`. Currency symbol attached to first digit; no space.
- **Weights:** `520 lb`, `2,100 lb`. Unit detached, lowercase.
- **Time:** `04:18`, `Today · 9:30 AM`. 24-hour for operator UI; 12-hour for marketing.
- **ETAs:** `Today · 04:18`, `Tomorrow · 12:30`, `Wed 10:00`.
- **Percentages:** `98.2%`. One decimal for accuracy in operator views; integer in marketing (`98%`).
- **IDs:** Always mono. Slashed zero mandatory (disambiguates `0` from `O`). Use `data.sm` for ID columns: `WRP-9824`, `DRY-93H7`.

## Microcopy templates

### Buttons
- Lead with a verb: "Save changes", "Get rates", "Book now".
- For destructive actions, say what disappears: "Delete shipment WRP-9824".
- Loading states use present continuous: "Saving…", "Quoting…".
- Never end with "now" or "here" unless required ("Get started" not "Get started now").

### Empty states
- Two lines max.
- Line 1: state the absence. ("No active shipments.")
- Line 2: state the next action with a verb. ("New quote starts a lane.")

### Errors
- Blame the system, not the user. ("We couldn't reach the carrier" beats "Your request failed").
- Suggest the next action.
- Never use red+exclamation alone. Always pair with text.

### Toasts
- Past tense for completed actions ("Booked").
- Present continuous for ongoing ("Quoting 14 carriers…").
- Auto-dismiss at 6–8s for success; sticky for errors until acknowledged.

### Tooltips
- Single line, 80 chars max.
- Sentence case, no end punctuation.
- Explain function, not the obvious. ("Hold ⌘ to multi-select" not "Click to select").

### Onboarding
- Skip cute. Show product, link to docs.
- Never use "welcome aboard," "you're all set!", or "let's get started!"
- Default copy on a new account view: "There is no setup. Quote a lane."

## Things we never say

- "Awesome", "amazing", "incredible", "delight", "magic", "synergy", "journey", "ecosystem", "robust", "best-in-class", "world-class", "cutting-edge", "innovative", "disrupt", "revolutionary".
- "Don't worry," "no worries", "oops", "uh-oh".
- "Welcome aboard", "you're all set", "let's get started".
- "Powered by AI" used as decoration. (If AI does the work, name what it does.)
- "Just" as a softener ("just click here") — patronising.
- Exclamation marks in any product or marketing copy. Two exceptions: brand statement and confirmation toasts where excitement is genuine.

## Voice for LLM agents

When generating any copy for Lumen:
1. Strip three adjectives.
2. Replace one verb with a stronger one.
3. Cut one sentence.
4. Read it aloud once. If it sounds like a senior operator at a logistics company, ship it. If it sounds like a marketing intern, rewrite.

## Related

- [UI writing style](../04-content/ui-writing-style.md)
- [Error messages](../04-content/error-messages.md)
- [Empty states](../04-content/empty-states.md)
- [Microcopy library](../04-content/microcopy.md)
