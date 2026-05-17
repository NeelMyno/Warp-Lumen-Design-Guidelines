#!/usr/bin/env tsx
/**
 * build-component-index — emit a single JSON manifest of every Lumen component
 * for the audit dashboard /library/registry route.
 *
 * Output: audit-dashboard/public/component-index.json
 *
 * Shape (consumed by audit-dashboard/src/app/library/registry/client.tsx):
 *   {
 *     generated: "2026-05-17T...",
 *     version: "0.13.0",
 *     components: [
 *       {
 *         slug: "button",
 *         name: "Button",
 *         tier: 1,           // 1 primitive | 2 composed | 3 signature | 4 freight | 5 ai | 0 unknown
 *         category: "form",
 *         family: "Conversation",      // T5 family name when set
 *         status: "stable",
 *         deprecated: false,
 *         summary: "...",
 *         installCommand: "npx shadcn@latest add @lumen/button",
 *         tokens: ["color.surface.canvas", ...],
 *         mode: "agnostic" | "restrained-only" | "expressive-only",
 *         neverRuleCount: 5,
 *         hasComponentJson: true,
 *         hasSkillMd: true,
 *         hasStorybook: true,
 *         platforms: ["web", "ios", ...],
 *         phase: 5,
 *         vercelAiElements?: "Conversation",
 *       },
 *       ...
 *     ]
 *   }
 *
 * Zero external dependencies.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const OUT = join(ROOT, "audit-dashboard/public/component-index.json");

const VERSION = readFileSync(join(ROOT, "VERSION"), "utf-8").trim();

interface ComponentEntry {
  slug: string;
  name: string;
  tier: number;
  category: string;
  family?: string;
  status: string;
  deprecated: boolean;
  summary: string;
  installCommand: string;
  tokens: string[];
  mode: "agnostic" | "restrained-only" | "expressive-only";
  neverRuleCount: number;
  hasComponentJson: boolean;
  hasSkillMd: boolean;
  hasStorybook: boolean;
  hasTsx: boolean;
  platforms: string[];
  phase?: number;
  vercelAiElements?: string;
  installCount: number;
}

interface ComponentIndex {
  generated: string;
  version: string;
  totals: {
    components: number;
    byTier: Record<string, number>;
    deprecated: number;
  };
  components: ComponentEntry[];
}

function readJson<T = unknown>(path: string): T | null {
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as T;
  } catch {
    return null;
  }
}

function readFrontmatter(mdPath: string): Record<string, unknown> {
  let raw = "";
  try {
    raw = readFileSync(mdPath, "utf-8");
  } catch {
    return {};
  }
  const m = /^---\n([\s\S]+?)\n---/.exec(raw);
  if (!m) return {};
  const out: Record<string, unknown> = {};
  const lines = m[1].split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const kv = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.+)?$/.exec(line);
    if (kv) {
      const key = kv[1];
      const val = (kv[2] ?? "").trim();
      if (val) {
        // Strip wrapping quotes/brackets, leave naked value.
        let cleaned = val.replace(/^["']|["']$/g, "");
        if (cleaned.startsWith("[") && cleaned.endsWith("]")) {
          cleaned = cleaned
            .slice(1, -1)
            .split(",")
            .map((s) => s.trim().replace(/^["']|["']$/g, ""))
            .filter(Boolean) as unknown as string;
        }
        out[key] = cleaned;
        i++;
      } else {
        // Block-list following indented "- value" lines.
        const arr: string[] = [];
        i++;
        while (i < lines.length && /^\s+-\s+/.test(lines[i])) {
          arr.push(lines[i].replace(/^\s+-\s+/, "").trim());
          i++;
        }
        out[key] = arr;
      }
    } else {
      i++;
    }
  }
  return out;
}

function countNeverRules(skillMdPath: string): number {
  try {
    const raw = readFileSync(skillMdPath, "utf-8");
    // Match lines that start with "- NEVER " or "* NEVER " in any case at line start.
    const re = /^[-*]\s+NEVER\b/gm;
    return raw.match(re)?.length ?? 0;
  } catch {
    return 0;
  }
}

function detectMode(
  componentJson: Record<string, unknown> | null,
  componentMd: Record<string, unknown>,
): "agnostic" | "restrained-only" | "expressive-only" {
  // component.json may carry `meta.mode`; component.md frontmatter may carry `mode`.
  const fromMeta =
    componentJson &&
    typeof componentJson.meta === "object" &&
    componentJson.meta &&
    typeof (componentJson.meta as { mode?: string }).mode === "string"
      ? (componentJson.meta as { mode: string }).mode
      : null;
  const fromMd =
    typeof componentMd.mode === "string" ? (componentMd.mode as string) : null;
  const raw = fromMeta ?? fromMd ?? "dual";
  if (raw === "restrained-only" || raw === "restrained")
    return "restrained-only";
  if (raw === "expressive-only" || raw === "expressive")
    return "expressive-only";
  return "agnostic";
}

function inferTier(slug: string): number {
  const T1 = new Set([
    "button",
    "input",
    "card",
    "sheet",
    "popover",
    "tooltip",
    "toast",
    "badge",
    "tag",
    "avatar",
    "skeleton",
    "spinner",
    "tabs",
    "breadcrumb",
    "switch",
    "checkbox",
    "radio",
    "slider",
    "progress",
  ]);
  const T2 = new Set([
    "data-table",
    "command-palette",
    "drawer",
    "modal",
    "dropdown-menu",
    "combobox",
    "calendar",
    "date-picker",
    "filter-builder",
    "filter-chip",
    "saved-view",
    "sidebar",
    "top-bar",
    "pagination",
    "accordion",
  ]);
  const T3 = new Set(["stat", "live-dot", "rate-ticker"]);
  const T4 = new Set([
    "lane-code",
    "lane-arc",
    "shipment-timeline",
    "route-map",
    "dock-bay",
    "cross-dock-grid",
    "carrier-badge",
    "pallet-tile",
    "otr-truck-iso",
    "quote-builder",
  ]);
  const T5 = new Set([
    "conversation",
    "message",
    "message-response",
    "message-branch",
    "reasoning",
    "tool",
    "confirmation",
    "sources",
    "inline-citation",
    "prompt-input",
    "suggestion-strip",
    "actions",
    "loader-ai",
    "artifact",
    "web-preview",
    "jsx-preview",
    "sandbox-block",
    "schema-display",
    "snippet",
    "stack-trace",
    "terminal",
    "agent-state",
    "task-card",
    "commit-card",
    "context-window",
    "response-text",
    "voice-audio-stub",
    "workflow-canvas-stub",
  ]);
  if (T1.has(slug)) return 1;
  if (T2.has(slug)) return 2;
  if (T3.has(slug)) return 3;
  if (T4.has(slug)) return 4;
  if (T5.has(slug)) return 5;
  return 0;
}

function slugToPascal(slug: string): string {
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

const COMPS_DIR = join(ROOT, "design-system/02-components");

const components: ComponentEntry[] = [];
let dirs: string[] = [];
try {
  dirs = readdirSync(COMPS_DIR).filter((d) => {
    if (d.startsWith("_")) return false;
    try {
      return statSync(join(COMPS_DIR, d)).isDirectory();
    } catch {
      return false;
    }
  });
} catch {
  console.error(`Cannot read ${COMPS_DIR}`);
  process.exit(2);
}

for (const slug of dirs.sort()) {
  const dir = join(COMPS_DIR, slug);
  const componentJsonPath = join(dir, "component.json");
  const componentMdPath = join(dir, "component.md");
  const namedMdPath = join(dir, `${slug}.md`);
  const namedSkillPath = join(dir, `${slug}.skill.md`);
  const namedStoriesPath = join(dir, `${slug}.stories.tsx`);
  const namedTsxPath = join(dir, `${slug}.tsx`);
  const inner = (() => {
    try {
      return readdirSync(dir);
    } catch {
      return [];
    }
  })();

  const componentJson = readJson<Record<string, unknown>>(componentJsonPath);
  // Prefer named MD if it exists, otherwise the canonical component.md.
  const mdPath = inner.includes(`${slug}.md`) ? namedMdPath : componentMdPath;
  const md = readFrontmatter(mdPath);

  const name =
    (componentJson &&
      typeof componentJson.name === "string" &&
      componentJson.name) ||
    (typeof md.name === "string" ? md.name : slugToPascal(slug));

  const summary =
    (componentJson &&
      typeof componentJson.summary === "string" &&
      componentJson.summary) ||
    (typeof md.summary === "string" ? md.summary : "");

  const status =
    (componentJson &&
      typeof componentJson.status === "string" &&
      componentJson.status) ||
    (typeof md.status === "string" ? md.status : "stable");

  const deprecated =
    componentJson && typeof componentJson.deprecated === "boolean"
      ? componentJson.deprecated
      : md.deprecated === true || md.deprecated === "true";

  const category =
    (componentJson &&
      typeof componentJson.meta === "object" &&
      componentJson.meta &&
      typeof (componentJson.meta as { category?: string }).category === "string"
      ? (componentJson.meta as { category: string }).category
      : (typeof md.category === "string" ? md.category : "uncategorized"));

  const family = typeof md.family === "string" ? md.family : undefined;

  const phase =
    typeof md.phase === "string" && /^\d+$/.test(md.phase)
      ? Number(md.phase)
      : typeof md.phase === "number"
        ? md.phase
        : undefined;

  const vercelAiElements =
    typeof md.vercel_ai_elements === "string"
      ? md.vercel_ai_elements
      : undefined;

  const tokens = Array.isArray(md.tokens)
    ? (md.tokens as string[]).map((s) => s.replace(/[{}]/g, ""))
    : [];

  const platforms = Array.isArray(md.platforms)
    ? (md.platforms as string[])
    : ["web"];

  const tier = inferTier(slug);
  const installCommand = `npx shadcn@latest add @lumen/${slug}`;

  components.push({
    slug,
    name,
    tier,
    category,
    family,
    status,
    deprecated,
    summary,
    installCommand,
    tokens,
    mode: detectMode(componentJson, md),
    neverRuleCount: countNeverRules(namedSkillPath),
    hasComponentJson: inner.includes("component.json"),
    hasSkillMd: inner.includes(`${slug}.skill.md`),
    hasStorybook: inner.includes(`${slug}.stories.tsx`),
    hasTsx: inner.includes(`${slug}.tsx`),
    platforms,
    phase,
    vercelAiElements,
    installCount: 1, // Placeholder for future usage telemetry
  });
}

const byTier: Record<string, number> = {};
for (const c of components) {
  const key = `tier-${c.tier}`;
  byTier[key] = (byTier[key] ?? 0) + 1;
}

const index: ComponentIndex = {
  generated: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
  version: VERSION,
  totals: {
    components: components.length,
    byTier,
    deprecated: components.filter((c) => c.deprecated).length,
  },
  components,
};

writeFileSync(OUT, JSON.stringify(index, null, 2) + "\n", "utf-8");
console.log(
  `Wrote ${OUT.replace(ROOT, "")} — ${components.length} components, tier breakdown ${Object.entries(
    byTier,
  )
    .map(([k, v]) => `${k}=${v}`)
    .join(" ")}.`,
);
