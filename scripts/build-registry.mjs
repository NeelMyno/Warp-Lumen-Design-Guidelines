#!/usr/bin/env node
// Regenerates _registry/*.json sidecars from design-system/02-components/{name}/component.json.
//
// MERGE semantics (v0.7+): existing sidecars provide hand-curated fields that the
// component.json doesn't carry — `dependencies`, `registryDependencies`, `cssVars`,
// and the precise `target` path. The script syncs only the canonical-from-spec fields
// (name, title, description, lumenVersion, specPath, docsPath, status, examples → files)
// and PRESERVES the rest. New components get sensible defaults.
//
// Path resolution: examples paths declared in component.json are relative to the
// component folder. We resolve them to repo-relative paths for the shadcn fetcher,
// normalizing any `../` segments by absolute-rooting through the component dir.

import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, resolve, relative, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const COMPONENTS_DIR = join(ROOT, "design-system/02-components");
const REGISTRY_DIR = join(ROOT, "_registry");
const VERSION = (await readFile(join(ROOT, "VERSION"), "utf8")).trim();

const PLATFORM_TARGET = {
  "web-react": "components/ui",
  "react-native": "components/ui",
  "ios-native": "Sources/Lumen",
  "android-native": "src/main/java/dev/warp/lumen",
  "desktop-mac": "Sources/Lumen",
  "desktop-windows": "src/Lumen",
  "shopify-liquid": "snippets",
  "bigcommerce-stencil": "templates/components/lumen",
  "woo-wordpress": "patterns",
};

const PLATFORM_EXT = {
  "web-react": "tsx",
  "react-native": "tsx",
  "ios-native": "swift",
  "android-native": "kt",
  "desktop-mac": "swift",
  "desktop-windows": "xaml",
  "shopify-liquid": "liquid",
  "bigcommerce-stencil": "html",
  "woo-wordpress": "html",
};

function resolveExamplePath(slug, declaredPath) {
  // declaredPath is component.json's `examples[platform]`. e.g.:
  //   "./examples/primary.tsx"           → design-system/02-components/{slug}/examples/primary.tsx
  //   "../../../audit-dashboard/src/..." → audit-dashboard/src/...
  const componentDir = join(COMPONENTS_DIR, slug);
  const absResolved = resolve(componentDir, declaredPath);
  return relative(ROOT, absResolved);
}

function targetFor(slug, platform, repoRelativeSourcePath) {
  // Where the file lands in the consumer's repo when shadcn copies it.
  // Most components: components/ui/{slug}.{ext}. Wrappers (field/form/validation-message)
  // live under a "lumen" sub-namespace in the consumer to avoid collision with shadcn.
  const ext = PLATFORM_EXT[platform] || "tsx";
  const lumenWrappers = new Set(["field", "form", "validation-message"]);
  if (lumenWrappers.has(slug) && (platform === "web-react" || platform === "react-native")) {
    return `components/lumen/${slug}.${ext}`;
  }
  const dir = PLATFORM_TARGET[platform] || "components/ui";
  // For native platforms, file basename is PascalCase.
  if (["ios-native", "desktop-mac"].includes(platform) || platform === "android-native") {
    const pascal = slug.replace(/(^|[-_])([a-z])/g, (_, __, c) => c.toUpperCase());
    return `${dir}/${pascal}.${ext}`;
  }
  return `${dir}/${slug}.${ext}`;
}

async function readExistingSidecar(slug) {
  const path = join(REGISTRY_DIR, `${slug}.json`);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return null;
  }
}

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

    const existing = (await readExistingSidecar(slug)) ?? {};

    // Build files[] from examples map, with proper path resolution.
    const files = Object.entries(spec.examples ?? {}).map(([platform, declaredPath]) => ({
      path: resolveExamplePath(slug, declaredPath),
      type: "registry:ui",
      target: targetFor(slug, platform, resolveExamplePath(slug, declaredPath)),
    }));

    const sidecar = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: slug,
      type: existing.type || "registry:ui",
      title: spec.name,
      description: spec.summary,
      // Preserve curated fields from existing sidecar:
      dependencies: existing.dependencies ?? [],
      registryDependencies: existing.registryDependencies ?? [],
      files,
      cssVars: existing.cssVars ?? { light: {}, dark: {} },
      meta: {
        lumenVersion: VERSION,
        platforms: Object.keys(spec.examples ?? {}),
        specPath: `design-system/02-components/${slug}/component.json`,
        docsPath: `design-system/02-components/${slug}/component.md`,
        status: spec.status,
        warpSignature: existing.meta?.warpSignature ?? false,
      },
    };

    await writeFile(
      join(REGISTRY_DIR, `${slug}.json`),
      JSON.stringify(sidecar, null, 2) + "\n",
    );
    items.push({ $ref: `./${slug}.json` });
    console.log(`wrote: _registry/${slug}.json`);
  }

  // Sort items by component family for readability:
  // 1. v0.1 baseline (button, input, card, badge, stat, live-dot, rate-ticker, table, dialog, toast, empty-state, toggle)
  // 2. v0.6 forms layer (field, form, textarea, select, checkbox, radio-group, switch, validation-message)
  // 3. v0.7 deferred-form completion (combobox, number-input, password-input, otp-input, tags-input, date-picker, time-picker, segmented, range-slider, file-dropzone)
  const ORDER = [
    "button", "input", "card", "badge",
    "stat", "live-dot", "rate-ticker",
    "table", "dialog", "toast", "empty-state", "toggle",
    "field", "form", "textarea", "select",
    "checkbox", "radio-group", "switch", "validation-message",
    "combobox", "number-input", "password-input", "otp-input",
    "tags-input", "date-picker", "time-picker", "segmented",
    "range-slider", "file-dropzone",
  ];
  items.sort((a, b) => {
    const slugA = a.$ref.replace(/^\.\/|\.json$/g, "");
    const slugB = b.$ref.replace(/^\.\/|\.json$/g, "");
    const ai = ORDER.indexOf(slugA);
    const bi = ORDER.indexOf(slugB);
    if (ai === -1 && bi === -1) return slugA.localeCompare(slugB);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const index = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "lumen",
    homepage: "https://lumen.warp.dev",
    description:
      "Lumen — Warp's vertically integrated design system. Quiet Industrial mood, Satoshi typography, Warp lime green accent. Install: `npx shadcn@latest add <registry-url>/<name>`.",
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
