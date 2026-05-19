/**
 * Flat token map — every Lumen token as a string key → value pair.
 *
 * Source: _build/json/tokens.flat.json (Style Dictionary "flat-json" output).
 *
 * Useful for:
 *   - Token-bridge libraries (Tailwind plugins, Stitches themes, CSS-in-JS)
 *   - Runtime token-lookup by string path
 *   - Generating per-platform exports outside Style Dictionary
 */
import flat from "../../../_build/json/tokens.flat.json" with { type: "json" };
export const flatTokens = flat as Record<string, string | number>;
export default flatTokens;
