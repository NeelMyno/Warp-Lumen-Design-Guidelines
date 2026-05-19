# Font backups — pre-subset originals

This directory preserves the **original Satoshi VF woff2 files** captured before they were subset by [`scripts/subset-satoshi.mjs`](../../scripts/subset-satoshi.mjs) for the v0.13.4 R8a ship.

| File | Bytes | Captured | Source |
|---|---|---|---|
| `Satoshi-Variable.woff2.2026-05-19T02-53-05.bak` | 42,588 | 2026-05-19 02:53 UTC | Pre-v0.13.4 R8a subset |
| `Satoshi-VariableItalic.woff2.2026-05-19T02-53-07.bak` | 43,844 | 2026-05-19 02:53 UTC | Pre-v0.13.4 R8a subset |

These are the originals from `audit-dashboard/src/fonts/` immediately prior to the first run of the subsetter. The post-subset files (29,964 + 30,840 bytes — 30% smaller) are checked in at the original paths; these `.bak` files are recovery copies.

**To restore the originals** (e.g. if you need to broaden the codepoint set and want to re-subset from the source font, not the already-subset one):

```bash
cp .audit-runs/_font-backups/Satoshi-Variable.woff2.2026-05-19T02-53-05.bak \
   audit-dashboard/src/fonts/Satoshi-Variable.woff2
cp .audit-runs/_font-backups/Satoshi-VariableItalic.woff2.2026-05-19T02-53-07.bak \
   audit-dashboard/src/fonts/Satoshi-VariableItalic.woff2
```

Then edit the keep-set in `scripts/subset-satoshi.mjs`, re-run `node scripts/subset-satoshi.mjs`, re-run the audit-dashboard build + Lighthouse, and commit the new subset.

**Why preserve these in git?** The original Satoshi v2.000 ITF-FFL build is the upstream source. We don't ship full Satoshi (it's 150+ KB woff2 with all 600+ codepoints) — we ship a subset. If a future contributor needs to broaden coverage (e.g. add Eastern European Latin Extended-A) they need the un-subset starting point to avoid double-subsetting. These ~86 KB total are the canonical "what we started from" — preserved here rather than relying on ITF's CDN staying up.

See [ADR 0027](../../_meta/decisions/0027-satoshi-subset-mobile-perf-v0134.md) for the codepoint policy + decision rationale.
