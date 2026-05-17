// Storybook 10.4 CSF Factory format (typesafe).
// Component Manifests build automatically from this story.
//
// NOTE: This story imports from the Vercel AI Elements install path. Run
//   npx ai-elements@latest add reasoning
// in audit-dashboard/ first, then start storybook.
//
// Status: stable.
import { defineMeta } from "@storybook/nextjs";
// import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai-elements/reasoning";

const meta = defineMeta({
  title: "T5/Reasoning",
  // component: Reasoning,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
    docs: {
      description: {
        component: "Reasoning from Vercel AI Elements (Lumen-themed). Install: `npx ai-elements@latest add reasoning`.",
      },
    },
  },
  tags: ["autodocs", "lumen-v0.13", "phase-5", "stable"],
});

export default meta;

export const Default = meta.story({
  render: () => (
    <div
      style={{
        padding: 24,
        border: "1px dashed var(--color-border-hairline)",
        borderRadius: 12,
        color: "var(--color-text-secondary)",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
      }}
    >
      Reasoning — install via <code>npx ai-elements@latest add reasoning</code> then uncomment the import above.
    </div>
  ),
});
