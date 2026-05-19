"use client";

// v0.14 — R10 / templates layer. Lumen-branded 500-class error boundary
// implementing the error-pages pattern (design-system/05-patterns/error-pages.md).
// Next.js renders this when the app throws above the route-level boundary.
// MUST include <html> + <body> per Next.js global-error contract.

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to observability — consumer hooks here in a real product:
    // Sentry.captureException(error)
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.error("[Lumen GlobalError]", error);
    }
  }, [error]);

  return (
    <html lang="en" data-mood="obsidian" data-theme="dark" className="h-full antialiased">
      <body
        className="min-h-full bg-[var(--surface-canvas)] text-[color:var(--text-primary)] font-sans"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "24px",
        }}
      >
        {/* lumen-lint-allow: off-grid — 42ch is a typographic measure (chars-wide), not pixel grid value; matches error-pages pattern foundations contract */}
        <div style={{ maxWidth: "42ch", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p
            aria-label="HTTP 500 error"
            className="text-display-2xl text-[color:var(--text-accent)]"
            style={{ fontWeight: 700, lineHeight: 1, marginBottom: "24px" }}
          >
            500
          </p>
          <h1 className="text-display-sm" style={{ fontWeight: 600, marginBottom: "12px" }}>
            Something broke on our end.
          </h1>
          <p
            className="text-body-md text-[color:var(--text-secondary)]"
            style={{ marginBottom: "32px" }}
          >
            We&apos;ve been notified and we&apos;re working on it. You can try again in a moment.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button"
              onClick={() => reset()}
              className="lumen-btn-primary"
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: 500,
                cursor: "pointer",
                border: "none",
              }}
            >
              Try again
            </button>
            <a
              href="/foundations"
              className="lumen-btn-ghost text-[color:var(--text-primary)]"
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: 500,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Take me home
            </a>
          </div>
          {error.digest && (
            <p
              className="text-body-sm text-[color:var(--text-tertiary)]"
              style={{ marginTop: "32px", fontFamily: "var(--font-mono, monospace)" }}
            >
              Reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
