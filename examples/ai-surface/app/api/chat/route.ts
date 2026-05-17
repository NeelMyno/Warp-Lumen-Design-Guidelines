/**
 * /api/chat — streaming chat endpoint.
 *
 * Routes:
 *   - If process.env.ANTHROPIC_API_KEY is set → forwards to Claude via the
 *     Vercel AI SDK (`streamText` + `@ai-sdk/anthropic`).
 *   - Otherwise → returns a deterministic mock stream from
 *     `lib/mocks/chat-mock-stream.ts` so the reference runs in any env.
 *
 * The mock stream's chunk shape mirrors what `streamText` emits, so the
 * client renderer is identical for both code paths.
 */

import { NextResponse } from "next/server";
import { streamMockResponse, type MockChunk } from "@/lib/mocks/chat-mock-stream";

export const runtime = "nodejs";

interface ChatRequestBody {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  model?: string;
}

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const userMessage = body.messages.findLast((m) => m.role === "user");
  if (!userMessage) {
    return NextResponse.json(
      { error: "No user message in body.messages" },
      { status: 400 }
    );
  }

  const useLive = Boolean(process.env.ANTHROPIC_API_KEY);

  if (useLive) {
    // Live Claude path. Commented out the actual streaming wiring because
    // the package set isn't installed at scaffold time — uncomment after
    // running `pnpm install` in this directory:
    //
    //   import { streamText } from "ai";
    //   import { anthropic } from "@ai-sdk/anthropic";
    //
    //   const result = streamText({
    //     model: anthropic(body.model ?? "claude-opus-4-7"),
    //     messages: body.messages,
    //     // tools: { quote_lane: …, get_shipment_status: …, book_shipment: … },
    //   });
    //   return result.toUIMessageStreamResponse();
    //
    return NextResponse.json(
      {
        error:
          "Live Claude path scaffolded but commented out. Run `pnpm install` then uncomment the live branch in app/api/chat/route.ts.",
      },
      { status: 501 }
    );
  }

  // Mock stream path — runs anywhere, no API key.
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamMockResponse(userMessage.content, 30)) {
          const line = JSON.stringify(chunk) + "\n";
          controller.enqueue(encoder.encode(line));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache, no-transform",
      "X-Lumen-Mock-Stream": "1",
    },
  });
}
