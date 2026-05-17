---
name: Glossary
type: foundation
version: 0.13.0
last_updated: 2026-05-16
audience: [designer, engineer, llm-agent]
related:
  - ./principles.md
  - ./modes.md
  - ./voice-and-tone.md
  - ../../_meta/glossary.json
---

# Lumen Glossary — freight domain × system terminology

> Two vocabularies you need to read Lumen fluently. Freight terms are what Warp's customers operate on (lanes, cross-docks, pallets, OTD). System terms are what Lumen the design system uses internally (primitives, semantic, modes, scopes, registry items). When a copywriting LLM generates UI text for Warp, it MUST use freight terms correctly; the system terms are for design + engineering only.

---

## Freight-domain terms

Lumen is a freight-native design system. UI copy must use these terms correctly — wrong terminology breaks operator trust faster than wrong layout. Real carrier names (Sterling LTL, Estes Express, ODFL, Saia, FedEx Freight, ABF, Old Dominion, Yellow) are public B2B references and safe to ship in demos.

| Term | Meaning | Used in |
|---|---|---|
| **BOL** | Bill of Lading — the contract + manifest between shipper and carrier. PDF + line-item content. | DocumentBadge, ShipmentDetail, EmailDigest |
| **Cross-dock** | Facility where freight is unloaded from one truck and loaded onto another without long-term storage. Middle-mile bottleneck. | CrossDockGrid, RouteMap, DockBay |
| **Dock bay** | A specific door at a cross-dock. Bay 12, Bay 7. Has a status (open / in-use / blocked). | DockBay, CrossDockGrid |
| **ETA** | Estimated time of arrival. Always paired with a confidence range or a delta from quoted ETA. | ShipmentTimeline, LaneArc tooltip, Stat |
| **FTL** | Full-truckload. One shipper books the whole truck. Faster than LTL, more expensive. | QuoteBuilder, FilterChip, ShipmentBadge |
| **Lane** | Origin-destination pair, often with a route code (`LAX→SFO`, `ATL→MIA`). The atomic unit of pricing and capacity. | LaneCode, LaneArc, RouteMap, LaneSearch |
| **Lane code** | The mono-uppercase pair label — `LAX→SFO` with `→` U+2192 or `LAX-SFO` with hyphen. Lumen's mono-cap tracked treatment renders these. | LaneCode component |
| **Last mile** | The final delivery leg from local hub to receiver. Often the most expensive per-mile. | ShipmentTimeline, Stat (cost-per-mile) |
| **Line haul** | The long-distance leg between hubs. Where freight networks earn or lose money. | LaneArc, ShipmentTimeline |
| **LTL** | Less-than-truckload. Multiple shippers share a trailer. Warp's primary product. | FilterChip, QuoteBuilder, ShipmentBadge |
| **Manifest** | The shipment's line-item content list. Pieces, weight, class, hazmat flags. | ShipmentDetail, ManifestTable |
| **Middle mile** | The hub-to-hub leg between line haul and last mile. Warp's specific lane. | RouteMap, LaneArc |
| **OTD** | On-time delivery (percentage). Warp's 98.2% OTD is the signature stat. | Stat, RateTicker, KpiCard |
| **OTR** | Over the road — generic freight trucking. Used as adjective: "OTR carrier." | CarrierBadge, FilterChip |
| **Pallet** | The unit-load base. 48"×40" standard. LTL freight ships in pallet counts. | PalletTile, ManifestTable |
| **Parcel** | Small package, usually <150 lbs. Not Warp's primary product; named so the LLM doesn't conflate with LTL. | DocumentBadge (only) |
| **POD** | Proof of delivery — signature + photo at drop. | ShipmentDetail, DocumentBadge |
| **Quote** | A priced lane offer with service level, transit time, and rate. | QuoteBuilder, PricingCard (freight context) |
| **Tender** | The act of offering a shipment to a carrier. Tender → accept / decline / counter. | TenderQueue, ShipmentBadge |
| **Tracking number** | Pro number — the carrier-issued shipment identifier. | TrackingChip, ShipmentTimeline |
| **Transit time** | Days from pickup to delivery. Quoted vs actual; the delta is operator-critical. | Stat, ShipmentTimeline, RateTicker |

---

## System terminology

The terms Lumen the design system uses internally. Designers, engineers, and LLM agents working in the repo must understand these; they don't ship to the user.

| Term | Meaning | Where it lives |
|---|---|---|
| **DTCG** | Design Tokens Community Group. The W3C-shepherded spec for design tokens. Lumen v0.13 tokens conform to DTCG 2025.10. | `01-tokens/**/*.tokens.json` |
| **Primitive** | The raw value (hex, px, ms). Engineers and LLMs never consume primitives directly. | `01-tokens/primitives/` |
| **Semantic** | The role-based alias (`surface.canvas`, `text.primary`). Engineers consume semantic. | `01-tokens/semantic/` |
| **Component-bound** | Per-component token, used only when a semantic role doesn't fit cleanly. | `01-tokens/components/` |
| **Mode** | Restrained vs Expressive. Scope attribute on a container; rebinds a small set of semantic tokens. | `01-tokens/modes/` |
| **Scope** | A `<div data-mode="...">` container whose descendants resolve mode-rebound tokens. | Component usage |
| **Surface** | A semantic role for a paint-able background (canvas, raised, sunken, popover, glass, ...). | `01-tokens/semantic/surface.tokens.json` |
| **Voice element** | A pattern that carries the brand's voice — italic accent word, mono-cap label, brutalist hairline frame, LiveDot, RateTicker. | `00-foundations/voice-and-tone.md` |
| **Signature primitive** | A v0.4-era brand-signature component preserved verbatim across versions: LiveDot, RateTicker, Stat. | `02-components/live-dot/`, `02-components/rate-ticker/`, `02-components/stat/` |
| **Registry item** | A shadcn-installable Lumen component. Has a JSON sidecar per the shadcn registry-item.json schema. | `_registry/{name}.json` |
| **Manifest** | The shadcn `registry.json` listing all registry items — the catalog. | `_registry/registry.json`, root `registry.json` (Phase 0 scaffold) |
| **Skill** | A per-component agent-readable MD file in the Vercel `skill-remotion-geist` format. | `02-components/{name}/{name}.skill.md` (Phase 2 lands) |
| **MCP** | Model Context Protocol. The standard transport for agent-to-tool calls. Lumen MCP server is Phase 6. | `07-mcp/` (Phase 6) |
| **ADR** | Architecture Decision Record. One file per non-trivial design decision. | `_meta/decisions/` |
| **Hairline** | The 1 px border that does most of Lumen's surface-separation work. Color = `border.hairline`. | `00-foundations/elevation.md`, `border.tokens.json` |
| **Mono-cap** | The mono-uppercase tracked label voice — Satoshi + 0.16em tracking + uppercase + tnum. Signature mood (`SYSTEM V0.13 · LIVE`). | `00-foundations/typography.md` §mono-cap |
| **Italic accent word** | The single italic word per hero, in accent color. The voice's narrative gesture. | `00-foundations/voice-and-tone.md`, `display-italic-accent` preset |
| **Brutalist frame** | The hairline-strong (alpha 40%) border that frames hero cards / signature shells. Voice element. | `border.frame` |
| **Aurora** | The radial Spring-Green ambient glow rendered as a fixed/absolute pseudo-element. Expressive mode only. | `00-foundations/color.md` §9, `color.aurora.*` |
| **LiveDot** | The 8 px Spring Green dot with 2 px pulsing ring on a 3-second loop. The system's signature recurring animation. | `02-components/live-dot/` |
| **RateTicker** | Linear marquee numeric ticker, infinite, pausable on hover. Signature primitive for stat dashboards. | `02-components/rate-ticker/` |
| **Stat** | Composite primitive — large numeric + label + sparkline + delta. Operator-density signature. | `02-components/stat/` |
| **Trust level** | Per AGENTS.md: AUTOMERGE / DRAFT-PR / HUMAN-REVIEW. Sets the review bar for an agent's change. | AGENTS.md §Trust levels |

---

## Versioning vocabulary

| Term | Meaning |
|---|---|
| **`LUMEN_VERSION`** | The single source of truth for the user-facing version label (`v0.13.0`). Imported by every TSX that renders the version. | `audit-dashboard/src/lib/version.ts` |
| **`LUMEN_VERSION_MAJOR_MINOR`** | Drops the patch (`v0.13`). Used in mono-cap signatures. |
| **`LUMEN_VERSION_MAJOR_MINOR_UPPER`** | Uppercased (`V0.13`). Used in `SYSTEM V0.13 · LIVE` brand-voice tokens. |
| **VERSION (file)** | The root `/VERSION` file. Same value as `LUMEN_VERSION`. Release script bumps both in lockstep. |

---

## References

- [`principles.md`](./principles.md) — the seven principles
- [`voice-and-tone.md`](./voice-and-tone.md) — the mono-cap, italic accent, brutalist frame, instrument-panel mood
- [`modes.md`](./modes.md) — restrained × expressive routing
- [`_meta/glossary.json`](../../_meta/glossary.json) — machine-readable glossary (if present; this MD is the authoritative source)
