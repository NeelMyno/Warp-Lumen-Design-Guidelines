# Lighthouse — Mobile Performance Baseline (tag: r8a-run-3)

**Date:** 2026-05-19
**Tag:** r8a-run-3
**Tool:** Lighthouse 12.8.2 via local CLI (`node_modules/.bin/lighthouse`)
**Profile:** mobile, simulated Moto G4 4G (CPU 4× slowdown, 1.6 Mbps DL, 150 ms RTT)
**Surface:** local production build at http://localhost:3000

## Results

| Route | Perf | LCP | FCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|
| `/` | 95 | 2882 ms | 1524 ms | 10 ms | 0.000 | 1524 ms |
| `/foundations` | 97 | 2564 ms | 1364 ms | 9 ms | 0.000 | 1364 ms |
| `/library` | 91 | 3450 ms | 1376 ms | 10 ms | 0.000 | 2728 ms |
| `/saas` | 94 | 3107 ms | 1225 ms | 10 ms | 0.000 | 1225 ms |
| `/landing` | 95 | 2954 ms | 1225 ms | 8 ms | 0.000 | 1225 ms |
| `/tool` | 95 | 2950 ms | 1072 ms | 8 ms | 0.000 | 1072 ms |
| `/commerce` | 95 | 2944 ms | 1068 ms | 9 ms | 0.000 | 1068 ms |
| `/mobile` | 96 | 2792 ms | 1067 ms | 8 ms | 0.000 | 1067 ms |
| `/desktop` | 94 | 3096 ms | 1069 ms | 9 ms | 0.000 | 1919 ms |

**Geometric mean across 9 routes:**

- Perf: **95**
- LCP: **2962 ms**
- FCP: **1211 ms**
- TBT: **9 ms** *(arithmetic mean; geo-mean undefined when any route is 0)*
- CLS: **0.000** *(arithmetic mean; geo-mean undefined when any route is 0)*
- SI: **1395 ms**

## Reproduction

From repo root with the audit-dashboard production server running on :3000:

```bash
node scripts/lighthouse-mobile-baseline.mjs --tag=r8a-run-3 --port=3000
```

Raw per-route Lighthouse JSON: /tmp/lh-r8a-run-3-<slug>.json
