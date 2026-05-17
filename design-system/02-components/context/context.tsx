/**
 * Lumen Context — Tier 5 AI primitive (Vercel AI Elements compatible)
 *
 * Canonical Vercel-AI-Elements-named entry per AGENTS.md hard rule 19.
 * The earlier `context-window/` folder remains as a deprecated alias for
 * v0.13.0 backward-compat; v0.14 retires it.
 *
 * Lumen ships the contract (this file + ./context.md + ./context.skill.md).
 * Vercel AI Elements ships the React implementation. Install via:
 *
 *   npx ai-elements@latest add context
 *
 * Then import from `@/components/ai-elements/context` and theme via
 * <LumenAIProvider>. See:
 *   - ./context.md for the API contract
 *   - ./context.skill.md for NEVER rules
 *   - ../stat/stat.md for the underlying numeric primitive
 *   - ../progress/component.md for the underlying bar primitive
 *
 * This file is a Lumen-side contract stub. It exists so that
 * `pnpm dlx shadcn@latest build registry.json` finds an existing file at
 * the registry item's `files[].path`. Consumers running
 * `npx shadcn add @lumen/context` get this file copied to
 * `components/ai-elements/context.tsx`. They then run the ai-elements
 * install above to overwrite the stub with the real implementation.
 *
 * Forking the Vercel implementation would lock Lumen to a snapshot; the
 * install-and-theme pattern keeps Lumen on Vercel's release train.
 */

import type { ReactNode } from "react";

export interface ContextProps {
  used: number;
  total: number;
  unit?: string;
  showLabel?: boolean;
  warningThreshold?: number;
  className?: string;
  children?: ReactNode;
}

/**
 * @deprecated Lumen contract stub. Install the Vercel AI Elements implementation:
 *   `npx ai-elements@latest add context`
 * Then import from `@/components/ai-elements/context`.
 */
export function Context(_props: ContextProps): never {
  throw new Error(
    "[Lumen] <Context> is a contract-only stub. " +
    "Install the Vercel AI Elements implementation: `npx ai-elements@latest add context`. " +
    "Then import { Context } from `@/components/ai-elements/context`."
  );
}
