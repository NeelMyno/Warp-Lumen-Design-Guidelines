// Storybook 10.4 CSF Factory format (typesafe).
// Component Manifests build automatically from this story.
//
// NOTE: This story imports from the Vercel AI Elements install path. Run
//   npx ai-elements@latest add snippet
// in audit-dashboard/ first, then start storybook. Without the install,
// this story will fail at compile time — that's the intentional teaching
// signal: AI primitives ship as install-on-demand from the upstream registry.
//
// Status: stable.
import { defineMeta } from "@storybook/nextjs";
// import { Snippet } from "@/components/ai-elements/snippet";

const meta = defineMeta({
  title: "T5/Snippet",
  // component: Snippet,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
    docs: {
      description: {
        component: "Snippet from Vercel AI Elements (Lumen-themed). Install: \`npx ai-elements@latest add snippet\`.",
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
      Snippet — install via <code>npx ai-elements@latest add snippet</code> then uncomment the import above.
    </div>
  ),
});
