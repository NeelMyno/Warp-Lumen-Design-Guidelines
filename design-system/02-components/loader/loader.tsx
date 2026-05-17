/**
 * Lumen Loader — Tier 5 AI primitive (Vercel AI Elements compatible)
 *
 * Canonical Vercel-AI-Elements-named entry per AGENTS.md hard rule 19.
 * The earlier `loader-ai/` folder remains as a deprecated alias for v0.13.0
 * backward-compat; v0.14 retires it.
 *
 * Lumen ships the contract (this file + ./loader.md + ./loader.skill.md).
 * Vercel AI Elements ships the React implementation. Install via:
 *
 *   npx ai-elements@latest add loader
 *
 * Then import from `@/components/ai-elements/loader` and theme via
 * <LumenAIProvider>. See:
 *   - ./loader.md for the API contract
 *   - ./loader.skill.md for NEVER rules
 *   - ../spinner/component.md for the underlying Lumen primitive
 *   - ../../03-patterns/chat-thread.md for the canonical composition
 *
 * This file is a Lumen-side contract stub. It exists so that
 * `pnpm dlx shadcn@latest build registry.json` finds an existing file at
 * the registry item's `files[].path`. Consumers running
 * `npx shadcn add @lumen/loader` get this file copied to
 * `components/ai-elements/loader.tsx`. They then run the ai-elements
 * install above to overwrite the stub with the real implementation.
 *
 * Forking the Vercel implementation would lock Lumen to a snapshot; the
 * install-and-theme pattern keeps Lumen on Vercel's release train.
 */

import type { ReactNode } from "react";

export interface LoaderProps {
  intensity?: "subtle" | "default" | "pulse";
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
  children?: ReactNode;
}

/**
 * @deprecated Lumen contract stub. Install the Vercel AI Elements implementation:
 *   `npx ai-elements@latest add loader`
 * Then import from `@/components/ai-elements/loader`.
 */
export function Loader(_props: LoaderProps): never {
  throw new Error(
    "[Lumen] <Loader> is a contract-only stub. " +
    "Install the Vercel AI Elements implementation: `npx ai-elements@latest add loader`. " +
    "Then import { Loader } from `@/components/ai-elements/loader`."
  );
}
