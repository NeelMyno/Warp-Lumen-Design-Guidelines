import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },

  // v0.13.5 — R8b critical-CSS inlining (ADR 0028).
  // Next.js 16's experimental.inlineCss inlines every prerender's CSS into a
  // <style> block in <head>, eliminating the render-blocking <link rel=stylesheet>
  // round-trip on first paint. Closes R8a's only remaining LCP soft-spot —
  // the 26 KB Tailwind utility chunk wastes 462–635 ms across routes per
  // Lighthouse render-blocking-resources audit (R8a baseline; identical on every
  // route because cssChunking: true merges the global utility set). At the
  // R7/R8a Moto G4 4G profile the chunk transfer alone is ~130 ms + 150 ms RTT;
  // inlining lifts that into the HTML stream where it costs only the byte-level
  // transfer time (~130 ms) but the parse + apply can begin immediately rather
  // than waiting for a separate request to dispatch + complete. Atomic CSS
  // (Tailwind v4) is the regime this flag is designed for — the chunk size
  // doesn't grow with route count, so the HTML weight cost stays bounded.
  // For multi-page returning-visitor traffic the trade-off would reverse
  // (external CSS caches cross-route); the audit-dashboard is a single-visit
  // review surface so this is an unambiguous win.
  experimental: {
    inlineCss: true,
  },
};

export default nextConfig;
