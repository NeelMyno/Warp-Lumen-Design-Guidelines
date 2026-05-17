import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Disable Turbopack for tighter build memory (per audit-dashboard guidance):
  // Turbopack + many open files OOMs the kernel during heavy file-editing.
  experimental: {
    turbopack: false,
  },
};

export default nextConfig;
