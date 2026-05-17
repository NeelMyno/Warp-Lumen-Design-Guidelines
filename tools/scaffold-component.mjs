#!/usr/bin/env node
/**
 * tools/scaffold-component.mjs — v0.13 Phase 2 generator
 * --------------------------------------------------------------------------
 * Reads a component spec (JSON) and writes the 6 templated files into
 * `design-system/02-components/<name>/`. The TSX (canonical implementation)
 * is NOT generated — author it by hand alongside the spec.
 *
 * Usage:
 *   node tools/scaffold-component.mjs path/to/spec.json   # one component
 *   node tools/scaffold-component.mjs tools/specs/*.json  # all specs
 *
 * Spec shape — see tools/specs/_README.md.
 *
 * Idempotent: re-running overwrites generated files. Hand-edited files are
 * never touched (only the six templated outputs).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function read(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content.endsWith("\n") ? content : content + "\n");
}

/* ---------------------------------------------------------------- TEMPLATES */

function mdTemplate(spec) {
  const tokens = (spec.tokensConsumed ?? []).map((t) => `  - ${t}`).join("\n");
  const related = (spec.related ?? []).map((r) => `"${r}"`).join(", ");
  const platforms = (spec.platforms ?? ["web"]).map((p) => `"${p}"`).join(", ");
  return `---
name: ${spec.title || spec.name}
category: ${spec.category}
lumen_version: 0.13.0
status: ${spec.status || "stable"}
mode: ${spec.modeAware ? "dual" : "agnostic"}
platforms: [${platforms}]
tokens:
${tokens || "  - (none — sets data-mode)"}
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: [${related}]
ai_naming: ${spec.aiNaming || "lumen-native"}
mcp_install: "npx shadcn add @lumen/${spec.name}"
---

# ${spec.title || spec.name}

${spec.summary}

## When to use

${(spec.useWhen ?? ["When the consumer needs " + (spec.summary?.split(".")[0]?.toLowerCase() || "this affordance") + "."]).map((u) => `- ${u}`).join("\n")}

## Anatomy

${(spec.anatomy ?? ["${spec.title || spec.name} root"]).map((a, i) => `${i + 1}. ${a}`).join("\n")}

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent \`<ModeScope mode="expressive">\` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

${(spec.a11yRules ?? [
  "Renders with a visible focus ring on every focusable child.",
  "Honors prefers-reduced-motion via the global motion layer.",
  "Honors prefers-reduced-transparency on any glass surface.",
]).map((r) => `- ${r}`).join("\n")}

## Tokens consumed

${(spec.tokensConsumed ?? []).map((t) => `- \`${t}\``).join("\n") || "_None — this component is purely structural._"}

## Do

${(spec.do ?? ["Compose this primitive inside a Lumen surface."]).map((d) => `- ${d}`).join("\n")}

## Don't

${(spec.dont ?? ["Hardcode color or spacing — read tokens via CSS variables."]).map((d) => `- ${d}`).join("\n")}

## Related

${(spec.related ?? []).map((r) => `- ${r}`).join("\n") || "_(none)_"}

## Code

\`\`\`tsx
${spec.exampleSnippet || `import { ${spec.title || cap(spec.name)} } from "@/components/ui/${spec.name}";

export function Example() {
  return <${spec.title || cap(spec.name)}>${spec.title || cap(spec.name)} demo</${spec.title || cap(spec.name)}>;
}`}
\`\`\`
`;
}

function skillTemplate(spec) {
  const tokens = (spec.tokensConsumed ?? []).map((t) => `- ${t}`).join("\n");
  const never = (spec.never ?? [
    "NEVER hardcode color / spacing / radius. Always reference tokens via CSS variables (e.g. `var(--surface-raised)`).",
    "NEVER add a second accent color. Spring Green #00FA8A is the only accent.",
    "NEVER drop the focus ring. `--shadow-focus` + outline is required on every focusable element.",
  ]).map((n) => `- ${n}`).join("\n");
  return `---
name: lumen-${spec.name}
description: ${spec.skillDescription || `Use when generating a Lumen-themed \`${spec.title || cap(spec.name)}\` in a React app. Returns a token-driven, mode-agnostic component built on ${spec.builtOn || "the Lumen primitive layer"}. Honors prefers-reduced-motion + prefers-reduced-transparency. Mirrors the v0.13 component contract; installable via \`npx shadcn add @lumen/${spec.name}\`.`}
---

# Lumen ${spec.title || cap(spec.name)}

${spec.summary}

## Use when

${(spec.useWhen ?? [`Building a ${spec.name} surface inside a Lumen-themed app.`]).map((u) => `- ${u}`).join("\n")}

## NEVER

${never}

## Tokens consumed

${tokens || "- _None — purely structural._"}

## Anatomy

${(spec.anatomy ?? [`${spec.title || cap(spec.name)} root`]).map((a, i) => `${i + 1}. ${a}`).join("\n")}

## API

${(spec.api ?? [`See \`${spec.name}.tsx\` for the canonical prop set.`]).map((a) => `- ${a}`).join("\n")}

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: ${spec.expressiveBehavior || "atmospheric tokens rebind via the parent <ModeScope>; this component does not branch."}

## Accessibility

${(spec.a11yRules ?? [
  "Composed from Radix primitives where applicable — keyboard + screen-reader behavior inherited.",
  "Focus ring is visible on every focusable element via the global :focus-visible layer.",
]).map((r) => `- ${r}`).join("\n")}

## Code (canonical)

\`\`\`tsx
${spec.exampleSnippet || `import { ${spec.title || cap(spec.name)} } from "@/components/ui/${spec.name}";

export function Example() {
  return <${spec.title || cap(spec.name)}>${spec.title || cap(spec.name)} demo</${spec.title || cap(spec.name)}>;
}`}
\`\`\`

## Related

${(spec.related ?? []).map((r) => `- ${r}`).join("\n") || "_(none)_"}
`;
}

function testTemplate(spec) {
  const Cap = spec.title || cap(spec.name);
  const importPath = `./${spec.name}`;
  const exportName = spec.namedExport || Cap;
  return `import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ${exportName} } from "${importPath}";

describe("${Cap}", () => {
  it("renders without throwing", () => {
    render(<${exportName}>${spec.testChildren || `${Cap}`}</${exportName}>);
    // Smoke: the component mounts. Visual + a11y verification lives in Storybook.
    expect(true).toBe(true);
  });
${
  spec.testCases?.map(
    (t) => `
  it("${t.description}", () => {
    ${t.body}
  });`,
  ).join("") || ""
}
});
`;
}

function storiesTemplate(spec) {
  const Cap = spec.title || cap(spec.name);
  const importPath = `./${spec.name}`;
  const exportName = spec.namedExport || Cap;
  const stories = spec.stories ?? [
    { name: "Default", args: {}, children: Cap },
  ];
  const storyExports = stories
    .map(
      (s) => `export const ${s.name} = meta.story({
  args: ${JSON.stringify(s.args ?? {}, null, 2).replace(/\n/g, "\n  ")},
  render: (args) => <${exportName} {...args}>${s.children || Cap}</${exportName}>,
});
`,
    )
    .join("\n");
  return `// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { ${exportName} } from "${importPath}";

const meta = defineMeta({
  title: "${spec.tier || "Components"}/${Cap}",
  component: ${exportName},
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

${storyExports}
`;
}

function registryTemplate(spec) {
  return JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: spec.name,
      type: spec.registryType || "registry:ui",
      title: spec.title || cap(spec.name),
      description: spec.description || spec.summary,
      dependencies: spec.dependencies ?? [],
      registryDependencies: spec.registryDependencies ?? [],
      files: [
        {
          path: `design-system/02-components/${spec.name}/${spec.name}.tsx`,
          type: spec.registryType || "registry:ui",
          target: `components/ui/${spec.name}.tsx`,
        },
      ],
      cssVars: spec.cssVars ?? { light: {}, dark: {} },
      meta: {
        lumenVersion: "0.13.0",
        tier: spec.tier || "T1",
        category: spec.category,
        platforms: spec.platforms ?? ["web-react"],
        modeAware: spec.modeAware ?? false,
        signature: spec.signature ?? false,
        builtOn: spec.builtOn,
        specPath: `design-system/02-components/${spec.name}/${spec.name}.md`,
        skillPath: `design-system/02-components/${spec.name}/${spec.name}.skill.md`,
        aiNaming: spec.aiNaming || "lumen-native",
        phase: "v0.13-phase-2",
      },
    },
    null,
    2,
  );
}

function manifestTemplate(spec) {
  const Cap = spec.title || cap(spec.name);
  return JSON.stringify(
    {
      $schema: "https://storybook.js.org/schema/component-manifest.json",
      name: spec.name,
      title: Cap,
      description: spec.description || spec.summary,
      props: spec.propsList ?? [],
      variants: spec.variants ?? [],
      tokensConsumed: spec.tokensConsumed ?? [],
      a11y: {
        wcag: "2.2-AA",
        rules: spec.a11yRules ?? [],
      },
      usage: spec.exampleSnippet || `import { ${spec.namedExport || Cap} } from "@/components/ui/${spec.name}";`,
      storiesPath: `02-components/${spec.name}/${spec.name}.stories.tsx`,
      sourcePath: `02-components/${spec.name}/${spec.name}.tsx`,
      lumenVersion: "0.13.0",
      tier: spec.tier || "T1",
    },
    null,
    2,
  );
}

/* ---------------------------------------------------------------- UTILITIES */

function cap(name) {
  return name.replace(/(^\w|-\w)/g, (m) => m.replace("-", "").toUpperCase());
}

/* ----------------------------------------------------------------- DISPATCH */

function generate(spec) {
  const dir = join(ROOT, "design-system/02-components", spec.name);
  const written = [];
  write(join(dir, `${spec.name}.md`), mdTemplate(spec));
  written.push(`${spec.name}.md`);
  write(join(dir, `${spec.name}.skill.md`), skillTemplate(spec));
  written.push(`${spec.name}.skill.md`);
  write(join(dir, `${spec.name}.test.tsx`), testTemplate(spec));
  written.push(`${spec.name}.test.tsx`);
  write(join(dir, `${spec.name}.stories.tsx`), storiesTemplate(spec));
  written.push(`${spec.name}.stories.tsx`);
  write(join(dir, `${spec.name}.registry.json`), registryTemplate(spec));
  written.push(`${spec.name}.registry.json`);
  write(join(dir, "manifest.json"), manifestTemplate(spec));
  written.push("manifest.json");
  const tsxPath = join(dir, `${spec.name}.tsx`);
  const tsxExists = existsSync(tsxPath);
  return { name: spec.name, written, tsxExists };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: scaffold-component.mjs <spec.json> [more specs ...]");
    console.error("       scaffold-component.mjs tools/specs/*.json");
    process.exit(1);
  }
  const results = [];
  for (const arg of args) {
    const specPath = resolve(arg);
    const spec = read(specPath);
    const r = generate(spec);
    results.push(r);
  }
  for (const r of results) {
    const tsxNote = r.tsxExists ? "" : "  [WARN: tsx missing — author by hand]";
    console.log(`scaffold ${r.name}: ${r.written.length} files${tsxNote}`);
  }
  console.log(`\nGenerated ${results.length} component${results.length === 1 ? "" : "s"} (${results.reduce((n, r) => n + r.written.length, 0)} files).`);
}

main();
