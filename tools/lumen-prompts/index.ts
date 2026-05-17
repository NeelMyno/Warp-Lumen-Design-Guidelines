#!/usr/bin/env tsx
/**
 * lumen-prompts — emit a fully-assembled gpt-image-2 prompt string
 * given a template name and a subject.
 *
 * Usage:
 *   pnpm prompts <template> --subject "..." [--composition "..."] [--mode "..."] [--snapshot]
 *
 * Templates: hero-background | abstract-shape | illustration | pattern |
 *            mesh | empty-state | marketing-card
 *
 * Examples:
 *   pnpm prompts hero-background --subject "route arc over a dim freight lane map"
 *   pnpm prompts mesh --subject "aurora-spring"
 *   pnpm prompts empty-state --subject "single freight pallet awaiting load" --snapshot
 *
 * Output: a complete prompt on stdout, ready to paste into ChatGPT.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");
const PROMPTS_DIR = resolve(REPO_ROOT, "design-system", "05-prompts");

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

interface CliArgs {
  template: TemplateName | null;
  subject: string;
  composition: string | null;
  mode: string | null;
  snapshot: boolean;
  help: boolean;
}

const USAGE = `Usage: pnpm prompts <template> --subject "..." [flags]

Templates:
  ${TEMPLATES.map((t) => `- ${t}`).join("\n  ")}

Flags:
  --subject <text>     The subject fill for the template (required).
                       For 'mesh', pass one of: aurora-spring | aurora-cool |
                       dock-bay | lane-arc | cross-dock.
  --composition <text> Override the composition block (optional).
  --mode <text>        Override the mode block (optional: 'restrained' | 'expressive').
  --snapshot           Emit a date-stamped header for archival diffing.
  --help, -h           Print this message.

Examples:
  pnpm prompts hero-background --subject "route arc over a dim freight lane map"
  pnpm prompts mesh --subject "aurora-spring"
  pnpm prompts empty-state --subject "single freight pallet awaiting load" --snapshot

Lumen icons are NEVER generated via gpt-image-2 — they are hand-drawn vectors.
If you ask for 'icon' as a template, this CLI rejects the request. See
doc/LUMEN-v0.13-MASTER-REFACTOR.md §3 "Imagery" for the rule.
`;

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    template: null,
    subject: "",
    composition: null,
    mode: null,
    snapshot: false,
    help: false,
  };

  const positionals: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (arg === "--snapshot") {
      args.snapshot = true;
    } else if (arg === "--subject") {
      args.subject = argv[++i] ?? "";
    } else if (arg === "--composition") {
      args.composition = argv[++i] ?? null;
    } else if (arg === "--mode") {
      args.mode = argv[++i] ?? null;
    } else if (arg.startsWith("--")) {
      console.error(`Unknown flag: ${arg}`);
      process.exit(2);
    } else {
      positionals.push(arg);
    }
  }

  if (positionals.length > 0) {
    args.template = positionals[0] as TemplateName;
  }
  return args;
}

function rejectIconRequest(template: string | null): void {
  const iconish = new Set([
    "icon",
    "icons",
    "iconography",
    "lumen-icon",
    "glyph",
    "glyphs",
    "symbol",
    "symbols",
  ]);
  if (template !== null && iconish.has(template)) {
    console.error(
      `lumen-prompts: '${template}' is not a generatable asset.\n\n` +
        `Lumen icons are hand-drawn vectors at 1.5px stroke, never gpt-image-2 output.\n` +
        `See doc/LUMEN-v0.13-MASTER-REFACTOR.md §3 "Imagery" — \n` +
        `Hard rule: gpt-image-2 generates atmosphere, NEVER icons.\n\n` +
        `If you need an icon, see design-system/00-foundations/iconography.md\n` +
        `or commission one via the icon-design workflow in _meta/prompts/.\n`
    );
    process.exit(3);
  }
}

function readPrompt(template: TemplateName): string {
  const path = resolve(PROMPTS_DIR, `${template}.md`);
  if (!existsSync(path)) {
    console.error(`Template not found on disk: ${path}`);
    process.exit(4);
  }
  return readFileSync(path, "utf-8");
}

function readAnchor(): string {
  const path = resolve(PROMPTS_DIR, "style-anchor.md");
  if (!existsSync(path)) {
    console.error(`Style anchor not found: ${path}`);
    process.exit(5);
  }
  return readFileSync(path, "utf-8");
}

/**
 * Strip the frontmatter (between leading `---` fences) from a markdown file.
 * Templates and the anchor both ship with frontmatter; the gpt-image-2 prompt
 * does not need it. The model reads the body only.
 */
function stripFrontmatter(md: string): string {
  if (!md.startsWith("---\n")) return md;
  const end = md.indexOf("\n---\n", 4);
  if (end < 0) return md;
  return md.slice(end + 5).replace(/^\n+/, "");
}

/**
 * Strip our warning + immutability callout block from the anchor so the model
 * doesn't ingest LLM-facing metadata as image guidance. Everything from the
 * first `> [!warning]` line through the first horizontal rule (`---`) is removed.
 */
function stripAnchorMeta(anchor: string): string {
  const warnStart = anchor.indexOf("> [!warning]");
  if (warnStart < 0) return anchor;
  const ruleAfterWarn = anchor.indexOf("\n---\n", warnStart);
  if (ruleAfterWarn < 0) return anchor;
  return anchor.slice(ruleAfterWarn + 5).replace(/^\n+/, "");
}

/**
 * Fill every [FILL THIS SLOT ...] marker in the assembled prompt with the
 * caller-provided subject. Matches the phase 4 prompt's reference CLI: the
 * anchor's Subject slot, the anchor's Use-case slot, and each template's
 * instructional slot all receive the same subject text. The template's
 * Use-case override and Composition override blocks (which carry richer
 * per-template content) come AFTER the inlined anchor and re-specify the
 * use case in template-specific language — that re-specification is the
 * canonical use case the model reads. The anchor slot fill is a defensive
 * default in case a template lacks an override block.
 */
function fillSubjectSlot(prompt: string, subject: string): string {
  if (!subject) return prompt;
  // Global match — every [FILL THIS SLOT...] block, multiline-safe.
  const slotRe = /\[FILL THIS SLOT[\s\S]*?\]/g;
  return prompt.replace(slotRe, subject);
}

function applyCompositionOverride(prompt: string, override: string | null): string {
  if (!override) return prompt;
  // Replace the `## Composition override` block from the heading through to
  // the next `## ` heading (non-inclusive). If no Composition override block
  // exists in the template, no-op.
  const re = /^(## Composition override)[\s\S]*?(?=^## )/m;
  return prompt.replace(re, `## Composition override\n${override}\n\n`);
}

function applyModeOverride(prompt: string, override: string | null): string {
  if (!override) return prompt;
  const re = /^(## Mode)[\s\S]*?(?=^## |^# |\Z)/m;
  return prompt.replace(re, `## Mode\n${override}\n\n`);
}

function snapshotHeader(template: TemplateName, subject: string): string {
  const stamp = new Date().toISOString().slice(0, 19) + "Z";
  return [
    `<!-- lumen-prompts snapshot -->`,
    `<!-- template: ${template} -->`,
    `<!-- subject:  ${subject.replace(/-->/g, "--&gt;")} -->`,
    `<!-- emitted:  ${stamp} -->`,
    `<!-- model:    gpt-image-2-2026-04-21 -->`,
    ``,
  ].join("\n");
}

function assemble(args: CliArgs): string {
  if (args.template === null) {
    console.error(USAGE);
    process.exit(2);
  }

  rejectIconRequest(args.template);

  if (!TEMPLATES.includes(args.template)) {
    console.error(
      `Unknown template: '${args.template}'.\n\n` +
        `Available templates:\n  ${TEMPLATES.map((t) => `- ${t}`).join("\n  ")}\n`
    );
    process.exit(2);
  }

  const rawAnchor = readAnchor();
  const rawTemplate = readPrompt(args.template);

  // 1. Strip frontmatter from both — frontmatter is for human/LLM-agent
  //    discovery, not for the image model.
  const anchorBody = stripAnchorMeta(stripFrontmatter(rawAnchor));
  let templateBody = stripFrontmatter(rawTemplate);

  // 2. Replace the @import directive with the inlined anchor body.
  templateBody = templateBody.replace(
    /^@import \.\/style-anchor\.md\s*$/m,
    anchorBody.trim()
  );

  // 3. Fill the Subject slot with the user-supplied subject.
  templateBody = fillSubjectSlot(templateBody, args.subject);

  // 4. Apply optional overrides.
  templateBody = applyCompositionOverride(templateBody, args.composition);
  templateBody = applyModeOverride(templateBody, args.mode);

  // 5. Optional snapshot header for archival diffing.
  if (args.snapshot) {
    templateBody = snapshotHeader(args.template, args.subject) + templateBody;
  }

  return templateBody.trim() + "\n";
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(USAGE);
    return;
  }

  if (!args.template) {
    console.error(USAGE);
    process.exit(2);
  }

  if (!args.subject && args.template !== null) {
    console.error(
      `lumen-prompts: --subject is required.\n\n` +
        `Run with --help for usage.\n`
    );
    process.exit(2);
  }

  const assembled = assemble(args);
  process.stdout.write(assembled);
}

main();
