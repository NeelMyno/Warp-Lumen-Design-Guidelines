# Lighthouse — Mobile Performance Baseline (tag: r8b-fresh-2)

**Date:** 2026-05-19
**Tag:** r8b-fresh-2
**Tool:** Lighthouse 12.8.2 via local CLI (`node_modules/.bin/lighthouse`)
**Profile:** mobile, simulated Moto G4 4G (CPU 4× slowdown, 1.6 Mbps DL, 150 ms RTT)
**Surface:** local production build at http://localhost:3000

## Results

| Route | Perf | LCP | FCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|
| `/` | 91 | 3490 ms | 1483 ms | 49 ms | 0.000 | 1483 ms |
| `/foundations` | 99 | 1983 ms | 1262 ms | 12 ms | 0.000 | 1262 ms |
| `/library` | 81 | 4592 ms | 1517 ms | 18 ms | 0.000 | 3972 ms |
| `/saas` | 94 | 3097 ms | 1123 ms | 10 ms | 0.000 | 1123 ms |
| `/landing` | 99 | 1825 ms | 1116 ms | 11 ms | 0.000 | 1116 ms |
| `/tool` | 95 | 2961 ms | 1156 ms | 15 ms | 0.000 | 1156 ms |
| `/commerce` | 99 | 1824 ms | 1105 ms | 9 ms | 0.000 | 1105 ms |
| `/mobile` | 99 | 1827 ms | 1100 ms | 9 ms | 0.000 | 1100 ms |
| `/desktop` | 97 | 2567 ms | 1127 ms | 9 ms | 0.000 | 1127 ms |

**Geometric mean across 9 routes:**

- Perf: **95**
- LCP: **2549 ms**
- FCP: **1212 ms**
- TBT: **16 ms** *(arithmetic mean; geo-mean undefined when any route is 0)*
- CLS: **0.000** *(arithmetic mean; geo-mean undefined when any route is 0)*
- SI: **1348 ms**

## Reproduction

From repo root with the audit-dashboard production server running on :3000:

```bash
node scripts/lighthouse-mobile-baseline.mjs --tag=r8b-fresh-2 --port=3000
```

Raw per-route Lighthouse JSON: /tmp/lh-r8b-fresh-2-<slug>.json
