# Lighthouse — Mobile Performance Baseline (tag: r8b-fresh-3)

**Date:** 2026-05-19
**Tag:** r8b-fresh-3
**Tool:** Lighthouse 12.8.2 via local CLI (`node_modules/.bin/lighthouse`)
**Profile:** mobile, simulated Moto G4 4G (CPU 4× slowdown, 1.6 Mbps DL, 150 ms RTT)
**Surface:** local production build at http://localhost:3000

## Results

| Route | Perf | LCP | FCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|
| `/` | 94 | 3043 ms | 1465 ms | 45 ms | 0.000 | 1465 ms |
| `/foundations` | 93 | 3221 ms | 1339 ms | 24 ms | 0.000 | 1339 ms |
| `/library` | 90 | 3476 ms | 1627 ms | 15 ms | 0.000 | 1648 ms |
| `/saas` | 97 | 2582 ms | 1127 ms | 10 ms | 0.000 | 1127 ms |
| `/landing` | 99 | 1825 ms | 1119 ms | 11 ms | 0.000 | 1119 ms |
| `/tool` | 95 | 2966 ms | 1175 ms | 14 ms | 0.000 | 1175 ms |
| `/commerce` | 95 | 2947 ms | 1116 ms | 11 ms | 0.000 | 1116 ms |
| `/mobile` | 95 | 2955 ms | 1109 ms | 11 ms | 0.000 | 1109 ms |
| `/desktop` | 97 | 2572 ms | 1134 ms | 10 ms | 0.000 | 1134 ms |

**Geometric mean across 9 routes:**

- Perf: **95**
- LCP: **2803 ms**
- FCP: **1234 ms**
- TBT: **17 ms** *(arithmetic mean; geo-mean undefined when any route is 0)*
- CLS: **0.000** *(arithmetic mean; geo-mean undefined when any route is 0)*
- SI: **1236 ms**

## Reproduction

From repo root with the audit-dashboard production server running on :3000:

```bash
node scripts/lighthouse-mobile-baseline.mjs --tag=r8b-fresh-3 --port=3000
```

Raw per-route Lighthouse JSON: /tmp/lh-r8b-fresh-3-<slug>.json
