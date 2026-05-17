/**
 * Lumen Confirmation — Tier 5 AI primitive (Vercel AI Elements compatible)
 *
 * Lumen ships the contract (this file + ./confirmation.md + ./confirmation.skill.md).
 * Vercel AI Elements ships the React implementation. Install via:
 *
 *   npx ai-elements@latest add confirmation
 *
 * Then import from `@/components/ai-elements/confirmation` and theme via
 * <LumenAIProvider>. See:
 *   - ./confirmation.md for the API contract
 *   - ./confirmation.skill.md for NEVER rules
 *   - ../mode-scope/mode-scope.md for mode integration
 *   - ../../03-patterns/chat-thread.md for the canonical composition
 *
 * This file is a Lumen-side contract stub. It exists so that
 * `pnpm dlx shadcn@latest build registry.json` finds an existing file at
 * the registry item's `files[].path`. Consumers running
 * `npx shadcn add @lumen/confirmation` get this file copied to
 * `components/ai-elements/confirmation.tsx`. They then run the ai-elements
 * install above to overwrite the stub with the real implementation.
 *
 * Forking the Vercel implementation would lock Lumen to a snapshot; the
 * install-and-theme pattern keeps Lumen on Vercel's release train.
 */

import type { ReactNode } from "react";

export interface ConfirmationProps {
  className?: string;
  children?: ReactNode;
}

/**
 * @deprecated Lumen contract stub. Install the Vercel AI Elements implementation:
 *   `npx ai-elements@latest add confirmation`
 * Then import from `@/components/ai-elements/confirmation`.
 */
export function Confirmation(_props: ConfirmationProps): never {
  throw new Error(
    "[Lumen] <Confirmation> is a contract-only stub. " +
    "Install the Vercel AI Elements implementation: `npx ai-elements@latest add confirmation`. " +
    "Then import { Confirmation } from `@/components/ai-elements/confirmation`."
  );
}
