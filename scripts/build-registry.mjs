#!/usr/bin/env node
// Regenerates _registry/*.json sidecars from design-system/02-components/{name}/component.json
// Keeps the shadcn-style registry in sync with the canonical contracts.

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const COMPONENTS_DIR = join(ROOT, "design-system/02-components");
const REGISTRY_DIR = join(ROOT, "_registry");
const VERSION = (await readFile(join(ROOT, "VERSION"), "utf8")).trim();

async function main() {
  await mkdir(REGISTRY_DIR, { recursive: true });
  const entries = await readdir(COMPONENTS_DIR, { withFileTypes: true });
  const items = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
    const slug = entry.name;
    const specPath = join(COMPONENTS_DIR, slug, "component.json");

    let spec;
    try {
      spec = JSON.parse(await readFile(specPath, "utf8"));
    } catch {
      console.warn(`skip: ${slug} has no component.json`);
      continue;
    }

    const sidecar = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: slug,
      type: "registry:ui",
      title: spec.name,
      description: spec.summary,
      files: Object.entries(spec.examples ?? {}).map(([platform, path]) => ({
        path: `design-system/02-components/${slug}/${path.replace(/^\.\//, "")}`,
        type: "registry:ui",
        target: `components/ui/${slug}.tsx`,
      })),
      meta: {
        lumenVersion: VERSION,
        platforms: Object.keys(spec.examples ?? {}),
        specPath: `design-system/02-components/${slug}/component.json`,
        docsPath: `design-system/02-components/${slug}/component.md`,
        status: spec.status,
      },
    };

    await writeFile(
      join(REGISTRY_DIR, `${slug}.json`),
      JSON.stringify(sidecar, null, 2) + "\n",
    );
    items.push({ $ref: `./${slug}.json` });
    console.log(`wrote: _registry/${slug}.json`);
  }

  const index = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "lumen",
    homepage: "https://lumen.warp.dev",
    description:
      "Lumen — Warp's design system. Install: npx shadcn@latest add <registry-url>/<name>",
    items,
  };
  await writeFile(
    join(REGISTRY_DIR, "registry.json"),
    JSON.stringify(index, null, 2) + "\n",
  );
  console.log(`wrote: _registry/registry.json (${items.length} components)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
