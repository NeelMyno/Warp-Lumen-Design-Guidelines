#!/usr/bin/env tsx
/**
 * build-llms-txt — flatten the entire Lumen design system into a single
 * MD-flavored file suitable for direct ingestion into an LLM context window.
 *
 * Usage:
 *   pnpm llms                 → writes llms-full.txt at repo root
 *   pnpm llms -- --dry-run    → prints file count + total chars, writes nothing
 *
 * Sections (preserve this order — llms.txt indexes the same shape):
 *   §1 Foundations    00-foundations/*.md
 *   §2 Tokens         01-tokens/{primitives,semantic,modes,components}/**.tokens.json
 *   §3 Components     02-components/<name>/{*.md,*.skill.md,component.json}
 *   §4 Patterns       03-patterns/*.md
 *   §5 Platforms      04-platforms/*.md
 *   §6 Prompts        05-prompts/*.md
 *   §7 Briefings      doc/LUMEN-v0.13-MASTER-REFACTOR.md + 06-claude-code-briefings/*.md
 *
 * Why this exists: Phase 4 + Phase 5 deferred llms-full.txt regeneration to
 * Phase 6 because partial updates would mix v0.13 content into v0.12.5 framing.
 * Phase 6 rebuilds the file end-to-end against the final v0.13.0 shape.
 *
 * Zero external dependencies — uses node:fs recursion (matches the audit-tokens.ts
 * convention; root package.json has no `glob` dep on purpose).
 */

import { readFileSync, statSync, readdirSync } from "node:fs";
import { writeStableText, stableTimestamp } from "./_stable-output.js";
import { resolve, relative, join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const OUT = join(ROOT, "llms-full.txt");

interface Section {
  title: string;
  /** Each rule is { dir, recursive, filter(name) → boolean } */
  rules: Array<{
    dir: string;
    recursive: boolean;
    filter: (relPath: string) => boolean;
  }>;
}

const SECTIONS: Section[] = [
  {
    title: "§1. Foundations",
    rules: [
      {
        dir: "design-system/00-foundations",
        recursive: false,
        filter: (p) => p.endsWith(".md"),
      },
    ],
  },
  {
    title: "§2. Tokens (DTCG 2025.10)",
    rules: [
      {
        dir: "design-system/01-tokens/primitives",
        recursive: false,
        filter: (p) => p.endsWith(".tokens.json"),
      },
      {
        dir: "design-system/01-tokens/semantic",
        recursive: false,
        filter: (p) => p.endsWith(".tokens.json"),
      },
      {
        dir: "design-system/01-tokens/modes",
        recursive: false,
        filter: (p) => p.endsWith(".tokens.json"),
      },
      {
        dir: "design-system/01-tokens/components",
        recursive: true,
        filter: (p) => p.endsWith(".tokens.json"),
      },
    ],
  },
  {
    title: "§3. Components",
    rules: [
      {
        dir: "design-system/02-components",
        recursive: true,
        filter: (p) =>
          !p.includes("/_schema/") &&
          !p.includes("/examples/") &&
          !p.startsWith("_schema/") &&
          !p.startsWith("examples/") &&
          (p.endsWith("component.json") ||
            p.endsWith("component.md") ||
            p.endsWith(".skill.md") ||
            (p.endsWith(".md") &&
              !p.endsWith("/component.md") &&
              !p.endsWith("/README.md"))),
      },
    ],
  },
  {
    title: "§4. Patterns",
    rules: [
      {
        dir: "design-system/03-patterns",
        recursive: false,
        filter: (p) => p.endsWith(".md"),
      },
    ],
  },
  {
    title: "§5. Platforms",
    rules: [
      {
        dir: "design-system/04-platforms",
        recursive: false,
        filter: (p) => p.endsWith(".md"),
      },
    ],
  },
  {
    title: "§6. Prompts (gpt-image-2)",
    rules: [
      {
        dir: "design-system/05-prompts",
        recursive: false,
        filter: (p) => p.endsWith(".md"),
      },
    ],
  },
  {
    title: "§7. Briefings",
    rules: [
      {
        dir: "doc",
        recursive: false,
        filter: (p) => p === "LUMEN-v0.13-MASTER-REFACTOR.md",
      },
      {
        dir: "design-system/06-claude-code-briefings",
        recursive: false,
        filter: (p) => p.endsWith(".md"),
      },
    ],
  },
];

/**
 * Walk a directory and return relative paths to files that match `filter`.
 * `relPath` is rooted at `baseDir` (no leading "./").
 */
function walk(baseDir: string, recursive: boolean): string[] {
  const out: string[] = [];
  function visit(absDir: string, relFromBase: string) {
    let entries: string[] = [];
    try {
      entries = readdirSync(absDir);
    } catch {
      return;
    }
    for (const name of entries) {
      const abs = join(absDir, name);
      const rel = relFromBase ? `${relFromBase}/${name}` : name;
      let st;
      try {
        st = statSync(abs);
      } catch {
        continue;
      }
      if (st.isDirectory()) {
        if (recursive) visit(abs, rel);
      } else if (st.isFile()) {
        out.push(rel);
      }
    }
  }
  visit(join(ROOT, baseDir), "");
  return out;
}

const DRY_RUN = process.argv.includes("--dry-run");

const VERSION = readFileSync(join(ROOT, "VERSION"), "utf-8").trim();

const HEADER = `# Lumen Design System — Full Reference (v${VERSION})

> Single-file flattened dump of the entire Lumen design system. Generated by
> \`tools/build-llms-txt.ts\` — DO NOT EDIT BY HAND. The next \`pnpm llms\`
> run will overwrite this file.
>
> For the indexed (~5-10K-token) version, see [\`llms.txt\`](./llms.txt).
> For the canonical source, see https://github.com/NeelMyno/Warp-Lumen-Design-Guidelines.
>
> Generated: ${stableTimestamp()}
> Lumen version: v${VERSION}
> Section order: foundations → tokens → components → patterns → platforms → prompts → briefings

`;

let out = HEADER;
let fileCount = 0;

for (const section of SECTIONS) {
  out += `\n---\n\n## ${section.title}\n\n`;
  const collected = new Set<string>();
  for (const rule of section.rules) {
    const found = walk(rule.dir, rule.recursive).filter(rule.filter);
    for (const rel of found) {
      collected.add(`${rule.dir}/${rel}`);
    }
  }
  const files = Array.from(collected).sort();
  if (files.length === 0) {
    out += `_(no files matched)_\n`;
    continue;
  }
  for (const relPath of files) {
    fileCount++;
    const abs = join(ROOT, relPath);
    let size = 0;
    try {
      size = statSync(abs).size;
    } catch {
      continue;
    }
    const content = readFileSync(abs, "utf-8");

    out += `\n### ${relPath}\n\n`;
    out += `<!-- bytes: ${size} -->\n\n`;
    if (relPath.endsWith(".json")) {
      out += "```json\n";
      out += content.trimEnd();
      out += "\n```\n";
    } else {
      out += content.trimEnd() + "\n";
    }
  }
}

const stats = `\n\n---\n\n## Generation stats\n\n- Files: ${fileCount}\n- Total chars: ${out.length.toLocaleString()}\n- Approx tokens: ${Math.round(out.length / 4).toLocaleString()} (rule-of-thumb)\n- Lumen version: v${VERSION}\n- Generated: ${stableTimestamp()}\n`;
out += stats;

if (DRY_RUN) {
  console.log(
    `[dry-run] would write llms-full.txt — ${fileCount} files, ${out.length.toLocaleString()} chars, ~${Math.round(out.length / 4).toLocaleString()} tokens.`,
  );
} else {
  // v0.13.4 — content-stable write: preserve existing `Generated:` timestamps
  // when the body content is unchanged. Eliminates every-gate-run dirt.
  writeStableText(OUT, out, /^> Generated: .+$|^- Generated: .+$/gm);
  console.log(
    `Wrote ${relative(ROOT, OUT)} — ${fileCount} files, ${out.length.toLocaleString()} chars, ~${Math.round(out.length / 4).toLocaleString()} tokens.`,
  );
}

// Suppress unused-import warning under strict tsc.
void resolve;
