# Lighthouse — Mobile Performance Baseline (tag: r8a-run-1)

**Date:** 2026-05-19
**Tag:** r8a-run-1
**Tool:** Lighthouse 12.8.2 via local CLI (`node_modules/.bin/lighthouse`)
**Profile:** mobile, simulated Moto G4 4G (CPU 4× slowdown, 1.6 Mbps DL, 150 ms RTT)
**Surface:** local production build at http://localhost:3000

## Results

| Route | Perf | LCP | FCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|
| `/` | 89 | 3622 ms | 1552 ms | 20 ms | 0.000 | 2637 ms |
| `/foundations` | 92 | 3269 ms | 1375 ms | 11 ms | 0.000 | 2515 ms |
| `/library` | 91 | 3452 ms | 1382 ms | 10 ms | 0.000 | 2546 ms |
| `/saas` | 94 | 3100 ms | 1221 ms | 9 ms | 0.000 | 1221 ms |
| `/landing` | 95 | 2955 ms | 1226 ms | 9 ms | 0.000 | 1226 ms |
| `/tool` | 96 | 2816 ms | 1081 ms | 10 ms | 0.000 | 1081 ms |
| `/commerce` | 95 | 2955 ms | 1074 ms | 10 ms | 0.000 | 1074 ms |
| `/mobile` | 96 | 2810 ms | 1077 ms | 10 ms | 0.000 | 1077 ms |
| `/desktop` | 96 | 2813 ms | 1079 ms | 10 ms | 0.000 | 1079 ms |

**Geometric mean across 9 routes:**

- Perf: **94**
- LCP: **3076 ms**
- FCP: **1219 ms**
- TBT: **11 ms** *(arithmetic mean; geo-mean undefined when any route is 0)*
- CLS: **0.000** *(arithmetic mean; geo-mean undefined when any route is 0)*
- SI: **1480 ms**

## Reproduction

From repo root with the audit-dashboard production server running on :3000:

```bash
node scripts/lighthouse-mobile-baseline.mjs --tag=r8a-run-1 --port=3000
```

Raw per-route Lighthouse JSON: /tmp/lh-r8a-run-1-<slug>.json
