// Storybook 10.4 CSF Factory format (typesafe).
// Component Manifests build automatically from this story.
//
// NOTE: This story imports from the Vercel AI Elements install path. Run
//   npx ai-elements@latest add sandbox
// in audit-dashboard/ first, then start storybook. Without the install,
// this story will fail at compile time — that's the intentional teaching
// signal: AI primitives ship as install-on-demand from the upstream registry.
//
// Status: experimental.
import { defineMeta } from "@storybook/nextjs";
// import { Sandbox } from "@/components/ai-elements/sandbox";

const meta = defineMeta({
  title: "T5/Sandbox",
  // component: Sandbox,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
    docs: {
      description: {
        component: "Sandbox from Vercel AI Elements (Lumen-themed). Install: \`npx ai-elements@latest add sandbox\`.",
      },
    },
  },
  tags: ["autodocs", "lumen-v0.13", "phase-5", "experimental"],
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
      Sandbox — install via <code>npx ai-elements@latest add sandbox</code> then uncomment the import above.
    </div>
  ),
});
