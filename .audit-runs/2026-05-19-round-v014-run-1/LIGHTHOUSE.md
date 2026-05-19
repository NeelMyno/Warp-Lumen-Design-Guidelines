# Lighthouse — Mobile Performance Baseline (tag: v014-run-1)

**Date:** 2026-05-19
**Tag:** v014-run-1
**Tool:** Lighthouse 12.8.2 via local CLI (`node_modules/.bin/lighthouse`)
**Profile:** mobile, simulated Moto G4 4G (CPU 4× slowdown, 1.6 Mbps DL, 150 ms RTT)
**Surface:** local production build at http://localhost:3000

## Results

| Route | Perf | LCP | FCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|
| `/` | 86 | 4072 ms | 1727 ms | 62 ms | 0.000 | 2759 ms |
| `/foundations` | 99 | 1835 ms | 1249 ms | 12 ms | 0.000 | 1249 ms |
| `/library` | 100 | 1461 ms | 1112 ms | 10 ms | 0.000 | 1112 ms |
| `/saas` | 99 | 1992 ms | 1392 ms | 12 ms | 0.000 | 1392 ms |
| `/landing` | 99 | 2138 ms | 1111 ms | 9 ms | 0.000 | 1111 ms |
| `/tool` | 97 | 2505 ms | 1367 ms | 9 ms | 0.000 | 1367 ms |
| `/commerce` | 99 | 2203 ms | 1095 ms | 8 ms | 0.000 | 1095 ms |
| `/mobile` | 98 | 2266 ms | 1079 ms | 8 ms | 0.000 | 1079 ms |
| `/desktop` | 97 | 2563 ms | 1363 ms | 9 ms | 0.000 | 1363 ms |

**Geometric mean across 9 routes:**

- Perf: **97**
- LCP: **2252 ms**
- FCP: **1263 ms**
- TBT: **15 ms** *(arithmetic mean; geo-mean undefined when any route is 0)*
- CLS: **0.000** *(arithmetic mean; geo-mean undefined when any route is 0)*
- SI: **1330 ms**

## Reproduction

From repo root with the audit-dashboard production server running on :3000:

```bash
node scripts/lighthouse-mobile-baseline.mjs --tag=v014-run-1 --port=3000
```

Raw per-route Lighthouse JSON: /tmp/lh-v014-run-1-<slug>.json
