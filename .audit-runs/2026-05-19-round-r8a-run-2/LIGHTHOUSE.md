# Lighthouse — Mobile Performance Baseline (tag: r8a-run-2)

**Date:** 2026-05-19
**Tag:** r8a-run-2
**Tool:** Lighthouse 12.8.2 via local CLI (`node_modules/.bin/lighthouse`)
**Profile:** mobile, simulated Moto G4 4G (CPU 4× slowdown, 1.6 Mbps DL, 150 ms RTT)
**Surface:** local production build at http://localhost:3000

## Results

| Route | Perf | LCP | FCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|
| `/` | 90 | 3573 ms | 1532 ms | 10 ms | 0.000 | 2614 ms |
| `/foundations` | 97 | 2571 ms | 1371 ms | 10 ms | 0.000 | 1371 ms |
| `/library` | 91 | 3373 ms | 1380 ms | 12 ms | 0.000 | 2575 ms |
| `/saas` | 94 | 3103 ms | 1223 ms | 10 ms | 0.000 | 1223 ms |
| `/landing` | 95 | 2945 ms | 1219 ms | 9 ms | 0.000 | 1219 ms |
| `/tool` | 95 | 2945 ms | 1068 ms | 9 ms | 0.000 | 1068 ms |
| `/commerce` | 95 | 2948 ms | 1071 ms | 9 ms | 0.000 | 1071 ms |
| `/mobile` | 96 | 2809 ms | 1078 ms | 9 ms | 0.000 | 1078 ms |
| `/desktop` | 96 | 2796 ms | 1069 ms | 9 ms | 0.000 | 1069 ms |

**Geometric mean across 9 routes:**

- Perf: **94**
- LCP: **2994 ms**
- FCP: **1213 ms**
- TBT: **9 ms** *(arithmetic mean; geo-mean undefined when any route is 0)*
- CLS: **0.000** *(arithmetic mean; geo-mean undefined when any route is 0)*
- SI: **1380 ms**

## Reproduction

From repo root with the audit-dashboard production server running on :3000:

```bash
node scripts/lighthouse-mobile-baseline.mjs --tag=r8a-run-2 --port=3000
```

Raw per-route Lighthouse JSON: /tmp/lh-r8a-run-2-<slug>.json
