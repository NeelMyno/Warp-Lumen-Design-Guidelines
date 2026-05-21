/**
 * Single source of truth for the user-facing Lumen version string.
 *
 * Why this exists: prior to v0.12.5 the version label was hardcoded in 7+
 * separate files (header pill, footer line, palette footer, foundations
 * brand-voice demos, library hero pill, tool hero pill, library footer).
 * v0.12.4 → v0.12.5 the audit caught that the command palette footer still
 * read "Lumen v0.11.13" — three minor versions stale — because nobody
 * remembered to grep the string.
 *
 * The fix: route every user-facing version label through this module. When
 * we cut the next release, the version updates here and everywhere at once.
 *
 * NOT for use in:
 *   - prose descriptions ("v0.10 retired JetBrains Mono…") — those reference
 *     historical versions and should stay literal.
 *   - ADR titles or filenames — those are immutable historical records.
 *   - CSS comments — comments document when a rule landed, not what's current.
 *
 * IS for use in:
 *   - any rendered <span>v0.12.5</span> the user sees.
 *   - any "SYSTEM V0.12 · LIVE"-style mono-cap signal.
 *   - any "last refreshed v0.12.5" footer.
 */

export const LUMEN_VERSION = "v0.15.0" as const;

/** "v0.13" — drops the patch. Use in lumen-mono-cap (CSS uppercases the rendered text). */
export const LUMEN_VERSION_MAJOR_MINOR = "v0.15" as const;

/** "V0.13" for places that explicitly need the uppercased token in the source. */
export const LUMEN_VERSION_MAJOR_MINOR_UPPER = "V0.15" as const;
