/**
 * Lumen CodeBlock — Tier 5 AI primitive (Vercel AI Elements compatible)
 *
 * Per master doc §7.Phase-5 Family 5: formalize the existing v0.12.4 code
 * block per the Vercel AI Elements naming convention. The v0.12.4 legacy
 * `code-block` shipped only as `component.json` + `component.md`; this
 * v0.13.4 entry adds the contract stub + skill + stories.
 *
 * Lumen ships the contract (this file + ./code-block.md + ./code-block.skill.md).
 * Vercel AI Elements ships the React implementation. Install via:
 *
 *   npx ai-elements@latest add code-block
 *
 * Then import from `@/components/ai-elements/code-block` and theme via
 * <LumenAIProvider>. See:
 *   - ./code-block.md for the API contract
 *   - ./code-block.skill.md for NEVER rules
 *   - ../snippet/snippet.md for the short-code variant
 *   - ../artifact/artifact.md for the wrapper when type === "code"
 *
 * This file is a Lumen-side contract stub. It exists so that
 * `pnpm dlx shadcn@latest build registry.json` finds an existing file at
 * the registry item's `files[].path`. Consumers running
 * `npx shadcn add @lumen/code-block` get this file copied to
 * `components/ai-elements/code-block.tsx`. They then run the ai-elements
 * install above to overwrite the stub with the real implementation.
 *
 * Forking the Vercel implementation would lock Lumen to a snapshot; the
 * install-and-theme pattern keeps Lumen on Vercel's release train.
 */

import type { ReactNode } from "react";

export interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  copyable?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * @deprecated Lumen contract stub. Install the Vercel AI Elements implementation:
 *   `npx ai-elements@latest add code-block`
 * Then import from `@/components/ai-elements/code-block`.
 */
export function CodeBlock(_props: CodeBlockProps): never {
  throw new Error(
    "[Lumen] <CodeBlock> is a contract-only stub. " +
    "Install the Vercel AI Elements implementation: `npx ai-elements@latest add code-block`. " +
    "Then import { CodeBlock } from `@/components/ai-elements/code-block`."
  );
}
