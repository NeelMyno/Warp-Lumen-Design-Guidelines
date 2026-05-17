// Storybook 10.3 CSF Factory format (typesafe).
// Component Manifests build automatically from these stories.
import { defineMeta } from "@storybook/nextjs";
import { Sidebar } from "./sidebar";

const meta = defineMeta({
  title: "T2/Sidebar",
  component: Sidebar,
  parameters: {
    a11y: { config: { rules: [] } },
    layout: "centered",
  },
  tags: ["autodocs", "lumen-v0.13"],
});

export default meta;

export const Default = meta.story({
  args: {},
  render: (args) => <Sidebar {...args}>Sidebar</Sidebar>,
});

export const Collapsed = meta.story({
  args: {
    "collapsed": true
  },
  render: (args) => <Sidebar {...args}>Sidebar</Sidebar>,
});

