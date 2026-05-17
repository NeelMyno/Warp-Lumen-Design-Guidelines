#!/usr/bin/env tsx
/**
 * generate-references — operator-side OpenAI invocation for materializing
 * the reference PNGs at `examples/gpt-image-2/<template>/`.
 *
 * Usage:
 *   export OPENAI_API_KEY="sk-…"
 *   pnpm prompts:generate-references                    # all templates
 *   pnpm prompts:generate-references --template mesh    # one template
 *   pnpm prompts:generate-references --dry-run          # assemble only, no API call
 *
 * What it does:
 *   1. Reads each examples/gpt-image-2/<template>/canonical-subject.md
 *   2. Extracts the canonical subject + frontmatter (model, quality, aspect, …)
 *   3. Calls the lumen-prompts CLI internally to assemble the full prompt
 *   4. POSTs to OpenAI's /v1/images/generations with the snapshot-pinned model
 *   5. Writes the base64-decoded PNG to the canonical output path
 *
 * Honesty about REST vs. ChatGPT thinking mode:
 *   The REST API call does not perfectly replicate a ChatGPT thinking-mode
 *   conversation that maintains cross-frame world state. For the `mesh`
 *   template (5 recipes that MUST be visually coherent as a set), prefer
 *   generating manually in one ChatGPT thinking-mode session and exporting
 *   the PNGs. The script handles `mesh` by sequential REST calls; review
 *   the set visually after generation and regenerate any recipe that drifts.
 */

import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");
const REFS_DIR = resolve(REPO_ROOT, "examples", "gpt-image-2");
const CLI_PATH = resolve(__dirname, "index.ts");

const TEMPLATES = [
  "hero-background",
  "abstract-shape",
  "illustration",
  "pattern",
  "mesh",
  "empty-state",
  "marketing-card",
] as const;

type TemplateName = (typeof TEMPLATES)[number];

interface Frontmatter {
  template: string;
  slug: string;
  model: string;
  quality: string;
  thinking_mode: boolean;
  aspect: string;
  output_resolution: string;
  output_file?: string;
  output_files?: string[];
  version: string;
}

interface CliArgs {
  template: TemplateName | "all";
  dryRun: boolean;
  help: boolean;
}

const USAGE = `Usage: pnpm prompts:generate-references [flags]

Flags:
  --template <name>   Generate references for one template only.
                      Choices: ${TEMPLATES.join(" | ")} | all (default).
  --dry-run           Assemble prompts and log API requests without calling OpenAI.
  --help, -h          Print this message.

Environment:
  OPENAI_API_KEY      Required for non-dry-run invocations.

Output:
  PNGs are written to examples/gpt-image-2/<template>/<slug>.png.
  The mesh template writes five PNGs (one per recipe) to mesh/<recipe>.png.
`;

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { template: "all", dryRun: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--template") {
      const next = argv[++i];
      if (!next) {
        console.error("--template requires a value");
        process.exit(2);
      }
      if (next !== "all" && !TEMPLATES.includes(next as TemplateName)) {
        console.error(
          `Unknown template: ${next}\nChoices: ${TEMPLATES.join(" | ")} | all`
        );
        process.exit(2);
      }
      args.template = next as TemplateName | "all";
    } else if (arg.startsWith("--")) {
      console.error(`Unknown flag: ${arg}`);
      process.exit(2);
    }
  }
  return args;
}

/** Parse the YAML-ish frontmatter at the top of a canonical-subject.md. */
function parseFrontmatter(md: string): Frontmatter {
  if (!md.startsWith("---\n")) {
    throw new Error("canonical-subject.md missing frontmatter");
  }
  const end = md.indexOf("\n---\n", 4);
  if (end < 0) throw new Error("canonical-subject.md frontmatter unterminated");
  const block = md.slice(4, end);

  const out: Record<string, unknown> = {};
  const lines = block.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.startsWith("#")) {
      i++;
      continue;
    }
    const colon = line.indexOf(":");
    if (colon < 0) {
      i++;
      continue;
    }
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim();
    if (value === "") {
      // List value follows on indented lines starting with "- ".
      const list: string[] = [];
      i++;
      while (i < lines.length && /^\s*-\s/.test(lines[i])) {
        list.push(lines[i].replace(/^\s*-\s+/, "").trim());
        i++;
      }
      out[key] = list;
    } else {
      // Coerce booleans + numbers leniently; everything else stays string.
      if (value === "true") out[key] = true;
      else if (value === "false") out[key] = false;
      else out[key] = value;
      i++;
    }
  }
  return out as unknown as Frontmatter;
}

/** Extract the first fenced code block content from a canonical-subject.md. */
function extractCanonicalSubject(md: string): string {
  const re = /```\n([\s\S]*?)\n```/;
  const m = md.match(re);
  if (!m) throw new Error("canonical-subject.md missing ```…``` subject block");
  return m[1].trim();
}

/** Extract the mesh recipe table — recipe name → subject text. */
function extractMeshRecipes(md: string): Map<string, string> {
  const out = new Map<string, string>();
  // Match table rows like: `| `recipe-name` | Subject text |`
  const re = /^\|\s*`([\w-]+)`\s*\|\s*([^|]+?)\s*\|/gm;
  for (const m of md.matchAll(re)) {
    out.set(m[1], m[2].trim());
  }
  return out;
}

/**
 * Map a Lumen aspect string to OpenAI's `size` parameter.
 * gpt-image-2 supports landscape (1792x1024), portrait (1024x1792), and
 * square (1024x1024). For other aspects we use the closest supported.
 */
function aspectToSize(aspect: string, output: string): string {
  // Prefer the explicit output_resolution if it matches a supported size.
  const supported = new Set([
    "1024x1024",
    "1792x1024",
    "1024x1792",
    "2048x2048", // some snapshots support 2K square
  ]);
  const normalized = output.replace("×", "x").toLowerCase().trim();
  if (supported.has(normalized)) return normalized;

  // Fall back to aspect-based mapping.
  if (aspect.startsWith("16:9") || aspect.startsWith("1.91:1")) return "1792x1024";
  if (aspect.startsWith("4:3")) return "1792x1024"; // closest landscape
  if (aspect.startsWith("9:16")) return "1024x1792";
  // Default to square.
  return "1024x1024";
}

/** Invoke the lumen-prompts CLI to assemble a single prompt. */
function assemblePrompt(template: TemplateName, subject: string): string {
  const res = spawnSync(
    "tsx",
    [CLI_PATH, template, "--subject", subject],
    { encoding: "utf-8", cwd: REPO_ROOT }
  );
  if (res.status !== 0) {
    console.error(`lumen-prompts CLI failed for ${template}:`);
    console.error(res.stderr);
    throw new Error(`CLI exit ${res.status}`);
  }
  return res.stdout;
}

interface ImageGenRequest {
  model: string;
  prompt: string;
  size: string;
  quality: string;
  n: number;
  response_format: "b64_json" | "url";
}

interface ImageGenResponse {
  created: number;
  data: Array<{ b64_json?: string; url?: string; revised_prompt?: string }>;
}

async function callOpenAI(req: ImageGenRequest, apiKey: string): Promise<ImageGenResponse> {
  const r = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(req),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`OpenAI API error ${r.status}: ${text}`);
  }
  return (await r.json()) as ImageGenResponse;
}

async function generateForTemplate(
  template: TemplateName,
  args: CliArgs,
  apiKey: string | null
): Promise<{ ok: number; fail: number }> {
  const dir = resolve(REFS_DIR, template);
  const manifestPath = resolve(dir, "canonical-subject.md");

  if (!existsSync(manifestPath)) {
    console.error(`SKIP ${template}: no canonical-subject.md at ${manifestPath}`);
    return { ok: 0, fail: 1 };
  }

  const manifestRaw = readFileSync(manifestPath, "utf-8");
  const fm = parseFrontmatter(manifestRaw);
  const size = aspectToSize(fm.aspect, fm.output_resolution);

  // Special handling for mesh: 5 recipes, 5 PNGs.
  if (template === "mesh") {
    const recipes = extractMeshRecipes(manifestRaw);
    if (recipes.size !== 5) {
      console.error(
        `mesh canonical-subject.md must define 5 recipes; found ${recipes.size}`
      );
      return { ok: 0, fail: 1 };
    }
    let ok = 0;
    let fail = 0;
    for (const [recipe, subject] of recipes) {
      const out = resolve(dir, `${recipe}.png`);
      console.log(`→ mesh/${recipe}.png  (size=${size}, quality=${fm.quality})`);
      try {
        const prompt = assemblePrompt("mesh", subject);
        if (args.dryRun) {
          console.log(`   [dry-run] prompt assembled (${prompt.length} chars)`);
          ok++;
          continue;
        }
        const req: ImageGenRequest = {
          model: fm.model,
          prompt,
          size,
          quality: fm.quality,
          n: 1,
          response_format: "b64_json",
        };
        const res = await callOpenAI(req, apiKey!);
        const b64 = res.data[0]?.b64_json;
        if (!b64) throw new Error("response missing b64_json");
        writeFileSync(out, Buffer.from(b64, "base64"));
        const bytes = statSync(out).size;
        console.log(`   ✓ wrote ${out} (${bytes} bytes)`);
        ok++;
      } catch (err) {
        console.error(`   ✗ ${recipe}: ${(err as Error).message}`);
        fail++;
      }
    }
    return { ok, fail };
  }

  // Single-PNG templates.
  const subject = extractCanonicalSubject(manifestRaw);
  const outFile = fm.output_file ?? `${fm.slug}.png`;
  const out = resolve(dir, outFile);

  console.log(`→ ${template}/${outFile}  (size=${size}, quality=${fm.quality})`);
  try {
    const prompt = assemblePrompt(template, subject);
    if (args.dryRun) {
      console.log(`   [dry-run] prompt assembled (${prompt.length} chars)`);
      return { ok: 1, fail: 0 };
    }
    const req: ImageGenRequest = {
      model: fm.model,
      prompt,
      size,
      quality: fm.quality,
      n: 1,
      response_format: "b64_json",
    };
    const res = await callOpenAI(req, apiKey!);
    const b64 = res.data[0]?.b64_json;
    if (!b64) throw new Error("response missing b64_json");
    writeFileSync(out, Buffer.from(b64, "base64"));
    const bytes = statSync(out).size;
    console.log(`   ✓ wrote ${out} (${bytes} bytes)`);
    return { ok: 1, fail: 0 };
  } catch (err) {
    console.error(`   ✗ ${template}: ${(err as Error).message}`);
    return { ok: 0, fail: 1 };
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(USAGE);
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY ?? null;
  if (!args.dryRun && !apiKey) {
    console.error(
      "OPENAI_API_KEY not set.\n\n" +
        "Set it before running:\n" +
        '  export OPENAI_API_KEY="sk-…"\n\n' +
        "Or pass --dry-run to assemble prompts without calling the API.\n"
    );
    process.exit(2);
  }

  const targets =
    args.template === "all" ? [...TEMPLATES] : [args.template as TemplateName];

  console.log(
    `lumen-prompts:generate-references  templates=[${targets.join(", ")}]  ${
      args.dryRun ? "(dry-run)" : ""
    }`
  );
  console.log("");

  let totalOk = 0;
  let totalFail = 0;
  for (const tpl of targets) {
    const { ok, fail } = await generateForTemplate(tpl, args, apiKey);
    totalOk += ok;
    totalFail += fail;
    console.log("");
  }

  console.log(`Done. ok=${totalOk} fail=${totalFail}`);
  process.exit(totalFail > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
