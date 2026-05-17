// Storybook 10.x CSF 3 format (typesafe Meta + StoryObj).
// Component Manifests build automatically from this story.
//
// NOTE: This story imports from the Vercel AI Elements install path. Run
//   npx ai-elements@latest add message
// in audit-dashboard/ first, then start storybook. Without the install,
// this story will fail at compile time — that's the intentional teaching
// signal: AI primitives ship as install-on-demand from the upstream registry.
//
// Status: stable.
import type { Meta, StoryObj } from "@storybook/nextjs";
// import { MessageBranch } from "@/components/ai-elements/message-branch";

const meta: Meta = {
  title: "T5/MessageBranch",
  // component: MessageBranch,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
    docs: {
      description: {
        component: "MessageBranch from Vercel AI Elements (Lumen-themed). Install: \`npx ai-elements@latest add message\`.",
      },
    },
  },
  tags: ["autodocs", "lumen-v0.13", "phase-5", "stable"],
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
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
      MessageBranch — install via <code>npx ai-elements@latest add message</code> then uncomment the import above.
    </div>
  ),
};
