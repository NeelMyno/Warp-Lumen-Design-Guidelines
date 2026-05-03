---
name: UI writing style
type: content
version: 1.0.0
last_updated: 2026-05-02
related: [../00-foundations/voice-and-tone.md, ./microcopy.md]
---

# UI writing style

> The practical companion to `00-foundations/voice-and-tone.md`. Concrete patterns for buttons, headers, helper text, alerts.

## Sentence patterns

### Headlines (marketing)
- Statement of fact. Period. ("The freight network for builders.")
- Comparison. ("Same routes. Lower cost.")
- Imperative. ("Quote a lane.")
- Negation cadence. ("No portal sprawl. No setup.")

Avoid:
- Questions ("Looking to move freight?")
- Buzzword strings ("Cutting-edge AI-powered logistics")
- Personal address ("You'll love…")

### Headers (in-product)
- Noun-led. ("Shipments", "Active lanes", "Recent activity")
- Plural for collections. Singular for detail pages.
- Sentence case.

### Body copy
- One idea per sentence.
- Subject + verb + object. No nesting.
- Cut adjectives ruthlessly.

### Labels (UI controls)
- Buttons: verb + noun. ("Get rates", "Cancel order")
- Tabs: noun. ("Overview", "Settings")
- Eyebrow labels: noun, ALL CAPS, widest tracking. ("OPERATE", "ACTIVE · 12")
- Form labels: noun. ("Pickup ZIP", "Weight")

### Hints / helper text
- Single sentence.
- Lead with what; explain why if needed.
- Examples are valuable: ("e.g. 90210 or LAX")

## Number formatting

| Type | Format | Example |
|---|---|---|
| Money (default) | `$X` | $262 |
| Money (precise) | `$X.XX` | $1,243.50 |
| Currency in tables | `$X.XX` always | $262.00 |
| Weight | `X lb` (lowercase) | 520 lb, 2,100 lb |
| Distance | `X mi` | 412 mi |
| Time (24h, operator) | `HH:MM` | 04:18 |
| Time (12h, marketing) | `H:MM AM` | 4:18 AM |
| ETA | `Today · HH:MM`, `Tomorrow · HH:MM`, `Wed HH:MM` | Today · 04:18 |
| Percentage (operator) | `X.X%` | 98.2% |
| Percentage (marketing) | `X%` | 98% |
| Counts (small) | exact | 12 |
| Counts (large) | with thousands separator | 1,547 |
| Counts (very large) | `XK+` / `XM+` | 655K+ |
| Decimal places | match the precision the user needs | weight to nearest lb; price to nearest cent |

## Verbs

Strong verbs Lumen uses:

`book`, `quote`, `route`, `tender`, `pick up`, `deliver`, `track`, `cancel`, `re-route`, `escalate`, `confirm`, `pause`, `resume`, `schedule`, `dispatch`.

Weak verbs Lumen avoids:

`make sure`, `take a look`, `try`, `attempt`, `kindly`, `please go ahead`, `feel free`.

## Voice in error states

The system is responsible for failures, not the user.

| Bad | Good |
|---|---|
| "Your request failed." | "We couldn't reach the carrier." |
| "Invalid input." | "ZIP must be 5 digits." |
| "Oops! Something went wrong." | "Quote service is offline. Retrying in 30 s." |
| "Please try again." | "Retry now." |

## Voice in success states

Brief. Past tense. No celebration.

| Bad | Good |
|---|---|
| "Awesome! Your shipment was successfully booked!" | "Booked. Tracking is live." |
| "🎉 Order placed!" | "Order placed." |
| "Great choice! Saving…" | "Saving…" |

## Tooltips

- Single line.
- 80 characters max.
- Sentence case. No end punctuation.
- Explain function, not the obvious.

| Bad | Good |
|---|---|
| "Click to select." | "Hold ⌘ to multi-select" |
| "Filter the list." | "Filter by status, lane, carrier" |

## Onboarding

- Skip cute. Show the product. Link to docs.
- Default empty state on first run: "There is no setup. Quote a lane."
- Never use: "Welcome aboard", "You're all set", "Let's get started".

## When unsure

Ask: "Would a senior operator at a logistics company say this in a meeting?" If no, rewrite.
