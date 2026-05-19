# Lighthouse — Mobile Performance Baseline (tag: v014-run-3)

**Date:** 2026-05-19
**Tag:** v014-run-3
**Tool:** Lighthouse 12.8.2 via local CLI (`node_modules/.bin/lighthouse`)
**Profile:** mobile, simulated Moto G4 4G (CPU 4× slowdown, 1.6 Mbps DL, 150 ms RTT)
**Surface:** local production build at http://localhost:3000

## Results

| Route | Perf | LCP | FCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|
| `/` | 99 | 1975 ms | 1393 ms | 17 ms | 0.000 | 1393 ms |
| `/foundations` | 99 | 2120 ms | 1234 ms | 16 ms | 0.000 | 1234 ms |
| `/library` | 99 | 1964 ms | 1087 ms | 8 ms | 0.000 | 1087 ms |
| `/saas` | 96 | 2719 ms | 1363 ms | 9 ms | 0.000 | 1363 ms |
| `/landing` | 98 | 2351 ms | 1099 ms | 9 ms | 0.000 | 1099 ms |
| `/tool` | 97 | 2562 ms | 1362 ms | 8 ms | 0.000 | 1362 ms |
| `/commerce` | 99 | 1812 ms | 1080 ms | 9 ms | 0.000 | 1080 ms |
| `/mobile` | 100 | 1597 ms | 1092 ms | 8 ms | 0.000 | 1092 ms |
| `/desktop` | 98 | 2424 ms | 1362 ms | 9 ms | 0.000 | 1362 ms |

**Geometric mean across 9 routes:**

- Perf: **98**
- LCP: **2141 ms**
- FCP: **1223 ms**
- TBT: **10 ms** *(arithmetic mean; geo-mean undefined when any route is 0)*
- CLS: **0.000** *(arithmetic mean; geo-mean undefined when any route is 0)*
- SI: **1223 ms**

## Reproduction

From repo root with the audit-dashboard production server running on :3000:

```bash
node scripts/lighthouse-mobile-baseline.mjs --tag=v014-run-3 --port=3000
```

Raw per-route Lighthouse JSON: /tmp/lh-v014-run-3-<slug>.json
