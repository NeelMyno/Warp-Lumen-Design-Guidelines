/**
 * LumenAIProvider
 *
 * Single React context for all Lumen AI primitives. Sets the default model,
 * streaming behavior, citation styling, and ChatKit theme binding so consumers
 * don't repeat that wiring per surface.
 *
 * Usage:
 *
 *   import { LumenAIProvider } from "@/lib/lumen-ai-provider";
 *
 *   export default function RootLayout({ children }: { children: React.ReactNode }) {
 *     return (
 *       <html lang="en">
 *         <body>
 *           <LumenAIProvider defaultModel="claude-opus-4-7" defaultStreaming>
 *             {children}
 *           </LumenAIProvider>
 *         </body>
 *       </html>
 *     );
 *   }
 *
 * Phase 5 — master doc §7.Phase-5 cross-cutting wiring.
 */

"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

// ---- Types ------------------------------------------------------------

export type LumenAIModel =
  // Anthropic
  | "claude-opus-4-7"
  | "claude-sonnet-4-6"
  | "claude-haiku-4-5"
  // OpenAI (via @ai-sdk/openai)
  | "gpt-5-2026-04"
  | "gpt-5-mini-2026-04"
  // Custom / self-hosted
  | (string & {});

export type LumenAICitationStyle = "anthropic-superscript" | "footnote" | "inline-link";

export interface LumenAIProviderValue {
  /** Default model when a primitive doesn't specify. */
  defaultModel: LumenAIModel;
  /** Whether streaming is on by default. */
  defaultStreaming: boolean;
  /** Citation rendering style. Default 'anthropic-superscript' matches Citation API. */
  citationStyle: LumenAICitationStyle;
  /** Whether to show Reasoning by default when the model returns one. */
  showReasoningByDefault: boolean;
  /** Whether destructive tool calls require Confirmation. Defaults true; never set false in production. */
  requireConfirmationForDestructiveTools: boolean;
  /** Whether to virtualize Conversation threads above N messages. */
  virtualizeAfter: number;
  /** Honor prefers-reduced-motion for streaming shimmer and auto-scroll. Defaults true. */
  reducedMotionAware: boolean;
  /** Honor prefers-reduced-transparency for glass-surface fallbacks. Defaults true. */
  reducedTransparencyAware: boolean;
}

const DEFAULT_VALUE: LumenAIProviderValue = {
  defaultModel: "claude-opus-4-7",
  defaultStreaming: true,
  citationStyle: "anthropic-superscript",
  showReasoningByDefault: true,
  requireConfirmationForDestructiveTools: true,
  virtualizeAfter: 100,
  reducedMotionAware: true,
  reducedTransparencyAware: true,
};

const LumenAIContext = createContext<LumenAIProviderValue>(DEFAULT_VALUE);

// ---- Provider --------------------------------------------------------

export interface LumenAIProviderProps extends Partial<LumenAIProviderValue> {
  children: ReactNode;
}

export function LumenAIProvider({
  children,
  defaultModel,
  defaultStreaming,
  citationStyle,
  showReasoningByDefault,
  requireConfirmationForDestructiveTools,
  virtualizeAfter,
  reducedMotionAware,
  reducedTransparencyAware,
}: LumenAIProviderProps) {
  const value = useMemo<LumenAIProviderValue>(
    () => ({
      ...DEFAULT_VALUE,
      ...(defaultModel !== undefined && { defaultModel }),
      ...(defaultStreaming !== undefined && { defaultStreaming }),
      ...(citationStyle !== undefined && { citationStyle }),
      ...(showReasoningByDefault !== undefined && { showReasoningByDefault }),
      ...(requireConfirmationForDestructiveTools !== undefined && {
        requireConfirmationForDestructiveTools,
      }),
      ...(virtualizeAfter !== undefined && { virtualizeAfter }),
      ...(reducedMotionAware !== undefined && { reducedMotionAware }),
      ...(reducedTransparencyAware !== undefined && { reducedTransparencyAware }),
    }),
    [
      defaultModel,
      defaultStreaming,
      citationStyle,
      showReasoningByDefault,
      requireConfirmationForDestructiveTools,
      virtualizeAfter,
      reducedMotionAware,
      reducedTransparencyAware,
    ]
  );

  return <LumenAIContext.Provider value={value}>{children}</LumenAIContext.Provider>;
}

// ---- Hook ------------------------------------------------------------

/**
 * Read the Lumen AI provider state inside any primitive.
 *
 * Returns the current provider context. Throws nothing — primitives outside
 * a LumenAIProvider get DEFAULT_VALUE so they degrade gracefully (the
 * provider is recommended, not required).
 */
export function useLumenAI(): LumenAIProviderValue {
  return useContext(LumenAIContext);
}

/**
 * Convenience: derive whether a given tool call needs Confirmation.
 *
 * Pattern: tool definitions carry a `destructive?: boolean` flag in their
 * metadata. The Tool primitive calls `useDestructiveGate(tool.destructive)`
 * before invoking; if true AND provider requires Confirmation, the Tool
 * renders the Confirmation gate inline.
 */
export function useDestructiveGate(toolIsDestructive: boolean | undefined): boolean {
  const { requireConfirmationForDestructiveTools } = useLumenAI();
  return Boolean(toolIsDestructive) && requireConfirmationForDestructiveTools;
}
