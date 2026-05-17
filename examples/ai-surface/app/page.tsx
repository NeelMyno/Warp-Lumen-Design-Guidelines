"use client";

import Link from "next/link";

const FLOWS = [
  {
    href: "/chat",
    label: "Chat thread (canonical)",
    description: "Conversation + Message + MessageResponse + Reasoning + Sources + Actions + PromptInput.",
  },
  {
    href: "/lane-search",
    label: "Lane search (freight)",
    description: "Natural-language lane quote → Confirmation → Tool → freight-domain result.",
  },
  {
    href: "/shipment-status",
    label: "Shipment timeline (freight)",
    description: "Status inquiry → Tool → ShipmentTimeline composite → Sources cite carrier scans.",
  },
  {
    href: "/quote-builder",
    label: "Quote builder (freight, multi-turn)",
    description: "Conversation iteratively fills the QuoteBuilder composite. Final submit gates through Confirmation.",
  },
  {
    href: "/book-shipment",
    label: "Agent approval (destructive)",
    description: "book_shipment tool gates through brutalist hairline Confirmation.",
  },
  {
    href: "/command-palette",
    label: "Command palette + AI",
    description: "Slash-command palette with direct commands and AI-mediated suggestions.",
  },
] as const;

export default function Home() {
  const hasAnthropicKey = typeof process !== "undefined" && Boolean(process.env.NEXT_PUBLIC_ANTHROPIC_KEY_DETECTED);
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <p
          className="mb-3 text-xs uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          [•] SYSTEM V0.13 · LIVE · LUMEN AI SURFACE REFERENCE
        </p>
        <h1 className="mb-4 text-4xl font-semibold text-[color:var(--color-text-primary)]">
          Lumen v0.13 AI surface
        </h1>
        <p className="max-w-prose text-[color:var(--color-text-secondary)]">
          Reference implementation of the six Phase 5 flows: chat-thread, lane-search,
          shipment-timeline, quote-builder, agent-approval, command-palette. Streams Claude
          via the Vercel AI SDK; falls back to a deterministic mock when{" "}
          <code className="rounded-md bg-[color:var(--color-surface-sunken)] px-1.5 py-0.5 font-mono text-sm text-[color:var(--color-text-primary)]">
            ANTHROPIC_API_KEY
          </code>{" "}
          is unset, so the reference runs in any environment.
        </p>
        <p className="mt-3 text-sm text-[color:var(--color-text-tertiary)]">
          Streaming mode: <strong className="text-[color:var(--color-text-secondary)]">
            {hasAnthropicKey ? "Live Claude" : "Mock (deterministic)"}
          </strong>
          . Run <code className="rounded bg-[color:var(--color-surface-sunken)] px-1 font-mono text-xs">pnpm install:ai-elements</code> first to materialize the Vercel AI Elements component tree.
        </p>
      </header>

      <nav>
        <ul className="grid gap-4">
          {FLOWS.map((flow) => (
            <li key={flow.href}>
              <Link
                href={flow.href}
                className="block rounded-lg border border-[color:var(--color-border-hairline)] bg-[color:var(--color-surface-raised)] p-5 transition-colors hover:border-[color:var(--color-border-accent)]"
              >
                <h2 className="mb-1 text-lg font-medium text-[color:var(--color-text-primary)]">
                  {flow.label}
                </h2>
                <p className="text-sm text-[color:var(--color-text-secondary)]">
                  {flow.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="mt-16 border-t border-[color:var(--color-border-hairline)] pt-6 text-xs text-[color:var(--color-text-tertiary)]">
        <p
          className="uppercase tracking-[0.16em]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Phase 5 reference · Lumen v0.13.0 · master doc §7.Phase-5
        </p>
      </footer>
    </main>
  );
}
