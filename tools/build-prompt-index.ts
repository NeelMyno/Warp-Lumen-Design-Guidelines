#!/usr/bin/env tsx
/**
 * build-prompt-index — emit a JSON manifest of the gpt-image-2 prompt library
 * for the audit dashboard /prompts route.
 *
 * Output: audit-dashboard/public/prompt-index.json
 *
 * Shape (consumed by audit-dashboard/src/app/prompts/client.tsx):
 *   {
 *     generated: "2026-05-17T...",
 *     version: "0.13.0",
 *     anchor: { path: "...", content: "...", immutable: true },
 *     templates: [
 *       {
 *         slug: "hero-background",
 *         name: "Hero Background",
 *         aspect: "16:9",
 *         output: "2560×1440",
 *         mode: "expressive",
 *         filePath: "design-system/05-prompts/hero-background.md",
 *         content: "<full markdown body, anchor inlined>",
 *         canonicalSubject?: { slug: "...", filePath: "...", content: "..." },
 *         referencePng?: "examples/gpt-image-2/hero-background/<slug>.png" | null,
 *       },
 *       ...
 *     ]
 *   }
 *
 * Zero external runtime dependencies. Uses shared `_stable-output` helper to
 * suppress timestamp-only churn (v0.13.4 fix — chat 14 missed this).
 */
import { writeStableJson } from "./_stable-output.js";

import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  existsSync,
} from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const OUT = join(ROOT, "audit-dashboard/public/prompt-index.json");

const VERSION = readFileSync(join(ROOT, "VERSION"), "utf-8").trim();

interface PromptTemplate {
  slug: string;
  name: string;
  aspect: string;
  output: string;
  mode: string;
  filePath: string;
  content: string;
  contentAssembled: string;
  contentLength: number;
  canonicalSubject?: {
    slug: string;
    filePath: string;
    content: string;
  } | null;
  referencePng?: string | null;
}

interface PromptIndex {
  generated: string;
  version: string;
  modelPin: string;
  anchor: { path: string; content: string; immutable: boolean };
  templates: PromptTemplate[];
}

function readFrontmatter(raw: string): Record<string, string> {
  const m = /^---\n([\s\S]+?)\n---/.exec(raw);
  if (!m) return {};
  const out: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const kv = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.+)$/.exec(line);
    if (kv) {
      out[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
    }
  }
  return out;
}

const PROMPTS_DIR = "design-system/05-prompts";
const EXAMPLES_DIR = "examples/gpt-image-2";

const anchorPath = join(ROOT, PROMPTS_DIR, "style-anchor.md");
const anchorContent = readFileSync(anchorPath, "utf-8");

const TEMPLATE_SLUGS = [
  "hero-background",
  "abstract-shape",
  "illustration",
  "pattern",
  "mesh",
  "empty-state",
  "marketing-card",
];

const templates: PromptTemplate[] = [];

for (const slug of TEMPLATE_SLUGS) {
  const filePath = `${PROMPTS_DIR}/${slug}.md`;
  const absPath = join(ROOT, filePath);
  if (!existsSync(absPath)) {
    console.warn(`[prompt-index] missing ${filePath}`);
    continue;
  }
  const raw = readFileSync(absPath, "utf-8");
  const fm = readFrontmatter(raw);
  const name = fm.name ?? slug;
  const aspect = fm.aspect ?? "";
  const output = fm.output ?? "";
  const mode = fm.mode ?? "restrained";

  // Assemble — replace `@import ./style-anchor.md` with the anchor body.
  const contentAssembled = raw.replace(
    /^@import \.\/style-anchor\.md\s*$/m,
    anchorContent,
  );

  // Canonical subject manifest.
  const canonicalSubjectDir = `${EXAMPLES_DIR}/${slug}`;
  const canonicalSubjectMdPath = join(
    ROOT,
    canonicalSubjectDir,
    "canonical-subject.md",
  );
  let canonicalSubject: PromptTemplate["canonicalSubject"] = null;
  if (existsSync(canonicalSubjectMdPath)) {
    const csRaw = readFileSync(canonicalSubjectMdPath, "utf-8");
    const csFm = readFrontmatter(csRaw);
    canonicalSubject = {
      slug: csFm.slug ?? slug,
      filePath: `${canonicalSubjectDir}/canonical-subject.md`,
      content: csRaw,
    };
  }

  // Reference PNG (operator-materialized; may not exist in repo).
  let referencePng: string | null = null;
  if (existsSync(join(ROOT, canonicalSubjectDir))) {
    try {
      const files = readdirSync(join(ROOT, canonicalSubjectDir));
      const png = files.find((f) => f.endsWith(".png"));
      if (png) referencePng = `${canonicalSubjectDir}/${png}`;
    } catch {
      // ignore
    }
  }

  templates.push({
    slug,
    name,
    aspect,
    output,
    mode,
    filePath,
    content: raw,
    contentAssembled,
    contentLength: contentAssembled.length,
    canonicalSubject,
    referencePng,
  });
}

const index: PromptIndex = {
  generated: "",  // overwritten by writeStableJson
  version: VERSION,
  modelPin: "gpt-image-2-2026-04-21",
  anchor: {
    path: `${PROMPTS_DIR}/style-anchor.md`,
    content: anchorContent,
    immutable: true,
  },
  templates,
};

writeStableJson(OUT, index as unknown as Record<string, unknown>, "generated");
console.log(
  `Wrote ${OUT.replace(ROOT, "")} — ${templates.length} templates, ${templates.filter((t) => t.referencePng).length} with reference PNGs.`,
);

// Suppress unused-imports warning under strict tsc.
void statSync;
void join;
