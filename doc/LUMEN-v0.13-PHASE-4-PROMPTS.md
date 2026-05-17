# PHASE 4 — gpt-image-2 Prompt Library

Execute master doc §7.Phase-4. Master doc is canonical; this prompt adds the per-template execution detail.

## What this phase ships

The complete `05-prompts/` directory with the immovable style anchor, seven per-asset-type templates, snapshot-pinned model invocations, one reference asset generated per template, and a `lumen-prompts` CLI that emits prompt strings on demand. After this phase, any engineer at Warp can run `lumen-prompts hero-background --subject="route arc over a dim freight lane map"` and paste the output into ChatGPT to get an on-brand Lumen asset.

## Technical pins

| Tool | Version | Why |
|---|---|---|
| Model | `gpt-image-2` snapshot `gpt-image-2-2026-04-21` | Pinning prevents drift when OpenAI rolls forward the alias. 99% text-rendering accuracy, native 4K, thinking mode for cross-frame consistency |
| Quality | `high` | Default for design-system assets; reference assets need print-grade |
| OpenAI SDK | `openai@^4.50.0` (Node) | For the optional automation script that pre-generates the reference assets |

## Work to do

### Group A — The immovable style anchor

Create `05-prompts/style-anchor.md`. Use the verbatim content in master doc §9. **Do not modify the style anchor's content** — it's deliberately frozen at the master-doc shape. Just place it at the canonical path. Every other prompt in this phase opens by `@import`ing this file.

Add a one-paragraph header at the top of the file marking it as **immutable**:

```markdown
> [!warning]
> **DO NOT EDIT.** This file is the immovable style anchor for every gpt-image-2 prompt
> Lumen ships. Modifying it causes silent drift across the entire image asset library.
> If a change is genuinely required, version-bump (style-anchor.v2.md) and migrate
> consumers explicitly. Do not edit in place.
```

### Group B — Seven per-asset templates (write all in parallel)

Each template is an MD file in `05-prompts/`. Each opens with `@import ./style-anchor.md`. Each fills the `Subject` and `Use case` slots from the anchor with template-specific content and adds template-specific constraints. Length target: each template under 800 words.

**`hero-background.md`** — For landing-page hero backgrounds. Subject template fills with: "three soft blurred orbs in {accent} #00FA8A and one cool indigo orb, drifting against obsidian #0D0D0D, with perlin grain at 10% opacity. Volumetric fog, no hard edges." Composition override: 16:9, 2560×1440, orbs in upper-left and lower-right thirds, clear focal-area negative space dead-center for headline text. Mode override: expressive (atmosphere at 12%). Reference master doc §9's example consuming template — duplicate that as the canonical example block.

**`abstract-shape.md`** — For empty states, loading screens, secondary heroes. Subject template fills with: "an abstract geometric shape — a freight container cross-section, a lane arc, a network node cluster, a pallet stack isometric, a dock bay grid — rendered as semi-transparent layered glass with subtle edge highlights." Composition: 1600×1600 square. Single accent moment in Spring Green. The shape suggests freight infrastructure without being literal.

**`illustration.md`** — For onboarding step illustrations. Subject template fills with: "a narrative illustration of a freight scene — pickup loading dock, cross-dock floor in operation, long-haul truck on a highway at dusk, last-mile delivery to a storefront — rendered character-light, prop-forward, with Lumen's instrument-panel mood." Composition: 1600×1600 or 16:9 depending on placement. Allow soft narrative warmth — onboarding is the one place Lumen relaxes operator-density.

**`pattern.md`** — For repeating patterns used as background tiles, divider treatments, hairline overlay textures. Subject template fills with: "a seamless tile pattern at 512×512 that repeats — a hairline lane grid, a faint pallet topology, a cross-dock floor lattice, a network node mesh." Constraints: must tile cleanly with no visible seam, 4-8% accent saturation max, dark obsidian background mandatory. Reference: industrial Swiss-grid pattern aesthetic.

**`mesh.md`** — For mesh gradient sources that get extracted as CSS recipes. Subject template fills with one of the named mesh-recipe slots from Phase 1: `mesh.aurora-spring`, `mesh.aurora-cool`, `mesh.dock-bay`, `mesh.lane-arc`, `mesh.cross-dock`. Composition: 2560×1440 or larger. The output is used as a visual reference for the CSS mesh recipe, not directly embedded — but ship the PNG as a fallback for browsers without backdrop-filter or for marketing imagery where the CSS recipe can't render. Use thinking mode ON for cross-frame consistency if generating all five recipes from one session.

**`empty-state.md`** — For dashboard empty states, search-no-results, no-data placeholders. Subject template fills with: "a minimalist illustration suggesting absence with intent — a single freight pallet awaiting load, an empty dock bay with light streaming in, a quiet cross-dock floor, a paused lane indicator." Composition: 1024×1024 or 800×600. The mood is **anticipatory, not melancholy** — empty states in Lumen suggest "ready for input" not "nothing here." Strong negative space.

**`marketing-card.md`** — For feature-card hero imagery on landing pages, blog post heroes, social-share cards. Subject template fills with: "a feature-illustrative composition that communicates a single freight capability — instant rates, real-time tracking, cross-dock automation, lane optimization — rendered as a hybrid of UI surface + ambient atmosphere." Composition: 1200×630 (OG card aspect) or 16:9 for landing-page feature blocks. Allow more UI density here since marketing cards can read at smaller sizes — a hint of a Lumen dashboard surface is acceptable.

### Group C — The `lumen-prompts` CLI

Create `tools/lumen-prompts/`. A small CLI that emits the assembled prompt string given a template name and subject. Built with `commander` or `cac` — keep it under 100 lines.

```ts
// tools/lumen-prompts/index.ts
import { readFileSync } from "fs";
import { resolve } from "path";

const TEMPLATES = {
  "hero-background": "05-prompts/hero-background.md",
  "abstract-shape": "05-prompts/abstract-shape.md",
  "illustration": "05-prompts/illustration.md",
  "pattern": "05-prompts/pattern.md",
  "mesh": "05-prompts/mesh.md",
  "empty-state": "05-prompts/empty-state.md",
  "marketing-card": "05-prompts/marketing-card.md",
};

function assemble(template: string, subject: string, options: Record<string, string>): string {
  const tplPath = resolve(process.cwd(), TEMPLATES[template]);
  const anchorPath = resolve(process.cwd(), "05-prompts/style-anchor.md");

  let prompt = readFileSync(tplPath, "utf-8");
  const anchor = readFileSync(anchorPath, "utf-8");

  // Resolve the @import line
  prompt = prompt.replace("@import ./style-anchor.md", anchor);

  // Fill the [FILL THIS SLOT] markers
  prompt = prompt.replace(/\[FILL THIS SLOT.*?\]/g, subject);

  // Apply optional overrides
  if (options.composition) {
    prompt = prompt.replace(/^## Composition.*$[\s\S]*?(?=^##)/m, `## Composition\n${options.composition}\n\n`);
  }
  if (options.mode) {
    prompt = prompt.replace(/^## Mode.*$[\s\S]*?$/m, `## Mode\n${options.mode}`);
  }

  return prompt;
}

// CLI entry
const args = process.argv.slice(2);
const [template] = args;
const subjectIdx = args.indexOf("--subject");
const subject = subjectIdx >= 0 ? args[subjectIdx + 1] : "";

if (!template || !TEMPLATES[template]) {
  console.error(`Usage: lumen-prompts <${Object.keys(TEMPLATES).join("|")}> --subject "..."`);
  process.exit(1);
}

console.log(assemble(template, subject, { /* …parse other flags… */ }));
```

Add to `package.json` scripts:
- `"prompts": "ts-node tools/lumen-prompts/index.ts"`

Usage example: `pnpm prompts hero-background --subject "route arc over a dim freight lane map with spring-green accent"` prints the full assembled prompt to stdout.

### Group D — Generate the reference assets

Run each template once with a canonical subject. Store outputs under `examples/gpt-image-2/<template>/<canonical-subject-slug>.png`. Document the canonical subject in a `README.md` alongside each PNG so future runs can diff against baseline.

Canonical subjects per template:
- `hero-background`: "three soft blurred orbs in spring-green and indigo over obsidian, central negative space"
- `abstract-shape`: "freight container cross-section rendered as semi-transparent layered glass"
- `illustration`: "long-haul truck silhouette on a highway at dusk, character-light, faint route arc"
- `pattern`: "seamless hairline lane grid, 512×512, tilesable"
- `mesh`: generate all five named recipes (`aurora-spring`, `aurora-cool`, `dock-bay`, `lane-arc`, `cross-dock`) using thinking mode for consistency
- `empty-state`: "single freight pallet awaiting load, anticipatory mood"
- `marketing-card`: "real-time tracking — Lumen dashboard surface hint with ambient atmosphere"

These reference assets are the visual baseline for the prompt library. If a future asset run produces visibly different output for the same subject + template, that's a model-drift signal (gpt-image-2 alias rolled forward) and the team re-baselines.

### Group E — Wire the prompt library into the design system

Add `05-prompts/README.md` summarizing the library, the immovability of the style anchor, the snapshot pin policy, and the `lumen-prompts` CLI usage.

Update `llms.txt` to include the `## Prompt library (gpt-image-2)` section per master doc §8.2 with the seven templates listed.

Add a `## Image generation` section to `00-foundations/inspirations.md` referencing the prompt library and explaining the visual references (RonDesignLab Navy Mobile, BizSpeed TMS, SpaceX Mission Control) the style anchor calibrates against.

## Decisions you will likely make unilaterally

- Whether to ship the reference assets in the repo (under `examples/gpt-image-2/`) or in a separate Git LFS / S3 bucket. Default: ship in repo under `examples/gpt-image-2/` since the assets are small enough (50-200KB PNG each) and being in-repo makes the diff-against-baseline check trivial.
- Whether to generate all reference assets in one ChatGPT thinking-mode session for cross-asset consistency or one-per-prompt. Default: one thinking-mode session for the five mesh recipes (they need to be visually consistent as a set); one-per-prompt for everything else.
- Whether to add a `--snapshot` flag to the CLI for emitting a date-stamped version of the prompt for archival. Default: yes, useful for diffing prompts when subjects evolve over time.
- How to handle the case where a Warp engineer wants to generate a Lumen icon. Default: the CLI rejects with an error message pointing to the icon guidelines in master doc §3 — Lumen icons are vector hand-drawn, never gpt-image-2.

## Verification gates for Phase 4

| Gate | Pass condition |
|---|---|
| Style anchor exists | `05-prompts/style-anchor.md` matches master doc §9 verbatim |
| All seven templates exist | Hero, abstract, illustration, pattern, mesh, empty-state, marketing-card each ship as an MD |
| Every template opens with `@import` | The `@import ./style-anchor.md` line is the first non-frontmatter content in every template |
| Model pinned in every template | Every template references `gpt-image-2-2026-04-21` snapshot, not the bare `gpt-image-2` alias |
| CLI works | `pnpm prompts hero-background --subject "test"` emits a valid prompt string with the anchor inlined |
| Reference assets exist | One PNG per template (five for mesh) under `examples/gpt-image-2/` |
| Subjective consistency check | The reference assets are visually coherent as a set when laid out together — no accidental purple, no rogue gradient, no extra saturated color |
| llms.txt updated | The `## Prompt library` section lists all seven templates |
| README written | `05-prompts/README.md` explains the library, the anchor immutability, the snapshot pin policy |
| Self-critique | All 15 questions in master doc §10.1 answered "no" |

## Stop condition

Phase report into `design-system/06-claude-code-briefings/phase-4-report.md` per master doc §10.3. Commit message: `feat(lumen): phase 4 — gpt-image-2 prompt library and reference assets`. **Halt**. Wait for Phase 5.
