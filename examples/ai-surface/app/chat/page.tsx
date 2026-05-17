"use client";

/**
 * /chat — the canonical chat-thread pattern reference.
 *
 * Demonstrates Conversation + Message + MessageResponse + Reasoning + Tool
 * + Sources + InlineCitation + Actions + PromptInput + Suggestion using
 * lightweight wrappers around plain HTML. In a real Lumen consumer, swap
 * the divs for Vercel AI Elements imports after running:
 *
 *   pnpm install:ai-elements
 *
 * (Defined in package.json — runs `npx ai-elements@latest add` for the
 *  full required set.)
 *
 * Until then, this file uses hand-rolled equivalents so the reference
 * runs without the ai-elements install dependency.
 */

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import type { MockChunk } from "@/lib/mocks/chat-mock-stream";
import type { Citation } from "@/lib/mocks/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  reasoning?: string;
  toolCall?: { name: string; input: unknown; output?: unknown };
  citations?: Citation[];
  isStreaming?: boolean;
}

const STARTER_SUGGESTIONS = [
  "I need to ship 3 pallets from LAX to SFO next Tuesday",
  "Where is WRP-9824?",
  "Quote LAX to SFO, 5 pallets, Friday",
] as const;

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text };
    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "",
      isStreaming: true,
    };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.text })),
        }),
      });
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          let chunk: MockChunk;
          try {
            chunk = JSON.parse(line);
          } catch {
            continue;
          }
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (chunk.type === "text") {
              last.text += String(chunk.data);
            } else if (chunk.type === "reasoning") {
              last.reasoning = (last.reasoning ?? "") + String(chunk.data);
            } else if (chunk.type === "tool-call") {
              const d = chunk.data as { name: string; input: unknown };
              last.toolCall = { name: d.name, input: d.input };
            } else if (chunk.type === "tool-result") {
              const d = chunk.data as { name: string; output: unknown };
              if (last.toolCall) last.toolCall.output = d.output;
            } else if (chunk.type === "citation") {
              last.citations = [...(last.citations ?? []), chunk.data as Citation];
            }
            return next;
          });
        }
      }
      // After stream complete, attach response-level citations if any (mock emits them inline).
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        last.isStreaming = false;
        return next;
      });
    } catch (err) {
      console.error("chat error", err);
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <main className="flex h-screen flex-col bg-[color:var(--color-surface-canvas)]">
      <header className="border-b border-[color:var(--color-border-hairline)] px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div>
            <p
              className="mb-1 text-xs uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              [•] SYSTEM V0.13 · LIVE · CHAT-THREAD
            </p>
            <h1 className="text-lg font-medium text-[color:var(--color-text-primary)]">
              Canonical chat thread
            </h1>
          </div>
          <Link
            href="/"
            className="text-sm text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-accent)]"
          >
            ← All flows
          </Link>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-6"
        role="log"
        aria-live="polite"
        aria-label="Conversation thread"
      >
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && (
            <div className="rounded-lg border border-[color:var(--color-border-hairline)] bg-[color:var(--color-surface-raised)] p-8 text-center">
              <h2 className="mb-2 text-xl font-medium text-[color:var(--color-text-primary)]">
                Ask anything about your lanes.
              </h2>
              <p className="text-[color:var(--color-text-secondary)]">
                Quote, book, or track in plain English.
              </p>
            </div>
          )}
          {messages.map((m) => (
            <MessageView key={m.id} msg={m} />
          ))}
        </div>
      </div>

      {messages.length === 0 && (
        <div className="border-t border-[color:var(--color-border-hairline)] px-6 py-3">
          <div className="mx-auto flex max-w-3xl flex-wrap gap-2">
            {STARTER_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="rounded-full border border-[color:var(--color-border-hairline)] bg-[color:var(--color-surface-raised)] px-3 py-1.5 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-accent)] hover:text-[color:var(--color-text-primary)]"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="border-t border-[color:var(--color-border-hairline)] bg-[color:var(--color-surface-canvas)] px-6 py-4"
      >
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Quote, book, or track in plain English…"
            rows={1}
            className="min-h-[44px] flex-1 resize-none rounded-lg border border-[color:var(--color-border-hairline)] bg-[color:var(--color-surface-raised)] px-4 py-2.5 text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-tertiary)] focus:outline-none"
            disabled={isStreaming}
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="rounded-lg bg-[color:var(--color-spring-500)] px-4 py-2.5 font-medium text-[color:var(--color-accent-fg)] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            style={{ boxShadow: !isStreaming && input.trim() ? "var(--shadow-glow-accent)" : "none" }}
          >
            {isStreaming ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
    </main>
  );
}

function MessageView({ msg }: { msg: Message }) {
  if (msg.role === "user") {
    return (
      <article
        role="article"
        aria-label={`You said: ${msg.text}`}
        className="flex justify-end"
      >
        <div className="max-w-[80%] rounded-lg bg-[color:var(--color-surface-raised)] px-4 py-3 text-[color:var(--color-text-primary)]">
          {msg.text}
        </div>
      </article>
    );
  }
  return (
    <article
      role="article"
      aria-label={`Assistant said: ${msg.text.slice(0, 80)}…`}
      className="space-y-3"
    >
      {msg.reasoning && (
        <details className="group rounded-lg border border-[color:var(--color-border-hairline)] bg-[color:var(--color-surface-sunken)] px-3 py-2">
          <summary
            className="cursor-pointer list-none text-sm text-[color:var(--color-text-tertiary)]"
            style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}
          >
            {msg.isStreaming ? "Thinking…" : "Show thinking"}
          </summary>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
            {msg.reasoning}
          </p>
        </details>
      )}
      {msg.toolCall && <ToolCallView tool={msg.toolCall} streaming={msg.isStreaming} />}
      {msg.text && (
        <div
          className={`rounded-lg px-4 py-3 ${
            msg.isStreaming
              ? "bg-[color:var(--color-surface-tint-accent)]"
              : "bg-[color:var(--color-surface-raised)]"
          } text-[color:var(--color-text-primary)]`}
          aria-busy={msg.isStreaming}
        >
          <MessageText text={msg.text} citations={msg.citations} />
          {msg.isStreaming && (
            <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-[color:var(--color-spring-500)]" />
          )}
        </div>
      )}
      {msg.citations && msg.citations.length > 0 && !msg.isStreaming && (
        <SourcesView citations={msg.citations} />
      )}
      {!msg.isStreaming && msg.text && (
        <div className="flex gap-2 px-1">
          <ActionButton label="Regenerate" />
          <ActionButton label="Copy" />
          <ActionButton label="Like" />
          <ActionButton label="Dislike" />
        </div>
      )}
    </article>
  );
}

function MessageText({ text, citations }: { text: string; citations?: Citation[] }) {
  // Walk text for [N] superscript markers and render as InlineCitation.
  if (!citations || citations.length === 0) return <span>{text}</span>;
  const parts = text.split(/(\[\d+\])/);
  return (
    <span>
      {parts.map((part, i) => {
        const m = part.match(/^\[(\d+)\]$/);
        if (m) {
          const idx = parseInt(m[1], 10) - 1;
          const c = citations[idx];
          if (!c) return <span key={i}>{part}</span>;
          return (
            <a
              key={i}
              href={`#source-${idx}`}
              className="inline-block align-super text-xs text-[color:var(--color-text-accent)] no-underline hover:underline"
              title={c.cited_text}
            >
              [{idx + 1}]
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

function ToolCallView({
  tool,
  streaming,
}: {
  tool: { name: string; input: unknown; output?: unknown };
  streaming?: boolean;
}) {
  const status = tool.output ? "done" : streaming ? "running" : "pending";
  return (
    <div className="rounded-lg border border-[color:var(--color-border-hairline)] bg-[color:var(--color-surface-sunken)] p-3">
      <header
        className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-[color:var(--color-text-tertiary)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span className="text-[color:var(--color-text-secondary)]">{tool.name}</span>
        <span aria-hidden>·</span>
        <span>{status}</span>
        {status === "running" && (
          <span className="ml-1 inline-block h-1.5 w-1.5 animate-ping rounded-full bg-[color:var(--color-spring-500)]" />
        )}
      </header>
      <div className="grid gap-2 text-sm">
        <div>
          <p className="mb-0.5 text-xs text-[color:var(--color-text-tertiary)]">Input</p>
          <pre className="overflow-x-auto rounded bg-[color:var(--color-surface-canvas)] p-2 text-xs text-[color:var(--color-text-secondary)]">
            {JSON.stringify(tool.input, null, 2)}
          </pre>
        </div>
        {tool.output != null && (
          <div>
            <p className="mb-0.5 text-xs text-[color:var(--color-text-tertiary)]">Output</p>
            <pre className="overflow-x-auto rounded bg-[color:var(--color-surface-canvas)] p-2 text-xs text-[color:var(--color-text-secondary)]">
              {JSON.stringify(tool.output, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

function SourcesView({ citations }: { citations: Citation[] }) {
  return (
    <details
      className="rounded-lg border border-[color:var(--color-border-hairline)] bg-[color:var(--color-surface-sunken)] px-3 py-2"
      role="region"
      aria-label={`${citations.length} sources`}
    >
      <summary
        className="cursor-pointer list-none text-sm text-[color:var(--color-text-secondary)]"
        style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}
      >
        {citations.length} {citations.length === 1 ? "source" : "sources"}
      </summary>
      <ol className="mt-2 space-y-2 text-sm">
        {citations.map((c, i) => (
          <li
            key={i}
            id={`source-${i}`}
            className="rounded border border-[color:var(--color-border-hairline)] bg-[color:var(--color-surface-raised)] p-2"
          >
            <p className="font-medium text-[color:var(--color-text-primary)]">
              [{i + 1}] {c.document_title ?? `Document ${c.document_index + 1}`}
            </p>
            <p className="mt-1 text-xs text-[color:var(--color-text-secondary)]">{c.cited_text}</p>
          </li>
        ))}
      </ol>
    </details>
  );
}

function ActionButton({ label }: { label: string }) {
  return (
    <button
      className="rounded border border-[color:var(--color-border-hairline)] bg-[color:var(--color-surface-raised)] px-2 py-1 text-xs text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-border-accent)] hover:text-[color:var(--color-text-primary)]"
      aria-label={label}
    >
      {label}
    </button>
  );
}
