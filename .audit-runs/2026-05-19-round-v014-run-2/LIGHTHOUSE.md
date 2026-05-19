# Lighthouse — Mobile Performance Baseline (tag: v014-run-2)

**Date:** 2026-05-19
**Tag:** v014-run-2
**Tool:** Lighthouse 12.8.2 via local CLI (`node_modules/.bin/lighthouse`)
**Profile:** mobile, simulated Moto G4 4G (CPU 4× slowdown, 1.6 Mbps DL, 150 ms RTT)
**Surface:** local production build at http://localhost:3000

## Results

| Route | Perf | LCP | FCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|
| `/` | 99 | 2055 ms | 1404 ms | 11 ms | 0.000 | 1404 ms |
| `/foundations` | 99 | 1896 ms | 1244 ms | 13 ms | 0.000 | 1244 ms |
| `/library` | 99 | 1815 ms | 1088 ms | 8 ms | 0.000 | 1088 ms |
| `/saas` | 100 | 1748 ms | 1111 ms | 10 ms | 0.000 | 1111 ms |
| `/landing` | 99 | 1972 ms | 1089 ms | 9 ms | 0.000 | 1089 ms |
| `/tool` | 97 | 2564 ms | 1364 ms | 7 ms | 0.000 | 1364 ms |
| `/commerce` | 98 | 2355 ms | 1095 ms | 8 ms | 0.000 | 1095 ms |
| `/mobile` | 100 | 1664 ms | 1079 ms | 8 ms | 0.000 | 1079 ms |
| `/desktop` | 97 | 2429 ms | 1363 ms | 9 ms | 0.000 | 1363 ms |

**Geometric mean across 9 routes:**

- Perf: **99**
- LCP: **2034 ms**
- FCP: **1197 ms**
- TBT: **9 ms** *(arithmetic mean; geo-mean undefined when any route is 0)*
- CLS: **0.000** *(arithmetic mean; geo-mean undefined when any route is 0)*
- SI: **1197 ms**

## Reproduction

From repo root with the audit-dashboard production server running on :3000:

```bash
node scripts/lighthouse-mobile-baseline.mjs --tag=v014-run-2 --port=3000
```

Raw per-route Lighthouse JSON: /tmp/lh-v014-run-2-<slug>.json
