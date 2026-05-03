# assets/

Visual reference material that *informs* Lumen — moodboards, exemplar palettes, typography swatches collected during research. Not the system itself; the system lives in [`design-system/`](../design-system/). Don't ship from here.

| Folder | Holds |
|---|---|
| `moodboards/` | Inspiration moodboards from peer systems (Linear, Stripe, Vercel, Origin UI, etc.) — used to seed v0.4 / v0.5 / v0.6 rebuild waves. |
| `palettes/` | Reference palettes from peer systems — used to triangulate Lumen's accent calibration and surface ladder. |
| `typography/` | Reference type specimens — Satoshi vs Inter vs Geist Sans vs system stacks at sizes 11–128 px. |

If you need an asset shipped to consumers (logo, favicon, og-image), put it in [`audit-dashboard/public/`](../audit-dashboard/public/) instead — that's where the live site serves from.
