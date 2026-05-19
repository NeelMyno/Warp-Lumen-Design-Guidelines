# Lighthouse — Mobile Performance Baseline (tag: r8b-fresh-1)

**Date:** 2026-05-19
**Tag:** r8b-fresh-1
**Tool:** Lighthouse 12.8.2 via local CLI (`node_modules/.bin/lighthouse`)
**Profile:** mobile, simulated Moto G4 4G (CPU 4× slowdown, 1.6 Mbps DL, 150 ms RTT)
**Surface:** local production build at http://localhost:3000

## Results

| Route | Perf | LCP | FCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|
| `/` | 86 | 3913 ms | 1528 ms | 119 ms | 0.000 | 2676 ms |
| `/foundations` | 95 | 2878 ms | 1295 ms | 11 ms | 0.000 | 1295 ms |
| `/library` | 90 | 3634 ms | 1501 ms | 14 ms | 0.000 | 1501 ms |
| `/saas` | 94 | 3093 ms | 1103 ms | 10 ms | 0.000 | 1103 ms |
| `/landing` | 97 | 2574 ms | 1124 ms | 10 ms | 0.000 | 1124 ms |
| `/tool` | 95 | 2963 ms | 1167 ms | 10 ms | 0.000 | 1167 ms |
| `/commerce` | 99 | 1898 ms | 1107 ms | 11 ms | 0.000 | 1107 ms |
| `/mobile` | 97 | 2575 ms | 1098 ms | 12 ms | 0.000 | 1098 ms |
| `/desktop` | 95 | 2954 ms | 1141 ms | 12 ms | 0.000 | 1141 ms |

**Geometric mean across 9 routes:**

- Perf: **94**
- LCP: **2887 ms**
- FCP: **1219 ms**
- TBT: **23 ms** *(arithmetic mean; geo-mean undefined when any route is 0)*
- CLS: **0.000** *(arithmetic mean; geo-mean undefined when any route is 0)*
- SI: **1298 ms**

## Reproduction

From repo root with the audit-dashboard production server running on :3000:

```bash
node scripts/lighthouse-mobile-baseline.mjs --tag=r8b-fresh-1 --port=3000
```

Raw per-route Lighthouse JSON: /tmp/lh-r8b-fresh-1-<slug>.json
