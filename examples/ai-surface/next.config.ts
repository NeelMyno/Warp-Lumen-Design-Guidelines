import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next.js 16.x — Turbopack is the default bundler. To opt OUT for builds
  // with tighter memory (Turbopack + many open files can OOM the kernel per
  // audit-dashboard guidance), pass `--webpack` at the command line:
  //   next build --webpack | next dev --webpack
  // No config flag is needed — the previous `experimental.turbopack: false`
  // key is not part of v16's NextConfig schema.
};

export default nextConfig;
