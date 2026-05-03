# ADR 0006 — Pair Satoshi with JetBrains Mono

- **Date:** 2026-05-02
- **Status:** Accepted
- **Deciders:** Lumen working group

## Context

The user has locked **Satoshi** as the primary UI face for Lumen (Warp's actual production face is Space Grotesk, but Satoshi is a sensible thematic substitute — both geometric sans). Lumen needs a mono companion for numerics, code, terminal output, table cells, IDs, ETAs, money — anything that benefits from tabular alignment. Warp's production face is Fira Code; we evaluated whether to keep Fira Code or pick a Satoshi-aware companion.

Candidates:
- **JetBrains Mono** (OFL, free, open).
- **Fira Code** (OFL, free, open) — Warp's actual choice.
- **Berkeley Mono** (paid, $75 personal / ~$200 commercial) — premium, terminal-first.
- **IBM Plex Mono** (OFL, free).

## Decision

**Pair Satoshi with JetBrains Mono.**

Both are free under permissive licenses (Satoshi: ITF-FFL; JetBrains Mono: OFL). Used wherever numbers appear (KPIs, tables, money, ETAs, weights, code, terminal output). Tabular numerics enabled by default via `font-feature-settings: "tnum" 1`.

Editorial pair: **Source Serif 4** (Adobe, OFL, variable with `opsz` axis). Used only for longform marketing/blog moments — never UI chrome.

Plan B sans: **Inter** (OFL). Documented as the swap if (a) ITF licensing changes, (b) Warp expands into Cyrillic/Greek markets that Satoshi can't render, (c) Windows ClearType QA fails at 12-14 px.

## Consequences

**Positive:**
- JetBrains Mono is the closest Satoshi-aligned mono: geometric grotesque DNA, similar x-height, disambiguated `0/O 1/l/I` for terminal-adjacent contexts.
- Hinted aggressively for Windows ClearType. Renders well at 12-14 px.
- Variable font available — lets us mirror Satoshi's hierarchy in monospace.
- Both faces are free, no vendor lock, easy to ship.

**Negative:**
- Slightly less brand-distinctive than Berkeley Mono. Acceptable — JetBrains Mono is still recognizable as a quality terminal-grade face.
- Source Serif 4 means a third file to ship for editorial moments. Mitigation: only loaded on `/blog`, `/changelog`, `/press`.

**Tradeoffs not chosen:**
- Berkeley Mono would give the brand more typographic personality but adds licensing complexity (~$200/yr per app) for marginal gain.
- Fira Code — the Warp production choice — is fine, but JetBrains Mono renders slightly better at small UI sizes (better x-height match to Satoshi).
- IBM Plex Mono is a strong candidate; tied closely with JetBrains Mono. Picked JetBrains Mono for slightly better Latin coverage.

## License action item (open)

Have legal pull canonical ITF-FFL text from `https://www.fontshare.com/licenses/itf-ffl` and archive a PDF copy with the build (the live page is JS-rendered).

## References

- `/research/satoshi-typography.md` — full evaluation
- `/research/lumen-brief.md` § D-003
- `/design-system/01-tokens/primitives/typography.tokens.json`
