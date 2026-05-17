import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Vite build for Chrome MV3 — emit a single content-script.js bundle
// + manifest.json + assets, all copied to dist/. Load the unpacked extension
// from dist/ via chrome://extensions.

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                "content-script": resolve(__dirname, "src/content-script.tsx"),
                "popup": resolve(__dirname, "popup.html"),
            },
            output: {
                entryFileNames: "[name].js",
                chunkFileNames: "[name].js",
                assetFileNames: "[name][extname]",
                format: "iife",          // Content scripts must be IIFE
                inlineDynamicImports: false,
            },
        },
    },
    define: {
        "process.env.NODE_ENV": JSON.stringify("production"),
    },
});
