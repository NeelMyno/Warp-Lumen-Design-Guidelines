/**
 * Lumen Reasoning — Tier 5 AI primitive (Vercel AI Elements compatible)
 *
 * Lumen ships the contract (this file + ./reasoning.md + ./reasoning.skill.md).
 * Vercel AI Elements ships the React implementation. Install via:
 *
 *   npx ai-elements@latest add reasoning
 *
 * Then import from `@/components/ai-elements/reasoning` and theme via
 * <LumenAIProvider>. See:
 *   - ./reasoning.md for the API contract
 *   - ./reasoning.skill.md for NEVER rules
 *   - ../mode-scope/mode-scope.md for mode integration
 *   - ../../03-patterns/chat-thread.md for the canonical composition
 *
 * This file is a Lumen-side contract stub. It exists so that
 * `pnpm dlx shadcn@latest build registry.json` finds an existing file at
 * the registry item's `files[].path`. Consumers running
 * `npx shadcn add @lumen/reasoning` get this file copied to
 * `components/ai-elements/reasoning.tsx`. They then run the ai-elements
 * install above to overwrite the stub with the real implementation.
 *
 * Forking the Vercel implementation would lock Lumen to a snapshot; the
 * install-and-theme pattern keeps Lumen on Vercel's release train.
 */

import type { ReactNode } from "react";

export interface ReasoningProps {
  className?: string;
  children?: ReactNode;
}

/**
 * @deprecated Lumen contract stub. Install the Vercel AI Elements implementation:
 *   `npx ai-elements@latest add reasoning`
 * Then import from `@/components/ai-elements/reasoning`.
 */
export function Reasoning(_props: ReasoningProps): never {
  throw new Error(
    "[Lumen] <Reasoning> is a contract-only stub. " +
    "Install the Vercel AI Elements implementation: `npx ai-elements@latest add reasoning`. " +
    "Then import { Reasoning } from `@/components/ai-elements/reasoning`."
  );
}
