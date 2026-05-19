/**
 * CSS-side entry — re-exports the path to the Style-Dictionary-generated
 * tokens.css file at the repo root.
 *
 * Consumer apps that ship their own CSS pipeline:
 *
 *   import { cssPath } from "@warp/lumen-tokens/css";
 *   // copy or import the file at `cssPath` into your build
 *
 * Next.js + Vite users typically just import the file directly:
 *
 *   import "@warp/lumen-tokens/css.css";
 *
 * For the dark theme overrides:
 *
 *   import "@warp/lumen-tokens/css.dark.css";
 *
 * Currently both CSS files are bundled at the repo root in `_build/css/`.
 * In a future round (v0.14.1+) the build script will copy them into
 * `packages/lumen-tokens/dist/` for cleaner npm-pkg consumption.
 */
export const cssPath = "../../../_build/css/tokens.css";
export const cssDarkPath = "../../../_build/css/tokens.dark.css";
