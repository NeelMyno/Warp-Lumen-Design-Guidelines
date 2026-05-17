---
name: MCP server (voice & tone only)
type: platform-guide
platform: mcp-host
runtime: TypeScript SDK (`@modelcontextprotocol/sdk` latest) · Python SDK · Go SDK
lumen_version: 0.13.0
last_updated: 2026-05-17
status: stable
related: [./cli.md, ../00-foundations/voice-and-tone.md, ../../07-mcp/]
---

# MCP server — Lumen v0.13 platform guide

> **No UI. The platform is the MCP server's tool naming, parameter descriptions, error messages, and resource summaries.** Lumen voice carries verbatim — operator-density, declarative, fragmenting, numerate. Every line an agent reads should read like a senior dispatcher wrote it.

## 1. What this platform is

MCP (Model Context Protocol) is the **agent-host surface** — the contract between Warp's tooling and any LLM agent (Claude Code, Cursor, Codex, Copilot, ChatGPT desktop). The MCP servers Lumen voices:

- **`@warp/mcp-quote`** — exposes lane-quote tools to agents. `quote_lane(from_zip, to_zip, pallets, weight_lb) → { rate, transit_days, carriers[] }`. The flagship Warp MCP.
- **`@warp/mcp-track`** — exposes shipment tracking. `track_shipment(bol_or_pro)`, `subscribe_eta_changes(bol)`, `list_active_shipments(account_id)`.
- **`@warp/mcp-book`** — exposes booking. `book_shipment(quote_id, pickup_date)`, `cancel_booking(bol)`, `reschedule_pickup(bol, new_date)`.
- **`@warp/lumen-mcp`** — exposes the Lumen design system itself to coding agents. `list_components()`, `get_component(name)`, `get_tokens(category)`, `get_prompt_template(asset_type)`, `install_component(name, target_path)`.

The first three are domain-product MCPs. The fourth is a meta-MCP — coding agents use it to install Lumen pieces into a fresh project. All four share the same Lumen voice contract.

## 2. Voice + tone mapping (the "tokens" of MCP)

There are no visual tokens to map. The translation is voice → MCP surface.

### Tool naming

Pattern: **`verb_noun`** — short, operator-density, freight-domain.

| Good | Bad | Why |
|---|---|---|
| `quote_lane` | `executeQuoteLaneAction` | Lumen voice: short. No corporate noun-verb-noun. |
| `book_shipment` | `process_shipment_booking_request` | Same. |
| `track_shipment` | `getShipmentTrackingData` | Same. |
| `subscribe_eta_changes` | `set_up_eta_change_subscription_listener` | Same. |
| `list_components` | `enumerateAvailableComponents` | Same. |
| `get_tokens` | `retrieveDesignTokenCatalog` | Same. |

### Tool descriptions

Pattern: **declarative, numerate, freight-native, one or two sentences.**

```ts
// ✓ Lumen voice
{
    name: "quote_lane",
    description: "Quote a freight lane between two ZIPs. Returns per-pallet rate, transit days, carrier count. Pallets ≤ 26, weight ≤ 45000 lb.",
}

// ✗ Generic SaaS voice
{
    name: "quote_lane",
    description: "This tool helps you get a quote for shipping freight between two locations. It returns information about the cost, how long shipping will take, and which carriers are available.",
}
```

The Lumen version: **30% fewer words, 100% more information density.** Numbers (≤26, ≤45000) instead of "various limits." Domain words (pallet, ZIP, transit days, lane) instead of generic ("locations," "shipping," "cost").

### Parameter descriptions

Pattern: **declarative, type-tight, range-bounded.**

```ts
// ✓ Lumen voice
parameters: {
    from_zip: { type: "string", description: "Origin ZIP code, 5 digits" },
    to_zip:   { type: "string", description: "Destination ZIP code, 5 digits" },
    pallets:  { type: "integer", description: "Pallet count, 1–26", minimum: 1, maximum: 26 },
    weight_lb:{ type: "number", description: "Total weight in lb, ≤ 45000", minimum: 1, maximum: 45000 },
}

// ✗ Generic
parameters: {
    from_zip: { type: "string", description: "The starting zip code where the freight will be picked up." },
    pallets:  { type: "integer", description: "The number of pallets in your shipment." },
}
```

### Error messages

Pattern: **direct, suggest action, no apology, no fawning.**

```ts
// ✓ Lumen voice
throw new Error("Lane unavailable. No carrier capacity on this corridor for the requested pickup window. Try a date 24h later or a different origin ZIP.");

// ✗ Generic
throw new Error("We're sorry, but we were unable to find a carrier for this lane at the moment. Please try a different pickup date or contact our support team if you continue to experience issues.");
```

The Lumen version states what's wrong (Lane unavailable / No carrier capacity), why (the corridor / window), and what to do (date 24h later, different origin ZIP). No apology, no implicit-blame ("we were unable"), no escape hatch ("contact our support team") — those drain agent confidence and create longer retry loops.

### Resource descriptions

When an MCP server exposes a `resource` (file, URL, document), the description follows the same voice:

```ts
// ✓
{
    uri: "warp://shipment/BOL-2026-04-12-AB47",
    name: "BOL-2026-04-12-AB47",
    description: "Bill of lading for shipment AB47. PDF + line-haul detail + carrier signature.",
    mimeType: "application/pdf",
}

// ✗
{
    name: "BOL-2026-04-12-AB47",
    description: "This resource contains the bill of lading document for shipment AB47, which includes detailed line-haul information and the carrier's signature.",
}
```

### Capability statements (server-level descriptions)

```ts
// In the server initialization
const server = new Server({
    name: "warp-quote",
    version: "0.13.0",
    description: "Warp freight lane quoting. Real-time rates from 200+ carriers. Returns per-pallet rate, transit days, carrier shortlist. No login. JSON in, JSON out.",
});
```

## 3. Identity budget

**Lumen claim: 100% of voice surface.** Every word an MCP server emits — tool name, description, parameter spec, error message, resource summary, log line — is Lumen-voiced.

What Lumen doesn't claim: the MCP protocol structure itself (JSON-RPC framing, capability negotiation, transport layer). That's the spec. Lumen lives in the **content** of every protocol message.

## 4. Glass / blur translation

**Not applicable.** No UI. Skip this section in the MCP context, but note: when an MCP server exposes a `resource` that's a Lumen UI artifact (a Storybook URL, a component preview, a token JSON file), the description references the platform-specific surface that renders it.

## 5. Motion translation

**Not applicable.** No motion in MCP messages. But: server response latency carries voice. A `quote_lane` tool that takes 5 seconds to return should emit progress events (when the MCP transport supports them) with Lumen-voiced status:

```ts
// Progress events during a long-running tool call
server.sendProgress({
    progress: 0.4,
    progressToken: token,
    message: "Polling 14 carriers. ETA 3s.",
});

// Not: "Please wait while we contact multiple carriers to retrieve rate quotes…"
```

## 6. Typography translation

**Not applicable** — MCP transmits plain-text JSON. No typography.

The one carry-over: when an MCP response text contains numerics (lane codes, ZIPs, rates), use the Lumen mono-numerics convention in display:

```ts
return {
    rate: "$0.42/lb",      // not "$0.4200000/lb"
    transit_days: 2,
    eta: "2026-05-19T14:00:00-08:00",  // ISO 8601, agent-friendly
    bol: "AB47-LAX-SFO",   // human-readable BOL format
};
```

The receiving agent renders these in its UI according to its own typography contract. Lumen contributes by emitting numbers in a parse-friendly, display-friendly shape.

## 7. Specific don'ts (MCP Lumen Law)

- **Don't apologize in error messages.** "We're sorry," "Unfortunately," "Please excuse" — all violate Lumen voice. Direct: "Lane unavailable." "Quote expired." "Invalid ZIP."
- **Don't pad tool descriptions** with "This tool helps you…" or "You can use this to…". The agent reads the description directly — the verb in the tool name is enough. Start with what it does: "Quote a freight lane between two ZIPs."
- **Don't use marketing voice in capability statements.** No "industry-leading," "best-in-class," "blazingly fast." Numbers do the work: "200+ carriers. Sub-2s response. JSON out."
- **Don't ship a tool with > 7 parameters.** Past 7, agents struggle to plan correct invocations. If the tool needs more, decompose into multiple tools or accept a single `args` JSON object.
- **Don't return ambiguous status.** An agent reads "succeeded with warnings" and can't act. Return either `{ status: "success", result: …, warnings: [...] }` (warnings are an explicit field) or `{ status: "error", reason: …, retry: bool }`. The discriminator field carries the voice.
- **Don't expose internal implementation IDs.** A `pickup_window_constraint_id_v4` in an error message is internal — the agent (and the operator behind it) has no way to act on it. Translate to operator-language: "Pickup window full" instead.
- **Don't ship MCP servers without descriptions on every tool.** An agent given a tool with no description either skips it or invokes it incorrectly. Description is the contract.
- **Don't translate error messages** for multi-locale support inside the MCP layer. MCP voice is English-only for v0.13. Locale-specific phrasing lives at the consumer surface (the iOS app, the web app), not in the agent-facing protocol.
- **Don't include emoji in MCP responses** unless the agent specifically requested them. Emoji rendering is inconsistent across agent UIs and adds parse noise.

## 8. Reference snippets

### TypeScript MCP server skeleton

```ts
// src/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server({
    name: "warp-quote",
    version: "0.13.0",
    description: "Warp freight lane quoting. Real-time rates from 200+ carriers. Returns per-pallet rate, transit days, carrier shortlist.",
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: "quote_lane",
            description: "Quote a freight lane between two ZIPs. Returns per-pallet rate, transit days, carrier count. Pallets ≤ 26, weight ≤ 45000 lb.",
            inputSchema: {
                type: "object",
                properties: {
                    from_zip: { type: "string", description: "Origin ZIP code, 5 digits", pattern: "^[0-9]{5}$" },
                    to_zip:   { type: "string", description: "Destination ZIP code, 5 digits", pattern: "^[0-9]{5}$" },
                    pallets:  { type: "integer", description: "Pallet count, 1–26", minimum: 1, maximum: 26 },
                    weight_lb:{ type: "number",  description: "Total weight in lb, ≤ 45000", minimum: 1, maximum: 45000 },
                },
                required: ["from_zip", "to_zip", "pallets", "weight_lb"],
            },
        },
    ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name !== "quote_lane") {
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
    const args = request.params.arguments as {
        from_zip: string;
        to_zip: string;
        pallets: number;
        weight_lb: number;
    };

    try {
        const result = await quoteLane(args);
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
    } catch (err) {
        // Lumen-voiced error
        if (err instanceof CarrierCapacityError) {
            throw new Error("Lane unavailable. No carrier capacity on this corridor for the requested pickup window. Try a date 24h later or a different origin ZIP.");
        }
        if (err instanceof InvalidZipError) {
            throw new Error(`Invalid ZIP: ${err.zip}. ZIPs must be 5 digits.`);
        }
        throw err;
    }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Lumen MCP (the meta-MCP exposing the design system to coding agents)

```ts
// @warp/lumen-mcp — Phase 6 actually ships this
const server = new Server({
    name: "warp-lumen",
    version: "0.13.0",
    description: "The Warp Lumen design system as an MCP. List components, fetch contracts, install pieces.",
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: "list_components",
            description: "List every Lumen component, grouped by tier. Returns name, tier, status, mode-aware flag, brief summary.",
            inputSchema: { type: "object", properties: {} },
        },
        {
            name: "get_component",
            description: "Fetch the full contract for a Lumen component — props, tokens, NEVER rules, code template.",
            inputSchema: {
                type: "object",
                properties: { name: { type: "string", description: "Component name (e.g. 'button', 'shipment-timeline')" } },
                required: ["name"],
            },
        },
        {
            name: "get_tokens",
            description: "Fetch Lumen tokens by category (color, spacing, typography, motion, elevation, glass, mesh). Returns DTCG 2025.10 JSON.",
            inputSchema: {
                type: "object",
                properties: { category: { type: "string", description: "Token category — color, spacing, typography, motion, elevation, glass, mesh" } },
                required: ["category"],
            },
        },
        {
            name: "install_component",
            description: "Emit the `npx shadcn add @lumen/<name>` command the consumer should run, plus the file paths that will land. Doesn't run the install — agents prefer to surface the command.",
            inputSchema: {
                type: "object",
                properties: { name: { type: "string" }, target_dir: { type: "string", description: "Target dir, defaults to components/ui/" } },
                required: ["name"],
            },
        },
        {
            name: "get_prompt_template",
            description: "Fetch a gpt-image-2 prompt template by asset type. Templates: hero-background, abstract-shape, illustration, pattern, mesh, empty-state, marketing-card.",
            inputSchema: {
                type: "object",
                properties: { asset_type: { type: "string" } },
                required: ["asset_type"],
            },
        },
    ],
}));
```

This Lumen MCP server is the **Phase 6 deliverable**. Phase 3 documents the voice contract; Phase 6 builds the server.

**No reference app ships under [`examples/`](../../examples/) for MCP** — the pattern lives in [`07-mcp/`](../../07-mcp/) (Phase 6) and the working example is the Lumen MCP itself.

## Related

- [`./cli.md`](./cli.md) — CLI is the parallel "operator-density at its purest" surface; voice consistency between CLI and MCP is the most important Lumen carry-over.
- [`../00-foundations/voice-and-tone.md`](../00-foundations/voice-and-tone.md) — Lumen voice source of truth.
- [`../../07-mcp/`](../../07-mcp/) — Phase 6 MCP server implementation (pending).
- [Model Context Protocol spec](https://modelcontextprotocol.io).
