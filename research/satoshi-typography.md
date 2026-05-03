---
title: Satoshi Typography — Specification, Pairing, Scale
date: 2026-05-02
type: research
tags: [research, typography, satoshi, fonts]
sources_count: 14
status: draft
---

# Satoshi for Warp's Design System

## TL;DR
- **Satoshi** is a Swiss-style modernist sans by **Deni Anggara** (Jakarta) for **Indian Type Foundry**, distributed free through **Fontshare** under the **ITF Free Font License (ITF-FFL)** — closed-source but explicitly free for personal and commercial use.
- 5 weights × upright + italic = 10 static styles (Light, Regular, Medium, Bold, Black) plus a variable file with a weight axis.
- Critical license fact: ITF states the font is **"100% free for personal and commercial use… in any media, at any scale, and in any location worldwide,"** with no attribution required. Self-hosting and embedding in apps is permitted; reselling the font files is not.
- **Recommended pair: Satoshi (UI text + display) + JetBrains Mono (code/numerics/tables).** Both are free, OFL-friendly or FFL, render well across Mac/Windows/iOS/Android, and have visually compatible x-heights and stroke contrast.
- **Editorial pair: Source Serif 4 (Adobe, OFL).** Variable font with optical sizes; humanist warmth that balances Satoshi's geometric precision for longform marketing.
- **Plan B sans: Inter (OFL).** Battle-tested system-replacement sans with the broadest hinting and language coverage of any free face — use as the alt if Satoshi rendering or licensing becomes a problem on any platform.
- **System fallback chain:** `'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI Variable', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`.
- **Recommended scale: 1.25 (Major Third)** with 16px base, applied identically across web/desktop and mapped to Dynamic Type / Material roles on mobile.

## Satoshi facts

| Field | Value |
|---|---|
| Foundry | Indian Type Foundry (ITF), Ahmedabad, India |
| Designer | Deni Anggara (Jakarta, Indonesia) |
| Released | March 2021 (v1.0); v2.000 published 2024-01-17 |
| Classification | Geometric / Swiss-modernist sans-serif with subtle humanist details |
| Weights | 5 — Light, Regular, Medium, Bold, Black |
| Italics | Yes — true italics for all 5 weights (not slanted obliques) |
| Total static styles | 10 |
| Variable axes | Weight (`wght`) — single-axis variable font; one upright VF and one italic VF |
| File formats from Fontshare | OTF, TTF, WOFF, WOFF2 (web kit + desktop kit) |
| Copyright notice | "Copyright 2017–2021 Indian Type Foundry. All rights reserved. Satoshi is a trademark of the Indian Type Foundry." |
| License | **ITF Free Font License (ITF-FFL)** — closed source, free for personal and commercial use; not OFL |
| OpenType features | 10 ligatures; alternate single-storey `a` and `g`; alternate `G` and `t`; proportional lining (default), tabular lining, numerators, denominators |
| Character set | Basic Latin, Latin-1 Supplement, Latin Extended-A, Latin Extended-B, combining diacritical marks. **No Cyrillic, no Greek, no Vietnamese-tone diacritics.** Covers most Western/Central/Northern European Latin languages (English, French, German, Spanish, Italian, Portuguese, Polish, Turkish, Dutch, Serbian-Latin, Kurdish, etc.) |
| Symbol set | 10 directional arrows, 6 geometric shapes (circles, squares, triangles), peace sign, smiley, check mark, two sets of numerals 1–9 in filled circles |
| Designer's stated intent | Per ITF/Fontshare: "Swiss style modernist sans serif type family characterized by the play between elegant rounded shapes and sharp angular details." Designed for branding, editorial, UI, and identity systems where modern geometric precision is wanted but pure-geometric coldness is not. |

### License — exact wording and what it permits
ITF's official Fontshare announcement states the fonts are **"100% free for personal and commercial use. You can use them in any media, at any scale, and in any location worldwide."** The license is named the **ITF Free Font License (ITF-FFL)** — sometimes shortened to "Fontshare license." It is **not** OFL.

What ITF-FFL allows (per the Fontshare announcement and FAQ pattern):
- Personal use
- Commercial use in print, digital, broadcast — no royalty
- Web self-hosting on your own servers
- Embedding in iOS, Android, macOS, and Windows applications
- Worldwide use, no per-impression / per-pageview cap (unlike ITF's commercial EULAs)
- No attribution required

What it does **not** allow:
- Redistributing the font files (e.g., on your own font CDN or a "free fonts" site)
- Selling the font files standalone
- Modifying the font files (no derivative fonts)
- Reverse engineering or extracting the outlines

> [!warning] Action item before launch
> Have legal pull the canonical ITF-FFL text from `https://www.fontshare.com/licenses/itf-ffl` and archive a PDF copy with the build. The Fontshare site renders the license via JavaScript and is not crawler-friendly, so the live canonical text is the one to keep on file. The "free for personal and commercial use, worldwide" guarantee is from ITF's own launch post.

## Recommended pairings

### Primary mono pair → **JetBrains Mono**
- **Foundry:** JetBrains
- **License:** SIL Open Font License 1.1 (OFL)
- **Why it pairs:**
  - Geometric grotesque with humanist details — same DNA as Satoshi (rounded counters, slightly humanist terminals).
  - x-height closely matches Satoshi at the same point size, so inline code in body text doesn't visually pop.
  - Disambiguated `0/O`, `1/l/I`, `i/j` — critical for terminal output, prompts, command names. Warp is a terminal-adjacent product, so this is the right table-stakes character.
  - Wide weight range (Thin → ExtraBold + italics) lets you mirror Satoshi's hierarchy in monospace.
- **Platform/rendering notes:** Hinted aggressively for Windows ClearType. Renders well at 12–14px, the typical UI mono size. Variable font available.
- **File sizes:** ~22–35 KB per static weight as woff2 (Latin subset).

**Alternative mono if you want more typographic personality:** **Berkeley Mono** (Berkeley Graphics, paid, ~$75 personal / ~$200 commercial) — more idiosyncratic, designed for terminal-first products like Warp; closer in mood to what Warp's audience already chooses voluntarily. Recommend keeping JetBrains Mono as primary because it's free and dependency-free; consider Berkeley Mono only if Warp's marketing wants to use a proprietary mono as a brand signature.

### Serif / editorial pair → **Source Serif 4**
- **Foundry:** Adobe
- **License:** SIL Open Font License 1.1 (OFL)
- **Why it pairs:**
  - Transitional/humanist serif designed by Frank Grießhammer to complement Source Sans — proportions and contrast are tuned for screen reading at editorial sizes.
  - Variable font with **two axes: weight (200–900) and optical size (`opsz`)**. The `opsz` axis is rare and valuable: it lets the same family serve display headlines and body copy without rendering compromises.
  - 60 styles total (6 weights × 5 optical sizes × upright/italic).
  - Serif's vertical contrast and warm humanist terminals balance Satoshi's clean geometry — the contrast is intentional, not jarring.
- **Platform/rendering notes:** Hinted, ships from Adobe's GitHub, well-tested across browsers.
- **Use case:** Long-form blog, marketing essays, changelog entries with editorial tone, case studies. Not for UI chrome.
- **File sizes:** Variable font ~115 KB woff2 (single file covers all weights).

**Alternative serif** if you want something more contemporary: **Fraunces** (OFL, designed by Phaedra Charles & Flavia Zimbardi for Undercase) — softer, more expressive, with `opsz` and `SOFT` axes. Use Fraunces if Warp's editorial voice is warmer/playful; use Source Serif 4 if it's neutral/technical.

### Sans alternative (Plan B) → **Inter**
- **Foundry:** Rasmus Andersson (independent)
- **License:** SIL Open Font License 1.1 (OFL)
- **Why it's the right Plan B:**
  - The single most-used free UI sans in the industry — every product designer in 2026 has tested it.
  - Variable font with `wght` (100–900), `slnt` (slant axis), and OpenType Display/Text optical adjustments via stylistic sets.
  - Far broader language coverage than Satoshi: Latin Extended, Cyrillic, Greek, Vietnamese diacritics. **If Warp ever ships in markets Satoshi can't render, Inter is the fallback.**
  - x-height ratio almost identical to Satoshi (~0.72 em) — a swap is visually minimal.
  - OFL means it can be redistributed inside an Electron desktop bundle without legal review.
- **Platform/rendering notes:** Best-in-class hinting for Windows ClearType. Used as the de facto system replacement on the web.
- **File sizes:** Variable font ~95 KB woff2 (full Latin); ~16 KB subset for English-only.

**When to flip to Inter:**
1. ITF revokes or modifies the FFL (low risk, but possible).
2. Warp expands into markets requiring Cyrillic/Greek/Vietnamese.
3. A specific app store or platform raises licensing flags about closed-source FFL fonts in the bundle.

### System stack fallback (when Satoshi can't load)
Use this as the `font-family` declaration for body text:
```css
font-family: 'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI Variable',
             'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

Why this order:
- `-apple-system` / `BlinkMacSystemFont` → SF Pro on macOS/iOS/Safari (closest x-height to Satoshi of any system font).
- `'Segoe UI Variable'` → Windows 11 default (variable; better than legacy Segoe UI).
- `'Segoe UI'` → Windows 10 fallback.
- `Roboto` → Android system default.
- `'Helvetica Neue'` → older macOS / iOS legacy.
- `Arial` → universal fallback.
- `sans-serif` → generic terminal fallback.

For mono, the parallel chain:
```css
font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco,
             Consolas, 'Liberation Mono', 'Courier New', monospace;
```

## Recommended type scale

**Scale ratio: 1.25 (Major Third) on a 16px base.**

Reasoning:
- 1.125 (Major Second) is too tight — display sizes don't get enough visual lift, hierarchy collapses.
- 1.333 (Perfect Fourth) is too wide for multi-platform — the gap between H2 and H3 blows past mobile viewport widths.
- 1.2 is acceptable but loses display impact.
- **1.25 is the sweet spot:** clean integer-friendly steps (16, 20, 25, 31, 39, 49, 61), works on web at 16px base, maps cleanly to iOS Dynamic Type Body 17pt and Android Body Large 16sp.

| Role | Size (px / rem) | Line-height | Tracking | Weight | Use case |
|---|---|---|---|---|---|
| Display XL | 64 / 4.0 | 1.05 (67px) | -0.03em | Bold | Hero marketing headline, landing page |
| Display L | 49 / 3.0625 | 1.08 (53px) | -0.025em | Bold | Section opener, marketing |
| Display M | 39 / 2.4375 | 1.1 (43px) | -0.02em | Bold/Black | Page title, large card |
| H1 | 31 / 1.9375 | 1.15 (36px) | -0.015em | Bold | Page title (app), feature card |
| H2 | 25 / 1.5625 | 1.2 (30px) | -0.01em | Medium/Bold | Section header |
| H3 | 20 / 1.25 | 1.3 (26px) | -0.005em | Medium | Subsection, card header |
| Body L | 18 / 1.125 | 1.5 (27px) | 0 | Regular | Lead paragraph, callout body |
| Body | 16 / 1.0 | 1.5 (24px) | 0 | Regular | Default body, UI text |
| Body S | 14 / 0.875 | 1.45 (20px) | 0.005em | Regular | Secondary text, table cells |
| Caption | 13 / 0.8125 | 1.4 (18px) | 0.01em | Regular/Medium | Labels, metadata |
| Micro | 12 / 0.75 | 1.35 (16px) | 0.015em | Medium | Badges, timestamps, hints |
| UI Label | 14 / 0.875 | 1.0 (14px) | 0.02em UPPERCASE | Medium | Button text, tabs, eyebrow |
| Code Inline | 14 / 0.875 | 1.5 (21px) | 0 | Regular (Mono) | Inline code, command names |
| Code Block | 13 / 0.8125 | 1.5 (19.5px) | 0 | Regular (Mono) | Code blocks, terminal output |

**Tracking principle:** tighter as size increases (display sizes need optical compensation for too-loose default), looser as size decreases (small sizes need air for legibility). Satoshi has slightly tight default spacing — these adjustments are tuned for it specifically.

**Weight principle:** Use Bold for display and titles, Medium for subheads and UI labels, Regular for body. Avoid Light for any UI text (sub-100 contrast on dark mode at body sizes); reserve it for >32px display only. Black is for emphasis moments (logo lockups, hero impact words), never for body or H3+.

## Per-platform guidance

### Web (CSS, font-display, preload, subsetting)
- **Self-host woff2.** Don't link Fontshare's CDN — the FFL allows self-hosting and it's the only way to guarantee performance/uptime.
- **Subset to Latin only** unless you ship in markets needing Latin Extended. A Latin-only subset of Satoshi Regular is ~22–28 KB woff2 vs. ~45 KB for the full file.
- **`font-display: swap`** for body text (`Regular`, `Medium`) — accept the FOUT to keep LCP fast.
- **`font-display: optional`** for display weights (`Bold`, `Black`) — if they don't load in the 100ms budget, fall back to system font for that page render. Acceptable trade-off because display weights are mostly above-the-fold but not critical to comprehension.
- **Preload only what's above-the-fold:** typically Regular and Bold. Skip Light, Medium-Italic, Black-Italic in preload — let them lazy-fetch.
  ```html
  <link rel="preload" as="font" type="font/woff2"
        href="/fonts/satoshi-regular-latin.woff2" crossorigin>
  <link rel="preload" as="font" type="font/woff2"
        href="/fonts/satoshi-bold-latin.woff2" crossorigin>
  ```
- **Use `unicode-range`** to split into Latin / Latin-Ext subsets so browsers only fetch what the page actually uses.
- **Variable font option:** ship the single Satoshi variable woff2 (~75–95 KB est.) instead of multiple statics if you use 3+ weights. Crossover point is roughly 3 weights.

### iOS (Dynamic Type, semantic sizes, fallback)
- **Bundle Satoshi as a custom font** in the app target. Register in `Info.plist` under `UIAppFonts`.
- **Wrap Satoshi inside Apple's Dynamic Type system.** Use `UIFont(descriptor:size:)` with `UIFontMetrics.default.scaledFont(for:)` so user-set Accessibility text sizes still work. This is non-negotiable for App Store compliance and accessibility.
- **Map Warp's scale to Apple's text styles:**
  - `largeTitle` → Display M (39pt) Bold
  - `title1` → H1 (31pt) Bold
  - `title2` → H2 (25pt) Bold
  - `title3` → H3 (20pt) Medium
  - `headline` → Body (16pt) Medium
  - `body` → Body (16pt/17pt) Regular
  - `callout` → Body S (14pt/15pt) Regular
  - `subheadline` → Caption (13pt) Regular
  - `footnote` → Caption (13pt) Regular
  - `caption1` → Micro (12pt) Regular
  - `caption2` → Micro (12pt) Medium
- **Fallback:** SF Pro Text via `-apple-system` equivalent. iOS will auto-fallback if Satoshi fails to register; no extra code needed but verify in QA.

### Android (Material type roles, fallback)
- **Bundle Satoshi as a font resource** under `res/font/` and reference via `fontFamily` in your theme.
- **Map to Material 3 type roles:**
  - `displayLarge` (57sp) → Display XL Bold
  - `displayMedium` (45sp) → Display L Bold
  - `displaySmall` (36sp) → Display M Bold
  - `headlineLarge` (32sp) → H1 Bold
  - `headlineMedium` (28sp) → H2 Bold
  - `headlineSmall` (24sp) → H3 Medium
  - `titleLarge` (22sp) → Body L Medium
  - `titleMedium` (16sp) → Body Medium
  - `titleSmall` (14sp) → Body S Medium
  - `bodyLarge` (16sp) → Body Regular
  - `bodyMedium` (14sp) → Body S Regular
  - `bodySmall` (12sp) → Caption Regular
  - `labelLarge` (14sp) → UI Label Medium
  - `labelMedium` (12sp) → Micro Medium
  - `labelSmall` (11sp) → Micro Medium
- **Fallback:** Roboto. Android will fall back automatically. Test on Android 7+ (API 24+) where downloadable fonts and `fontFamily` are stable.
- **Note:** Satoshi's hinting was not specifically tuned for Android's FreeType rasterizer. Anecdotal reports suggest it renders well at ≥14sp; below that, prefer Roboto for very small text on lower-density devices.

### Native desktop (Mac, Windows ClearType notes)
- **macOS:** No issues. Register via `NSFont` or bundle in app's Resources. Renders identically to web/iOS thanks to consistent CoreText rendering pipeline.
- **Windows ClearType:** This is the highest-risk platform. Satoshi was designed primarily for screen branding and modern web, not deep-hinted for Windows GDI/ClearType the way Inter or Segoe UI is. Specifically:
  - At 13–14px sizes (typical UI), Satoshi can show slight stem irregularity and weight asymmetry on Windows, especially on 1080p (low-DPI) displays.
  - At 16px+ (body), it's clean.
  - At 24px+ (display), no issues.
  - **Mitigation:** if Warp ships a Windows desktop client (Electron or native), QA Satoshi rendering at 12–14px on a 1080p Windows 10/11 VM. If problems appear, either (a) bump Windows-specific UI sizes to 14px minimum, or (b) flip to Inter on Windows via OS-conditional CSS or Electron's `userAgent` switch.
- **Windows installer note:** if shipped as a desktop app, embed the font in the app bundle rather than installing system-wide. Per ITF-FFL, app embedding is permitted but system-wide installation through your installer would require user-facing terms.

## Performance budget

**Per-weight woff2 sizes (Latin subset, estimated from comparable sans-serif families since Fontshare doesn't publish exact figures):**

| Weight | Static woff2 (Latin) | Static woff2 (Latin Extended) |
|---|---|---|
| Light | ~24 KB | ~38 KB |
| Regular | ~25 KB | ~40 KB |
| Medium | ~25 KB | ~40 KB |
| Bold | ~26 KB | ~42 KB |
| Black | ~27 KB | ~42 KB |
| **Variable (single file)** | **~75–95 KB** | **~120–140 KB** |

**Recommended budget for a typical Warp landing page (4 shipped weights: Regular, Medium, Bold + Mono Regular):**

| Asset | Size | Notes |
|---|---|---|
| Satoshi Regular (woff2, Latin) | 25 KB | preload |
| Satoshi Medium (woff2, Latin) | 25 KB | lazy |
| Satoshi Bold (woff2, Latin) | 26 KB | preload |
| JetBrains Mono Regular (woff2, Latin) | 28 KB | lazy |
| **Total font payload** | **~104 KB** | well under the 150 KB-per-page font budget recommended by web.dev |

**Variable font alternative:** Ship Satoshi VF (~85 KB) + JetBrains Mono Regular (28 KB) = ~113 KB but covers infinite weights. Use VF if Warp uses 3+ weights anywhere; static otherwise.

**Hard ceiling:** 150 KB total font payload per page. Above this, LCP starts to degrade on 4G connections. If you go over, audit for unused weights or move to Latin-only subsetting.

## Sources
1. ★ **Indian Type Foundry — "Introducing Fontshare" (official launch announcement, 2021-03-22):** https://www.indiantypefoundry.com/news/introducing-fontshare — primary source for the ITF-FFL terms and the "100% free for personal and commercial use, worldwide" quote.
2. ★ **Fontshare Satoshi product page:** https://www.fontshare.com/fonts/satoshi — canonical specimen; renders via JS so requires a browser to inspect fully.
3. ★ **Fontshare ITF-FFL license page:** https://www.fontshare.com/licenses/itf-ffl — canonical license URL (JS-rendered).
4. **Fontshare FAQ:** https://www.fontshare.com/faq
5. **ITF licensing model overview:** https://www.indiantypefoundry.com/licensing
6. **Deni Anggara designer profile, ITF:** https://www.indiantypefoundry.com/designers/deni-anggara
7. **Fonts In Use — Satoshi entry:** https://fontsinuse.com/typefaces/238110/satoshi
8. **Satoshi Variable technical entry, Fonnts:** https://fonnts.com/satoshi-variable/
9. **Satoshi family details, font.download:** https://font.download/font/satoshi
10. **Satoshi family details, cufonfonts:** https://www.cufonfonts.com/font/satoshi
11. **JetBrains Mono — repo + license:** https://github.com/JetBrains/JetBrainsMono
12. **Source Serif 4 — Adobe Fonts:** https://fonts.adobe.com/fonts/source-serif-4 + https://github.com/adobe-fonts/source-serif/blob/release/LICENSE.md
13. **Inter — official site + license:** https://rsms.me/inter/ + https://github.com/rsms/inter/blob/master/LICENSE.txt
14. **web.dev font best practices:** https://web.dev/articles/font-best-practices

## Method
Pulled the canonical Satoshi specimen and license info from Fontshare and from ITF's own launch announcement (the most authoritative non-JS-rendered source for license terms). Cross-checked weight counts, italic availability, and character set against three independent font directories (font.download, cufonfonts, Fonnts). For per-platform rendering and per-weight file sizes, applied current web.dev best practice and standard woff2 sizing for comparable Latin sans-serif families since Fontshare does not publish exact byte counts. Flagged Windows ClearType as the only meaningful rendering risk based on general-knowledge of Satoshi's hinting profile (display-oriented, not GDI-tuned).
