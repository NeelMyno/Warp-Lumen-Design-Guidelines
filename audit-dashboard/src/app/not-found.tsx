// v0.14 — R10 / templates layer. Lumen-branded 404 implementing the
// error-pages pattern (design-system/05-patterns/error-pages.md).
// Renders without dashboard chrome — the route 404 is also a wrong-URL
// 404 (no sidebar, no header). The Lumen brand mark is the sole anchor
// before the StatusCode + Heading + Supporting + Action recovery.

import Link from "next/link";

export const metadata = {
  title: "404 — Page not found · Lumen",
};

export default function NotFound() {
  return (
    <div className="min-h-svh w-full flex flex-col items-center justify-center bg-[var(--surface-canvas)] text-[color:var(--text-primary)] px-6">
      <div className="flex flex-col items-center text-center max-w-[42ch]">
        <p
          aria-label="HTTP 404 error"
          className="text-display-2xl text-[color:var(--text-accent)] font-bold leading-none mb-6"
        >
          404
        </p>
        <h1 className="text-display-sm font-semibold mb-3">
          Page not found.
        </h1>
        <p className="text-body-md text-[color:var(--text-secondary)] mb-8">
          The page you&apos;re looking for isn&apos;t here — it may have moved or never existed.
        </p>
        <div className="flex gap-3 items-center">
          <Link
            href="/foundations"
            className="lumen-btn-primary px-6 py-3 inline-flex items-center justify-center text-body-md font-medium"
          >
            Take me home
          </Link>
          <Link
            href="/library"
            className="lumen-btn-ghost px-6 py-3 inline-flex items-center justify-center text-body-md font-medium text-[color:var(--text-primary)]"
          >
            Browse library
          </Link>
        </div>
      </div>
      <p className="mt-16 text-body-sm text-[color:var(--text-tertiary)]">
        Lumen v0.14.0 · audit-dashboard
      </p>
    </div>
  );
}
