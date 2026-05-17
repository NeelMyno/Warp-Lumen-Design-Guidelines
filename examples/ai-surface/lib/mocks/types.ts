/**
 * Anthropic Citations API shape (verbatim).
 *
 * Source: https://docs.anthropic.com/en/docs/build-with-claude/citations
 * Sync'd 2026-05-17 against the Phase 5 spec.
 */

export type CharLocationCitation = {
  type: "char_location";
  cited_text: string;
  document_index: number;
  document_title: string | null;
  start_char_index: number;
  end_char_index: number;
};

export type PageLocationCitation = {
  type: "page_location";
  cited_text: string;
  document_index: number;
  document_title: string | null;
  start_page_number: number;
  end_page_number: number;
};

export type ContentBlockLocationCitation = {
  type: "content_block_location";
  cited_text: string;
  document_index: number;
  document_title: string | null;
  start_block_index: number;
  end_block_index: number;
};

export type Citation =
  | CharLocationCitation
  | PageLocationCitation
  | ContentBlockLocationCitation;

/**
 * Tool definitions shared across mock responses.
 */
export interface ToolDefinition {
  name: string;
  description: string;
  destructive: boolean;
}

export const QUOTE_LANE_TOOL: ToolDefinition = {
  name: "quote_lane",
  description:
    "Quote a freight lane between two ZIPs. Returns per-pallet rate, transit days, carrier count. Pallets ≤ 26, weight ≤ 45000 lb.",
  destructive: false,
};

export const GET_SHIPMENT_STATUS_TOOL: ToolDefinition = {
  name: "get_shipment_status",
  description:
    "Look up the current status of a shipment by id. Returns carrier, tracking history, current location, ETA, and any deviation from the original commitment.",
  destructive: false,
};

export const BOOK_SHIPMENT_TOOL: ToolDefinition = {
  name: "book_shipment",
  description:
    "Reserve a carrier slot for a quoted lane. This commits to a carrier slot — financial commitment, not reversible without carrier-side cancellation. Always gate through Confirmation.",
  destructive: true,
};

export const SUBMIT_QUOTE_TOOL: ToolDefinition = {
  name: "submit_quote",
  description:
    "Submit a finalized quote request to all eligible carriers on the lane. Quote results stream back within ~6 seconds. Submission notifies carriers; not reversible.",
  destructive: true,
};

export const SEND_EMAIL_TOOL: ToolDefinition = {
  name: "send_email",
  description: "Send an email. Always gate through Confirmation.",
  destructive: true,
};

export const CANCEL_SHIPMENT_TOOL: ToolDefinition = {
  name: "cancel_shipment",
  description: "Cancel a booked shipment. Irreversible. Always gate through Confirmation.",
  destructive: true,
};
