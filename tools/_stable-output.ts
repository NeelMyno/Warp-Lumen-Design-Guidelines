/**
 * Shared helper for content-stable output writing.
 *
 * Re-running a generator without source changes should NOT modify the output
 * file — otherwise every gate run dirties the working tree with timestamp
 * churn (and consumers see spurious commits when only the timestamp moved).
 *
 * The pattern:
 *   1. Compute the new output.
 *   2. Read the existing file (if any).
 *   3. Compare content excluding the timestamp field.
 *   4. If identical, preserve the existing timestamp.
 *   5. Otherwise, write the new timestamp.
 *
 * Honors `SOURCE_DATE_EPOCH` env var (per the reproducible-builds convention)
 * for fully deterministic builds in CI.
 *
 * v0.13.4 — added per Phase 10 cleanup (chat 14 missed this — every gate
 * run was producing dirty index/baseline files even when nothing changed).
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

/**
 * Returns an ISO-8601 timestamp with second precision (drops millis), honoring
 * SOURCE_DATE_EPOCH if present.
 */
export function stableTimestamp(): string {
  const env = process.env.SOURCE_DATE_EPOCH;
  if (env && /^\d+$/.test(env)) {
    return new Date(Number(env) * 1000).toISOString().replace(/\.\d{3}Z$/, "Z");
  }
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

/**
 * Write a JSON object to `outPath`. If the existing file's content (excluding
 * `timestampField`) is byte-equivalent to the new content, preserve the
 * existing timestamp instead of overwriting with the new one.
 */
export function writeStableJson(
  outPath: string,
  newObj: Record<string, unknown>,
  timestampField: string,
): void {
  if (existsSync(outPath)) {
    try {
      const existing = JSON.parse(readFileSync(outPath, "utf-8"));
      const existingTs = existing[timestampField];
      const stripA = { ...existing, [timestampField]: "<ts>" };
      const stripB = { ...newObj, [timestampField]: "<ts>" };
      if (JSON.stringify(stripA) === JSON.stringify(stripB)) {
        newObj[timestampField] = existingTs;
        writeFileSync(outPath, JSON.stringify(newObj, null, 2) + "\n", "utf-8");
        return;
      }
    } catch {
      // existing file unreadable; fall through to overwrite
    }
  }
  if (!(timestampField in newObj) || typeof newObj[timestampField] !== "string") {
    newObj[timestampField] = stableTimestamp();
  }
  writeFileSync(outPath, JSON.stringify(newObj, null, 2) + "\n", "utf-8");
}

/**
 * Write a text/markdown file. Strip lines matching `timestampLinePattern` from
 * BOTH existing + new content for comparison. If identical, restore the
 * existing timestamp line(s) in the output. Otherwise overwrite.
 *
 * `timestampLinePattern` should be a RegExp that matches the FULL timestamp line
 * (typically including its surrounding text — e.g., `/^> Generated: .+$/m`).
 */
export function writeStableText(
  outPath: string,
  newContent: string,
  timestampLinePattern: RegExp,
): void {
  if (existsSync(outPath)) {
    try {
      const existing = readFileSync(outPath, "utf-8");
      const strippedExisting = existing.replace(timestampLinePattern, "<ts>");
      const strippedNew = newContent.replace(timestampLinePattern, "<ts>");
      if (strippedExisting === strippedNew) {
        // Identical content; preserve existing timestamps by writing existing back.
        writeFileSync(outPath, existing, "utf-8");
        return;
      }
    } catch {
      // unreadable; fall through
    }
  }
  writeFileSync(outPath, newContent, "utf-8");
}
