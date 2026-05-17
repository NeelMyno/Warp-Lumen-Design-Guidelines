"use client";

/**
 * /quote-builder — see design-system/03-patterns/quote-builder.md
 *
 * This route documents the Quote Builder (freight, multi-turn) pattern. For the working chat
 * mechanics, it shares /chat's renderer — link below.
 */

import Link from "next/link";

export default function QuoteBuilderPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-8">
        <p
          className="mb-2 text-xs uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          [•] SYSTEM V0.13 · QUOTE-BUILDER
        </p>
        <h1 className="mb-4 text-3xl font-semibold text-[color:var(--color-text-primary)]">
          Quote Builder (freight, multi-turn)
        </h1>
        <p className="text-[color:var(--color-text-secondary)]">Multi-turn iterative quote-build conversation.</p>
      </header>

      <section className="mb-8 rounded-lg border border-[color:var(--color-border-hairline)] bg-[color:var(--color-surface-raised)] p-6">
        <h2 className="mb-3 text-lg font-medium text-[color:var(--color-text-primary)]">Try the canonical fixture</h2>
        <p className="mb-4 text-sm text-[color:var(--color-text-secondary)]">
          The chat surface (linked below) routes mock responses for known fixtures. Try this prompt:
        </p>
        <code
          className="block rounded bg-[color:var(--color-surface-sunken)] p-3 font-mono text-sm text-[color:var(--color-text-primary)]"
        >
          Quote a lane LAX to SFO
        </code>
        <Link
          href={`/chat?prompt=${encodeURIComponent(`Quote a lane LAX to SFO`)}`}
          className="mt-4 inline-block rounded-lg bg-[color:var(--color-spring-500)] px-4 py-2 font-medium text-[color:var(--color-accent-fg)]"
          style={{ boxShadow: "var(--shadow-glow-accent)" }}
        >
          Open in chat →
        </Link>
      </section>

      <section className="mb-8 rounded-lg border border-[color:var(--color-border-hairline)] bg-[color:var(--color-surface-raised)] p-6">
        <h2 className="mb-3 text-lg font-medium text-[color:var(--color-text-primary)]">Pattern documentation</h2>
        <p className="text-sm text-[color:var(--color-text-secondary)]">
          The full composition + voice + accessibility + failure modes for this flow are documented at{" "}
          <code className="rounded bg-[color:var(--color-surface-sunken)] px-1 font-mono text-xs">
            design-system/03-patterns/quote-builder.md
          </code>{" "}
          in the repo root.
        </p>
      </section>

      <Link href="/" className="text-sm text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text-accent)]">
        ← All flows
      </Link>
    </main>
  );
}
