/**
 * Lumen Suggestion — Tier 5 AI primitive (Vercel AI Elements compatible)
 *
 * Canonical Vercel-AI-Elements-named entry per AGENTS.md hard rule 19.
 * The earlier `suggestion-strip/` folder remains as a deprecated alias for
 * v0.13.0 backward-compat; v0.14 retires it.
 *
 * Lumen ships the contract (this file + ./suggestion.md + ./suggestion.skill.md).
 * Vercel AI Elements ships the React implementation. Install via:
 *
 *   npx ai-elements@latest add suggestion
 *
 * Then import from `@/components/ai-elements/suggestion` and theme via
 * <LumenAIProvider>. See:
 *   - ./suggestion.md for the API contract
 *   - ./suggestion.skill.md for NEVER rules
 *   - ../mode-scope/mode-scope.md for mode integration
 *   - ../../03-patterns/chat-thread.md for the canonical composition
 *
 * This file is a Lumen-side contract stub. It exists so that
 * `pnpm dlx shadcn@latest build registry.json` finds an existing file at
 * the registry item's `files[].path`. Consumers running
 * `npx shadcn add @lumen/suggestion` get this file copied to
 * `components/ai-elements/suggestion.tsx`. They then run the ai-elements
 * install above to overwrite the stub with the real implementation.
 *
 * Forking the Vercel implementation would lock Lumen to a snapshot; the
 * install-and-theme pattern keeps Lumen on Vercel's release train.
 */

import type { ReactNode } from "react";

export interface SuggestionProps {
  className?: string;
  children?: ReactNode;
}

/**
 * @deprecated Lumen contract stub. Install the Vercel AI Elements implementation:
 *   `npx ai-elements@latest add suggestion`
 * Then import from `@/components/ai-elements/suggestion`.
 */
export function Suggestion(_props: SuggestionProps): never {
  throw new Error(
    "[Lumen] <Suggestion> is a contract-only stub. " +
    "Install the Vercel AI Elements implementation: `npx ai-elements@latest add suggestion`. " +
    "Then import { Suggestion } from `@/components/ai-elements/suggestion`."
  );
}
