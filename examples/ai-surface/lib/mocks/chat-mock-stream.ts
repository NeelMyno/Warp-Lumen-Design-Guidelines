/**
 * Deterministic mock stream for the AI surface.
 *
 * Replaces a real Claude streamText() when ANTHROPIC_API_KEY is unset.
 * Returns canned responses for the canonical fixture prompts so the
 * reference app runs in any environment (CI, fresh laptop, no API key).
 *
 * Each canned response mirrors the shape the real Anthropic Messages API
 * returns:
 *   - text chunks
 *   - optional reasoning block
 *   - optional tool call (with input + output)
 *   - optional citations array
 *
 * The mock emits chunks at ~30ms intervals to simulate streaming velocity.
 */

import type { Citation } from "./types";

export interface MockChunk {
  type: "text" | "reasoning" | "tool-call" | "tool-result" | "citation";
  data: unknown;
}

export interface MockResponse {
  chunks: MockChunk[];
  citations?: Citation[];
}

const QUOTE_LANE_RESPONSE: MockResponse = {
  chunks: [
    {
      type: "reasoning",
      data:
        "Extracting freight intent. Origin: LAX (90045). Destination: SFO (94128). Weight: 3 pallets, est 1200 lb. Pickup: next Tuesday → 2026-05-19. Verifying ZIP coverage… 14 carriers active on this lane.",
    },
    {
      type: "tool-call",
      data: {
        name: "quote_lane",
        input: {
          origin_zip: "90045",
          destination_zip: "94128",
          pallets: 3,
          weight_lb: 1200,
          pickup_date: "2026-05-19",
        },
      },
    },
    {
      type: "tool-result",
      data: {
        name: "quote_lane",
        output: {
          quotes: [
            { carrier: "Sterling LTL", rate_per_pallet: 104, transit_days: 1, total: 312 },
            { carrier: "Estes Express", rate_per_pallet: 112, transit_days: 1, total: 336 },
            { carrier: "ODFL", rate_per_pallet: 118, transit_days: 2, total: 354 },
            { carrier: "ABF Freight", rate_per_pallet: 124, transit_days: 2, total: 372 },
            { carrier: "FedEx Freight", rate_per_pallet: 129, transit_days: 1, total: 387 },
            { carrier: "Saia", rate_per_pallet: 134, transit_days: 2, total: 402 },
            { carrier: "Yellow", rate_per_pallet: 142, transit_days: 2, total: 426 },
          ],
        },
      },
    },
    { type: "text", data: "14 quotes returned. Cheapest: " },
    { type: "text", data: "$312 via Sterling LTL, 1-day transit. " },
    { type: "text", data: "Spread: $312–$498. Book the cheapest, or filter by transit or carrier reliability." },
  ],
};

const SHIPMENT_STATUS_RESPONSE: MockResponse = {
  chunks: [
    {
      type: "tool-call",
      data: {
        name: "get_shipment_status",
        input: { shipment_id: "WRP-9824" },
      },
    },
    {
      type: "tool-result",
      data: {
        name: "get_shipment_status",
        output: {
          shipment_id: "WRP-9824",
          carrier: "Sterling LTL",
          carrier_reference: "SHP-447921",
          status: "in_transit",
          steps: [
            { name: "Pickup", status: "complete", timestamp: "2026-05-19T06:43:00Z", location: "LAX terminal", source: "Sterling LTL EDI 214" },
            { name: "Cross-dock", status: "complete", timestamp: "2026-05-19T09:21:00Z", location: "LAX hub", source: "Sterling LTL EDI 214" },
            { name: "Line haul", status: "in_progress", timestamp: "2026-05-19T12:08:00Z", location: "I-5 mile 412", source: "Carrier GPS telematics" },
            { name: "Last mile", status: "pending", location: "SFO terminal" },
          ],
          eta: "2026-05-19T14:30:00Z",
          original_eta: "2026-05-19T14:00:00Z",
          eta_slip_minutes: 30,
        },
      },
    },
    { type: "text", data: "WRP-9824 is on line haul " },
    { type: "text", data: "[1]. ETA 14:30 UTC " },
    { type: "text", data: "[2] — 30-min slip from original 14:00 commitment " },
    { type: "text", data: "[3]." },
  ],
  citations: [
    {
      type: "content_block_location",
      cited_text: "Carrier GPS telematics ping 12:08 UTC at I-5 mile 412",
      document_index: 0,
      document_title: "Carrier GPS telematics feed",
      start_block_index: 2,
      end_block_index: 2,
    },
    {
      type: "content_block_location",
      cited_text: "Sterling LTL projected delivery 14:30 UTC",
      document_index: 1,
      document_title: "Sterling LTL projected delivery (carrier feed)",
      start_block_index: 0,
      end_block_index: 0,
    },
    {
      type: "content_block_location",
      cited_text: "Original quoted ETA 14:00 UTC (booking commitment)",
      document_index: 2,
      document_title: "Original quote — Sterling LTL booking",
      start_block_index: 0,
      end_block_index: 0,
    },
  ],
};

const FALLBACK_RESPONSE: MockResponse = {
  chunks: [
    {
      type: "text",
      data:
        "Mock stream is active. Set ANTHROPIC_API_KEY to enable live Claude streaming. Try one of the canonical fixtures: 'I need to ship 3 pallets from LAX to SFO next Tuesday' OR 'Where is WRP-9824?'",
    },
  ],
};

/**
 * Pick a mock response for a given user prompt. Pattern-matches against
 * known fixtures; falls back to a stock instructional message.
 */
export function pickMockResponse(userPrompt: string): MockResponse {
  const lower = userPrompt.toLowerCase();
  if (lower.includes("ship") && (lower.includes("lax") || lower.includes("sfo"))) {
    return QUOTE_LANE_RESPONSE;
  }
  if (lower.includes("quote") && (lower.includes("lax") || lower.includes("sfo") || lower.includes("lane"))) {
    return QUOTE_LANE_RESPONSE;
  }
  if (lower.includes("wrp-") || lower.includes("status") || lower.includes("where")) {
    return SHIPMENT_STATUS_RESPONSE;
  }
  return FALLBACK_RESPONSE;
}

/**
 * Generator that yields mock chunks at ~30ms intervals to simulate
 * a streaming response. Consumers iterate with for-await-of.
 */
export async function* streamMockResponse(
  userPrompt: string,
  intervalMs = 30
): AsyncGenerator<MockChunk> {
  const response = pickMockResponse(userPrompt);
  for (const chunk of response.chunks) {
    if (chunk.type === "text") {
      // Split text chunks into ~5-char sub-chunks for word-by-word streaming feel.
      const text = String(chunk.data);
      for (let i = 0; i < text.length; i += 5) {
        yield { type: "text", data: text.slice(i, i + 5) };
        await new Promise((r) => setTimeout(r, intervalMs));
      }
    } else {
      yield chunk;
      await new Promise((r) => setTimeout(r, intervalMs * 4));
    }
  }
}
